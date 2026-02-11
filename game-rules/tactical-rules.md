# ⚔️ LEGO QUEST — Tactical Grid Rules

*Grid-based combat system for the 10×10 LEGO battle board. Inspired by Final Fantasy Tactics.*

---

## 1. The Battle Grid

The LEGO QUEST battle board is a **10×10 grid** (100 spaces). Each space = 1 LEGO stud.

- All combat takes place on this grid
- Minifigures occupy **1 space** each
- Diagonal movement counts as **1 space** (keep it simple)
- You **can** move through ally spaces (but can't stop on them)
- You **cannot** move through enemy spaces
- You **cannot** end your turn on the same space as any other creature

---

## 2. Movement

Every hero and monster has a **Move (MOV)** stat — the number of spaces they can move per turn.

### Hero Movement by Profession

| Profession | MOV | Notes |
|-----------|-----|-------|
| **Knight** | 3 | Heavy armor, slow but tough. Holds the line. |
| **Ranger** | 5 | Fast and mobile. Reposition freely. |
| **Wizard** | 3 | Stays back, relies on range. |
| **Healer** | 4 | Needs to reach wounded allies. |
| **Rogue** | 5 | Quick. Gets behind enemies. |
| **Inventor** | 3 | Deploys gadgets, doesn't need to rush. |

### Movement Rules

- **Each turn:** 1 Move + 1 Action (unchanged from core rules)
- Move = up to your MOV stat in spaces (horizontal, vertical, or diagonal)
- You may move **before or after** your action, but not split (all move, then act, or act, then move)
- **Dash Action:** Skip your action to move again (double movement for the turn)
- **Stand Up:** If knocked prone, costs 2 MOV to stand. Remaining MOV is available.

### Movement Modifiers

| Source | Effect |
|--------|--------|
| Slowed (status) | MOV halved (round down, minimum 1) |
| Haste spell | +3 MOV for the turn |
| Heavy gear | −1 MOV (GM discretion for oversized items) |
| Mounted | MOV becomes mount's MOV (typically 6–8) |

---

## 3. Attack Range

Every attack — melee, ranged, or spell — has an explicit **range** measured in grid spaces.

### Range Categories

| Category | Range (spaces) | Description |
|----------|---------------|-------------|
| **Melee** | 1 | Adjacent spaces only (including diagonal) |
| **Reach** | 2 | Can hit 2 spaces away (polearms, long tails) |
| **Short** | 3–4 | Close ranged attacks |
| **Medium** | 5–6 | Standard ranged attacks |
| **Long** | 7–8 | Sniping, artillery |
| **Extreme** | 9–10 | Full board range — rare and powerful |

### Default Attack Ranges by Profession

| Profession | Basic Attack | Range | Type |
|-----------|-------------|-------|------|
| **Knight** | Sword / Axe | 1 (Melee) | STR-based |
| **Ranger** | Bow | 6 (Medium) | SPD-based |
| **Wizard** | Staff (melee) | 1 (Melee) | STR-based |
| **Wizard** | Cantrip (ranged) | 5 (Medium) | SMT-based |
| **Healer** | Mace | 1 (Melee) | STR-based |
| **Healer** | Prayer (ranged) | 4 (Short) | SMT-based |
| **Rogue** | Dagger (melee) | 1 (Melee) | STR-based |
| **Rogue** | Throwing knife | 4 (Short) | SPD-based |
| **Inventor** | Wrench | 1 (Melee) | STR-based |
| **Inventor** | Boom Box (ranged) | 4 (Short) | SMT-based |

> **Ranged in melee penalty:** If you make a ranged attack while an enemy is adjacent (1 space), you roll at **−3**. Step back first!

---

## 4. Area of Effect (AoE)

Spells and abilities can hit areas, not just single targets. AoE is measured from a **target point** on the grid.

### AoE Shapes

| Shape | How It Works | Example |
|-------|-------------|---------|
| **Single** | One target | Spark, Mend |
| **Radius X** | All spaces within X of a target point | Fireball (Radius 2) = 13 spaces |
| **Line X** | Straight line X spaces long from caster | Lightning Bolt (Line 6) |
| **Cone X** | Triangle spreading X spaces from caster | Fire Breath (Cone 3) |
| **Cross X** | Plus-shape extending X from center | Earthquake Stomp (Cross 2) |
| **Ring X** | Only the edge of a Radius X (donut shape) | Shockwave (Ring 3) |
| **Aura X** | Centered on caster, moves with them | Battle Banner (Aura 3) |

### AoE Reference (Spaces Hit)

| Radius | Approx. Spaces | Grid Visual |
|--------|----------------|-------------|
| 1 | 9 (3×3 area) | Small burst |
| 2 | 13 (diamond) | Medium explosion |
| 3 | 25 (5×5 area) | Large blast |
| 4 | 37 | Huge detonation |
| 5 | 49 (7×7 area) | Half the board! |

> **Friendly fire rule:** AoE spells hit **everyone** in the area — allies included! Place carefully. Exception: spells that say "allies only" or "enemies only."

---

## 5. Flanking & Teamwork

Positioning matters. Working together to surround enemies gives tactical advantages.

### Flanking Bonus

**Flanking** occurs when **two allies** are on **opposite sides** of the same enemy.

```
 . A .      A = Ally
 . E .      E = Enemy  
 . A .      These two allies are flanking!
```

Opposite sides means: directly across (up/down, left/right, or diagonal-to-diagonal). If two allies are each adjacent to the same enemy and roughly opposite each other, that's a flank.

**Flanking bonus: +2 to attack rolls** against the flanked enemy for both flanking allies.

### Teamwork Combo: Pincer Strike

When flanking, either ally can call a **Pincer Strike** as their action:

- Both flanking allies attack the enemy simultaneously
- Both get the +2 flanking bonus
- If **both attacks hit**, deal an extra **+3 bonus damage** (total, not each)
- The second ally uses their **reaction** (they lose their next action but not their move)

*Kid-friendly explanation: "If your buddy is on the other side, you can team up! Both of you swing at the same time and if you both hit, BONUS DAMAGE!"*

### Surrounding Bonus

If an enemy has **3 or more** heroes/allies adjacent to it:

- All adjacent allies get **+3 to attack rolls** (replaces flanking bonus, doesn't stack)
- The surrounded enemy gets **−2 to all attack rolls** (overwhelmed)

### Help Action (Updated for Grid)

The **Help** action now requires you to be **adjacent** (1 space) to the ally you're helping:

- Move next to your friend → use your action to Help
- That ally gets +3 on their next roll (unchanged)
- You **must be adjacent** when you use the action

### Opportunity Attacks

When an enemy **moves out of your melee range** (leaves a space adjacent to you), you get a **free attack** against them. This is called an **Opportunity Attack**.

- You get **1 opportunity attack per round** (resets at start of your turn)
- It's a normal melee attack roll
- Doesn't cost your action
- **Disengage Action:** A creature can use its action to move without triggering opportunity attacks

*Kid-friendly: "If a bad guy tries to run away from you, you get a free whack! But only one per round."*

---

## 6. Positioning Tactics

### High Ground (Optional — Introduce Later)

Not in effect for initial play. Reserved for future terrain expansion.

### Cover

Not in effect for initial flat-grid play. Reserved for future terrain expansion.

### Starting Positions

At the start of each encounter, the GM sets up the battle board:

- **Heroes deploy** in the first 2 rows (rows 1–2) on one side of the grid
- **Enemies deploy** based on the encounter setup (typically rows 7–10)
- **Special encounters** may have enemies on multiple sides (ambush!)

### Common Formations

Teach the kids these basic tactics:

| Formation | Setup | When To Use |
|-----------|-------|-------------|
| **Shield Wall** | Knight in front, ranged behind | Default — protect squishies |
| **Pincer** | Split party to both sides | Flank the boss |
| **Diamond** | Tank front, healer middle, DPS sides | Boss fights |
| **Scatter** | Spread out across the grid | vs. AoE-heavy enemies |

---

## 7. Quick Reference — Combat Turn on the Grid

```
YOUR TURN:
1. Check status effects (beginning of turn)
2. MOVE — Up to your MOV in spaces
3. ACTION — Attack, Cast Spell, Use Item, Defend, Help, Dash, or Disengage
   (Move and Action can be in either order, but not split)
4. FREE — Talk, drop an item, call out a warning

REACTIONS (off-turn):
- Opportunity Attack: When enemy leaves your melee range (1/round)
- Reaction spells: Some spells say "React:" (e.g., Reflect, Vanish, Counterspell)
```

---

## 8. Grid Combat Summary Card (Print This!)

```
GRID: 10×10 spaces. 1 space = 1 stud.
DIAGONAL: Counts as 1 space.
MOVE THROUGH: Allies yes, enemies no.

HERO MOVEMENT:
  Knight: 3 | Ranger: 5 | Wizard: 3
  Healer: 4 | Rogue: 5  | Inventor: 3

RANGE CATEGORIES:
  Melee: 1 | Reach: 2 | Short: 3-4
  Medium: 5-6 | Long: 7-8 | Extreme: 9-10

FLANKING: 2 allies opposite an enemy = +2 attack
SURROUNDING: 3+ allies adjacent = +3 attack, enemy -2 attack
PINCER STRIKE: Both flankers hit = +3 bonus damage

RANGED IN MELEE: -3 to ranged attacks if enemy is adjacent
OPPORTUNITY ATTACK: Free melee attack when enemy leaves your reach (1/round)
DISENGAGE: Use action to move without triggering opportunity attacks
DASH: Use action to move again (double movement)
```
