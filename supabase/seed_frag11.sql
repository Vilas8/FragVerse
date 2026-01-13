-- Sample Seed Data for Frag11 Fantasy IPL
-- Run this after creating the schema

-- Insert IPL Teams
INSERT INTO frag11_teams (id, name, short_name, logo_url, color_primary, color_secondary) VALUES
('team-mi', 'Mumbai Indians', 'MI', '/teams/mi.png', '#004BA0', '#FFD700'),
('team-csk', 'Chennai Super Kings', 'CSK', '/teams/csk.png', '#FDB913', '#0080FF'),
('team-rcb', 'Royal Challengers Bangalore', 'RCB', '/teams/rcb.png', '#EC1C24', '#000000'),
('team-kkr', 'Kolkata Knight Riders', 'KKR', '/teams/kkr.png', '#3A225D', '#B3A123'),
('team-dc', 'Delhi Capitals', 'DC', '/teams/dc.png', '#004C93', '#EF1B23'),
('team-srh', 'Sunrisers Hyderabad', 'SRH', '/teams/srh.png', '#FF822A', '#000000'),
('team-rr', 'Rajasthan Royals', 'RR', '/teams/rr.png', '#254AA5', '#FFC0CB'),
('team-pbks', 'Punjab Kings', 'PBKS', '/teams/pbks.png', '#ED1B24', '#C0C0C0');

-- Insert Sample Players (Mumbai Indians)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('Rohit Sharma', 'team-mi', 'BAT', 11.0, 150, 5879, 0, 30.35, 131.52, NULL, 1850, 78.5, 45.2),
('Ishan Kishan', 'team-mi', 'WK', 9.5, 80, 2325, 0, 29.87, 136.78, NULL, 980, 68.3, 38.5),
('Suryakumar Yadav', 'team-mi', 'BAT', 10.5, 120, 2641, 0, 29.34, 145.36, NULL, 1520, 85.2, 52.1),
('Hardik Pandya', 'team-mi', 'AR', 10.0, 90, 1476, 42, 28.38, 143.34, 8.45, 1380, 82.5, 48.7),
('Jasprit Bumrah', 'team-mi', 'BOWL', 11.5, 110, 56, 145, 7.00, 90.91, 7.30, 1950, 92.8, 62.4);

-- Insert Sample Players (Chennai Super Kings)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('MS Dhoni', 'team-csk', 'WK', 10.5, 220, 4978, 0, 39.02, 137.54, NULL, 2200, 88.5, 58.9),
('Ruturaj Gaikwad', 'team-csk', 'BAT', 9.0, 45, 1797, 0, 44.92, 135.82, NULL, 780, 72.5, 35.2),
('Ravindra Jadeja', 'team-csk', 'AR', 10.5, 200, 2386, 127, 26.51, 127.32, 7.68, 1880, 82.3, 51.6),
('Deepak Chahar', 'team-csk', 'BOWL', 9.0, 60, 90, 59, 10.00, 120.00, 7.84, 680, 65.8, 28.4);

-- Insert Sample Players (Royal Challengers Bangalore)
INSERT INTO frag11_players (name, team_id, role, credits, matches_played, runs, wickets, average, strike_rate, economy, total_points, average_points, selected_by) VALUES
('Virat Kohli', 'team-rcb', 'BAT', 11.5, 215, 6624, 4, 37.39, 130.41, NULL, 2400, 92.5, 68.3),
('Glenn Maxwell', 'team-rcb', 'AR', 10.0, 100, 1505, 38, 25.94, 154.67, 7.45, 1250, 78.6, 44.8),
('Mohammed Siraj', 'team-rcb', 'BOWL', 9.5, 60, 25, 51, 4.16, 75.00, 8.02, 720, 68.2, 32.1);

-- Insert Upcoming Matches
INSERT INTO frag11_matches (match_number, team1_id, team2_id, venue, match_date, match_time, status) VALUES
(1, 'team-mi', 'team-csk', 'Wankhede Stadium, Mumbai', '2026-03-22', '19:30:00', 'upcoming'),
(2, 'team-rcb', 'team-kkr', 'M. Chinnaswamy Stadium, Bangalore', '2026-03-23', '15:30:00', 'upcoming'),
(3, 'team-dc', 'team-srh', 'Arun Jaitley Stadium, Delhi', '2026-03-24', '19:30:00', 'upcoming'),
(4, 'team-rr', 'team-pbks', 'Sawai Mansingh Stadium, Jaipur', '2026-03-25', '19:30:00', 'upcoming');

-- Insert Sample Contests
INSERT INTO frag11_contests (match_id, name, description, type, status, entry_fee, max_entries, current_entries, max_teams_per_user, total_prize_pool, winner_percentage, first_prize, is_guaranteed, is_featured) VALUES
((SELECT id FROM frag11_matches WHERE match_number = 1), 'Mega Contest', 'Win big with our featured mega contest', 'mega', 'upcoming', 49, 10000, 3245, 10, 3500000, 40, 500000, true, true),
((SELECT id FROM frag11_matches WHERE match_number = 1), 'Practice Contest', 'Free entry practice contest for beginners', 'free', 'upcoming', 0, 1000, 567, 1, 10000, 10, 5000, false, false),
((SELECT id FROM frag11_matches WHERE match_number = 1), 'Head to Head', 'Challenge another player', 'head_to_head', 'upcoming', 25, 2, 0, 1, 40, 50, 40, false, false),
((SELECT id FROM frag11_matches WHERE match_number = 2), 'Winner Takes All', 'High stakes, high rewards', 'paid', 'upcoming', 100, 100, 45, 5, 9000, 1, 9000, true, true);

-- Update match stats
UPDATE frag11_matches SET contests_count = (
  SELECT COUNT(*) FROM frag11_contests WHERE frag11_contests.match_id = frag11_matches.id
);

UPDATE frag11_matches SET total_prize_pool = (
  SELECT COALESCE(SUM(total_prize_pool), 0) FROM frag11_contests WHERE frag11_contests.match_id = frag11_matches.id
);
