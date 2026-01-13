// Frag11 Fantasy IPL TypeScript Types

export type PlayerRole = 'WK' | 'BAT' | 'AR' | 'BOWL';
export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type ContestType = 'free' | 'paid' | 'head_to_head' | 'mega';
export type ContestStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface IPLTeam {
  id: string;
  name: string;
  short_name: string;
  logo_url: string;
  color_primary: string;
  color_secondary: string;
}

export interface IPLPlayer {
  id: string;
  name: string;
  team_id: string;
  team?: IPLTeam;
  role: PlayerRole;
  credits: number;
  image_url: string;
  
  // Stats
  matches_played: number;
  runs?: number;
  wickets?: number;
  average?: number;
  strike_rate?: number;
  economy?: number;
  
  // Fantasy Points
  total_points: number;
  average_points: number;
  selected_by: number; // Percentage of users who selected this player
  
  // Current match
  is_playing_11?: boolean;
  fantasy_points?: number; // Points in current/last match
}

export interface IPLMatch {
  id: string;
  match_number: number;
  team1_id: string;
  team2_id: string;
  team1?: IPLTeam;
  team2?: IPLTeam;
  
  venue: string;
  match_date: string;
  match_time: string;
  status: MatchStatus;
  
  // Live match data
  team1_score?: string; // "165/4 (18.2)"
  team2_score?: string;
  current_innings?: 1 | 2;
  result?: string;
  
  // Contest stats
  contests_count: number;
  total_prize_pool: number;
  
  created_at: string;
  updated_at: string;
}

export interface UserTeam {
  id: string;
  user_id: string;
  match_id: string;
  match?: IPLMatch;
  
  team_name: string;
  
  // Players (11 total)
  wicket_keepers: string[]; // player IDs (1-4)
  batters: string[]; // (1-8)
  all_rounders: string[]; // (1-4)
  bowlers: string[]; // (1-8)
  
  captain_id: string; // 2x points
  vice_captain_id: string; // 1.5x points
  
  // Expanded player data (not stored in DB)
  players?: IPLPlayer[];
  captain?: IPLPlayer;
  vice_captain?: IPLPlayer;
  
  total_credits_used: number;
  
  // Points
  total_points: number;
  rank?: number;
  
  created_at: string;
  updated_at: string;
}

export interface Contest {
  id: string;
  match_id: string;
  match?: IPLMatch;
  
  name: string;
  description?: string;
  
  type: ContestType;
  status: ContestStatus;
  
  // Entry
  entry_fee: number; // 0 for free contests
  max_entries: number;
  current_entries: number;
  max_teams_per_user: number;
  
  // Prizes
  total_prize_pool: number;
  winner_percentage: number; // % of entries that win
  first_prize: number;
  prize_distribution: PrizeDistribution[];
  
  // Contest details
  is_guaranteed?: boolean; // Guaranteed prize pool
  is_featured?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface PrizeDistribution {
  rank_from: number;
  rank_to: number;
  prize: number;
}

export interface ContestEntry {
  id: string;
  contest_id: string;
  contest?: Contest;
  user_id: string;
  team_id: string;
  team?: UserTeam;
  
  points: number;
  rank?: number;
  prize_won?: number;
  
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  team_name: string;
  points: number;
  prize?: number;
}

export interface PlayerPoints {
  player_id: string;
  match_id: string;
  
  // Batting
  runs: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  
  // Bowling
  wickets: number;
  economy: number;
  maidens: number;
  
  // Fielding
  catches: number;
  stumpings: number;
  run_outs: number;
  
  // Points breakdown
  batting_points: number;
  bowling_points: number;
  fielding_points: number;
  bonus_points: number;
  
  total_points: number;
  
  updated_at: string;
}

// Point system (can be adjusted)
export const POINTS_SYSTEM = {
  // Batting
  RUN: 1,
  BOUNDARY: 1,
  SIX: 2,
  FIFTY: 8,
  CENTURY: 16,
  DUCK: -2,
  
  // Bowling
  WICKET: 25,
  BONUS_LBW_BOWLED: 8,
  MAIDEN: 12,
  THREE_WICKETS: 4,
  FOUR_WICKETS: 8,
  FIVE_WICKETS: 16,
  
  // Fielding
  CATCH: 8,
  STUMPING: 12,
  RUN_OUT_DIRECT: 12,
  RUN_OUT_INDIRECT: 6,
  
  // Strike Rate (Batting) bonuses
  SR_ABOVE_170: 6,
  SR_150_170: 4,
  SR_60_70: -2,
  SR_BELOW_60: -4,
  
  // Economy Rate (Bowling) bonuses
  ECON_BELOW_5: 6,
  ECON_5_6: 4,
  ECON_10_11: -2,
  ECON_ABOVE_11: -4,
};

// Team composition rules
export const TEAM_RULES = {
  TOTAL_PLAYERS: 11,
  TOTAL_CREDITS: 100,
  
  WK_MIN: 1,
  WK_MAX: 4,
  
  BAT_MIN: 1,
  BAT_MAX: 8,
  
  AR_MIN: 1,
  AR_MAX: 4,
  
  BOWL_MIN: 1,
  BOWL_MAX: 8,
  
  MAX_FROM_TEAM: 7, // Max 7 players from same team
};

export interface TeamValidation {
  isValid: boolean;
  errors: string[];
}

// Utility types for filters and sorting
export interface MatchFilters {
  status?: MatchStatus;
  team_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface ContestFilters {
  type?: ContestType;
  entry_fee_max?: number;
  is_guaranteed?: boolean;
}

export type SortOption = 'credits' | 'points' | 'selected_by' | 'name';
export type SortDirection = 'asc' | 'desc';
