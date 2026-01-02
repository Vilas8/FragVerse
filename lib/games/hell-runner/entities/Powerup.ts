import Phaser from 'phaser';

export type PowerupType = 'speed' | 'shield' | 'jump';

export interface PowerupData {
  x: number;
  y: number;
  type: PowerupType;
}

export interface PowerupEffect {
  type: PowerupType;
  duration: number; // in milliseconds
  appliedTime: number;
}

export class Powerup {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public type: PowerupType;
  public collected: boolean = false;
  private floatOffset: number = 0;
  private floatSpeed: number = 0.05;
  private originalY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: PowerupType,
    texture: string = 'powerup'
  ) {
    this.type = type;
    this.originalY = y;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setImmovable(true);
    this.sprite.setCollideWorldBounds(true);
    
    // Set tint based on type
    switch (type) {
      case 'speed':
        this.sprite.setTint(0x00ff00); // Green
        break;
      case 'shield':
        this.sprite.setTint(0x0000ff); // Blue
        break;
      case 'jump':
        this.sprite.setTint(0xffff00); // Yellow
        break;
    }
  }

  update(): void {
    if (this.collected) return;

    // Floating animation
    this.floatOffset += this.floatSpeed;
    this.sprite.y = this.originalY + Math.sin(this.floatOffset) * 10;

    // Rotation
    this.sprite.rotation += 0.02;
  }

  collect(): PowerupEffect {
    this.collected = true;
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    
    // Return effect data
    return {
      type: this.type,
      duration: this.getPowerupDuration(),
      appliedTime: Date.now(),
    };
  }

  private getPowerupDuration(): number {
    switch (this.type) {
      case 'speed':
        return 8000; // 8 seconds
      case 'shield':
        return 10000; // 10 seconds (can take 1 hit)
      case 'jump':
        return 6000; // 6 seconds
      default:
        return 5000;
    }
  }

  destroy(): void {
    this.sprite.destroy();
  }
}

export class PowerupManager {
  private activePowerups: Map<string, PowerupEffect> = new Map();
  private speedBoost: number = 1;
  private hasShield: boolean = false;
  private canDoubleJump: boolean = false;

  applyPowerup(effect: PowerupEffect): void {
    const effectKey = effect.type;
    this.activePowerups.set(effectKey, effect);

    switch (effect.type) {
      case 'speed':
        this.speedBoost = 1.5;
        break;
      case 'shield':
        this.hasShield = true;
        break;
      case 'jump':
        this.canDoubleJump = true;
        break;
    }
  }

  update(currentTime: number): void {
    const expiredPowerups: string[] = [];

    this.activePowerups.forEach((effect, key) => {
      if (currentTime - effect.appliedTime > effect.duration) {
        expiredPowerups.push(key);
      }
    });

    expiredPowerups.forEach((key) => {
      this.activePowerups.delete(key);
      this.deactivatePowerup(key as PowerupType);
    });
  }

  private deactivatePowerup(type: PowerupType): void {
    switch (type) {
      case 'speed':
        this.speedBoost = 1;
        break;
      case 'shield':
        this.hasShield = false;
        break;
      case 'jump':
        this.canDoubleJump = false;
        break;
    }
  }

  getSpeedMultiplier(): number {
    return this.speedBoost;
  }

  hasActiveShield(): boolean {
    return this.hasShield;
  }

  useShield(): void {
    if (this.hasShield) {
      this.hasShield = false;
      this.activePowerups.delete('shield');
    }
  }

  canDoubleJumpNow(): boolean {
    return this.canDoubleJump;
  }

  getActivePowerups(): PowerupType[] {
    return Array.from(this.activePowerups.keys()) as PowerupType[];
  }

  getRemainingTime(type: PowerupType): number {
    const effect = this.activePowerups.get(type);
    if (!effect) return 0;
    const remaining = effect.duration - (Date.now() - effect.appliedTime);
    return Math.max(0, remaining);
  }

  clear(): void {
    this.activePowerups.clear();
    this.speedBoost = 1;
    this.hasShield = false;
    this.canDoubleJump = false;
  }
}
