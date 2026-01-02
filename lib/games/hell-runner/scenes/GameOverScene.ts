import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private door!: number;
  private stage!: number;
  private deaths!: number;
  private time!: number;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { door: number; stage: number; deaths: number; time: number }) {
    this.door = data.door;
    this.stage = data.stage;
    this.deaths = data.deaths;
    this.time = data.time;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 3, 'STAGE COMPLETE!', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Stats
    const stats = this.add.text(
      width / 2,
      height / 2,
      `Door ${this.door} - Stage ${this.stage}\n\nDeaths: ${this.deaths}\nTime: ${this.time.toFixed(1)}s`,
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        align: 'center',
      }
    );
    stats.setOrigin(0.5);

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
    });

    nextButton.on('pointerout', () => {
      nextButton.setColor('#00ff00');
    });

    nextButton.on('pointerdown', () => {
      let nextStage = this.stage + 1;
      let nextDoor = this.door;

      if (nextStage > 5) {
        nextStage = 1;
        nextDoor++;
      }

      if (nextDoor > 16) {
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
    });

    menuButton.on('pointerout', () => {
      menuButton.setColor('#ff0000');
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
