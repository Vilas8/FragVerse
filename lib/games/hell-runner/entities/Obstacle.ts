import * as Phaser from 'phaser';
import { ObstacleProperties } from '../types';

export type ObstacleType = 'disappearing' | 'saw' | 'popup-spike' | 'gravity-flip' | 'control-reverse' | 'fake-door' | 'teleport';

export interface ObstacleData {
  x: number;
  y: number;
  type: ObstacleType;
  width?: number;
  height?: number;
  properties?: ObstacleProperties;
}

export class Obstacle {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public type: ObstacleType;
  private isActive: boolean = true;
  private timer: number = 0;
  private properties: ObstacleProperties;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: ObstacleType,
    properties?: ObstacleProperties
  ) {
    this.type = type;
    this.properties = properties || {};

    let texture = 'obstacle';
    if (type === 'saw') texture = 'saw';
    else if (type === 'popup-spike') texture = 'spike';
    else if (type === 'fake-door') texture = 'door';
    else if (type === 'teleport') texture = 'teleport';

    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);

    // Setup based on type
    switch (type) {
      case 'disappearing':
        this.setupDisappearing();
        break;
      case 'saw':
        this.setupSaw();
        break;
      case 'popup-spike':
        this.setupPopupSpike();
        break;
      case 'gravity-flip':
        this.setupGravityFlip();
        break;
      case 'control-reverse':
        this.setupControlReverse();
        break;
      case 'fake-door':
        this.setupFakeDoor();
        break;
      case 'teleport':
        this.setupTeleport();
        break;
    }
  }

  private setupDisappearing(): void {
    this.sprite.setTint(0x888888);
  }

  private setupSaw(): void {
    this.sprite.setTint(0xffcc00);
    this.sprite.setScale(0.8);
  }

  private setupPopupSpike(): void {
    this.sprite.setAlpha(0.3);
    this.sprite.setActive(false);
  }

  private setupGravityFlip(): void {
    this.sprite.setTint(0x00ccff);
    this.sprite.setImmovable(true);
  }

  private setupControlReverse(): void {
    this.sprite.setTint(0xff00ff);
    this.sprite.setImmovable(true);
  }

  private setupFakeDoor(): void {
    this.sprite.setTint(0xff6666); // Reddish tint to indicate fake
  }

  private setupTeleport(): void {
    this.sprite.setTint(0x0000ff);
    this.sprite.setScale(0.6);
  }

  update(delta: number): void {
    if (!this.isActive) return;

    this.timer += delta;

    switch (this.type) {
      case 'disappearing':
        this.updateDisappearing();
        break;
      case 'saw':
        this.updateSaw();
        break;
      case 'popup-spike':
        this.updatePopupSpike();
        break;
      case 'teleport':
        this.updateTeleport();
        break;
    }
  }

  private updateDisappearing(): void {
    const disappearDelay = this.properties.disappearDelay || 2000;
    const reappearDelay = this.properties.reappearDelay || 1500;
    const cycleTime = disappearDelay + reappearDelay;
    const cycleProgress = this.timer % cycleTime;

    if (cycleProgress < disappearDelay) {
      // Visible
      this.sprite.setAlpha(1);
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      if (body && 'enable' in body) {
        (body as unknown as Record<string, unknown>)['enable'] = true;
      }
    } else {
      // Invisible and non-collidable
      this.sprite.setAlpha(0.2);
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      if (body && 'enable' in body) {
        (body as unknown as Record<string, unknown>)['enable'] = false;
      }
    }
  }

  private updateSaw(): void {
    this.sprite.rotation += 0.1;
    const speed = this.properties.speed || 100;
    // Direction is stored in properties but defaulted if not present
    const direction = (this.properties as Record<string, number | undefined>)['direction'] || 1;
    this.sprite.setVelocityX(direction * speed);
  }

  private updatePopupSpike(): void {
    const popupDelay = this.properties.popupDelay || 2000;
    // Visible duration stored as separate property
    const visibleDuration = (this.properties as Record<string, number | undefined>)['visibleDuration'] || 1000;
    const cycleTime = popupDelay + visibleDuration;
    const cycleProgress = this.timer % cycleTime;

    if (cycleProgress < popupDelay) {
      // Hidden
      this.sprite.setAlpha(0.1);
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      if (body && 'enable' in body) {
        (body as unknown as Record<string, unknown>)['enable'] = false;
      }
    } else {
      // Visible and active
      this.sprite.setAlpha(1);
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      if (body && 'enable' in body) {
        (body as unknown as Record<string, unknown>)['enable'] = true;
      }
    }
  }

  private updateTeleport(): void {
    // Pulsing animation
    const pulse = Math.sin(this.timer / 200) * 0.2 + 0.8;
    this.sprite.setAlpha(pulse);
    this.sprite.setScale(0.6 * pulse);
  }

  getType(): ObstacleType {
    return this.type;
  }

  getDestination(): { x: number; y: number } | null {
    if (this.type === 'teleport' && this.properties.destinationX !== undefined && this.properties.destinationY !== undefined) {
      return {
        x: this.properties.destinationX,
        y: this.properties.destinationY,
      };
    }
    return null;
  }

  isGravityFlip(): boolean {
    return this.type === 'gravity-flip';
  }

  isControlReverse(): boolean {
    return this.type === 'control-reverse';
  }

  isFakeDoor(): boolean {
    return this.type === 'fake-door';
  }

  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
