/**
 * Score Management System
 * Handles scoring, multipliers, and statistics
 */

export interface GameStats {
  score: number;
  deaths: number;
  time: number;
  level: { door: number; stage: number };
  enemiesDefeated: number;
  powerupsCollected: number;
  combo: number;
  bestTime: number;
  personalBest: number;
}

export class ScoreManager {
  private basePoints = 1000;
  private currentScore = 0;
  private currentCombo = 0;
  private stats: GameStats = {
    score: 0,
    deaths: 0,
    time: 0,
    level: { door: 1, stage: 1 },
    enemiesDefeated: 0,
    powerupsCollected: 0,
    combo: 0,
    bestTime: Infinity,
    personalBest: 0,
  };

  constructor() {
    this.loadStats();
  }

  /**
   * Calculate score for completing a level
   * Formula: basePoints * timeBonus * comboMultiplier - deathPenalty
   */
  calculateLevelScore(
    time: number,
    deaths: number,
    door: number,
    stage: number
  ): number {
    // Base points scaled by difficulty
    const difficultyMultiplier = 1 + (door - 1) * 0.2 + (stage - 1) * 0.1;
    const baseScore = this.basePoints * difficultyMultiplier;

    // Time bonus (max 50% bonus if completed in under 30 seconds)
    const timeBonus = Math.max(0.5, 2 - time / 60);

    // Combo multiplier
    const comboMultiplier = 1 + this.currentCombo * 0.1;

    // Death penalty (10 points per death)
    const deathPenalty = deaths * 10;

    const finalScore = Math.floor(
      baseScore * timeBonus * comboMultiplier - deathPenalty
    );

    return Math.max(0, finalScore);
  }

  /**
   * Complete a level and update score
   */
  completedLevel(
    time: number,
    deaths: number,
    door: number,
    stage: number,
    enemiesDefeated: number,
    powerupsCollected: number
  ): number {
    const levelScore = this.calculateLevelScore(time, deaths, door, stage);
    this.currentScore += levelScore;

    // Update stats
    this.stats.score = this.currentScore;
    this.stats.time += time;
    this.stats.deaths += deaths;
    this.stats.level = { door, stage };
    this.stats.enemiesDefeated += enemiesDefeated;
    this.stats.powerupsCollected += powerupsCollected;

    // Update best time if this is personal best
    if (levelScore > this.stats.personalBest) {
      this.stats.personalBest = levelScore;
    }

    if (time < this.stats.bestTime) {
      this.stats.bestTime = time;
    }

    // Increase combo on no deaths
    if (deaths === 0) {
      this.currentCombo++;
      this.stats.combo = this.currentCombo;
    } else {
      this.currentCombo = 0;
      this.stats.combo = 0;
    }

    this.saveStats();
    return levelScore;
  }

  /**
   * Reset combo on death (if not already counted)
   */
  resetCombo(): void {
    this.currentCombo = 0;
    this.stats.combo = 0;
  }

  /**
   * Get current stats
   */
  getStats(): GameStats {
    return { ...this.stats };
  }

  /**
   * Reset for new game
   */
  resetGame(): void {
    this.currentScore = 0;
    this.currentCombo = 0;
    this.stats = {
      score: 0,
      deaths: 0,
      time: 0,
      level: { door: 1, stage: 1 },
      enemiesDefeated: 0,
      powerupsCollected: 0,
      combo: 0,
      bestTime: this.stats.bestTime,
      personalBest: this.stats.personalBest,
    };
  }

  /**
   * Bonus points for achievements
   */
  addBonus(type: 'speedrun' | 'nodeath' | 'perfect', amount: number): void {
    this.currentScore += amount;
    this.stats.score = this.currentScore;
    this.saveStats();
  }

  /**
   * Save stats to localStorage
   */
  private saveStats(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('hellrunner_stats', JSON.stringify(this.stats));
      } catch (e) {
        console.warn('Failed to save stats:', e);
      }
    }
  }

  /**
   * Load stats from localStorage
   */
  private loadStats(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('hellrunner_stats');
        if (saved) {
          const loaded = JSON.parse(saved);
          // Preserve best times and personal bests
          this.stats.bestTime = loaded.bestTime || Infinity;
          this.stats.personalBest = loaded.personalBest || 0;
        }
      } catch (e) {
        console.warn('Failed to load stats:', e);
      }
    }
  }

  /**
   * Format score for display
   */
  formatScore(score: number): string {
    return score.toLocaleString('en-US', { minimumIntegerDigits: 7, useGrouping: false });
  }

  /**
   * Get combo text with multiplier info
   */
  getComboText(): string {
    if (this.currentCombo === 0) return 'No Combo';
    const multiplier = (1 + this.currentCombo * 0.1).toFixed(1);
    return `${this.currentCombo}x Combo (${multiplier}x)`;
  }
}
