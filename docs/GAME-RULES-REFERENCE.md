# 📋 GAME RULES REFERENCE — For Claude API Context

*This is a condensed version of the LEGO QUEST rules, optimized for injection into the Claude API system prompt during combat resolution. Keep this in sync with core-rules.md.*

---

## Stats (6 stats, all start at 3)

| Stat | Abbr | Role |
|------|------|------|
| Constitution | CON | HP (CON×3), resist poison/traps |
| Strength | STR | Melee damage, melee defense |
| Agility | AGI | Initiative, ranged accuracy, ranged defense, movement |
| Mana | MNA | Ability power, mana pool (MNA×15) |
| Intelligence | INT | Puzzles, crafting, spotting secrets |
| Luck | LCK | Crit range, loot quality, 1 free reroll/session |

**Stat Bonus** = Stat − 3. **Stat Cap** = 15.

## Combat

**Initiative:** d20 + AGI bonus. Highest first.
**Turn:** 1 Move (6 studs) + 1 Action + Resource Regen.

| Action | Resolution |
|--------|-----------|
| Melee Attack | d20 + STR bonus ≥ target STR + 8. Damage = attacker STR |
| Ranged Attack | d20 + AGI bonus ≥ target AGI + 8. Damage = weapon |
| Ability | Per ability rules. Costs resource. |
| Defend | +4 to defense until next turn |
| Help Friend | Ally gets +3 to next roll |
| Use Item | No roll needed |

**Nat 20** = auto-hit, double damage, something awesome.
**Nat 1** = auto-miss, something funny (never punishing).

**Crit range:** 20 always. LCK 5+ → 19–20. LCK 8+ → 18–20. LCK 12+ → 17–20.

**KO:** At 0 HP, knocked out (not dead). Revive: ally action (1 HP) or potion.

## Resources

| Resource | Who | Max | Regen |
|----------|-----|-----|-------|
| Rage | Knight | 100 | +15/hit taken, +10/melee hit, +25/crit taken, +20/ally KO |
| Energy | Rogue | 100 | +20/turn |
| Mana | Wizard, Healer, Ranger, Inventor | MNA×15 | +20/turn |

## Ability Costs by Tier

| Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Tier 6 | Ultimate |
|--------|--------|--------|--------|--------|--------|----------|
| 30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 100 |

## Difficulty

| Easy | Medium | Hard | Epic |
|------|--------|------|------|
| 8 | 12 | 16 | 20 |

## Loot (d20 + LCK bonus)

| Roll | Lvl 1–4 | Lvl 5–9 | Lvl 10+ | Boss |
|------|---------|---------|---------|------|
| 1–8 | 1 gold | 1 Common | 1 Uncommon | 1 Rare |
| 9–14 | 1 Common | 2 Common | 1 Rare | 2 Rare |
| 15–18 | 2 Common | 1 Uncommon | 1 Rare+1 Com | 1 Epic |
| 19 | 1 Uncommon | 1 Rare | 1 Epic | 1 Epic+1 Rare |
| 20+ | 1 Uncom+bonus | 1 Rare+bonus | 1 Epic+bonus | 1 Legendary! |

## Status Effect Categories

- **Buff** (green): positive bonuses (+attack, +defense, etc.)
- **Debuff** (red): negative penalties (−attack, vulnerable, etc.)
- **CC** (purple): prevents/limits actions (stun, root, blind, fear)
- **DoT** (orange): damage per turn (poison, burn, bleed)
- **HoT** (teal): healing per turn (regen, sanctuary)

## Narration Rules

- Target audience: kids ages 7 and 9
- Crits: go BIG with sound effects ("CRAAAASH!")
- Nat 1: funny, never mean
- Keep to 2–3 sentences max
- Use character names, not "Hero 1"
- Give monsters personality
