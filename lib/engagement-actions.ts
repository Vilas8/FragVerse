'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

// =============================================
// LEADERBOARD ACTIONS
// =============================================

export async function getGlobalLeaderboard(limit = 100) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_global_leaderboard', {
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching global leaderboard:', error);
    return { error: 'Failed to fetch leaderboard' };
  }

  return { leaderboard: data };
}

export async function getWeeklyLeaderboard(limit = 100) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_weekly_leaderboard', {
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching weekly leaderboard:', error);
    return { error: 'Failed to fetch weekly leaderboard' };
  }

  return { leaderboard: data };
}

export async function getGameSpecificLeaderboard(game: string, limit = 100) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('player_stats')
    .select('user_id, total_xp, level, tournaments_won, matches_won')
    .order('rank_points', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching game leaderboard:', error);
    return { error: 'Failed to fetch leaderboard' };
  }

  return { leaderboard: data };
}

// =============================================
// PLAYER STATS ACTIONS
// =============================================

export async function getPlayerStats(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching player stats:', error);
    return { error: 'Failed to fetch player stats' };
  }

  return { stats: data };
}

interface UpdateStatsInput {
  tournaments_won?: number;
  tournaments_joined?: number;
  matches_won?: number;
  matches_lost?: number;
  total_xp?: number;
  rank_points?: number;
}

export async function updatePlayerStats(
  userId: string,
  stats: UpdateStatsInput
) {
  const supabase = createClient();
  
  const { data: existingStats } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existingStats) {
    const { error } = await supabase
      .from('player_stats')
      .insert([{ user_id: userId, ...stats }]);

    if (error) {
      console.error('Error creating player stats:', error);
      return { error: 'Failed to create stats' };
    }
  } else {
    const updatedStats = { ...existingStats, ...stats, last_updated: new Date() };
    
    const { error } = await supabase
      .from('player_stats')
      .update(updatedStats)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating player stats:', error);
      return { error: 'Failed to update stats' };
    }
  }

  // Check achievements after stats update
  await checkAchievements(userId);

  revalidatePath('/profile');
  return { success: true };
}

// =============================================
// ACHIEVEMENTS ACTIONS
// =============================================

export async function getAllAchievements() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return { error: 'Failed to fetch achievements' };
  }

  return { achievements: data };
}

export async function getUserAchievements(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    return { error: 'Failed to fetch achievements' };
  }

  return { achievements: data };
}

export async function getAchievementProgress(userId: string) {
  const supabase = createClient();
  
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*');

  const { data: stats } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!allAchievements || !stats) {
    return { error: 'Failed to fetch achievement progress' };
  }

  const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);
  
  const achievements = allAchievements.map(achievement => {
    const unlocked = unlockedIds.has(achievement.id);
    let progress = 0;

    if (achievement.requirement_type === 'tournament_wins') {
      progress = (stats.tournaments_won / achievement.requirement_value) * 100;
    } else if (achievement.requirement_type === 'tournament_joins') {
      progress = (stats.tournaments_joined / achievement.requirement_value) * 100;
    } else if (achievement.requirement_type === 'match_wins') {
      progress = (stats.matches_won / achievement.requirement_value) * 100;
    } else if (achievement.requirement_type === 'friend_count') {
      progress = (stats.friends_count / achievement.requirement_value) * 100;
    }

    return {
      ...achievement,
      unlocked,
      progress: Math.min(progress, 100),
    };
  });

  return { achievements };
}

export async function checkAchievements(userId: string) {
  const supabase = createClient();
  
  try {
    await supabase.rpc('check_achievements', { p_user_id: userId });
    return { success: true };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { error: 'Failed to check achievements' };
  }
}

// =============================================
// FRIENDS ACTIONS
// =============================================

export async function sendFriendRequest(receiverId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { error } = await supabase
    .from('friend_requests')
    .insert([{
      sender_id: user.data.user.id,
      receiver_id: receiverId,
    }]);

  if (error) {
    console.error('Error sending friend request:', error);
    return { error: 'Failed to send request' };
  }

  return { success: true };
}

export async function acceptFriendRequest(requestId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { data: request, error: fetchError } = await supabase
    .from('friend_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchError || !request) {
    return { error: 'Request not found' };
  }

  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId);

  if (error) {
    console.error('Error accepting request:', error);
    return { error: 'Failed to accept request' };
  }

  // Create bidirectional friendship
  await supabase.rpc('create_friendship', {
    user1_id: request.sender_id,
    user2_id: request.receiver_id,
  });

  revalidatePath('/profile');
  return { success: true };
}

export async function rejectFriendRequest(requestId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);

  if (error) {
    console.error('Error rejecting request:', error);
    return { error: 'Failed to reject request' };
  }

  return { success: true };
}

export async function getFriends(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('friendships')
    .select('friend_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching friends:', error);
    return { error: 'Failed to fetch friends' };
  }

  return { friends: data };
}

export async function getFriendRequests() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { data, error } = await supabase
    .from('friend_requests')
    .select('*')
    .eq('receiver_id', user.data.user.id)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching friend requests:', error);
    return { error: 'Failed to fetch requests' };
  }

  return { requests: data };
}

export async function removeFriend(friendId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { error: error1 } = await supabase
    .from('friendships')
    .delete()
    .eq('user_id', user.data.user.id)
    .eq('friend_id', friendId);

  const { error: error2 } = await supabase
    .from('friendships')
    .delete()
    .eq('user_id', friendId)
    .eq('friend_id', user.data.user.id);

  if (error1 || error2) {
    console.error('Error removing friend:', error1 || error2);
    return { error: 'Failed to remove friend' };
  }

  revalidatePath('/profile');
  return { success: true };
}

// =============================================
// ACTIVITY FEED ACTIONS
// =============================================

