# 🔄 Enable Realtime for Engagement Features

## Quick Setup (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your FragVerse project
3. Navigate to **Database** → **Replication**

### Step 2: Enable for These 6 Tables

Toggle "Realtime" ON for each table:

- [ ] `player_stats`
- [ ] `activity_feed`
- [ ] `friend_requests`
- [ ] `user_challenges`
- [ ] `user_achievements`
- [ ] `notifications`

### Step 3: Verify

Check the green "Replicating" status appears next to each table.

---

## Why These Tables?

| Table | Why Realtime |
|-------|-------------|
| **player_stats** | Live leaderboard updates |
| **activity_feed** | Real-time community activities |
| **friend_requests** | Instant friend notifications |
| **user_challenges** | Live challenge progress |
| **user_achievements** | Real-time achievement unlocks |
| **notifications** | Instant notification delivery |

---

## Optional: Advanced Realtime Subscriptions

If you want live updates in your React components:

```typescript
// In your component
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Subscribe to leaderboard changes
const subscription = supabase
  .channel('player_stats')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'player_stats'
    },
    payload => {
      console.log('Stats updated:', payload);
      // Refetch leaderboard
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(subscription);
};
```

---

**✅ Once done, go back to main integration guide!**
