# 🤖 SKILL TREE — Claude API Context Rules

*Condensed rules injected into Claude's system prompt during combat resolution.*
*Append this section to the existing GAME-RULES-REFERENCE.md.*

---

## Addition to Claude Combat System Prompt

The following block should be appended to the existing `combat-prompt.ts` system prompt, after the core combat rules and before the combat state JSON.

```
## SKILL TREE SYSTEM

Characters have skill trees with active abilities and passive bonuses. Both affect combat.

### Action Bar
- Each character has a 5-slot action bar with equipped active abilities
- Abilities come from TWO sources: skill tree (free to use, some have cooldowns) and spellbook (cost spell slots)
- Normal melee/ranged attacks are always available and don't take a slot
- The action bar is provided in the combat state for each hero

### Skill Tree Abilities vs Spellbook Spells
| Property | Skill Tree Ability | Spellbook Spell |
|----------|-------------------|-----------------|
| Cost | Free (no resource) | Costs spell slots |
| Limit | Some have cooldowns (once per encounter, etc.) | Limited by slot count |
| Source | Talent tree points | Learned at level milestones |

### Passive Skills
- Passive bonuses are ALWAYS active in combat — no action needed
- They modify stats, damage, defense, or add triggered effects
- The character's active passives are listed in the combat state
- ALWAYS apply passive bonuses when calculating damage, defense, HP, etc.

### Common Passive Effects to Watch For
- **Shield Mastery** (Protection): +defense when shield equipped
- **Battle Stance** (Protection): Reduce incoming damage by flat amount
- **Toughened Hide / Thick Skin** (Protection): Bonus max HP
- **Rallying Presence** (Protection): Aura — allies within range get +defense
- **Regeneration** (Protection): Heal HP at start of turn
- **Weapon Specialization** (Arms): +damage with equipped weapon type
- **Critical Training** (Arms): Improved crit range
- **Berserker's Fury** (Arms): Bonus damage when below half HP
- **Deadly Momentum** (Arms): Chain kill bonus
- **Shadow Walker** (Shadow): +stealth rolls
- **Assassin's Instinct** (Shadow): Bonus crit damage from stealth
- **Steady Aim** (Precision): +ranged attack when stationary
- **Eagle Eye** (Precision): Extended range
- **Pet Commander** (Survival): Pet stat bonuses
- **Trap Mastery** (Survival): Enhanced trap effects

### React Abilities
Some active skills are "React" — triggered as free actions on specific events:
- **Revenge** (Protection): After being hit by melee → bonus damage on next attack
- **Counter Strike** (Protection): When enemy misses melee → free attack
- **Roll Away** (Rogue Core): When enemy moves adjacent → free 3-stud move
- **Vanish** (Rogue): When attacked → become invisible + move

When resolving combat, CHECK if the target has any react abilities that trigger.

### Resolving Skill Tree Abilities
When a hero uses a skill tree ability:
1. Check it's on their action bar (provided in state)
2. No resource cost (unlike spells), but check cooldown if applicable
3. Resolve using the effect described in the ability's effect_json
4. Apply damage, status effects, or buffs as described
5. Track cooldowns in state if "once per encounter" or similar
6. Narrate it cinematically — these are the hero's signature moves!

### Important: Narrate the Build Fantasy
- Protection warriors: emphasize shield blocks, teammate protection, being an immovable wall
- Arms warriors: emphasize devastating hits, cleaving multiple enemies, berserker rage
- Shadow rogues: emphasize stealth, appearing from nowhere, massive backstab damage
- Precision rangers: emphasize perfect aim, headshots, arrows finding their mark
- Survival rangers: emphasize traps springing, pet attacks, nature's fury
```

---

## Updated Combat State JSON Schema

Add these fields to the hero participant objects in the combat state JSON:

```typescript
// In the combatState sent to Claude with each action
interface HeroParticipant {
  // ... existing fields (id, name, stats, hp, etc.)
  
  // NEW: Skill Tree Fields
  action_bar: ActionBarEntry[];
  active_passives: ActivePassive[];
  skill_cooldowns: SkillCooldown[];
}

interface ActionBarEntry {
  slot: number;                    // 1-5
  source: 'skill_tree' | 'spellbook';
  name: string;
  description: string;
  effect: Record<string, any>;     // Parsed effect_json
  rank?: number;                   // Current rank if skill_tree
  cooldown_status?: 'ready' | 'used_this_encounter';
}

interface ActivePassive {
  name: string;
  branch: string;
  rank: number;
  effect_summary: string;          // Human-readable, e.g. "+3 defense (shield)"
}

interface SkillCooldown {
  skill_name: string;
  status: 'ready' | 'used';
  resets: 'per_encounter' | 'per_turn' | 'per_rest';
}
```

### Example Combat State (Hero with Skill Tree)

