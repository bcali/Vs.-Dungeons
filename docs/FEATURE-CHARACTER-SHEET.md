# 🛡️ FEATURE — Character Sheet Manager

---

## Overview

A tablet-optimized character sheet that lets the GM create, edit, and manage heroes for both kids. Supports stat point allocation, ability selection, inventory management, seal tracking, and real-time derived stat calculations. All changes persist to Supabase.

---

## Screens

### Screen 1: Character List (`/character`)

Simple two-card layout showing both heroes side by side.

```
┌─────────────────────────────────────────────────────┐
│  LEGO QUEST — Heroes                    [⚙ Config]  │
├────────────────────────┬────────────────────────────┤
│                        │                            │
│   [Avatar Photo]       │   [Avatar Photo]           │
│                        │                            │
│   HERO NAME            │   HERO NAME                │
│   Knight • Level 3     │   Wizard • Level 3         │
│   HP: 15/15            │   HP: 9/9                  │
│   Rage: 0/100          │   Mana: 45/75              │
│   XP: 30/45            │   XP: 28/45                │
│                        │                            │
│   [View Sheet]         │   [View Sheet]             │
│                        │                            │
├────────────────────────┴────────────────────────────┤
│  [+ Create Character]          [🎮 Start Combat]    │
└─────────────────────────────────────────────────────┘
```

### Screen 2: Character Sheet (`/character/[id]`)

Full character sheet, scrollable on tablet. Organized in sections.

