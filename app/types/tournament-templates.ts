export type TournamentFormat = 'single-elimination' | 'double-elimination' | 'swiss' | 'round-robin';
export type MatchFormat = 'best-of-1' | 'best-of-3' | 'best-of-5';
export type PlayerType = 'solo' | 'team';

export interface TournamentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quick' | 'competitive' | 'casual' | 'championship' | 'custom';
  settings: {
    format: TournamentFormat;
    playerType: PlayerType;
    minPlayers: number;
    maxPlayers: number;
    matchFormat: MatchFormat;
    teamSize?: number;
    isPublic: boolean;
    allowSpectators: boolean;
    requireApproval: boolean;
    enableChat: boolean;
    enableScheduling: boolean;
    prizePoolEnabled: boolean;
    streamingEnabled: boolean;
    estimatedDuration: string;
  };
  gamePresets?: {
    game: string;
    rules?: string[];
    mapPool?: string[];
  };
  scheduling?: {
    allowTimeSlots: boolean;
    matchDuration: number;
    breakBetweenMatches: number;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: TournamentTemplate[];
}
