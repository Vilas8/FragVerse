// Level Generator for Hell Runner
// Creates procedural levels based on door and stage number

import { LevelData } from '../types';

export function createLevel(door: number, stage: number): LevelData {
  // Base level structure
  const level: LevelData = {
    spawnPoint: { x: 50, y: 500 },
    platforms: [],
    spikes: [],
    enemies: [],
    powerups: [],
    obstacles: [],
    door: { x: 750, y: 520 },
  };

  // Ground platform
  level.platforms.push({ x: 400, y: 580, width: 800, height: 32 });

  // Generate level based on door and stage
  switch (door) {
    case 1:
      return generateDoor1(level, stage);
    case 2:
      return generateDoor2(level, stage);
    case 3:
      return generateDoor3(level, stage);
    case 4:
      return generateDoor4(level, stage);
    case 5:
      return generateDoor5(level, stage);
    case 6:
      return generateDoor6(level, stage);
    case 7:
      return generateDoor7(level, stage);
    case 8:
      return generateDoor8(level, stage);
    default:
      return generateRandomLevel(level, door, stage);
  }
}

// Door 1: Basic platforming (learning the controls)
function generateDoor1(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 300, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 400, y: 430, type: 'speed' });
      break;
    case 2:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.spikes.push({ x: 300, y: 548 });
      level.spikes.push({ x: 332, y: 548 });
      level.platforms.push({ x: 450, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 430, type: 'jump' });
      break;
    case 3:
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      level.platforms.push({ x: 350, y: 360, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 300, width: 64, height: 32 });
      level.platforms.push({ x: 650, y: 420, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 310, type: 'shield' });
      level.enemies.push({ x: 275, y: 365, type: 'walker' });
      break;
    case 4:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 8; i++) {
        level.spikes.push({ x: 250 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 375, y: 430, type: 'speed' });
      break;
    case 5:
      for (let i = 0; i < 5; i++) {
        level.platforms.push({ x: 150 + i * 120, y: 450 - i * 20, width: 64, height: 32 });
      }
      level.enemies.push({ x: 210, y: 415, type: 'jumper' });
      level.enemies.push({ x: 450, y: 415, type: 'walker' });
      level.powerups.push({ x: 330, y: 380, type: 'shield' });
      break;
  }
  return level;
}

// Door 2: Intermediate challenges
function generateDoor2(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 200, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 200, y: 448 });
      level.platforms.push({ x: 400, y: 400, width: 64, height: 32 });
      level.platforms.push({ x: 600, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 600, y: 448 });
      level.powerups.push({ x: 400, y: 350, type: 'shield' });
      level.enemies.push({ x: 500, y: 350, type: 'walker' });
      break;
    case 2:
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      for (let i = 0; i < 5; i++) {
        level.spikes.push({ x: 330, y: 480 - i * 32 });
      }
      level.platforms.push({ x: 500, y: 420, width: 64, height: 32 });
      level.powerups.push({ x: 250, y: 370, type: 'jump' });
      level.enemies.push({ x: 550, y: 370, type: 'jumper' });
      break;
    case 3:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 300, y: 380, width: 128, height: 32 });
      level.spikes.push({ x: 268, y: 348 });
      level.spikes.push({ x: 300, y: 348 });
      level.spikes.push({ x: 332, y: 348 });
      level.platforms.push({ x: 550, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 300, y: 330, type: 'speed' });
      level.enemies.push({ x: 200, y: 415, type: 'walker' });
      break;
    case 4:
      level.platforms.push({ x: 120, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 10; i++) {
        level.spikes.push({ x: 200 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 360, y: 430, type: 'speed' });
      level.enemies.push({ x: 300, y: 430, type: 'jumper' });
      break;
    case 5:
      level.platforms.push({ x: 150, y: 420, width: 64, height: 32 });
      level.platforms.push({ x: 300, y: 350, width: 64, height: 32 });
      level.spikes.push({ x: 268, y: 318 });
      level.platforms.push({ x: 450, y: 420, width: 64, height: 32 });
      level.spikes.push({ x: 418, y: 388 });
      level.platforms.push({ x: 600, y: 350, width: 64, height: 32 });
      level.powerups.push({ x: 300, y: 300, type: 'shield' });
      level.powerups.push({ x: 450, y: 370, type: 'shield' });
      level.enemies.push({ x: 225, y: 385, type: 'walker' });
      level.enemies.push({ x: 375, y: 315, type: 'jumper' });
      level.enemies.push({ x: 525, y: 385, type: 'walker' });
      break;
  }
  return level;
}

