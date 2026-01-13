-- Sample Seed Data for Frag11 Fantasy IPL
-- Run this after creating the schema

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE frag11_contest_entries, frag11_contests, frag11_user_teams, frag11_player_points, frag11_players, frag11_matches, frag11_teams CASCADE;

-- Insert IPL Teams (using uuid_generate_v4() for proper UUIDs)
INSERT INTO frag11_teams (name, short_name, logo_url, color_primary, color_secondary) VALUES
('Mumbai Indians', 'MI', '/teams/mi.png', '#004BA0', '#FFD700'),
('Chennai Super Kings', 'CSK', '/teams/csk.png', '#FDB913', '#0080FF'),
('Royal Challengers Bangalore', 'RCB', '/teams/rcb.png', '#EC1C24', '#000000'),
('Kolkata Knight Riders', 'KKR', '/teams/kkr.png', '#3A225D', '#B3A123'),
('Delhi Capitals', 'DC', '/teams/dc.png', '#004C93', '#EF1B23'),
('Sunrisers Hyderabad', 'SRH', '/teams/srh.png', '#FF822A', '#000000'),
('Rajasthan Royals', 'RR', '/teams/rr.png', '#254AA5', '#FFC0CB'),
('Punjab Kings', 'PBKS', '/teams/pbks.png', '#ED1B24', '#C0C0C0');

-- Insert Sample Players (Mumbai Indians)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('Rohit Sharma', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'BAT', 11.0, 150, 5879, 0, 30.35, 131.52, NULL, 1850, 78.5, 45.2),
('Ishan Kishan', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'WK', 9.5, 80, 2325, 0, 29.87, 136.78, NULL, 980, 68.3, 38.5),
('Suryakumar Yadav', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'BAT', 10.5, 120, 2641, 0, 29.34, 145.36, NULL, 1520, 85.2, 52.1),
('Hardik Pandya', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'AR', 10.0, 90, 1476, 42, 28.38, 143.34, 8.45, 1380, 82.5, 48.7),
('Jasprit Bumrah', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'BOWL', 11.5, 110, 56, 145, 7.00, 90.91, 7.30, 1950, 92.8, 62.4),
('Tim David', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'BAT', 8.5, 40, 850, 0, 35.42, 158.21, NULL, 620, 72.1, 28.3),
('Tilak Varma', (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 'BAT', 8.0, 35, 680, 0, 32.38, 142.56, NULL, 480, 65.4, 22.1);

-- Insert Sample Players (Chennai Super Kings)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('MS Dhoni', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'WK', 10.5, 220, 4978, 0, 39.02, 137.54, NULL, 2200, 88.5, 58.9),
('Ruturaj Gaikwad', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'BAT', 9.5, 45, 1797, 0, 44.92, 135.82, NULL, 780, 72.5, 35.2),
('Ravindra Jadeja', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'AR', 10.5, 200, 2386, 127, 26.51, 127.32, 7.68, 1880, 82.3, 51.6),
('Deepak Chahar', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'BOWL', 9.0, 60, 90, 59, 10.00, 120.00, 7.84, 680, 65.8, 28.4),
('Shivam Dube', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'AR', 8.5, 55, 920, 15, 28.75, 145.23, 9.12, 540, 58.2, 24.5),
('Matheesha Pathirana', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'BOWL', 8.5, 25, 10, 32, 5.00, 66.67, 7.92, 420, 71.5, 31.2),
('Devon Conway', (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 'BAT', 9.0, 30, 890, 0, 38.70, 128.35, NULL, 520, 68.9, 29.8);

-- Insert Sample Players (Royal Challengers Bangalore)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('Virat Kohli', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'BAT', 11.5, 215, 6624, 4, 37.39, 130.41, NULL, 2400, 92.5, 68.3),
('Glenn Maxwell', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'AR', 10.0, 100, 1505, 38, 25.94, 154.67, 7.45, 1250, 78.6, 44.8),
('Mohammed Siraj', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'BOWL', 9.5, 60, 25, 51, 4.16, 75.00, 8.02, 720, 68.2, 32.1),
('Faf du Plessis', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'BAT', 10.0, 100, 2800, 0, 32.56, 138.92, NULL, 1150, 76.4, 42.5),
('Dinesh Karthik', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'WK', 8.5, 180, 2100, 0, 26.25, 145.83, NULL, 890, 62.3, 35.6),
('Wanindu Hasaranga', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'AR', 9.0, 35, 180, 42, 12.00, 132.35, 7.65, 580, 74.2, 38.9),
('Josh Hazlewood', (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 'BOWL', 9.0, 25, 8, 28, 4.00, 50.00, 7.85, 380, 69.5, 27.4);

-- Insert Sample Players (Kolkata Knight Riders)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('Shreyas Iyer', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'BAT', 10.0, 90, 2400, 0, 32.43, 128.34, NULL, 1100, 75.8, 41.2),
('Andre Russell', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'AR', 10.5, 100, 1800, 85, 28.57, 177.78, 9.25, 1650, 88.5, 55.3),
('Sunil Narine', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'AR', 9.5, 150, 1200, 152, 15.00, 168.07, 6.65, 1820, 78.2, 48.7),
('Rinku Singh', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'BAT', 8.0, 35, 550, 0, 45.83, 152.78, NULL, 420, 68.5, 25.8),
('Varun Chakravarthy', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'BOWL', 8.5, 45, 12, 48, 6.00, 60.00, 7.12, 520, 65.4, 28.9),
('Nitish Rana', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'BAT', 8.0, 75, 1680, 0, 26.25, 132.28, NULL, 680, 58.6, 22.4),
('Phil Salt', (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 'WK', 9.0, 20, 420, 0, 35.00, 165.35, NULL, 340, 72.8, 32.1);

-- Insert Upcoming Matches
INSERT INTO frag11_matches (match_number, team1_id, team2_id, venue, match_date, match_time, status) VALUES
(1, 
  (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 
  'Wankhede Stadium, Mumbai', '2026-03-22', '19:30:00', 'upcoming'),
(2, 
  (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 
  'M. Chinnaswamy Stadium, Bangalore', '2026-03-23', '15:30:00', 'upcoming'),
(3, 
  (SELECT id FROM frag11_teams WHERE short_name = 'DC'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'SRH'), 
  'Arun Jaitley Stadium, Delhi', '2026-03-24', '19:30:00', 'upcoming'),
(4, 
  (SELECT id FROM frag11_teams WHERE short_name = 'RR'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'PBKS'), 
  'Sawai Mansingh Stadium, Jaipur', '2026-03-25', '19:30:00', 'upcoming'),
(5, 
  (SELECT id FROM frag11_teams WHERE short_name = 'CSK'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'RCB'), 
  'MA Chidambaram Stadium, Chennai', '2026-03-26', '19:30:00', 'upcoming'),
(6, 
  (SELECT id FROM frag11_teams WHERE short_name = 'MI'), 
  (SELECT id FROM frag11_teams WHERE short_name = 'KKR'), 
  'Wankhede Stadium, Mumbai', '2026-03-27', '19:30:00', 'upcoming');

-- Insert Sample Contests for Match 1 (MI vs CSK)
INSERT INTO frag11_contests (match_id, name, description, type, status, entry_fee, max_entries, current_entries, max_teams_per_user, total_prize_pool, winner_percentage, first_prize, prize_distribution, is_guaranteed, is_featured) VALUES
((SELECT id FROM frag11_matches WHERE match_number = 1), 
  'Mega Contest', 'Win big with our featured mega contest', 'mega', 'upcoming', 
  49, 10000, 3245, 10, 3500000, 40, 500000, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 500000}, {"rank_from": 2, "rank_to": 2, "prize": 200000}, {"rank_from": 3, "rank_to": 5, "prize": 50000}]'::jsonb,
  true, true),

((SELECT id FROM frag11_matches WHERE match_number = 1), 
  'Practice Contest', 'Free entry practice contest for beginners', 'free', 'upcoming', 
  0, 1000, 567, 1, 10000, 10, 5000, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 5000}, {"rank_from": 2, "rank_to": 5, "prize": 1000}]'::jsonb,
  false, false),

((SELECT id FROM frag11_matches WHERE match_number = 1), 
  'Head to Head', 'Challenge another player', 'head_to_head', 'upcoming', 
  25, 2, 0, 1, 45, 50, 45, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 45}]'::jsonb,
  false, false),

