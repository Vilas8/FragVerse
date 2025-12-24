# 🎮 FragVerse Cyberpunk Design System

A complete futuristic design system with neon glows, glassmorphism, and smooth animations.

---

## 🎨 Core Components

### **CyberButton**
Location: `components/ui/cyber-button.tsx`

**Variants:**
- `primary` - Cyan gradient with blue, main action buttons
- `secondary` - Purple/pink with glassmorphism, secondary actions
- `danger` - Red gradient for destructive actions
- `ghost` - Transparent with border, subtle actions
- `glow` - Multi-color gradient with intense glow

**Sizes:**
- `sm` - Small buttons (px-4 py-2)
- `md` - Medium buttons (px-6 py-3) - default
- `lg` - Large buttons (px-8 py-4)
- `xl` - Extra large buttons (px-10 py-5)

**Usage:**
```tsx
import { CyberButton } from '@/components/ui/cyber-button';

<CyberButton 
  variant="primary" 
  size="md"
  icon={Zap}
  iconPosition="left"
  fullWidth
>
  Click Me
</CyberButton>
```

---

### **CyberCard**
Location: `components/ui/cyber-card.tsx`

**Variants:**
- `default` - Dark slate background
- `cyan` - Cyan border and glow
- `purple` - Purple border and glow
- `pink` - Pink border and glow
- `gold` - Gold border and glow

**Props:**
- `glow` - Adds glowing shadow effect
- `glass` - Enables glassmorphism
- `hover` - Adds hover animations

**Sub-components:**
- `CyberCardHeader` - Header section
- `CyberCardTitle` - Title with optional glow
- `CyberCardContent` - Main content area
- `CyberCardFooter` - Footer with divider
- `CyberBadge` - Status badges

**Usage:**
```tsx
import { 
  CyberCard, 
  CyberCardHeader, 
  CyberCardTitle, 
  CyberCardContent,
  CyberBadge 
} from '@/components/ui/cyber-card';

<CyberCard variant="cyan" glow hover>
  <CyberCardHeader>
    <CyberCardTitle glow>Tournament Name</CyberCardTitle>
  </CyberCardHeader>
  <CyberCardContent>
    <CyberBadge variant="cyan">Live</CyberBadge>
    <p>Tournament details...</p>
  </CyberCardContent>
</CyberCard>
```

---

### **CyberInput**
Location: `components/ui/cyber-input.tsx`

**Components:**
- `CyberInput` - Text input with icon support
- `CyberTextarea` - Multi-line text input
- `CyberSelect` - Dropdown select
- `CyberCheckbox` - Checkbox with custom styling
- `CyberForm` - Form container

**Features:**
- Icon support (left side)
- Focus glow effects
- Error state styling
- Label support
- Glassmorphism background

**Usage:**
```tsx
import { CyberInput, CyberTextarea, CyberSelect } from '@/components/ui/cyber-input';
import { Mail, Lock } from 'lucide-react';

<CyberInput
  label="Email"
  icon={Mail}
  type="email"
  placeholder="you@example.com"
  error={errors.email}
/>

<CyberTextarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>

<CyberSelect
  label="Status"
  icon={Filter}
>
  <option value="all">All</option>
  <option value="active">Active</option>
</CyberSelect>
```

---

### **CyberModal**
Location: `components/ui/cyber-modal.tsx`

**Sizes:**
- `sm` - max-w-md
- `md` - max-w-2xl
- `lg` - max-w-4xl (default)
- `xl` - max-w-6xl
- `full` - max-w-[95vw]

**Variants:**
- `cyan`, `purple`, `pink`, `default`

**Usage:**
```tsx
import { CyberModal, CyberModalFooter } from '@/components/ui/cyber-modal';

<CyberModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Tournament"
  description="Fill in the details below"
  size="lg"
  variant="cyan"
>
  <div>Modal content...</div>
  
  <CyberModalFooter>
    <CyberButton variant="ghost" onClick={onClose}>
      Cancel
    </CyberButton>
    <CyberButton variant="primary" onClick={onSubmit}>
      Create
    </CyberButton>
  </CyberModalFooter>
</CyberModal>
```

---

## 🎭 Design Patterns

### **Color Palette**

**Primary Colors:**
- Cyan: `#06b6d4` - Main accent, live states
- Purple: `#a855f7` - Secondary accent, recruiting
- Pink: `#ec4899` - Tertiary accent, special states
- Gold: `#eab308` - Achievement, winners

**Status Colors:**
- Green: `#22c55e` - Success, wins
- Red: `#ef4444` - Danger, losses
- Blue: `#3b82f6` - Information