// Door 3: TROLL MECHANICS - Disappearing Platforms
function generateDoor3(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 350, y: 480, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 1500, reappearDelay: 1500 }
      });
      level.obstacles.push({
        x: 500, y: 480, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 1000, reappearDelay: 2000 }
      });
      level.powerups.push({ x: 425, y: 430, type: 'speed' });
      break;
    case 2:
      level.obstacles.push({
        x: 200, y: 420, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 2000, reappearDelay: 1000 }
      });
      level.obstacles.push({
        x: 350, y: 360, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 1500, reappearDelay: 1500 }
      });
      level.obstacles.push({
        x: 500, y: 300, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 1000, reappearDelay: 2000 }
      });
      level.obstacles.push({
        x: 650, y: 420, type: 'disappearing', width: 64, height: 32,
        properties: { disappearDelay: 1500, reappearDelay: 1500 }
      });
      level.powerups.push({ x: 350, y: 310, type: 'shield' });
      break;
    case 3:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 4; i++) {
        level.obstacles.push({
          x: 250 + i * 100, y: 420 - (i % 2) * 60, type: 'disappearing', width: 64, height: 32,
          properties: { disappearDelay: 800 + i * 200, reappearDelay: 1200 }
        });
      }
      level.powerups.push({ x: 400, y: 350, type: 'speed' });
      break;
    case 4:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 6; i++) {
        level.obstacles.push({
          x: 180 + i * 100, y: 400 - (i % 3) * 40, type: 'disappearing', width: 64, height: 32,
          properties: { disappearDelay: 600 + i * 100, reappearDelay: 800 }
        });
      }
      level.enemies.push({ x: 300, y: 350, type: 'walker' });
      level.powerups.push({ x: 500, y: 320, type: 'shield' });
      break;
    case 5:
      for (let i = 0; i < 5; i++) {
        level.obstacles.push({
          x: 150 + i * 120, y: 450 - i * 20, type: 'disappearing', width: 64, height: 32,
          properties: { disappearDelay: 500 + i * 200, reappearDelay: 600 + i * 100 }
        });
      }
      level.enemies.push({ x: 250, y: 400, type: 'jumper' });
      level.enemies.push({ x: 550, y: 400, type: 'walker' });
      level.powerups.push({ x: 350, y: 360, type: 'shield' });
      break;
  }
  return level;
}

