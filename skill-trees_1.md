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