export async function getActivityFeed(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching activity feed:', error);
    return { error: 'Failed to fetch activity' };
  }

  return { activities: data };
}

export async function getPublicActivityFeed() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching public activity:', error);
    return { error: 'Failed to fetch activity' };
  }

  return { activities: data };
}

type ActivityType = 'tournament_join' | 'tournament_win' | 'match_win' | 'achievement' | 'friend_add' | 'level_up';

interface ActivityMetadata {
  new_level?: number;
  [key: string]: unknown;
}

export async function createActivity(
  userId: string,
  activityType: ActivityType,
  relatedId?: string,
  metadata?: ActivityMetadata,
  isPublic = true
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('activity_feed')
    .insert([{
      user_id: userId,
      activity_type: activityType,
      related_id: relatedId,
      metadata,
      is_public: isPublic,
    }]);

  if (error) {
    console.error('Error creating activity:', error);
    return { error: 'Failed to create activity' };
  }

  return { success: true };
}

// =============================================
// DAILY CHALLENGES ACTIONS
// =============================================

export async function getDailyChallenges() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching challenges:', error);
    return { error: 'Failed to fetch challenges' };
  }

  return { challenges: data };
}

export async function getUserChallenges() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_challenges')
    .select('*, daily_challenges(*)')
    .eq('user_id', user.data.user.id)
    .eq('assigned_date', today);

  if (error) {
    console.error('Error fetching user challenges:', error);
    return { error: 'Failed to fetch challenges' };
  }

  return { challenges: data };
}

export async function assignDailyChallenges(userId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: challenges, error: fetchError } = await supabase
    .from('daily_challenges')
    .select('id')
    .eq('is_active', true);

  if (fetchError || !challenges) {
    return { error: 'Failed to fetch challenges' };
  }

  const { error } = await supabase
    .from('user_challenges')
    .insert(
      challenges.map(challenge => ({
        user_id: userId,
        challenge_id: challenge.id,
        assigned_date: today,
      }))
    );

  if (error) {
    console.error('Error assigning challenges:', error);
    return { error: 'Failed to assign challenges' };
  }

  return { success: true };
}

export async function updateChallengeProgress(
  challengeId: string,
  progress: number
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { error } = await supabase
    .from('user_challenges')
    .update({ progress })
    .eq('user_id', user.data.user.id)
    .eq('challenge_id', challengeId);

  if (error) {
    console.error('Error updating progress:', error);
    return { error: 'Failed to update progress' };
  }

  return { success: true };
}

export async function completeChallengeAndClaim(challengeId: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { data: challenge, error: fetchError } = await supabase
    .from('user_challenges')
    .select('*, daily_challenges(*)')
    .eq('user_id', user.data.user.id)
    .eq('challenge_id', challengeId)
    .single();

  if (fetchError || !challenge) {
    return { error: 'Challenge not found' };
  }

  const { error } = await supabase
    .from('user_challenges')
    .update({ completed: true, claimed: true, completed_at: new Date() })
    .eq('user_id', user.data.user.id)
    .eq('challenge_id', challengeId);

  if (error) {
    console.error('Error completing challenge:', error);
    return { error: 'Failed to complete challenge' };
  }

  // Award XP to player stats
  const xpReward = (challenge.daily_challenges as { xp_reward: number } | null)?.xp_reward || 0;
  if (xpReward > 0) {
    await updatePlayerStats(user.data.user.id, {
      total_xp: xpReward,
    });
  }

  return { success: true, reward: xpReward };
}

// =============================================
// MATCH HISTORY ACTIONS
// =============================================

export async function getMatchHistory(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('singleEliminationMatches')
    .select('*')
    .or(`home_player_id.eq.${userId},away_player_id.eq.${userId}`)
    .not('winner_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching match history:', error);
    return { error: 'Failed to fetch match history' };
  }

  return { matches: data };
}

export async function getMatchStats(userId: string) {
  const supabase = createClient();
  
  const { data: matches, error } = await supabase
    .from('singleEliminationMatches')
    .select('*')
    .or(`home_player_id.eq.${userId},away_player_id.eq.${userId}`)
    .not('winner_id', 'is', null);

  if (error) {
    console.error('Error fetching match stats:', error);
    return { error: 'Failed to fetch stats' };
  }

  if (!matches) {
    return { stats: { total: 0, wins: 0, losses: 0, winRate: 0 } };
  }

  const wins = matches.filter(m => m.winner_id === userId).length;
  const losses = matches.length - wins;
  const winRate = matches.length > 0 ? (wins / matches.length) * 100 : 0;

  return {
    stats: {
      total: matches.length,
      wins,
      losses,
      winRate: winRate.toFixed(1),
    },
  };
}

// =============================================
// TOURNAMENT DISCOVERY ACTIONS
// =============================================

export async function getTrendingTournaments(limit = 10) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('private', false)
    .eq('finished', false)
    .order('player_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending tournaments:', error);
    return { error: 'Failed to fetch tournaments' };
  }

  return { tournaments: data };
}

export async function getRecommendedTournaments() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  // Get tournaments similar to user's skill level
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('private', false)
    .eq('finished', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recommended tournaments:', error);
    return { error: 'Failed to fetch tournaments' };
  }

  return { tournaments: data };
}

// =============================================
// NOTIFICATION ACTIONS
// =============================================

export async function getNotifications() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.data.user.id)
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching notifications:', error);
    return { error: 'Failed to fetch notifications' };
  }

  return { notifications: data };
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return { error: 'Failed to mark as read' };
  }

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: 'Must be logged in' };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.data.user.id)
    .eq('read', false);

  if (error) {
    console.error('Error marking all as read:', error);
    return { error: 'Failed to mark all as read' };
  }

  return { success: true };
}