// Door 4: Saw Blades & Popup Spikes
function generateDoor4(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 350, y: 450, type: 'saw', width: 20, height: 20,
        properties: { speed: 80, direction: 1 }
      });
      level.platforms.push({ x: 500, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 425, y: 420, type: 'shield' });
      break;
    case 2:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 480, type: 'saw', properties: { speed: 100, direction: 1 }
      });
      level.obstacles.push({
        x: 450, y: 480, type: 'saw', properties: { speed: 100, direction: -1 }
      });
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 375, y: 420, type: 'shield' });
      break;
    case 3:
      level.platforms.push({ x: 150, y: 400, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 380, type: 'popup-spike',
        properties: { popupDelay: 2000, visibleDuration: 1000 }
      });
      level.obstacles.push({
        x: 450, y: 380, type: 'popup-spike',
        properties: { popupDelay: 1500, visibleDuration: 1200 }
      });
      level.platforms.push({ x: 600, y: 400, width: 64, height: 32 });
      level.powerups.push({ x: 375, y: 330, type: 'speed' });
      break;
    case 4:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 250, y: 450, type: 'saw', properties: { speed: 120, direction: 1 }
      });
      level.obstacles.push({
        x: 400, y: 420, type: 'popup-spike',
        properties: { popupDelay: 1200, visibleDuration: 800 }
      });
      level.obstacles.push({
        x: 550, y: 450, type: 'saw', properties: { speed: 120, direction: -1 }
      });
      level.enemies.push({ x: 300, y: 350, type: 'jumper' });
      level.powerups.push({ x: 375, y: 350, type: 'shield' });
      break;
    case 5:
      for (let i = 0; i < 3; i++) {
        level.obstacles.push({
          x: 200 + i * 200, y: 480, type: 'saw', properties: { speed: 100 + i * 20, direction: i % 2 === 0 ? 1 : -1 }
        });
      }
      for (let i = 0; i < 2; i++) {
        level.obstacles.push({
          x: 300 + i * 200, y: 380, type: 'popup-spike',
          properties: { popupDelay: 1500 - i * 300, visibleDuration: 1000 }
        });
      }
      level.enemies.push({ x: 300, y: 350, type: 'walker' });
      level.enemies.push({ x: 550, y: 350, type: 'walker' });
      level.powerups.push({ x: 400, y: 310, type: 'shield' });
      break;
  }
  return level;
}

// Door 5: Gravity Flip & Control Reverse
function generateDoor5(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 350, y: 300, type: 'gravity-flip', width: 128, height: 32
      });
      level.platforms.push({ x: 500, y: 100, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 250, type: 'shield' });
      break;
    case 2:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 300, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 400, y: 120, width: 64, height: 32 });
      level.obstacles.push({
        x: 550, y: 280, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 200, type: 'shield' });
      break;
    case 3:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 350, y: 350, type: 'control-reverse', width: 100, height: 32
      });
      level.platforms.push({ x: 500, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 300, type: 'speed' });
      break;
    case 4:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 250, y: 300, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 350, y: 100, width: 64, height: 32 });
      level.obstacles.push({
        x: 500, y: 330, type: 'control-reverse', width: 100, height: 32
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 300, y: 250, type: 'walker' });
      level.powerups.push({ x: 350, y: 50, type: 'shield' });
      break;
    case 5:
      for (let i = 0; i < 2; i++) {
        level.obstacles.push({
          x: 250 + i * 300, y: 300 - i * 100, type: 'gravity-flip', width: 100, height: 32
        });
      }
      level.obstacles.push({
        x: 400, y: 380, type: 'control-reverse', width: 100, height: 32
      });
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 300, y: 250, type: 'jumper' });
      level.enemies.push({ x: 500, y: 250, type: 'walker' });
      level.powerups.push({ x: 400, y: 250, type: 'shield' });
      break;
  }
  return level;
}

// Door 6: Fake Doors & Teleports
function generateDoor6(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 400, y: 450, type: 'fake-door'
      });
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 400, y: 380, type: 'speed' });
      break;
    case 2:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 450, type: 'teleport',
        properties: { destinationX: 500, destinationY: 480 }
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 400, y: 380, type: 'shield' });
      break;
    case 3:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 400, type: 'teleport',
        properties: { destinationX: 450, destinationY: 480 }
      });
      level.obstacles.push({
        x: 500, y: 430, type: 'fake-door'
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 375, y: 350, type: 'shield' });
      break;
    case 4:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 250, y: 430, type: 'teleport',
        properties: { destinationX: 400, destinationY: 380 }
      });
      level.platforms.push({ x: 400, y: 380, width: 64, height: 32 });
      level.obstacles.push({
        x: 550, y: 430, type: 'fake-door'
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 300, y: 350, type: 'walker' });
      level.powerups.push({ x: 400, y: 300, type: 'shield' });
      break;
    case 5:
      level.platforms.push({ x: 120, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 250, y: 430, type: 'teleport',
        properties: { destinationX: 400, destinationY: 300 }
      });
      level.platforms.push({ x: 400, y: 300, width: 64, height: 32 });
      level.obstacles.push({
        x: 520, y: 360, type: 'fake-door'
      });
      level.obstacles.push({
        x: 620, y: 360, type: 'teleport',
        properties: { destinationX: 670, destinationY: 480 }
      });
      level.platforms.push({ x: 670, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 300, y: 350, type: 'jumper' });
      level.enemies.push({ x: 500, y: 250, type: 'walker' });
      level.powerups.push({ x: 400, y: 200, type: 'shield' });
      break;
  }
  return level;
}

