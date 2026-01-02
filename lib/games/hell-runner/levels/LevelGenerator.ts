// Level Generator for Hell Runner
// Creates procedural levels based on door and stage number

export interface Level {
  spawnPoint: { x: number; y: number };
  platforms: Array<{ x: number; y: number; width: number; height: number }>;
  spikes: Array<{ x: number; y: number }>;
  door: { x: number; y: number };
}

export function createLevel(door: number, stage: number): Level {
  // Base level structure
  const level: Level = {
    spawnPoint: { x: 50, y: 500 },
    platforms: [],
    spikes: [],
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
function generateDoor1(level: Level, stage: number): Level {
  switch (stage) {
    case 1:
      // Stage 1: Simple jump
      level.platforms.push({ x: 300, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 480, width: 64, height: 32 });
      break;

    case 2:
      // Stage 2: Small pit with spikes
      level.platforms.push({ x: 200, y: 480, width: 64, height: 32 });
      level.spikes.push({ x: 300, y: 548 });
      level.spikes.push({ x: 332, y: 548 });
      level.platforms.push({ x: 450, y: 480, width: 64, height: 32 });
      break;

    case 3:
      // Stage 3: Elevated platforms
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      level.platforms.push({ x: 350, y: 360, width: 64, height: 32 });
      level.platforms.push({ x: 500, y: 300, width: 64, height: 32 });
      level.platforms.push({ x: 650, y: 420, width: 64, height: 32 });
      break;

    case 4:
      // Stage 4: Long jump with spike pit
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 8; i++) {
        level.spikes.push({ x: 250 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      break;

    case 5:
      // Stage 5: Multiple small jumps
      for (let i = 0; i < 5; i++) {
        level.platforms.push({ x: 150 + i * 120, y: 450 - i * 20, width: 64, height: 32 });
      }
      break;
  }

  return level;
}

// Door 2: Introducing spike traps
function generateDoor2(level: Level, stage: number): Level {
  switch (stage) {
    case 1:
      // Spikes on platforms
      level.platforms.push({ x: 200, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 200, y: 448 });
      level.platforms.push({ x: 400, y: 400, width: 64, height: 32 });
      level.platforms.push({ x: 600, y: 480, width: 128, height: 32 });
      level.spikes.push({ x: 600, y: 448 });
      break;

    case 2:
      // Spike walls
      level.platforms.push({ x: 200, y: 420, width: 64, height: 32 });
      for (let i = 0; i < 5; i++) {
        level.spikes.push({ x: 330, y: 480 - i * 32 });
      }
      level.platforms.push({ x: 500, y: 420, width: 64, height: 32 });
      break;

    case 3:
      // Narrow passages
      level.platforms.push({ x: 150, y: 480, width: 64, height: 32 });
      level.platforms.push({ x: 300, y: 380, width: 128, height: 32 });
      level.spikes.push({ x: 268, y: 348 });
      level.spikes.push({ x: 300, y: 348 });
      level.spikes.push({ x: 332, y: 348 });
      level.platforms.push({ x: 550, y: 480, width: 64, height: 32 });
      break;

    case 4:
      // Jump over spike clusters
      level.platforms.push({ x: 120, y: 480, width: 64, height: 32 });
      for (let i = 0; i < 10; i++) {
        level.spikes.push({ x: 200 + i * 32, y: 548 });
      }
      level.platforms.push({ x: 600, y: 480, width: 64, height: 32 });
      break;

    case 5:
      // Boss stage: Spike maze
      level.platforms.push({ x: 150, y: 420, width: 64, height: 32 });
      level.platforms.push({ x: 300, y: 350, width: 64, height: 32 });
      level.spikes.push({ x: 268, y: 318 });
      level.platforms.push({ x: 450, y: 420, width: 64, height: 32 });
      level.spikes.push({ x: 418, y: 388 });
      level.platforms.push({ x: 600, y: 350, width: 64, height: 32 });
      break;
  }

  return level;
}

// Generic level generator for doors 3-16 (will be expanded later)
function generateRandomLevel(level: Level, door: number, stage: number): Level {
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

  return level;
}
