# 🌳 Skill Tree Implementation — Progress Tracker

*Created: 2026-02-08*
*Last Updated: 2026-02-08*

---

## Design Decisions (Locked In)

| Decision | Choice |
|----------|--------|
| **Passives vs Actives** | Mix of active skills + passive bonuses (WoW-style) |
| **Action Bar** | 5 active ability slots only (passives always-on once learned) |
| **Tree Gating** | Spend X points in branch to unlock next tier (WoW classic style) |
| **Skill Ranks** | Some skills have 2–3 ranks, 1 point per rank |
| **System Integration** | Extends existing spellbook — trees add on top, don't replace |
| **Respec** | Free respec anytime (kids experiment freely) |
| **Points per Level** | 1 skill point per level (20 levels = 20 points) |
| **Classes** | Warrior (2 branches) + Rogue/Ranger (3 branches) first |

### Tier Gating

| Tier | Points Required in Branch |
|------|--------------------------|
| Tier 1 | 0 points |
| Tier 2 | 3 points |
| Tier 3 | 6 points |
| Tier 4 | 10 points |
| Tier 5 (Capstone) | 15 points |

---

## Task List

### Phase 1 — Skill Tree Design (Game Content)

| # | Task | File | Status |
|---|------|------|--------|
| 1 | System overview + mechanics rules | `skill-trees.md` (section 1) | ✅ Complete |
| 2 | Warrior — Protection branch (~23 skills) | `skill-trees.md` (section 2) | ⬜ Not started |
| 3 | Warrior — Arms branch (~23 skills) | `skill-trees.md` (section 3) | ⬜ Not started |
| 4 | Warrior — Core shared skills (~6 skills) | `skill-trees.md` (section 4) | ⬜ Not started |
| 5 | Rogue/Ranger — Shadow branch (~20 skills) | `skill-trees.md` (section 5) | ⬜ Not started |
| 6 | Rogue/Ranger — Precision branch (~20 skills) | `skill-trees.md` (section 6) | ⬜ Not started |
| 7 | Rogue/Ranger — Survival branch (~20 skills) | `skill-trees.md` (section 7) | ⬜ Not started |
| 8 | Rogue/Ranger — Core shared skills (~6 skills) | `skill-trees.md` (section 8) | ⬜ Not started |

### Phase 2 — Game System File Updates

| # | Task | File | Status |
|---|------|------|--------|
| 9 | Add skill point progression rules | `game-rules/core-rules.md` | ⬜ Not started |
| 10 | Add integration notes (extends spellbook) | `game-rules/spellbook.md` | ⬜ Not started |
| 11 | Add skill tree tracking to character sheets | `game-rules/character-sheets.md` | ⬜ Not started |
| 12 | Add skill tree GM guidance | `game-rules/game-master-prompt.md` | ⬜ Not started |

### Phase 3 — Codebase / Docs Updates

| # | Task | File | Status |
|---|------|------|--------|
| 13 | Supabase migration for skill tree tables | `supabase/migrations/004_skill_trees.sql` | ⬜ Not started |
| 14 | UI component spec for skill tree in character sheet | `docs/SKILL-TREES-SPEC.md` | ⬜ Not started |
| 15 | Condensed rules for Claude API context window | `docs/GAME-RULES-REFERENCE.md` (additions) | ⬜ Not started |

### Phase 4 — Seed Data

| # | Task | File | Status |
|---|------|------|--------|
| 16 | All Warrior skills as DB seed data | `supabase/seed/skill_trees_warrior.sql` | ⬜ Not started |
| 17 | All Rogue/Ranger skills as DB seed data | `supabase/seed/skill_trees_rogue_ranger.sql` | ⬜ Not started |

---

## Skill Count Targets

| Class | Branch | Active | Passive | Total Skills | Total Ranks |
|-------|--------|--------|---------|-------------|-------------|
| Warrior | Protection | ~12 | ~11 | ~23 | ~44 |
| Warrior | Arms | ~12 | ~11 | ~23 | ~44 |
| Warrior | Core | ~3 | ~3 | ~6 | ~10 |
| Rogue/Ranger | Shadow | ~11 | ~9 | ~20 | ~38 |
| Rogue/Ranger | Precision | ~11 | ~9 | ~20 | ~38 |
| Rogue/Ranger | Survival | ~11 | ~9 | ~20 | ~38 |
| Rogue/Ranger | Core | ~3 | ~3 | ~6 | ~10 |
| **TOTALS** | | **~63** | **~55** | **~118** | **~222** |

> With 20 skill points per character, each build uses ~9–17% of available ranks. This guarantees 5+ unique viable builds per class.

---

## Build Archetypes (Target Fantasies)

### Warrior Builds
- **The Wall** — Deep Protection, max survivability, party bodyguard
- **The Berserker** — Deep Arms, max damage, crit machine
- **The Captain** — Split Protection/Arms, buffs allies + solid damage
- **The Brawler** — Arms core + Protection survivability dip

### Rogue/Ranger Builds
- **The Assassin** — Deep Shadow, stealth one-shot burst
- **The Sniper** — Deep Precision, ranged crit machine
- **The Trapper** — Deep Survival, area denial + pet companion
- **The Scout** — Precision/Survival split, mobile utility
- **The Shadow Archer** — Shadow stealth + Precision ranged combo

---

## Notes

- All skills are designed so a 10-year-old can understand the effect in one sentence
- Every skill has a "cool factor" — flashy, fun, or funny
- Physical Lego tie-ins noted where applicable (gear pieces = bonuses)
- Skills designed to work with existing spellbook abilities, not conflict
- Database schema supports future classes (Wizard, Healer, Inventor trees)