```json
{
  "id": "hero_1",
  "display_name": "Sir Bricksworth",
  "team": "hero",
  "profession": "warrior",
  "stats": { "con": 6, "str": 8, "agi": 4, "mna": 3, "int": 3, "lck": 5 },
  "current_hp": 18,
  "max_hp": 18,
  "resource_type": "rage",
  "current_resource": 45,
  "max_resource": 100,
  
  "action_bar": [
    {
      "slot": 1,
      "source": "skill_tree",
      "name": "Shield Bash",
      "description": "Melee: STR damage + push 2 studs. Stun 1 turn if hits wall/enemy.",
      "effect": {"action_type":"melee_attack","damage":"STR","push":2,"stun_on_wall":1},
      "rank": 1
    },
    {
      "slot": 2,
      "source": "skill_tree",
      "name": "Taunt",
      "description": "Force one enemy within 4 studs to attack only you for 2 turns.",
      "effect": {"action_type":"taunt","range":4,"duration":2},
      "rank": 1
    },
    {
      "slot": 3,
      "source": "spellbook",
      "name": "War Shout",
      "description": "All allies within 4 studs get +1 to next attack roll.",
      "effect": {"buff":"attack","bonus":1,"range":4,"targets":"allies"}
    },
    {
      "slot": 4,
      "source": "spellbook",
      "name": "Rally Cry",
      "description": "One ally recovers 5 HP and gets +2 to all rolls this turn.",
      "effect": {"heal":5,"buff":"all_rolls","bonus":2,"duration":1}
    },
    {
      "slot": 5,
      "source": "skill_tree",
      "name": "Iron Wall",
      "description": "Block next 2 attacks completely. Uses your action.",
      "effect": {"action_type":"defend","blocks":2},
      "rank": 1,
      "cooldown_status": "ready"
    }
  ],
  
  "active_passives": [
    {"name":"Shield Mastery","branch":"protection","rank":3,"effect_summary":"+3 defense (shield equipped)"},
    {"name":"Toughened Hide","branch":"protection","rank":2,"effect_summary":"+4 max HP"},
    {"name":"Battle Stance","branch":"protection","rank":1,"effect_summary":"Reduce incoming damage by 1"}
  ],
  
  "skill_cooldowns": [
    {"skill_name":"Iron Wall","status":"ready","resets":"per_encounter"}
  ]
}
```

---

## Claude Response Updates

When Claude resolves actions involving skill tree abilities, the response JSON should include:

```json
{
  "action": "Shield Bash",
  "action_source": "skill_tree",
  "resource_cost": null,
  "cooldown_triggered": false,
  
  "passives_applied": [
    {"name": "Shield Mastery", "effect": "+3 to defense target number"},
    {"name": "Battle Stance", "effect": "Incoming damage reduced by 1"}
  ],
  
  "react_triggers": [
    {"skill": "Counter Strike", "owner": "hero_1", "triggered": false, "reason": "Attack hit, not missed"}
  ],
  
  "narration": "Sir Bricksworth SLAMS his shield forward — CRACK! The goblin goes flying back 2 studs and crashes into the cave wall! Stunned for a turn! The knight's well-worn shield barely has a scratch — years of mastery have made it an extension of his arm."
}
```

---

## Prompt Engineering Notes for Claude Code

### Building the System Prompt

In `src/lib/claude/combat-prompt.ts`, the skill tree context is injected dynamically:

```typescript
function buildSkillTreeContext(heroes: HeroParticipant[]): string {
  let context = '## ACTIVE HERO ABILITIES & PASSIVES\n\n';
  
  for (const hero of heroes) {
    context += `### ${hero.display_name}\n`;
    context += `Action Bar: ${hero.action_bar.map(a => 
      `[${a.slot}] ${a.name} (${a.source})`
    ).join(', ')}\n`;
    
    if (hero.active_passives.length > 0) {
      context += `Always-On Passives:\n`;
      for (const p of hero.active_passives) {
        context += `- ${p.name} (Rank ${p.rank}): ${p.effect_summary}\n`;
      }
    }
    context += '\n';
  }
  
  return context;
}
```

### Token Budget

Skill tree context adds approximately:
- Static rules block: ~400 tokens
- Per hero (action bar + passives): ~150-200 tokens
- Total for 2 heroes: ~700-800 additional tokens

This fits comfortably within the existing ~4000 token budget for the combat system prompt.

### Validation Rules for Claude

Include these validation reminders in the system prompt:

```
SKILL TREE VALIDATION RULES:
1. A hero can ONLY use abilities on their action bar (5 slots)
2. Skill tree abilities are FREE — no spell slot cost
3. Spellbook abilities still cost spell slots as normal
4. ALWAYS check and apply passive bonuses to damage/defense calculations
5. Check for react abilities when resolving attacks against a hero
6. Track cooldowns — once-per-encounter abilities can't be used twice
7. Normal melee/ranged attacks are always available regardless of action bar
8. If a hero tries to use an ability not on their bar, suggest their available options
```
