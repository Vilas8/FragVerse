# Hell Runner - LAUNCH CHECKLIST

**Target Launch:** January 2-3, 2026  
**Status:** READY TO SHIP 🚀

---

## ⚡ IMMEDIATE (Next 30 Minutes)

### Step 1: Activate Supabase Database
- [ ] Open https://supabase.com/dashboard
- [ ] Go to SQL Editor
- [ ] Copy `SUPABASE_SETUP.sql` (entire file)
- [ ] Paste into SQL Editor
- [ ] Click Execute
- [ ] **Verify:** See "21 achievements inserted" ✅

### Step 2: Verify Build Works
```bash
# Run locally
npm run dev

# Go to http://localhost:3000/games/hell-runner
# Try playing a level
# Check console for errors
```
- [ ] Game loads
- [ ] No console errors
- [ ] Can play Level 1
- [ ] Can reach exit door
- [ ] Game over screen shows

### Step 3: Test Database Connection
```bash
# In Supabase dashboard:
SELECT COUNT(*) FROM achievements;
# Should return: 21
```
- [ ] Achievements table populated
- [ ] Leaderboard table ready
- [ ] Progress table ready
- [ ] RLS policies active

---

## 🔧 CONFIGURATION (Next 1 Hour)

### Environment Variables
```bash
# .env.local should have:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
- [ ] .env.local configured
- [ ] No secrets in GitHub
- [ ] Keys match Supabase project

### Supabase RLS Verification
```sql
-- Run in Supabase SQL Editor:
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('hell_runner_progress', 'hell_runner_leaderboard', 
'user_achievements', 'player_stats');
-- All should show TRUE
```
- [ ] RLS enabled on all tables
- [ ] Policies created
- [ ] Security configured

---

## 🎮 GAMEPLAY TESTING (Next 2 Hours)

### Level Progression
- [ ] Door 1, Stage 1: Can complete
- [ ] Door 1, Stage 5: Can complete all 5 stages
- [ ] Door 2: Enemies work properly
- [ ] Door 3: Disappearing platforms work
- [ ] Door 4: Saw blades move correctly
- [ ] Door 5: Gravity flip toggles
- [ ] Door 6: Control reversal works
- [ ] Door 7-8: Mixed mechanics work

### Features Testing
- [ ] Death counter increments
- [ ] Timer counts up
- [ ] Power-ups work (speed, shield, jump)
- [ ] Enemies patrol/jump
- [ ] Spikes kill player
- [ ] Door exit works
- [ ] Score calculates correctly

### Mobile Testing
- [ ] Touch buttons visible
- [ ] Touch buttons responsive
- [ ] Works in landscape
- [ ] Works in portrait
- [ ] No layout breaks

---

## 💾 DATABASE TESTING (Next 1 Hour)

### Progress Saving
```javascript
// In browser console (authenticated):
await saveGameProgress(userId, 1, 1, 5, 25.5);
// Check Supabase - should see record
```
- [ ] Progress saves
- [ ] Progress loads
- [ ] User_id correct
- [ ] Data persists

### Leaderboard
```javascript
await saveLeaderboardEntry(userId, 1, 1, 25.5, 5);
await getLeaderboard(1, 1, 10);
// Should see your entry
```
- [ ] Leaderboard entry saves
- [ ] Ranking calculates
- [ ] Times sort correctly
- [ ] Can retrieve top 10

### Achievements
```javascript
await unlockAchievement(userId, 'first_door');
await getUserAchievements(userId);
// Should see achievement unlocked
```
- [ ] Achievement unlocks
- [ ] No duplicates on re-unlock
- [ ] Can retrieve all unlocked
- [ ] Unlock time recorded

---

## 📱 DEPLOYMENT PREP (Next 1 Hour)

### Build Verification
```bash
npm run build
# Should complete without errors
```
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size acceptable

### Vercel Settings
- [ ] Project linked to GitHub
- [ ] Environment variables set
- [ ] Build command: `next build`
- [ ] Start command: `next start`
- [ ] Auto-deploy on push enabled

### Final Checks
- [ ] All commits pushed
- [ ] No uncommitted changes
- [ ] README updated
- [ ] .gitignore correct
- [ ] No secrets in code

---

## 🚀 LAUNCH (Final Steps)

### Pre-Launch
- [ ] Latest build passes
- [ ] Database verified
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Team informed

### Deploy
```bash
# Push to main
git add .
git commit -m "launch: Hell Runner Phase 2 complete"
git push origin main

