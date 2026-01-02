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
    default:
      return generateRandomLevel(level, door, stage);
  }
}

// Door 1: Basic platforming (learning the controls)
function generateDoor1(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      // Stage 1: Simple jump
      level.platforms.push({ x: 300, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 400, y: 430, type: 'speed' });
      break;

    case 2:
      // Stage 2: Small pit with spikes
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.spikes.push({ x: 300, y: 548 });
      level.spikes.push({ x: 332, y: 548 });
      level.platforms.push({ x: 450, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 430, type: 'jump' });
      break;

    case 3:
      // Stage 3: Elevated platforms
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      level.platforms.push({ x: 350, y: 360, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 300, width: 64, height: 32 });
      level.platforms.push({ x: 650, y: 420, width: 64, height: 32 });
      level.powerups.push({ x: 350, y: 310, type: 'shield' });
      level.enemies.push({ x: 275, y: 365, type: 'walker' });
      break;

    case 4:
      // Stage 4: Long jump with spike pit
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 8; i++) {
        level.spikes.push({ x: 250 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 375, y: 430, type: 'speed' });
      break;

    case 5:
      // Stage 5: Multiple small jumps with enemies
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

// Door 2: Introducing spike traps and enemies
function generateDoor2(level: LevelData, stage: number): LevelData {
  switch (stage) {
    case 1:
      // Spikes on platforms
      level.platforms.push({ x: 200, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 200, y: 448 });
      level.platforms.push({ x: 400, y: 400, width: 64, height: 32 });
      level.platforms.push({ x: 600, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 600, y: 448 });
      level.powerups.push({ x: 400, y: 350, type: 'shield' });
      level.enemies.push({ x: 500, y: 350, type: 'walker' });
      break;

    case 2:
      // Spike walls
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      for (let i = 0; i < 5; i++) {
        level.spikes.push({ x: 330, y: 480 - i * 32 });
      }
      level.platforms.push({ x: 500, y: 420, width: 64, height: 32 });
      level.powerups.push({ x: 250, y: 370, type: 'jump' });
      level.enemies.push({ x: 550, y: 370, type: 'jumper' });
      break;

    case 3:
      // Narrow passages
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
      // Jump over spike clusters with enemies
      level.platforms.push({ x: 120, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 10; i++) {
        level.spikes.push({ x: 200 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      level.powerups.push({ x: 360, y: 430, type: 'speed' });
      level.enemies.push({ x: 300, y: 430, type: 'jumper' });
      break;

    case 5:
      // Boss stage: Spike maze with multiple enemies
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

// Generic level generator for doors 3+ (with enemies and powerups)
function generateRandomLevel(level: LevelData, door: number, stage: number): LevelData {
  const difficulty = door + stage / 10;
  
  // Generate platforms based on difficulty
  const platformCount = Math.floor(3 + difficulty);
  for (let i = 0; i < platformCount; i++) {
    const x = 100 + i * (600 / platformCount);
    const y = 300 + Math.sin(i * 0.5) * 100;
    level.platforms.push({ x, y, width: 64, height: 32 });
  }

  // Add spikes based on difficulty
  const spikeCount = Math.floor(difficulty * 2);
  for (let i = 0; i < spikeCount; i++) {
    const x = 150 + Math.random() * 500;
    level.spikes.push({ x, y: 548 });
  }

  // Add enemies based on difficulty
  const enemyCount = Math.floor(difficulty / 2);
  for (let i = 0; i < enemyCount; i++) {
    const x = 200 + Math.random() * 400;
    const y = 250 + Math.random() * 150;
    const type = Math.random() > 0.5 ? 'walker' : 'jumper';
    level.enemies.push({ x, y, type });
  }

  // Add powerups
  const powerupCount = Math.min(3, Math.floor(difficulty / 2) + 1);
  const powerupTypes: Array<'speed' | 'shield' | 'jump'> = ['speed', 'shield', 'jump'];
  for (let i = 0; i < powerupCount; i++) {
    const x = 150 + Math.random() * 500;
    const y = 250 + Math.random() * 150;
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    level.powerups.push({ x, y, type });
  }

  return level;
}
