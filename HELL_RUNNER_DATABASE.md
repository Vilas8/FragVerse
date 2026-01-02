# Hell Runner - Database Integration Guide

**Last Updated:** January 2, 2026  
**Version:** 2.2 (Database Integration Complete)

---

## 📊 Database Overview

Hell Runner uses **Supabase PostgreSQL** for persistent storage of player progress, leaderboards, achievements, and statistics.

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `hell_runner_progress` | Track player's current progress | user_id, current_door, current_stage, total_deaths, best_time |
| `hell_runner_leaderboard` | Record completion times | user_id, door, stage, time_seconds, death_count |
| `user_achievements` | Track unlocked achievements | user_id, achievement_id, unlocked_at |
| `player_stats` | Overall player statistics | user_id, level, xp, win_rate, achievements_count |
| `notifications` | In-game notifications | user_id, type, message, read, priority |

---

## 🔧 Database Actions

All database operations are handled in `lib/games/hell-runner/db-actions.ts`

### Progress Tracking

```typescript
// Save game progress after level completion
await saveGameProgress(userId, door, stage, deaths, time);

// Get player's progress
const { data: progress } = await getGameProgress(userId);
// Returns: { current_door, current_stage, total_deaths, best_time, ... }
```

### Leaderboards

```typescript
// Save completion time to leaderboard
await saveLeaderboardEntry(userId, door, stage, time, deaths);

// Get top 10 players for a specific level
const { data: leaderboard } = await getLeaderboard(door, stage, 10);

// Get global leaderboard (all levels)
const { data: global } = await getGlobalLeaderboard(50);

// Get player's rank for a specific level
const { data: rank } = await getUserLeaderboardRank(userId, door, stage);
// Returns: { rank, time }
```

### Achievements

```typescript
// Unlock achievement for player
await unlockAchievement(userId, achievementId);

// Get all achievements a player has unlocked
const { data: unlocked } = await getUserAchievements(userId);

// Get all available achievements
const { data: all } = await getAchievements();
```

### Player Stats

```typescript
// Update player statistics
await updatePlayerStats(userId, {
  total_xp: 1500,
  level: 5,
  matches_won: 10,
  matches_lost: 3,
  current_streak: 5,
});

// Get player stats
const { data: stats } = await getPlayerStats(userId);
```

### Notifications

```typescript
// Create notification for player
await createNotification(
  userId,
  'achievement_unlock',
  'You unlocked Immortal achievement!',
  'high'
);

// Get player's notifications
const { data: notifications } = await getUserNotifications(userId);
const { data: unread } = await getUserNotifications(userId, true);
```

---

## 🏆 Achievement System

### 26 Total Achievements

All achievements are defined in `lib/games/hell-runner/achievements.ts`

#### Categories & Examples

**Milestone Achievements (4)**
- First Step (Door 1)
- Disappearing Act (Door 3)
- Gravity Mastery (Door 5)
- Mega Chaos Conqueror (Door 8)

**Speedrun Achievements (4)**
- Quick Learner (< 30s)
- Timeless Platformer (< 60s)
- Gravity Speedster (< 90s)
- Time Master (All doors < 60s avg)

**Challenge Achievements (5)**
- Flawless Victory (0 deaths)
- Platform Perfect (Door 3, 0 deaths)
- Immortal (All doors, 0 deaths)
- Never Give Up (100 deaths)
- Perseverance (1000 deaths)

