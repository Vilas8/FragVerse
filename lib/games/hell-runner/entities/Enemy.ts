import * as Phaser from 'phaser';

export type EnemyType = 'walker' | 'jumper';

export interface EnemyData {
  x: number;
  y: number;
  type: EnemyType;
}

export class Enemy {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public type: EnemyType;
  private direction: number = 1; // 1 for right, -1 for left
  private speed: number;
  private jumpTimer: number = 0;
  private jumpInterval: number;
  private minX: number;
  private maxX: number;
  private isAlive: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: EnemyType,
    texture: string = 'enemy'
  ) {
    this.type = type;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0);

    // Set patrol boundaries
    this.minX = x - 150;
    this.maxX = x + 150;

    if (type === 'walker') {
      this.speed = 100;
      this.jumpInterval = 0; // Walkers don't jump
    } else {
      // Jumper
      this.speed = 80;
      this.jumpInterval = 1500; // Jump every 1.5 seconds
    }
  }

  update(delta: number): void {
    if (!this.isAlive) return;

    // Handle movement
    if (this.type === 'walker') {
      this.sprite.setVelocityX(this.direction * this.speed);
    } else if (this.type === 'jumper') {
      this.sprite.setVelocityX(this.direction * this.speed);
      this.updateJump(delta);
    }

    // Change direction at boundaries
    if (this.sprite.x <= this.minX) {
      this.direction = 1;
    } else if (this.sprite.x >= this.maxX) {
      this.direction = -1;
    }

    // Flip sprite based on direction
    this.sprite.setFlipX(this.direction === -1);
  }

  private updateJump(delta: number): void {
    this.jumpTimer += delta;
    
    if (this.jumpTimer >= this.jumpInterval) {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      // Check if touching ground using Phaser's built-in method
      if (body && body.touching && body.touching.down) {
        this.sprite.setVelocityY(-300);
        this.jumpTimer = 0;
      }
    }
  }

  dealDamage(): void {
    this.isAlive = false;
    this.sprite.setTint(0xff0000);
    this.sprite.setVelocity(0, -200);
    setTimeout(() => {
      this.sprite.destroy();
    }, 500);
  }

  destroy(): void {
    this.sprite.destroy();
    this.isAlive = false;
  }

  isActive(): boolean {
    return this.isAlive && this.sprite.active;
  }
}
