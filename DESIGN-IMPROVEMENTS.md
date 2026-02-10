# 🎨 Vs. Dungeons — Character Screen Visual Redesign Spec

> For implementation in Claude Code against `https://github.com/bcali/Vs.-Dungeons`

---

## The Problem

The **launcher** (home page) has a vibrant, pixel-art-meets-arcade personality — deep purple space backdrop, floating blocky characters, glowing elements, a "Season 4: Blocky Realms" banner. It feels like a *game*.

The **character list** and **character detail** screens feel like a *database admin panel* — flat navy cards, plain text, functional but lifeless. A kid clicking "My Heroes" goes from arcade energy to spreadsheet energy.

**Goal:** Bring the launcher's personality, motion, and visual richness into the character screens while enriching content to make heroes feel *alive*.

---

## 1. Background & Atmosphere

### Current
- Flat `#1a1a2e` dark background, no depth or atmosphere.

### Target
Match the launcher's space/fantasy theme. Create an ambient, living backdrop.

```
Background layers (bottom to top):
1. Deep gradient: #0d0221 → #1a0a3e → #0d0221 (dark purple-black)
2. Starfield: CSS-generated tiny dots (white, 0.3–0.8 opacity) with subtle twinkle animation
3. Floating particles: 5–8 small colored blocks (green, blue, purple, gold) drifting slowly across viewport
4. Subtle noise texture overlay at 3–5% opacity for grain/depth
```

**CSS approach:**
```css
/* Starfield via radial-gradient dots or a spritesheet */
.starfield {
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.7), transparent);
  /* ... repeat with 30-50 star positions */
}

/* Floating blocks: CSS keyframe animations on small colored divs */
@keyframes float-drift {
  0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-40px) rotate(15deg); opacity: 0.6; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
}
```

**Implementation notes:**
- Use a shared `<GameBackground />` component across all pages for consistency
- Keep particles lightweight (CSS-only, no canvas needed for this density)
- The launcher already has this vibe — extract its approach if possible and reuse

---

## 2. Character Avatars — "Chibi Block Warriors"

### The Copyright-Safe Approach
Instead of LEGO minifigures, create **chibi-style blocky warriors** — pixel-art-inspired characters with anime expressiveness. Think: the launcher's blocky characters but with more detail and profession-specific designs.

### Avatar Generation Strategy

**Option A — SVG/CSS Avatars (Recommended for v1)**
Build a composable SVG avatar system with parts:
- **Body shape:** Blocky/rectangular torso and limbs (like Minecraft meets chibi anime)
- **Head:** Oversized round-rectangle head (anime proportion — head = 40% of total height)
- **Eyes:** Large, expressive anime-style eyes with profession-specific colors
- **Gear silhouette:** Weapon/armor outline changes per profession
- **Color palette:** Profession-driven (see below)

```
Profession → Avatar Config:
┌─────────┬────────────────────┬──────────────┬────────────────────┐
│ Class   │ Primary Color      │ Accent       │ Weapon Silhouette  │
├─────────┼────────────────────┼──────────────┼────────────────────┤
│ Knight  │ #c0392b (crimson)  │ #f1c40f gold │ Sword + Shield     │
│ Rogue   │ #2c3e50 (shadow)   │ #1abc9c teal │ Dual daggers       │
│ Wizard  │ #8e44ad (purple)   │ #3498db blue │ Staff + orb        │
│ Healer  │ #f39c12 (amber)    │ #ecf0f1 white│ Book + halo        │
│ Ranger  │ #27ae60 (forest)   │ #e67e22 brown│ Bow + quiver       │
│ Inventor│ #d35400 (copper)   │ #95a5a6 steel│ Wrench + gadget    │
└─────────┴────────────────────┴──────────────┴────────────────────┘
```

**Option B — Pre-rendered pixel art set**
Commission or generate a small set of pixel-art character sprites (6 professions × idle pose). Place them in `/public/avatars/`. This is more polished but less dynamic.

