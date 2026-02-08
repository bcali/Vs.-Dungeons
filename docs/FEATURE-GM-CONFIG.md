# ⚙️ FEATURE — GM Config Dashboard

---

## Overview

A configuration panel where the GM can recalibrate the entire game system. Change base stats, stat points per level, resource pools, combat formulas, XP thresholds, loot tables — and have those changes cascade to character sheets and combat resolution automatically.

This is the "game designer" panel. All values stored in the `game_config` Supabase table.

---

## Screen Layout (`/config`)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙ GAME CONFIGURATION                [Reset Defaults] [Save]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Stats] [Resources] [Combat] [Leveling] [Loot] [Abilities]│
│  ━━━━━━                                                     │
│                                                             │
│  ┌─── STAT SYSTEM ──────────────────────────────────────┐   │
│  │                                                      │   │
│  │  Base Stat Value:     [3]  [-][+]                    │   │
│  │  Stat Cap:            [15] [-][+]                    │   │
│  │  Bonus Formula:       stat - [3]                     │   │
│  │                                                      │   │
│  │  Stats:                                              │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │ CON  Constitution  HP = CON × [3]            │    │   │
│  │  │ STR  Strength      Melee damage + defense    │    │   │
│  │  │ AGI  Agility       Ranged + initiative       │    │   │
│  │  │ MNA  Mana          Pool = MNA × [15]         │    │   │
│  │  │ INT  Intelligence  Crafting + puzzles         │    │   │
│  │  │ LCK  Luck          Crits + loot              │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  HP Multiplier:       CON × [3]                      │   │
│  │  Mana Pool Formula:   MNA × [15]                     │   │
│  │  Base Movement:       [6] studs                      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─── STAT POINTS PER LEVEL ────────────────────────────┐   │
│  │                                                      │   │
│  │  Lvl 1:  [1]    Lvl 6:  [1]    Lvl 11: [1]         │   │
│  │  Lvl 2:  [1]    Lvl 7:  [1]    Lvl 12: [2]         │   │
│  │  Lvl 3:  [1]    Lvl 8:  [2]    Lvl 13: [1]         │   │
│  │  Lvl 4:  [1]    Lvl 9:  [1]    Lvl 14: [1]         │   │
│  │  Lvl 5:  [2]    Lvl 10: [2]    Lvl 15: [2]         │   │
│  │                                                      │   │
│  │  Lvl 16: [1]  Lvl 17: [1]  Lvl 18: [2]             │   │
│  │  Lvl 19: [1]  Lvl 20: [3]                           │   │
│  │                                                      │   │
│  │  Total points by Lv20: [25]  (auto-calculated)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Config Sections

### Tab 1: Stats
- Base stat value (default: 3)
- Stat cap (default: 15)
- Bonus formula base (default: 3, so bonus = stat - 3)
- HP multiplier (default: 3, so HP = CON × 3)
- Mana pool multiplier (default: 15, so pool = MNA × 15)
- Energy max (default: 100)
- Rage max (default: 100)
- Base movement (default: 6 studs)
- Stat points per level (editable array of 20 values)

### Tab 2: Resources
- Mana regen per turn (default: 20)
- Energy regen per turn (default: 20)
- Rage on hit taken (default: 15)
- Rage on melee hit landed (default: 10)
- Rage on crit taken (default: 25)
- Rage on ally KO (default: 20)
- Short rest restore amount (default: 30)

### Tab 3: Combat
- Melee defense formula: target_STR + [8]
- Ranged defense formula: target_AGI + [8]
- Defend action bonus (default: +4)
- Help friend bonus (default: +3)
- Luck crit thresholds: LCK [5]→19, LCK [8]→18, LCK [12]→17
- Lucky saves per session (default: 1)
- Difficulty targets: Easy [8], Medium [12], Hard [16], Epic [20]

### Tab 4: Leveling
- XP thresholds per level (editable array of 20 values)
- XP awards table (editable: monster, boss, quest, puzzle, creative, help, explore, session)

### Tab 5: Loot
- Loot tables by level range (editable d20 ranges and rewards)
- Crafting recipes (view/edit existing recipes)

### Tab 6: Abilities
- Ability cost ranges by tier (editable)
- View/edit ability library (links to Supabase ability records)

---

## Functional Requirements

| Requirement | Detail |
|------------|--------|
| Load config | Fetch single game_config row on page load |
| Edit any value | Inline editing with immediate visual feedback |
| Preview impact | Show derived stat examples: "A CON 5 hero would have 15 HP" |
| Save | Single save button persists all changes to Supabase |
| Reset defaults | Restore all values to system defaults |
| Validation | Prevent impossible values (negative stats, 0 HP multiplier, etc.) |
| Cascade updates | When config changes, character sheets recalculate on next load |
| Export config | Download config as JSON for backup |
| Import config | Upload JSON to restore a config |

---

## Impact Cascade

When config values change, these recalculate:

| Config Change | What Recalculates |
|--------------|-------------------|
| HP multiplier | All characters' max HP |
| Mana multiplier | All mana users' max resource |
| Stat points per level | Available unspent points for each character |
| XP thresholds | Level-up eligibility for each character |
| Base stat value | All stat bonuses |
| Combat formulas | Target numbers in combat |
| Ability costs | Resource cost display on character sheets |
| Loot tables | Loot roll results in combat |

**Important:** Config changes don't retroactively adjust already-spent points or already-earned XP. They change the rules going forward. If needed, the GM can manually adjust characters.
