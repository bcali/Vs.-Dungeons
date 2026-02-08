# 🌀 STATUS EFFECTS — Complete Reference

---

## Overview

Status effects are temporary modifiers applied to combatants during combat. They have a category, duration, visual icon, and mechanical effect. The system is designed to be extensible — new effects can be added via the GM config or Supabase without code changes.

---

## Effect Categories

| Category | Color | Border | Purpose |
|----------|-------|--------|---------|
| **Buff** | 🟢 Green | Green glow | Positive stat/combat bonuses |
| **Debuff** | 🔴 Red | Red glow | Negative stat/combat penalties |
| **CC** (Crowd Control) | 🟣 Purple | Purple glow | Prevents or limits actions |
| **DoT** (Damage over Time) | 🟠 Orange | Orange pulse | Deals damage each turn |
| **HoT** (Heal over Time) | 🩵 Teal | Teal pulse | Heals HP each turn |

---

## Standard Effects Library

### Crowd Control (CC)

| Effect | Icon | Duration | Mechanic |
|--------|------|----------|----------|
| **Stunned** | ⭐ stars | 1–2 turns | Cannot take any action. Skip turn. |
| **Frozen** | ❄️ snowflake | 1–3 turns | Cannot move or act. Breaks on damage. |
| **Rooted** | 🌿 vine | 1–2 turns | Cannot move. Can still attack/cast. |
| **Blinded** | 👁️ crossed eye | 1–2 turns | −5 to all attack rolls. |
| **Feared** | 😱 ghost | 1–2 turns | Must move away from source. Cannot attack source. |
| **Silenced** | 🔇 muted | 2–3 turns | Cannot use abilities. Basic attacks only. |
| **Slept** | 💤 zzz | 2–3 turns | Cannot act. Wakes on damage taken. |
| **Taunted** | 😤 anger | 2–3 turns | Must attack the taunter. Cannot target others. |
| **Knocked Down** | ⬇️ down arrow | 1 turn | Lose next action (getting up). |

### Debuffs

| Effect | Icon | Duration | Mechanic |
|--------|------|----------|----------|
| **Slowed** | 🐌 snail | 2–3 turns | Movement halved. −2 to all rolls. |
| **Weakened** | 💔 broken heart | 2–3 turns | −2 to STR. Reduced melee damage. |
| **Vulnerable** | 🎯 target | 2–3 turns | All incoming damage +3. |
| **Armor Break** | 🛡️ cracked shield | 2–3 turns | Defense target reduced by 3. |
| **Cursed** | 💀 skull | 3 turns | −1 to all stats. |
| **Disarmed** | ✋ open hand | 1–2 turns | Cannot use weapon. Unarmed damage only (1). |

### Buffs

| Effect | Icon | Duration | Mechanic |
|--------|------|----------|----------|
| **Attack Up** | ⚔️ crossed swords | 2–3 turns | +2 to attack rolls. |
| **Defense Up** | 🛡️ shield | 2–3 turns | +2 to defense (target number to hit is higher). |
| **Blessed** | ✨ sparkle | 3 turns | +2 to ALL rolls. |
| **Haste** | ⚡ lightning | 1–2 turns | Take 2 actions this turn. |
| **Shielded** | 🔵 bubble | Until broken | Absorbs next N damage, then expires. |
| **Invisible** | 👻 ghost outline | 1–3 turns | Cannot be targeted. Breaks on attack. |
| **Regenerating** | 💚 green heart | 3 turns | HoT: heal 3 HP per turn. |
| **Empowered** | 🔥 flame | 2–3 turns | +3 to ability damage. |
| **Guarded** | 🏰 castle | 2 turns | Take zero damage from next 2 attacks. |
| **Linked** | 🔗 chain | 3 turns | Damage split between linked characters. |

### Damage over Time (DoT)

| Effect | Icon | Duration | Mechanic |
|--------|------|----------|----------|
| **Poisoned** | ☠️ poison | 3 turns | 2–3 damage at start of turn. |
| **Burning** | 🔥 fire | 2–3 turns | 3–5 damage at start of turn. |
| **Bleeding** | 🩸 blood drop | 2–3 turns | 2 damage at start of turn. |
| **Electrified** | ⚡ zap | 1–2 turns | 4 damage at start of turn. |
| **Frost Burn** | 🧊 ice | 2 turns | 2 damage + movement −2 at start of turn. |
| **Corroding** | 🟢 acid | 2 turns | 3 damage + defense −1 at start of turn. |