**Option C — Hybrid (Best for the blocky theme)**
Use CSS to build blocky character frames, then overlay with small pixel-art weapon icons. The launcher characters are this style — blocky bodies with distinct gear outlines.

### Avatar Component Spec
```tsx
<HeroAvatar
  profession="knight"
  level={1}
  size="lg"       // sm = card, lg = detail page
  animate={true}  // idle bobbing animation
  glow={true}     // profession-colored glow behind avatar
/>
```

- **Idle animation:** Gentle 2px up/down bob on a 3s ease-in-out loop
- **Level indicator:** Small star/badge count overlaid at bottom-right
- **Glow:** Soft profession-colored radial gradient behind the avatar (20% opacity)

---

## 3. Hero List Page (`/character`)

### Layout Changes

**Current:** Two flat cards side-by-side, minimal info.

**Redesigned layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  [Star particles + floating blocks background]               │
│                                                              │
│  ⚔️  YOUR HEROES                          [+ Create Hero]   │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  ╔═══════════════╗  │  │  ╔═══════════════╗  │           │
│  │  ║  AVATAR       ║  │  │  ║  AVATAR       ║  │           │
│  │  ║  (animated)   ║  │  │  ║  (animated)   ║  │           │
│  │  ╚═══════════════╝  │  │  ╚═══════════════╝  │           │
│  │                      │  │                      │           │
│  │  PIKACHU007007       │  │  ARCEUS              │           │
│  │  ⚔ Knight • Lv.1    │  │  🗡 Rogue • Lv.1     │           │
│  │  "Starting Hero"     │  │  "Starting Hero"     │           │
│  │                      │  │                      │           │
│  │  ██████████░░ 11/12  │  │  ██████░░░░░░ 5/9    │           │
│  │  HP                  │  │  HP                  │           │
│  │                      │  │                      │           │
│  │  ░░░░░░░░░░░░ 0/10   │  │  ░░░░░░░░░░░░ 0/10   │           │
│  │  XP to next level    │  │  XP to next level    │           │
│  │                      │  │                      │           │
│  │  🟢0 🔵0 🟡0 🟣0 🔴0 │  │  🟢0 🔵0 🟡0 🟣0 🔴0 │           │
│  │  Seals               │  │  Seals               │           │
│  │                      │  │                      │           │
│  │  [ View Sheet ]      │  │  [ View Sheet ]      │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                              │
│                    [ ⚔ Start Combat ]                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Card Styling Details

```css
.hero-card {
  /* Glass-morphism with profession tint */
  background: linear-gradient(
    135deg,
    rgba(var(--profession-rgb), 0.15),
    rgba(13, 2, 33, 0.85)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--profession-rgb), 0.3);
  border-radius: 12px;
  box-shadow:
    0 0 20px rgba(var(--profession-rgb), 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 30px rgba(var(--profession-rgb), 0.2);
}
```

