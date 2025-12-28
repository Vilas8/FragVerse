-- =============================================
-- FragVerse Engagement Features Database Schema
-- =============================================
-- Features: Leaderboards, Achievements, Friends, Daily Challenges, Notifications
-- Run this in your Supabase SQL Editor

-- =============================================
-- ACHIEVEMENTS SYSTEM
-- =============================================

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tournament', 'match', 'social', 'milestone', 'special')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('tournament_wins', 'tournament_joins', 'match_wins', 'friend_count', 'comments', 'custom')),
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements (Unlocked)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =============================================
-- PLAYER STATS & LEADERBOARDS
-- =============================================

-- Player Stats Table (Updated in real-time)
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  tournaments_won INTEGER DEFAULT 0,
  tournaments_joined INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  matches_lost INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.00,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  friends_count INTEGER DEFAULT 0,
  rank_points INTEGER DEFAULT 1000,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Leaderboard Snapshot
CREATE TABLE IF NOT EXISTS weekly_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  weekly_xp INTEGER DEFAULT 0,
  weekly_wins INTEGER DEFAULT 0,
  weekly_matches INTEGER DEFAULT 0,
  rank_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- =============================================
-- FRIENDS SYSTEM
-- =============================================

-- Friend Requests
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- Friendships (Bidirectional)
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('tournament_join', 'tournament_win', 'match_win', 'achievement', 'friend_add', 'level_up')),
  related_id UUID,
  metadata JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DAILY CHALLENGES
-- =============================================

-- Available Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('play_matches', 'win_matches', 'join_tournament', 'social_interaction')),
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,
  day_of_week INTEGER, -- NULL for daily, 0-6 for specific days
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  claimed BOOLEAN DEFAULT false,
  assigned_date DATE DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id, assigned_date)
);

-- =============================================
-- MATCH HISTORY (Enhanced)
-- =============================================

-- Detailed Match Statistics
CREATE TABLE IF NOT EXISTS match_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES "singleEliminationMatches"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  result TEXT CHECK (result IN ('win', 'loss')),
  xp_earned INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

-- =============================================
-- NOTIFICATIONS (Enhanced)
-- =============================================

-- Enhanced Notifications Table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high'));
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =============================================
-- INDEXES
-- =============================================

-- Achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Player Stats
CREATE INDEX IF NOT EXISTS idx_player_stats_user_id ON player_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_rank_points ON player_stats(rank_points DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_total_xp ON player_stats(total_xp DESC);

-- Weekly Leaderboards
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboards_week ON weekly_leaderboards(week_start, week_end);
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboards_xp ON weekly_leaderboards(weekly_xp DESC);

-- Friends
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);

-- Activity Feed
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_public ON activity_feed(is_public, created_at DESC) WHERE is_public = true;

-- Challenges
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_completed ON user_challenges(user_id, completed) WHERE completed = false;

-- Match Statistics
CREATE INDEX IF NOT EXISTS idx_match_statistics_user_id ON match_statistics(user_id, created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_statistics ENABLE ROW LEVEL SECURITY;

-- Achievements (Public read)
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

-- User Achievements
CREATE POLICY "Users can view all user achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert user achievements" ON user_achievements FOR INSERT WITH CHECK (true);

-- Player Stats (Public read)
CREATE POLICY "Anyone can view player stats" ON player_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON player_stats FOR UPDATE USING (user_id = auth.uid());

-- Weekly Leaderboards (Public read)
CREATE POLICY "Anyone can view leaderboards" ON weekly_leaderboards FOR SELECT USING (true);

-- Friend Requests
CREATE POLICY "Users can view their friend requests" ON friend_requests
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send friend requests" ON friend_requests
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update friend requests" ON friend_requests
  FOR UPDATE USING (receiver_id = auth.uid());

-- Friendships
CREATE POLICY "Users can view friendships" ON friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());
CREATE POLICY "Users can manage their friendships" ON friendships
  FOR ALL USING (user_id = auth.uid());

-- Activity Feed
CREATE POLICY "Users can view public activities" ON activity_feed
  FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users can create their activities" ON activity_feed
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Daily Challenges (Public read)
CREATE POLICY "Anyone can view challenges" ON daily_challenges FOR SELECT USING (is_active = true);

-- User Challenges
CREATE POLICY "Users can view their challenges" ON user_challenges
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their challenges" ON user_challenges
  FOR ALL USING (user_id = auth.uid());

-- Match Statistics
CREATE POLICY "Users can view match statistics" ON match_statistics
  FOR SELECT USING (true);
CREATE POLICY "System can create match statistics" ON match_statistics
  FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Calculate XP for next level
