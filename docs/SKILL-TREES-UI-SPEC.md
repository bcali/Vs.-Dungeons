# 🌳 SKILL TREE UI — Component Spec

*Feature spec for the skill tree interface within the Character Sheet screen.*
*Tablet-first (iPad landscape). Dark fantasy theme.*

---

## Overview

The skill tree is accessed from the **Character Sheet** page as a new tab/panel. It shows the character's class tree with all branches, learned skills, available points, and the action bar at the bottom.

```
┌─────────────────────────────────────────────────────────────┐
│  Character Sheet                                [Stats] [Skills] [Inventory] [Spells]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SKILL TREE PANEL                        │   │
│  │                                                      │   │
│  │  Points: 3 available / 7 spent / 10 total            │   │
│  │                                                      │   │
│  │  [PROTECTION]        [CORE]        [ARMS]            │   │
│  │   ┌─────────┐                     ┌─────────┐       │   │
│  │   │ Tier 1  │                     │ Tier 1  │       │   │
│  │   │ ● ● ○   │                     │ ● ○ ○   │       │   │
│  │   │ Tier 2  │                     │ Tier 2  │       │   │
│  │   │ ● ○ 🔒  │                     │ 🔒🔒🔒  │       │   │
│  │   │ ...     │                     │ ...     │       │   │
│  │   └─────────┘                     └─────────┘       │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  ACTION BAR:  [1:Shield Bash] [2:War Shout]  │    │   │
│  │  │               [3:Rally Cry]   [4:——]  [5:——]  │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
SkillTreePanel
├── SkillPointSummary          — Points counter at top
├── BranchSelector             — Tab/toggle between branches
├── SkillTreeBranch            — One branch's skill grid
│   ├── TierHeader             — "Tier 2 — Requires 3 points"
│   └── SkillNode (×N)        — Individual skill circle/card
│       ├── SkillIcon          — Type indicator + rank dots
│       └── SkillTooltip       — Flyout with full description
├── CoreSkillsRow              — Shared core skills (always visible)
│   └── SkillNode (×6)
├── ActionBar                  — 5-slot bar at bottom
│   └── ActionBarSlot (×5)    — Drag target / tap-to-assign
└── RespecButton               — "Reset All Points" with confirmation
```

---

## Components

### 1. SkillPointSummary

Sticky bar at top of the skill tree panel.

```
┌──────────────────────────────────────────────────────────┐
│  ⭐ Skill Points: 3 Available    7 Spent    10 Total     │
│  ████████████████████░░░░░░░░░░  (progress bar)          │
│                                                  [RESPEC] │
└──────────────────────────────────────────────────────────┘
```

**Props:**
- `totalPoints: number` — character level (1 per level)
- `spentPoints: number` — sum of all allocation ranks
- `availablePoints: number` — total - spent

**Behavior:**
- Available points > 0: pulsing glow on the counter (draws attention)
- Progress bar shows spent/total ratio
- "RESPEC" button opens confirmation dialog

---

### 2. BranchSelector

Tab bar to switch between branches. Always shows all branches for the class.

**Warrior layout:**
```
[🛡️ Protection (5 pts)]    [⚔️ Core]    [⚔️ Arms (2 pts)]
```

**Rogue/Ranger layout:**
```
[🌑 Shadow (3 pts)]  [🗡️ Core]  [🎯 Precision (4 pts)]  [🌿 Survival (0 pts)]
```

**Behavior:**
- Active tab highlighted with class color
- Point count per branch shown in tab
- Core tab always centered, smaller (fewer skills)
- Branches with 0 points show dimmed

---

### 3. SkillTreeBranch

Vertical scrolling list of tiers within the selected branch.

