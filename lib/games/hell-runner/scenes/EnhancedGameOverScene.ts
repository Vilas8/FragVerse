/**
 * Enhanced Game Over Scene - Level Devil Inspired
 * Professional results screen with animations
 */

import * as Phaser from 'phaser';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem, AchievementId } from '../ui/AchievementSystem';
import { THEME } from '../config/colors';
import { DifficultyLevel } from '../config/difficulty';

export class EnhancedGameOverScene extends Phaser.Scene {
  private door!: number;
  private stage!: number;
  private deaths!: number;
  private completionTime!: number;
  private enemiesDefeated!: number;
  private difficulty!: DifficultyLevel;
  private finalScore!: number;
  private unlockedAchievements!: string[];
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;

  constructor() {
    super({ key: 'EnhancedGameOverScene' });
  }

  init(data: {
    door: number;
    stage: number;
    deaths: number;
    time: number;
    enemiesDefeated?: number;
    difficulty?: DifficultyLevel;
    score?: number;
    achievements?: string[];
  }) {
    this.door = data.door;
    this.stage = data.stage;
    this.deaths = data.deaths;
    this.completionTime = data.time;
    this.enemiesDefeated = data.enemiesDefeated || 0;
    this.difficulty = data.difficulty || 'normal';
    this.finalScore = data.score || 0;
    this.unlockedAchievements = data.achievements || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Initialize systems
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();

    // Background with gradient
    this.createBackgroundGradient(width, height);

    // Dark overlay animation
    this.createOverlay(width, height);

    // Main panel
    this.createMainPanel(width, height);

    // Title with animation
    this.createTitle(width, height);

    // Stats display
    this.createStatsDisplay(width, height);

    // Achievements display
    if (this.unlockedAchievements.length > 0) {
      this.createAchievementsDisplay(width, height);
    }

    // Action buttons
    this.createActionButtons(width, height);
  }