### Content Enrichment on Cards
- **Add rank subtitle** below class/level: `"Starting Hero"` in italic gold (#f1c40f, 60% opacity)
- **Add seal collection mini-display:** 5 tiny colored dots with counts
- **Add profession icon:** Use emoji or small SVG icon matching the launcher style
- **HP bar color:** Gradient from green (full) → yellow (50%) → red (low)
- **XP bar color:** Cyan/blue glow with subtle pulse animation when near level-up

---

## 4. Character Detail Page (`/character/[id]`)

### Header Redesign

**Current:** Plain text: `Pikachu007007 — Level 1 Knight`

**Redesigned:**
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back                                           [Saved ✓] │
│                                                              │
│  ╔══════════╗                                                │
│  ║  AVATAR  ║   PIKACHU007007                                │
│  ║  (large) ║   Level 1 Knight • Starting Hero               │
│  ║  + glow  ║   ████████████░░ 0/10 XP                       │
│  ╚══════════╝   💰 8 Gold                                    │
│                                                              │
│  [Sheet]  [Skills]  [Spells]  [Inventory]                    │
└──────────────────────────────────────────────────────────────┘
```

- Large avatar (128×128) with profession-colored glow halo
- Name in bold display font (see Typography section)
- Rank as a styled badge/chip
- XP bar prominently displayed in header
- Tabbed navigation with active indicator glow

### Stats Panel Redesign

**Current:** Basic stat list with +/- buttons and small blue bars.

**Redesigned:**

```
┌─ STATS ──────────────────────────────────────────┐
│                                                   │
│  CON   [−] ████ 4 ████ [+]    (+1)  ⬆ HIGHEST   │
│  STR   [−] ███░ 3 ███░ [+]    (+0)               │
│  AGI   [−] ███░ 3 ███░ [+]    (+0)               │
│  MNA   [−] ███░ 3 ███░ [+]    (+0)               │
│  INT   [−] ███░ 3 ███░ [+]    (+0)               │
│  LCK   [−] ███░ 3 ███░ [+]    (+0)               │
│                                                   │
│  📊 Stat Points Available: 0                      │
│                                                   │
└───────────────────────────────────────────────────┘
```

- Stat bars should use **profession-colored gradients** instead of flat blue
- The highest stat should have a subtle glow/highlight
- Stat labels should have tooltips or tap-to-reveal descriptions for the kids:
  - CON: "How tough you are — more CON = more HP!"
  - STR: "How hard you hit — SMASH!"
  - etc.
- The +/- buttons should have satisfying press feedback (scale down on press, pop on release)
- When stat points are available to spend, show a **pulsing golden indicator**

### Combat Panel Redesign

**Current:** Plain text list of values.

**Redesigned:**
```
┌─ COMBAT ─────────────────────────────────────────┐
│                                                   │
│  ❤️ HP    ████████████░░░  11 / 12                │
│           (green → yellow → red gradient)         │
│                                                   │
│  🔥 Rage  ████░░░░░░░░░░░  25 / 100              │
│           (dark red, pulses when >75%)            │
│                                                   │
│  ┌────────────┐  ┌────────────┐                   │
│  │ ⚔ Melee    │  │ 🏃 Move    │                   │
│  │ Dmg: 3     │  │ 6 studs    │                   │
│  └────────────┘  └────────────┘                   │
│  ┌────────────┐  ┌────────────┐                   │
│  │ 🛡 Melee   │  │ 🏹 Ranged  │                   │
│  │ Def: 11    │  │ Def: 11    │                   │
│  └────────────┘  └────────────┘                   │
│  ┌────────────┐  ┌────────────┐                   │
│  │ 💥 Crit    │  │ 🍀 Lucky   │                   │
│  │ Range: 20+ │  │ Saves: 1   │                   │
│  └────────────┘  └────────────┘                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

- Combat stats in a **2-column grid of mini-cards** instead of a flat text list
- Each mini-card has a subtle icon and clear label
- HP/Rage bars should be chunky and game-like (rounded ends, gradient fills)
- Rage bar should pulse/glow red when above 75%

### Seal Collection Redesign

**Current:** 5 colored squares with "0" in each.

**Redesigned:**
```
┌─ SEAL COLLECTION ────────────────────────────────┐
│                                                   │
│  🟢 Common     ●●●●○○○○○○  0                     │
│  🔵 Uncommon   ●●●●○○○○○○  0                     │
│  🟡 Rare       ●●●●○○○○○○  0                     │
│  🟣 Epic       ●●●●○○○○○○  0                     │
│  🔴 Legendary  ●●●●○○○○○○  0                     │
│                                                   │
│  Total Seals: 0   |   Craftable Items: 0          │
│                                                   │
└───────────────────────────────────────────────────┘
```

- Show seal counts as **progress dot tracks** (like achievement progress)
- Each tier row has its signature color as background tint
- Add "Craftable Items" indicator — when they have enough seals for a recipe, show it!
- The colored squares from the current design are fine but should be larger and have a gem-like CSS treatment (inner shadow, subtle shine gradient)

### Abilities Section Enrichment

**Current:** "No abilities learned yet" — empty and deflating.

**Redesigned when empty:**
```
┌─ ABILITIES ──────────────────────────────────────┐
│                                                   │
│  🔒 Abilities unlock at Level 2!                  │
│                                                   │
│  Upcoming for Knight:                             │
│  ├─ Lv.2  ⚔ War Shout — Rally your allies!       │
│  ├─ Lv.2  🛡 Shield Slam — Bash & stun!          │
│  ├─ Lv.2  🪨 Iron Stance — Take half damage!     │
│  └─ Lv.2  📢 Challenge — Force enemies to you!   │
│                                                   │
│  "Keep fighting, hero — power awaits!"            │
│                                                   │
└───────────────────────────────────────────────────┘
```

- **Never show empty states without a preview.** Show upcoming abilities as locked/grayed items with names and one-line descriptions. This is the "aspirational loot" principle from the game design — tease what's coming.
- Include a motivational flavor line at the bottom.

### Inventory Section Enrichment

**Current:** Shows gold count and "No items yet."

**Redesigned:**
```
┌─ INVENTORY ──────────────────────────────────────┐
│                                                   │
│  💰 Gold Coins                              ×8   │
│     ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄        │
│  📦 Equipment                                    │
│     (empty — visit a shop!)                      │
│                                                   │
│  🧪 Consumables                                  │
│     (empty — craft potions from seals!)           │
│                                                   │
└───────────────────────────────────────────────────┘
```

- Categorize inventory into Equipment / Consumables / Quest Items
- Gold should display with a coin icon and warm golden color
- Empty categories should have helpful hints, not just "nothing"

---

## 5. Typography

### Font Pairing

**Display / Headings:** `"Press Start 2P"` (Google Fonts) — pixel font that matches the blocky/retro theme of the launcher. Use for page titles and section headers.

**Body / UI:** `"Exo 2"` or `"Rajdhani"` (Google Fonts) — clean, slightly futuristic, readable at small sizes. Good for stats, labels, descriptions.

**Alternative if pixel font is too much:** `"Orbitron"` for headings (geometric/techy) + `"Source Sans 3"` for body.

```css
/* Import in layout.tsx or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Exo+2:wght@400;600;700&display=swap');

:root {
  --font-display: 'Press Start 2P', monospace;
  --font-body: 'Exo 2', sans-serif;
}

h1, h2, .section-title { font-family: var(--font-display); }
body, p, label, span { font-family: var(--font-body); }
```

**Sizing note:** "Press Start 2P" renders small — use it at 14px+ for headings, and *never* for body text. It should feel like a game UI header, not overwhelm readability.

---

## 6. Color System

### Palette (derived from launcher screenshots)

```css
:root {
  /* Backgrounds */
  --bg-deep: #0d0221;           /* Deepest background */
  --bg-mid: #1a0a3e;            /* Card/panel background */
  --bg-surface: #261454;        /* Elevated surfaces */

  /* Text */
  --text-primary: #f0e6ff;      /* Main text — light lavender */
  --text-secondary: #8b7aaa;    /* Muted text */
  --text-gold: #ffd700;         /* Highlights, gold accents */
  --text-title: #ffcc00;        /* Page titles (matches launcher) */

  /* Bars */
  --hp-full: #2ecc71;
  --hp-mid: #f1c40f;
  --hp-low: #e74c3c;
  --xp-bar: #3498db;
  --rage-bar: #c0392b;
  --mana-bar: #9b59b6;

  /* Profession accents */
  --knight-primary: #c0392b;
  --knight-accent: #f1c40f;
  --rogue-primary: #1abc9c;
  --rogue-accent: #2c3e50;
  --wizard-primary: #8e44ad;
  --wizard-accent: #3498db;
  --healer-primary: #f39c12;
  --healer-accent: #ecf0f1;
  --ranger-primary: #27ae60;
  --ranger-accent: #e67e22;
  --inventor-primary: #d35400;
  --inventor-accent: #95a5a6;

  /* UI */
  --border-glow: rgba(255, 204, 0, 0.3);
  --card-bg: rgba(26, 10, 62, 0.85);
  --card-border: rgba(255, 255, 255, 0.08);
}
```

---

## 7. Animations & Micro-interactions

### Page Load
- Cards fade in + slide up with stagger (card 1 at 0ms, card 2 at 100ms)
- Background stars begin twinkling after 500ms

### Hero Cards
- Hover: lift 4px + expand glow
- Avatar: continuous gentle bob (2px, 3s loop)
- HP bar: animate width on mount (0 → current value over 600ms)

### Character Detail
- Stats: bars animate in sequentially on mount
- Level-up available: golden pulse ring around XP bar
- Seal collection: counts tick up like a counter when changed

### Buttons
- All buttons: slight scale down (0.96) on press, spring back on release
- "Start Combat" button: subtle red pulse glow animation (like the launcher's green "PLAY NOW")
- "View Sheet": hover glow in profession color

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(var(--color), 0.3); }
  50% { box-shadow: 0 0 25px rgba(var(--color), 0.6); }
}

