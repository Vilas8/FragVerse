# Hell Runner Modernization - Integration Guide

## 🎯 Overview

This guide walks you through integrating the new modern systems into your Hell Runner game.

---

## 📂 New File Structure

```
lib/games/hell-runner/
├── config/
│   ├── colors.ts          ✅ Modern color theme
│   ├── difficulty.ts      ✅ 4 difficulty levels
│   └── constants.ts       (existing)
├── ui/
│   ├── HUD.ts             ✅ Modern HUD system
│   ├── ScoreManager.ts    ✅ Scoring & stats
│   └── AchievementSystem.ts ✅ Badges & achievements
└── scenes/
    ├── MainScene.ts       (needs updates)
    ├── GameOverScene.ts   (needs updates)
    └── MenuScene.ts       (new - optional)
```

---

## 🔧 Integration Steps

### Step 1: Update MainScene

**File**: `lib/games/hell-runner/scenes/MainScene.ts`

Add imports at the top:

```typescript
import { HUD } from '../ui/HUD';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';
import { THEME } from '../config/colors';
import { getDifficulty, DifficultyLevel } from '../config/difficulty';
```

Add properties to the class:

```typescript
export class MainScene extends Phaser.Scene {
  // ... existing properties ...

  private hud!: HUD;
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;
  private difficulty: DifficultyLevel = 'normal';
  private levelStartTime: number = 0;
  private currentDeaths: number = 0;
  private currentEnemiesDefeated: number = 0;
  private currentPowerupsCollected: number = 0;
}
```

Update the `create()` method:

```typescript
create() {
  // ... existing setup code ...

  // Initialize new systems
  this.scoreManager = new ScoreManager();
  this.achievementSystem = new AchievementSystem();
  this.hud = new HUD(this, this.scoreManager);
  this.hud.create();

  // Set background color to match new theme
  this.cameras.main.setBackgroundColor(THEME.background);

  // Record level start time
  this.levelStartTime = 0;
  this.currentDeaths = 0;

  // ... rest of existing code ...
}
```

Update the `update()` method:

```typescript
update(time: number, delta: number) {
  // ... existing update code ...

  // Update HUD
  const elapsed = (Date.now() - this.levelStartTime) / 1000;
  this.hud.update(
    this.currentDeaths,
    elapsed,
    this.currentDoor,
    this.currentStage,
    this.scoreManager.getStats().score,
    this.scoreManager.getComboText(),
    this.getPowerupStatus(),
  );
}
```

### Step 2: Handle Player Death

Update the death handler:

```typescript
private handlePlayerDeath() {
  this.currentDeaths++;
  this.scoreManager.resetCombo();
  // ... existing death code ...
}
```

### Step 3: Handle Level Completion

Update the level completion handler:

```typescript
private handleLevelComplete() {
  const elapsedTime = (Date.now() - this.levelStartTime) / 1000;
  
  // Calculate and add score
  const levelScore = this.scoreManager.completedLevel(
    elapsedTime,
    this.currentDeaths,
    this.currentDoor,
    this.currentStage,
    this.currentEnemiesDefeated,
    this.currentPowerupsCollected
  );

  // Check achievements
  const unlockedAchievements = this.achievementSystem.checkAchievements({
    time: elapsedTime,
    deaths: this.currentDeaths,
    door: this.currentDoor,
    stage: this.currentStage,
    isHardcore: this.difficulty === 'hardcore',
  });

  // Show level complete overlay
  const stats = this.scoreManager.getStats();
  this.hud.showLevelComplete(
    levelScore,
    stats.score,
    levelScore > stats.personalBest
  );

  // Display unlocked achievements
  if (unlockedAchievements.length > 0) {
    this.showAchievementNotifications(unlockedAchievements);
  }

  // ... existing completion code ...
}
```

### Step 4: Create Menu Scene (Optional but Recommended)

**File**: `lib/games/hell-runner/scenes/MenuScene.ts`

```typescript
import * as Phaser from 'phaser';
import { THEME } from '../config/colors';
import { DIFFICULTIES, DifficultyLevel } from '../config/difficulty';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor(THEME.background);

    // Title
    this.add.text(400, 50, 'HELL RUNNER', {
      fontSize: '48px',
      color: THEME.cyan,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    });

    // Difficulty selection
    let y = 150;
    Object.entries(DIFFICULTIES).forEach(([key, config]) => {
      const button = this.add.text(400, y, `${config.name} - ${config.description}`, {
        fontSize: '16px',
        color: THEME.text,
        fontFamily: 'monospace',
        align: 'center',
        padding: { x: 20, y: 10 },
        backgroundColor: THEME.primary,
      });
      button.setOrigin(0.5);
      button.setInteractive();
      button.on('pointerup', () => {
        this.scene.start('MainScene', { difficulty: key as DifficultyLevel });
      });
      y += 60;
    });
  }
}
```

### Step 5: Update Game Over Scene

**File**: `lib/games/hell-runner/scenes/GameOverScene.ts`