```
┌─────────────────────────────────────────────────────┐
│  ← Back    HERO NAME — Knight    Level 3    [Save]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─── IDENTITY ──────────────────────────────────┐  │
│  │  Name: [Editable]     Profession: Knight      │  │
│  │  Player: Son, Age 9   Rank: Adventurer        │  │
│  │  XP: 30 / 45          Gold: 23                │  │
│  │  [XP Progress Bar ████████░░░░░░░]            │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── STATS ─────────────────────────────────────┐  │
│  │  Unspent Points: [3]                          │  │
│  │                                               │  │
│  │  CON  [4] (+1)  ░░░░░░░░░░░░░ [-][+]  HP:12  │  │
│  │  STR  [5] (+2)  ██████░░░░░░░ [-][+]         │  │
│  │  AGI  [3] (+0)  ░░░░░░░░░░░░░ [-][+]         │  │
│  │  MNA  [3] (+0)  ░░░░░░░░░░░░░ [-][+]         │  │
│  │  INT  [3] (+0)  ░░░░░░░░░░░░░ [-][+]         │  │
│  │  LCK  [3] (+0)  ░░░░░░░░░░░░░ [-][+]  Crit:20│  │
│  │                                               │  │
│  │  Gear bonuses shown as +N in separate column  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── COMBAT ────────────────────────────────────┐  │
│  │  HP:  [████████████░░░] 12 / 12               │  │
│  │  Rage:[░░░░░░░░░░░░░░░] 0 / 100              │  │
│  │  Movement: 6 studs                            │  │
│  │  Melee Dmg: 5 (STR)   Melee Target: STR+8    │  │
│  │  Crit Range: 20       Lucky Saves: 1/session  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── ABILITIES ─────────────────────────────────┐  │
│  │  Known (3/5 available):                       │  │
│  │                                               │  │
│  │  ⚔ War Shout      Tier 1  30 Rage            │  │
│  │    All allies +1 to next attack               │  │
│  │                                               │  │
│  │  ⚔ Shield Slam    Tier 1  30 Rage            │  │
│  │    Push 3 studs + stun 1 turn                 │  │
│  │                                               │  │
│  │  ⚔ Blade Storm    Tier 2  40 Rage            │  │
│  │    2 melee attacks on different enemies       │  │
│  │                                               │  │
│  │  [+ Learn New Ability] (if points available)  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── INVENTORY ─────────────────────────────────┐  │
│  │  Equipped:                                    │  │
│  │    🗡️ Iron Sword (+2 melee dmg)               │  │
│  │    🛡️ Wooden Shield (+1 defense)              │  │
│  │                                               │  │
│  │  Backpack:                                    │  │
│  │    Health Potion ×2                           │  │
│  │    Fire Bomb ×1                               │  │
│  │    Goblin's Lucky Charm (flavor)              │  │
│  │                                               │  │
│  │  [+ Add Item]                                 │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── SEALS ─────────────────────────────────────┐  │
│  │  🟢 Common: 4    🔵 Uncommon: 1               │  │
│  │  🟡 Rare: 0      🟣 Epic: 0                   │  │
│  │  🔴 Legendary: 0                              │  │
│  │                                               │  │
│  │  [Craft Item] (if level 3+)                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Functional Requirements

### F1: Character Creation

| Requirement | Detail |
|------------|--------|
| Create a new character | Name, player name, age, profession selection |
| Profession selection | Show all 6 professions with description, recommended stats, resource type |
| Auto-set resource type | Based on profession: Knight→Rage, Rogue→Energy, others→Mana |
| Starting values | All stats at base (from config), starting gold (8), level 1 |
| Avatar upload | Take photo of Lego minifig or upload image |
| Initial stat point | Level 1 grants +1 stat point (from config) to spend |

### F2: Stat Allocation

| Requirement | Detail |
|------------|--------|
| Point-buy system | Tap +/- buttons to allocate unspent points |
| Available points | Calculated from level progression table in game_config |
| Total points spent | Sum of (all stats - base_value) must not exceed earned points |
| Stat cap enforcement | Cannot exceed stat_cap (default 15) |
| Real-time derived stats | HP, mana pool, stat bonus, crit range all update instantly |
| Gear bonuses displayed | Shown separately, added to total |
| Undo support | Can freely redistribute until saved |

### F3: Derived Stat Calculations

All computed client-side from config formulas:

| Derived Stat | Formula | Updates When |
|-------------|---------|-------------|
| Stat Bonus | `stat - base_value` (default: stat - 3) | Stat changes |
| Max HP | `total_CON * 3` | CON changes |
| Max Mana | `total_MNA * 15` (mana users only) | MNA changes |
| Max Energy | 100 (fixed) | Never |
| Max Rage | 100 (fixed) | Never |
| Melee Damage | `total_STR` | STR changes |
| Crit Range | Based on LCK thresholds from config | LCK changes |
| Movement | `movement_base` from config (default 6) | Config changes |

### F4: Ability Management

| Requirement | Detail |
|------------|--------|
| View known abilities | List with name, tier, cost, effect description |
| Learn new ability | Modal showing available abilities for profession + tier |
| Tier gating | Only show abilities the character's level qualifies for |
| Choice tracking | Track how many abilities learned vs available at each milestone |
| Universal abilities | Shown in separate section, available if character has a scroll |

### F5: Inventory Management

| Requirement | Detail |
|------------|--------|
| Add items | Name, type, quantity, effect (optional JSON) |
| Equip/unequip | Toggle equipped status; gear bonuses auto-apply to stats |
| Remove items | Swipe-to-delete or remove button |
| Consumables | Track quantity, decrement on use |
| Crafting interface | If level 3+, show available recipes based on current seals |

### F6: Seal Tracking

| Requirement | Detail |
|------------|--------|
| Display counts | All 5 tiers with colored indicators |
| Add/remove seals | +/- buttons for each tier |
| Craft button | Opens crafting modal if eligible |
| Recipe list | Shows all recipes, highlights craftable ones |

### F7: Level Up Flow

| Requirement | Detail |
|------------|--------|
| XP tracking | Current XP / next level threshold (from config) |
| Level up trigger | When XP >= threshold, prompt level up |
| Level up grants | Stat points (from config table), ability unlock check, rank update |
| Ability milestone | If new tier unlocked, prompt ability selection |

### F8: Character Persistence

| Requirement | Detail |
|------------|--------|
| Auto-save | Debounced save to Supabase on any change (500ms) |
| Manual save | Explicit save button as backup |
| Load on open | Fetch full character data + abilities + inventory + seals |
| Conflict handling | Last-write-wins (single user, no conflicts expected) |

---

## UI/UX Requirements

| Requirement | Detail |
|------------|--------|
| Tablet-first | Landscape orientation, 1024×768 minimum |
| Touch targets | All interactive elements minimum 44×44px |
| Dark theme | Fantasy/RPG aesthetic (Diablo-inspired per reference images) |
| Stat bars | Visual bars with numeric values, color-coded |
| Responsive stat updates | Derived stats animate/transition when base stats change |
| Scroll behavior | Smooth scrolling, section headers sticky |
| Font size | Large enough for GM to read across a table (16px minimum body) |

---

## Component Breakdown

| Component | Props | State |
|-----------|-------|-------|
| `StatBlock` | stat name, base, bonus, gear, total | — |
| `StatAllocator` | stats, unspent points, onChange | Local allocation draft |
| `ResourceBar` | type, current, max, color | — |
| `AbilityList` | abilities[] | — |
| `AbilityPicker` | profession, level, already_known[] | Selected ability |
| `InventoryPanel` | items[], onAdd, onRemove, onEquip | — |
| `SealTracker` | seals{}, onChange | — |
| `CraftingModal` | seals{}, recipes[], onCraft | Selected recipe |
| `CharacterSummary` | character (full) | — |
| `LevelUpModal` | character, config | Allocation choices |