```
┌──────────────────────────────────────────┐
│  ═══ TIER 1 — FUNDAMENTALS ═══          │
│  (Unlocked immediately)                  │
│                                          │
│  [●●●]  Shield Mastery  (Passive)  3/3  │
│  [●]    Shield Bash     (Active)   1/1  │
│  [●●○]  Toughened Hide  (Passive)  2/3  │
│  [●]    Taunt           (Active)   1/1  │
│  [○○]   Battle Stance   (Passive)  0/2  │
│                                          │
│  ═══ TIER 2 — INTERMEDIATE ═══          │
│  (Requires 3 points in Protection)       │
│  ✅ Unlocked (5 points spent)            │
│                                          │
│  [●]    Iron Wall       (Active)   1/1  │
│  [○○]   Revenge         (Active)   0/2  │
│  ...                                     │
│                                          │
│  ═══ TIER 3 — ADVANCED ═══              │
│  🔒 Locked (need 6 points, have 5)      │
│                                          │
│  [🔒]   Bodyguard       (Active)   0/1  │
│  [🔒]   Shield Slam+    (Active)   0/2  │
│  ...                                     │
└──────────────────────────────────────────┘
```

**Behavior:**
- Tiers scroll vertically
- Locked tiers shown grayed out with lock icon and "need X more points" message
- Smooth unlock animation when threshold reached (tier header glows, locks disappear)
- Skills within a tier laid out in a grid (2–3 columns on tablet)

---

### 4. SkillNode

Individual skill displayed as a tappable card/node.

**States:**

| State | Visual | Interaction |
|-------|--------|-------------|
| **Locked** (tier not unlocked) | Grayed out, lock icon overlay | Tap shows "Need X more points in branch" |
| **Available** (tier unlocked, unlearned, points available) | Outlined, glowing border | Tap to learn (1 point) |
| **Learned** (has ranks, can rank up) | Filled, rank dots lit, +1 indicator | Tap to rank up |
| **Maxed** (all ranks purchased) | Fully lit, gold border | Tap shows description only |
| **Available but no points** | Outlined, no glow | Tap shows "No skill points available" |

**Layout per node:**
```
┌───────────────────────────────┐
│  ⚔️  Shield Bash              │
│  Active  •  Tier 1            │
│  ████░  (1/1)                 │
│                               │
│  "Melee attack: deal STR      │
│   damage + push back 2 studs" │
│                               │
│  [EQUIP TO BAR]               │
└───────────────────────────────┘
```

**Multi-rank display:**
```
┌───────────────────────────────┐
│  🛡️  Shield Mastery           │
│  Passive  •  Tier 1           │
│  ●●○  (2/3)                   │
│                               │
│  Rank 1: +1 defense ✅        │
│  Rank 2: +2 defense ✅        │
│  Rank 3: +3 defense           │
│                               │
│  [+ RANK UP]                  │
└───────────────────────────────┘
```

**Props:**
```typescript
interface SkillNodeProps {
  skill: SkillTreeSkill;
  currentRank: number;         // 0 if unlearned
  isLocked: boolean;           // tier not unlocked
  hasAvailablePoints: boolean;
  onAllocate: () => void;
  onEquipToBar: () => void;
}
```

---

### 5. ActionBar

Fixed bar at the bottom of the skill tree panel. Always visible.

```
┌──────────────────────────────────────────────────────────────┐
│  ACTION BAR                                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ 1       │ │ 2       │ │ 3       │ │ 4       │ │ 5       │││
│  │ Shield  │ │ War     │ │ Rally   │ │         │ │         │││
│  │ Bash    │ │ Shout   │ │ Cry     │ │  Empty  │ │  Empty  │││
│  │ ⚔️ Tree │ │ 📖 Spell│ │ 📖 Spell│ │         │ │         │││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│                                                               │
│  Drag skills here or tap [EQUIP] on a skill • Swap anytime   │
└──────────────────────────────────────────────────────────────┘
```

**Visual indicators:**
- Tree skills: sword icon + branch color accent
- Spellbook abilities: book icon + profession color accent
- Empty slots: dashed border, "+" icon
- Source label: small "Tree" or "Spell" badge

**Behavior:**
- Tap empty slot → opens skill picker (shows all learned active skills + known spells)
- Tap filled slot → options: "Swap" or "Remove"
- Tap [EQUIP TO BAR] on a skill node → auto-fills first empty slot, or prompts to replace
- Cannot equip passive skills (grayed out / not shown in picker)
- Changes persist immediately to Supabase

