'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  getPlayerStats,
  updatePlayerStats,
  getAchievementProgress,
  getFriends,
  getActivityFeed,
  getUserChallenges,
  getMatchHistory,
  getNotifications,
  checkAchievements,
  assignDailyChallenges,
} from '@/lib/engagement-actions';

interface UseEngagementReturn {
  stats: any;
  achievements: any[];
  friends: any[];
  activities: any[];
  challenges: any[];
  matches: any[];
  notifications: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStats: (stats: any) => Promise<void>;
  checkNewAchievements: () => Promise<void>;
}

/**
 * Hook for managing engagement data
 * Handles stats, achievements, friends, and more
 */
export function useEngagement(userId: string): UseEngagementReturn {
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, achRes, friendRes, actRes, chalRes, matchRes, notifRes] =
        await Promise.all([
          getPlayerStats(userId),
          getAchievementProgress(userId),
          getFriends(userId),
          getActivityFeed(userId),
          getUserChallenges(),
          getMatchHistory(userId),
          getNotifications(),
        ]);

      if (!statsRes.error) setStats(statsRes.stats);
      if (!achRes.error) setAchievements(achRes.achievements || []);
      if (!friendRes.error) setFriends(friendRes.friends || []);
      if (!actRes.error) setActivities(actRes.activities || []);
      if (!chalRes.error) setChallenges(chalRes.challenges || []);
      if (!matchRes.error) setMatches(matchRes.matches || []);
      if (!notifRes.error) setNotifications(notifRes.notifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateStats = useCallback(
    async (newStats: any) => {
      const result = await updatePlayerStats(userId, newStats);
      if (!result.error) {
        await refetch();
      }
    },
    [userId, refetch]
  );

  const checkNewAchievements = useCallback(async () => {
    await checkAchievements(userId);
    await refetch();
  }, [userId, refetch]);

  // Subscribe to realtime updates
  useEffect(() => {
    refetch();

    // Subscribe to player_stats changes
    const subscription = supabase
      .channel('player_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_stats',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, refetch, supabase]);

  return {
    stats,
    achievements,
    friends,
    activities,
    challenges,
    matches,
    notifications,
    loading,
    error,
    refetch,
    updateStats,
    checkNewAchievements,
  };
}
