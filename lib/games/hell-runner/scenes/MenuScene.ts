import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 3, 'HELL RUNNER', {
      fontSize: '64px',
      color: '#ff0000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(
      width / 2,
      height / 3 + 70,
      'A Devilishly Difficult Platformer',
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    subtitle.setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height / 2 + 50, 'START GAME', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 },
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setColor('#ffff00');
    });

    startButton.on('pointerout', () => {
      startButton.setColor('#00ff00');
    });

    startButton.on('pointerdown', () => {
      this.scene.start('MainScene', { door: 1, stage: 1 });
    });

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height - 100,
      'Desktop: WASD/Arrows + Space to Jump\nMobile: Touch Controls',
      {
        fontSize: '16px',
        color: '#888888',
        fontFamily: 'monospace',
        align: 'center',
      }
    );
    instructions.setOrigin(0.5);

    // Flame animation for title
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.7 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }
}
