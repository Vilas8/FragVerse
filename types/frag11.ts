// IPL Team
export interface IPLTeam {
  id: string;
  name: string;
  short_name: string;
  logo_url?: string;
  color_primary?: string;
  color_secondary?: string;
}

// Player Role
export type PlayerRole = 'WK' | 'BAT' | 'AR' | 'BOWL';

// IPL Player
export interface IPLPlayer {
  id: string;
  name: string;
  team_id: string;
  team?: IPLTeam;
  role: PlayerRole;
  credits: number;
  image_url?: string;
  matches_played: number;
  runs: number;
  wickets: number;
  average?: number;
  strike_rate?: number;
  economy?: number;
  total_points: number;
  average_points: number;
  selected_by: number;
}

// Match Status
export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

// Match
export interface Match {
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
  team1_score?: string;
  team2_score?: string;
  result?: string;
  contests_count: number;
  total_prize_pool: number;
}

// Contest Type
export type ContestType = 'free' | 'paid' | 'head_to_head' | 'mega';

// Prize Distribution Item
export interface PrizeDistributionItem {
  rank_from: number;
  rank_to: number;
  prize: number;
}

// Contest
export interface Contest {
  id: string;
  match_id: string;
  match?: Match;
  name: string;
  description: string;
  type: ContestType;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  entry_fee: number;
  max_entries: number;
  current_entries: number;
  max_teams_per_user: number;
  total_prize_pool: number;
  winner_percentage: number;
  first_prize?: number;
  prize_distribution?: PrizeDistributionItem[];
  is_guaranteed: boolean;
  is_featured: boolean;
}

// User Team
export interface UserTeam {
  id: string;
  user_id: string;
  match_id: string;
  match?: Match;
  team_name: string;
  player_ids: string[];
  captain_id: string;
  vice_captain_id: string;
  total_credits_used: number;
  total_points: number;
  rank?: number;
  created_at: string;
}

// Contest Entry
export interface ContestEntry {
  id: string;
  contest_id: string;
  contest?: Contest;
  user_id: string;
  user_team_id: string;
  user_team?: UserTeam;
  points: number;
  rank?: number;
  prize_won?: number;
  joined_at: string;
}

// Team Validation Rules (UPDATED - No credit limit)
export const TEAM_RULES = {
  MIN_PLAYERS: 11,
  MAX_PLAYERS: 11,
  MIN_WICKET_KEEPERS: 1,
  MAX_WICKET_KEEPERS: 4,
  MIN_BATTERS: 1,
  MAX_BATTERS: 8,
  MIN_ALL_ROUNDERS: 1,
  MAX_ALL_ROUNDERS: 4,
  MIN_BOWLERS: 1,
  MAX_BOWLERS: 8,
  MAX_FROM_ONE_TEAM: 7,
  CAPTAIN_MULTIPLIER: 2,
  VICE_CAPTAIN_MULTIPLIER: 1.5,
};

// Point System
export const POINTS_SYSTEM = {
  // Batting
  RUN: 1,
  BOUNDARY_4: 1,
  BOUNDARY_6: 2,
  HALF_CENTURY: 8,
  CENTURY: 16,
  DUCK: -2,
  
  // Bowling
  WICKET: 25,
  LBW_BOWLED_BONUS: 8,
  MAIDEN_OVER: 12,
  THREE_WICKETS: 4,
  FOUR_WICKETS: 8,
  FIVE_WICKETS: 16,
  
  // Fielding
  CATCH: 8,
  STUMPING: 12,
  RUN_OUT_DIRECT: 12,
  RUN_OUT_INDIRECT: 6,
  
  // Economy/Strike Rate Bonuses
  ECONOMY_BELOW_5: 6,
  ECONOMY_BETWEEN_5_6: 4,
  ECONOMY_BETWEEN_6_7: 2,
  STRIKE_RATE_ABOVE_170: 6,
  STRIKE_RATE_BETWEEN_150_170: 4,
  STRIKE_RATE_BETWEEN_130_150: 2,
};
