-- ============================================================
-- HELL RUNNER DATABASE SETUP
-- Run these queries in Supabase SQL Editor
-- ============================================================

-- NOTE: These tables already exist in your schema:
-- ✅ hell_runner_progress
-- ✅ hell_runner_leaderboard
-- ✅ user_achievements
-- ✅ achievements
-- ✅ player_stats
-- ✅ notifications

-- However, we need to add the achievements data!
-- Run the queries below:

-- ============================================================
-- STEP 1: INSERT HELL RUNNER ACHIEVEMENTS
-- ============================================================

INSERT INTO public.achievements (
  name,
  description,
  icon,
  category,
  requirement_type,
  requirement_value,
  xp_reward,
  rarity
) VALUES
-- MILESTONE ACHIEVEMENTS
('First Step', 'Complete Door 1 (Tutorial)', '🚪', 'milestone', 'custom', 1, 100, 'common'),
('Disappearing Act', 'Complete Door 3 (Disappearing Platforms)', '👻', 'milestone', 'custom', 3, 250, 'rare'),
('Gravity Mastery', 'Complete Door 5 (Gravity & Control Chaos)', '⬆️', 'milestone', 'custom', 5, 500, 'epic'),
('Mega Chaos Conqueror', 'Complete Door 8 (Ultimate Challenge)', '💥', 'milestone', 'custom', 8, 1000, 'legendary'),

-- SPEEDRUN ACHIEVEMENTS
('Quick Learner', 'Complete Door 1 in under 30 seconds', '⚡', 'special', 'custom', 30, 150, 'rare'),
('Timeless Platformer', 'Complete Door 3 in under 60 seconds', '🏃', 'special', 'custom', 60, 300, 'rare'),
('Gravity Speedster', 'Complete Door 5 in under 90 seconds', '🚀', 'special', 'custom', 90, 500, 'epic'),
('Time Master', 'Complete all doors with average time < 60s per door', '⏱️', 'special', 'custom', 60, 2000, 'legendary'),

-- CHALLENGE ACHIEVEMENTS
('Flawless Victory', 'Complete Door 1 without dying', '😇', 'special', 'custom', 0, 200, 'rare'),
('Platform Perfect', 'Complete Door 3 without dying', '🎯', 'special', 'custom', 0, 400, 'epic'),
('Immortal', 'Complete all doors without dying (ultimate challenge)', '👑', 'special', 'custom', 0, 5000, 'legendary'),
('Never Give Up', 'Accumulate 100 deaths across all levels', '💀', 'special', 'custom', 100, 300, 'common'),
('Perseverance', 'Accumulate 1000 deaths - respect the grind', '💪', 'special', 'custom', 1000, 1000, 'epic'),

-- SPECIAL ACHIEVEMENTS
('Tutorial Master', 'Complete all 5 stages of Door 1', '📚', 'special', 'custom', 5, 150, 'common'),
('Hell Runner Legend', 'Complete all doors and all stages (40 levels total)', '🏆', 'special', 'custom', 40, 3000, 'legendary'),
('XP Collector', 'Earn 10,000 XP', '⭐', 'special', 'custom', 10000, 500, 'rare'),
('Top 10 Player', 'Reach top 10 on any level leaderboard', '🥨', 'special', 'custom', 10, 750, 'rare'),
('Champion', 'Achieve rank #1 on any level leaderboard', '🥇', 'special', 'custom', 1, 2000, 'legendary'),
('Key Finder', 'Find 1 secret purple key', '🔑', 'special', 'custom', 1, 200, 'rare'),
('Vault Opener', 'Find all 10 secret purple keys', '🔐', 'special', 'custom', 10, 2500, 'legendary');

-- ============================================================
-- STEP 2: CREATE INDEX FOR PERFORMANCE
-- ============================================================

