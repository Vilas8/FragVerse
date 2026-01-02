import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading Hell Runner...',
      style: {
        font: '20px monospace',
        color: '#ff0000',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xff0000, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Create player sprite (8x8 pixel red square for now)
    this.createPlayerSprite();
    
    // Create platform sprite
    this.createPlatformSprite();
    
    // Create spike sprite
    this.createSpikeSprite();
    
    // Create door sprite
    this.createDoorSprite();
  }

  createPlayerSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 16, 16);
    graphics.generateTexture('player', 16, 16);
    graphics.destroy();
  }

  createPlatformSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x888888);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('platform', 32, 32);
    graphics.destroy();
  }

  createSpikeSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    // Draw triangle spike
    graphics.fillStyle(0xff6600);
    graphics.beginPath();
    graphics.moveTo(16, 0);
    graphics.lineTo(0, 32);
    graphics.lineTo(32, 32);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('spike', 32, 32);
    graphics.destroy();
  }

  createDoorSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, 32, 48);
    graphics.fillStyle(0x008800);
    graphics.fillRect(4, 4, 24, 40);
    graphics.generateTexture('door', 32, 48);
    graphics.destroy();
  }

  create() {
    this.scene.start('MenuScene');
  }
}