@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 8. Additional Suggestions

### A. Add "Hero Power" Summary
On the list page, below HP/XP, show a quick power summary:
```
⚔ ATK: 3  |  🛡 DEF: 11  |  🏃 SPD: 3
```
This gives at-a-glance combat readiness without opening the detail page.

### B. Add Flavor Titles
Each profession should have a level-appropriate flavor title beyond just "Starting Hero":
- Knight Lv.1: *"Squire of the Realm"*
- Rogue Lv.1: *"Street Shadow"*
- Wizard Lv.1: *"Spark Apprentice"*
- etc.
Display this on both the card and the detail page.

### C. Add Session History Widget
On the detail page, add a small "Recent Adventures" section:
```
📜 RECENT ADVENTURES
   No adventures yet — your story begins soon!
```
This ties the character to the campaign log and makes the sheet feel alive.

### D. Add Crafting Preview
In the Seal Collection, show the *closest craftable recipe*:
```
🔨 Next Craft: Health Potion (need 2🟢, have 0🟢)
```

### E. Sound Effects (Optional, PWA)
- Stat allocation: soft "click" or "ding"
- Level up: fanfare
- Opening character sheet: parchment unroll
- These would be small audio files in `/public/sounds/`

### F. Mobile / Tablet Touch Targets
- All tap targets minimum 44×44px
- Stat +/- buttons should be larger (48px circles)
- Swipe between characters on the list page
- Pull-down to refresh character data

