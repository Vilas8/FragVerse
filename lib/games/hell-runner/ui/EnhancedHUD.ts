/**
 * Enhanced HUD System - Level Devil Inspired
 * Professional UI with animations and visual effects
 */

import * as Phaser from 'phaser';
import { THEME } from '../config/colors';
import { ScoreManager } from './ScoreManager';

export class EnhancedHUD {
  private scene: Phaser.Scene;
  private scoreManager: ScoreManager;

  // HUD Elements
  private scoreText?: Phaser.GameObjects.Text;
  private timerText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;
  private deathsText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private powerupText?: Phaser.GameObjects.Text;
  private hudBackground?: Phaser.GameObjects.Graphics;
  private levelCounterBg?: Phaser.GameObjects.Graphics;
  private vignette?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, scoreManager: ScoreManager) {
    this.scene = scene;
    this.scoreManager = scoreManager;
  }

  /**
   * Create all HUD elements with enhanced visuals
   */
  create(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Create vignette effect
    this.createVignette(width, height);

    // Create stylized HUD background
    this.createStylizedBackground(width, height);

    // Top-center: Large level indicator (Level Devil style)
    this.createLevelCounter(width);

    // Top-left corner: Deaths with icon
    this.deathsText = this.scene.add.text(30, 25, '💀 0', {
      fontSize: '24px',
      color: THEME.danger,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.deathsText.setScrollFactor(0);
    this.deathsText.setDepth(100);

    // Top-right corner: Timer with icon
    this.timerText = this.scene.add.text(width - 30, 25, '⏱️ 0.0s', {
      fontSize: '24px',
      color: THEME.cyan,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.timerText.setOrigin(1, 0);
    this.timerText.setScrollFactor(0);
    this.timerText.setDepth(100);

    // Bottom-left: Score display
    this.scoreText = this.scene.add.text(30, height - 90, 'SCORE\n0000000', {
      fontSize: '18px',
      color: THEME.cyan,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'left',
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    // Bottom-left: Combo display
    this.comboText = this.scene.add.text(30, height - 50, '', {
      fontSize: '20px',
      color: THEME.orange,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.comboText.setScrollFactor(0);
    this.comboText.setDepth(100);

    // Bottom-right: Powerups
    this.powerupText = this.scene.add.text(width - 30, height - 60, '', {
      fontSize: '16px',
      color: THEME.green,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'right',
    });
    this.powerupText.setOrigin(1, 0);
    this.powerupText.setScrollFactor(0);
    this.powerupText.setDepth(100);
  }

  /**
   * Create vignette effect around screen edges
   */
  private createVignette(width: number, height: number): void {
    this.vignette = this.scene.add.graphics();
    
    // Create gradient vignette
    const vignetteSize = 150;
    
    // Top vignette
    this.vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.5, 0.5, 0, 0);
    this.vignette.fillRect(0, 0, width, vignetteSize);
    
    // Bottom vignette
    this.vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.5, 0.5);
    this.vignette.fillRect(0, height - vignetteSize, width, vignetteSize);
    
    // Left vignette
    this.vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0, 0.3, 0);
    this.vignette.fillRect(0, 0, vignetteSize, height);
    
    // Right vignette
    this.vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.3, 0, 0.3);
    this.vignette.fillRect(width - vignetteSize, 0, vignetteSize, height);
    
    this.vignette.setScrollFactor(0);
    this.vignette.setDepth(99);
  }

  /**
   * Create stylized background panels
   */
  private createStylizedBackground(width: number, height: number): void {
    this.hudBackground = this.scene.add.graphics();

    // Top bar with gradient
    this.hudBackground.fillGradientStyle(0x1a0f2e, 0x1a0f2e, 0x0a0410, 0x0a0410, 0.9, 0.9, 0.5, 0.5);
    this.hudBackground.fillRect(0, 0, width, 80);
    
    // Top accent line
    this.hudBackground.lineStyle(3, 0x00d9ff, 0.6);
    this.hudBackground.beginPath();
    this.hudBackground.moveTo(0, 80);
    this.hudBackground.lineTo(width, 80);
    this.hudBackground.strokePath();

    // Bottom bar with gradient
    this.hudBackground.fillGradientStyle(0x0a0410, 0x0a0410, 0x1a0f2e, 0x1a0f2e, 0.5, 0.5, 0.9, 0.9);
    this.hudBackground.fillRect(0, height - 120, width, 120);
    
    // Bottom accent line
    this.hudBackground.lineStyle(3, 0x00d9ff, 0.6);
    this.hudBackground.beginPath();
    this.hudBackground.moveTo(0, height - 120);
    this.hudBackground.lineTo(width, height - 120);
    this.hudBackground.strokePath();

    this.hudBackground.setScrollFactor(0);
    this.hudBackground.setDepth(98);
  }

  /**
   * Create Level Devil style level counter
   */
  private createLevelCounter(width: number): void {
    const centerX = width / 2;
    const topY = 15;

    // Background panel
    this.levelCounterBg = this.scene.add.graphics();
    
    // Main panel with rounded look
    this.levelCounterBg.fillStyle(0x2a1b3d, 0.95);
    this.levelCounterBg.fillRoundedRect(centerX - 150, topY, 300, 60, 15);
    
    // Outer glow
    this.levelCounterBg.lineStyle(3, 0x00d9ff, 0.8);
    this.levelCounterBg.strokeRoundedRect(centerX - 150, topY, 300, 60, 15);
    
    // Inner accent
    this.levelCounterBg.lineStyle(2, 0xa855f7, 0.4);
    this.levelCounterBg.strokeRoundedRect(centerX - 145, topY + 5, 290, 50, 12);
    
    this.levelCounterBg.setScrollFactor(0);
    this.levelCounterBg.setDepth(99);

    // Level text (will be updated)
    this.levelText = this.scene.add.text(centerX, topY + 30, 'DOOR 1 - STAGE 1', {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    });
    this.levelText.setOrigin(0.5);
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);

    // Pulsing animation
    this.scene.tweens.add({
      targets: this.levelCounterBg,
      alpha: { from: 0.95, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Update HUD with current game state
   */
  update(
    deaths: number,
    time: number,
    door: number,
    stage: number,
    score: number,
    combo: string,
    powerups: string
  ): void {
    // Update deaths with dynamic color
    if (this.deathsText) {
      this.deathsText.setText(`💀 ${deaths}`);
      const deathColor = deaths > 10 ? '#FF0000' : deaths > 5 ? '#FF4444' : THEME.danger;
      this.deathsText.setColor(deathColor);
      
      // Scale pulse on death increase
      if (deaths > 0) {
        const scale = 1 + Math.sin(Date.now() / 300) * 0.05;
        this.deathsText.setScale(scale);
      }
    }

    // Update timer with color based on speed
    if (this.timerText) {
      this.timerText.setText(`⏱️ ${time.toFixed(1)}s`);
      const timeColor = time < 15 ? THEME.green : time < 30 ? THEME.cyan : THEME.orange;
      this.timerText.setColor(timeColor);
    }

    // Update level indicator
    if (this.levelText) {
      this.levelText.setText(`DOOR ${door} - STAGE ${stage}`);
    }

    // Update score with formatted display
    if (this.scoreText) {
      this.scoreText.setText(`SCORE\n${this.scoreManager.formatScore(score)}`);
    }

    // Update combo with pulse effect
    if (this.comboText) {
      if (combo && combo !== 'No Combo') {
        this.comboText.setText(`🔥 ${combo}`);
        this.comboText.setVisible(true);
        
        // Pulse animation for high combos
        const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.1;
        this.comboText.setScale(pulseScale);
        
        // Rainbow effect for 5+ combos
        if (combo.includes('x')) {
          const comboNum = parseInt(combo);
          if (comboNum >= 5) {
            const hue = (Date.now() / 20) % 360;
            this.comboText.setTint(Phaser.Display.Color.HSVToRGB(hue / 360, 1, 1).color);
          }
        }
      } else {
        this.comboText.setVisible(false);
      }
    }

    // Update powerups
    if (this.powerupText) {
      if (powerups && powerups !== 'Powerups: None') {
        this.powerupText.setText(powerups.replace('Powerups:', '✨'));
        this.powerupText.setVisible(true);
      } else {
        this.powerupText.setVisible(false);
      }
    }
  }

  /**
   * Show enhanced level complete overlay
   */
  showLevelComplete(
    levelScore: number,
    totalScore: number,
    isPersonalBest: boolean
  ): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Dark overlay with fade-in
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, width, height);
    overlay.setScrollFactor(0);
    overlay.setDepth(200);

    this.scene.tweens.add({
      targets: overlay,
      alpha: 0.85,
      duration: 300,
    });

    // Main panel
    const panelBg = this.scene.add.graphics();
    panelBg.fillStyle(0x2a1b3d, 0.98);
    panelBg.fillRoundedRect(width / 2 - 300, height / 2 - 200, 600, 400, 20);
    panelBg.lineStyle(4, 0x00d9ff, 1);
    panelBg.strokeRoundedRect(width / 2 - 300, height / 2 - 200, 600, 400, 20);
    panelBg.setScrollFactor(0);
    panelBg.setDepth(201);
    panelBg.setAlpha(0);

    this.scene.tweens.add({
      targets: panelBg,
      alpha: 1,
      duration: 300,
      delay: 100,
    });

    // Title
    const completeText = this.scene.add.text(
      width / 2,
      height / 2 - 130,
      'LEVEL COMPLETE!',
      {
        fontSize: '56px',
        color: THEME.cyan,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      }
    );
    completeText.setOrigin(0.5);
    completeText.setScrollFactor(0);
    completeText.setDepth(202);
    completeText.setScale(0);

    this.scene.tweens.add({
      targets: completeText,
      scale: 1,
      duration: 400,
      delay: 200,
      ease: 'Back.easeOut',
    });

    // Score with animation
    const scoreText = this.scene.add.text(
      width / 2,
      height / 2 - 30,
      `+${this.scoreManager.formatScore(levelScore)}`,
      {
        fontSize: '48px',
        color: THEME.green,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setScrollFactor(0);
    scoreText.setDepth(202);
    scoreText.setAlpha(0);

    this.scene.tweens.add({
      targets: scoreText,
      alpha: 1,
      y: height / 2 - 10,
      duration: 500,
      delay: 400,
      ease: 'Power2',
    });

    // Total score
    const totalText = this.scene.add.text(
      width / 2,
      height / 2 + 50,
      `Total: ${this.scoreManager.formatScore(totalScore)}`,
      {
        fontSize: '28px',
        color: THEME.cyan,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    totalText.setOrigin(0.5);
    totalText.setScrollFactor(0);
    totalText.setDepth(202);
    totalText.setAlpha(0);

    this.scene.tweens.add({
      targets: totalText,
      alpha: 1,
      duration: 400,
      delay: 600,
    });

    // Personal best indicator
    if (isPersonalBest) {
      const pbText = this.scene.add.text(
        width / 2,
        height / 2 + 110,
        '⭐ NEW BEST! ⭐',
        {
          fontSize: '32px',
          color: THEME.orange,
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 5,
        }
      );
      pbText.setOrigin(0.5);
      pbText.setScrollFactor(0);
      pbText.setDepth(202);
      pbText.setScale(0);

      this.scene.tweens.add({
        targets: pbText,
        scale: 1.2,
        duration: 600,
        delay: 800,
        ease: 'Elastic.easeOut',
      });

      // Pulsing animation
      this.scene.tweens.add({
        targets: pbText,
        scale: { from: 1.2, to: 1.3 },
        duration: 800,
        delay: 1400,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  /**
   * Create particle burst effect
   */
  createParticleBurst(x: number, y: number, color: number): void {
    const particles = this.scene.add.particles(x, y, 'particle', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 20,
      tint: color,
    });
    particles.setDepth(150);

    this.scene.time.delayedCall(700, () => {
      particles.destroy();
    });
  }

  /**
   * Destroy HUD elements
   */
  destroy(): void {
    this.scoreText?.destroy();
    this.timerText?.destroy();
    this.levelText?.destroy();
    this.deathsText?.destroy();
    this.comboText?.destroy();
    this.powerupText?.destroy();
    this.hudBackground?.destroy();
    this.levelCounterBg?.destroy();
    this.vignette?.destroy();
  }
}
