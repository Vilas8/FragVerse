import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private door!: number;
  private stage!: number;
  private deaths!: number;
  private completionTime!: number;
  private enemiesDefeated!: number;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { door: number; stage: number; deaths: number; time: number; enemiesDefeated?: number }) {
    this.door = data.door;
    this.stage = data.stage;
    this.deaths = data.deaths;
    this.completionTime = data.time;
    this.enemiesDefeated = data.enemiesDefeated || 0;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 5, 'STAGE COMPLETE!', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Calculate score
    const baseScore = 1000;
    const deathPenalty = this.deaths * 50;
    const timeBonusMultiplier = Math.max(0, 20 - this.completionTime);
    const timeBonus = Math.max(0, timeBonusMultiplier * 10);
    const enemyBonus = this.enemiesDefeated * 100;
    const totalScore = Math.max(0, baseScore - deathPenalty + timeBonus + enemyBonus);

    // Stats
    const stats = this.add.text(
      width / 2,
      height / 2.5,
      `Door ${this.door} - Stage ${this.stage}\n\nDeaths: ${this.deaths}\nTime: ${this.completionTime.toFixed(1)}s\nEnemies Defeated: ${this.enemiesDefeated}\n\nSCORE: ${Math.floor(totalScore)}`,
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        align: 'center',
        lineSpacing: 8,
      }
    );
    stats.setOrigin(0.5);

    // Score breakdown (optional)
    const breakdown = this.add.text(
      width / 2,
      height - 280,
      `Base: ${baseScore} | Deaths: -${deathPenalty} | Time Bonus: +${Math.floor(timeBonus)} | Enemy Bonus: +${enemyBonus}`,
      {
        fontSize: '12px',
        color: '#999999',
        fontFamily: 'monospace',
        align: 'center',
      }
    );
    breakdown.setOrigin(0.5);

    // Next stage button
    const nextButton = this.add.text(width / 2, height - 150, 'NEXT STAGE', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 },
    });
    nextButton.setOrigin(0.5);
    nextButton.setInteractive({ useHandCursor: true });

    nextButton.on('pointerover', () => {
      nextButton.setColor('#ffff00');
      nextButton.setScale(1.1);
    });

    nextButton.on('pointerout', () => {
      nextButton.setColor('#00ff00');
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
        this.scene.start('MainScene', { door: nextDoor, stage: nextStage });
      }
    });

    // Menu button
    const menuButton = this.add.text(width / 2, height - 80, 'MAIN MENU', {
      fontSize: '24px',
      color: '#ff0000',
      fontFamily: 'monospace',
      backgroundColor: '#330000',
      padding: { x: 20, y: 10 },
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerover', () => {
      menuButton.setColor('#ffff00');
      menuButton.setScale(1.1);
    });

    menuButton.on('pointerout', () => {
      menuButton.setColor('#ff0000');
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