### Heal over Time (HoT)

| Effect | Icon | Duration | Mechanic |
|--------|------|----------|----------|
| **Regenerating** | 💚 green heart | 3 turns | Heal 3–4 HP at start of turn. |
| **Blessed Aura** | 🌟 star | 3 turns | Heal 2 HP + remove 1 debuff at start of turn. |
| **Sanctuary** | 🏥 cross | 4 turns | Heal 4 HP at start of turn (area effect). |

---

## Effect Processing Rules

### When Effects Are Applied
- By Claude API response (most common during combat)
- By manual GM action (tap combatant → add effect)
- By ability resolution (ability defines effects in its `effect_json`)

### Start-of-Turn Processing Order

When a combatant's turn begins, process in this order:

1. **Tick DoT effects** — Apply damage from all active DoTs
2. **Tick HoT effects** — Apply healing from all active HoTs
3. **Decrement all durations** — Subtract 1 from remaining turns
4. **Remove expired effects** — Delete effects with 0 remaining turns
5. **Check CC effects** — If stunned/frozen/slept, skip the turn
6. **Regen resources** — Add Energy/Mana passive regen (not Rage)

### Stacking Rules

| Rule | Behavior |
|------|----------|
| Same effect, same source | Refresh duration (don't stack) |
| Same effect, different source | Stack if marked stackable; otherwise refresh |
| Different effects | Always co-exist |
| Max stacks | Stackable effects cap at 3 stacks |
| Multiple DoTs | All apply independently (poison + burning = both tick) |

### Special Interactions

| Interaction | Rule |
|------------|------|
| Frozen + Damage | Frozen breaks on damage (remove frozen after damage applied) |
| Sleep + Damage | Sleep breaks on damage |
| Invisible + Attack | Invisible breaks when attacking; attack is auto-crit |
| Stunned + Turn | Skip turn entirely |
| Shielded + Damage | Reduce shield value; remove shield when depleted |
| Taunted + Target | Must target taunter; cannot use abilities on others |

---

## UI Display Rules

### Icon Layout
- Effects shown as a row below the combatant's HP bar
- Maximum 6 icons visible; overflow shows "+N more" badge
- Tap "+N" to expand full list in popup

### Icon Size
- 28×28px minimum on tablet
- 4px gap between icons

### Duration Badge
- Small number badge in bottom-right corner of icon
- Shows remaining turns
- No badge if duration is permanent (until removed)

### Category Coloring
- Buff icons: green-tinted background
- Debuff icons: red-tinted background
- CC icons: purple-tinted background
- DoT icons: orange-tinted background with subtle pulse animation
- HoT icons: teal-tinted background with subtle glow animation

### Tooltip on Tap
Tapping an effect icon shows:
- Effect name
- Description
- Remaining duration
- Source (who applied it)
- [Remove] button (for GM manual removal)

### Animations
- **Applied:** Icon slides in from right with a pop
- **Ticking (DoT/HoT):** Brief pulse on the icon at start of turn
- **Expiring:** Icon fades out and shrinks
- **Removed manually:** Icon pops out with a small burst

---

## Database Representation

Each active effect is stored in `combat_effects`:

```json
{
  "id": "uuid",
  "combat_id": "uuid",
  "participant_id": "uuid",
  "effect_type": "stunned",
  "effect_category": "cc",
  "source_participant_id": "uuid",
  "remaining_turns": 1,
  "applied_at_round": 2,
  "value_json": {},
  "icon_name": "stun",
  "display_name": "Stunned",
  "description": "Cannot take any action. Skip turn."
}
```

---

## Adding New Effects

The system supports adding new effects without code changes:

1. **Add to `status_effect_definitions` table** — New effect type with icon, category, defaults
2. **Claude will learn it** — The combat system prompt pulls effect definitions dynamically
3. **UI renders automatically** — Generic icon + category coloring, tooltip from DB

For effects with unique mechanics (e.g., "linked" damage splitting), add handling in `lib/game/status-effects.ts`.
