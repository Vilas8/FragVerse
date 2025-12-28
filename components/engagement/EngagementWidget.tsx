'use client';

import { useEngagement } from '@/hooks/useEngagement';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRankTier, getProgressToNextLevel, formatStatNumber } from '@/utils/engagement-helpers';

interface Props {
  userId: string;
  compact?: boolean;
}

/**
 * Quick engagement widget to show on profile or dashboard
 * Shows key stats, rank, and next achievements
 */
export default function EngagementWidget({ userId, compact = false }: Props) {
  const { stats, achievements, loading, error } = useEngagement(userId);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse h-32 bg-gray-200 rounded" />
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-4">
        <p className="text-sm text-gray-500">Unable to load stats</p>
      </Card>
    );
  }

  const nextLevelProgress = getProgressToNextLevel(stats.total_xp, stats.level);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const rankTier = getRankTier(stats.rank_points);

  if (compact) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-600 font-semibold">LEVEL</p>
            <p className="text-2xl font-bold text-blue-600">{stats.level}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">RANK</p>
            <p className="text-xl font-bold text-purple-600">{rankTier.split(' ')[0]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">ACHIEVEMENTS</p>
            <p className="text-2xl font-bold text-green-600">{unlockedAchievements}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">WINS</p>
            <p className="text-2xl font-bold text-orange-600">{stats.tournaments_won}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Stats</h3>
          <p className="text-sm text-gray-600 mt-1">{rankTier}</p>
        </div>
        <Badge variant="secondary" className="text-lg py-1 px-3">
          {formatStatNumber(stats.rank_points)} pts
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-semibold">LEVEL</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.level}</p>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">
              {nextLevelProgress.toFixed(0)}% to Level {stats.level + 1}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${nextLevelProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-600 font-semibold">XP TOTAL</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {formatStatNumber(stats.total_xp)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 bg-green-50 rounded border border-green-200">
          <p className="text-xs text-gray-600">Tournaments Won</p>
          <p className="text-xl font-bold text-green-600 mt-1">
            {stats.tournaments_won}
          </p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
          <p className="text-xs text-gray-600">Matches Won</p>
          <p className="text-xl font-bold text-orange-600 mt-1">
            {stats.matches_won}
          </p>
        </div>
        <div className="text-center p-2 bg-indigo-50 rounded border border-indigo-200">
          <p className="text-xs text-gray-600">Achievements</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">
            {unlockedAchievements}
          </p>
        </div>
      </div>
    </Card>
  );
}
