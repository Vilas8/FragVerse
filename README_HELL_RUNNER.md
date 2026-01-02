# 🔥 Hell Runner

> A challenging platform game with 40 levels of pure chaos, real-time leaderboards, and 21 achievements to unlock.

[![Status](https://img.shields.io/badge/status-PRODUCTION%20READY-brightgreen)]()
[![Levels](https://img.shields.io/badge/levels-40%2B-blue)]()
[![Achievements](https://img.shields.io/badge/achievements-21-gold)]()
[![Mobile](https://img.shields.io/badge/mobile-fully%20supported-success)]()

---

## 🎮 About

**Hell Runner** is inspired by the addictive chaos of *Level Devil*. You control a character navigating through increasingly difficult levels filled with:

- **Disappearing platforms** - They vanish when you step on them
- **Moving sawblades** - Instant death hazards
- **Gravity zones** - Physics flip on their head
- **Control reversals** - Your inputs suddenly swap
- **Spike hazards** - Timing is everything
- **Fake doors** - Not all exits are real...
- **Teleportation** - Warps send you across the level

**Goal:** Reach the green exit door. Simple concept. Brutally difficult execution.

---

## ⚡ Features

### Gameplay
- ✅ **40 Playable Levels** - 8 doors, 5 stages each
- ✅ **Progressive Difficulty** - Tutorial to extreme
- ✅ **7 Obstacle Types** - Diverse challenges
- ✅ **Troll Mechanics** - Fair but surprising
- ✅ **Instant Respawn** - No loading screens
- ✅ **Power-ups** - Speed boost, shield, extra jump

### Features
- ✅ **Real-time Leaderboards** - Compete globally
- ✅ **21 Achievements** - 18,500 XP total
- ✅ **Player Stats** - Track your progress
- ✅ **Cloud Saves** - Supabase integration
- ✅ **Mobile Support** - Touch controls included
- ✅ **60 FPS Gameplay** - Smooth performance

### Technology
- ✅ **Phaser 3** - Game engine
- ✅ **Next.js** - Web framework
- ✅ **TypeScript** - Type-safe code
- ✅ **Supabase** - Database backend
- ✅ **Vercel** - Deployment platform

---

## 🌗 Controls

### Keyboard
```
← / A           = Move Left
→ / D           = Move Right
↑ / W / SPACE   = Jump
```

### Mobile
```
[Left Button]    = Move Left
[Right Button]   = Move Right  
[Jump Button]    = Jump
```

### Gamepad (Optional)
```
D-Pad Left/Right = Move
A / Space        = Jump
```

---

## 🚀 Getting Started

### Play Online
```
🌐 https://fragverse.vercel.app/games/hell-runner
```

### Local Development

```bash
# Clone repository
git clone https://github.com/Vilas8/FragVerse.git
cd FragVerse

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in Supabase credentials

# Run dev server
npm run dev

# Open http://localhost:3000/games/hell-runner
```

### Database Setup

```bash
# Run SQL setup in Supabase SQL Editor
# File: SUPABASE_SETUP.sql
# This inserts:
# - 21 achievements
# - Performance indexes
# - RLS security policies
```

See [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for details.

---

## 📊 Levels Breakdown

### Door 1-2: Tutorial Zone (10 levels)
```
Learn basic controls
Master platforming
Introduce power-ups
No troll mechanics
```

### Door 3-8: Chaos Zone (30 levels)
```
Disappearing platforms
Moving obstacles
Gravity shifts
Control reversals
Multiple mechanics combined
```

---

## 🎖️ Achievements

**Milestone (4 achievements)**
- First Step - Complete Door 1
- Disappearing Act - Beat disappearing platform level
- Gravity Mastery - Master gravity zones
- Mega Chaos Conqueror - Beat Door 8

**Speedrun (4 achievements)**
- Quick Learner - Complete level in <30s
- Timeless Platformer - Beat 10 levels in <200s
- Gravity Speedster - Gravity level speedrun
- Time Master - Beat 20 levels in <500s

**Challenge (5 achievements)**
- Flawless Victory - Beat level with 0 deaths
- Platform Perfect - Master all platform types
- Immortal - Survive 5 consecutive levels without dying
- Never Give Up - Die 50 times and still complete a level
- Perseverance - Play 100 levels

**Special (8 achievements)**
- Tutorial Master - Beat all tutorial levels
- Legend - Hit leaderboard top 10
- XP Collector - Earn 10,000 total XP
- Top 10 - Rank in global top 10
- Champion - Win 50 levels
- Key Finder - Find secret content
- Gate Crasher - Try 100 fake exits
- Speed Demon - Beat level in <15s

---

## 📄 Documentation

- [QUICK_START.md](./QUICK_START.md) - Launch in 5 minutes
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) - Detailed checklist
- [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) - 30-day roadmap
- [HELL_RUNNER_STATUS.md](./HELL_RUNNER_STATUS.md) - Project status
- [HELL_RUNNER_FEATURES.md](./HELL_RUNNER_FEATURES.md) - Feature guide
- [HELL_RUNNER_DATABASE.md](./HELL_RUNNER_DATABASE.md) - API reference
- [LEVEL_DEVIL_ANALYSIS.md](./LEVEL_DEVIL_ANALYSIS.md) - Design analysis
- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - Database setup

---

## 📃 Project Structure

```
FragVerse/
├─ lib/games/hell-runner/
│  ├─ scenes/
│  │  ├─ MenuScene.ts      # Main menu
│  │  ├─ GameScene.ts      # Gameplay
│  │  └─ GameOverScene.ts  # Results screen
│  ├─ objects/
│  │  ├─ Player.ts        # Player sprite
│  │  ├─ platforms.ts     # Platform system
│  │  ├─ obstacles.ts     # Trap system
│  │  └─ enemies.ts       # Enemy AI
│  ├─ db-actions.ts    # Database functions
│  ├─ achievements.ts  # Achievement definitions
│  └─ levels.ts        # Level data
├─ components/
│  └─ GameContainer.tsx # React wrapper
└─ app/
   └─ games/
      └─ hell-runner/
         └─ page.tsx       # Game page
```

---

## 💫 How It Works

### Game Loop
1. Player spawns at level start
2. Input captured (keyboard/mobile)
3. Physics engine updates
4. Collision detection runs
5. Obstacles update (move, disappear, etc)
6. Enemy AI updates
7. Camera follows player
8. Check win/lose conditions
9. Repeat until level complete or player dies

### Difficulty Progression
```
Door 1: Learn controls (5 easy levels)
Door 2: Introduction to enemies (5 intermediate)
Door 3: Disappearing platforms (5 tricky)
Door 4: Moving obstacles (5 challenging)
Door 5: Gravity zones (5 very hard)
Door 6: Control reversal (5 extreme)
Door 7: Mixed mechanics (5 insane)
Door 8: Everything + trickery (5 nightmare)
```

### Troll Mechanics
Each obstacle is designed to:
- ✅ Look fair but surprise you
- ✅ Teach you through failure
- ✅ Make you laugh when you die
- ✅ Reward skill and adaptation

---

## 📊 Leaderboards

Compete globally on leaderboards:

```
🏆 Global Rankings       - All players, all time
💵 Per Level Rankings    - Best times per level
💱 Speed Category        - Fastest completions
💶 Weekly Challenge      - Top performers this week
```

Rankings based on:
- Primary: Time (seconds)
- Secondary: Deaths (lower is better)
- Tertiary: Date submitted (earlier wins ties)

---

## 💾 Database

### Tables
- `hell_runner_progress` - Level progression
- `hell_runner_leaderboard` - Completion times
- `user_achievements` - Unlocked achievements
- `achievements` - Achievement definitions
- `player_stats` - Overall statistics
- `notifications` - User notifications

### Security
- Row Level Security (RLS) enabled
- Users see only their own data
- Leaderboard is public
- Verified Supabase integration

See [HELL_RUNNER_DATABASE.md](./HELL_RUNNER_DATABASE.md) for API details.

---

## 🔧 Development

### Dependencies
```json
{
  "phaser": "^3.55.0",           // Game engine
  "next": "^14.0.0",            // Web framework
  "typescript": "^5.0.0",        // Type safety
  "@supabase/supabase-js": "^2.0", // Database
  "tailwindcss": "^3.0.0"        // Styling
}
```

### Build & Deploy
```bash
# Local build
npm run build

# Deploy to Vercel (auto on push)
git push origin main

# Build size
# ~2.5 MB (production optimized)
```

### Performance
- Load time: <2 seconds
- FPS: Stable 60
- Input lag: <100ms
- Mobile: Smooth 30+ FPS

---

## 🐫 Contributing

Want to contribute? Great!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 Roadmap

### Phase 3 (Jan 8-21, 2026)
- 40 new levels (Doors 9-16)
- Boss encounters
- Advanced mechanics
- Secret content
- 80 levels total

### Phase 4 (Jan 22-30, 2026)
- Sound design (8 tracks)
- Particle effects
- UI polish
- Performance optimization

### Phase 5+ (February+)
- Community features
- Seasonal events
- User-generated content
- Cosmetics/skins
- Competitive leagues

---

## 👋 Support

### Need Help?
- **[Quick Start](./QUICK_START.md)** - Fast launch guide
- **[FAQ](./FAQ.md)** - Common questions
- **[Database Docs](./HELL_RUNNER_DATABASE.md)** - API reference
- **[Issues](https://github.com/Vilas8/FragVerse/issues)** - Bug reports
- **[Discussions](https://github.com/Vilas8/FragVerse/discussions)** - Questions

### Bug Reports
Found a bug? [Report it here](https://github.com/Vilas8/FragVerse/issues/new)

### Feature Requests
Have an idea? [Share it here](https://github.com/Vilas8/FragVerse/discussions)

---

## 💱 License

MIT License - See [LICENSE](./LICENSE) file

---

## 🙋 Credits

**Created by:** Vilas Kumar N  
**Inspiration:** Level Devil  
**Engine:** Phaser 3  
**Database:** Supabase  
**Deployed:** Vercel  

---

## ✨ Special Thanks

To everyone who tested, gave feedback, and believed in this project.

You made Hell Runner possible. 🚀

---

## 🚚 Let's Connect!

- Twitter: [@VilasDev](https://twitter.com)
- GitHub: [@Vilas8](https://github.com/Vilas8)
- Portfolio: [Your Site]

---

**Hell Runner v1.0 - Ready to Challenge You** 🔥

*"Easy to learn. Impossible to master. Hilarious to fail."*