  /**
   * Create background gradient
   */
  private createBackgroundGradient(width: number, height: number): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(
      0x0a0410,
      0x1a0f2e,
      0x2a1b3d,
      0x1a0f2e,
      1,
      1,
      1,
      1
    );
    graphics.fillRect(0, 0, width, height);
  }

  /**
   * Create dark overlay with animation
   */
  private createOverlay(width: number, height: number): void {
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, width, height);

    this.tweens.add({
      targets: overlay,
      alpha: 0.5,
      duration: 400,
    });
  }

  /**
   * Create main results panel
   */
  private createMainPanel(width: number, height: number): void {
    const panel = this.add.graphics();
    panel.fillStyle(0x2a1b3d, 0.95);
    panel.fillRoundedRect(width / 2 - 350, height / 2 - 300, 700, 600, 20);
    panel.lineStyle(4, 0x00d9ff, 0.9);
    panel.strokeRoundedRect(width / 2 - 350, height / 2 - 300, 700, 600, 20);
    panel.setAlpha(0);

    this.tweens.add({
      targets: panel,
      alpha: 1,
      duration: 300,
      delay: 200,
    });
  }

  /**
   * Create animated title
   */
  private createTitle(width: number, height: number): void {
    const title = this.add.text(
      width / 2,
      height / 2 - 240,
      'LEVEL COMPLETE!',
      {
        fontSize: '56px',
        color: THEME.cyan,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8,
      }
    );
    title.setOrigin(0.5);
    title.setScale(0);

    this.tweens.add({
      targets: title,
      scale: 1,
      duration: 500,
      delay: 300,
      ease: 'Back.easeOut',
    });

    // Level indicator
    const levelText = this.add.text(
      width / 2,
      height / 2 - 180,
      `Door ${this.door} - Stage ${this.stage}`,
      {
        fontSize: '28px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    levelText.setOrigin(0.5);
    levelText.setAlpha(0);

    this.tweens.add({
      targets: levelText,
      alpha: 1,
      duration: 400,
      delay: 500,
    });
  }

  /**
   * Create stats display with icons
   */
  private createStatsDisplay(width: number, height: number): void {
    const startY = height / 2 - 120;
    const stats = [
      {
        icon: '⏱️',
        label: 'Time',
        value: `${this.completionTime.toFixed(1)}s`,
        color: this.completionTime < 20 ? THEME.green : THEME.cyan,
      },
      {
        icon: '💀',
        label: 'Deaths',
        value: this.deaths.toString(),
        color: this.deaths === 0 ? THEME.green : THEME.danger,
      },
      {
        icon: '⚔️',
        label: 'Enemies',
        value: this.enemiesDefeated.toString(),
        color: THEME.pink,
      },
      {
        icon: '🎯',
        label: 'Difficulty',
        value: this.difficulty.toUpperCase(),
        color: THEME.orange,
      },
    ];

    stats.forEach((stat, index) => {
      const y = startY + index * 50;
      const statBg = this.add.graphics();
      statBg.fillStyle(0x1a0f2e, 0.7);
      statBg.fillRoundedRect(width / 2 - 280, y - 20, 560, 45, 8);
      statBg.setAlpha(0);

      const statText = this.add.text(
        width / 2 - 250,
        y,
        `${stat.icon} ${stat.label}: ${stat.value}`,
        {
          fontSize: '24px',
          color: stat.color,
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4,
        }
      );
      statText.setOrigin(0, 0.5);
      statText.setAlpha(0);

      this.tweens.add({
        targets: [statBg, statText],
        alpha: 1,
        duration: 300,
        delay: 700 + index * 100,
      });
    });

    // Score display (prominent)
    const scoreY = startY + stats.length * 50 + 30;
    const scoreBg = this.add.graphics();
    scoreBg.fillStyle(0x00d9ff, 0.2);
    scoreBg.fillRoundedRect(width / 2 - 280, scoreY - 25, 560, 55, 10);
    scoreBg.lineStyle(3, 0x00d9ff, 0.8);
    scoreBg.strokeRoundedRect(width / 2 - 280, scoreY - 25, 560, 55, 10);
    scoreBg.setAlpha(0);

    const scoreText = this.add.text(
      width / 2,
      scoreY,
      `🏆 SCORE: ${this.scoreManager.formatScore(this.finalScore)}`,
      {
        fontSize: '32px',
        color: THEME.cyan,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 5,
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setAlpha(0);

    this.tweens.add({
      targets: [scoreBg, scoreText],
      alpha: 1,
      duration: 400,
      delay: 1100,
    });

    // Pulsing effect
    this.tweens.add({
      targets: scoreText,
      scale: { from: 1, to: 1.05 },
      duration: 1000,
      delay: 1500,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Create achievements display
   */
  private createAchievementsDisplay(width: number, height: number): void {
    const achievementsY = height / 2 + 60;

    const achievementsTitle = this.add.text(
      width / 2,
      achievementsY,
      '⭐ ACHIEVEMENTS UNLOCKED!',
      {
        fontSize: '24px',
        color: THEME.green,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    achievementsTitle.setOrigin(0.5);
    achievementsTitle.setAlpha(0);

    this.tweens.add({
      targets: achievementsTitle,
      alpha: 1,
      duration: 400,
      delay: 1300,
    });

    let achievementY = achievementsY + 40;
    this.unlockedAchievements.forEach((achievementId, index) => {
      const achievement = this.achievementSystem.getAchievement(
        achievementId as AchievementId
      );
      if (achievement) {
        const achievementBg = this.add.graphics();
        achievementBg.fillStyle(0x00f5a0, 0.15);
        achievementBg.fillRoundedRect(width / 2 - 250, achievementY - 18, 500, 36, 8);
        achievementBg.setAlpha(0);

        const achievementText = this.add.text(
          width / 2,
          achievementY,
          `${achievement.icon} ${achievement.name} (+${achievement.points}pts)`,
          {
            fontSize: '18px',
            color: THEME.green,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
          }
        );
        achievementText.setOrigin(0.5);
        achievementText.setAlpha(0);

        this.tweens.add({
          targets: [achievementBg, achievementText],
          alpha: 1,
          duration: 300,
          delay: 1500 + index * 150,
        });

        achievementY += 45;
      }
    });
  }

  /**
   * Create action buttons
   */
  private createActionButtons(width: number, height: number): void {
    const buttonY = height / 2 + 250;
    const buttonSpacing = 250;

    // Next stage button
    this.createButton(
      width / 2 - buttonSpacing / 2,
      buttonY,
      'NEXT STAGE',
      0x00d9ff,
      () => {
        let nextStage = this.stage + 1;
        let nextDoor = this.door;

        if (nextStage > 5) {
          nextStage = 1;
          nextDoor++;
        }

        if (nextDoor > 5) {
          this.cameras.main.fade(300);
          this.time.delayedCall(300, () => {
            this.scene.start('EnhancedMenuScene');
          });
        } else {
          this.cameras.main.fade(300);
          this.time.delayedCall(300, () => {
            this.scene.start('MainScene', {
              door: nextDoor,
              stage: nextStage,
              difficulty: this.difficulty,
            });
          });
        }
      },
      2000
    );

    // Menu button
    this.createButton(
      width / 2 + buttonSpacing / 2,
      buttonY,
      'MAIN MENU',
      0x2a1b3d,
      () => {
        this.cameras.main.fade(300);
        this.time.delayedCall(300, () => {
          this.scene.start('EnhancedMenuScene');
        });
      },
      2100
    );
  }

  /**
   * Create animated button
   */
  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void,
    delay: number
  ): void {
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(color, 0.9);
    buttonBg.fillRoundedRect(x - 100, y - 25, 200, 50, 10);
    buttonBg.lineStyle(3, 0x00d9ff, 0.6);
    buttonBg.strokeRoundedRect(x - 100, y - 25, 200, 50, 10);
    buttonBg.setAlpha(0);

    const buttonText = this.add.text(x, y, text, {
      fontSize: '20px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    buttonText.setOrigin(0.5);
    buttonText.setAlpha(0);

    this.tweens.add({
      targets: [buttonBg, buttonText],
      alpha: 1,
      duration: 300,
      delay,
    });

    // Make interactive
    const hitArea = new Phaser.Geom.Rectangle(x - 100, y - 25, 200, 50);
    buttonText.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    buttonText.on('pointerover', () => {
      buttonText.setScale(1.1);
      this.tweens.add({
        targets: buttonBg,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });

    buttonText.on('pointerout', () => {
      buttonText.setScale(1);
      buttonBg.setScale(1);
    });

    buttonText.on('pointerdown', callback);
  }
}
