# 🌳 LEGO QUEST — Skill Trees

*WoW-classic inspired talent trees with Diablo-style action bar. Extends the existing spellbook system.*

---

## 1. System Overview

### What Are Skill Trees?

Every hero has a **talent tree** — a branching web of abilities and bonuses you unlock as you level up. Think of it like a skill menu in a video game. Each level, you get **1 skill point** to spend. Where you spend it shapes what kind of hero you become.

Two kids picking the same class (like Warrior) can end up playing completely differently based on where they put their points. One might be an unkillable tank hiding behind a shield. The other might be a raging berserker swinging a massive axe. Both are Warriors — but they *feel* totally different.

### Key Concepts

**Skill Points**
- Earn **1 skill point per level** (20 levels = 20 points total)
- Spend points in your class's talent tree
- Each point either unlocks a new skill or ranks up an existing one
- Unspent points carry over — you don't have to spend immediately

**Branches**
- Each class tree splits into **2–3 branches** representing different playstyles
- Warrior: Protection (tank) and Arms (damage)
- Rogue/Ranger: Shadow (stealth assassin), Precision (ranged sniper), Survival (traps + pets)
- You can spread points across branches or go deep into one

**Tiers**
- Each branch has **5 tiers** of increasingly powerful skills
- Higher tiers are **locked** until you spend enough points in that branch
- Going deep into one branch = powerful capstone abilities
- Spreading across branches = versatile but no capstones

**Skill Types**
- ⚔️ **Active** — Abilities you use in combat. Must be equipped to your action bar.
- 🛡️ **Passive** — Always-on bonuses. No slot needed. Once learned, always working.

**Ranks**
- Some skills have **1 rank** — spend 1 point, fully learned
- Some skills have **2–3 ranks** — each rank costs 1 point and makes it stronger
- Example: "Shield Mastery" Rank 1 = +1 defense, Rank 2 = +2 defense, Rank 3 = +3 defense

---

## 2. Tier Gating

To prevent kids from grabbing the strongest skills immediately, each tier requires a minimum number of points already spent **in that specific branch**.

| Tier | Points Required in Branch | Power Level | Fantasy |
|------|--------------------------|-------------|---------|
| **Tier 1** | 0 points | Fundamentals | "Learning the basics" |
| **Tier 2** | 3 points in branch | Intermediate | "Getting good at this" |
| **Tier 3** | 6 points in branch | Advanced | "Now we're cooking" |
| **Tier 4** | 10 points in branch | Expert | "This is my specialty" |
| **Tier 5** | 15 points in branch | Capstone | "I am the master" |

### What This Means in Practice

With only 20 total points across your whole career:

- **Deep specialist** (15+ points in one branch): Reaches Tier 5 capstone. Incredibly powerful in one area, but barely touches the other branch.
- **Balanced build** (10/10 split): Reaches Tier 4 in one branch and Tier 4 in the other. Very versatile, no capstones.
- **Focused with a dip** (13/7 split): Tier 4 in your main branch, Tier 3 in your secondary. Strong core with useful utility.
- **Triple spread** (Rogue only — 7/7/6): Tier 3 in two branches, Tier 3 in the third. Jack of all trades.

> **Design intent:** There is no wrong build. Every combination is viable. The choice is about *what kind of hero do you want to be* — not min-maxing.

---

## 3. The Action Bar (5 Slots)

Heroes have **5 action bar slots** for active abilities — like Diablo's skill bar.

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Slot 1  │ │ Slot 2  │ │ Slot 3  │ │ Slot 4  │ │ Slot 5  │
│ ⚔️      │ │ ⚔️      │ │ ⚔️      │ │ ⚔️      │ │ ⚔️      │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Action Bar Rules

- Only **active skills** (⚔️) go in slots — both tree skills AND spellbook abilities
- **Passive skills** (🛡️) are always active once learned. They never take a slot.
- You can **swap abilities freely** outside of combat (or during a rest)
- You can equip skills from **any branch** you've learned — mix and match
- Profession spells from the existing spellbook system also use these 5 slots
- **You don't need to fill all 5 slots.** A Level 2 hero might only have 1–2 active skills.

### How It Works at the Table

The GM (or the app) tracks which 5 skills are equipped. On their turn, the kid says what they want to do:

> "I use Shield Bash on the goblin!"
> "I use Backstab from stealth!"
> "I just do a normal attack."

Normal melee/ranged attacks are always available — they don't take a slot. The action bar is for *special* abilities.

---

## 4. Respec Rules

**Free respec, anytime.** Kids can reset their entire skill tree and redistribute all points from scratch.

- No gold cost
- No penalty
- Can do it between encounters, between sessions, or even mid-session during a rest
- This encourages experimentation — try the tank build, then switch to berserker next session

> **Why free respec?** These are 7–10 year olds. Locking them into a bad build kills fun. The joy is in *trying builds*, not being punished for choices. As they get older and want more stakes, you can add a gold cost.

---

## 5. How Skill Trees Interact with Spellbook

The skill tree system **extends** the existing spellbook — it doesn't replace it.

| System | What It Provides | When It Unlocks |
|--------|-----------------|-----------------|
| **Spellbook** (existing) | Profession spells (Battle Cries, Techniques, Tricks, etc.) | At level milestones (2, 5, 8, 10, 12, 15, 20) |
| **Skill Tree** (new) | Talent tree skills + passives | 1 skill point per level, starting at Level 1 |

### How They Work Together

- A Level 5 Knight might have: **Shield Bash** (from tree) + **War Shout** (from spellbook) + **Rally Cry** (from spellbook) equipped on their action bar
- Spellbook abilities still cost **spell slots** as before
- Skill tree active abilities are **free to use** (no spell slot cost) unless noted — they're innate talents, not spells
- This means skill tree abilities are your "always available" toolkit, while spellbook spells are your limited-use power moves

### Resource Costs

| Source | Cost to Use |
|--------|------------|
| Skill tree active abilities | **Free** (usable every turn) unless the skill says "once per encounter" or has a cooldown |
| Spellbook spells | **Spell slots** (as per existing system) |
| Normal attack | **Free** (always available) |

> **Design note:** Making tree abilities free-to-use (with cooldowns/limits on the strong ones) means kids always have interesting choices on their turn, even when spell slots run dry.

---

## 6. Skill Entry Format

Every skill in the tree follows this format:

| Field | Meaning |
|-------|---------|
| **#** | Unique ID (e.g., P1, A7, S12) for database reference |
| **Skill Name** | What the kids call it |
| **Type** | ⚔️ Active (needs action bar slot) or 🛡️ Passive (always-on) |
| **Ranks** | 1, 2, or 3. Each rank costs 1 skill point |
| **Effect** | What it does. For multi-rank skills, listed as Rank 1 / Rank 2 / Rank 3 |
| **Lego Tie-in** | Physical piece connection where applicable (italicized) |

### Example Entry

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P1 | **Shield Mastery** | 🛡️ Passive | 3 | +1 / +2 / +3 defense when a shield is equipped. *Lego: Attach a shield piece for the bonus!* |