---

### 6. RespecDialog

Confirmation modal triggered by RESPEC button.

```
┌──────────────────────────────────┐
│  🔄 Reset All Skill Points?      │
│                                   │
│  This will:                       │
│  • Remove all 7 spent points      │
│  • Clear skill-tree action bar    │
│  • Give you 7 points back         │
│                                   │
│  Your spellbook abilities are     │
│  NOT affected.                    │
│                                   │
│  You can always re-spend your     │
│  points however you like!         │
│                                   │
│  [CANCEL]         [RESET POINTS]  │
└──────────────────────────────────┘
```

---

## Data Flow

### Loading the Skill Tree

```
1. Component mounts
2. Fetch from Supabase:
   a. GET skill_tree_skills WHERE class = character.class
   b. GET character_skill_allocations WHERE character_id = ?
   c. GET character_action_bar WHERE character_id = ?
3. Compute:
   a. Points per branch (for tier gating)
   b. Highest unlocked tier per branch
   c. Available points
4. Render tree with correct states
```

### Allocating a Point

```
1. User taps available skill node
2. Client validates: tier unlocked? Points available? Below max rank?
3. Call: allocate_skill_point(character_id, skill_id) — DB function
4. On success:
   a. Update local Zustand state
   b. Animate skill node: "learned" pulse + rank dot fills
   c. Recalculate branch totals
   d. Check if new tier unlocked → animate tier unlock
   e. Update points counter
   f. If passive: immediately add to active passives display
```

### Respec

```
1. User confirms respec dialog
2. Call: respec_character(character_id) — DB function
3. On success:
   a. Clear all allocations in Zustand
   b. Clear action bar skill entries
   c. Reset points to 0 spent / N total
   d. Re-render tree with everything available
   e. Flash "Points reset!" notification
```

---

## Animations & Feedback

| Event | Animation |
|-------|-----------|
| **Skill learned** | Node pulses gold, rank dot fills in with sparkle |
| **Skill ranked up** | Next rank dot fills, brief "+1" floats up |
| **Tier unlocked** | Lock icons shatter/dissolve, tier header glows, brief "TIER X UNLOCKED" banner |
| **Capstone available** | Tier 5 header gets a special flame/legendary glow |
| **Equipped to bar** | Skill icon flies down to action bar slot |
| **Respec** | All nodes briefly flash, then reset to empty state |
| **No points available** | Gentle shake on the points counter |

---

## Responsive Layout

### iPad Landscape (Primary — 1024×768+)

- Full 3-column layout: Branch 1 | Core | Branch 2
- Rogue/Ranger: 4 tabs with scrollable branch content
- Action bar fixed at bottom, full width
- Skills in 2-column grid per tier

### iPad Portrait (Secondary)

- Single branch visible at a time
- Branch tabs become a horizontal scrollable strip
- Action bar collapses to icon-only mode
- Skills in single column

### iPhone (Fallback)

- Accordion-style: one tier expanded at a time
- Branch picker as dropdown
- Action bar as floating button → opens modal

---

## TypeScript Types