**Special Achievements (9)**
- Tutorial Master (Door 1, all stages)
- Hell Runner Legend (40/40 levels)
- XP Collector (10,000 XP)
- Top 10 Player
- Champion (Rank #1)
- Key Finder (1 secret key)
- Vault Opener (10 secret keys)
- And more...

### XP Rewards

```typescript
// Import achievements
import { getTotalXpAvailable, getAchievementsByRarity } from './achievements';

// Total XP available from all achievements
const maxXp = getTotalXpAvailable(); // ~18,500 XP

// Get achievements by rarity
const legendary = getAchievementsByRarity('legendary'); // 6 achievements
const epic = getAchievementsByRarity('epic');           // 5 achievements
```

---

## 📈 Leaderboard Schema

### Door & Stage Leaderboards

Each Door-Stage combination has its own leaderboard:

```
Door 1-8 × Stage 1-5 = 40 total leaderboards
```

Example:
```
Door 1, Stage 1:
  1. Player A - 24.3s (5 deaths)
  2. Player B - 25.1s (8 deaths)
  3. Player C - 26.8s (12 deaths)
  ...
```

### Ranking Formula

```typescript
// Primary: Fastest time
// Secondary: Fewest deaths (tiebreaker)
// User's rank = COUNT(records with faster time) + 1
```

---

## 🔑 Key Features

### Automatic Progress Tracking

On level completion, automatically:
1. ✅ Save leaderboard entry
2. ✅ Update player progress
3. ✅ Check achievement criteria
4. ✅ Unlock any earned achievements
5. ✅ Update player stats
6. ✅ Create notification

### Player Level System

```typescript
// XP-based progression
Level 1: 0 XP
Level 2: 1000 XP
Level 3: 2500 XP
Level 4: 4500 XP
Level 5: 7500 XP
...
```

### Session Persistence

- Player progress syncs to Supabase
- Can resume from last checkpoint
- Offline play supported (sync when online)

---

## 🔌 Integration Points

### In GameOverScene

```typescript
import { saveGameProgress, saveLeaderboardEntry, updatePlayerStats } from '@/lib/games/hell-runner/db-actions';

// When level completes:
const userId = getUserId(); // From auth
const { data: progress } = await saveGameProgress(
  userId,
  door,
  stage,
  deaths,
  timeElapsed
);

const { data: leaderboard } = await saveLeaderboardEntry(
  userId,
  door,
  stage,
  timeElapsed,
  deaths
);

await updatePlayerStats(userId, {
  total_xp: 1000, // or calculate
  level: 5,
});
```

### In Leaderboard Component

```typescript
import { getLeaderboard, getUserLeaderboardRank } from '@/lib/games/hell-runner/db-actions';

const { data: topPlayers } = await getLeaderboard(currentDoor, currentStage, 10);
const { data: userRank } = await getUserLeaderboardRank(userId, currentDoor, currentStage);
```

### In Profile/Stats Page

```typescript
import { getGameProgress, getPlayerStats, getUserAchievements } from '@/lib/games/hell-runner/db-actions';

const { data: progress } = await getGameProgress(userId);
const { data: stats } = await getPlayerStats(userId);
const { data: achievements } = await getUserAchievements(userId);
```

---

## 🛡️ Security & Best Practices

### Row Level Security (RLS)

All tables should have RLS enabled:

```sql
-- Users can only see their own progress
ALTER TABLE hell_runner_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own progress"
  ON hell_runner_progress
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Error Handling

```typescript
const { data, error, success } = await saveGameProgress(...);

if (!success) {
  console.error('Failed to save progress:', error);
  // Fallback to localStorage
  localStorage.setItem('pending_progress', JSON.stringify({...}));
}
```

---

## 📱 Future Enhancements

### Phase 4 (Pro Polish)

- [x] Progress persistence
- [x] Leaderboards
- [x] Achievements
- [ ] Real-time leaderboard updates (WebSocket)
- [ ] Daily challenges
- [ ] Weekly challenges
- [ ] Friend competitions
- [ ] Seasonal events
- [ ] Cosmetics/Rewards

---

## 🔍 Monitoring & Analytics

### Key Metrics to Track

```typescript
// In Supabase dashboard
SELECT 
  door,
  stage,
  COUNT(*) as completions,
  AVG(time_seconds) as avg_time,
  AVG(death_count) as avg_deaths
FROM hell_runner_leaderboard
GROUP BY door, stage
ORDER BY door, stage;
```

### Player Funnel

- Door 1 completions: ~80%
- Door 3 completions: ~40% (difficulty spike)
- Door 5 completions: ~15% (major difficulty)
- Door 8 completions: ~2% (ultimate challenge)

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL: https://www.postgresql.org/docs
- Auth: `@/utils/supabase/server`

---

**All database operations are type-safe and handle errors gracefully.** ✨