CREATE OR REPLACE FUNCTION calculate_xp_for_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN (current_level * 100) + ((current_level - 1) * 50);
END;
$$ LANGUAGE plpgsql;

-- Update player level based on XP
CREATE OR REPLACE FUNCTION update_player_level()
RETURNS TRIGGER AS $$
DECLARE
  required_xp INTEGER;
  new_level INTEGER;
BEGIN
  new_level := NEW.level;
  required_xp := calculate_xp_for_level(new_level + 1);
  
  WHILE NEW.total_xp >= required_xp LOOP
    new_level := new_level + 1;
    required_xp := calculate_xp_for_level(new_level + 1);
  END LOOP;
  
  IF new_level > NEW.level THEN
    NEW.level := new_level;
    
    -- Create activity for level up
    INSERT INTO activity_feed (user_id, activity_type, metadata)
    VALUES (NEW.user_id, 'level_up', jsonb_build_object('new_level', new_level));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_on_xp_change
  BEFORE UPDATE OF total_xp ON player_stats
  FOR EACH ROW
  WHEN (NEW.total_xp > OLD.total_xp)
  EXECUTE FUNCTION update_player_level();

-- Create bidirectional friendship
CREATE OR REPLACE FUNCTION create_friendship(user1_id UUID, user2_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO friendships (user_id, friend_id) VALUES (user1_id, user2_id);
  INSERT INTO friendships (user_id, friend_id) VALUES (user2_id, user1_id);
  
  -- Update friend counts
  UPDATE player_stats SET friends_count = friends_count + 1 WHERE user_id = user1_id;
  UPDATE player_stats SET friends_count = friends_count + 1 WHERE user_id = user2_id;
  
  -- Create activities
  INSERT INTO activity_feed (user_id, activity_type, related_id)
  VALUES (user1_id, 'friend_add', user2_id);
  INSERT INTO activity_feed (user_id, activity_type, related_id)
  VALUES (user2_id, 'friend_add', user1_id);
END;
$$ LANGUAGE plpgsql;

-- Check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  achievement RECORD;
  stats RECORD;
BEGIN
  SELECT * INTO stats FROM player_stats WHERE user_id = p_user_id;
  
  FOR achievement IN SELECT * FROM achievements WHERE id NOT IN (
    SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id
  ) LOOP
    IF (achievement.requirement_type = 'tournament_wins' AND stats.tournaments_won >= achievement.requirement_value) OR
       (achievement.requirement_type = 'tournament_joins' AND stats.tournaments_joined >= achievement.requirement_value) OR
       (achievement.requirement_type = 'match_wins' AND stats.matches_won >= achievement.requirement_value) OR
       (achievement.requirement_type = 'friend_count' AND stats.friends_count >= achievement.requirement_value) THEN
      
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement.id);
      UPDATE player_stats SET total_xp = total_xp + achievement.xp_reward, achievements_count = achievements_count + 1
      WHERE user_id = p_user_id;
      
      INSERT INTO activity_feed (user_id, activity_type, related_id)
      VALUES (p_user_id, 'achievement', achievement.id);
      
      INSERT INTO notifications (type, user_id, related_id, message)
      VALUES ('achievement_unlocked', p_user_id, achievement.id, achievement.name);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Get global leaderboard
CREATE OR REPLACE FUNCTION get_global_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  total_xp INTEGER,
  level INTEGER,
  tournaments_won INTEGER,
  rank_points INTEGER,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.user_id,
    u.username,
    u.avatar_url,
    ps.total_xp,
    ps.level,
    ps.tournaments_won,
    ps.rank_points,
    ROW_NUMBER() OVER (ORDER BY ps.rank_points DESC, ps.total_xp DESC)::INTEGER as rank_position
  FROM player_stats ps
  JOIN users u ON ps.user_id = u.id
  ORDER BY ps.rank_points DESC, ps.total_xp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get weekly leaderboard
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  weekly_xp INTEGER,
  weekly_wins INTEGER,
  rank_position INTEGER
) AS $$
DECLARE
  current_week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
  current_week_end DATE := (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::DATE;
BEGIN
  RETURN QUERY
  SELECT 
    wl.user_id,
    u.username,
    u.avatar_url,
    wl.weekly_xp,
    wl.weekly_wins,
    ROW_NUMBER() OVER (ORDER BY wl.weekly_xp DESC, wl.weekly_wins DESC)::INTEGER as rank_position
  FROM weekly_leaderboards wl
  JOIN users u ON wl.user_id = u.id
  WHERE wl.week_start = current_week_start AND wl.week_end = current_week_end
  ORDER BY wl.weekly_xp DESC, wl.weekly_wins DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SEED DATA - 30 Achievements
-- =============================================

INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, xp_reward, rarity) VALUES
-- Tournament Achievements
('First Victory', 'Win your first tournament', '🏆', 'tournament', 'tournament_wins', 1, 100, 'common'),
('Tournament Veteran', 'Win 5 tournaments', '🎖️', 'tournament', 'tournament_wins', 5, 500, 'rare'),
('Champion', 'Win 10 tournaments', '👑', 'tournament', 'tournament_wins', 10, 1000, 'epic'),
('Legend', 'Win 25 tournaments', '⭐', 'tournament', 'tournament_wins', 25, 2500, 'legendary'),
('First Steps', 'Join your first tournament', '🎮', 'tournament', 'tournament_joins', 1, 50, 'common'),
('Competitor', 'Join 10 tournaments', '🎯', 'tournament', 'tournament_joins', 10, 300, 'common'),
('Tournament Enthusiast', 'Join 50 tournaments', '🔥', 'tournament', 'tournament_joins', 50, 1500, 'rare'),
('Tournament Master', 'Join 100 tournaments', '💎', 'tournament', 'tournament_joins', 100, 3000, 'epic'),