// Door 7: Chaos Remix (Mix of everything)
function generateDoor7(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 250, y: 450, type: 'disappearing', properties: { disappearDelay: 1200, reappearDelay: 1200 }
      });
      level.obstacles.push({
        x: 380, y: 480, type: 'saw', properties: { speed: 100, direction: 1 }
      });
      level.platforms.push({ x: 550, y: 450, width: 64, height: 32 });
      level.powerups.push({ x: 380, y: 380, type: 'shield' });
      break;
    case 2:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 300, y: 350, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 400, y: 150, width: 64, height: 32 });
      level.obstacles.push({
        x: 550, y: 400, type: 'popup-spike', properties: { popupDelay: 1500, visibleDuration: 1000 }
      });
      level.platforms.push({ x: 650, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 300, y: 300, type: 'walker' });
      level.powerups.push({ x: 400, y: 80, type: 'shield' });
      break;
    case 3:
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 280, y: 450, type: 'saw', properties: { speed: 120, direction: 1 }
      });
      level.obstacles.push({
        x: 420, y: 420, type: 'disappearing', properties: { disappearDelay: 1000, reappearDelay: 1500 }
      });
      level.obstacles.push({
        x: 550, y: 450, type: 'teleport', properties: { destinationX: 650, destinationY: 480 }
      });
      level.platforms.push({ x: 680, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 420, y: 350, type: 'speed' });
      break;
    case 4:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 220, y: 450, type: 'disappearing', properties: { disappearDelay: 800, reappearDelay: 800 }
      });
      level.obstacles.push({
        x: 350, y: 300, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 450, y: 120, width: 64, height: 32 });
      level.obstacles.push({
        x: 580, y: 430, type: 'saw', properties: { speed: 100, direction: -1 }
      });
      level.platforms.push({ x: 680, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 250, y: 400, type: 'jumper' });
      level.enemies.push({ x: 550, y: 350, type: 'walker' });
      level.powerups.push({ x: 350, y: 200, type: 'shield' });
      break;
    case 5:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 2; i++) {
        level.obstacles.push({
          x: 220 + i * 200, y: 450 - i * 50, type: 'disappearing',
          properties: { disappearDelay: 600 + i * 300, reappearDelay: 800 }
        });
      }
      level.obstacles.push({
        x: 350, y: 300, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 450, y: 100, width: 64, height: 32 });
      level.obstacles.push({
        x: 580, y: 380, type: 'popup-spike', properties: { popupDelay: 1200, visibleDuration: 1000 }
      });
      level.obstacles.push({
        x: 680, y: 430, type: 'teleport', properties: { destinationX: 700, destinationY: 480 }
      });
      level.enemies.push({ x: 250, y: 380, type: 'walker' });
      level.enemies.push({ x: 450, y: 30, type: 'walker' });
      level.enemies.push({ x: 600, y: 300, type: 'jumper' });
      level.powerups.push({ x: 350, y: 200, type: 'shield' });
      level.powerups.push({ x: 500, y: 200, type: 'shield' });
      break;
  }
  return level;
}

