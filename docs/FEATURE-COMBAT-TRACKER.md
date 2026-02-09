# ⚔️ FEATURE — Combat Tracker

---

## Overview

The main gameplay screen. Displays all combatants (2 heroes + up to 8 enemies), tracks HP, resources, status effects, initiative order, and resolves actions via Claude AI voice input. This is what's running on the iPad during every combat encounter.

---

## Screen Layout

### Main Combat View (`/combat`)

Landscape tablet layout, all information visible without scrolling during active combat.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚔ COMBAT — Forest Path Ambush     Round 2    [⏸ Pause] [🏁 End]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─── INITIATIVE BAR ──────────────────────────────────────────┐   │
│  │  ▶[Hero1:18] [Goblin2:15] [Hero2:14] [Goblin1:12] [Rat:8] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─── HEROES ──────────────┐  ┌─── ENEMIES ───────────────────┐   │
│  │                         │  │                                │   │
│  │  ┌─── HERO 1 ────────┐ │  │  ┌─ GOBLIN SCOUT 1 ─┐ ┌─ GOB │   │
│  │  │ [Avatar]           │ │  │  │ [Avatar]          │ │ [Ava │   │
│  │  │ Sir Bricksworth    │ │  │  │ HP ████░░ 4/6     │ │ HP █ │   │
│  │  │ Knight Lv3         │ │  │  │ STR 2 AGI 4      │ │ STR  │   │
│  │  │                    │ │  │  │ 🔴 Stunned (1)    │ │      │   │
│  │  │ HP ████████░░ 12/15│ │  │  └───────────────────┘ └───── │   │
│  │  │ Rage ██████░░ 55/100│ │  │                                │   │
│  │  │                    │ │  │  ┌─ GIANT RAT ───────┐ ┌─ GOB │   │
│  │  │ STR 5  AGI 3      │ │  │  │ [Avatar]          │ │ [Ava │   │
│  │  │ CON 5  MNA 3      │ │  │  │ HP ██░░░░ 1/3     │ │ HP █ │   │
│  │  │ INT 3  LCK 3      │ │  │  │ AGI 5 STR 2      │ │ STR  │   │
│  │  │                    │ │  │  │ 🟣 Poisoned (2)   │ │      │   │
│  │  │ 🟢 War Shout +1   │ │  │  └───────────────────┘ └───── │   │
│  │  │ 🔵 Iron Stance     │ │  │                                │   │
│  │  └────────────────────┘ │  │  (scrollable if >4 enemies)    │   │
│  │                         │  │                                │   │
│  │  ┌─── HERO 2 ────────┐ │  └────────────────────────────────┘   │
│  │  │ [Avatar]           │ │                                       │
│  │  │ Sparkle            │ │  ┌─── ACTION LOG ─────────────────┐   │
│  │  │ Wizard Lv3         │ │  │                                │   │
│  │  │                    │ │  │  Round 2, Turn 1 — Sir Bricks  │   │
│  │  │ HP ██████░░░ 6/9   │ │  │  ⚔ Shield Slam → Goblin 1     │   │
│  │  │ Mana ████░░░ 40/75 │ │  │  Roll: 14 vs 10 — HIT!        │   │
│  │  │                    │ │  │  3 damage + Stunned 1 turn     │   │
│  │  │ STR 3  AGI 3      │ │  │  "The knight's shield CRASHES  │   │
│  │  │ CON 3  MNA 5      │ │  │   into the goblin..."          │   │
│  │  │ INT 4  LCK 3      │ │  │                                │   │
│  │  │                    │ │  │  Round 1, Turn 4 — Goblin 2    │   │
│  │  │ 🟡 Magic Shield +3│ │  │  🏹 Arrow → Sparkle            │   │
│  │  └────────────────────┘ │  │  Roll: 11 vs 11 — HIT!        │   │
│  │                         │  │  2 damage                      │   │
│  └─────────────────────────┘  │  "An arrow whistles through..." │   │
│                               │                                │   │
│                               └────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─── VOICE INPUT ──────────────────────────────────────────────┐  │
│  │  [🎤 Tap to Speak]  "Hero 1 uses Shield Slam on Goblin 2,   │  │
│  │                      rolled 14"                               │  │
│  │                                                               │  │
│  │  [📝 Type Instead]   [⏭ Next Turn]   [🎲 Roll Loot]         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Encounter Setup (`/combat/setup`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔ NEW ENCOUNTER                                    [Start →]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HEROES (auto-loaded from campaign)                             │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ ✅ Hero 1         │  │ ✅ Hero 2         │                    │
│  │ Sir Bricksworth   │  │ Sparkle           │                    │
│  │ Knight Lv3        │  │ Wizard Lv3        │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                 │
│  ENEMIES — Monster Library                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Search: [___________]  Level: [1▾]  Boss: [☐]             │ │
│  │                                                            │ │
│  │  Goblin Scout (Lv1)     [+ Add]  ×2 added                │ │
│  │  Skeleton (Lv1)         [+ Add]                           │ │
│  │  Giant Rat (Lv1)        [+ Add]  ×1 added                │ │
│  │  Slime (Lv1)            [+ Add]                           │ │
│  │  Bandit (Lv1)           [+ Add]                           │ │
│  │  Goblin King (Lv1 Boss) [+ Add]                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ENCOUNTER (3 enemies)                          [Encounter Name]│
│  ┌──────────────┐┌──────────────┐┌──────────────┐              │
│  │ Goblin Scout │ │ Goblin Scout ││ Giant Rat    │              │
│  │ HP 6  Dmg 2  │ │ HP 6  Dmg 2  ││ HP 3  Dmg 2 │              │
│  │ [✏ Edit] [✕] │ │ [✏ Edit] [✕] ││ [✏ Edit] [✕]│              │
│  └──────────────┘└──────────────┘└──────────────┘              │
│                                                                 │
│  ENCOUNTER NAME: [Forest Path Ambush          ]                 │
│  [🎲 Roll Initiative & Start Combat]                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Functional Requirements

### F1: Encounter Setup

| Requirement | Detail |
|------------|--------|
| Auto-load heroes | Campaign heroes pre-selected with current stats |
| Monster library | Searchable/filterable list from Supabase `monsters` table |
| Add multiples | Can add same monster type multiple times (auto-numbered: "Goblin Scout 1", "Goblin Scout 2") |
| Up to 8 enemies | Hard cap, UI scrolls if >4 |
| Edit instance | Can tweak individual enemy stats before combat starts |
| Name encounter | Optional encounter name for logging |
| Roll initiative | d20 + AGI bonus for each combatant, auto-sorted |

### F2: Initiative Tracking

| Requirement | Detail |
|------------|--------|
| Visual order bar | Horizontal strip showing all combatants in turn order |
| Current turn highlight | Active combatant glowing/highlighted |
| Skip turn | If combatant is stunned or knocked out, auto-skip with visual indicator |
| Manual reorder | Drag to adjust (for ties or GM override) |
| Round counter | Increment round after all combatants have acted |
| Next turn button | Advance to next combatant, trigger start-of-turn effects |

### F3: Hero Cards

| Requirement | Detail |
|------------|--------|
| Full stat display | All 6 stats with bonuses |
| HP bar | Color-coded: green (>50%), yellow (25-50%), red (<25%) |
| Resource bar | Rage (red), Energy (yellow), Mana (blue) with numeric value |
| Status effects | Row of icons below stats with remaining duration |
| Abilities list | Quick reference of known abilities with costs |
| Knocked out state | Grayed out with "KO" overlay when HP reaches 0 |
| Avatar | Lego minifig photo or placeholder icon |

### F4: Enemy Cards

| Requirement | Detail |
|------------|--------|
| Compact layout | Smaller than hero cards, fits 4 per row |
| Key stats only | HP bar, STR, AGI, damage, name |
| Status effects | Icons with duration |
| Defeated state | X overlay or fade out when HP reaches 0 |
| Boss indicator | Crown or star icon, larger card size |
| Tap to expand | Show full stats in a popup/modal |

### F5: Voice Input → Claude Resolution

| Requirement | Detail |
|------------|--------|
| Mic button | Large, prominent, single-tap to start recording |
| Visual feedback | Pulsing animation while listening, waveform display |
| Transcript preview | Show recognized text before sending to Claude |
| Send to Claude | Full combat state + transcript + game rules → Claude API |
| Parse response | Extract: hit/miss, damage, effects, resource cost, narration |
| Apply to state | Update all affected combatants in Zustand store |
| Display narration | Show in action log with cinematic formatting |
| Error handling | If speech unclear, show transcript and ask GM to confirm/edit |
| Fallback | Text input field always available as alternative |

### F6: Manual Action Entry

For when voice isn't practical or for quick adjustments:

| Requirement | Detail |
|------------|--------|
| Quick damage | Tap enemy card → enter damage number → apply |
| Quick heal | Tap hero card → enter heal number → apply |
| Apply effect | Tap combatant → select effect from list → set duration |
| Remove effect | Tap effect icon → remove |
| Adjust resource | Tap resource bar → enter new value |
| Adjust HP | Tap HP bar → enter new value |

### F7: Status Effect System

| Requirement | Detail |
|------------|--------|
| Apply effects | Via Claude response or manual application |
| Duration tracking | Decrements at start of affected combatant's turn |
| Auto-removal | Removed when duration hits 0 |
| Visual indicators | Colored icons with turn count badge |
| Effect categories | Buffs (green border), debuffs (red), CC (purple), DoT (orange), HoT (teal) |
| Stacking rules | Non-stackable effects refresh duration; stackable ones add |
| Start-of-turn processing | When turn advances: tick DoTs/HoTs, decrement durations, remove expired |
| Effect tooltips | Tap icon to see full effect description |

### F8: Resource Tracking

| Requirement | Detail |
|------------|--------|
| Per-turn regen | Auto-add +20 Energy/Mana at start of combatant's turn |
| Rage generation | Add Rage when: hit taken (+15), melee hit landed (+10), crit taken (+25), ally KO (+20) |
| Cost deduction | Subtract ability cost when ability is used |
| Insufficient resource | Prevent ability use if not enough resource, show warning |
| Visual bar | Animated fill/drain with numeric label |

### F9: Combat Resolution (Claude AI)

| Requirement | Detail |
|------------|--------|
| Hit calculation | Claude checks: d20 roll + attacker bonus vs defense target |
| Damage calculation | Based on ability/attack, apply to target HP |
| Effect application | Apply any status effects from the ability |
| Multi-target | Handle AoE abilities affecting multiple combatants |
| Critical hits | Detect based on roll vs crit range, apply double damage + narration |
| Critical misses | Nat 1 → funny narration, no damage |
| Defend action | Note +4 defense bonus active |
| Help friend | Note +3 bonus to specified ally |
| Item use | Apply item effect (potion heal, bomb damage, etc.) |
| KO handling | At 0 HP, mark as knocked out, don't remove from combat |
| Revive | Allow revive action (ally action for 1 HP, or ability/potion) |

### F10: Action Log

| Requirement | Detail |
|------------|--------|
| Chronological feed | Most recent action at top |
| Rich formatting | Bold ability names, color-coded damage/healing, effect icons |
| Claude narration | Italicized cinematic text from Claude |
| Roll details | Show: roll value, target number, hit/miss |
| Collapsible entries | Tap to expand full details for any action |
| Session persistence | Log saved to Supabase `combat_logs` table |

### F11: Loot Roller

| Requirement | Detail |
|------------|--------|
| Post-encounter trigger | Button appears when all enemies defeated |
| Per-enemy loot | Roll d20 + LCK bonus per dead enemy |
| Loot table lookup | Use level-appropriate table from game_config |
| Visual roll | Show dice animation, result, loot description |
| Auto-apply | Add loot to character inventory/seals in Supabase |
| Boss loot | Use boss loot table, bigger visual fanfare |

### F12: End of Combat

| Requirement | Detail |
|------------|--------|
| End Combat button | GM clicks "End Combat" to transition to Rewards phase (F13) before final victory |
| Victory screen | Show after rewards are applied (all enemies at 0 HP) |
| Summary | Total damage dealt, abilities used, turns taken |
| XP calculation | Handled by Rewards phase (F13); based on monsters defeated |
| Loot roller integration | Roll loot for each enemy |
| Save state | Persist final HP/resource state back to characters |
| Combat log | Full combat saved to Supabase for session history |
| Return to characters | Update character sheets with new HP, resources, loot, XP |

### F13: Post-Battle Rewards

Triggered when the GM clicks "End Combat". The combat enters the `rewards` status and displays the rewards screen before transitioning to `completed`.

#### Rewards Screen Layout

| Requirement | Detail |
|------------|--------|
| Entry point | GM clicks "End Combat" button, combat status transitions to `rewards` via `enterRewardsPhase()` |
| Screen layout | 12-column grid: left panel (XP summary + item catalog), right panel (hero reward cards) |
| Header | Shows VICTORY or DEFEAT banner with encounter name |

#### XP Summary (Left Panel)

| Requirement | Detail |
|------------|--------|
| Enemies defeated list | Each defeated enemy shown with name, boss indicator, and individual XP reward |
| Enemies survived list | Enemies still alive listed separately with 0 XP |
| Total XP | Sum of all defeated enemy XP rewards |
| XP per hero | Total XP split evenly across hero count (displayed as "X XP each") |

#### Hero Reward Cards (Right Panel)

| Requirement | Detail |
|------------|--------|
| One card per hero | Displays hero name, current level, and level-up indicator if XP threshold crossed |
| XP progress bar | Shows current XP, XP earned, new total, and progress toward next level threshold |
| Level-up preview | If hero crosses XP threshold, shows "Level X → Level Y!" with pulsing LEVEL UP badge |
| Gold input | Numeric input field showing current gold; GM enters gold to award per hero |
| Gold preview | Shows projected total (current + awarded) when gold value entered |
| Assigned items | List of items assigned to this hero with remove button for each |
| Active selection | Clicking a hero card selects it as target for item catalog additions |

#### Item Catalog (Left Panel)

| Requirement | Detail |
|------------|--------|
| Searchable list | Text search filters items from `item_catalog` Supabase table by name |
| Type filter | Filter buttons for: All, Weapon, Armor, Consumable, Misc |
| Item display | Shows item name, rarity (color-coded: common/green, uncommon/blue, rare/yellow, epic/purple, legendary/red), and description |
| Add to hero | Clicking a catalog item adds it to the currently selected hero |
| Custom item entry | Text input + type dropdown + "Add" button for items not in the catalog |
| Custom item types | Weapon, Armor, Consumable, Quest, Misc |

#### Apply Rewards

| Requirement | Detail |
|------------|--------|
| "Apply Rewards" button | Single button to persist all rewards; disabled after application |
| XP persistence | Calls `incrementXp()` for each hero with earned XP |
| Level-up detection | `checkLevelUp()` compares new XP against level thresholds; updates level, rank, and grants unspent stat points |
| Gold persistence | Calls `updateCharacter()` to add awarded gold to current balance |
| Item persistence | Calls `addInventoryItem()` for each assigned item (name, type, quantity, effect JSON) |
| Rewards history | Calls `saveCombatRewards()` to persist full `BattleRewardsSummary` with allocations per hero |
| Button states | Default: gold "Apply Rewards" / During: disabled "Applying..." / After: green "Rewards Applied!" |

#### Level-Up Celebration

| Requirement | Detail |
|------------|--------|
| Trigger | Shown after rewards are applied if any hero leveled up |
| Full-screen overlay | Fixed overlay with dark backdrop (80% opacity) and gold particle effects |
| Hero cards | Each leveled hero shown with: name, level transition (X → Y), new rank title, stat/skill point gains |
| Auto-dismiss | Overlay auto-dismisses after 5 seconds |
| Click to dismiss | Clicking anywhere dismisses immediately |
| Transition | After celebration completes (or is dismissed), calls `endCombat()` to transition to `completed` |

#### Types

```typescript
interface RewardItem {
  itemName: string;
  itemType: ItemType;          // 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc'
  quantity: number;
  effectJson?: Record<string, unknown> | null;
}

interface RewardAllocation {
  characterId: string;
  heroName: string;
  xpEarned: number;
  goldEarned: number;
  items: RewardItem[];
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
}

interface BattleRewardsSummary {
  encounterName: string;
  enemiesDefeated: { name: string; xpReward: number; isBoss: boolean }[];
  enemiesSurvived: { name: string }[];
  totalXp: number;
  xpPerHero: number;
  heroCount: number;
  allocations: RewardAllocation[];
}
```

---

## State Management (Zustand Store)

### `combat-store.ts`

```typescript
interface CombatState {
  // Combat metadata
  combatId: string;
  encounterName: string;
  status: 'setup' | 'active' | 'rewards' | 'completed' | 'abandoned';
  roundNumber: number;

  // Participants
  participants: CombatParticipant[];
  initiativeOrder: string[];  // participant IDs in order
  currentTurnIndex: number;

  // Actions
  actionLog: ActionLogEntry[];

  // Methods
  rollInitiative: () => void;
  advanceTurn: () => void;
  applyAction: (action: ResolvedAction) => void;
  applyDamage: (targetId: string, amount: number) => void;
  applyHealing: (targetId: string, amount: number) => void;
  applyEffect: (targetId: string, effect: StatusEffect) => void;
  removeEffect: (targetId: string, effectId: string) => void;
  tickEffects: (participantId: string) => void;
  regenResource: (participantId: string) => void;
  setResource: (participantId: string, amount: number) => void;
  enterRewardsPhase: () => void;
  endCombat: () => void;
}

interface CombatParticipant {
  id: string;
  displayName: string;
  team: 'hero' | 'enemy';

  // Source reference
  characterId?: string;  // if hero
  monsterId?: string;    // if enemy

  // Stats (snapshot)
  stats: {
    con: number; str: number; agi: number;
    mna: number; int: number; lck: number;
  };

  // Combat state
  maxHp: number;
  currentHp: number;
  resourceType?: 'rage' | 'energy' | 'mana';
  maxResource?: number;
  currentResource: number;
  initiativeRoll: number;
  isActive: boolean;  // false = KO
  isDefending: boolean;

  // Effects
  statusEffects: ActiveStatusEffect[];

  // Display
  avatarUrl?: string;
  isBoss: boolean;
}

interface ActiveStatusEffect {
  id: string;
  effectType: string;
  category: 'buff' | 'debuff' | 'cc' | 'dot' | 'hot';
  remainingTurns: number | null;  // null = until removed
  value: Record<string, any>;
  iconName: string;
  displayName: string;
  sourceParticipantId?: string;
}

interface ActionLogEntry {
  id: string;
  timestamp: Date;
  roundNumber: number;
  actorId: string;
  actorName: string;
  actionType: string;
  abilityName?: string;
  targets: { id: string; name: string }[];
  roll?: number;
  targetNumber?: number;
  success?: boolean;
  damage?: number;
  healing?: number;
  effectsApplied?: string[];
  resourceSpent?: number;
  narration?: string;
  voiceTranscript?: string;
}
```

---

## Turn Flow (State Machine)

```
START_OF_TURN
    │
    ├── Tick DoT effects (apply damage)
    ├── Tick HoT effects (apply healing)
    ├── Decrement all effect durations
    ├── Remove expired effects
    ├── Regen resource (Energy: +20, Mana: +20, Rage: no passive)
    │
    ▼
AWAITING_ACTION
    │
    ├── Voice input → Claude resolution → Apply
    ├── Manual action entry → Apply
    ├── Defend (set isDefending flag)
    ├── Help Friend (grant +3 to ally)
    │
    ▼
ACTION_RESOLVED
    │
    ├── Update HP/resource bars
    ├── Apply status effects
    ├── Add to action log
    ├── Check for KOs
    ├── Check for victory (all enemies at 0 HP)
    │       └── If GM clicks "End Combat" → REWARDS
    │
    ▼
END_OF_TURN
    │
    ├── Clear isDefending from previous turn
    ├── Advance to next combatant
    ├── If wrapped around → increment round
    │
    ▼
START_OF_TURN (next combatant)
    ...
    ▼
REWARDS
    │
    ├── Display XP summary (defeated enemies + XP per hero)
    ├── GM assigns gold and items per hero
    ├── GM clicks "Apply Rewards"
    ├── Persist XP, gold, items, level-ups to Supabase
    ├── If any hero leveled up → show Level-Up Celebration
    │
    ▼
COMPLETED
```

---

## UI/UX Requirements

| Requirement | Detail |
|------------|--------|
| No scrolling during combat | All critical info visible in landscape tablet view |
| Touch-optimized | Large tap targets, swipe to dismiss popups |
| Damage animation | Red flash on damaged combatant, number popup |
| Heal animation | Green glow on healed combatant |
| Crit animation | Screen shake + gold flash + larger number |
| KO animation | Combatant card grays out, tilts slightly |
| Turn indicator | Current combatant card has glowing border |
| Effect icons | 24×24 minimum, color-coded by category |
| Sound effects | Optional: hit, crit, heal, KO, level-up sounds |
| Dark theme | Consistent with character sheet aesthetic |
