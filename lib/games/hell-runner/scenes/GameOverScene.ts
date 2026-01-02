import * as Phaser from 'phaser';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';
import { THEME } from '../config/colors';
import { DifficultyLevel } from '../config/difficulty';

export class GameOverScene extends Phaser.Scene {
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
    super({ key: 'GameOverScene' });
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

    // Set modern background
    this.cameras.main.setBackgroundColor(THEME.background);

    // Initialize systems
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();

    // Title
    const title = this.add.text(width / 2, 60, 'STAGE COMPLETE!', {
      fontSize: '48px',
      color: THEME.cyan,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });
    title.setOrigin(0.5);

    // Level indicator
    const levelText = this.add.text(width / 2, 130, `Door ${this.door} - Stage ${this.stage}`, {
      fontSize: '24px',
      color: THEME.text,
      fontFamily: 'monospace',
      align: 'center',
    });
    levelText.setOrigin(0.5);

    // Stats display
    let statsY = 190;
    const stats = [
      { label: 'Deaths:', value: this.deaths.toString(), color: THEME.danger },
      { label: 'Time:', value: `${this.completionTime.toFixed(1)}s`, color: THEME.green },
      { label: 'Enemies Defeated:', value: this.enemiesDefeated.toString(), color: THEME.pink },
      { label: 'Difficulty:', value: this.difficulty.toUpperCase(), color: THEME.orange },
    ];

    stats.forEach((stat) => {
      const text = this.add.text(
        width / 2,
        statsY,
        `${stat.label} ${stat.value}`,
        {
          fontSize: '18px',
          color: stat.color,
          fontFamily: 'monospace',
          align: 'center',
        }
      );
      text.setOrigin(0.5);
      statsY += 40;
    });

    // Score display (prominent)
    statsY += 20;
    const scoreText = this.add.text(
      width / 2,
      statsY,
      `SCORE: ${this.scoreManager.formatScore(this.finalScore)}`,
      {
        fontSize: '32px',
        color: THEME.cyan,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        align: 'center',
        backgroundColor: THEME.primary,
        padding: { x: 30, y: 15 },
      }
    );
    scoreText.setOrigin(0.5);

    // Achievements display
    if (this.unlockedAchievements.length > 0) {
      statsY += 80;
      const achievementsTitle = this.add.text(
        width / 2,
        statsY,
        'ACHIEVEMENTS UNLOCKED!',
        {
          fontSize: '20px',
          color: THEME.green,
          fontFamily: 'monospace',
          fontStyle: 'bold',
          align: 'center',
        }
      );
      achievementsTitle.setOrigin(0.5);

      statsY += 50;
      this.unlockedAchievements.forEach((achievementId) => {
        const achievement = this.achievementSystem.getAchievement(achievementId as any);
        if (achievement) {
          const achievementText = this.add.text(
            width / 2,
            statsY,
            `${achievement.icon} ${achievement.name} (+${achievement.points}pts)`,
            {
              fontSize: '16px',
              color: THEME.green,
              fontFamily: 'monospace',
              align: 'center',
              backgroundColor: THEME.primary,
              padding: { x: 15, y: 8 },
            }
          );
          achievementText.setOrigin(0.5);
          statsY += 40;
        }
      });
    }

    // Buttons
    const buttonY = height - 120;
    const buttonSpacing = 220;

    // Next stage button
    const nextButton = this.add.text(
      width / 2 - buttonSpacing / 2,
      buttonY,
      'NEXT STAGE',
      {
        fontSize: '24px',
        color: THEME.text,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        backgroundColor: THEME.primary,
        padding: { x: 25, y: 12 },
      }
    );
    nextButton.setOrigin(0.5);
    nextButton.setInteractive({ useHandCursor: true });

    nextButton.on('pointerover', () => {
      nextButton.setColor(THEME.cyan);
      nextButton.setScale(1.05);
    });

    nextButton.on('pointerout', () => {
      nextButton.setColor(THEME.text);
      nextButton.setScale(1);
    });

    nextButton.on('pointerdown', () => {
      let nextStage = this.stage + 1;
      let nextDoor = this.door;

      if (nextStage > 5) {
        nextStage = 1;
        nextDoor++;
      }

      if (nextDoor > 5) {
        // Game complete!
        this.scene.start('MenuScene');
      } else {
        this.scene.start('MainScene', { door: nextDoor, stage: nextStage, difficulty: this.difficulty });
      }
    });

    // Menu button
    const menuButton = this.add.text(
      width / 2 + buttonSpacing / 2,
      buttonY,
      'MAIN MENU',
      {
        fontSize: '24px',
        color: THEME.text,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        backgroundColor: THEME.primary,
        padding: { x: 25, y: 12 },
      }
    );
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerover', () => {
      menuButton.setColor(THEME.cyan);
      menuButton.setScale(1.05);
    });

    menuButton.on('pointerout', () => {
      menuButton.setColor(THEME.text);
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
