-- Frag11 Fantasy IPL Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- IPL Teams Table
CREATE TABLE IF NOT EXISTS frag11_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(10) NOT NULL,
  logo_url TEXT,
  color_primary VARCHAR(7) NOT NULL, -- Hex color
  color_secondary VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IPL Players Table
CREATE TABLE IF NOT EXISTS frag11_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  team_id UUID REFERENCES frag11_teams(id),
  role VARCHAR(4) NOT NULL CHECK (role IN ('WK', 'BAT', 'AR', 'BOWL')),
  credits DECIMAL(4,1) NOT NULL CHECK (credits >= 7.0 AND credits <= 15.0),
  image_url TEXT,
  
  -- Stats
  matches_played INT DEFAULT 0,
  runs INT DEFAULT 0,
  wickets INT DEFAULT 0,
  average DECIMAL(5,2),
  strike_rate DECIMAL(5,2),
  economy DECIMAL(4,2),
  
  -- Fantasy Points
  total_points INT DEFAULT 0,
  average_points DECIMAL(5,2) DEFAULT 0,
  selected_by DECIMAL(5,2) DEFAULT 0, -- Percentage
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IPL Matches Table
CREATE TABLE IF NOT EXISTS frag11_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number INT NOT NULL,
  team1_id UUID REFERENCES frag11_teams(id),
  team2_id UUID REFERENCES frag11_teams(id),
  
  venue VARCHAR(200) NOT NULL,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  
  -- Live match data
  team1_score VARCHAR(50),
  team2_score VARCHAR(50),
  current_innings INT CHECK (current_innings IN (1, 2)),
  result TEXT,
  
  -- Contest stats
  contests_count INT DEFAULT 0,
  total_prize_pool DECIMAL(12,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Teams Table
CREATE TABLE IF NOT EXISTS frag11_user_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES frag11_matches(id) ON DELETE CASCADE,
  
  team_name VARCHAR(50) NOT NULL,
  
  -- Players (stored as JSON arrays of player IDs)
  wicket_keepers JSONB NOT NULL,
  batters JSONB NOT NULL,
  all_rounders JSONB NOT NULL,
  bowlers JSONB NOT NULL,
  
  captain_id UUID REFERENCES frag11_players(id) NOT NULL,
  vice_captain_id UUID REFERENCES frag11_players(id) NOT NULL,
  
  total_credits_used DECIMAL(5,1) NOT NULL,
  total_points INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_match_team UNIQUE(user_id, match_id, team_name)
);

-- Contests Table
CREATE TABLE IF NOT EXISTS frag11_contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES frag11_matches(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  type VARCHAR(20) NOT NULL CHECK (type IN ('free', 'paid', 'head_to_head', 'mega')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  
  -- Entry
  entry_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_entries INT NOT NULL,
  current_entries INT DEFAULT 0,
  max_teams_per_user INT DEFAULT 1,
  
  -- Prizes
  total_prize_pool DECIMAL(12,2) NOT NULL,
  winner_percentage DECIMAL(5,2) NOT NULL,
  first_prize DECIMAL(12,2) NOT NULL,
  prize_distribution JSONB, -- Array of {rank_from, rank_to, prize}
  
  -- Contest details
  is_guaranteed BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contest Entries Table
CREATE TABLE IF NOT EXISTS frag11_contest_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES frag11_contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES frag11_user_teams(id) ON DELETE CASCADE,
  
  points INT DEFAULT 0,
  rank INT,
  prize_won DECIMAL(12,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_contest_team UNIQUE(contest_id, team_id)
);

-- Player Points Table (for each match)
CREATE TABLE IF NOT EXISTS frag11_player_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES frag11_players(id),
  match_id UUID REFERENCES frag11_matches(id),
  
  -- Batting
  runs INT DEFAULT 0,
  fours INT DEFAULT 0,
  sixes INT DEFAULT 0,
  strike_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Bowling
  wickets INT DEFAULT 0,
  economy DECIMAL(4,2) DEFAULT 0,
  maidens INT DEFAULT 0,
  
  -- Fielding
  catches INT DEFAULT 0,
  stumpings INT DEFAULT 0,
  run_outs INT DEFAULT 0,
  
  -- Points breakdown
  batting_points INT DEFAULT 0,
  bowling_points INT DEFAULT 0,
  fielding_points INT DEFAULT 0,
  bonus_points INT DEFAULT 0,
  total_points INT DEFAULT 0,
  
  is_playing_11 BOOLEAN DEFAULT FALSE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_player_match UNIQUE(player_id, match_id)
);

-- Indexes for better query performance
CREATE INDEX idx_frag11_players_team ON frag11_players(team_id);
CREATE INDEX idx_frag11_players_role ON frag11_players(role);
CREATE INDEX idx_frag11_matches_date ON frag11_matches(match_date);
CREATE INDEX idx_frag11_matches_status ON frag11_matches(status);
CREATE INDEX idx_frag11_user_teams_user ON frag11_user_teams(user_id);
CREATE INDEX idx_frag11_user_teams_match ON frag11_user_teams(match_id);
CREATE INDEX idx_frag11_contests_match ON frag11_contests(match_id);
CREATE INDEX idx_frag11_contest_entries_user ON frag11_contest_entries(user_id);
CREATE INDEX idx_frag11_contest_entries_contest ON frag11_contest_entries(contest_id);
CREATE INDEX idx_frag11_player_points_match ON frag11_player_points(match_id);

-- Row Level Security (RLS) Policies
ALTER TABLE frag11_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_player_points ENABLE ROW LEVEL SECURITY;

-- Public read access for teams, players, matches, contests, player_points
CREATE POLICY "Allow public read access to teams"
  ON frag11_teams FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to players"
  ON frag11_players FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to matches"
  ON frag11_matches FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to contests"
  ON frag11_contests FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to player points"
  ON frag11_player_points FOR SELECT
  USING (true);

-- User teams: Users can CRUD their own teams
CREATE POLICY "Users can create their own teams"
  ON frag11_user_teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own teams"
  ON frag11_user_teams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
  ON frag11_user_teams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
  ON frag11_user_teams FOR DELETE
  USING (auth.uid() = user_id);

-- Contest entries: Users can view all entries, but only create their own
CREATE POLICY "Allow public read access to contest entries"
  ON frag11_contest_entries FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own contest entries"
  ON frag11_contest_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp trigger to all tables
CREATE TRIGGER update_frag11_teams_updated_at
  BEFORE UPDATE ON frag11_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frag11_players_updated_at
  BEFORE UPDATE ON frag11_players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frag11_matches_updated_at
  BEFORE UPDATE ON frag11_matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frag11_user_teams_updated_at
  BEFORE UPDATE ON frag11_user_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frag11_contests_updated_at
  BEFORE UPDATE ON frag11_contests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frag11_player_points_updated_at
  BEFORE UPDATE ON frag11_player_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