-- Match Achievements
('First Blood', 'Win your first match', '⚔️', 'match', 'match_wins', 1, 50, 'common'),
('Skilled Fighter', 'Win 10 matches', '🗡️', 'match', 'match_wins', 10, 200, 'common'),
('Combat Expert', 'Win 50 matches', '🛡️', 'match', 'match_wins', 50, 800, 'rare'),
('Unstoppable', 'Win 100 matches', '💪', 'match', 'match_wins', 100, 1500, 'epic'),
('Warrior', 'Win 250 matches', '⚡', 'match', 'match_wins', 250, 3500, 'legendary'),
('Gladiator', 'Win 500 matches', '🌟', 'match', 'match_wins', 500, 7000, 'legendary'),

-- Social Achievements
('Social Butterfly', 'Add your first friend', '👥', 'social', 'friend_count', 1, 50, 'common'),
('Squad Leader', 'Add 5 friends', '👫', 'social', 'friend_count', 5, 200, 'common'),
('Community Builder', 'Add 10 friends', '🤝', 'social', 'friend_count', 10, 400, 'rare'),
('Popular', 'Add 25 friends', '🌐', 'social', 'friend_count', 25, 1000, 'epic'),

-- Milestone Achievements
('Getting Started', 'Reach level 5', '📈', 'milestone', 'custom', 5, 100, 'common'),
('Rising Star', 'Reach level 10', '🌠', 'milestone', 'custom', 10, 300, 'common'),
('Pro Player', 'Reach level 25', '💫', 'milestone', 'custom', 25, 1000, 'rare'),
('Elite Player', 'Reach level 50', '✨', 'milestone', 'custom', 50, 2500, 'epic'),
('Legendary Player', 'Reach level 100', '🌟', 'milestone', 'custom', 100, 5000, 'legendary'),

-- Special Achievements
('Early Adopter', 'Join during beta phase', '🎁', 'special', 'custom', 1, 500, 'rare'),
('Completionist', 'Unlock 10 achievements', '📋', 'special', 'custom', 10, 1000, 'rare'),
('Achievement Hunter', 'Unlock 20 achievements', '🏅', 'special', 'custom', 20, 2500, 'epic'),
('Perfect Player', 'Unlock all achievements', '💯', 'special', 'custom', 30, 10000, 'legendary'),

-- Streak Achievements
('Hot Streak', 'Win 3 matches in a row', '🔥', 'match', 'custom', 3, 200, 'common'),
('Dominating', 'Win 5 matches in a row', '⚡', 'match', 'custom', 5, 500, 'rare'),
('Unstoppable Force', 'Win 10 matches in a row', '💥', 'match', 'custom', 10, 1500, 'epic')
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA - Daily Challenges
-- =============================================

INSERT INTO daily_challenges (name, description, challenge_type, requirement_value, xp_reward, coin_reward, is_active) VALUES
('Daily Warrior', 'Play 3 matches today', 'play_matches', 3, 100, 50, true),
('Victory Seeker', 'Win 2 matches today', 'win_matches', 2, 150, 75, true),
('Tournament Participant', 'Join a tournament today', 'join_tournament', 1, 200, 100, true),
('Social Player', 'Send 2 friend requests', 'social_interaction', 2, 75, 50, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- INITIALIZE PLAYER STATS FOR EXISTING USERS
-- =============================================

-- Create player_stats for all existing users
INSERT INTO player_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- NOTES
-- =============================================
-- 1. Run this after the main schema.sql
-- 2. Enable Realtime for: player_stats, activity_feed, friend_requests, user_challenges
-- 3. Set up cron job to reset weekly leaderboards
-- 4. Consider implementing rate limiting for friend requests