---

## 9. Implementation Priority for Claude Code

### Phase 1 — Visual Foundation (Do First)
1. Shared `<GameBackground />` component (stars + gradient + particles)
2. Color system CSS variables in `globals.css`
3. Font imports and typography setup
4. Card glass-morphism styling

### Phase 2 — Hero List Page
5. Redesigned hero cards with profession colors
6. Card hover/press animations
7. Enriched card content (rank, seals mini-display, power summary)
8. "Start Combat" button glow animation

### Phase 3 — Character Detail Page
9. Header redesign with large avatar area + XP bar
10. Stat bars with profession colors + tooltips
11. Combat stats grid layout
12. Seal collection visual upgrade
13. Abilities preview (show locked upcoming abilities)
14. Inventory categorization

### Phase 4 — Avatar System
15. SVG/CSS avatar component per profession
16. Idle bob animation
17. Profession-colored glow halo
18. Level badge overlay

### Phase 5 — Polish
19. Page load animations (stagger, fade-in)
20. Micro-interactions (button press, stat change)
21. Empty state improvements across all sections
22. Flavor text and motivational copy

---

## 10. Reference Images

The launcher (screen_3.JPG) is the north star for visual tone:
- Deep purple-black space background
- Floating colored blocks (LEGO-like cubes)
- Blocky pixel characters with distinct silhouettes
- Bold yellow/red display text
- Green accent for primary actions
- Overall vibe: **arcade game lobby meets fantasy dungeon**

The character screens should feel like you walked *into* that world — same atmosphere, same energy, but now focused on *your hero*.
