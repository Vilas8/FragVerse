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

    // Create player sprite
    this.createPlayerSprite();
    
    // Create platform sprite
    this.createPlatformSprite();
    
    // Create spike sprite
    this.createSpikeSprite();
    
    // Create door sprite
    this.createDoorSprite();
    
    // Create enemy sprites
    this.createEnemySprite();
    
    // Create powerup sprite
    this.createPowerupSprite();
    
    // Create obstacle sprites
    this.createObstacleSprite();
    this.createSawSprite();
    this.createTeleportSprite();
  }

  createPlayerSprite() {
    const graphics = this.add.graphics();
    // Draw player as red rectangle
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 16, 16);
    // Draw eyes
    graphics.fillStyle(0xffffff);
    graphics.fillRect(2, 4, 3, 3);
    graphics.fillRect(10, 4, 3, 3);
    graphics.generateTexture('player', 16, 16);
    graphics.destroy();
  }

  createPlatformSprite() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x888888);
    graphics.fillRect(0, 0, 32, 32);
    // Add texture detail
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 16, 32, 16);
    graphics.generateTexture('platform', 32, 32);
    graphics.destroy();
  }

  createSpikeSprite() {
    const graphics = this.add.graphics();
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
    const graphics = this.add.graphics();
    // Door frame
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, 32, 48);
    // Door interior
    graphics.fillStyle(0x008800);
    graphics.fillRect(4, 4, 24, 40);
    // Door handle
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(26, 24, 2);
    graphics.generateTexture('door', 32, 48);
    graphics.destroy();
  }

  createEnemySprite() {
    const graphics = this.add.graphics();
    // Draw enemy as purple rectangle with angry face
    graphics.fillStyle(0xff00ff);
    graphics.fillRect(0, 0, 16, 16);
    // Eyes
    graphics.fillStyle(0xffff00);
    graphics.fillRect(2, 4, 3, 3);
    graphics.fillRect(10, 4, 3, 3);
    // Angry mouth
    graphics.fillStyle(0xff0000);
    graphics.fillRect(4, 11, 8, 2);
    graphics.generateTexture('enemy', 16, 16);
    graphics.destroy();
  }

  createPowerupSprite() {
    const graphics = this.add.graphics();
    // Draw star-shaped powerup
    graphics.fillStyle(0xffff00);
    const size = 12;
    const points = this.createStarPoints(8, 8, 4, size, 2);
    graphics.beginPath();
    graphics.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i][0], points[i][1]);
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('powerup', 16, 16);
    graphics.destroy();
  }

  createObstacleSprite() {
    const graphics = this.add.graphics();
    // Draw generic obstacle (gray platform)
    graphics.fillStyle(0xcccccc);
    graphics.fillRect(0, 0, 32, 16);
    graphics.fillStyle(0x999999);
    graphics.fillRect(4, 2, 24, 4);
    graphics.generateTexture('obstacle', 32, 16);
    graphics.destroy();
  }

  createSawSprite() {
    const graphics = this.add.graphics();
    // Draw spinning saw blade
    graphics.fillStyle(0xffcc00);
    graphics.fillCircle(8, 8, 8);
    // Saw teeth
    graphics.fillStyle(0xff9900);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = 8 + Math.cos(angle) * 9;
      const y = 8 + Math.sin(angle) * 9;
      graphics.fillTriangleShape([{x: 8, y: 8}, {x: x - 1.5, y: y - 1.5}, {x: x + 1.5, y: y + 1.5}]);
    }
    graphics.generateTexture('saw', 16, 16);
    graphics.destroy();
  }

  createTeleportSprite() {
    const graphics = this.add.graphics();
    // Draw portal/teleport sprite
    graphics.fillStyle(0x0000ff);
    graphics.fillCircle(8, 8, 8);
    graphics.fillStyle(0x00ffff);
    graphics.fillCircle(8, 8, 5);
    graphics.fillStyle(0x0000ff);
    graphics.fillCircle(8, 8, 2);
    graphics.generateTexture('teleport', 16, 16);
    graphics.destroy();
  }

  private createStarPoints(
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): number[][] {
    const points: number[][] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    return points;
  }

  create() {
    this.scene.start('MenuScene');
  }
}
