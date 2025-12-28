'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GlobalLeaderboard from '@/components/engagement/GlobalLeaderboard';
import AchievementBadges from '@/components/engagement/AchievementBadges';
import FriendsPanel from '@/components/engagement/FriendsPanel';
import DailyChallenges from '@/components/engagement/DailyChallenges';
import MatchHistory from '@/components/engagement/MatchHistory';
import NotificationsCenter from '@/components/engagement/NotificationsCenter';
import ActivityFeed from '@/components/engagement/ActivityFeed';
import { Card } from '@/components/ui/card';

export default function EngagementDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <p className="text-gray-600">Please log in to access the engagement dashboard</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🎮 Engagement Hub
          </h1>
          <p className="text-gray-600">Track stats, earn achievements, and compete with players worldwide</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
            { id: 'achievements', label: '🏅 Achievements' },
            { id: 'social', label: '👥 Social' },
            { id: 'challenges', label: '📋 Challenges' },
            { id: 'activity', label: '✨ Activity' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NotificationsCenter />
              <MatchHistory userId={user.id} />
              <div className="lg:col-span-2">
                <ActivityFeed />
              </div>
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div>
              <GlobalLeaderboard />
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div>
              <AchievementBadges userId={user.id} />
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 gap-6">
              <FriendsPanel userId={user.id} />
              <ActivityFeed />
            </div>
          )}

          {/* CHALLENGES TAB */}
          {activeTab === 'challenges' && (
            <div>
              <DailyChallenges />
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div>
              <ActivityFeed />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">💡 How to Maximize Your Engagement</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✨ Complete daily challenges to earn XP and climb the leaderboard</li>
            <li>🏆 Unlock achievements by reaching milestones in tournaments and matches</li>
            <li>👥 Add friends and participate in social activities for bonus rewards</li>
            <li>📊 Track your match history to improve your win rate</li>
            <li>🎮 Join trending tournaments to compete and earn rank points</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
