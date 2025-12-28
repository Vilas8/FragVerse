'use client';

import { useEffect, useState } from 'react';
import { getMatchHistory, getMatchStats } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Match {
  id: string;
  tournament_id: string;
  home_player_id: string;
  away_player_id: string;
  winner_id: string;
  created_at: string;
}

interface MatchStats {
  total: number;
  wins: number;
  losses: number;
  winRate: string | number;
}

interface Props {
  userId: string;
}

export default function MatchHistory({ userId }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const matchesResult = await getMatchHistory(userId);
      const statsResult = await getMatchStats(userId);

      if (!matchesResult.error) setMatches(matchesResult.matches || []);
      if (!statsResult.error && statsResult.stats) {
        setStats({
          total: statsResult.stats.total,
          wins: statsResult.stats.wins,
          losses: statsResult.stats.losses,
          winRate: parseFloat(String(statsResult.stats.winRate)) || 0,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Card className="p-6"><div className="animate-pulse h-40 bg-gray-200 rounded" /></Card>;
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 py-8">No match history yet. Join a tournament to get started! 🎮</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Match History
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-semibold">TOTAL MATCHES</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600 font-semibold">WINS</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.wins}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-gray-600 font-semibold">LOSSES</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.losses}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-600 font-semibold">WIN RATE</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{typeof stats.winRate === 'number' ? stats.winRate.toFixed(1) : stats.winRate}%</p>
        </div>
      </div>

      {/* Recent Matches */}
      <h3 className="font-semibold text-gray-900 mb-4">Recent Matches</h3>
      {matches.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No completed matches yet</p>
      ) : (
        <div className="space-y-2">
          {matches.slice(0, 10).map(match => {
            const isWin = match.winner_id === userId;
            const opponent = isWin ? match.away_player_id : match.home_player_id;
            const date = new Date(match.created_at).toLocaleDateString();

            return (
              <div
                key={match.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isWin
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    vs {opponent.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
                <Badge
                  variant={isWin ? 'default' : 'secondary'}
                  className={isWin ? 'bg-green-600' : 'bg-red-600'}
                >
                  {isWin ? '✓ Win' : '✗ Loss'}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
