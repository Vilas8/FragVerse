/**
 * Enhanced Menu Scene - Level Devil Inspired
 * Clean, modern main menu with professional aesthetics
 */

import * as Phaser from 'phaser';
import { THEME } from '../config/colors';
import { DIFFICULTY_LEVELS, DifficultyLevel } from '../config/difficulty';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';

export class EnhancedMenuScene extends Phaser.Scene {
  private selectedDifficulty: DifficultyLevel = 'normal';
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;
  private title?: Phaser.GameObjects.Text;
  private subtitle?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'EnhancedMenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Initialize systems
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();

    // Background gradient
    this.createBackgroundGradient(width, height);

    // Animated particles in background
    this.createBackgroundParticles();

    // Main title with shadow
    this.title = this.add.text(width / 2, height * 0.2, 'HELL RUNNER', {
      fontSize: '72px',
      color: THEME.cyan,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10,
    });
    this.title.setOrigin(0.5);

    // Pulsing title animation
    this.tweens.add({
      targets: this.title,
      scale: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.subtitle = this.add.text(
      width / 2,
      height * 0.28,
      'Can you escape hell?',
      {
        fontSize: '24px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'italic',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    this.subtitle.setOrigin(0.5);
    this.subtitle.setAlpha(0.8);

    // Stats display
    this.createStatsDisplay(width, height);

    // Difficulty selector
    this.createDifficultySelector(width, height);

    // Play button
    this.createPlayButton(width, height);

    // How to play section
    this.createHowToPlay(width, height);

    // Credits
    const credits = this.add.text(
      width / 2,
      height - 20,
      'Made with ❤️ by Vilas Kumar',
      {
        fontSize: '14px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    credits.setOrigin(0.5);
    credits.setAlpha(0.6);
  }

  /**
   * Create animated background gradient
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
   * Create floating background particles
   */
  private createBackgroundParticles(): void {
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: this.cameras.main.width },
      y: { min: 0, max: this.cameras.main.height },
      speed: { min: 20, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { min: 0.3, max: 0.8 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 4000,
      frequency: 200,
      tint: [0x00d9ff, 0xa855f7, 0xff006e],
    });
    particles.setDepth(-1);
  }

  /**
   * Create stats display panel
   */
  private createStatsDisplay(width: number, height: number): void {
    const stats = this.scoreManager.getStats();
    const achievementProgress = this.achievementSystem.getProgress();
    const totalPoints = this.achievementSystem.getTotalPoints();

    // Stats panel
    const panelX = width / 2 - 200;
    const panelY = height * 0.38;

    const panel = this.add.graphics();
    panel.fillStyle(0x2a1b3d, 0.9);
    panel.fillRoundedRect(panelX, panelY, 400, 120, 15);
    panel.lineStyle(3, 0x00d9ff, 0.6);
    panel.strokeRoundedRect(panelX, panelY, 400, 120, 15);

    // Stats title
    const statsTitle = this.add.text(width / 2, panelY + 25, 'YOUR STATS', {
      fontSize: '20px',
      color: THEME.cyan,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    });
    statsTitle.setOrigin(0.5);

    // Best score
    const bestScore = this.add.text(
      panelX + 30,
      panelY + 55,
      `🏆 Best Score: ${this.scoreManager.formatScore(stats.personalBest)}`,
      {
        fontSize: '16px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Achievements
    const achievements = this.add.text(
      panelX + 30,
      panelY + 85,
      `⭐ Achievements: ${achievementProgress}% (${totalPoints}pts)`,
      {
        fontSize: '16px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
  }

  /**
   * Create difficulty selector
   */
  private createDifficultySelector(width: number, height: number): void {
    const startY = height * 0.58;
    const spacing = 90;
    let index = 0;

    const selectorTitle = this.add.text(width / 2, startY - 40, 'SELECT DIFFICULTY', {
      fontSize: '24px',
      color: THEME.cyan,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    selectorTitle.setOrigin(0.5);

    Object.entries(DIFFICULTY_LEVELS).forEach(([key, config]) => {
      const difficulty = key as DifficultyLevel;
      const buttonY = startY + index * spacing;

      // Button background
      const buttonBg = this.add.graphics();
      const isSelected = difficulty === this.selectedDifficulty;

      this.drawDifficultyButton(buttonBg, width / 2, buttonY, isSelected);

      // Button text
      const buttonText = this.add.text(
        width / 2 - 150,
        buttonY,
        `${config.name} (${Math.round(config.scoreMultiplier * 100)}% Score)`,
        {
          fontSize: '20px',
          color: isSelected ? THEME.cyan : THEME.text,
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 3,
        }
      );
      buttonText.setOrigin(0, 0.5);

      // Make interactive
      const hitArea = new Phaser.Geom.Rectangle(
        width / 2 - 200,
        buttonY - 30,
        400,
        60
      );
      buttonText.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      buttonBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      buttonText.on('pointerover', () => {
        buttonText.setColor(THEME.cyan);
        buttonText.setScale(1.05);
      });

      buttonText.on('pointerout', () => {
        if (difficulty !== this.selectedDifficulty) {
          buttonText.setColor(THEME.text);
        }
        buttonText.setScale(1);
      });

      buttonText.on('pointerdown', () => {
        this.selectedDifficulty = difficulty;
        // Refresh all buttons
        this.scene.restart();
      });

      index++;
    });
  }

  /**
   * Draw difficulty button
   */
  private drawDifficultyButton(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    selected: boolean
  ): void {
    const color = selected ? 0x00d9ff : 0x2a1b3d;
    const alpha = selected ? 0.3 : 0.8;
    const strokeColor = selected ? 0x00d9ff : 0x4a3b5d;

    graphics.fillStyle(color, alpha);
    graphics.fillRoundedRect(x - 200, y - 30, 400, 60, 10);
    graphics.lineStyle(selected ? 3 : 2, strokeColor, 0.8);
    graphics.strokeRoundedRect(x - 200, y - 30, 400, 60, 10);
  }

  /**
   * Create play button
   */
  private createPlayButton(width: number, height: number): void {
    const buttonY = height * 0.88;

    // Button background with glow
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x00d9ff, 0.9);
    buttonBg.fillRoundedRect(width / 2 - 150, buttonY - 35, 300, 70, 15);
    buttonBg.lineStyle(4, 0xffffff, 0.8);
    buttonBg.strokeRoundedRect(width / 2 - 150, buttonY - 35, 300, 70, 15);

    // Pulsing glow
    this.tweens.add({
      targets: buttonBg,
      alpha: { from: 0.9, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Button text
    const buttonText = this.add.text(width / 2, buttonY, 'START GAME', {
      fontSize: '36px',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    // Make interactive
    const hitArea = new Phaser.Geom.Rectangle(
      width / 2 - 150,
      buttonY - 35,
      300,
      70
    );
    buttonText.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    buttonBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

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

    buttonText.on('pointerdown', () => {
      // Flash effect
      this.cameras.main.flash(200, 0, 217, 255);

      // Start game with selected difficulty
      this.time.delayedCall(200, () => {
        this.scene.start('MainScene', {
          door: 1,
          stage: 1,
          difficulty: this.selectedDifficulty,
        });
      });
    });
  }

  /**
   * Create how to play instructions
   */
  private createHowToPlay(width: number, height: number): void {
    const instructions = this.add.text(
      width - 30,
      30,
      'CONTROLS:\nArrows/WASD - Move\nSpace/Up - Jump\n\nGoal: Reach the door!',
      {
        fontSize: '14px',
        color: THEME.text,
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'right',
      }
    );
    instructions.setOrigin(1, 0);
    instructions.setAlpha(0.7);
  }
}
