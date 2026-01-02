/**
 * Difficulty System Configuration
 * Defines difficulty levels and their modifiers
 */

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'hardcore';

export interface DifficultyConfig {
  name: string;
  description: string;
  platformSize: number;      // Scale multiplier for platforms
  obstacleFrequency: number; // Multiplier for obstacle count
  enemyCount: number;        // Multiplier for enemy count
  playerHealth: number;      // 1 = normal, hardcore = 1 hit
  scoreMultiplier: number;   // Score bonus multiplier
  speedMultiplier: number;   // Player movement speed multiplier
  gravityMultiplier: number; // Gravity intensity multiplier
  timeLimit?: number;        // Optional time limit in seconds
  oneHitDeath: boolean;      // Dies on first hit
  showHints: boolean;        // Show level hints
}

export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    description: 'Perfect for beginners. Larger platforms, fewer obstacles',
    platformSize: 1.3,
    obstacleFrequency: 0.6,
    enemyCount: 0.5,
    playerHealth: 3,
    scoreMultiplier: 0.5,
    speedMultiplier: 0.9,
    gravityMultiplier: 0.85,
    showHints: true,
    oneHitDeath: false,
  },
  normal: {
    name: 'Normal',
    description: 'Balanced challenge. Recommended for most players',
    platformSize: 1,
    obstacleFrequency: 1,
    enemyCount: 1,
    playerHealth: 1,
    scoreMultiplier: 1,
    speedMultiplier: 1,
    gravityMultiplier: 1,
    showHints: false,
    oneHitDeath: false,
  },
  hard: {
    name: 'Hard',
    description: 'Challenging experience. Smaller platforms, more obstacles',
    platformSize: 0.85,
    obstacleFrequency: 1.5,
    enemyCount: 1.5,
    playerHealth: 1,
    scoreMultiplier: 1.5,
    speedMultiplier: 1.1,
    gravityMultiplier: 1.1,
    showHints: false,
    oneHitDeath: false,
  },
  hardcore: {
    name: 'Hardcore',
    description: 'Extreme difficulty. One mistake = game over',
    platformSize: 0.7,
    obstacleFrequency: 2,
    enemyCount: 2,
    playerHealth: 1,
    scoreMultiplier: 3,
    speedMultiplier: 1.2,
    gravityMultiplier: 1.2,
    timeLimit: 120,
    showHints: false,
    oneHitDeath: true,
  },
};

/**
 * Get difficulty configuration
 */
export function getDifficulty(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTIES[level];
}

/**
 * Apply difficulty modifiers to a value
 */
export function applyDifficultyModifier(
  baseValue: number,
  difficulty: DifficultyLevel,
  modifier: keyof Omit<DifficultyConfig, 'name' | 'description' | 'showHints' | 'oneHitDeath' | 'timeLimit'>
): number {
  const config = getDifficulty(difficulty);
  return baseValue * config[modifier];
}

/**
 * Get all available difficulties
 */
export function getAvailableDifficulties(): Array<{
  key: DifficultyLevel;
  config: DifficultyConfig;
}> {
  return Object.entries(DIFFICULTIES).map(([key, config]) => ({
    key: key as DifficultyLevel,
    config,
  }));
}