-- Index for leaderboard queries (very important for speed)
CREATE INDEX IF NOT EXISTS idx_hell_runner_leaderboard_door_stage_time
ON hell_runner_leaderboard(door, stage, time_seconds ASC);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_hell_runner_leaderboard_user_id
ON hell_runner_leaderboard(user_id);

-- Index for progress queries
CREATE INDEX IF NOT EXISTS idx_hell_runner_progress_user_id
ON hell_runner_progress(user_id);

-- Index for achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id
ON user_achievements(user_id);

-- ============================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (OPTIONAL BUT RECOMMENDED)
-- ============================================================

-- Enable RLS on hell_runner_progress
ALTER TABLE hell_runner_progress ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own progress
DROP POLICY IF EXISTS "Users see their own progress" ON hell_runner_progress;
CREATE POLICY "Users see their own progress"
  ON hell_runner_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON hell_runner_progress;
CREATE POLICY "Users can update their own progress"
  ON hell_runner_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON hell_runner_progress;
CREATE POLICY "Users can insert their own progress"
  ON hell_runner_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on hell_runner_leaderboard
ALTER TABLE hell_runner_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can view leaderboard
DROP POLICY IF EXISTS "Leaderboard is publicly readable" ON hell_runner_leaderboard;
CREATE POLICY "Leaderboard is publicly readable"
  ON hell_runner_leaderboard
  FOR SELECT
  USING (true);

-- Create policy: Users can only insert their own scores
DROP POLICY IF EXISTS "Users can insert their own leaderboard entries" ON hell_runner_leaderboard;
CREATE POLICY "Users can insert their own leaderboard entries"
  ON hell_runner_leaderboard
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can see their own achievements
DROP POLICY IF EXISTS "Users see their own achievements" ON user_achievements;
CREATE POLICY "Users see their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can unlock their own achievements
DROP POLICY IF EXISTS "Users can unlock their own achievements" ON user_achievements;
CREATE POLICY "Users can unlock their own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on player_stats
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can see their own stats
DROP POLICY IF EXISTS "Users see their own stats" ON player_stats;
CREATE POLICY "Users see their own stats"
  ON player_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can update their own stats
DROP POLICY IF EXISTS "Users can update their own stats" ON player_stats;
CREATE POLICY "Users can update their own stats"
  ON player_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON player_stats;
CREATE POLICY "Users can insert their own stats"
  ON player_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STEP 4: CREATE HELPFUL VIEWS (OPTIONAL)
-- ============================================================

-- Leaderboard view with user info
CREATE OR REPLACE VIEW leaderboard_top_10_per_level AS
SELECT 
  door,
  stage,
  ROW_NUMBER() OVER (PARTITION BY door, stage ORDER BY time_seconds ASC) as rank,
  user_id,
  time_seconds,
  death_count,
  created_at
FROM hell_runner_leaderboard
WHERE ROW_NUMBER() OVER (PARTITION BY door, stage ORDER BY time_seconds ASC) <= 10;

-- Player progress summary
CREATE OR REPLACE VIEW player_summary AS
SELECT 
  p.user_id,
  p.current_door,
  p.current_stage,
  p.total_deaths,
  p.best_time,
  p.secret_keys_found,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = p.user_id) as achievements_unlocked,
  (SELECT COUNT(*) FROM achievements) as total_achievements,
  ps.level,
  ps.total_xp,
  ps.rank_points
FROM hell_runner_progress p
LEFT JOIN player_stats ps ON p.user_id = ps.user_id;

-- ============================================================
-- STEP 5: VERIFY SETUP
-- ============================================================

-- Count achievements (should show 21)
SELECT COUNT(*) as total_achievements FROM achievements WHERE category = 'milestone' OR category = 'special';

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'hell_runner_leaderboard';

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('hell_runner_progress', 'hell_runner_leaderboard', 'user_achievements', 'player_stats');

-- ============================================================
-- ALL SET! Your Hell Runner database is ready.
-- ============================================================
