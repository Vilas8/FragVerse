'use client';

import { useEffect, useState } from 'react';
import { getGlobalLeaderboard } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  user_id: string;
  total_xp: number;
  level: number;
  tournaments_won: number;
  rank_points: number;
  rank_position: number;
}

export default function GlobalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const result = await getGlobalLeaderboard(50);
      if (!result.error) {
        setLeaderboard(result.leaderboard || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🏆 Global Leaderboard
      </h2>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.user_id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                #{entry.rank_position}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Player {entry.user_id.slice(0, 8)}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">Level {entry.level}</Badge>
                  <Badge variant="outline">{entry.tournaments_won} Wins</Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Rank Points</p>
              <p className="text-xl font-bold text-purple-600">{entry.rank_points.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{entry.total_xp.toLocaleString()} XP</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