```typescript
// Database types (from Supabase generated)
interface SkillTreeSkill {
  id: string;
  skill_code: string;
  name: string;
  class: 'warrior' | 'rogue_ranger';
  branch: 'protection' | 'arms' | 'warrior_core' | 
          'shadow' | 'precision' | 'survival' | 'rogue_ranger_core';
  tier: 1 | 2 | 3 | 4 | 5;
  skill_type: 'active' | 'passive';
  max_rank: number;
  description: string;
  lego_tip: string | null;
  effect_json: Record<string, any>;
  sort_order: number;
}

interface CharacterSkillAllocation {
  id: string;
  character_id: string;
  skill_id: string;
  current_rank: number;
  learned_at_level: number | null;
}

interface ActionBarSlot {
  id: string;
  character_id: string;
  slot_number: 1 | 2 | 3 | 4 | 5;
  skill_id: string | null;    // skill tree source
  ability_id: string | null;   // spellbook source
  display_name: string | null;
}

// Computed client-side
interface BranchState {
  branch: SkillTreeSkill['branch'];
  totalPoints: number;
  highestUnlockedTier: number;
  skills: (SkillTreeSkill & { currentRank: number })[];
}

interface SkillTreeState {
  characterId: string;
  class: SkillTreeSkill['class'];
  totalSkillPoints: number;
  spentSkillPoints: number;
  availablePoints: number;
  branches: BranchState[];
  actionBar: ActionBarSlot[];
  activePassives: (SkillTreeSkill & { currentRank: number })[];
}

// Tier gating constants
const TIER_REQUIREMENTS: Record<number, number> = {
  1: 0,
  2: 3,
  3: 6,
  4: 10,
  5: 15,
};
```

---

## New Components to Build

| Component | File | Priority |
|-----------|------|----------|
| `SkillTreePanel` | `src/components/character/SkillTreePanel.tsx` | P0 |
| `SkillPointSummary` | `src/components/character/SkillPointSummary.tsx` | P0 |
| `BranchSelector` | `src/components/character/BranchSelector.tsx` | P0 |
| `SkillTreeBranch` | `src/components/character/SkillTreeBranch.tsx` | P0 |
| `SkillNode` | `src/components/character/SkillNode.tsx` | P0 |
| `SkillTooltip` | `src/components/character/SkillTooltip.tsx` | P1 |
| `ActionBar` | `src/components/character/ActionBar.tsx` | P0 |
| `ActionBarSlot` | `src/components/character/ActionBarSlot.tsx` | P0 |
| `RespecDialog` | `src/components/character/RespecDialog.tsx` | P1 |
| `SkillPicker` | `src/components/character/SkillPicker.tsx` | P1 |
| `TierHeader` | `src/components/character/TierHeader.tsx` | P1 |

### Zustand Store Extension

```typescript
// Add to existing character-store.ts or create skill-tree-store.ts

interface SkillTreeStore {
  // State
  skills: SkillTreeSkill[];           // All skills for this class
  allocations: Map<string, number>;    // skillId → currentRank
  actionBar: ActionBarSlot[];
  branchTotals: Map<string, number>;   // branch → total points
  
  // Actions
  loadSkillTree: (characterId: string) => Promise<void>;
  allocatePoint: (skillId: string) => Promise<void>;
  removeFromBar: (slotNumber: number) => Promise<void>;
  equipToBar: (slotNumber: number, skillId?: string, abilityId?: string) => Promise<void>;
  respec: () => Promise<void>;
  
  // Computed
  getAvailablePoints: () => number;
  getBranchTier: (branch: string) => number;
  canLearnSkill: (skillId: string) => boolean;
  getActivePassives: () => SkillTreeSkill[];
}
```

---

## Integration Points

### Character Sheet Tab

Add "Skills" tab to the character sheet tab bar (alongside Stats, Spells, Inventory):

```tsx
// In character/[id]/page.tsx
<TabBar>
  <Tab label="Stats" icon={<SwordIcon />} />
  <Tab label="Skills" icon={<TreeIcon />} badge={availablePoints > 0 ? availablePoints : undefined} />
  <Tab label="Spells" icon={<BookIcon />} />
  <Tab label="Inventory" icon={<BackpackIcon />} />
</TabBar>
```

Badge on Skills tab shows unspent points (draws attention on level-up).

### Combat Tracker

The combat tracker reads the action bar to know what abilities are available:

```
1. Load combat participant → fetch action bar
2. Display ability buttons matching the 5 slots
3. Passive bonuses from skill tree applied automatically via character_active_passives view
```

### Level-Up Flow

When a character levels up:

```
1. Increment total_skill_points by 1
2. Show "NEW SKILL POINT!" notification
3. Auto-navigate to Skills tab with the new point highlighted
4. Available points badge pulses until spent
```
