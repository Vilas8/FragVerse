'use client';

import { useEffect, useState } from 'react';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, removeFriend } from '@/lib/engagement-actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Friend {
  friend_id: string;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  created_at: string;
}

interface Props {
  userId: string;
}

export default function FriendsPanel({ userId }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const friendsResult = await getFriends(userId);
      const requestsResult = await getFriendRequests();

      if (!friendsResult.error) setFriends(friendsResult.friends || []);
      if (!requestsResult.error) setRequests(requestsResult.requests || []);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleAccept = async (requestId: string) => {
    await acceptFriendRequest(requestId);
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleRemove = async (friendId: string) => {
    await removeFriend(friendId);
    setFriends(friends.filter(f => f.friend_id !== friendId));
  };

  if (loading) {
    return <Card className="p-6"><div className="animate-pulse h-40 bg-gray-200 rounded" /></Card>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        👥 Friends {friends.length}
      </h2>

      {/* Friend Requests */}
      {requests.length > 0 && (
        <div className="mb-6 pb-6 border-b">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            📬 Pending Requests ({requests.length})
          </h3>
          <div className="space-y-2">
            {requests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-700">
                  {request.sender_id.slice(0, 8)}...
                </span>
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Accept
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-2">
        {friends.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No friends yet. Start connecting! 🤝</p>
        ) : (
          friends.map(friend => (
            <div
              key={friend.friend_id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {friend.friend_id.slice(0, 1).toUpperCase()}
                </div>
                <p className="font-medium text-gray-900">
                  {friend.friend_id.slice(0, 8)}...
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRemove(friend.friend_id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
