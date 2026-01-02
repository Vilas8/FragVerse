-- Hell Runner Game Tables
-- Progress tracking and leaderboards for the Hell Runner platformer game

-- Progress table: Stores each player's current progress
CREATE TABLE IF NOT EXISTS hell_runner_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  current_door int DEFAULT 1,
  current_stage int DEFAULT 1,
  total_deaths int DEFAULT 0,
  best_time float, -- best completion time in seconds
  doors_completed int[] DEFAULT '{}', -- array of completed door numbers
  stages_completed jsonb DEFAULT '{}', -- {"1": [1,2,3,4,5], "2": [1,2]}
  secret_keys_found int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leaderboard table: Stores best times for each door/stage
CREATE TABLE IF NOT EXISTS hell_runner_leaderboard (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  door int NOT NULL,
  stage int NOT NULL,
  time_seconds float NOT NULL, -- completion time
  death_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, door, stage) -- One best entry per user per stage
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hell_runner_progress_user ON hell_runner_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_hell_runner_leaderboard_door_stage ON hell_runner_leaderboard(door, stage, time_seconds);
CREATE INDEX IF NOT EXISTS idx_hell_runner_leaderboard_user ON hell_runner_leaderboard(user_id);

-- RLS Policies
ALTER TABLE hell_runner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hell_runner_leaderboard ENABLE ROW LEVEL SECURITY;

-- Progress policies: Users can only read/write their own progress
CREATE POLICY "Users can view their own progress"
  ON hell_runner_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON hell_runner_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON hell_runner_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Leaderboard policies: Everyone can read, users can write their own
CREATE POLICY "Anyone can view leaderboard"
  ON hell_runner_leaderboard FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own leaderboard entries"
  ON hell_runner_leaderboard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entries"
  ON hell_runner_leaderboard FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_hell_runner_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for progress table
CREATE TRIGGER update_hell_runner_progress_timestamp
  BEFORE UPDATE ON hell_runner_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_hell_runner_timestamp();
