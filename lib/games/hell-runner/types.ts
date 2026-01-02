export interface LevelData {
  spawnPoint: { x: number; y: number };
  platforms: Array<{ x: number; y: number; width: number; height: number }>;
  spikes: Array<{ x: number; y: number }>;
  enemies: Array<{ x: number; y: number; type: 'walker' | 'jumper' }>;
  powerups: Array<{ x: number; y: number; type: 'speed' | 'shield' | 'jump' }>;
  obstacles: Array<{
    x: number;
    y: number;
    type: 'disappearing' | 'saw' | 'popup-spike' | 'gravity-flip' | 'control-reverse' | 'fake-door' | 'teleport';
    width?: number;
    height?: number;
    properties?: any;
  }>;
  door: { x: number; y: number };
}

export interface GameStats {
  door: number;
  stage: number;
  deaths: number;
  time: number;
  powerupsClaimed: number;
  enemiesDefeated: number;
}

export interface PowerupEffect {
  type: 'speed' | 'shield' | 'jump';
  duration: number;
  startTime: number;
}

export interface HighScore {
  userId?: string;
  door: number;
  stage: number;
  deaths: number;
  time: number;
  score: number;
  timestamp: Date;
}
