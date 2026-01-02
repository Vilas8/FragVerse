import * as Phaser from 'phaser';
import { THEME } from '../config/colors';
import { DIFFICULTIES, DifficultyLevel, getAvailableDifficulties } from '../config/difficulty';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';

export class MenuScene extends Phaser.Scene {
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;
  private selectedDifficulty: DifficultyLevel = 'normal';

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Set modern background
    this.cameras.main.setBackgroundColor(THEME.background);

    // Initialize systems
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();

    // Title
    const title = this.add.text(width / 2, 50, 'HELL RUNNER', {
      fontSize: '56px',
      color: THEME.cyan,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, 120, 'Modernized Platformer', {
      fontSize: '18px',
      color: THEME.textSecondary,
      fontFamily: 'monospace',
      align: 'center',
    });
    subtitle.setOrigin(0.5);

    // Difficulty section title
    const diffTitle = this.add.text(width / 2, 180, 'SELECT DIFFICULTY', {
      fontSize: '24px',
      color: THEME.green,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });
    diffTitle.setOrigin(0.5);

    // Create difficulty buttons
    const difficulties = getAvailableDifficulties();
    let buttonY = 250;
    const buttonWidth = 400;

    difficulties.forEach((diff, index) => {
      const isSelected = diff.key === this.selectedDifficulty;
      const button = this.add.rectangle(
        width / 2,
        buttonY,
        buttonWidth,
        70,
        isSelected ? 0x00d9ff : 0x2a1b3d,
        0.8
      );
      button.setStrokeStyle(2, isSelected ? 0x00d9ff : 0x3a2b4d);
      button.setInteractive({ useHandCursor: true });

      // Difficulty name
      const nameText = this.add.text(
        width / 2 - 180,
        buttonY - 15,
        diff.config.name,
        {
          fontSize: '20px',
          color: isSelected ? THEME.background : THEME.text,
          fontFamily: 'monospace',
          fontStyle: 'bold',
        }
      );
      nameText.setOrigin(0, 0.5);

      // Difficulty description
      const descText = this.add.text(
        width / 2 - 180,
        buttonY + 10,
        diff.config.description,
        {
          fontSize: '12px',
          color: isSelected ? THEME.background : THEME.textSecondary,
          fontFamily: 'monospace',
          wordWrap: { width: 300 },
        }
      );
      descText.setOrigin(0, 0.5);

      // Score multiplier indicator
      const multiplierText = this.add.text(
        width / 2 + 150,
        buttonY,
        `${(diff.config.scoreMultiplier * 100).toFixed(0)}% SCORE`,
        {
          fontSize: '14px',
          color: isSelected ? THEME.background : THEME.orange,
          fontFamily: 'monospace',
          fontStyle: 'bold',
          align: 'center',
        }
      );
      multiplierText.setOrigin(0.5);

      button.on('pointerover', () => {
        button.setStrokeStyle(2, 0x00d9ff);
        button.setAlpha(0.9);
      });

      button.on('pointerout', () => {
        if (diff.key !== this.selectedDifficulty) {
          button.setStrokeStyle(2, 0x3a2b4d);
        }
        button.setAlpha(0.8);
      });

      button.on('pointerdown', () => {
        this.selectedDifficulty = diff.key as DifficultyLevel;
        this.scene.restart();
      });

      buttonY += 100;
    });

    // Stats display
    let statsY = height - 180;
    const stats = this.scoreManager.getStats();
    const achievements = this.achievementSystem.getAllAchievements();
    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    const statsTitle = this.add.text(width / 2, statsY, 'CAREER STATS', {
      fontSize: '18px',
      color: THEME.cyan,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });
    statsTitle.setOrigin(0.5);

    statsY += 40;
    const highScoreText = this.add.text(width / 2, statsY, `Best Score: ${this.scoreManager.formatScore(stats.personalBest)}`, {
      fontSize: '14px',
      color: THEME.green,
      fontFamily: 'monospace',
      align: 'center',
    });
    highScoreText.setOrigin(0.5);

    statsY += 30;
    const achievementText = this.add.text(
      width / 2,
      statsY,
      `Achievements: ${unlockedCount}/${achievements.length}`,
      {
        fontSize: '14px',
        color: THEME.orange,
        fontFamily: 'monospace',
        align: 'center',
      }
    );
    achievementText.setOrigin(0.5);

    // Start button
    const startButton = this.add.text(
      width / 2,
      height - 50,
      `START - ${DIFFICULTIES[this.selectedDifficulty].name.toUpperCase()} MODE`,
      {
        fontSize: '28px',
        color: THEME.text,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        backgroundColor: THEME.primary,
        padding: { x: 40, y: 15 },
      }
    );
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setColor(THEME.cyan);
      startButton.setScale(1.05);
    });

    startButton.on('pointerout', () => {
      startButton.setColor(THEME.text);
      startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
      this.scene.start('MainScene', {
        door: 1,
        stage: 1,
        difficulty: this.selectedDifficulty,
      });
    });
  }
}