**Background Layers:**
- Base: `slate-950` (#020617)
- Cards: `slate-900` with transparency
- Overlays: Black with 80% opacity

---

### **Glow Effects**

**Text Glow:**
```css
.text-glow {
  text-shadow: 
    0 0 10px rgba(6, 182, 212, 0.5),
    0 0 20px rgba(6, 182, 212, 0.3),
    0 0 30px rgba(6, 182, 212, 0.2);
}
```

**Box Glow:**
```tsx
className="shadow-[0_0_30px_rgba(6,182,212,0.3)]"
```

---

### **Glassmorphism**

**Standard Glass:**
```tsx
className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30"
```

**Heavy Glass:**
```tsx
className="bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/50"
```

---

### **Animations**

**Hover Scale:**
```tsx
className="transition-all hover:scale-105"
```

**Pulse Glow:**
```tsx
className="animate-pulse"
```

**Float Effect:**
```tsx
className="animate-float" // Custom animation in globals.css
```

**Fade In:**
```tsx
className="animate-in fade-in-0 duration-500"
```

---

## 🚀 Page Templates

### **Landing Page Pattern**
- Hero section with gradient background
- Floating particles
- Animated stats cards
- Feature showcases
- Call-to-action sections

### **Auth Pages Pattern**
- Centered card on gradient background
- Floating particles
- Icon with glow effect
- CyberInput fields
- Social auth buttons

### **Dashboard Pattern**
- Grid layout with CyberCards
- Sidebar with stats
- Tabs with cyber styling
- Color-coded status indicators

### **Browse/List Pattern**
- Search with filters
- Grid of cards with hover effects
- Pagination with CyberButtons
- Empty states

---

## 💡 Best Practices

### **Do's:**
✅ Use consistent color variants across related components
✅ Add glow effects to important interactive elements
✅ Implement smooth transitions (300ms default)
✅ Use glassmorphism for overlays and modals
✅ Include loading states with animations
✅ Provide visual feedback on hover
✅ Use icons from `lucide-react`
✅ Maintain proper contrast ratios

### **Don'ts:**
❌ Don't overuse glow effects (causes visual fatigue)
❌ Don't mix more than 3 color variants on one screen
❌ Don't use animations longer than 500ms
❌ Don't forget mobile responsiveness
❌ Don't use pure white text (use cyan-100 or white with opacity)

---

## 📦 Component Checklist

### **Completed:**
- [x] CyberButton (5 variants, all sizes)
- [x] CyberCard + sub-components
- [x] CyberInput + Textarea + Select + Checkbox
- [x] CyberBadge (6 variants)
- [x] CyberModal
- [x] SubmitButton
- [x] Tournament Cards
- [x] Match Cards
- [x] Auth Pages
- [x] Landing Page
- [x] Profile Page
- [x] Browse Page
- [x] Header/Nav

---

## 🎯 Usage Examples

### **Status Indicators**
```tsx
// Tournament Status
{tournament.finished ? (
  <CyberBadge variant="gold">Finished</CyberBadge>
) : tournament.started ? (
  <CyberBadge variant="cyan">Live</CyberBadge>
) : (
  <CyberBadge variant="purple">Recruiting</CyberBadge>
)}
```

### **Loading States**
```tsx
import { Loader2 } from 'lucide-react';

<CyberButton disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</CyberButton>
```

### **Empty States**
```tsx
<CyberCard variant="default">
  <CyberCardContent className="text-center py-12">
    <Trophy className="w-12 h-12 text-cyan-500/30 mx-auto mb-3" />
    <p className="text-cyan-100/60">No tournaments found</p>
  </CyberCardContent>
</CyberCard>
```

---

## 🔧 Customization

### **Adding New Variants**

1. Add color to variant object:
```tsx
const variantStyles = {
  // ... existing variants
  orange: 'bg-gradient-to-r from-orange-500 to-amber-600',
};
```

2. Add glow shadow:
```tsx
const glowStyles = {
  // ... existing glows
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
};
```

3. Use the new variant:
```tsx
<CyberButton variant="orange">Orange Button</CyberButton>
```

---

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">

// Hide on mobile
<span className="hidden md:inline">Desktop Only</span>

// Show on mobile only
<span className="md:hidden">Mobile Only</span>
```

---

## 🎨 Figma-to-Code Mapping

| Figma Style | Code Implementation |
|-------------|--------------------|
| Neon Glow | `shadow-[0_0_30px_rgba(6,182,212,0.3)]` |
| Glass Card | `bg-slate-900/50 backdrop-blur-sm` |
| Gradient Text | `bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent` |
| Hover Scale | `hover:scale-105 transition-all` |
| Border Glow | `border-2 border-cyan-500/50` |

---

## 🚀 Performance Tips

1. **Use `will-change` for animated elements:**
```tsx
className="will-change-transform hover:scale-105"
```

2. **Lazy load heavy components:**
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

3. **Optimize images:**
- Use Next.js `<Image>` component
- Serve WebP format
- Add blur placeholders

4. **Reduce animation complexity on mobile:**
```tsx
className="md:animate-float" // Only animate on desktop
```

---

## 📚 Resources

- **Icons:** [Lucide React](https://lucide.dev/)
- **Colors:** [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- **Animations:** [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Inspiration:** Cyberpunk 2077, Neon aesthetics

---

**Built with ❤️ for FragVerse**
**Version:** 1.0.0
**Last Updated:** December 2025
