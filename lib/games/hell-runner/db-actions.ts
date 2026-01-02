'use server';

import { createClient } from '@/utils/supabase/server';

// ============ PROGRESS TRACKING ============

export async function saveGameProgress(
  userId: string,
  door: number,
  stage: number,
  deaths: number,
  time: number
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('hell_runner_progress')
      .upsert(
        {
          user_id: userId,
          current_door: door,
          current_stage: stage,
          total_deaths: deaths,
          best_time: time,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error saving game progress:', error);
    return { error: 'Failed to save progress', success: false };
  }
}

export async function getGameProgress(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('hell_runner_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Return default progress if not found
    if (!data) {
      return {
        data: {
          user_id: userId,
          current_door: 1,
          current_stage: 1,
          total_deaths: 0,
          best_time: null,
          doors_completed: [],
          stages_completed: {},
          secret_keys_found: 0,
        },
        success: true,
      };
    }

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching game progress:', error);
    return { error: 'Failed to fetch progress', success: false };
  }
}

// ============ LEADERBOARD ============

export async function saveLeaderboardEntry(
  userId: string,
  door: number,
  stage: number,
  time: number,
  deaths: number
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('hell_runner_leaderboard')
      .insert({
        user_id: userId,
        door,
        stage,
        time_seconds: time,
        death_count: deaths,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
    return { error: 'Failed to save leaderboard', success: false };
  }
}

export async function getLeaderboard(
  door: number,
  stage: number,
  limit = 10
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('hell_runner_leaderboard')
      .select('*, user_id')
      .eq('door', door)
      .eq('stage', stage)
      .order('time_seconds', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { error: 'Failed to fetch leaderboard', success: false };
  }
}

export async function getGlobalLeaderboard(limit = 50) {
  const supabase = createClient();

  try {
    // Get best times across all doors and stages
    const { data, error } = await supabase
      .from('hell_runner_leaderboard')
      .select('*')
      .order('time_seconds', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return { error: 'Failed to fetch leaderboard', success: false };
  }
}

export async function getUserLeaderboardRank(
  userId: string,
  door: number,
  stage: number
) {
  const supabase = createClient();

  try {
    // Get user's best time
    const { data: userRecord, error: userError } = await supabase
      .from('hell_runner_leaderboard')
      .select('time_seconds')
      .eq('user_id', userId)
      .eq('door', door)
      .eq('stage', stage)
      .order('time_seconds', { ascending: true })
      .limit(1)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;

    if (!userRecord) {
      return { data: null, success: true };
    }

    // Count how many records are faster
    const { count, error: countError } = await supabase
      .from('hell_runner_leaderboard')
      .select('*', { count: 'exact', head: true })
      .eq('door', door)
      .eq('stage', stage)
      .lt('time_seconds', userRecord.time_seconds);

    if (countError) throw countError;

    return {
      data: {
        rank: (count || 0) + 1,
        time: userRecord.time_seconds,
      },
      success: true,
    };
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return { error: 'Failed to fetch rank', success: false };
  }
}

// ============ ACHIEVEMENTS ============

export async function unlockAchievement(
  userId: string,
  achievementId: string
) {
  const supabase = createClient();

  try {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) {
      return { data: existing, success: true, alreadyUnlocked: true };
    }

    // Unlock achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { data, success: true, alreadyUnlocked: false };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { error: 'Failed to unlock achievement', success: false };
  }
}

export async function getUserAchievements(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return { error: 'Failed to fetch achievements', success: false };
  }
}

export async function getAchievements() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category');

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { error: 'Failed to fetch achievements', success: false };
  }
}

// ============ STATS & TRACKING ============

export async function updatePlayerStats(
  userId: string,
  updates: {
    total_xp?: number;
    level?: number;
    matches_won?: number;
    matches_lost?: number;
    current_streak?: number;
    achievements_count?: number;
  }
) {
  const supabase = createClient();

  try {
    // Prepare updates without trying to set computed fields
    const updates_to_save = {
      ...updates,
      last_updated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('player_stats')
      .upsert(
        {
          user_id: userId,
          ...updates_to_save,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error updating player stats:', error);
    return { error: 'Failed to update stats', success: false };
  }
}

export async function getPlayerStats(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return { error: 'Failed to fetch stats', success: false };
  }
}

// ============ NOTIFICATIONS ============

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  priority: 'low' | 'normal' | 'high' = 'normal',
  actionUrl?: string
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        priority,
        action_url: actionUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { error: 'Failed to create notification', success: false };
  }
}

export async function getUserNotifications(userId: string, unreadOnly = false) {
  const supabase = createClient();

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return { data, success: true };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { error: 'Failed to fetch notifications', success: false };
  }
}
