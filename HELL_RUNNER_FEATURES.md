# Hell Runner - Game Enhancement Features

## Overview

Hell Runner is a fast-paced platformer game with dynamic enemy AI, power-up system, and progressive difficulty. Escape through increasingly challenging levels while managing health, speed, and avoiding hazards.

## Recent Updates (January 2, 2026)

### ✨ New Features Added

#### 1. **Enemy AI System**
- **Walker Enemies**: Patrol platforms left and right, simple movement
  - Speed: 100 px/s
  - Patrol range: 150px from spawn point
  - Can be defeated if player has shield
  
- **Jumper Enemies**: More advanced AI that jumps periodically
  - Speed: 80 px/s
  - Jump interval: Every 1.5 seconds
  - Patrol range: 150px from spawn point
  - Adds dynamic challenge to levels

#### 2. **Power-Up System**
Three types of power-ups with different effects:

**Speed Boost** (Green) 🟢
- Increases movement speed by 1.5x
- Duration: 8 seconds
- Useful for quick escapes or covering long distances

**Shield** (Blue) 🔵
- Absorbs one hit from spikes or enemies
- Duration: 10 seconds
- Breaks on impact (visual feedback with orange tint)
- Can defeat enemies when shield is active

**Double Jump** (Yellow) 🟡
- Enables double jumping (NOT YET FULLY IMPLEMENTED)
- Duration: 6 seconds
- Future enhancement for aerial mobility

#### 3. **Scoring System**
Dynamic score calculation based on:
```
Final Score = Base (1000) - (Deaths × 50) + Time Bonus + Enemy Bonus

Time Bonus: max(0, (20 - Time_Taken) × 10)
Enemy Bonus: Enemies_Defeated × 100
```

#### 4. **Enhanced Level Design**
Each level now includes:
- Strategic platform placement
- Enemy spawning with varied AI types
- Power-up placement
- Spike traps and hazards
- Difficulty scaling per door/stage

**Level Progression:**
- **Door 1**: Tutorial levels (5 stages)
  - Stage 1: Simple platforming with speed boost
  - Stage 2: Spike hazards with jump enhancement
  - Stage 3: Elevated platforms with first enemy
  - Stage 4: Long jumps with speed boost
  - Stage 5: Multiple enemies and shields

- **Door 2**: Intermediate challenges (5 stages)
  - Stage 1: Spikes on platforms with enemies
  - Stage 2: Spike walls and jumper enemies
  - Stage 3: Narrow passages
  - Stage 4: Spike clusters with jumper enemies
  - Stage 5: Boss stage with 3 enemies and 2 shields

- **Door 3+**: Procedurally generated levels
  - Difficulty scales with door and stage number
  - Random enemy placement
  - Multiple power-up opportunities

#### 5. **Visual Improvements**
- **Sprite Updates**:
  - Player: Red rectangle with white eyes
  - Enemies: Purple with yellow eyes and angry mouth
  - Powerups: Yellow rotating star with floating animation
  - Platforms: Gray with shading detail
  - Spikes: Orange triangles
  - Door: Green with yellow handle

- **Animations**:
  - Power-up floating and rotation
  - Enemy sprite flipping based on direction
  - Shield break effect (orange tint)
  - Flash on damage/power-up collection

#### 6. **UI Enhancements**
- Real-time power-up display showing:
  - Active power-up types
  - Remaining duration for each
  - Format: "Powerups: speed(7.5s) shield(9.2s)"
  - Clears when no power-ups active

- Death counter with red text
- Timer with green text
- Level indicator
- Score calculation display with breakdown

#### 7. **Game Mechanics**

**Collision System:**
- Player collides with platforms (for jumping)
- Spikes: Instant death OR shield absorption
- Enemies: Same as spikes when shield inactive
- Door: Level completion trigger

**Movement System:**
- Base speed: 200 px/s (can be boosted to 300 px/s)
- Jump velocity: -400 px/s (upward)
- Gravity: 1000 px/s² (downward)
- World bounds collision

**Mobile Controls:**
- Left/Right movement buttons (red)
- Jump button (green, larger)
- Touch-responsive with visual feedback

## Technical Implementation

### New Files Added

```
lib/games/hell-runner/
├── types.ts                          # TypeScript interfaces
├── entities/
│   ├── Enemy.ts                      # Enemy AI class
│   └── Powerup.ts                    # Powerup system
├── levels/
│   └── LevelGenerator.ts             # Enhanced with enemies/powerups
└── scenes/
    ├── MainScene.ts                  # Full game logic
    ├── GameOverScene.ts              # Score calculation
    └── PreloadScene.ts               # Sprite generation
```

### Key Classes

#### `Enemy`
```typescript
class Enemy {
  sprite: Phaser.Physics.Arcade.Sprite
  type: 'walker' | 'jumper'
  update(delta: number): void
  dealDamage(): void
  isActive(): boolean
}
```

#### `Powerup`
```typescript
class Powerup {
  sprite: Phaser.Physics.Arcade.Sprite
  type: 'speed' | 'shield' | 'jump'
  collect(): PowerupEffect
  update(): void
}
```

#### `PowerupManager`
```typescript
class PowerupManager {
  applyPowerup(effect: PowerupEffect): void
  update(currentTime: number): void
  getSpeedMultiplier(): number
  hasActiveShield(): boolean
  getRemainingTime(type: PowerupType): number
}
```

## Gameplay Tips

1. **Speed Boost**: Use it to cross long spike fields quickly
2. **Shield**: Save it for boss stages with multiple enemies
3. **Timing**: Enemies follow predictable patrol patterns
4. **Score**: Focus on speed completion for higher scores
5. **Enemies**: Walkers are easier; avoid jumpers when shieldless

## Future Enhancements

- [ ] Implement Double Jump power-up fully
- [ ] Add sound effects and music
- [ ] Implement high score leaderboard
- [ ] Add particle effects
- [ ] Create additional enemy types (flying, stationary)
- [ ] Add boss encounters
- [ ] Implement level editor
- [ ] Add achievements system
- [ ] Create power-up combinations
- [ ] Add slow-motion power-up

## Performance Notes

- Sprites are generated procedurally (no image assets required)
- Supports up to 10+ enemies per level
- Physics calculations optimized with arcade physics
- Mobile-friendly with responsive controls
- Tested on 800x600 viewport

## Debugging

To enable physics debug mode, modify `MainScene` create method:
```typescript
arcade: {
  gravity: { y: 1000, x: 0 },
  debug: true,  // Set to true for debug visualization
}
```

## Credits

Developed using:
- [Phaser 3](https://phaser.io/) - Game framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Next.js](https://nextjs.org/) - React framework

---

**Last Updated:** January 2, 2026
**Version:** 2.0 (Enhanced with AI and Power-ups)
