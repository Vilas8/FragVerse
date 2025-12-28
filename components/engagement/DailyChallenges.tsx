'use client';

import { useEffect, useState } from 'react';
import { getUserChallenges, completeChallengeAndClaim } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Challenge {
  id: string;
  name: string;
  description: string;
  challenge_type: string;
  requirement_value: number;
  xp_reward: number;
  coin_reward: number;
  progress?: number;
  completed?: boolean;
  claimed?: boolean;
}

const getChallengeIcon = (type: string) => {
  const icons: Record<string, string> = {
    play_matches: '🎮',
    win_matches: '⚔️',
    join_tournament: '🏆',
    social_interaction: '👥',
  };
  return icons[type] || '🎯';
};

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const result = await getUserChallenges();
      if (!result.error) {
        setChallenges(result.challenges || []);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, []);

  const handleClaim = async (challengeId: string) => {
    const result = await completeChallengeAndClaim(challengeId);
    if (!result.error) {
      setChallenges(
        challenges.map(c =>
          c.id === challengeId ? { ...c, claimed: true } : c
        )
      );
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const completedCount = challenges.filter(c => c.completed).length;
  const totalRewards = challenges
    .filter(c => c.completed)
    .reduce((acc, c) => acc + c.xp_reward, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📋 Daily Challenges
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Completed Today</p>
          <p className="text-2xl font-bold text-blue-600">{completedCount}/{challenges.length}</p>
        </div>
      </div>

      {totalRewards > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-semibold">✨ Total Rewards Today: {totalRewards} XP</p>
        </div>
      )}

      <div className="space-y-4">
        {challenges.map(challenge => {
          const progressPercent = ((challenge.progress || 0) / challenge.requirement_value) * 100;
          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                challenge.completed
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{getChallengeIcon(challenge.challenge_type)}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{challenge.name}</h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {challenge.progress || 0}/{challenge.requirement_value}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{challenge.xp_reward} XP</Badge>
                    <Badge variant="outline">{challenge.coin_reward} Coins</Badge>
                  </div>
                  {challenge.completed ? (
                    <Button
                      size="sm"
                      onClick={() => handleClaim(challenge.id)}
                      disabled={challenge.claimed}
                      className={challenge.claimed ? 'opacity-50' : 'bg-green-600 hover:bg-green-700'}
                    >
                      {challenge.claimed ? '✓ Claimed' : 'Claim'}
                    </Button>
                  ) : (
                    <p className="text-xs text-gray-500">In Progress</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
