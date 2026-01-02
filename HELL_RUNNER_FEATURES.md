# Hell Runner - Complete Feature Documentation

## 🎮 PHASE 2 UPDATE: TROLL MECHANICS LIVE!

**Last Updated:** January 2, 2026 9:35 PM IST
**Version:** 2.1 (MEGA CHAOS UPDATE)

---

## 📊 Game Structure

### Current Implementation
- **Doors:** 1-8 (40 levels)
- **Stages per Door:** 5
- **Total Levels:** 40 playable levels
- **Difficulty:** Progressive (Doors 1-2 beginner, Doors 3-8 troll chaos)

---

## 🚀 Phase 1 Features (Complete)

### Enemy AI System ✅
- **Walker Enemies** (100 px/s patrol)
- **Jumper Enemies** (80 px/s with 1.5s jump intervals)
- Enemy defeat tracking
- Shield interaction system

### Power-Up System ✅
- **Speed Boost** (Green) - 1.5x speed for 8s
- **Shield** (Blue) - 1 hit protection for 10s
- **Double Jump** (Yellow) - 6s duration
- Duration display UI
- Floating/rotating animations

### Scoring System ✅
```
Final Score = 1000 - (Deaths × 50) + Time Bonus + Enemy Bonus
Time Bonus = max(0, (20 - Time_Taken) × 10)
Enemy Bonus = Enemies_Defeated × 100
```

---

## 🔥 PHASE 2: TROLL MECHANICS (COMPLETE!)

### Door 3: Disappearing Platforms ⏰
**Concept:** Platforms fade in and out on timed cycles

Features:
- Configurable disappear/reappear delays
- Visual feedback (transparency change)
- Staggered timing per platform
- Stage progression: 2 → 4 → 6 → 8 → 10+ platforms

**Example Timings:**
```
Stage 1: 1500ms disappear, 1500ms reappear
Stage 2: Varied timings (1000-2000ms range)
Stage 5: Quick fades (500-1000ms disappear, 600-1500ms reappear)
```

### Door 4: Saw Blades & Popup Spikes ⚡
**Concept:** Moving hazards and hidden spikes that appear on landing

**Saw Blades:**
- Speed: 80-150 px/s
- Rotates continuously
- Bounces at boundaries
- Kills on contact (unless shielded)

**Popup Spikes:**
- Hidden until timer triggers
- Visible duration: 800-1200ms
- Popup delay: 1200-2000ms
- Same death mechanics as saw blades

### Door 5: Gravity Flip & Control Reverse 🎛️
**Concept:** Environmental hazard zones that alter game physics

**Gravity Flip Zone:**
- Reverses gravity (upside-down platforming)
- Visual indicator: Cyan tint on player
- Player can jump down (becomes up)
- Can toggle multiple times

**Control Reverse Zone:**
- Left becomes right, right becomes left
- Visual indicator: Magenta tint on player
- Confuses player navigation
- Requires adaptation and timing

### Door 6: Fake Doors & Teleports 🌀
**Concept:** Portal mechanics that transport or kill

**Fake Doors:**
- Look like real doors (green)
- Kill on contact instead of exiting
- Visual indicator: Reddish tint (if you look close)
- Mixed with real teleports

**Teleport Warps:**
- Blue pulsing portals
- Transport player to destination
- Can chain multiple teleports
- Used for level shortcuts

### Door 7: Chaos Remix 🌪️
**Concept:** Mixed mechanics from Doors 3-6

Includes:
- Disappearing platforms + Saws
- Gravity flip + Popup spikes
- Control reverse + Teleports
- Fake doors mixed in
- Increasing complexity per stage

### Door 8: MEGA CHAOS 💥
**Concept:** Everything at once - ultimate difficulty

Stages get progressively insane:
- **Stage 1:** 3x disappearing, 2x saws, gravity flip, teleport
- **Stage 2:** Previous + enemies
- **Stage 3:** Previous + control reverse
- **Stage 4:** Previous + popup spikes
- **Stage 5:** EVERYTHING + multiple of each obstacle type

---

## 🎨 Visual Design

### Sprite System (Procedurally Generated)

**Player:** Red rectangle with white eyes
- Normal: Red
- Shield active: Blue tint
- Speed boost: Green tint  
- Gravity flipped: Cyan tint
- Controls reversed: Magenta tint

**Obstacles:**
- **Platform:** Gray with darker shading (32×32)
- **Spike:** Orange triangle (32×32)
- **Enemy:** Purple with yellow eyes and angry mouth (16×16)
- **Powerup:** Yellow rotating star (16×16)
- **Saw Blade:** Yellow circle with orange teeth (16×16)
- **Teleport:** Blue pulsing portal with cyan core (16×16)
- **Disappearing:** Gray platform with reduced opacity when invisible
- **Gravity Flip Zone:** Cyan rectangle (128×32)
- **Control Reverse:** Magenta rectangle (128×32)

### Animations
- Player tinting for status effects
- Saw blade continuous rotation
- Powerup floating + rotation
- Teleport pulsing (sine wave alpha)
- Platform fade in/out transitions
- Enemy sprite flipping based on direction

---

## 🎮 Gameplay Mechanics

### Physics
- **Base Gravity:** 1000 px/s² (flippable)
- **Base Speed:** 200 px/s (boostable to 300)
- **Jump Velocity:** 400 px/s (upward)
- **Gravity Flip:** Reverses to -1000 px/s²

