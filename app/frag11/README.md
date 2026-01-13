# Frag11 - Fantasy IPL Cricket

A comprehensive fantasy cricket platform integrated into FragVerse with a cyberpunk design aesthetic.

## 🏆 Features

### Core Functionality
- **Team Builder**: Select 11 players within 100 credits from two competing teams
- **Multiple Contests**: Free, paid, head-to-head, and mega contests
- **Live Scoring**: Real-time point updates during matches
- **Leaderboards**: Track rankings and compete with other players
- **Prize Distribution**: Automated prize calculations and distributions

### User Experience
- **Cyberpunk Design**: Neon glows, glassmorphism, smooth animations
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Updates**: Live match scores and player statistics
- **Team Management**: Create, edit, and manage multiple teams

## 📝 File Structure

```
app/frag11/
├── page.tsx                    # Main dashboard
├── create-team/
│   └── page.tsx              # Team builder interface
├── contests/
│   └── page.tsx              # Contest listing
├── my-teams/
│   └── page.tsx              # User's teams management
└── matches/
    └── page.tsx              # Match listing

components/frag11/
├── MatchCard.tsx             # Match display card
├── ContestCard.tsx           # Contest display card
├── PlayerCard.tsx            # Player selection card
└── TeamPreview.tsx           # Team composition preview

lib/frag11/
└── teamValidation.ts        # Team validation logic

types/frag11.ts              # TypeScript type definitions

supabase/
├── migrations/
│   └── 20260113_frag11_schema.sql  # Database schema
└── seed_frag11.sql          # Sample seed data
```

## 🚀 Getting Started

### 1. Database Setup

```bash
# Run the schema migration in Supabase SQL Editor
supabase/migrations/20260113_frag11_schema.sql

# Optional: Load sample data
supabase/seed_frag11.sql
```

### 2. Environment Variables

Ensure your `.env.local` has Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Access the Platform

Navigate to `/frag11` in your browser to access the Frag11 dashboard.

## 🎮 How to Play

### Creating a Team

1. **Select Match**: Choose an upcoming IPL match
2. **Pick Players**: Select 11 players within 100 credits
   - 1-4 Wicket Keepers
   - 1-8 Batters
   - 1-4 All-Rounders
   - 1-8 Bowlers
   - Max 7 players from one team
3. **Choose Captain & Vice-Captain**:
   - Captain earns 2x points
   - Vice-captain earns 1.5x points
4. **Save Team**: Give your team a name and save

### Joining Contests

1. Browse available contests for your match
2. Choose based on:
   - Entry fee (Free or Paid)
   - Prize pool
   - Number of participants
   - Winner percentage
3. Join with your created team
4. Track live scores and rankings

### Point System

**Batting**
- Run: +1 point
- Boundary (4): +1 point
- Six: +2 points
- Half-century: +8 points
- Century: +16 points
- Duck: -2 points

**Bowling**
- Wicket: +25 points
- LBW/Bowled bonus: +8 points
- Maiden over: +12 points
- 3 wickets: +4 bonus
- 4 wickets: +8 bonus
- 5 wickets: +16 bonus

**Fielding**
- Catch: +8 points
- Stumping: +12 points
- Run-out (direct): +12 points
- Run-out (indirect): +6 points

**Bonuses**
- Strike rate bonuses/penalties for batters
- Economy rate bonuses/penalties for bowlers

## 📊 Database Schema

### Core Tables

- **frag11_teams**: IPL team information
- **frag11_players**: Player details and statistics
- **frag11_matches**: Match schedule and live data
- **frag11_user_teams**: User-created fantasy teams
- **frag11_contests**: Contest configurations
- **frag11_contest_entries**: User contest participations
- **frag11_player_points**: Live scoring data

### Key Relationships

```
frag11_matches
  └── has many frag11_contests
  └── has many frag11_user_teams
  └── references team1 (frag11_teams)
  └── references team2 (frag11_teams)

frag11_user_teams
  └── belongs to user (auth.users)
  └── belongs to match
  └── has many contest_entries

frag11_contests
  └── belongs to match
  └── has many contest_entries
```

## 🔧 Admin Features (To Be Implemented)

- Match result updates
- Player performance entry
- Contest management
- Prize distribution
- User moderation

## 💡 Future Enhancements

- [ ] Real-time score updates via WebSocket
- [ ] Player performance graphs
- [ ] Team comparison tool
- [ ] Contest filters (by prize, entry fee, etc.)
- [ ] Social features (team sharing, chat)
- [ ] Push notifications for match start
- [ ] Historical stats and analytics
- [ ] Auto-join contests
- [ ] Private leagues
- [ ] Mobile app

## 🎯 API Integration

For live cricket data, consider integrating:
- **CricAPI**: https://www.cricapi.com/
- **Cricbuzz API**: For real-time scores
- **ESPN Cricinfo**: For player statistics

## 👥 Support

For issues or questions:
1. Check existing documentation
2. Review code comments
3. Open an issue in the repository

## 🏅 Credits

Built with:
- Next.js 14
- Supabase
- TypeScript
- Tailwind CSS
- Cyberpunk Design System

---

**Frag11** - Where Gaming Meets Fantasy Cricket 🎮🏆
