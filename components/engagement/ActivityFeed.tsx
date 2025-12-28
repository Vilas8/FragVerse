'use client';

import { useEffect, useState } from 'react';
import { getPublicActivityFeed } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityMetadata {
  new_level?: number;
  [key: string]: unknown;
}

interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  metadata?: ActivityMetadata;
  created_at: string;
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    tournament_join: '🎮',
    tournament_win: '🏆',
    match_win: '⚔️',
    achievement: '🏅',
    friend_add: '👥',
    level_up: '⭐',
  };
  return icons[type] || '✨';
};

const getActivityText = (type: string, metadata?: ActivityMetadata) => {
  const texts: Record<string, string> = {
    tournament_join: 'joined a tournament',
    tournament_win: 'won a tournament',
    match_win: 'won a match',
    achievement: `unlocked an achievement`,
    friend_add: 'made a new friend',
    level_up: `reached level ${metadata?.new_level || 'X'}`,
  };
  return texts[type] || 'did something awesome';
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const result = await getPublicActivityFeed();
      if (!result.error) {
        setActivities(result.activities || []);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3 animate-pulse">
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
        ✨ Community Feed
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activities. Be the first to make a move! 🚀</p>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl flex-shrink-0">
                {getActivityIcon(activity.activity_type)}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  <span className="text-blue-600 font-semibold">
                    {activity.user_id.slice(0, 8)}...
                  </span>
                  {' '}
                  {getActivityText(activity.activity_type, activity.metadata)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant="secondary">
                {activity.activity_type.replace(/_/g, ' ')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