### Control Systems
- **Keyboard:** Arrow keys + WASD
- **Mobile:** Touch buttons (Left, Right, Jump)
- **Control Reverse:** Swaps left/right input
- **Gravity Flip:** Reverses jump direction

### Collision System
- Player → Platform: Collision (enables jumping)
- Player → Spike/Saw: Death or shield break
- Player → Enemy: Death or shield break + enemy defeat
- Player → Disappearing Platform: Collision (when visible)
- Player → Gravity Flip: Toggle gravity (overlap)
- Player → Control Reverse: Toggle controls (overlap)
- Player → Fake Door: Death
- Player → Teleport: Instant transport (overlap)

---

## 📈 Level Progression

### Difficulty Scaling
```
Door 1 (Tutorial):
  Stage 1-2: Basic platforming
  Stage 3-4: Introduce spikes & jumping
  Stage 5: First enemies

Door 2 (Intermediate):
  Stage 1-2: Spike complexity
  Stage 3-4: More enemies
  Stage 5: Boss (3 enemies + shields)

Door 3 (Disappearing - Hard):
  Stage 1-2: 2-3 disappearing platforms
  Stage 3-4: 4-6 platforms with pattern
  Stage 5: 5 platforms + 2 enemies

Door 4 (Saws - Harder):
  Stage 1-2: Single saw
  Stage 3-4: Multiple saws + spikes
  Stage 5: Chaos (3 saws + enemies)

Door 5 (Gravity/Controls - Very Hard):
  Stage 1-2: Single gravity flip
  Stage 3-4: Control reverse introduction
  Stage 5: Both + enemies

Door 6 (Portals - Extreme):
  Stage 1-2: Safe teleports
  Stage 3-4: Fake doors introduced
  Stage 5: Mixed portals + enemies

Door 7 (Mixed - Insane):
  Stage 1-5: Combination of 3-6 mechanics

Door 8 (CHAOS - BRUTAL):
  Stage 1-5: Everything + scaling difficulty
```

---

## 💻 Technical Architecture

### File Structure
```
lib/games/hell-runner/
├── types.ts                    # Type definitions
├── db-actions.ts              # Database operations (future)
├── entities/
│   ├── Enemy.ts              # Enemy AI class
│   ├── Powerup.ts            # Power-up system
│   └── Obstacle.ts           # Troll mechanics
├── levels/
│   └── LevelGenerator.ts     # 40 level configurations
└── scenes/
    ├── PreloadScene.ts       # Sprite generation
    ├── MenuScene.ts          # Main menu
    ├── MainScene.ts          # Game logic
    └── GameOverScene.ts      # Score display
```

### Core Classes

**Enemy**
```typescript
class Enemy {
  type: 'walker' | 'jumper'
  update(delta: number): void
  dealDamage(): void
  isActive(): boolean
}
```

**Powerup**
```typescript
class Powerup {
  type: 'speed' | 'shield' | 'jump'
  collect(): PowerupEffect
  update(): void
}
```

**Obstacle**
```typescript
class Obstacle {
  type: 'disappearing' | 'saw' | 'popup-spike' | 
        'gravity-flip' | 'control-reverse' | 
        'fake-door' | 'teleport'
  update(delta: number): void
  getDestination(): { x, y } | null
}
```

---

## 🎯 Gameplay Tips

### By Door
**Door 1-2:** Learn timing and enemy patterns  
**Door 3:** Memorize platform cycles or jump quickly  
**Door 4:** Use shield for saw blades, predict movement  
**Door 5:** Anticipate gravity/control changes, adapt quickly  
**Door 6:** Identify fake doors, use teleports strategically  
**Door 7:** Combine knowledge from all mechanics  
**Door 8:** Perfect execution required, expect failure  

### Pro Tips
- Shields are precious - save for hardest segments
- Speed boost great for long spike fields
- Gravity flip makes upside-down platforming easier with practice
- Teleports can skip hard sections
- Fake doors often placed near real doors - be suspicious

---

## 📋 Coming Soon (Phase 3-4)

### Phase 3: Advanced Trolls (Doors 9-16)
- [ ] Auto-scroll hell sections
- [ ] Wraparound screens
- [ ] Moving laser walls
- [ ] Boss encounters
- [ ] Secret passages
- [ ] Purple key system

### Phase 4: Pro Polish
- [ ] Sound effects & music
- [ ] Particle effects
- [ ] Leaderboards (Supabase)
- [ ] Achievements system
- [ ] Save progress
- [ ] Settings menu
- [ ] Better graphics

---

## 🚨 Known Limitations

- No persistence between sessions (yet)
- No sound (yet)
- Limited to 8 doors currently
- No mobile app (web only)
- Physics may feel floaty on some machines

---

## 🎮 Testing Checklist

- [x] Enemy patrolling
- [x] Power-up collection
- [x] Shield mechanics
- [x] Disappearing platforms
- [x] Saw blade movement
- [x] Popup spike timing
- [x] Gravity flip toggle
- [x] Control reverse toggle
- [x] Fake door detection
- [x] Teleport transportation
- [x] Score calculation
- [x] Mobile controls
- [x] Level progression

---

## 📞 Credits

**Built with:**
- Phaser 3 (Game Framework)
- TypeScript (Language)
- Next.js (React Framework)
- Arcade Physics Engine

**Inspired by:** Super Meat Boy, I Am Bread, Getting Over It

---

**Ready for Phase 3? Let's add even more chaos! 🔥**
