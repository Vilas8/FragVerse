# Frag11 Setup Guide

Complete setup instructions for the Frag11 Fantasy IPL platform.

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Navigation Integration](#navigation-integration)
4. [Testing](#testing)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)

## 📖 Prerequisites

Before setting up Frag11, ensure you have:

- FragVerse project running locally
- Supabase project configured
- Node.js 18+ installed
- Access to Supabase SQL Editor

## 🗄️ Database Setup

### Step 1: Run Schema Migration

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy contents from `supabase/migrations/20260113_frag11_schema.sql`
5. Execute the query

**Expected Result**: 7 tables created with proper indexes and RLS policies

### Step 2: Load Sample Data (Optional)

1. In SQL Editor, create another query
2. Copy contents from `supabase/seed_frag11.sql`
3. Execute the query

**This will create**:
- 8 IPL teams
- 15+ sample players
- 4 upcoming matches
- 4 sample contests

### Step 3: Verify Setup

Run this query to verify:

```sql
SELECT 
  (SELECT COUNT(*) FROM frag11_teams) as teams,
  (SELECT COUNT(*) FROM frag11_players) as players,
  (SELECT COUNT(*) FROM frag11_matches) as matches,
  (SELECT COUNT(*) FROM frag11_contests) as contests;
```

Expected output: `teams: 8, players: 15+, matches: 4, contests: 4`

## 🧭 Navigation Integration

### Option 1: Add to Main Navigation

Edit your main navigation component (likely `components/header.tsx` or similar):

```tsx
import { Trophy } from 'lucide-react';

// Add to your navigation links
const navLinks = [
  // ... existing links
  {
    name: 'Frag11',
    href: '/frag11',
    icon: Trophy,
    badge: 'NEW',
  },
];
```

### Option 2: Add to Home Page

Edit `app/home/page.tsx` or your landing page:

```tsx
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { CyberCard, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';

// Add this section to your page
<section>
  <CyberCard variant="cyan" glow>
    <CyberCardContent className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <Trophy className="w-12 h-12 text-cyan-400" />
        <div>
          <h2 className="text-3xl font-bold text-cyan-100">Frag11 Fantasy IPL</h2>
          <p className="text-cyan-100/60">Build your dream cricket team!</p>
        </div>
      </div>
      <Link href="/frag11">
        <CyberButton variant="glow" fullWidth>
          Play Now
        </CyberButton>
      </Link>
    </CyberCardContent>
  </CyberCard>
</section>
```

### Option 3: Create Quick Access Card

Create a floating action button or quick access widget:

```tsx
// components/Frag11QuickAccess.tsx
'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';

export function Frag11QuickAccess() {
  return (
    <Link href="/frag11">
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-4 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-110 transition-transform cursor-pointer">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          NEW
        </div>
      </div>
    </Link>
  );
}
```

Add to your root layout:

```tsx
import { Frag11QuickAccess } from '@/components/Frag11QuickAccess';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Frag11QuickAccess />
      </body>
    </html>
  );
}
```

## ✅ Testing

### 1. Access Dashboard

Navigate to `http://localhost:3000/frag11`

**Should see**:
- Hero section with Frag11 branding
- Stats cards
- Upcoming matches (if seeded)
- Featured contests (if seeded)

### 2. Test Team Creation

1. Click on any upcoming match
2. Click "Create Team"
3. Select 11 players:
   - Use filters to find players
   - Ensure credits don't exceed 100
   - Select players from different roles
4. Assign captain and vice-captain
5. Enter team name
6. Click "Save Team"

**Should redirect to**: `/frag11/my-teams/[team-id]`

### 3. Test Contest Browsing

1. Navigate to `/frag11/contests`
2. Browse available contests
3. Use filters to narrow down
4. Click on a contest to view details

### 4. Test My Teams

1. Navigate to `/frag11/my-teams`
2. Should see all created teams
3. Click on a team to view details

## 🎨 Customization

### Change Color Scheme

Edit the colors in team cards:

```tsx
// In MatchCard.tsx or ContestCard.tsx
variant={isLive ? 'cyan' : 'purple'} // Change to your preferred colors
```

Available variants: `cyan`, `purple`, `pink`, `gold`, `green`, `default`

### Adjust Credit System

Edit `types/frag11.ts`:

```typescript
export const TEAM_RULES = {
  TOTAL_CREDITS: 100, // Change to 120, 150, etc.
  // ... other rules
};
```

### Modify Point System

Edit `types/frag11.ts`:

```typescript
export const POINTS_SYSTEM = {
  RUN: 1,        // Change points per run
  WICKET: 25,    // Change points per wicket
  // ... other points
};
```

### Add Team Logos

1. Place team logo images in `public/teams/`
2. Update `frag11_teams` table:

```sql
UPDATE frag11_teams 
SET logo_url = '/teams/mi.png' 
WHERE short_name = 'MI';
```

### Add Player Images

1. Place player images in `public/players/`
2. Update `frag11_players` table:

```sql
UPDATE frag11_players 
SET image_url = '/players/rohit-sharma.png' 
WHERE name = 'Rohit Sharma';
```

## 🔧 Troubleshooting

### Issue: "Match not found" error

**Cause**: No matches in database

**Solution**: Run seed data SQL or create matches manually:

```sql
INSERT INTO frag11_matches (match_number, team1_id, team2_id, venue, match_date, match_time, status)
VALUES (1, 'team-mi', 'team-csk', 'Wankhede Stadium', '2026-03-22', '19:30:00', 'upcoming');
```

### Issue: "Cannot create team" error

**Cause**: User not authenticated

**Solution**: Ensure user is logged in. Check Supabase auth:

```tsx
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirect to login
  router.push('/sign-in');
}
```

### Issue: Players not loading

**Cause**: No players associated with match teams

**Solution**: Ensure players exist for both teams in the match:

```sql
SELECT * FROM frag11_players 
WHERE team_id IN (
  SELECT team1_id FROM frag11_matches WHERE id = 'your-match-id'
  UNION
  SELECT team2_id FROM frag11_matches WHERE id = 'your-match-id'
);
```

### Issue: RLS policy errors

**Cause**: Row Level Security blocking queries

**Solution**: Verify RLS policies are set correctly:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename LIKE 'frag11_%';

-- If needed, temporarily disable RLS for testing
ALTER TABLE frag11_teams DISABLE ROW LEVEL SECURITY;
```

### Issue: Date formatting errors

**Cause**: Missing date-fns dependency

**Solution**: Install date-fns:

```bash
npm install date-fns
```

## 📝 Next Steps

### Immediate

1. ☐ Run database migrations
2. ☐ Load seed data
3. ☐ Test all pages
4. ☐ Add navigation links
5. ☐ Customize branding

### Short-term

1. ☐ Add more IPL teams and players
2. ☐ Create real match schedule
3. ☐ Set up contests for upcoming matches
4. ☐ Add team logos and player images
5. ☐ Test with real users

### Long-term

1. ☐ Integrate live cricket API
2. ☐ Implement real-time scoring
3. ☐ Add payment gateway for paid contests
4. ☐ Create admin dashboard
5. ☐ Build mobile app

## 📚 Resources

- [Dream11 Website](https://www.dream11.com) - Reference platform
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cricket API Options](https://www.cricapi.com/)

## 👥 Support

Need help? Check:

1. **README**: `app/frag11/README.md`
2. **Type Definitions**: `types/frag11.ts`
3. **Schema**: `supabase/migrations/20260113_frag11_schema.sql`

---

**Happy Building! 🎮🏆**
