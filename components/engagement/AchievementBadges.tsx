'use client';

import { useEffect, useState } from 'react';
import { getAchievementProgress } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlocked: boolean;
  progress: number;
  requirement_value: number;
}

interface Props {
  userId: string;
}

export default function AchievementBadges({ userId }: Props) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      const result = await getAchievementProgress(userId);
      if (!result.error) {
        setAchievements(result.achievements || []);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [userId]);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const rarityColors = {
    common: 'bg-gray-100 border-gray-300',
    rare: 'bg-blue-100 border-blue-300',
    epic: 'bg-purple-100 border-purple-300',
    legendary: 'bg-yellow-100 border-yellow-300',
  };

  const rarityTextColors = {
    common: 'text-gray-700',
    rare: 'text-blue-700',
    epic: 'text-purple-700',
    legendary: 'text-yellow-700',
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🏅 Achievements {unlockedCount}/{achievements.length}
        </h2>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(achievement => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? rarityColors[achievement.rarity as keyof typeof rarityColors]
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${
                    achievement.unlocked
                      ? rarityTextColors[achievement.rarity as keyof typeof rarityTextColors]
                      : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={achievement.unlocked ? '' : 'opacity-50'}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(achievement.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {achievement.unlocked && (
                  <p className="text-xs text-green-600 mt-2 font-semibold">✓ Unlocked</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
