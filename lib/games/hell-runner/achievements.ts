// Hell Runner Achievements Definition

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'speedrun' | 'challenge' | 'special';
  requirementType: 'doors_completed' | 'stage_completions' | 'time_based' | 'death_based' | 'custom';
  requirementValue: number;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const HELL_RUNNER_ACHIEVEMENTS: Achievement[] = [
  // MILESTONE ACHIEVEMENTS
  {
    id: 'first_door',
    name: 'First Step',
    description: 'Complete Door 1 (Tutorial)',
    icon: '🚪',
    category: 'milestone',
    requirementType: 'doors_completed',
    requirementValue: 1,
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'door_3_complete',
    name: 'Disappearing Act',
    description: 'Complete Door 3 (Disappearing Platforms)',
    icon: '👻',
    category: 'milestone',
    requirementType: 'doors_completed',
    requirementValue: 3,
    xpReward: 250,
    rarity: 'rare',
  },
  {
    id: 'door_5_complete',
    name: 'Gravity Mastery',
    description: 'Complete Door 5 (Gravity & Control Chaos)',
    icon: '⬆️',
    category: 'milestone',
    requirementType: 'doors_completed',
    requirementValue: 5,
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'door_8_complete',
    name: 'Mega Chaos Conqueror',
    description: 'Complete Door 8 (Ultimate Challenge)',
    icon: '💥',
    category: 'milestone',
    requirementType: 'doors_completed',
    requirementValue: 8,
    xpReward: 1000,
    rarity: 'legendary',
  },

  // SPEEDRUN ACHIEVEMENTS
  {
    id: 'speedrun_door_1',
    name: 'Quick Learner',
    description: 'Complete Door 1 in under 30 seconds',
    icon: '⚡',
    category: 'speedrun',
    requirementType: 'time_based',
    requirementValue: 30,
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'speedrun_door_3',
    name: 'Timeless Platformer',
    description: 'Complete Door 3 in under 60 seconds',
    icon: '🏃',
    category: 'speedrun',
    requirementType: 'time_based',
    requirementValue: 60,
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'speedrun_door_5',
    name: 'Gravity Speedster',
    description: 'Complete Door 5 in under 90 seconds',
    icon: '🚀',
    category: 'speedrun',
    requirementType: 'time_based',
    requirementValue: 90,
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'speedrun_all_doors',
    name: 'Time Master',
    description: 'Complete all doors with average time < 60s per door',
    icon: '⏱️',
    category: 'speedrun',
    requirementType: 'time_based',
    requirementValue: 60,
    xpReward: 2000,
    rarity: 'legendary',
  },

  // CHALLENGE ACHIEVEMENTS
  {
    id: 'deathless_door_1',
    name: 'Flawless Victory',
    description: 'Complete Door 1 without dying',
    icon: '😇',
    category: 'challenge',
    requirementType: 'death_based',
    requirementValue: 0,
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'deathless_door_3',
    name: 'Platform Perfect',
    description: 'Complete Door 3 without dying',
    icon: '🎯',
    category: 'challenge',
    requirementType: 'death_based',
    requirementValue: 0,
    xpReward: 400,
    rarity: 'epic',
  },
  {
    id: 'deathless_all_doors',
    name: 'Immortal',
    description: 'Complete all doors without dying (ultimate challenge)',
    icon: '👑',
    category: 'challenge',
    requirementType: 'death_based',
    requirementValue: 0,
    xpReward: 5000,
    rarity: 'legendary',
  },
  {
    id: 'hundred_deaths',
    name: 'Never Give Up',
    description: 'Accumulate 100 deaths across all levels',
    icon: '💀',
    category: 'challenge',
    requirementType: 'custom',
    requirementValue: 100,
    xpReward: 300,
    rarity: 'common',
  },
  {
    id: 'thousand_deaths',
    name: 'Perseverance',
    description: 'Accumulate 1000 deaths - respect the grind',
    icon: '💪',
    category: 'challenge',
    requirementType: 'custom',
    requirementValue: 1000,
    xpReward: 1000,
    rarity: 'epic',
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'all_stages_door_1',
    name: 'Tutorial Master',
    description: 'Complete all 5 stages of Door 1',
    icon: '📚',
    category: 'special',
    requirementType: 'stage_completions',
    requirementValue: 5,
    xpReward: 150,
    rarity: 'common',
  },
  {
    id: 'all_doors_all_stages',
    name: 'Hell Runner Legend',
    description: 'Complete all doors and all stages (40 levels total)',
    icon: '🏆',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 40,
    xpReward: 3000,
    rarity: 'legendary',
  },
  {
    id: 'first_10k_xp',
    name: 'XP Collector',
    description: 'Earn 10,000 XP',
    icon: '⭐',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 10000,
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'leaderboard_top_10',
    name: 'Top 10 Player',
    description: 'Reach top 10 on any level leaderboard',
    icon: '🥈',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 10,
    xpReward: 750,
    rarity: 'rare',
  },
  {
    id: 'leaderboard_rank_1',
    name: 'Champion',
    description: 'Achieve rank #1 on any level leaderboard',
    icon: '🥇',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 1,
    xpReward: 2000,
    rarity: 'legendary',
  },
  {
    id: 'secret_key_1',
    name: 'Key Finder',
    description: 'Find 1 secret purple key',
    icon: '🔑',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 1,
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'secret_key_all',
    name: 'Vault Opener',
    description: 'Find all 10 secret purple keys',
    icon: '🔐',
    category: 'special',
    requirementType: 'custom',
    requirementValue: 10,
    xpReward: 2500,
    rarity: 'legendary',
  },
];

// Helper functions
export function getAchievementById(id: string): Achievement | undefined {
  return HELL_RUNNER_ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAchievementsByCategory(
  category: Achievement['category']
): Achievement[] {
  return HELL_RUNNER_ACHIEVEMENTS.filter((a) => a.category === category);
}

export function getAchievementsByRarity(
  rarity: Achievement['rarity']
): Achievement[] {
  return HELL_RUNNER_ACHIEVEMENTS.filter((a) => a.rarity === rarity);
}

export function getTotalXpAvailable(): number {
  return HELL_RUNNER_ACHIEVEMENTS.reduce((sum, a) => sum + a.xpReward, 0);
}

export function getAchievementProgress(
  unlockedAchievements: string[]
): { unlockedCount: number; totalCount: number; percentage: number } {
  const unlockedCount = unlockedAchievements.length;
  const totalCount = HELL_RUNNER_ACHIEVEMENTS.length;
  const percentage = (unlockedCount / totalCount) * 100;

  return { unlockedCount, totalCount, percentage };
}
