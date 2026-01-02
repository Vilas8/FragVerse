import Phaser from 'phaser';
import { createLevel } from '../levels/LevelGenerator';
import { Enemy } from '../entities/Enemy';
import { Powerup, PowerupManager } from '../entities/Powerup';
import { Obstacle } from '../entities/Obstacle';
import { LevelData } from '../types';

interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpikeData {
  x: number;
  y: number;
}

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private door!: Phaser.Physics.Arcade.Sprite;
  private deaths = 0;
  private startTime = 0;
  private deathText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private powerupText!: Phaser.GameObjects.Text;
  private currentDoor = 1;
  private currentStage = 1;
  private spawnPoint = { x: 50, y: 500 };
  
  // Enemy and powerup management
  private enemies: Enemy[] = [];
  private powerups: Powerup[] = [];
  private obstacles: Obstacle[] = [];
  private powerupManager: PowerupManager = new PowerupManager();
  private enemiesDefeated = 0;
  
  // Mobile controls
  private leftButton?: Phaser.GameObjects.Rectangle;
  private rightButton?: Phaser.GameObjects.Rectangle;
  private jumpButton?: Phaser.GameObjects.Rectangle;
  private mobileControls = { left: false, right: false, jump: false };
  
  // Game state
  private canDoubleJump = false;
  private hasShield = false;
  private gravityFlipped = false;
  private controlsReversed = false;
  private baseGravity = 1000;

  constructor() {
    super({ key: 'MainScene' });
  }

  init(data: { door: number; stage: number }) {
    this.currentDoor = data.door || 1;
    this.currentStage = data.stage || 1;
    this.deaths = 0;
    this.enemiesDefeated = 0;
    this.startTime = Date.now();
    this.powerupManager.clear();
    this.gravityFlipped = false;
    this.controlsReversed = false;
  }

  create() {
    const width = this.cameras.main.width;

    // Create platforms and spikes groups
    this.platforms = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();

    // Load level
    const level = createLevel(this.currentDoor, this.currentStage);
    this.loadLevel(level);

    // Create player
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.physics.world.gravity.y = this.baseGravity;

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    
    // Obstacle collisions
    this.obstacles.forEach((obstacle) => {
      this.physics.add.collider(this.player, obstacle.sprite, () => this.handleObstacleCollision(obstacle));
    });
    
    this.physics.add.overlap(this.player, this.spikes, this.hitSpike, undefined, this);
    this.physics.add.overlap(this.player, this.door, this.reachDoor, undefined, this);
    
    // Powerup collection
    this.powerups.forEach((powerup) => {
      this.physics.add.overlap(this.player, powerup.sprite, () => this.collectPowerup(powerup), undefined, this);
    });
    
    // Enemy collision
    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(this.player, enemy.sprite, () => this.hitEnemy(enemy), undefined, this);
    });

    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Mobile controls
    this.createMobileControls();

    // UI
    this.deathText = this.add.text(16, 16, `Deaths: ${this.deaths}`, {
      fontSize: '20px',
      color: '#ff0000',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
    });
    this.deathText.setScrollFactor(0);

    this.timerText = this.add.text(width - 16, 16, 'Time: 0.0s', {
      fontSize: '20px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
    });
    this.timerText.setOrigin(1, 0);
    this.timerText.setScrollFactor(0);

    this.levelText = this.add.text(
      width / 2,
      16,
      `Door ${this.currentDoor} - Stage ${this.currentStage}`,
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 },
      }
    );
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setScrollFactor(0);
    
    this.powerupText = this.add.text(16, 50, '', {
      fontSize: '14px',
      color: '#ffff00',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
    });
    this.powerupText.setScrollFactor(0);
  }

  loadLevel(level: LevelData) {
    // Clear existing level
    this.platforms.clear(true, true);
    this.spikes.clear(true, true);
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];
    this.powerups.forEach((powerup) => powerup.destroy());
    this.powerups = [];
    this.obstacles.forEach((obstacle) => obstacle.destroy());
    this.obstacles = [];

    // Set spawn point
    this.spawnPoint = level.spawnPoint;

    // Create platforms
    level.platforms.forEach((platform: PlatformData) => {
      const p = this.platforms.create(platform.x, platform.y, 'platform');
      p.setScale(platform.width / 32, platform.height / 32);
      p.refreshBody();
    });

    // Create spikes
    level.spikes.forEach((spike: SpikeData) => {
      this.spikes.create(spike.x, spike.y, 'spike');
    });
    
    // Create enemies
    level.enemies.forEach((enemyData) => {
      const enemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.type, 'enemy');
      this.enemies.push(enemy);
      this.physics.add.overlap(this.player, enemy.sprite, () => this.hitEnemy(enemy), undefined, this);
    });
    
    // Create powerups
    level.powerups.forEach((powerupData) => {
      const powerup = new Powerup(this, powerupData.x, powerupData.y, powerupData.type, 'powerup');
      this.powerups.push(powerup);
      this.physics.add.overlap(this.player, powerup.sprite, () => this.collectPowerup(powerup), undefined, this);
    });
    
    // Create obstacles
    level.obstacles.forEach((obstacleData) => {
      const obstacle = new Obstacle(this, obstacleData.x, obstacleData.y, obstacleData.type, obstacleData.properties);
      this.obstacles.push(obstacle);
      
      if (obstacleData.type === 'gravity-flip' || obstacleData.type === 'control-reverse') {
        // These don't need collision, they're zone-based
        this.physics.add.overlap(this.player, obstacle.sprite, () => this.handleObstacleCollision(obstacle), undefined, this);
      } else {
        // Saw, disappearing, popup spike need collision
        this.physics.add.collider(this.player, obstacle.sprite, () => this.handleObstacleCollision(obstacle));
      }
    });

    // Create door
    this.door = this.physics.add.sprite(level.door.x, level.door.y, 'door');
    this.door.setImmovable(true);
  }

  createMobileControls() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const buttonSize = 60;
    const padding = 20;

    // Left button
    this.leftButton = this.add.rectangle(
      padding + buttonSize / 2,
      height - padding - buttonSize / 2,
      buttonSize,
      buttonSize,
      0xff0000,
      0.5
    );
    this.leftButton.setScrollFactor(0);
    this.leftButton.setInteractive();
    this.leftButton.on('pointerdown', () => (this.mobileControls.left = true));
    this.leftButton.on('pointerup', () => (this.mobileControls.left = false));
    this.leftButton.on('pointerout', () => (this.mobileControls.left = false));

    this.add.text(
      padding + buttonSize / 2,
      height - padding - buttonSize / 2,
      '←',
      { fontSize: '32px', color: '#ffffff' }
    ).setOrigin(0.5).setScrollFactor(0);

    // Right button
    this.rightButton = this.add.rectangle(
      padding + buttonSize * 1.5 + 10,
      height - padding - buttonSize / 2,
      buttonSize,
      buttonSize,
      0xff0000,
      0.5
    );
    this.rightButton.setScrollFactor(0);
    this.rightButton.setInteractive();
    this.rightButton.on('pointerdown', () => (this.mobileControls.right = true));
    this.rightButton.on('pointerup', () => (this.mobileControls.right = false));
    this.rightButton.on('pointerout', () => (this.mobileControls.right = false));

    this.add.text(
      padding + buttonSize * 1.5 + 10,
      height - padding - buttonSize / 2,
      '→',
      { fontSize: '32px', color: '#ffffff' }
    ).setOrigin(0.5).setScrollFactor(0);

    // Jump button
    this.jumpButton = this.add.rectangle(
      width - padding - buttonSize / 2,
      height - padding - buttonSize / 2,
      buttonSize * 1.5,
      buttonSize,
      0x00ff00,
      0.5
    );
    this.jumpButton.setScrollFactor(0);
    this.jumpButton.setInteractive();
    this.jumpButton.on('pointerdown', () => (this.mobileControls.jump = true));
    this.jumpButton.on('pointerup', () => (this.mobileControls.jump = false));
    this.jumpButton.on('pointerout', () => (this.mobileControls.jump = false));

    this.add.text(
      width - padding - buttonSize / 2,
      height - padding - buttonSize / 2,
      'JUMP',
      { fontSize: '20px', color: '#ffffff', fontFamily: 'monospace' }
    ).setOrigin(0.5).setScrollFactor(0);
  }

  update() {
    // Update timer
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.timerText.setText(`Time: ${elapsed.toFixed(1)}s`);

    // Update enemies
    this.enemies.forEach((enemy) => {
      if (enemy.isActive()) {
        enemy.update(this.game.loop.delta);
      }
    });
    
    // Update powerups
    this.powerups.forEach((powerup) => {
      if (!powerup.collected) {
        powerup.update();
      }
    });
    
    // Update obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.update(this.game.loop.delta);
    });
    
    // Update powerup effects
    this.powerupManager.update(Date.now());
    this.hasShield = this.powerupManager.hasActiveShield();
    this.canDoubleJump = this.powerupManager.canDoubleJumpNow();
    
    // Update powerup display
    const activePowerups = this.powerupManager.getActivePowerups();
    let powerupDisplay = 'Powerups: ';
    if (activePowerups.length === 0) {
      powerupDisplay += 'None';
    } else {
      powerupDisplay += activePowerups.map((p) => {
        const remaining = (this.powerupManager.getRemainingTime(p) / 1000).toFixed(1);
        return `${p}(${remaining}s)`;
      }).join(' ');
    }
    
    // Add status effects
    if (this.gravityFlipped) powerupDisplay += ' | GRAVITY FLIPPED ⬆';
    if (this.controlsReversed) powerupDisplay += ' | CONTROLS REVERSED ↔';
    
    this.powerupText.setText(powerupDisplay);

    // Movement
    const baseSpeed = 200;
    const speed = baseSpeed * this.powerupManager.getSpeedMultiplier();
    const jumpVelocity = -400;

    let left = this.cursors.left.isDown || this.wasd.left.isDown || this.mobileControls.left;
    let right = this.cursors.right.isDown || this.wasd.right.isDown || this.mobileControls.right;
    const jump = this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.up.isDown || this.mobileControls.jump;

    // Reverse controls if in reverse zone
    if (this.controlsReversed) {
      [left, right] = [right, left];
    }

    if (left) {
      this.player.setVelocityX(-speed);
    } else if (right) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (jump && this.player.body!.touching.down) {
      const jumpForce = this.gravityFlipped ? 400 : jumpVelocity;
      this.player.setVelocityY(jumpForce);
    }

    // Check if fell off map
    if (this.player.y > this.cameras.main.height + 50) {
      this.die();
    }
  }

  handleObstacleCollision(obstacle: Obstacle): void {
    switch (obstacle.getType()) {
      case 'saw':
      case 'popup-spike':
        this.hitSpike();
        break;
      case 'gravity-flip':
        this.toggleGravityFlip();
        break;
      case 'control-reverse':
        this.toggleControlReverse();
        break;
      case 'fake-door':
        this.die();
        break;
      case 'teleport':
        const dest = obstacle.getDestination();
        if (dest) {
          this.player.setPosition(dest.x, dest.y);
          this.player.setVelocity(0, 0);
        }
        break;
    }
  }

  toggleGravityFlip(): void {
    this.gravityFlipped = !this.gravityFlipped;
    this.physics.world.gravity.y = this.gravityFlipped ? -this.baseGravity : this.baseGravity;
    this.player.setTint(this.gravityFlipped ? 0x00ccff : 0xffffff);
  }

  toggleControlReverse(): void {
    this.controlsReversed = !this.controlsReversed;
    this.player.setTint(this.controlsReversed ? 0xff00ff : 0xffffff);
  }

  hitSpike() {
    if (this.hasShield) {
      this.powerupManager.useShield();
      this.player.setTint(0xffaa00); // Orange tint when shield breaks
      this.time.delayedCall(200, () => {
        if (this.gravityFlipped) this.player.setTint(0x00ccff);
        else if (this.controlsReversed) this.player.setTint(0xff00ff);
        else this.player.clearTint();
      });
    } else {
      this.die();
    }
  }
  
  hitEnemy(enemy: Enemy) {
    if (this.hasShield) {
      this.powerupManager.useShield();
      enemy.dealDamage();
      this.enemiesDefeated++;
      this.player.setTint(0xffaa00);
      this.time.delayedCall(200, () => {
        if (this.gravityFlipped) this.player.setTint(0x00ccff);
        else if (this.controlsReversed) this.player.setTint(0xff00ff);
        else this.player.clearTint();
      });
    } else {
      this.die();
    }
  }
  
  collectPowerup(powerup: Powerup) {
    const effect = powerup.collect();
    this.powerupManager.applyPowerup(effect);
    
    // Visual feedback
    this.player.setTint(0xffff00);
    this.time.delayedCall(100, () => {
      if (this.gravityFlipped) this.player.setTint(0x00ccff);
      else if (this.controlsReversed) this.player.setTint(0xff00ff);
      else this.player.clearTint();
    });
  }

  die() {
    this.deaths++;
    this.deathText.setText(`Deaths: ${this.deaths}`);
    
    // Flash screen red
    this.cameras.main.flash(200, 255, 0, 0);
    
    // Reset modifiers
    this.gravityFlipped = false;
    this.controlsReversed = false;
    this.physics.world.gravity.y = this.baseGravity;
    this.player.clearTint();
    
    // Respawn
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
  }

  reachDoor() {
    // Level complete!
    const timeElapsed = (Date.now() - this.startTime) / 1000;
    
    this.scene.start('GameOverScene', {
      door: this.currentDoor,
      stage: this.currentStage,
      deaths: this.deaths,
      time: timeElapsed,
      enemiesDefeated: this.enemiesDefeated,
    });
  }
}