```typescript
import { THEME } from '../config/colors';
import { ScoreManager } from '../ui/ScoreManager';
import { AchievementSystem } from '../ui/AchievementSystem';

export class GameOverScene extends Phaser.Scene {
  private scoreManager!: ScoreManager;
  private achievementSystem!: AchievementSystem;

  create(data: any) {
    this.cameras.main.setBackgroundColor(THEME.background);
    this.scoreManager = new ScoreManager();
    this.achievementSystem = new AchievementSystem();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Game Over title
    this.add.text(width / 2, 50, 'GAME OVER', {
      fontSize: '48px',
      color: THEME.danger,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // Stats display
    let statsY = 150;
    const stats = this.scoreManager.getStats();
    const statsText = [
      `Final Score: ${this.scoreManager.formatScore(stats.score)}`,
      `Time: ${stats.time.toFixed(1)}s`,
      `Deaths: ${stats.deaths}`,
      `Combo: ${stats.combo}x`,
      `Personal Best: ${this.scoreManager.formatScore(stats.personalBest)}`,
    ];

    statsText.forEach((text) => {
      this.add.text(width / 2, statsY, text, {
        fontSize: '18px',
        color: THEME.text,
        fontFamily: 'monospace',
        align: 'center',
      }).setOrigin(0.5);
      statsY += 40;
    });

    // Achievements display
    const achievements = this.achievementSystem.getUnlockedAchievements();
    if (achievements.length > 0) {
      this.add.text(width / 2, statsY + 20, 'Recent Achievements', {
        fontSize: '16px',
        color: THEME.cyan,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        align: 'center',
      }).setOrigin(0.5);

      statsY += 60;
      achievements.slice(-3).forEach((achievement) => {
        this.add.text(width / 2, statsY, `${achievement.icon} ${achievement.name}`, {
          fontSize: '14px',
          color: THEME.green,
          fontFamily: 'monospace',
          align: 'center',
        }).setOrigin(0.5);
        statsY += 30;
      });
    }

    // Restart button
    const restartButton = this.add.text(width / 2, height - 100, 'RESTART', {
      fontSize: '24px',
      color: THEME.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
      padding: { x: 30, y: 15 },
      backgroundColor: THEME.primary,
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}
```

### Step 6: Update Boot Scene

Add new scenes to your boot configuration:

```typescript
// In your main game file or boot scene
const config = {
  // ... existing config ...
  scene: [
    PreloadScene,
    MainScene,
    GameOverScene,
    // MenuScene,  // Optional
  ],
};
```

---

## 📊 Difficulty Application

When applying difficulty modifiers to game elements:

```typescript
import { applyDifficultyModifier } from '../config/difficulty';

// Example: Create platforms with difficulty-based size
private createPlatforms() {
  const basePlatformWidth = 80;
  const modifiedWidth = applyDifficultyModifier(
    basePlatformWidth,
    this.difficulty,
    'platformSize'
  );
  // Use modifiedWidth for platform creation
}
```

---

## 🎮 Helper Methods

Add these useful methods to MainScene:

```typescript
/**
 * Get current powerup status text
 */
private getPowerupStatus(): string {
  if (this.currentPowerupsCollected === 0) return 'Powerups: None';
  return `Powerups: ${this.currentPowerupsCollected}`;
}

/**
 * Show achievement unlock notification
 */
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
```

---

## 🧪 Testing Checklist

- [ ] HUD displays correctly with new colors
- [ ] Score updates on level completion
- [ ] Combo system works (increases on no-death, resets on death)
- [ ] Difficulty modifiers apply correctly
- [ ] Achievements unlock properly
- [ ] Stats persist after page reload
- [ ] Colors match theme throughout
- [ ] Game over screen shows updated stats
- [ ] Menu difficulty selection works

---

## 📝 Customization Examples

### Change Primary Colors

Edit `config/colors.ts`:

```typescript
export const THEME = {
  background: '#000000',  // Your custom black
  primary: '#1a1a2e',     // Your custom dark
  cyan: '#ff00ff',        // Your custom accent
  // ... etc
};
```

### Adjust Scoring Formula

Edit `ui/ScoreManager.ts` - `calculateLevelScore()` method:

```typescript
private basePoints = 2000;  // Change base points
// Modify multiplier calculations as needed
```

### Add New Achievements

Edit `ui/AchievementSystem.ts`:

```typescript
// Add to AchievementId type
export type AchievementId = 'first_level' | ... | 'my_new_achievement';

// Add to ACHIEVEMENTS const
my_new_achievement: {
  id: 'my_new_achievement',
  name: '🎯 New Achievement',
  description: 'Achievement description',
  icon: '🎯',
  points: 100,
},

// Add unlock check in checkAchievements()
if (customCondition && this.unlock('my_new_achievement')) {
  unlocked.push('my_new_achievement');
}
```

---

## ✅ Verification

After integration, verify:

1. **Colors**: All UI matches THEME colors
2. **Scoring**: Score calculates correctly based on difficulty
3. **Persistence**: Stats saved and loaded from localStorage
4. **Achievements**: All 12 achievements can be unlocked
5. **Difficulty**: Modifiers apply to gameplay elements
6. **HUD**: All information displays and updates in real-time

---

## 🐛 Common Issues & Solutions

### Issue: HUD elements not showing
**Solution**: Ensure `hud.create()` is called in `create()` method and HUD depth is set correctly

### Issue: Score not updating
**Solution**: Call `scoreManager.completedLevel()` when level is finished

### Issue: Stats not persisting
**Solution**: Check browser localStorage is enabled, verify localStorage methods aren't throwing errors

### Issue: Achievements not unlocking
**Solution**: Ensure `achievementSystem.checkAchievements()` is called after level completion with correct stats

### Issue: Colors look different
**Solution**: Clear browser cache, ensure THEME is imported from correct path

---

## 🚀 Ready to Launch!

Once all integration steps are complete, your Hell Runner will have:

✅ Professional modern visuals  
✅ Engaging scoring system  
✅ Multiple difficulty levels  
✅ Achievement system  
✅ Persistent player progression  
✅ Professional-quality UI  

Enjoy your modernized Hell Runner! 🎉
