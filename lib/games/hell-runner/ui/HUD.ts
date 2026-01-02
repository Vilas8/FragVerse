/**
 * Modern HUD System
 * Displays real-time game information with enhanced visuals
 */

import * as Phaser from 'phaser';
import { THEME } from '../config/colors';
import { ScoreManager } from './ScoreManager';

export class HUD {
  private scene: Phaser.Scene;
  private scoreManager: ScoreManager;

  // HUD Elements
  private scoreText?: Phaser.GameObjects.Text;
  private timerText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;
  private deathsText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private powerupText?: Phaser.GameObjects.Text;
  private progressBar?: Phaser.GameObjects.Graphics;
  private hudBackground?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, scoreManager: ScoreManager) {
    this.scene = scene;
    this.scoreManager = scoreManager;
  }

  /**
   * Create all HUD elements
   */
  create(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Create HUD background panel
    this.createHUDBackground(width, height);

    // Top-left: Deaths counter
    this.deathsText = this.scene.add.text(20, 20, 'Deaths: 0', {
      fontSize: '18px',
      color: THEME.danger,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.deathsText.setScrollFactor(0);

    // Top-center: Level indicator
    this.levelText = this.scene.add.text(width / 2, 20, 'Door 1 - Stage 1', {
      fontSize: '18px',
      color: THEME.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setScrollFactor(0);

    // Top-right: Timer
    this.timerText = this.scene.add.text(width - 20, 20, 'Time: 0.0s', {
      fontSize: '18px',
      color: THEME.green,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'right',
    });
    this.timerText.setOrigin(1, 0);
    this.timerText.setScrollFactor(0);

    // Bottom-left: Score
    this.scoreText = this.scene.add.text(20, height - 60, 'Score: 0000000', {
      fontSize: '16px',
      color: THEME.cyan,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.scoreText.setScrollFactor(0);

    // Bottom-center-left: Combo
    this.comboText = this.scene.add.text(20, height - 30, 'No Combo', {
      fontSize: '14px',
      color: THEME.orange,
      fontFamily: 'monospace',
    });
    this.comboText.setScrollFactor(0);

    // Bottom-center: Powerups
    this.powerupText = this.scene.add.text(width / 2, height - 60, 'Powerups: None', {
      fontSize: '14px',
      color: THEME.green,
      fontFamily: 'monospace',
      align: 'center',
    });
    this.powerupText.setOrigin(0.5, 0);
    this.powerupText.setScrollFactor(0);
  }

  /**
   * Create HUD background with glassmorphism effect
   */
  private createHUDBackground(width: number, height: number): void {
    this.hudBackground = this.scene.add.graphics();

    // Top panel
    this.hudBackground.fillStyle(0x1a0f2e, 0.7);
    this.hudBackground.fillRect(0, 0, width, 70);
    this.hudBackground.lineStyle(2, 0x00d9ff, 0.3);
    this.hudBackground.strokeRect(0, 0, width, 70);

    // Bottom panel
    this.hudBackground.fillStyle(0x1a0f2e, 0.7);
    this.hudBackground.fillRect(0, height - 100, width, 100);
    this.hudBackground.lineStyle(2, 0x00d9ff, 0.3);
    this.hudBackground.strokeRect(0, height - 100, width, 100);

    this.hudBackground.setScrollFactor(0);
    this.hudBackground.setDepth(-1);
  }

  /**
   * Update HUD with current game state
   */
  update(
    deaths: number,
    time: number,
    door: number,
    stage: number,
    score: number,
    combo: string,
    powerups: string,
    progress?: { current: number; total: number }
  ): void {
    if (this.deathsText) {
      this.deathsText.setText(`Deaths: ${deaths}`);
      // Color change based on death count
      const deathColor = deaths > 5 ? '#FF0000' : deaths > 2 ? '#FF6B6B' : THEME.danger;
      this.deathsText.setColor(deathColor);
    }

    if (this.timerText) {
      this.timerText.setText(`Time: ${time.toFixed(1)}s`);
    }

    if (this.levelText) {
      this.levelText.setText(`Door ${door} - Stage ${stage}`);
    }

    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.scoreManager.formatScore(score)}`);
    }

    if (this.comboText) {
      this.comboText.setText(combo);
      // Pulse effect on high combos
      if (combo.includes('x')) {
        const comboNum = parseInt(combo);
        const alpha = 0.8 + Math.sin(Date.now() / 200) * 0.2;
        this.comboText.setAlpha(alpha);
      }
    }

    if (this.powerupText) {
      this.powerupText.setText(powerups);
    }
  }

  /**
   * Show level complete overlay
   */
  showLevelComplete(
    levelScore: number,
    totalScore: number,
    isPersonalBest: boolean
  ): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Semi-transparent overlay
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, width, height);
    overlay.setScrollFactor(0);
    overlay.setDepth(100);

    // Complete text
    const completeText = this.scene.add.text(
      width / 2,
      height / 2 - 80,
      'LEVEL COMPLETE!',
      {
        fontSize: '48px',
        color: THEME.cyan,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        align: 'center',
      }
    );
    completeText.setOrigin(0.5);
    completeText.setScrollFactor(0);
    completeText.setDepth(101);

    // Score text
    const scoreText = this.scene.add.text(
      width / 2,
      height / 2,
      `+${this.scoreManager.formatScore(levelScore)} Points`,
      {
        fontSize: '32px',
        color: THEME.green,
        fontFamily: 'monospace',
        align: 'center',
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setScrollFactor(0);
    scoreText.setDepth(101);

    // Personal best indicator
    if (isPersonalBest) {
      const pbText = this.scene.add.text(
        width / 2,
        height / 2 + 50,
        '🏆 NEW PERSONAL BEST! 🏆',
        {
          fontSize: '24px',
          color: THEME.orange,
          fontFamily: 'monospace',
          align: 'center',
        }
      );
      pbText.setOrigin(0.5);
      pbText.setScrollFactor(0);
      pbText.setDepth(101);
    }
  }

  /**
   * Destroy HUD elements
   */
  destroy(): void {
    this.scoreText?.destroy();
    this.timerText?.destroy();
    this.levelText?.destroy();
    this.deathsText?.destroy();
    this.comboText?.destroy();
    this.powerupText?.destroy();
    this.progressBar?.destroy();
    this.hudBackground?.destroy();
  }
}
