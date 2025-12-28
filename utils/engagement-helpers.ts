/**
 * Engagement Feature Helper Utilities
 */

// XP and Leveling
export function calculateXpForNextLevel(currentLevel: number): number {
  return currentLevel * 100 + (currentLevel - 1) * 50;
}

export function getProgressToNextLevel(
  currentXp: number,
  currentLevel: number
): number {
  const xpForCurrentLevel = calculateXpForNextLevel(currentLevel);
  const xpForNextLevel = calculateXpForNextLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
}

// Ranking
export function getRankTier(rankPoints: number): string {
  if (rankPoints >= 5000) return '💎 Legend';
  if (rankPoints >= 4000) return '⭐ Epic';
  if (rankPoints >= 3000) return '🎖️ Rare';
  if (rankPoints >= 2000) return '📊 Advanced';
  if (rankPoints >= 1000) return '🎮 Intermediate';
  return '📈 Beginner';
}

export function getRankColor(rankPoints: number): string {
  if (rankPoints >= 5000) return 'from-purple-600 to-pink-600';
  if (rankPoints >= 4000) return 'from-blue-600 to-purple-600';
  if (rankPoints >= 3000) return 'from-cyan-500 to-blue-500';
  if (rankPoints >= 2000) return 'from-green-500 to-cyan-500';
  if (rankPoints >= 1000) return 'from-yellow-500 to-orange-500';
  return 'from-gray-500 to-slate-500';
}

// Win Rate
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : (wins / total) * 100;
}

export function getWinRateLabel(winRate: number): string {
  if (winRate >= 75) return '🔥 Exceptional';
  if (winRate >= 60) return '💪 Excellent';
  if (winRate >= 50) return '📈 Good';
  if (winRate >= 40) return '📊 Average';
  return '📉 Needs Improvement';
}

// Achievements
export function getAchievementRarityColor(
  rarity: string
): { bg: string; text: string; border: string } {
  const colors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    legendary: {
      bg: 'from-yellow-100 to-orange-100',
      text: 'text-yellow-900',
      border: 'border-yellow-300',
    },
    epic: {
      bg: 'from-purple-100 to-pink-100',
      text: 'text-purple-900',
      border: 'border-purple-300',
    },
    rare: {
      bg: 'from-blue-100 to-cyan-100',
      text: 'text-blue-900',
      border: 'border-blue-300',
    },
    common: {
      bg: 'from-gray-100 to-slate-100',
      text: 'text-gray-900',
      border: 'border-gray-300',
    },
  };

  return colors[rarity] || colors.common;
}

export function getAchievementProgressPercent(
  current: number,
  required: number
): number {
  return Math.min(100, (current / required) * 100);
}

// Challenge Rewards
export function getTotalDailyRewards(
  challenges: Array<{ xp_reward: number; coin_reward: number }>
): { xp: number; coins: number } {
  return challenges.reduce(
    (acc, challenge) => ({
      xp: acc.xp + challenge.xp_reward,
      coins: acc.coins + challenge.coin_reward,
    }),
    { xp: 0, coins: 0 }
  );
}

// Time Formatting
export function getTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
}

// Stats Comparison
export function getStatsComparison(
  userStats: any,
  leaderboardPosition: number,
  totalPlayers: number
): { percentile: number; comparison: string } {
  const percentile = ((totalPlayers - leaderboardPosition) / totalPlayers) * 100;

  let comparison = 'Average';
  if (percentile >= 90) comparison = 'Top 10%';
  else if (percentile >= 75) comparison = 'Top 25%';
  else if (percentile >= 50) comparison = 'Top 50%';

  return { percentile, comparison };
}

// Streak Formatting
export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '❌';
  if (streak === 1) return '🔥';
  if (streak <= 3) return '🔥🔥';
  if (streak <= 5) return '🔥🔥🔥';
  return '🔥🔥🔥+';
}

// Notification Priority
export function getNotificationPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-100 border-red-300 text-red-900',
    normal: 'bg-blue-100 border-blue-300 text-blue-900',
    low: 'bg-gray-100 border-gray-300 text-gray-900',
  };
  return colors[priority] || colors.normal;
}

// Stats Format
export function formatStatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Predicting next achievement
export function getNextAchievementMilestone(
  achievements: any[],
  stats: any
): any | null {
  const locked = achievements.filter(a => !a.unlocked);
  if (locked.length === 0) return null;

  return locked.reduce((closest, achievement) => {
    const progress =
      (achievement.progress / achievement.requirement_value) * 100;
    const closestProgress =
      (closest.progress / closest.requirement_value) * 100;
    return progress > closestProgress ? achievement : closest;
  });
}
