/**
 * Achievement & Badge System
 * Tracks player accomplishments and unlocks badges
 */

export type AchievementId =
  | 'first_level'
  | 'speedrun_30'
  | 'speedrun_20'
  | 'speedrun_10'
  | 'no_death'
  | 'combo_5'
  | 'combo_10'
  | 'perfect_game'
  | 'all_doors'
  | 'hardcore_clear'
  | 'collect_10_powerups'
  | 'defeat_50_enemies';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlocked' | 'unlockedAt'>> = {
  first_level: {
    id: 'first_level',
    name: '🎮 First Steps',
    description: 'Complete your first level',
    icon: '🎮',
    points: 10,
  },
  speedrun_30: {
    id: 'speedrun_30',
    name: '⚡ Speed Demon',
    description: 'Complete a level in under 30 seconds',
    icon: '⚡',
    points: 50,
  },
  speedrun_20: {
    id: 'speedrun_20',
    name: '🚀 Speedrunner',
    description: 'Complete a level in under 20 seconds',
    icon: '🚀',
    points: 100,
  },
  speedrun_10: {
    id: 'speedrun_10',
    name: '💨 Flash',
    description: 'Complete a level in under 10 seconds',
    icon: '💨',
    points: 250,
  },
  no_death: {
    id: 'no_death',
    name: '🛡️ Flawless Victory',
    description: 'Complete a level without dying',
    icon: '🛡️',
    points: 75,
  },
  combo_5: {
    id: 'combo_5',
    name: '🔥 On Fire',
    description: 'Build a 5-level combo without dying',
    icon: '🔥',
    points: 100,
  },
  combo_10: {
    id: 'combo_10',
    name: '🌟 Unstoppable',
    description: 'Build a 10-level combo without dying',
    icon: '🌟',
    points: 250,
  },
  perfect_game: {
    id: 'perfect_game',
    name: '👑 Perfection',
    description: 'Complete all 8 doors without dying',
    icon: '👑',
    points: 500,
  },
  all_doors: {
    id: 'all_doors',
    name: '🏆 Completionist',
    description: 'Unlock all 8 doors',
    icon: '🏆',
    points: 200,
  },
  hardcore_clear: {
    id: 'hardcore_clear',
    name: '💀 Hardcore Master',
    description: 'Complete a level on Hardcore difficulty',
    icon: '💀',
    points: 300,
  },
  collect_10_powerups: {
    id: 'collect_10_powerups',
    name: '⭐ Powerup Collector',
    description: 'Collect 10 powerups',
    icon: '⭐',
    points: 50,
  },
  defeat_50_enemies: {
    id: 'defeat_50_enemies',
    name: '⚔️ Monster Slayer',
    description: 'Defeat 50 enemies',
    icon: '⚔️',
    points: 150,
  },
};

export class AchievementSystem {
  private achievements: Map<AchievementId, Achievement> = new Map();

  constructor() {
    this.initializeAchievements();
    this.loadAchievements();
  }

  /**
   * Initialize all achievements
   */
  private initializeAchievements(): void {
    Object.entries(ACHIEVEMENTS).forEach(([id, data]) => {
      this.achievements.set(id as AchievementId, {
        ...data,
        unlocked: false,
      });
    });
  }

  /**
   * Unlock an achievement
   */
  unlock(id: AchievementId): boolean {
    const achievement = this.achievements.get(id);
    if (!achievement) return false;

    if (achievement.unlocked) return false;

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    this.saveAchievements();
    return true;
  }

  /**
   * Check if achievement is unlocked
   */
  isUnlocked(id: AchievementId): boolean {
    return this.achievements.get(id)?.unlocked ?? false;
  }

  /**
   * Get achievement by ID
   */
  getAchievement(id: AchievementId): Achievement | undefined {
    return this.achievements.get(id);
  }

  /**
   * Get all achievements
   */
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter((a) => a.unlocked);
  }

  /**
   * Get total achievement points
   */
  getTotalPoints(): number {
    return this.getUnlockedAchievements().reduce((sum, a) => sum + a.points, 0);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    const unlocked = this.getUnlockedAchievements().length;
    const total = this.achievements.size;
    return Math.round((unlocked / total) * 100);
  }

  /**
   * Check and unlock common achievements
   */
  checkAchievements(stats: {
    time?: number;
    deaths?: number;
    door?: number;
    stage?: number;
    combo?: number;
    powerupsCollected?: number;
    enemiesDefeated?: number;
    isHardcore?: boolean;
  }): AchievementId[] {
    const unlocked: AchievementId[] = [];

    // Speedrun achievements
    if (stats.time !== undefined) {
      if (stats.time < 10 && this.unlock('speedrun_10')) unlocked.push('speedrun_10');
      else if (stats.time < 20 && this.unlock('speedrun_20')) unlocked.push('speedrun_20');
      else if (stats.time < 30 && this.unlock('speedrun_30')) unlocked.push('speedrun_30');
    }

    // No death achievement
    if (stats.deaths === 0 && this.unlock('no_death')) {
      unlocked.push('no_death');
    }

    // Combo achievements
    if (stats.combo !== undefined) {
      if (stats.combo >= 10 && this.unlock('combo_10')) unlocked.push('combo_10');
      else if (stats.combo >= 5 && this.unlock('combo_5')) unlocked.push('combo_5');
    }

    // Hardcore achievement
    if (stats.isHardcore && this.unlock('hardcore_clear')) {
      unlocked.push('hardcore_clear');
    }

    // Powerup collector
    if (
      stats.powerupsCollected !== undefined &&
      stats.powerupsCollected >= 10 &&
      this.unlock('collect_10_powerups')
    ) {
      unlocked.push('collect_10_powerups');
    }

    // Monster slayer
    if (
      stats.enemiesDefeated !== undefined &&
      stats.enemiesDefeated >= 50 &&
      this.unlock('defeat_50_enemies')
    ) {
      unlocked.push('defeat_50_enemies');
    }

    return unlocked;
  }

  /**
   * Save achievements to localStorage
   */
  private saveAchievements(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data = Array.from(this.achievements.entries()).map(([id, achievement]) => ({
          id,
          unlocked: achievement.unlocked,
          unlockedAt: achievement.unlockedAt,
        }));
        localStorage.setItem('hellrunner_achievements', JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to save achievements:', e);
      }
    }
  }

  /**
   * Load achievements from localStorage
   */
  private loadAchievements(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('hellrunner_achievements');
        if (saved) {
          const data = JSON.parse(saved);
          data.forEach((item: any) => {
            const achievement = this.achievements.get(item.id);
            if (achievement) {
              achievement.unlocked = item.unlocked;
              achievement.unlockedAt = item.unlockedAt;
            }
          });
        }
      } catch (e) {
        console.warn('Failed to load achievements:', e);
      }
    }
  }

  /**
   * Reset all achievements (dev only)
   */
  reset(): void {
    this.achievements.forEach((achievement) => {
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
    });
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('hellrunner_achievements');
    }
  }
}
