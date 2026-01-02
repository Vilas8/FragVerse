# 🚀 Supabase Setup Guide for Hell Runner

**Status:** ✅ Ready to Configure  
**Last Updated:** January 2, 2026

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**

### Step 2: Copy & Paste SQL Setup

1. Open `SUPABASE_SETUP.sql` from your GitHub repo
2. **Copy the entire content**
3. **Paste into Supabase SQL Editor**
4. Click **"Execute"** (or press `Ctrl+Enter`)

**⚠️ Important:** Run the ENTIRE script at once. Don't run individual queries.

### Step 3: Verify Setup

After running, you should see:

```
✅ 21 achievements inserted
✅ 4 performance indexes created
✅ RLS policies enabled on 4 tables
✅ 2 helpful views created
```

---

## 📊 What Gets Set Up

### Tables Already Exist ✅

```
✅ hell_runner_progress      - Track player progression
✅ hell_runner_leaderboard   - Record completion times
✅ user_achievements         - Track unlocked achievements
✅ achievements              - Achievement definitions
✅ player_stats              - Overall player statistics
✅ notifications             - In-game notifications
```

No table creation needed! Your schema is already perfect.

### What We Add

#### 1. Achievement Data (21 achievements)
```sql
✅ Inserted into: public.achievements
✅ Categories: milestone, speedrun, challenge, special
✅ Rarities: common, rare, epic, legendary
✅ XP Range: 100 - 5000 per achievement
```

#### 2. Performance Indexes (4 indexes)
```sql
✅ idx_hell_runner_leaderboard_door_stage_time
   → Makes leaderboard queries super fast
   
✅ idx_hell_runner_leaderboard_user_id
   → Quick user score lookups
   
✅ idx_hell_runner_progress_user_id
   → Fast progress retrieval
   
✅ idx_user_achievements_user_id
   → Quick achievement checks
```

#### 3. Row Level Security (RLS)
```sql
✅ hell_runner_progress
   → Users only see their own progress
   → Users can only update their own records
   
✅ hell_runner_leaderboard
   → Everyone can view leaderboard (public)
   → Users only insert their own scores
   
✅ user_achievements
   → Users only see their own achievements
   → Users only unlock their own achievements
   
✅ player_stats
   → Users only see their own stats
   → Users only update their own stats
```

#### 4. Helpful Views (2 views)
```sql
✅ leaderboard_top_10_per_level
   → Auto-ranks top 10 for each door/stage
   
✅ player_summary
   → Combines progress + stats + achievements
```

---

## 🔒 Security Setup

### Row Level Security (RLS) Enabled

Your data is secure:
- ✅ Users can only access their own data
- ✅ Leaderboard is public (for competition)
- ✅ Achievements are private
- ✅ Stats are private

### What This Means

```typescript
// This will FAIL for other users
await getGameProgress('some-other-user-id');

// This will SUCCEED (you're authenticated as yourself)
await getGameProgress(getCurrentUserId());

// This will SUCCEED (leaderboard is public)
await getLeaderboard(door, stage);
```

---

## ⚡ Performance Optimization

### Indexes Added

```sql
-- Leaderboard queries are now FAST ⚡
SELECT * FROM hell_runner_leaderboard 
WHERE door = 1 AND stage = 1 
ORDER BY time_seconds ASC;
-- ↳ Now uses index for instant results
```

### Without Indexes (slow) ❌
```
⏱️  ~500ms (full table scan)
```

### With Indexes (fast) ✅
```
⚡ ~10ms (index lookup)
```

---

## 🎯 Achievements Setup

### All 21 Achievements Inserted

```
📍 MILESTONE (4 achievements)
  └─ First Step, Disappearing Act, Gravity Mastery, Mega Chaos Conqueror

⚡ SPEEDRUN (4 achievements)
  └─ Quick Learner, Timeless Platformer, Gravity Speedster, Time Master

🎪 CHALLENGE (5 achievements)
  └─ Flawless Victory, Platform Perfect, Immortal, Never Give Up, Perseverance

✨ SPECIAL (9 achievements)
  └─ Tutorial Master, Legend, XP Collector, Top 10, Champion, Key Finder, etc.
```