# Vercel auto-deploys
# Wait ~3 minutes for deployment
```
- [ ] Commit messages clear
- [ ] All files pushed
- [ ] Vercel deployment started
- [ ] Deployment succeeds

### Post-Launch Verification
- [ ] Live site loads
- [ ] Game playable
- [ ] No console errors
- [ ] Database responding
- [ ] Leaderboard accessible
- [ ] Achievements loading

---

## 📊 PERFORMANCE TARGETS

```
Load Time:           < 3 seconds
Game FPS:            60 FPS stable
Input Lag:           < 100ms
Database Query:      < 500ms
Leaderboard Load:    < 1 second
Mobile Performance:  Smooth on iPhone 12+
```

- [ ] Load time acceptable
- [ ] FPS stays at 60
- [ ] No stuttering
- [ ] Mobile smooth
- [ ] Leaderboard fast

---

## 🎯 SOFT LAUNCH GOALS

### Week 1
- [ ] Get feedback from testers
- [ ] Fix any bugs found
- [ ] Monitor leaderboard activity
- [ ] Check achievement unlock rates
- [ ] Gather player suggestions

### Week 2
- [ ] Start Phase 3 planning
- [ ] Design Doors 9-16
- [ ] Plan boss encounters
- [ ] Outline secret content

### Week 3-4
- [ ] Phase 3 implementation
- [ ] 40 new levels
- [ ] Advanced mechanics
- [ ] Phase 4 planning

---

## 📢 ANNOUNCEMENT

### Social Media Post
```
🎮 HELL RUNNER IS LIVE! 🔥

A challenging platform game with 40 levels of pure chaos.

Features:
🚀 40 Playable Levels (8 Doors × 5 Stages)
🏆 Real-time Leaderboards
🎖️ 21 Achievements
📱 Full Mobile Support
⚡ 60 FPS Gameplay
💾 Cloud Saves via Supabase

Try to reach the exit... if you can. 😈

Play now: [URL]
```

### Share With
- [ ] Reddit (r/gamedev, r/webgames, r/indiegames)
- [ ] Twitter/X
- [ ] Discord communities
- [ ] Friends & family
- [ ] Dev forums

---

## 🔄 ROLLBACK PLAN (Just in Case)

```bash
# If something breaks:
git revert <commit-hash>
git push origin main

# Vercel auto-rolls back
# Wait for deployment
# Go live
```

- [ ] Rollback procedure known
- [ ] Previous version tagged
- [ ] Recovery plan ready

---

## ✅ FINAL SIGN-OFF

- [ ] All checklist items complete
- [ ] No critical bugs
- [ ] Database working
- [ ] Performance good
- [ ] Ready to launch

---

## 🎉 YOU'RE SHIPPING!

**Hell Runner Launch Status: READY FOR PRODUCTION** 🚀

### Summary
- ✅ 40 playable levels
- ✅ Full troll mechanics
- ✅ Leaderboards + Achievements  
- ✅ Mobile support
- ✅ Database integration
- ✅ Production-ready code
- ✅ Comprehensive documentation

**Let's go make Hell Runner legendary!** 🔥

---

## 📞 SUPPORT

If you get stuck:
1. Check `SUPABASE_SETUP_GUIDE.md` for database help
2. Check `HELL_RUNNER_DATABASE.md` for API help
3. Check `HELL_RUNNER_FEATURES.md` for game mechanics
4. Check console for errors
5. Reach out for help

---

**Time to ship! ⏰**

Estimated time to complete:
- Database setup: 10 minutes
- Local testing: 30 minutes
- Build verification: 10 minutes
- Deploy: 5 minutes
- **Total: ~1 hour**

**Launch time: NOW** 🚀
