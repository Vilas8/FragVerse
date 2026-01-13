-- Frag11 Fantasy IPL Database Schema - Safe Migration
-- This script safely adds missing tables and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams Table
CREATE TABLE IF NOT EXISTS frag11_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players Table
CREATE TABLE IF NOT EXISTS frag11_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES frag11_teams(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('WK', 'BAT', 'AR', 'BOWL')),
  credits DECIMAL(5,2) NOT NULL DEFAULT 8.0,
  image_url TEXT,
  matches_played INTEGER DEFAULT 0,
  runs INTEGER DEFAULT 0,
  wickets INTEGER DEFAULT 0,
  average DECIMAL(6,2),
  strike_rate DECIMAL(6,2),
  economy DECIMAL(5,2),
  total_points INTEGER DEFAULT 0,
  average_points DECIMAL(6,2) DEFAULT 0,
  selected_by DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches Table
CREATE TABLE IF NOT EXISTS frag11_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number INTEGER NOT NULL,
  team1_id UUID REFERENCES frag11_teams(id) ON DELETE CASCADE,
  team2_id UUID REFERENCES frag11_teams(id) ON DELETE CASCADE,
  venue TEXT NOT NULL,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  team1_score TEXT,
  team2_score TEXT,
  result TEXT,
  contests_count INTEGER DEFAULT 0,
  total_prize_pool INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Teams Table (THIS WAS MISSING!)
CREATE TABLE IF NOT EXISTS frag11_user_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES frag11_matches(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  player_ids UUID[] NOT NULL,
  captain_id UUID NOT NULL,
  vice_captain_id UUID NOT NULL,
  total_credits_used DECIMAL(6,2) DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_11_players' 
    AND conrelid = 'frag11_user_teams'::regclass
  ) THEN
    ALTER TABLE frag11_user_teams 
    ADD CONSTRAINT check_11_players CHECK (array_length(player_ids, 1) = 11);
  END IF;
END $$;

-- Contests Table
CREATE TABLE IF NOT EXISTS frag11_contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES frag11_matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('free', 'paid', 'head_to_head', 'mega')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  entry_fee INTEGER DEFAULT 0,
  max_entries INTEGER NOT NULL,
  current_entries INTEGER DEFAULT 0,
  max_teams_per_user INTEGER DEFAULT 1,
  total_prize_pool INTEGER NOT NULL,
  winner_percentage DECIMAL(5,2) NOT NULL,
  first_prize INTEGER,
  prize_distribution JSONB,
  is_guaranteed BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contest Entries Table
CREATE TABLE IF NOT EXISTS frag11_contest_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID NOT NULL REFERENCES frag11_contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_team_id UUID NOT NULL REFERENCES frag11_user_teams(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  rank INTEGER,
  prize_won INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contest_id, user_team_id)
);

-- Player Points Table (for live scoring)
CREATE TABLE IF NOT EXISTS frag11_player_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES frag11_matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES frag11_players(id) ON DELETE CASCADE,
  runs INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  wickets INTEGER DEFAULT 0,
  overs DECIMAL(3,1) DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  catches INTEGER DEFAULT 0,
  stumpings INTEGER DEFAULT 0,
  run_outs INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Create Indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_players_team ON frag11_players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_role ON frag11_players(role);
CREATE INDEX IF NOT EXISTS idx_matches_status ON frag11_matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON frag11_matches(match_date);
CREATE INDEX IF NOT EXISTS idx_user_teams_user ON frag11_user_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_match ON frag11_user_teams(match_id);
CREATE INDEX IF NOT EXISTS idx_contests_match ON frag11_contests(match_id);
CREATE INDEX IF NOT EXISTS idx_contests_status ON frag11_contests(status);
CREATE INDEX IF NOT EXISTS idx_contest_entries_contest ON frag11_contest_entries(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_user ON frag11_contest_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_player_points_match ON frag11_player_points(match_id);
CREATE INDEX IF NOT EXISTS idx_player_points_player ON frag11_player_points(player_id);

-- Enable Row Level Security
ALTER TABLE frag11_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE frag11_player_points ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
  -- Teams policies
  DROP POLICY IF EXISTS "Teams are viewable by everyone" ON frag11_teams;
  CREATE POLICY "Teams are viewable by everyone" ON frag11_teams FOR SELECT USING (true);

  -- Players policies
  DROP POLICY IF EXISTS "Players are viewable by everyone" ON frag11_players;
  CREATE POLICY "Players are viewable by everyone" ON frag11_players FOR SELECT USING (true);

  -- Matches policies
  DROP POLICY IF EXISTS "Matches are viewable by everyone" ON frag11_matches;
  CREATE POLICY "Matches are viewable by everyone" ON frag11_matches FOR SELECT USING (true);

  -- User Teams policies
  DROP POLICY IF EXISTS "Users can view their own teams" ON frag11_user_teams;
  CREATE POLICY "Users can view their own teams" ON frag11_user_teams
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can insert their own teams" ON frag11_user_teams;
  CREATE POLICY "Users can insert their own teams" ON frag11_user_teams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own teams" ON frag11_user_teams;
  CREATE POLICY "Users can update their own teams" ON frag11_user_teams
    FOR UPDATE USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can delete their own teams" ON frag11_user_teams;
  CREATE POLICY "Users can delete their own teams" ON frag11_user_teams
    FOR DELETE USING (auth.uid() = user_id);

  -- Contests policies
  DROP POLICY IF EXISTS "Contests are viewable by everyone" ON frag11_contests;
  CREATE POLICY "Contests are viewable by everyone" ON frag11_contests FOR SELECT USING (true);

  -- Contest Entries policies
  DROP POLICY IF EXISTS "Users can view their own entries" ON frag11_contest_entries;
  CREATE POLICY "Users can view their own entries" ON frag11_contest_entries
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can create their own entries" ON frag11_contest_entries;
  CREATE POLICY "Users can create their own entries" ON frag11_contest_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- Player Points policies
  DROP POLICY IF EXISTS "Player points are viewable by everyone" ON frag11_player_points;
  CREATE POLICY "Player points are viewable by everyone" ON frag11_player_points FOR SELECT USING (true);
END $$;

-- Function to update match stats
CREATE OR REPLACE FUNCTION update_match_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE frag11_matches SET
      contests_count = (SELECT COUNT(*) FROM frag11_contests WHERE match_id = NEW.match_id),
      total_prize_pool = (SELECT COALESCE(SUM(total_prize_pool), 0) FROM frag11_contests WHERE match_id = NEW.match_id)
    WHERE id = NEW.match_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE frag11_matches SET
      contests_count = (SELECT COUNT(*) FROM frag11_contests WHERE match_id = OLD.match_id),
      total_prize_pool = (SELECT COALESCE(SUM(total_prize_pool), 0) FROM frag11_contests WHERE match_id = OLD.match_id)
    WHERE id = OLD.match_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_match_stats_trigger ON frag11_contests;
CREATE TRIGGER update_match_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON frag11_contests
FOR EACH ROW EXECUTE FUNCTION update_match_stats();

-- Verification query
SELECT 
  'Tables created successfully!' as status,
  (
    SELECT COUNT(*) FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'frag11_%'
  ) as frag11_tables_count;