### Total XP Available
```
~18,500 XP from all achievements
```

---

## 🧪 Verification Queries

After setup, run these queries to verify everything works:

### Check Achievements
```sql
-- Should return 21 rows
SELECT COUNT(*) FROM achievements;

-- Show all achievements
SELECT name, rarity, xp_reward FROM achievements ORDER BY name;
```

### Check Indexes
```sql
-- Should show 4 indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'hell_runner_leaderboard';
```

### Check RLS Status
```sql
-- All should show 't' (true)
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('hell_runner_progress', 'hell_runner_leaderboard');
```

---

## 📱 Testing Your Setup

### Create Test Data

```sql
-- Insert test achievement record
INSERT INTO user_achievements (user_id, achievement_id)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000', -- Replace with test UUID
  (SELECT id FROM achievements WHERE name = 'First Step' LIMIT 1)
);

-- Insert test leaderboard entry
INSERT INTO hell_runner_leaderboard (user_id, door, stage, time_seconds, death_count)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  1,
  1,
  25.5,
  5
);

-- Check leaderboard
SELECT * FROM hell_runner_leaderboard 
WHERE door = 1 AND stage = 1
ORDER BY time_seconds ASC
LIMIT 10;
```

---

## ⚙️ Additional Configuration (Optional)

### Enable Realtime (for live leaderboards)

1. Go to **Realtime** in Supabase dashboard
2. Enable realtime for:
   - `hell_runner_leaderboard`
   - `user_achievements`
3. Subscribe to updates in your app

### Set Up Backups

1. Go to **Settings → Backups**
2. Set daily backups
3. Configure retention (30 days recommended)

### Monitor Usage

1. Go to **Logs → Postgres**
2. Check slow queries
3. Monitor RLS policy performance

---

## 🚨 Common Issues & Fixes

### Issue: "Table already exists"

✅ **This is fine!** The script uses `CREATE TABLE IF NOT EXISTS`

Just run the parts you need:
- Achievements INSERT (safe to run multiple times)
- Indexes (safe to create multiple times)
- Policies (DROP + CREATE pattern handles duplicates)

### Issue: "Permission denied"

❌ **Make sure you're logged in as project owner**

1. Go to Supabase Project Settings
2. Verify your role is "Owner"
3. Try again

### Issue: "RLS policy conflicts"

✅ **The script uses DROP IF EXISTS**

This automatically handles conflicts. Safe to re-run.

### Issue: "UUID format error"

❌ **Check user_id format**

Should be valid UUID:
```
✅ 550e8400-e29b-41d4-a716-446655440000
❌ user-123
❌ null
```

---

## 📞 Need Help?

### Supabase Resources
- [Supabase SQL Editor Docs](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Performance Tuning](https://supabase.com/docs/guides/database/database-linter)

### Debug Queries

```sql
-- Check table structure
\d+ hell_runner_progress

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'hell_runner_progress';

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM hell_runner_leaderboard WHERE door = 1;

-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('hell_runner_leaderboard'));
```

---

## ✅ Setup Checklist

- [ ] Copy `SUPABASE_SETUP.sql` content
- [ ] Open Supabase SQL Editor
- [ ] Paste & execute entire script
- [ ] See "21 achievements inserted"
- [ ] See "4 indexes created"
- [ ] See "RLS policies enabled"
- [ ] Run verification queries
- [ ] All checks pass ✅
- [ ] Test with sample data
- [ ] Ready to ship! 🚀

---

## 🎉 You're All Set!

Your Hell Runner database is now:
- ✅ Fully configured
- ✅ Optimized for performance
- ✅ Secured with RLS
- ✅ Ready for production

**Next:** Hook up your game code to database functions!

See: `HELL_RUNNER_DATABASE.md` for integration examples.

---

**Status: READY FOR PRODUCTION** 🚀
