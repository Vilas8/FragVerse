'use client';

import { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: string;
  message: string;
  priority: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    achievement_unlocked: '🏅',
    friend_request: '👥',
    tournament_invite: '🏆',
    match_result: '⚔️',
    level_up: '⭐',
    challenge_complete: '✅',
  };
  return icons[type] || '🔔';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-100 border-red-200',
    normal: 'bg-blue-100 border-blue-200',
    low: 'bg-gray-100 border-gray-200',
  };
  return colors[priority] || 'bg-gray-100 border-gray-200';
};

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await getNotifications();
      if (!result.error) {
        setNotifications(result.notifications || []);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    setNotifications(
      notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔔 Notifications {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">{unreadCount}</Badge>
          )}
        </h2>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No notifications yet. Stay tuned! 👀</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                notification.read
                  ? 'bg-gray-50 border-gray-200'
                  : getPriorityColor(notification.priority)
              }`}
            >
              <span className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