((SELECT id FROM frag11_matches WHERE match_number = 1), 
  'Winners League', 'Premium contest with big rewards', 'paid', 'upcoming', 
  99, 500, 234, 5, 40000, 30, 10000, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 10000}, {"rank_from": 2, "rank_to": 3, "prize": 5000}]'::jsonb,
  true, false);

-- Insert Sample Contests for Match 2 (RCB vs KKR)
INSERT INTO frag11_contests (match_id, name, description, type, status, entry_fee, max_entries, current_entries, max_teams_per_user, total_prize_pool, winner_percentage, first_prize, prize_distribution, is_guaranteed, is_featured) VALUES
((SELECT id FROM frag11_matches WHERE match_number = 2), 
  'Winner Takes All', 'High stakes, high rewards', 'paid', 'upcoming', 
  100, 100, 45, 5, 9000, 1, 9000, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 9000}]'::jsonb,
  true, true),

((SELECT id FROM frag11_matches WHERE match_number = 2), 
  'Beginner Friendly', 'Perfect for new players', 'free', 'upcoming', 
  0, 2000, 892, 1, 20000, 15, 8000, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 8000}, {"rank_from": 2, "rank_to": 10, "prize": 1000}]'::jsonb,
  false, true),

((SELECT id FROM frag11_matches WHERE match_number = 2), 
  'Small League', 'Compete with fewer players', 'paid', 'upcoming', 
  15, 50, 28, 3, 600, 20, 250, 
  '[{"rank_from": 1, "rank_to": 1, "prize": 250}, {"rank_from": 2, "rank_to": 5, "prize": 75}]'::jsonb,
  false, false);

-- Update match stats (contests count and total prize pool)
UPDATE frag11_matches SET 
  contests_count = (SELECT COUNT(*) FROM frag11_contests WHERE frag11_contests.match_id = frag11_matches.id),
  total_prize_pool = (SELECT COALESCE(SUM(total_prize_pool), 0) FROM frag11_contests WHERE frag11_contests.match_id = frag11_matches.id);

-- Verify the data
SELECT 'Teams:' as type, COUNT(*) as count FROM frag11_teams
UNION ALL
SELECT 'Players:', COUNT(*) FROM frag11_players
UNION ALL
SELECT 'Matches:', COUNT(*) FROM frag11_matches
UNION ALL
SELECT 'Contests:', COUNT(*) FROM frag11_contests;
