import * as Phaser from 'phaser';
import { createLevel } from '../levels/LevelGenerator';
import { Enemy } from '../entities/Enemy';
import { Powerup, PowerupManager } from '../entities/Powerup';
import { Obstacle } from '../entities/Obstacle';
import { LevelData } from '../types';
import { HUD } from '../ui/HUD';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';
import { THEME } from '../config/colors';
import { getDifficulty, DifficultyLevel, applyDifficultyModifier } from '../config/difficulty';

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
  private currentDoor = 1;
  private currentStage = 1;
  private spawnPoint = { x: 50, y: 500 };
  
  // Modern systems
  private hud!: HUD;
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;
  private difficulty: DifficultyLevel = 'normal';
  private levelStartTime: number = 0;
  private currentDeaths: number = 0;
  private currentEnemiesDefeated: number = 0;
  private currentPowerupsCollected: number = 0;
  
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
  private isMobileDevice = false;
  
  // Game state
  private canDoubleJump = false;
  private hasShield = false;
  private gravityFlipped = false;
  private controlsReversed = false;
  private baseGravity = 1000;

  constructor() {
    super({ key: 'MainScene' });
  }

  init(data: { door: number; stage: number; difficulty?: DifficultyLevel }) {
    this.currentDoor = data.door || 1;
    this.currentStage = data.stage || 1;
    this.difficulty = data.difficulty || 'normal';
    this.deaths = 0;
    this.currentDeaths = 0;
    this.enemiesDefeated = 0;
    this.currentEnemiesDefeated = 0;
    this.currentPowerupsCollected = 0;
    this.startTime = Date.now();
    this.levelStartTime = 0;
    this.powerupManager.clear();
    this.gravityFlipped = false;
    this.controlsReversed = false;
    
    // Detect mobile device
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  create() {
    const width = this.cameras.main.width;

    // Set background to modern theme
    this.cameras.main.setBackgroundColor(THEME.background);

    // Initialize modern systems
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();
    this.hud = new HUD(this, this.scoreManager);
    this.hud.create();

    // Record level start time
    this.levelStartTime = Date.now();

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
    this.player.setDrag(0.9);
    
    // Apply difficulty modifier to gravity
    const difficultyModifier = applyDifficultyModifier(this.baseGravity, this.difficulty, 'gravityMultiplier');
    this.physics.world.gravity.y = difficultyModifier;

    // Create door FIRST before collider
    this.door = this.physics.add.sprite(level.door.x, level.door.y, 'door');
    this.door.setImmovable(true);
    this.door.setDisplayOrigin(0, 0);

    // Collisions - Platform collision
    this.physics.add.collider(this.player, this.platforms);
    
    // Spike collision
    this.physics.add.overlap(this.player, this.spikes, this.hitSpike, undefined, this);
    
    // Door collision
    this.physics.add.overlap(this.player, this.door, this.reachDoor, undefined, this);
    
    // Powerup collection
    this.powerups.forEach((powerup) => {
      this.physics.add.overlap(this.player, powerup.sprite, () => this.collectPowerup(powerup), undefined, this);
    });
    
    // Enemy collision
    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(this.player, enemy.sprite, () => this.hitEnemy(enemy), undefined, this);
    });
    
    // Obstacle collisions
    this.obstacles.forEach((obstacle) => {
      if (obstacle.getType() === 'gravity-flip' || obstacle.getType() === 'control-reverse') {
        this.physics.add.overlap(this.player, obstacle.sprite, () => this.handleObstacleCollision(obstacle), undefined, this);
      } else {
        this.physics.add.collider(this.player, obstacle.sprite, () => this.handleObstacleCollision(obstacle));
      }
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
    if (this.isMobileDevice) {
      this.createMobileControls();
    }
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

    // Create platforms with difficulty modifier
    const platformSizeModifier = applyDifficultyModifier(1, this.difficulty, 'platformSize');
    level.platforms.forEach((platform: PlatformData) => {
      const p = this.platforms.create(platform.x, platform.y, 'platform');
      const scaledWidth = (platform.width / 32) * platformSizeModifier;
      const scaledHeight = (platform.height / 32);
      p.setScale(scaledWidth, scaledHeight);
      p.refreshBody();
    });

    // Create spikes
    level.spikes.forEach((spike: SpikeData) => {
      this.spikes.create(spike.x, spike.y, 'spike');
    });
    
    // Create enemies with difficulty modifier
    const enemyCountModifier = applyDifficultyModifier(1, this.difficulty, 'enemyCount');
    const enemiesToSpawn = Math.ceil(level.enemies.length * enemyCountModifier);
    level.enemies.slice(0, enemiesToSpawn).forEach((enemyData) => {
      const enemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.type, 'enemy');
      this.enemies.push(enemy);
    });
    
    // Create powerups
    level.powerups.forEach((powerupData) => {
      const powerup = new Powerup(this, powerupData.x, powerupData.y, powerupData.type, 'powerup');
      this.powerups.push(powerup);
    });
    
    // Create obstacles
    level.obstacles.forEach((obstacleData) => {
      const obstacle = new Obstacle(this, obstacleData.x, obstacleData.y, obstacleData.type, obstacleData.properties);
      this.obstacles.push(obstacle);
    });
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
    if (!this.player || !this.player.body) {
      return;
    }

    // Calculate elapsed time
    const elapsed = (Date.now() - this.levelStartTime) / 1000;

    // Update HUD
    this.hud.update(
      this.currentDeaths,
      elapsed,
      this.currentDoor,
      this.currentStage,
      this.scoreManager.getStats().score,
      this.scoreManager.getComboText(),
      this.getPowerupStatus()
    );

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

    // Movement
    const baseSpeed = 200;
    const speedModifier = applyDifficultyModifier(1, this.difficulty, 'speedMultiplier');
    const speed = baseSpeed * speedModifier * this.powerupManager.getSpeedMultiplier();
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

    // Check if player is touching ground
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const isTouchingGround = body.touching.down || body.blocked.down;
    
    if (jump && isTouchingGround) {
      const jumpForce = this.gravityFlipped ? 400 : jumpVelocity;
      this.player.setVelocityY(jumpForce);
    }

    // Check if fell off map
    if (this.player.y > this.cameras.main.height + 50) {
      this.handlePlayerDeath();
    }
  }

  private getPowerupStatus(): string {
    const activePowerups = this.powerupManager.getActivePowerups();
    if (activePowerups.length === 0) return 'Powerups: None';
    return `Powerups: ${activePowerups.length}`;
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
        this.handlePlayerDeath();
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
    const difficultyModifier = applyDifficultyModifier(this.baseGravity, this.difficulty, 'gravityMultiplier');
    this.physics.world.gravity.y = this.gravityFlipped ? -difficultyModifier : difficultyModifier;
    this.player.setTint(this.gravityFlipped ? 0x00ccff : 0xffffff);
  }

  toggleControlReverse(): void {
    this.controlsReversed = !this.controlsReversed;
    this.player.setTint(this.controlsReversed ? 0xff00ff : 0xffffff);
  }

  hitSpike() {
    if (this.hasShield) {
      this.powerupManager.useShield();
      this.player.setTint(0xffaa00);
      this.time.delayedCall(200, () => {
        if (this.gravityFlipped) this.player.setTint(0x00ccff);
        else if (this.controlsReversed) this.player.setTint(0xff00ff);
        else this.player.clearTint();
      });
    } else {
      this.handlePlayerDeath();
    }
  }
  
  hitEnemy(enemy: Enemy) {
    if (this.hasShield) {
      this.powerupManager.useShield();
      enemy.dealDamage();
      this.currentEnemiesDefeated++;
      this.player.setTint(0xffaa00);
      this.time.delayedCall(200, () => {
        if (this.gravityFlipped) this.player.setTint(0x00ccff);
        else if (this.controlsReversed) this.player.setTint(0xff00ff);
        else this.player.clearTint();
      });
    } else {
      this.handlePlayerDeath();
    }
  }
  
  collectPowerup(powerup: Powerup) {
    const effect = powerup.collect();
    this.powerupManager.applyPowerup(effect);
    this.currentPowerupsCollected++;
    
    this.player.setTint(0xffff00);
    this.time.delayedCall(100, () => {
      if (this.gravityFlipped) this.player.setTint(0x00ccff);
      else if (this.controlsReversed) this.player.setTint(0xff00ff);
      else this.player.clearTint();
    });
  }

  private handlePlayerDeath() {
    this.currentDeaths++;
    this.scoreManager.resetCombo();
    
    this.cameras.main.flash(200, 255, 0, 0);
    
    this.gravityFlipped = false;
    this.controlsReversed = false;
    const difficultyModifier = applyDifficultyModifier(this.baseGravity, this.difficulty, 'gravityMultiplier');
    this.physics.world.gravity.y = difficultyModifier;
    this.player.clearTint();
    
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
  }

  reachDoor() {
    const timeElapsed = (Date.now() - this.levelStartTime) / 1000;
    
    // Calculate and add score
    const levelScore = this.scoreManager.completedLevel(
      timeElapsed,
      this.currentDeaths,
      this.currentDoor,
      this.currentStage,
      this.currentEnemiesDefeated,
      this.currentPowerupsCollected
    );

    // Check achievements
    const unlockedAchievements = this.achievementSystem.checkAchievements({
      time: timeElapsed,
      deaths: this.currentDeaths,
      door: this.currentDoor,
      stage: this.currentStage,
      combo: this.scoreManager.getStats().combo,
      powerupsCollected: this.currentPowerupsCollected,
      enemiesDefeated: this.currentEnemiesDefeated,
      isHardcore: this.difficulty === 'hardcore',
    });

    // Show level complete overlay
    const stats = this.scoreManager.getStats();
    this.hud.showLevelComplete(
      levelScore,
      stats.score,
      levelScore > stats.personalBest
    );

    // Display achievement notifications
    if (unlockedAchievements.length > 0) {
      this.showAchievementNotifications(unlockedAchievements);
    }

    // Delay scene transition to show overlay
    this.time.delayedCall(3000, () => {
      this.scene.start('GameOverScene', {
        door: this.currentDoor,
        stage: this.currentStage,
        deaths: this.currentDeaths,
        time: timeElapsed,
        enemiesDefeated: this.currentEnemiesDefeated,
        difficulty: this.difficulty,
        score: stats.score,
        achievements: unlockedAchievements,
      });
    });
  }

  private showAchievementNotifications(achievementIds: string[]): void {
    const width = this.cameras.main.width;
    let notificationY = 100;

    achievementIds.forEach((id) => {
      const achievement = this.achievementSystem.getAchievement(id as any);
      if (achievement) {
        const notification = this.add.text(
          width - 20,
          notificationY,
          `${achievement.icon} ${achievement.name} +${achievement.points}pts`,
          {
            fontSize: '14px',
            color: THEME.green,
            fontFamily: 'monospace',
            backgroundColor: THEME.primary,
            padding: { x: 10, y: 5 },
          }
        );
        notification.setOrigin(1, 0);
        notification.setScrollFactor(0);

        // Fade out animation
        this.tweens.add({
          targets: notification,
          alpha: 0,
          duration: 3000,
          delay: 2000,
          onComplete: () => {
            notification.destroy();
          },
        });

        notificationY += 40;
      }
    });
  }
}
