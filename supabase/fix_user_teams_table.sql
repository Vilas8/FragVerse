-- Check existing frag11_user_teams table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'frag11_user_teams'
ORDER BY ordinal_position;

-- If the table has wrong structure, drop and recreate it
-- WARNING: This will delete all existing user teams!
DROP TABLE IF EXISTS frag11_user_teams CASCADE;

-- Create the correct table structure
CREATE TABLE frag11_user_teams (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_11_players CHECK (array_length(player_ids, 1) = 11)
);

-- Create indexes
CREATE INDEX idx_user_teams_user ON frag11_user_teams(user_id);
CREATE INDEX idx_user_teams_match ON frag11_user_teams(match_id);

-- Enable RLS
ALTER TABLE frag11_user_teams ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own teams" ON frag11_user_teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teams" ON frag11_user_teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams" ON frag11_user_teams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams" ON frag11_user_teams
  FOR DELETE USING (auth.uid() = user_id);

-- Recreate contest_entries table with correct foreign key
DROP TABLE IF EXISTS frag11_contest_entries CASCADE;

CREATE TABLE frag11_contest_entries (
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

-- Create indexes for contest entries
CREATE INDEX idx_contest_entries_contest ON frag11_contest_entries(contest_id);
CREATE INDEX idx_contest_entries_user ON frag11_contest_entries(user_id);

-- Enable RLS for contest entries
ALTER TABLE frag11_contest_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for contest entries
CREATE POLICY "Users can view their own entries" ON frag11_contest_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries" ON frag11_contest_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

SELECT 'frag11_user_teams table recreated successfully!' as status;