This means:
- Skill ID is P1 (Protection branch, skill #1)
- It's a passive — always on, no slot needed
- You can invest 1, 2, or 3 points into it
- At Rank 1 you get +1 defense, Rank 2 gives +2, Rank 3 gives +3
- It requires a physical Lego shield piece on the minifig

---

## 7. Classes & Branches

### Currently Available

| Class | Branch 1 | Branch 2 | Branch 3 | Core Skills |
|-------|----------|----------|----------|-------------|
| **Warrior** | 🛡️ Protection (Tank) | ⚔️ Arms (DPS) | — | ✅ |
| **Rogue/Ranger** | 🌑 Shadow (Assassin) | 🎯 Precision (Ranged) | 🌿 Survival (Traps/Pets) | ✅ |

### Future Classes (Trees TBD)

| Class | Potential Branches |
|-------|-------------------|
| **Wizard** | Elemental / Arcane / Summoner |
| **Healer** | Holy / Nature / Shadow |
| **Inventor** | Robotics / Explosives / Support |

---

## 8. Build Archetypes

These are example builds to show kids what's possible. They don't need to follow these — any combination works.

### Warrior Builds

| Build Name | Split | Fantasy | Key Skills |
|-----------|-------|---------|------------|
| **The Wall** | 15 Prot / 5 Arms | Unkillable shield tank | Shield Mastery, Bodyguard, Avatar of the Shield |
| **The Berserker** | 5 Prot / 15 Arms | Raging damage machine | Whirlwind, Critical Eye, Avatar of War |
| **The Captain** | 10 Prot / 10 Arms | Balanced leader | Rallying Presence, War Cry, Charge |
| **The Brawler** | 7 Prot / 13 Arms | Tough damage dealer | Thick Skin, Cleave, Execute |

### Rogue/Ranger Builds

| Build Name | Split | Fantasy | Key Skills |
|-----------|-------|---------|------------|
| **The Assassin** | 15 Shadow / 5 other | Stealth one-shot | Backstab, Vanish, Shadow Dance |
| **The Sniper** | 15 Precision / 5 other | Long-range crit machine | Aimed Shot, Eagle Eye, Killshot |
| **The Trapper** | 15 Survival / 5 other | Area denial + pet | Bear Trap, Wolf Companion, Stampede |
| **The Scout** | 7 Precision / 7 Survival / 6 Shadow | Mobile utility | Quick Shot, Camouflage, Tripwire |
| **The Shadow Archer** | 10 Shadow / 10 Precision | Stealth + ranged | Backstab, Aimed Shot, Shadow Step |

---

*Skill branch details follow in subsequent sections (Tasks 2–8).*

---

## 9. ⚔️ WARRIOR CLASS

*Warriors are masters of weapons, armor, and battlefield control. Two branches represent the classic tank vs. damage dealer choice.*

| Branch | Fantasy | Playstyle |
|--------|---------|-----------|
| **🛡️ Protection** | Shield wall, unbreakable defender | Tank: absorb damage, protect allies, control enemies |
| **⚔️ Arms** | Two-handed weapon master, devastating strikes | DPS: big hits, cleaves, charges, crits |

---

### 🛡️ PROTECTION BRANCH — "The Shield Wall"

*"You shall not pass!" Tank playstyle focused on damage reduction, threat, and protecting allies. The Protection Warrior is the kid who stands in front and says "hit ME instead." Every skill reinforces the fantasy of being an immovable fortress.*

---

#### Tier 1 — Fundamentals (0 points required)

*The basics of being tough. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P1 | **Shield Mastery** | 🛡️ Passive | 3 | +1 / +2 / +3 defense when a shield is equipped. *Lego: Attach a shield piece to your minifig for the bonus!* |
| P2 | **Shield Bash** | ⚔️ Active | 1 | Melee attack: deal STR damage + push enemy back 2 studs. If they hit a wall or another enemy, they're stunned for 1 turn. |
| P3 | **Toughened Hide** | 🛡️ Passive | 3 | +2 / +4 / +6 max HP permanently. |
| P4 | **Taunt** | ⚔️ Active | 1 | Force one enemy within 4 studs to attack only you for 2 turns. No roll needed — they HAVE to come for you. |
| P5 | **Battle Stance** | 🛡️ Passive | 2 | Reduce all incoming damage by 1 / 2 (minimum 1 damage). Requires a shield equipped. |

> **Tier 1 Total: 5 skills, 10 rank slots.**
> A kid spending their first 3 points here might grab Shield Mastery (1), Toughened Hide (1), and Shield Bash — already feeling tanky.

---

#### Tier 2 — Defender (3 points in Protection required)

*Now you're a real defender. You can block, counter, and throw your shield like a superhero.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P6 | **Iron Wall** | ⚔️ Active | 1 | Raise your shield: completely block the next 2 attacks against you. Uses your action for the turn. *Lego: Stand the minifig behind a Lego wall piece!* |
| P7 | **Revenge** | ⚔️ Active | 2 | React (free action): After being hit by a melee attack, your next attack deals +3 / +5 bonus damage. Must use before your next turn ends. |
| P8 | **Thick Skin** | 🛡️ Passive | 3 | +10% / +15% / +20% max HP (rounded up). Stacks with Toughened Hide. |
| P9 | **Shield Throw** | ⚔️ Active | 1 | Hurl your shield at an enemy within 6 studs: deal STR damage. It bounces to 1 adjacent enemy for half damage, then returns to you. *Captain America style!* |
| P10 | **Fortified** | 🛡️ Passive | 2 | Reduce damage from poison, fire, and traps by 2 / 4. |

> **Tier 2 Total: 5 skills, 9 rank slots.**
> Shield Throw is the "cool factor" skill — kids love the Captain America bounce.

---

#### Tier 3 — Guardian (6 points in Protection required)

*You're not just tough — you make your TEAM tough. Bodyguard and aura effects kick in here.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P11 | **Bodyguard** | ⚔️ Active | 1 | Choose an ally within 3 studs. For 3 turns, any attack targeting them hits you instead. You take half damage from redirected attacks. *The ultimate "I got you" move.* |
| P12 | **Shield Slam Combo** | ⚔️ Active | 2 | Upgraded Shield Bash: hits in a 2-stud cone. Deals STR +2 / STR +4 damage. Pushes all targets back 2 studs. |
| P13 | **Armored to the Teeth** | 🛡️ Passive | 3 | +1 / +2 / +3 to ALL defense rolls (stacks with Shield Mastery). *Lego: Each rank = add another armor piece to your minifig (helmet, chestplate, leg armor)!* |
| P14 | **Rallying Presence** | 🛡️ Passive | 2 | All allies within 4 studs get +1 / +2 to their defense rolls while you're standing. Aura — always active, no action needed. |
| P15 | **Counter Strike** | ⚔️ Active | 1 | React (free action): When an enemy misses a melee attack against you, immediately attack them for STR damage. |
| P16 | **Regeneration** | 🛡️ Passive | 3 | Heal 1 / 2 / 3 HP at the start of each of your turns. Doesn't work while knocked out. |

> **Tier 3 Total: 6 skills, 12 rank slots.**
> This tier is where Protection Warriors become party MVPs. Bodyguard + Rallying Presence makes the whole team safer.

---

#### Tier 4 — Warden (10 points in Protection required)

*Expert-level tanking. You lock down the battlefield and become nearly unkillable.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P17 | **Fortress** | ⚔️ Active | 1 | Plant yourself (can't move for 3 turns). Take half damage from ALL sources. Enemies within 3 studs deal -3 damage to everyone. *You ARE the wall.* |
| P18 | **Mass Taunt** | ⚔️ Active | 1 | ALL enemies within 5 studs must attack only you for 2 turns. No roll, no save — they're coming for you. Once per encounter. |
| P19 | **Living Shield** | 🛡️ Passive | 2 | When an ally within 3 studs would be knocked out, you take the killing blow instead. Triggers 1 / 2 times per encounter. |
| P20 | **Unbreakable Spirit** | 🛡️ Passive | 2 | When knocked to 0 HP, automatically revive with 5 / 10 HP. Once per encounter. |
| P21 | **Shield Fortress** | ⚔️ Active | 1 | Create a 4-stud-wide shield wall. Blocks ALL ranged attacks and movement for 3 turns. Allies behind it get +3 defense. *Lego: Build an actual wall of shield pieces on the board!* |

> **Tier 4 Total: 5 skills, 7 rank slots.**
> These are "hero moment" skills. Mass Taunt + Fortress is a legendary combo — tank everything while your teammate goes ham.

---

#### Tier 5 — Capstone (15 points in Protection required)

*The pinnacle. Only deep Protection specialists reach these. You are THE shield.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| P22 | **Avatar of the Shield** | ⚔️ Active | 1 | For 3 turns: immune to knockback, stun, and fear. All damage you take is halved. All allies within 6 studs share your damage reduction. You glow with golden light. Once per encounter. *THE ultimate tank moment.* |
| P23 | **Immortal Sentinel** | 🛡️ Passive | 1 | You cannot be knocked below 1 HP (you still take damage, you just don't go down). While at 1 HP, your melee damage is doubled — cornered animals fight hardest. Can still be healed normally. |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> These are the "I went all-in on Protection" rewards. Avatar of the Shield is the flashy moment. Immortal Sentinel is the quiet always-on that makes you legendary.

---

### 🛡️ Protection Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 10 | Shield basics, get tough |
| 2 — Defender | 5 | 9 | Block, counter, throw shield |
| 3 — Guardian | 6 | 12 | Protect allies, auras, regen |
| 4 — Warden | 5 | 7 | Battlefield control, unkillable |
| 5 — Capstone | 2 | 2 | God-mode tanking |
| **TOTAL** | **23** | **40** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 12 skills |
| 🛡️ Passive | 11 skills |

### Sample Protection Build (Level 10, 10 points)

A kid who goes 10 points deep into Protection might pick:

| Points | Skill | Why |
|--------|-------|-----|
| 3 | Shield Mastery (Rank 3) | Max defense with shield |
| 1 | Shield Bash | Bread-and-butter attack |
| 1 | Taunt | Force enemies to hit me |
| 1 | Revenge (Rank 1) | Free damage after being hit |
| 1 | Shield Throw | Ranged option + cool factor |
| 1 | Bodyguard | Protect my brother's character |
| 1 | Counter Strike | More free damage |
| 1 | Regeneration (Rank 1) | Passive healing |
| **10** | | **Tier 4 unlocked!** |

Their action bar: `[Shield Bash] [Taunt] [Shield Throw] [Bodyguard] [Counter Strike]`
Always-on passives: Shield Mastery (+3 def), Revenge (+3 on next hit), Regen (1 HP/turn)

This kid is a rock. Enemies bounce off them. Their brother's character can go full offense knowing the tank has their back.


---

### ⚔️ ARMS BRANCH — "The Weapon Master"

*"One strike. One kill." DPS playstyle focused on raw damage, critical hits, and cleaving through groups of enemies. The Arms Warrior is the kid who wants the biggest sword and the biggest numbers. Every skill reinforces the fantasy of being an unstoppable force of destruction.*

---

#### Tier 1 — Fundamentals (0 points required)

*Learn to hit things really, really hard. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| A1 | **Weapon Specialization** | 🛡️ Passive | 3 | +1 / +2 / +3 melee damage with two-handed weapons. *Lego: Equip a big sword, axe, or hammer piece!* |
| A2 | **Mighty Swing** | ⚔️ Active | 1 | Powerful overhead strike: deal STR + 3 damage to one target. Uses your full turn (no move). The wind-up makes it hit harder. |
| A3 | **Battle Fury** | 🛡️ Passive | 3 | After defeating an enemy, gain +1 / +2 / +3 to your next attack roll. Stacks if you defeat multiple enemies in a row. Resets at end of combat. |
| A4 | **Reckless Strike** | ⚔️ Active | 1 | Attack with +5 to your hit roll, but enemies get +3 to hit YOU until your next turn. High risk, high reward! |
| A5 | **Bloodlust** | 🛡️ Passive | 2 | Heal 1 / 2 HP whenever you defeat an enemy. Killing = healing. |

> **Tier 1 Total: 5 skills, 10 rank slots.**
> A kid's first 3 points might go: Weapon Specialization (1), Mighty Swing, Battle Fury (1) — already hitting harder than anyone else.

---

#### Tier 2 — Striker (3 points in Arms required)

*Now you can hit GROUPS of enemies and start landing crits. This is where the fun really begins.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| A6 | **Cleave** | ⚔️ Active | 2 | Swing in a wide arc hitting ALL enemies within 2 / 3 studs in front of you. Each takes STR damage. *Lego: Sweep the minifig's weapon across multiple enemies!* |
| A7 | **Critical Eye** | 🛡️ Passive | 3 | Your critical hit range improves: normally 20 only → 19–20 → 18–20 → 17–20. More crits = more double damage. |
| A8 | **Charge** | ⚔️ Active | 1 | Rush up to 8 studs in a straight line. Attack the first enemy you reach. Deal +3 bonus damage if you moved at least 4 studs. Can't be stopped by anything in your path. *Lego: Slide the minifig across the board!* |
| A9 | **Focused Rage** | 🛡️ Passive | 2 | When you take damage, your next melee attack deals +2 / +4 bonus damage. Getting hit makes you angrier. Resets after you attack. |
| A10 | **Intimidating Shout** | ⚔️ Active | 1 | All enemies within 3 studs make a TGH check (DC 12) or are frightened for 1 turn: they can't move toward you and get -2 to attack rolls. |

> **Tier 2 Total: 5 skills, 9 rank slots.**
> Cleave + Critical Eye is the combo every DPS Warrior wants. Charge is the "get into the fight fast" closer.

---

#### Tier 3 — Berserker (6 points in Arms required)

*You've earned the name Berserker. Spin attacks, executions, and dual-wielding two-handed weapons like a maniac.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| A11 | **Whirlwind** | ⚔️ Active | 2 | Spin attack: hit ALL enemies within 2 studs of you for STR +2 / STR +5 damage. 360 degrees of pain. *Lego: Spin the minifig on the board!* |
| A12 | **Execute** | ⚔️ Active | 1 | Against enemies below half HP: deal STR × 2 damage. If this kills them, refund your action — take another action this turn. The finisher. |
| A13 | **Deep Wounds** | 🛡️ Passive | 3 | Your critical hits cause bleeding: the target takes an extra 2 / 3 / 4 damage at the start of their next 2 turns. Crits keep hurting. |
| A14 | **Titan's Grip** | 🛡️ Passive | 1 | You can hold a two-handed weapon in ONE hand. This means you can dual-wield two-handed weapons, or hold a two-hander + shield. *Lego: Put a big weapon in each hand!* |
| A15 | **War Cry** | ⚔️ Active | 2 | Shout of power: all allies within 4 studs get +2 / +4 to their next attack roll. Free action — doesn't use your turn. |
| A16 | **Relentless** | 🛡️ Passive | 2 | On your turn, you can move +1 / +2 extra studs (total 7 / 8 instead of 6). You're always closing the gap. |

> **Tier 3 Total: 6 skills, 11 rank slots.**
> Whirlwind is the signature Arms Warrior skill — every kid wants to spin and hit everything. Execute rewards finishing enemies off. Titan's Grip is the "whoa, cool" passive.

---

#### Tier 4 — Warlord (10 points in Arms required)

*You don't just fight enemies — you obliterate them. These are the "I win the fight" abilities.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| A17 | **Devastating Blow** | ⚔️ Active | 1 | A single massive strike: deal STR × 3 damage to one target. They're stunned for 1 turn from the impact. 3-turn cooldown (can't spam it). |
| A18 | **Bloodbath** | ⚔️ Active | 1 | For 3 turns: every time you deal melee damage, heal for half the damage dealt. Attack = healing. Once per encounter. |
| A19 | **Unstoppable Force** | 🛡️ Passive | 2 | You are immune to slow, root, and stun effects for the first 1 / 2 rounds of combat. Nothing stops your opening charge. |
| A20 | **Rampage** | ⚔️ Active | 1 | Go berserk: make 3 separate melee attacks this turn against any combination of enemies within reach. Each deals full STR damage. Once per encounter. |
| A21 | **Blade Storm** | ⚔️ Active | 1 | Move up to 6 studs in any path. Every enemy you pass within 1 stud takes STR + 3 damage. You can't be stopped or interrupted during the movement. *Lego: Trace a path through the enemies!* |

> **Tier 4 Total: 5 skills, 6 rank slots.**
> Devastating Blow is the single-target nuke. Rampage is the multi-target nuke. Blade Storm is the mobile nuke. This tier is all about DAMAGE.

---

#### Tier 5 — Capstone (15 points in Arms required)

*The pinnacle of destruction. Only deep Arms specialists reach these. You are THE weapon.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| A22 | **Avatar of War** | ⚔️ Active | 1 | For 3 turns: +5 STR, every melee attack hits ALL adjacent enemies (not just your target), and critical hits deal TRIPLE damage instead of double. You are wreathed in red flame. Once per encounter. *THE ultimate berserker moment.* |
| A23 | **One-Shot Kill** | 🛡️ Passive | 1 | Once per encounter: if your damage would reduce a non-boss enemy to 5 HP or less, they're instantly defeated instead. No extra roll needed — they just drop. Bosses are immune. The executioner's edge. |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> Avatar of War is the flashiest skill in the game — fire effects, triple crits, hitting everything around you. One-Shot Kill is the quiet efficiency passive that makes cleanup trivial.

---

### ⚔️ Arms Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 10 | Hit harder, big weapons |
| 2 — Striker | 5 | 9 | Cleave groups, land crits, charge in |
| 3 — Berserker | 6 | 11 | Spin attacks, executions, dual-wield |
| 4 — Warlord | 5 | 6 | Devastating single hits, multi-attacks |
| 5 — Capstone | 2 | 2 | God-mode damage |
| **TOTAL** | **23** | **38** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 13 skills |
| 🛡️ Passive | 10 skills |

### Sample Arms Build (Level 10, 10 points)

A kid who goes 10 points deep into Arms might pick:

| Points | Skill | Why |
|--------|-------|-----|
| 2 | Weapon Specialization (Rank 2) | +2 damage with my big axe |
| 1 | Mighty Swing | Big single-target hit |
| 1 | Battle Fury (Rank 1) | Kill streak bonus |
| 2 | Cleave (Rank 2) | Hit everything in front of me |
| 1 | Charge | Rush into combat |
| 1 | Whirlwind (Rank 1) | SPIN ATTACK! |
| 1 | Execute | Finish off weak enemies |
| 1 | War Cry (Rank 1) | Help my teammate too |
| **10** | | **Tier 4 unlocked!** |

Their action bar: `[Mighty Swing] [Cleave] [Charge] [Whirlwind] [Execute]`
Always-on passives: Weapon Spec (+2 dmg), Battle Fury (+1 after kills)

This kid charges into a group of goblins, Whirlwinds the pack, Cleaves the survivors, then Executes the boss with double damage. Total carnage. Huge fun.

### Arms vs Protection — Side by Side

| Aspect | Protection | Arms |
|--------|-----------|------|
| **Damage dealt** | Low-Medium | Very High |
| **Damage taken** | Very Low | Medium-High |
| **Party role** | Bodyguard | Glass cannon |
| **Fun factor** | "I'm unkillable!" | "I one-shot everything!" |
| **Best with** | A DPS partner | A tank or healer partner |
| **Lego fantasy** | Shields, armor, walls | Giant weapons, dual-wield |


---

### ⚔️ WARRIOR CORE — Shared Skills

*These skills are available to ANY Warrior regardless of branch. Points spent here do NOT count toward either Protection or Arms tier gating. They're utility picks — grab a few to round out your build.*

> **Design note:** Core skills exist so a deep Protection Warrior can still grab a mobility tool, or a deep Arms Warrior can get some survivability, without "wasting" branch points. They're the glue that makes any build feel complete.

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| WC1 | **Second Wind** | ⚔️ Active | 2 | Catch your breath: heal yourself for 5 / 8 HP. Once per encounter. No action needed — use it on your turn as a free action alongside your normal action. |
| WC2 | **Battle Hardened** | 🛡️ Passive | 3 | +1 / +2 / +3 to initiative rolls. Going first means hitting first. |
| WC3 | **Weapon Swap** | 🛡️ Passive | 1 | Switch between two equipped weapon sets as a free action during combat. Sword-and-shield one turn, two-handed axe the next. *Lego: Keep two weapon loadouts ready and swap pieces mid-fight!* |
| WC4 | **Victory Rush** | 🛡️ Passive | 2 | After defeating an enemy, gain +2 / +4 movement on your next turn. Chase down the survivors. |
| WC5 | **Demoralizing Shout** | ⚔️ Active | 1 | Roar so loud enemies flinch: all enemies within 4 studs deal -2 damage for 2 turns. Great opener. |
| WC6 | **Heroic Leap** | ⚔️ Active | 1 | Jump to any point within 6 studs (ignore terrain, gaps, enemies in the way). Enemies within 2 studs of your landing point take 3 damage and are knocked prone. *Lego: Physically leap the minifig through the air!* |

---

### Core Skills — Summary

| Type | Count |
|------|-------|
| ⚔️ Active | 3 skills |
| 🛡️ Passive | 3 skills |
| **Total Skills** | **6** |
| **Total Rank Slots** | **10** |

### When to Pick Core Skills

| Build | Good Core Picks | Why |
|-------|----------------|-----|
| Deep Protection (15+) | Heroic Leap, Second Wind | Mobility + self-heal since you have no Arms damage tools |
| Deep Arms (15+) | Second Wind, Demoralizing Shout | Survivability since you have no Protection tankiness |
| Balanced (10/10) | Weapon Swap, Battle Hardened | Flexibility + going first to set up combos |

---

### ⚔️ WARRIOR CLASS — Complete Totals

| Section | Skills | Rank Slots |
|---------|--------|-----------|
| 🛡️ Protection Branch | 23 | 40 |
| ⚔️ Arms Branch | 23 | 38 |
| ⚔️ Core (Shared) | 6 | 10 |
| **WARRIOR TOTAL** | **52** | **88** |

> With 20 skill points, a Warrior uses roughly 23% of available rank slots. That's at least **5 distinct viable builds** before you even factor in spellbook spell choices.


---

## 10. 🗡️ ROGUE / RANGER CLASS

*Masters of stealth, precision, and cunning. Three branches let you play as an assassin, a sharpshooter, or a trapper. Rogues/Rangers are faster and trickier than Warriors — they don't stand and trade blows, they strike from the shadows, snipe from range, or control the battlefield with traps and animal companions.*

| Branch | Fantasy | Playstyle |
|--------|---------|-----------|
| **🌑 Shadow** | Assassin, backstabber, poisoner | Burst damage from stealth, debuffs, dirty tricks |
| **🎯 Precision** | Sharpshooter, sniper, marksman | Ranged damage, crits, aimed shots |
| **🌿 Survival** | Trapper, beast master, wilderness expert | Traps, pets, area control, utility |

---

### 🌑 SHADOW BRANCH — "The Unseen Blade"

*"The last thing they never see." Stealth burst damage, poison, and dirty tricks. The Shadow Rogue is the kid who wants to go invisible, sneak behind the biggest monster, and one-shot it with a dagger. Every skill rewards patience, positioning, and the thrill of the ambush.*

---

#### Tier 1 — Fundamentals (0 points required)

*Learn to hide, strike from the dark, and get away with it. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S1 | **Backstab** | ⚔️ Active | 2 | Attack from behind an enemy or while hidden: deal +3 / +5 bonus damage on top of your normal attack. Position matters! *Lego: Move your minifig behind the enemy before attacking!* |
| S2 | **Stealth Mastery** | 🛡️ Passive | 3 | +2 / +4 / +6 to all stealth and hide rolls. You're practically a shadow. |
| S3 | **Poisoned Blade** | ⚔️ Active | 1 | Coat your weapon in poison: your next 2 attacks deal +2 poison damage each, and the target takes 1 damage at the start of their next turn (lingering poison). |
| S4 | **Nimble Dodge** | 🛡️ Passive | 2 | +1 / +2 to all dodge and defense rolls. You're too quick to hit cleanly. |
| S5 | **Pickpocket** | ⚔️ Active | 1 | Steal one small item from an enemy (potion, key, gold pouch) or pick a lock instantly. SMT check DC 10. Outside combat, auto-succeeds on unaware targets. |

> **Tier 1 Total: 5 skills, 9 rank slots.**
> Backstab + Stealth Mastery is the bread and butter. Hide → Backstab → huge damage. Simple loop even a 7-year-old gets.

---

#### Tier 2 — Skulker (3 points in Shadow required)

*Now you can teleport through shadows, poison everything, and vanish at will.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S6 | **Shadow Step** | ⚔️ Active | 1 | Teleport to any shadow or dark area within 6 studs. You arrive hidden (count as stealthed). *Lego: Pick up minifig and place it in a new spot — poof!* |
| S7 | **Deadly Poison** | 🛡️ Passive | 3 | Your poison effects deal +1 / +2 / +3 extra damage. Affects Poisoned Blade and any poison-based attacks. |
| S8 | **Smoke Bomb** | ⚔️ Active | 1 | Throw a smoke bomb creating a 3-stud cloud. Everyone inside gets +5 to hide rolls, and enemies inside get -3 to attack rolls. Lasts 2 turns. *Lego: Place a gray cotton ball or cloud piece on the board!* |
| S9 | **Cheap Shot** | ⚔️ Active | 2 | Strike a nerve: deal SPD damage and the target is stunned for 1 turn / 1 turn + they drop their weapon. Must be in melee range. |
| S10 | **Silent Footsteps** | 🛡️ Passive | 2 | Your movement doesn't trigger traps or alert enemies. At Rank 2, allies within 2 studs also benefit. You guide the party through danger. |

> **Tier 2 Total: 5 skills, 9 rank slots.**
> Shadow Step is the defining Rogue mobility skill. Smoke Bomb creates chaos. Cheap Shot is deliciously mean.

---

#### Tier 3 — Assassin (6 points in Shadow required)

*True assassin territory. Vanish mid-combat, strike from nowhere, leave targets bleeding and confused.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S11 | **Vanish** | ⚔️ Active | 1 | React (free action): when attacked, become invisible and move up to 4 studs. The attack misses automatically. You're now hidden. Once per encounter. |
| S12 | **Ambush** | 🛡️ Passive | 2 | When attacking from stealth, deal +4 / +6 bonus damage (stacks with Backstab). The ultimate first-strike bonus. |
| S13 | **Fan of Knives** | ⚔️ Active | 2 | Throw knives in all directions: every enemy within 4 / 5 studs takes SPD damage. Great for breaking stealth with style. |
| S14 | **Garrote** | ⚔️ Active | 1 | From stealth only: grab an enemy from behind. They're silenced (can't cast spells/abilities) for 2 turns and take 3 damage per turn. They can't call for help. |
| S15 | **Cloak of Shadows** | 🛡️ Passive | 2 | Resist magic damage by 2 / 4. At Rank 2, also immune to being revealed by detection spells. The shadows protect you. |
| S16 | **Exploit Weakness** | 🛡️ Passive | 3 | Whenever you attack a stunned, blinded, or slowed enemy, deal +1 / +2 / +3 extra damage. Kick 'em while they're down. |

> **Tier 3 Total: 6 skills, 11 rank slots.**
> Vanish is the panic button every Rogue dreams of. Ambush + Backstab from stealth = massive burst. Garrote is the silent killer move.

---

#### Tier 4 — Shadow Master (10 points in Shadow required)

*You control the darkness itself. Marks of death, shadow clones, and stealing enemies' weapons right out of their hands.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S17 | **Death Mark** | ⚔️ Active | 1 | Mark one enemy for death: for 3 turns, ALL attacks against them (from anyone in the party) deal +5 bonus damage. The mark is visible as a glowing skull above their head. Once per encounter. |
| S18 | **Shadow Clone** | ⚔️ Active | 1 | Create 2 shadow copies of yourself (1 HP each). They can each attack for 4 damage per turn, and enemies must guess which is the real you (1 in 3 chance to hit you). Copies last 3 turns. |
| S19 | **Disarm** | ⚔️ Active | 1 | SPD check vs enemy STR + 8: snatch a weapon or item right out of an enemy's hands. They lose it, you can use it or throw it away. *Lego: Physically take the weapon piece off the enemy minifig!* |
| S20 | **Venomous Strikes** | 🛡️ Passive | 2 | All your melee attacks now apply 1 / 2 poison damage per turn for 2 turns, automatically. No activation needed — every hit poisons. |

> **Tier 4 Total: 4 skills, 5 rank slots.**
> Death Mark is the ultimate team play skill — mark the boss and everyone hits harder. Shadow Clone is fun and tactical. Disarm is physically satisfying with Lego.

---

#### Tier 5 — Capstone (15 points in Shadow required)

*The apex predator. You are the darkness.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S21 | **Shadow Dance** | ⚔️ Active | 1 | For 3 turns: after every attack you make, you automatically re-enter stealth. Every single attack is a stealth attack. Backstab + Ambush on every hit. Once per encounter. *This is the "I am become death" button.* |
| S22 | **Phantom Assassin** | 🛡️ Passive | 1 | Once per encounter: if your stealth attack would reduce a non-boss enemy to 8 HP or less, they're instantly defeated. You struck so fast they didn't even know they were dead. Bosses are immune. |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> Shadow Dance turns the Rogue into a whirlwind of stealth strikes — every attack benefits from Backstab and Ambush. Phantom Assassin is the quiet "they just drop" passive.

---

### 🌑 Shadow Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 9 | Hide, backstab, poison basics |
| 2 — Skulker | 5 | 9 | Shadow teleport, smoke, stuns |
| 3 — Assassin | 6 | 11 | Vanish, ambush, silence, knives |
| 4 — Shadow Master | 4 | 5 | Death marks, clones, disarm |
| 5 — Capstone | 2 | 2 | Permanent stealth, instant kills |
| **TOTAL** | **22** | **36** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 13 skills |
| 🛡️ Passive | 9 skills |

### Sample Shadow Build (Level 10, 10 points)

| Points | Skill | Why |
|--------|-------|-----|
| 2 | Backstab (Rank 2) | +5 damage from stealth — my bread and butter |
| 2 | Stealth Mastery (Rank 2) | +4 to hiding — need to actually get into stealth |
| 1 | Poisoned Blade | Extra damage + lingering tick |
| 1 | Shadow Step | Teleport behind enemies |
| 1 | Smoke Bomb | Create hiding spots mid-fight |
| 1 | Vanish | Emergency escape |
| 1 | Ambush (Rank 1) | +4 more damage from stealth |
| 1 | Fan of Knives (Rank 1) | AoE option for groups |
| **10** | | **Tier 4 unlocked!** |

Action bar: `[Backstab] [Shadow Step] [Smoke Bomb] [Vanish] [Fan of Knives]`
Always-on passives: Stealth Mastery (+4 hide), Nimble Dodge... wait, didn't take that. Ambush (+4 from stealth)

**The loop:** Shadow Step behind enemy → Backstab (+5) + Ambush (+4) = +9 bonus damage from stealth. If they survive, Smoke Bomb → hide again → repeat. If surrounded, Fan of Knives. If caught, Vanish out. Sneaky, lethal, fun.


---

## 10. 🗡️ ROGUE / RANGER CLASS

*Masters of stealth, precision, and cunning. Three branches offer wildly different playstyles — an assassin who strikes from the shadows, a sharpshooter who never misses, or a wilderness expert who controls the battlefield with traps and animal companions.*

| Branch | Fantasy | Playstyle |
|--------|---------|-----------|
| **🌑 Shadow** | Assassin, poisoner, backstabber | Burst damage from stealth, debuffs, dirty tricks |
| **🎯 Precision** | Sharpshooter, sniper, marksman | Ranged crits, aimed shots, distance control |
| **🌿 Survival** | Trapper, beast master, wilderness expert | Traps, pets, area control, utility |

---

### 🌑 SHADOW BRANCH — "The Unseen Blade"

*"The last thing they never see." You live in the shadows. You strike once, strike hard, and vanish before anyone knows what happened. Poison, stealth, and burst damage — the assassin's toolkit. The Shadow Rogue is the kid who wants to feel sneaky, clever, and devastatingly cool.*

---

#### Tier 1 — Fundamentals (0 points required)

*Learn to hide, stab, and cheat. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S1 | **Backstab** | ⚔️ Active | 2 | Attack from behind an enemy or while hidden: deal weapon damage +3 / +5 bonus damage. If you weren't hidden, you must be behind the target. |
| S2 | **Stealth Mastery** | 🛡️ Passive | 3 | +2 / +4 / +6 to all stealth and hide rolls. You're basically invisible. |
| S3 | **Poison Blade** | ⚔️ Active | 1 | Coat your weapon in poison: your next 2 attacks deal +2 poison damage each. The poison stacks if both attacks hit the same target. *Lego: Put a green 1×1 tile on your weapon!* |
| S4 | **Quick Dodge** | 🛡️ Passive | 2 | +1 / +2 to all dodge and defense rolls. You're slippery. |
| S5 | **Pocket Sand** | ⚔️ Active | 1 | Throw sand in an enemy's face within 2 studs: they're blinded for 1 turn (−5 to all attack rolls). No roll needed — it just works. *Kids love this one.* |

> **Tier 1 Total: 5 skills, 9 rank slots.**
> Backstab + Stealth Mastery is the obvious starter combo. Pocket Sand is the "funny but useful" pick every kid grabs.

---

#### Tier 2 — Stalker (3 points in Shadow required)

*Now you can teleport through shadows, leave poison everywhere, and set up devastating ambushes.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S6 | **Shadow Step** | ⚔️ Active | 1 | Teleport to any shadow or dark area within 6 studs. You count as hidden after teleporting. *Lego: Pick up the minifig and place it behind an enemy!* |
| S7 | **Crippling Poison** | 🛡️ Passive | 2 | Your poison effects also slow the target: −1 / −2 movement for 2 turns. Poisoned enemies can't run away. |
| S8 | **Cheap Shot** | ⚔️ Active | 1 | Sucker punch from stealth: target is stunned for 1 turn. Must be hidden to use. Doesn't deal damage but sets up your teammate's attack perfectly. |
| S9 | **Evasion** | ⚔️ Active | 2 | React (free action): When hit by an attack, reduce the damage by half / completely negate it. Once per encounter / twice per encounter. |
| S10 | **Poisoner's Kit** | 🛡️ Passive | 2 | Your Poison Blade ability now lasts for 3 / 4 attacks instead of 2. More poison for everyone. |

> **Tier 2 Total: 5 skills, 8 rank slots.**
> Shadow Step is the signature move — teleport behind someone and Backstab. Classic assassin combo.

---

#### Tier 3 — Assassin (6 points in Shadow required)

*You're a true assassin now. Vanish mid-combat, apply deadly poisons, and strike from every angle.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S11 | **Vanish** | ⚔️ Active | 1 | Disappear completely in the middle of combat. You become hidden (invisible) for 2 turns. Your next attack from hidden is an automatic critical hit. Once per encounter. *The "oh no, where did they go" moment.* |
| S12 | **Fan of Knives** | ⚔️ Active | 2 | Throw knives at every enemy within 4 / 5 studs. Each takes SPD damage. Great for softening up groups. |
| S13 | **Deadly Poison** | 🛡️ Passive | 3 | Upgrade all your poison damage: +1 / +2 / +3 to every tick of poison. Stacks with Poison Blade and Crippling Poison. |
| S14 | **Shadowmeld** | 🛡️ Passive | 1 | If you don't move or attack on your turn, you automatically become hidden at end of turn. Free stealth every round if you're patient. |
| S15 | **Ambush** | ⚔️ Active | 1 | Leap from stealth to a target within 4 studs: deal weapon damage + SPD bonus damage. You land adjacent to them. Counts as attacking from behind. |
| S16 | **Nimble Fingers** | 🛡️ Passive | 2 | +2 / +4 to lockpicking, trap disarming, and pickpocket rolls. The world's best thief. |

> **Tier 3 Total: 6 skills, 10 rank slots.**
> Vanish → Ambush (auto-crit from stealth) is a devastating combo. Fan of Knives handles groups when stealth isn't an option.

---

#### Tier 4 — Shadow Master (10 points in Shadow required)

*Expert-level assassination. Mark targets for death, dance through shadows, and steal anything.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S17 | **Death Mark** | ⚔️ Active | 1 | Mark one enemy for death: for 3 turns, ALL attacks against them (from you AND allies) deal +5 bonus damage. The skull symbol appears above their head. Once per encounter. |
| S18 | **Shadow Dance** | ⚔️ Active | 1 | For 3 turns: after every attack you make, you automatically become hidden again. Attack, vanish, attack, vanish, attack, vanish. Once per encounter. *The ultimate assassin fantasy.* |
| S19 | **Lethal Dose** | 🛡️ Passive | 2 | If an enemy has 3+ stacks of any poison effect, they take an extra 4 / 8 burst damage at the start of their turn. Poison critical mass. |
| S20 | **Cloak of Shadows** | ⚔️ Active | 1 | React: Become immune to all magic and ranged attacks for 1 turn. Melee only can touch you. The shadows protect you. |
| S21 | **Heist** | ⚔️ Active | 1 | Steal a weapon or item from an enemy while in combat. They lose it, you can use it this turn. Against bosses: steal a consumable or key item instead. *The ultimate flex.* |

> **Tier 4 Total: 5 skills, 6 rank slots.**
> Death Mark makes the whole party stronger. Shadow Dance is the "main character" moment — appearing and disappearing like a phantom.

---

#### Tier 5 — Capstone (15 points in Shadow required)

*The pinnacle of shadow arts. You are THE assassin.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| S22 | **Deathstrike** | ⚔️ Active | 1 | Attack from stealth: deal QUADRUPLE weapon damage. The target must pass a TGH check (DC 18) or be instantly defeated. Bosses take quadruple damage but can't be instantly defeated. Once per encounter. *The assassination.* |
| S23 | **Living Shadow** | 🛡️ Passive | 1 | Your shadow gains a life of its own. It copies every melee attack you make as a free action — essentially doubling your melee damage output permanently. The shadow attacks from the opposite side of the target. *Two minifigs for the price of one!* |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> Deathstrike is the assassination fantasy perfected — one shot, one kill. Living Shadow is the always-on doubler that turns every attack into two.

---

### 🌑 Shadow Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 9 | Hide, stab, poison |
| 2 — Stalker | 5 | 8 | Teleport, ambush, evade |
| 3 — Assassin | 6 | 10 | Vanish, knife storm, auto-stealth |
| 4 — Shadow Master | 5 | 6 | Mark for death, shadow dance, steal |
| 5 — Capstone | 2 | 2 | One-shot kill, shadow clone |
| **TOTAL** | **23** | **35** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 14 skills |
| 🛡️ Passive | 9 skills |

### Sample Shadow Build (Level 10, 10 points)

| Points | Skill | Why |
|--------|-------|-----|
| 2 | Backstab (Rank 2) | +5 damage from stealth = huge burst |
| 2 | Stealth Mastery (Rank 2) | +4 to hide rolls — almost never spotted |
| 1 | Poison Blade | Extra damage on every attack |
| 1 | Shadow Step | Teleport behind enemies |
| 1 | Cheap Shot | Stun from stealth — set up teammate |
| 1 | Vanish | Disappear mid-fight for auto-crit |
| 1 | Ambush | Leap from stealth for big damage |
| 1 | Fan of Knives (Rank 1) | AoE for groups |
| **10** | | **Tier 4 unlocked!** |

Their action bar: `[Backstab] [Shadow Step] [Vanish] [Ambush] [Fan of Knives]`
Always-on passives: Stealth Mastery (+4 hide), Quick Dodge (if picked instead)

This kid hides, Shadow Steps behind the boss, Backstabs for massive damage, Vanishes, then Ambushes again for an auto-crit. The other kid's Warrior taunts all the minions while the assassin dismantles the boss. Perfect teamwork.


---

### 🎯 PRECISION BRANCH — "The Sharpshooter"

*"One arrow. One target. One chance." You fight from a distance, picking off enemies with perfectly aimed shots. Critical hits, headshots, and trick arrows — the sniper's toolkit. The Precision Ranger is the kid who wants to stand back, line up the perfect shot, and watch enemies drop before they get close.*

---

#### Tier 1 — Fundamentals (0 points required)

*Learn to shoot straight and shoot fast. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| R1 | **Steady Aim** | 🛡️ Passive | 3 | +1 / +2 / +3 to all ranged attack rolls. Simple, powerful, always working. *Lego: Equip a bow or crossbow piece!* |
| R2 | **Quick Shot** | ⚔️ Active | 1 | Fire two arrows this turn instead of one. Second arrow is at −2 to hit. Doubles your output. |
| R3 | **Hunter's Mark** | ⚔️ Active | 1 | Mark one enemy: all YOUR attacks against that target deal +2 damage for the entire encounter. Free action to place — lasts until the target dies or combat ends. |
| R4 | **Sharp Eyes** | 🛡️ Passive | 2 | +2 / +4 to spot hidden enemies, traps, and secrets. You see everything. |
| R5 | **Kiting** | 🛡️ Passive | 2 | After making a ranged attack, you can move 1 / 2 studs as a free action. Stay out of melee range. |

> **Tier 1 Total: 5 skills, 9 rank slots.**
> Steady Aim + Hunter's Mark on the boss is the bread-and-butter opener. Quick Shot doubles arrows for raw DPS.

---

#### Tier 2 — Marksman (3 points in Precision required)

*Longer range, bigger crits, and trick arrows that do more than just damage.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| R6 | **Aimed Shot** | ⚔️ Active | 2 | Take a full turn to aim (no move): deal weapon damage × 2 / × 2.5 (rounded up). The patient shot hits like a truck. |
| R7 | **Critical Shot** | 🛡️ Passive | 3 | Ranged critical hits deal +2 / +4 / +6 bonus damage (on top of the normal double damage). Crits become devastating. |
| R8 | **Fire Arrow** | ⚔️ Active | 1 | Shoot a flaming arrow: normal damage + target catches fire for 2 damage per turn for 2 turns. Also lights up dark areas. *Lego: Put an orange 1×1 tile on the arrow!* |
| R9 | **Long Range** | 🛡️ Passive | 2 | Your ranged attack range increases by +2 / +4 studs. Shoot from further away where enemies can't reach you. |
| R10 | **Pinning Shot** | ⚔️ Active | 1 | Shoot an arrow through the enemy's foot (or armor): normal damage + they can't move for 1 turn. SPD check (DC 12) to resist. |

> **Tier 2 Total: 5 skills, 9 rank slots.**
> Aimed Shot is the "big hit" ability — patient kids are rewarded with massive damage. Fire Arrow adds style and damage-over-time.

---

#### Tier 3 — Sharpshooter (6 points in Precision required)

*Now you're making impossible shots — through walls, through multiple enemies, from incredibly far away.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| R11 | **Piercing Shot** | ⚔️ Active | 2 | Arrow passes through all enemies in a straight line (up to 3 / 5 targets). Each takes full weapon damage. Line 'em up! |
| R12 | **Eagle Eye** | 🛡️ Passive | 1 | You can see the exact HP of any enemy within your ranged attack range. Know exactly when to use Execute-type abilities or when to switch targets. |
| R13 | **Ice Arrow** | ⚔️ Active | 1 | Shoot a freezing arrow: normal damage + target's movement is halved and they get −2 to attacks for 2 turns. *Lego: Blue 1×1 tile on the arrow!* |
| R14 | **Headshot** | 🛡️ Passive | 3 | On a natural 20 ranged attack, deal TRIPLE damage instead of double / also stun for 1 turn / also ignore all armor and defense. Escalating crit power. |
| R15 | **Covering Fire** | ⚔️ Active | 1 | Choose a 3-stud area: any enemy that enters or starts their turn there takes an arrow for SPD damage. Lasts 2 turns. Area denial. |
| R16 | **Wind Reader** | 🛡️ Passive | 2 | Ignore −1 / −2 penalties from cover, obstacles, and partial line-of-sight. You can shoot around corners (almost). |

> **Tier 3 Total: 6 skills, 10 rank slots.**
> Piercing Shot is the "bowling strike" moment. Headshot turns every natural 20 into a legendary moment.

---

#### Tier 4 — Deadeye (10 points in Precision required)

*You don't miss. You just decide how much it hurts.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| R17 | **Rain of Arrows** | ⚔️ Active | 1 | Fire a volley into the sky: every enemy within a 5-stud area takes SPD + 3 damage. Once per encounter. *Lego: Drop a handful of small pieces onto the board area!* |
| R18 | **Killshot** | ⚔️ Active | 1 | Against enemies below 25% HP: deal SPD × 3 damage. Auto-hits (no roll needed). The finisher that never misses. Once per encounter. |
| R19 | **Hawkeye Focus** | ⚔️ Active | 1 | For 3 turns: all your ranged attacks get +3 to hit AND +3 damage. Pure accuracy mode. Once per encounter. |
| R20 | **Ricochet** | 🛡️ Passive | 2 | Your ranged attacks bounce to 1 / 2 additional enemies within 3 studs of the original target for half damage each. Every arrow hits multiple targets. |
| R21 | **Sniper's Nest** | ⚔️ Active | 1 | Choose a spot: you can't move but gain +5 to all ranged attacks and your range doubles for 3 turns. The perfect vantage point. *Lego: Place minifig on a raised platform or wall!* |

> **Tier 4 Total: 5 skills, 6 rank slots.**
> Rain of Arrows is the AoE bomb. Killshot is the guaranteed finisher. Sniper's Nest turns you into an artillery battery.

---

#### Tier 5 — Capstone (15 points in Precision required)

*The pinnacle of marksmanship. You are THE sharpshooter.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| R22 | **Phantom Arrow** | ⚔️ Active | 1 | Fire a single perfect arrow: it NEVER misses (auto-hit), deals 30 flat damage, ignores all defense and armor, and stuns for 2 turns. Once per encounter. *The shot heard round the world.* |
| R23 | **Bullseye Mastery** | 🛡️ Passive | 1 | Your ranged crit range permanently becomes 16–20 (25% chance to crit on every shot). Crits trigger all your crit bonuses (Critical Shot, Headshot, Deep Wounds if multiclassed). You're critting every other shot. |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> Phantom Arrow is the undodgeable nuke. Bullseye Mastery is the always-on crit machine that makes every turn exciting.

---

### 🎯 Precision Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 9 | Accurate shots, mark targets |
| 2 — Marksman | 5 | 9 | Big aimed shots, trick arrows |
| 3 — Sharpshooter | 6 | 10 | Piercing shots, headshots, area denial |
| 4 — Deadeye | 5 | 6 | Arrow rain, guaranteed kills, ricochet |
| 5 — Capstone | 2 | 2 | Perfect arrow, crit machine |
| **TOTAL** | **23** | **36** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 13 skills |
| 🛡️ Passive | 10 skills |

### Sample Precision Build (Level 10, 10 points)

| Points | Skill | Why |
|--------|-------|-----|
| 2 | Steady Aim (Rank 2) | +2 to all ranged attacks |
| 1 | Quick Shot | Two arrows per turn |
| 1 | Hunter's Mark | +2 damage vs marked target |
| 2 | Aimed Shot (Rank 2) | ×2.5 damage patient shot |
| 2 | Critical Shot (Rank 2) | +4 bonus on crits |
| 1 | Piercing Shot (Rank 1) | Line up multiple enemies |
| 1 | Eagle Eye | See enemy HP |
| **10** | | **Tier 4 unlocked!** |

Their action bar: `[Quick Shot] [Hunter's Mark] [Aimed Shot] [Piercing Shot] [Fire Arrow]`
Always-on passives: Steady Aim (+2 hit), Critical Shot (+4 crit dmg), Eagle Eye (see HP), Kiting (if picked)

This kid stays back, marks the boss, fires Aimed Shots for massive damage, and uses Piercing Shot when enemies line up. Clean, efficient, satisfying.


---

### 🌿 SURVIVAL BRANCH — "The Wild One"

*"Nature fights with me." You don't just fight enemies — you control the entire battlefield. Traps that punish movement, animal companions that fight alongside you, and wilderness tricks that turn the environment into a weapon. The Survival Ranger is the kid who wants a pet wolf, a board covered in traps, and total battlefield chaos.*

---

#### Tier 1 — Fundamentals (0 points required)

*Learn to set traps, read the wild, and call on nature. Available from Level 1.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| V1 | **Bear Trap** | ⚔️ Active | 2 | Place a hidden trap on any stud within 3 studs. First enemy to step on it takes 4 / 6 damage and can't move for 1 turn. *Lego: Place a small piece face-down — flip it when triggered!* |
| V2 | **Nature's Eye** | 🛡️ Passive | 2 | +2 / +4 to spotting traps, tracking enemies, finding hidden paths, and all nature/wilderness rolls. You read the forest like a book. |
| V3 | **Wolf Companion** | ⚔️ Active | 1 | Call a loyal wolf to fight alongside you. Wolf stats: 6 HP, SPD 5, deals 3 damage, moves on your turn. Lasts until killed or combat ends. Summon once per encounter. *Lego: Place a wolf minifig or dog piece on the board!* |
| V4 | **Survivalist** | 🛡️ Passive | 3 | +1 / +2 / +3 HP healed whenever you take a short rest. You also forage for supplies — find 1 gold worth of useful stuff after each rest. |
| V5 | **Tripwire** | ⚔️ Active | 1 | Stretch a wire across a 3-stud line. First enemy to cross takes 3 damage and falls prone (loses next action). Invisible until triggered. |

> **Tier 1 Total: 5 skills, 9 rank slots.**
> Wolf Companion is the skill every kid grabs first — who doesn't want a pet wolf? Bear Trap + Tripwire turns the map into a minefield.

---

#### Tier 2 — Trapper (3 points in Survival required)

*More traps, a tougher pet, and the ability to control where enemies can and can't go.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| V6 | **Improved Companion** | 🛡️ Passive | 3 | Your Wolf Companion gets +2 / +4 / +6 HP and +1 / +2 / +3 damage. A real fighter, not just a distraction. |
| V7 | **Caltrops** | ⚔️ Active | 1 | Scatter caltrops across a 4-stud area. Any enemy entering takes 2 damage and is slowed (half movement) for 1 turn. Lasts 3 turns. *Lego: Scatter small gray pieces in the area!* |
| V8 | **Camouflage** | ⚔️ Active | 1 | You and one ally within 3 studs become hidden until you attack or move. +5 to stealth rolls while camouflaged. Nature hides you. |
| V9 | **Snare Master** | 🛡️ Passive | 2 | Your traps deal +2 / +4 extra damage. All your traps also last 1 extra turn before expiring. |
| V10 | **Danger Sense** | 🛡️ Passive | 1 | You can never be surprised. In the first round of any combat, you get +3 to initiative and +2 to defense. Always ready. |

> **Tier 2 Total: 5 skills, 8 rank slots.**
> Improved Companion turns the wolf into a real party member. Caltrops + Bear Trap + Tripwire = enemies can't move safely anywhere.

---

#### Tier 3 — Beast Master (6 points in Survival required)

*Your companion upgrades, your traps get nasty, and you start controlling the battlefield like a general.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| V11 | **Bear Companion** | ⚔️ Active | 1 | Upgrade: instead of a wolf, summon a bear. Bear stats: 12 HP, STR 5, deals 6 damage. Slower (SPD 3) but much tougher. Replaces wolf when active. *Lego: Bigger animal piece or custom build!* |
| V12 | **Explosive Trap** | ⚔️ Active | 2 | Place a trap that explodes when triggered: 6 / 9 damage in a 2-stud radius. Hits all enemies in the blast. *Lego: Use a red 1×1 tile face-down!* |
| V13 | **Pack Tactics** | 🛡️ Passive | 2 | When you and your companion both attack the same target in the same turn, your attacks deal +2 / +4 bonus damage each. Coordinated strikes. |
| V14 | **Natural Remedy** | ⚔️ Active | 2 | Mix a quick potion from foraged ingredients: heal yourself or an ally for 4 / 7 HP. Twice per encounter. Doesn't use a spell slot. |
| V15 | **Trap Network** | 🛡️ Passive | 1 | You can now have 3 traps active simultaneously instead of 1. The board becomes YOUR territory. |
| V16 | **Thick Fur** | 🛡️ Passive | 2 | Your animal companion takes −1 / −2 less damage from all sources. Tougher pet = longer fights. |

> **Tier 3 Total: 6 skills, 10 rank slots.**
> Bear Companion is the major upgrade — a 12 HP tank pet. Trap Network lets you cover the board in hazards.

---

#### Tier 4 — Warden of the Wild (10 points in Survival required)

*You command nature itself. Eagles, stampedes, and traps that would make a military engineer jealous.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| V17 | **Eagle Companion** | ⚔️ Active | 1 | Summon a giant eagle: 10 HP, SPD 8 (flying), deals 5 damage. Can carry one ally 8 studs through the air. The ultimate scout and transport. Replaces bear/wolf when active. |
| V18 | **Minefield** | ⚔️ Active | 1 | Place 5 hidden traps in a 5-stud area all at once. Each deals 4 damage when stepped on. Once per encounter. *Lego: Place 5 small pieces face-down — chaos when enemies walk through!* |
| V19 | **Alpha Command** | ⚔️ Active | 1 | Command your companion to make 2 attacks this turn instead of 1 AND move an extra 3 studs. Once per encounter. Unleash the beast. |
| V20 | **Entangling Vines** | ⚔️ Active | 1 | Vines erupt from the ground in a 4-stud area: all enemies inside are rooted (can't move) for 2 turns and take 3 damage per turn. SPD check (DC 14) each turn to break free. |
| V21 | **Companion Bond** | 🛡️ Passive | 2 | When your companion deals damage, you heal 1 / 2 HP. When you deal damage, your companion heals 1 / 2 HP. Shared life force. |

> **Tier 4 Total: 5 skills, 6 rank slots.**
> Minefield turns an entire area into a death zone. Eagle Companion adds flying mobility to the party. Entangling Vines is crowd control perfection.

---

#### Tier 5 — Capstone (15 points in Survival required)

*The pinnacle of nature's power. You command the wild itself.*

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| V22 | **Stampede** | ⚔️ Active | 1 | Call a stampede of wild animals across the battlefield: every enemy takes 20 damage and is knocked prone. Allies are unharmed — the animals flow around them. Once per encounter. *THE most dramatic ability in the game. Lego: Dump a bag of animal pieces onto the board!* |
| V23 | **Primal Guardian** | 🛡️ Passive | 1 | Your animal companion becomes legendary: +10 HP, +3 to all stats, and it can use one of YOUR action bar abilities once per turn. It's a full party member now. *Two characters for the price of one.* |

> **Tier 5 Total: 2 skills, 2 rank slots.**
> Stampede is pure spectacle — 20 damage to everything. Primal Guardian turns your pet into a second hero.

---

### 🌿 Survival Branch — Complete Summary

| Tier | Skills | Rank Slots | Key Fantasy |
|------|--------|-----------|-------------|
| 1 — Fundamentals | 5 | 9 | Pet wolf, basic traps |
| 2 — Trapper | 5 | 8 | Tougher pet, caltrops, camo |
| 3 — Beast Master | 6 | 10 | Bear pet, explosive traps, trap network |
| 4 — Warden of the Wild | 5 | 6 | Eagle pet, minefields, vine control |
| 5 — Capstone | 2 | 2 | Stampede, legendary pet |
| **TOTAL** | **23** | **35** | |

### Active vs Passive Breakdown

| Type | Count |
|------|-------|
| ⚔️ Active | 14 skills |
| 🛡️ Passive | 9 skills |

### Sample Survival Build (Level 10, 10 points)

| Points | Skill | Why |
|--------|-------|-----|
| 2 | Bear Trap (Rank 2) | 6 damage trap + root |
| 1 | Wolf Companion | Faithful pet fighter |
| 1 | Tripwire | More battlefield control |
| 2 | Improved Companion (Rank 2) | Wolf gets +4 HP and +2 dmg |
| 1 | Caltrops | Area denial |
| 1 | Bear Companion | Upgrade to a 12 HP tank bear |
| 1 | Pack Tactics (Rank 1) | +2 dmg when attacking with pet |
| 1 | Trap Network | 3 traps active at once |
| **10** | | **Tier 4 unlocked!** |

Their action bar: `[Bear Trap] [Bear Companion] [Caltrops] [Tripwire] [Natural Remedy]`
Always-on passives: Improved Companion (+4 HP, +2 dmg), Pack Tactics (+2 coordinated), Trap Network (3 traps)

This kid covers the board in traps, sends the bear charging in, and laughs as enemies stumble through caltrops into tripwires into bear traps. The Warrior stands in the middle taunting while the Ranger controls the edges. Masterful.


---

### 🗡️ ROGUE / RANGER CORE — Shared Skills

*These skills are available to ANY Rogue/Ranger regardless of branch. Points spent here do NOT count toward Shadow, Precision, or Survival tier gating. Utility picks that round out any build.*

> **Design note:** With three branches to spread across, Rogue/Rangers have even more reason to grab Core skills — they're efficient "glue" that makes hybrid builds work.

| # | Skill | Type | Ranks | Effect |
|---|-------|------|-------|--------|
| RC1 | **Roll Away** | ⚔️ Active | 1 | React (free action): When an enemy moves adjacent to you, immediately move 3 studs away without triggering any attacks. Stay at range. |
| RC2 | **Resourceful** | 🛡️ Passive | 3 | +1 / +2 / +3 to all non-combat skill checks (lockpicking, climbing, swimming, persuasion, investigation). The ultimate utility passive. |
| RC3 | **Dual Wield** | 🛡️ Passive | 1 | You can hold a weapon in each hand. When you make a melee attack, you deal +2 bonus damage from the off-hand weapon. *Lego: Weapon in each hand!* |
| RC4 | **Quick Reflexes** | 🛡️ Passive | 2 | +1 / +2 to initiative rolls. Fast hands, fast feet, fast brain. |
| RC5 | **Smoke Bomb** | ⚔️ Active | 1 | Throw a smoke bomb at your feet: create a 3-stud cloud. Everyone inside gets +5 to hide, −3 to attack. Lasts 2 turns. Great escape tool. *Lego: Place a cotton ball or gray brick cluster!* |
| RC6 | **Grapple Hook** | ⚔️ Active | 1 | Throw a hook and swing to any point within 8 studs — walls, ceilings, across gaps, over enemies. Ignore all terrain. *Lego: The minifig flies through the air!* |

---

### Core Skills — Summary

| Type | Count |
|------|-------|
| ⚔️ Active | 3 skills |
| 🛡️ Passive | 3 skills |
| **Total Skills** | **6** |
| **Total Rank Slots** | **9** |

### When to Pick Core Skills

| Build | Good Core Picks | Why |
|-------|----------------|-----|
| Deep Shadow (15+) | Roll Away, Grapple Hook | Escape tools since you're fragile up close |
| Deep Precision (15+) | Roll Away, Quick Reflexes | Stay at range, go first |
| Deep Survival (15+) | Smoke Bomb, Dual Wield | Group escape, melee backup |
| Hybrid (split builds) | Resourceful, Quick Reflexes | Utility that helps everywhere |

---

### 🗡️ ROGUE / RANGER CLASS — Complete Totals

| Section | Skills | Rank Slots |
|---------|--------|-----------|
| 🌑 Shadow Branch | 23 | 35 |
| 🎯 Precision Branch | 23 | 36 |
| 🌿 Survival Branch | 23 | 35 |
| 🗡️ Core (Shared) | 6 | 9 |
| **ROGUE/RANGER TOTAL** | **75** | **115** |

> With 20 skill points, a Rogue/Ranger uses roughly 17% of available rank slots. With three branches, there are easily **8+ distinct viable builds** before factoring in spellbook choices.

---

### 🌑🎯🌿 Branch Comparison — Side by Side

| Aspect | Shadow | Precision | Survival |
|--------|--------|-----------|----------|
| **Damage style** | Burst (one big hit) | Sustained (consistent DPS) | Attrition (traps + pet chip) |
| **Range** | Melee / close | Long range | Mixed |
| **Survivability** | Evasion + stealth | Distance + kiting | Pet tanking + traps |
| **Best opening** | Hide → Backstab | Mark → Aimed Shot | Set traps → summon pet |
| **Party role** | Boss killer | Back-line DPS | Battlefield controller |
| **Fun factor** | "I'm invisible!" | "HEADSHOT!" | "My bear ate your goblin!" |
| **Lego fantasy** | Dark cloaks, daggers | Bows, crossbows | Animals, trap pieces |

---

## 11. GRAND TOTALS — Both Classes

| Class | Skills | Rank Slots |
|-------|--------|-----------|
| ⚔️ Warrior (Prot + Arms + Core) | 52 | 88 |
| 🗡️ Rogue/Ranger (Shadow + Prec + Surv + Core) | 75 | 115 |
| **COMBINED TOTAL** | **127** | **203** |

> **Target was 100+ skills. Delivered 127 skills with 203 rank slots.** ✅

### Active vs Passive — Global Breakdown

| Class | Active | Passive | Total |
|-------|--------|---------|-------|
| Warrior | 28 | 24 | 52 |
| Rogue/Ranger | 44 | 31 | 75 |
| **Total** | **72** | **55** | **127** |

---

*End of skill tree content. See SKILL-TREE-PROGRESS.md for implementation status of database schema, UI spec, and game system file updates.*