// Door 8: MEGA CHAOS - All mechanics combined
function generateDoor8(level: LevelData, stage: number): LevelData {
  // Super hard levels with everything mixed
  switch (stage) {
    case 1:
      level.platforms.push({ x: 100, y: 480, width: 64, height: 32 });
      level.obstacles.push({
        x: 220, y: 450, type: 'disappearing', properties: { disappearDelay: 700, reappearDelay: 1000 }
      });
      level.obstacles.push({
        x: 350, y: 300, type: 'gravity-flip', width: 100, height: 32
      });
      level.platforms.push({ x: 450, y: 100, width: 64, height: 32 });
      level.obstacles.push({
        x: 550, y: 430, type: 'saw', properties: { speed: 150, direction: 1 }
      });
      level.obstacles.push({
        x: 680, y: 430, type: 'teleport', properties: { destinationX: 700, destinationY: 480 }
      });
      level.platforms.push({ x: 700, y: 480, width: 64, height: 32 });
      level.enemies.push({ x: 250, y: 380, type: 'jumper' });
      level.enemies.push({ x: 550, y: 350, type: 'walker' });
      level.powerups.push({ x: 350, y: 200, type: 'shield' });
      break;
    case 2:
    case 3:
    case 4:
    case 5:
      // Even harder variations
      return generateDoor8Stage1Harder(level, stage);
  }
  return level;
}

function generateDoor8Stage1Harder(level: LevelData, stage: number): LevelData {
  const difficultyMultiplier = stage - 1;
  
  level.platforms.push({ x: 80 + difficultyMultiplier * 10, y: 480, width: 64, height: 32 });
  
  // Multiple disappearing platforms
  for (let i = 0; i < 3; i++) {
    level.obstacles.push({
      x: 200 + i * 120, y: 420 - (i % 2) * 60, type: 'disappearing',
      properties: { disappearDelay: 500 + i * 200, reappearDelay: 600 + i * 100 }
    });
  }
  
  // Gravity flip
  level.obstacles.push({
    x: 350, y: 280, type: 'gravity-flip', width: 100, height: 32
  });
  
  level.platforms.push({ x: 450, y: 80, width: 64, height: 32 });
  
  // Multiple saws
  for (let i = 0; i < 2 + difficultyMultiplier; i++) {
    level.obstacles.push({
      x: 520 + i * 80, y: 400 + (i % 2) * 40, type: 'saw',
      properties: { speed: 120 + i * 20, direction: i % 2 === 0 ? 1 : -1 }
    });
  }
  
  // Teleport
  level.obstacles.push({
    x: 680, y: 420, type: 'teleport', properties: { destinationX: 700, destinationY: 480 }
  });
  
  level.platforms.push({ x: 700, y: 480, width: 64, height: 32 });
  
  // Multiple enemies
  for (let i = 0; i < 2 + difficultyMultiplier; i++) {
    level.enemies.push({
      x: 250 + i * 150, y: 350 - i * 20, type: i % 2 === 0 ? 'walker' : 'jumper'
    });
  }
  
  // Powerups
  level.powerups.push({ x: 350, y: 200, type: 'shield' });
  if (stage > 2) level.powerups.push({ x: 500, y: 200, type: 'shield' });
  
  return level;
}

// Generic level generator for doors 9+ (will be expanded for doors 9-16)
function generateRandomLevel(level: LevelData, door: number, stage: number): LevelData {
  const difficulty = door + stage / 10;
  
  // Generate platforms
  const platformCount = Math.floor(3 + difficulty);
  for (let i = 0; i < platformCount; i++) {
    const x = 100 + i * (600 / platformCount);
    const y = 300 + Math.sin(i * 0.5) * 100;
    level.platforms.push({ x, y, width: 64, height: 32 });
  }

  // Add enemies
  const enemyCount = Math.floor(difficulty / 2);
  for (let i = 0; i < enemyCount; i++) {
    const x = 200 + Math.random() * 400;
    const y = 250 + Math.random() * 150;
    const type = Math.random() > 0.5 ? 'walker' : 'jumper';
    level.enemies.push({ x, y, type });
  }

  // Add powerups
  const powerupTypes: Array<'speed' | 'shield' | 'jump'> = ['speed', 'shield', 'jump'];
  for (let i = 0; i < 2; i++) {
    const x = 150 + Math.random() * 500;
    const y = 250 + Math.random() * 150;
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    level.powerups.push({ x, y, type });
  }

  return level;
}
