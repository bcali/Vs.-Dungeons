# 🗄️ DATABASE — Supabase Schema & Migrations

---

## Entity Relationship Overview

```
game_config (1)
    │
campaigns (1) ──── sessions (many)
    │                   │
    │              combat_logs (many)
    │
characters (2) ─┬── character_abilities (many)
                ├── character_inventory (many)
                ├── character_seals (1 per char)
                ├── character_skill_allocations (many) ──── skill_tree_skills (1)
                ├── character_action_bar (up to 5) ─┬── skill_tree_skills (0..1)
                │                                   └── abilities (0..1)
                └── combat_participants (many) ──── combats (1)
                                                      │
                                                 combat_effects (many)

monsters (library) ── monster_abilities (many)
                  └── combat_participants (many)

abilities (reference library)
status_effect_definitions (reference library)
skill_tree_skills (reference library)
item_catalog (reference library)
```

---

## Tables

### 1. `game_config`

The GM's calibration dashboard values. Single row, updated in place.

```sql
CREATE TABLE game_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stat system
  stat_count INTEGER DEFAULT 6,
  stat_names JSONB DEFAULT '["CON","STR","AGI","MNA","INT","LCK"]',
  stat_base_value INTEGER DEFAULT 3,
  stat_cap INTEGER DEFAULT 15,
  stat_bonus_formula TEXT DEFAULT 'stat - 3',  -- displayed in UI, used by Claude context

  -- Stat points per level (JSON array, index = level - 1)
  stat_points_per_level JSONB DEFAULT '[1,1,1,1,2,1,1,2,1,2,1,2,1,1,2,1,1,2,1,3]',

  -- Derived stats
  hp_formula TEXT DEFAULT 'CON * 3',
  mana_pool_formula TEXT DEFAULT 'MNA * 15',
  energy_pool_max INTEGER DEFAULT 100,
  rage_pool_max INTEGER DEFAULT 100,
  movement_base INTEGER DEFAULT 6,

  -- Resource regen
  mana_regen_per_turn INTEGER DEFAULT 20,
  energy_regen_per_turn INTEGER DEFAULT 20,
  rage_on_hit_taken INTEGER DEFAULT 15,
  rage_on_melee_hit INTEGER DEFAULT 10,
  rage_on_crit_taken INTEGER DEFAULT 25,
  rage_on_ally_ko INTEGER DEFAULT 20,

  -- Combat formulas
  melee_defense_formula TEXT DEFAULT 'target_STR + 8',
  ranged_defense_formula TEXT DEFAULT 'target_AGI + 8',
  defend_bonus INTEGER DEFAULT 4,
  help_friend_bonus INTEGER DEFAULT 3,

  -- Crit / Luck
  base_crit_value INTEGER DEFAULT 20,
  luck_crit_thresholds JSONB DEFAULT '{"5":19, "8":18, "12":17}',
  lucky_saves_per_session INTEGER DEFAULT 1,

  -- Difficulty targets
  difficulty_targets JSONB DEFAULT '{"easy":8, "medium":12, "hard":16, "epic":20}',

  -- Ability costs by tier
  ability_costs JSONB DEFAULT '{"1":30, "2":[30,40], "3":[40,50], "4":[50,60], "5":[60,70], "6":[70,80], "ultimate":100}',

  -- Rest recovery
  short_rest_resource_restore INTEGER DEFAULT 30,

  -- Loot
  loot_tables JSONB DEFAULT '{
    "1-4": {"1-8":"1 gold","9-14":"1 Common","15-18":"2 Common","19":"1 Uncommon","20":"1 Uncommon + bonus"},
    "5-9": {"1-8":"1 Common","9-14":"2 Common","15-18":"1 Uncommon","19":"1 Rare","20":"1 Rare + bonus"},
    "10+": {"1-8":"1 Uncommon","9-14":"1 Rare","15-18":"1 Rare + 1 Common","19":"1 Epic","20":"1 Epic + bonus"},
    "boss": {"1-8":"1 Rare","9-14":"2 Rare","15-18":"1 Epic","19":"1 Epic + 1 Rare","20":"1 Legendary"}
  }',

  -- XP awards
  xp_awards JSONB DEFAULT '{
    "monster_at_level": [3,5],
    "monster_below_level": 1,
    "boss": [10,15],
    "quest": [10,25],
    "puzzle": 5,
    "creative_moment": [2,5],
    "help_player": 2,
    "explore_area": 3,
    "session_bonus": 5
  }',

  -- Level thresholds (JSON array, index = level - 1, value = XP needed)
  xp_thresholds JSONB DEFAULT '[0,10,25,45,70,100,140,190,250,320,400,500,620,760,920,1100,1300,1520,1760,2020]',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `campaigns`

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'LEGO QUEST Campaign',
  current_quest TEXT,
  party_level INTEGER DEFAULT 1,
  world_threat TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. `characters`

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Identity
  hero_name TEXT,
  player_name TEXT,  -- "Son, Age 9" or actual name
  player_age INTEGER,
  profession TEXT CHECK (profession IN ('knight','ranger','wizard','healer','rogue','inventor')),
  level INTEGER DEFAULT 1,
  rank TEXT DEFAULT 'Starting Hero',
  xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 8,

  -- Resource type (derived from profession but stored for quick access)
  resource_type TEXT CHECK (resource_type IN ('rage','energy','mana')),

  -- Base stats (before gear bonuses)
  stat_con INTEGER DEFAULT 3,
  stat_str INTEGER DEFAULT 3,
  stat_agi INTEGER DEFAULT 3,
  stat_mna INTEGER DEFAULT 3,
  stat_int INTEGER DEFAULT 3,
  stat_lck INTEGER DEFAULT 3,

  -- Gear bonuses (from equipped items)
  gear_bonus_con INTEGER DEFAULT 0,
  gear_bonus_str INTEGER DEFAULT 0,
  gear_bonus_agi INTEGER DEFAULT 0,
  gear_bonus_mna INTEGER DEFAULT 0,
  gear_bonus_int INTEGER DEFAULT 0,
  gear_bonus_lck INTEGER DEFAULT 0,

  -- Stat points available to spend
  unspent_stat_points INTEGER DEFAULT 1,  -- Level 1 gives +1

  -- Current combat state (persisted between sessions)
  current_hp INTEGER,  -- null = full, calculated from CON
  current_resource INTEGER,  -- null = full/0 depending on type

  -- Avatar (URL or local reference for the Lego minifig photo)
  avatar_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Computed columns via view or application logic:
-- total_con = stat_con + gear_bonus_con
-- max_hp = total_con * 3
-- stat_bonus(stat) = total_stat - 3
-- max_mana = total_mna * 15 (if resource_type = 'mana')
-- crit_range = based on total_lck (20 default, 19 if lck>=5, 18 if lck>=8, 17 if lck>=12)
```

### 4. `abilities` (Reference Library)

```sql
CREATE TABLE abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  profession TEXT NOT NULL,  -- 'knight','ranger','wizard','healer','rogue','inventor','universal'
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 7),  -- 7 = ultimate
  resource_cost INTEGER NOT NULL,
  resource_type TEXT,  -- null for universal (uses character's type)
  unlock_level INTEGER NOT NULL,
  description TEXT NOT NULL,
  effect_json JSONB,  -- structured effect data for combat engine
  -- effect_json example:
  -- {
  --   "type": "attack",
  --   "damage_formula": "STR * 2",
  --   "area": "single",
  --   "range": "melee",
  --   "effects": [
  --     {"type": "stun", "duration": 1},
  --     {"type": "knockback", "distance": 3}
  --   ]
  -- }
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_abilities_profession ON abilities(profession);
CREATE INDEX idx_abilities_tier ON abilities(tier);
```

### 5. `character_abilities`

```sql
CREATE TABLE character_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  ability_id UUID REFERENCES abilities(id) ON DELETE CASCADE,
  learned_at_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, ability_id)
);
```

### 6. `character_inventory`

```sql
CREATE TABLE character_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('weapon','armor','consumable','quest','misc')),
  quantity INTEGER DEFAULT 1,
  effect_json JSONB,  -- stat bonuses, damage, healing, etc.
  -- example: {"stat_bonuses": {"str": 2}, "damage_bonus": 3}
  equipped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, item_name)  -- enables inventory stacking via upsert
);
```

### 7. `character_seals`

```sql
CREATE TABLE character_seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  common INTEGER DEFAULT 0,
  uncommon INTEGER DEFAULT 0,
  rare INTEGER DEFAULT 0,
  epic INTEGER DEFAULT 0,
  legendary INTEGER DEFAULT 0,
  UNIQUE(character_id)
);
```

### 8. `monsters` (Pre-built Library)

```sql
CREATE TABLE monsters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  is_boss BOOLEAN DEFAULT false,
  category TEXT,  -- 'undead', 'beast', 'humanoid', 'elemental', 'construct', 'demon'

  -- Stats
  stat_con INTEGER NOT NULL,
  stat_str INTEGER NOT NULL,
  stat_agi INTEGER NOT NULL,
  stat_mna INTEGER NOT NULL,
  stat_int INTEGER NOT NULL,
  stat_lck INTEGER NOT NULL,

  -- Combat
  hp INTEGER NOT NULL,  -- usually CON * 3, bosses CON * 4-5
  damage INTEGER NOT NULL,
  damage_type TEXT DEFAULT 'physical',  -- 'physical','fire','ice','poison','holy','lightning'

  -- Special
  special_abilities JSONB,
  -- example: [
  --   {"name": "Summon Scouts", "trigger": "below_hp_50", "effect": "summon 2 goblin_scout"},
  --   {"name": "Fire Breath", "shape": "cone", "size": 4, "damage": 8}
  -- ]

  -- Rewards
  xp_reward INTEGER DEFAULT 0,

  -- Display
  description TEXT,
  avatar_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_monsters_level ON monsters(level);
CREATE INDEX idx_monsters_boss ON monsters(is_boss);
```

### 9. `monster_abilities`

```sql
CREATE TABLE monster_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monster_id UUID REFERENCES monsters(id) ON DELETE CASCADE,
  ability_name TEXT NOT NULL,
  resource_cost INTEGER DEFAULT 0,  -- most monsters don't use resources
  description TEXT NOT NULL,
  effect_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 10. `sessions`

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  adventure_name TEXT,
  duration_minutes INTEGER,
  summary TEXT,
  key_moments JSONB,  -- ["Defeated the Goblin King", "Found hidden chest"]
  xp_awarded JSONB,   -- {"hero_1_id": 15, "hero_2_id": 12}
  loot_awarded JSONB,  -- {"hero_1_id": {"gold": 5, "seals": {"common": 2}}, ...}
  level_ups JSONB,     -- {"hero_1_id": 2}  (new level)
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 11. `combats`

```sql
CREATE TABLE combats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT,  -- "Forest Path Ambush", "Goblin King Boss Fight"
  status TEXT DEFAULT 'active' CHECK (status IN ('setup','active','rewards','completed','abandoned')),
  current_turn INTEGER DEFAULT 0,
  current_combatant_id UUID,  -- FK to combat_participants
  initiative_order JSONB,  -- ordered array of participant IDs
  round_number INTEGER DEFAULT 1,
  rewards_json JSONB,  -- XP and loot awarded after combat
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

### 12. `combat_participants`

```sql
CREATE TABLE combat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,

  -- Link to either a character or a monster template
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  monster_id UUID REFERENCES monsters(id) ON DELETE SET NULL,

  -- Instance data (copied from source, modified during combat)
  display_name TEXT NOT NULL,
  team TEXT CHECK (team IN ('hero','enemy')),

  -- Current stats (snapshot at combat start, may be modified by buffs/debuffs)
  stat_con INTEGER NOT NULL,
  stat_str INTEGER NOT NULL,
  stat_agi INTEGER NOT NULL,
  stat_mna INTEGER NOT NULL,
  stat_int INTEGER NOT NULL,
  stat_lck INTEGER NOT NULL,

  -- Combat state
  max_hp INTEGER NOT NULL,
  current_hp INTEGER NOT NULL,
  resource_type TEXT,  -- 'rage','energy','mana', null for monsters
  max_resource INTEGER,
  current_resource INTEGER DEFAULT 0,
  initiative_roll INTEGER,
  is_active BOOLEAN DEFAULT true,  -- false = knocked out / defeated
  position_x INTEGER,  -- optional grid position
  position_y INTEGER,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_participants_combat ON combat_participants(combat_id);
```

### 13. `combat_effects` (Active Status Effects)

```sql
CREATE TABLE combat_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES combat_participants(id) ON DELETE CASCADE,

  effect_type TEXT NOT NULL,  -- 'stun','poison','burn','slow','blind','buff_attack','buff_defense', etc.
  effect_category TEXT CHECK (effect_category IN ('buff','debuff','cc','dot','hot')),
  source_participant_id UUID REFERENCES combat_participants(id),  -- who applied it

  -- Duration
  remaining_turns INTEGER,  -- null = permanent until removed
  applied_at_round INTEGER,

  -- Effect values
  value_json JSONB,
  -- examples:
  -- stun: {}
  -- poison: {"damage_per_turn": 3}
  -- buff_attack: {"bonus": 2}
  -- slow: {"movement_reduction": 3, "roll_penalty": 2}
  -- blind: {"attack_penalty": 5}

  -- Display
  icon_name TEXT,  -- maps to frontend icon component
  display_name TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_effects_participant ON combat_effects(participant_id);
CREATE INDEX idx_effects_combat ON combat_effects(combat_id);
```

### 14. `combat_logs`

```sql
CREATE TABLE combat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  round_number INTEGER,
  turn_number INTEGER,
  timestamp TIMESTAMPTZ DEFAULT now(),

  -- Action details
  actor_id UUID REFERENCES combat_participants(id),
  action_type TEXT,  -- 'melee_attack','ranged_attack','ability','item','defend','help','move'
  ability_name TEXT,
  target_ids UUID[],  -- can target multiple

  -- Resolution
  roll_value INTEGER,
  target_number INTEGER,
  success BOOLEAN,
  damage_dealt INTEGER,
  healing_done INTEGER,
  effects_applied JSONB,  -- [{type, target_id, duration}]
  resource_spent INTEGER,

  -- Claude
  voice_transcript TEXT,  -- original spoken input
  claude_response JSONB,  -- full Claude API response
  narration TEXT,  -- Claude's cinematic description

  -- State snapshot (optional, for replay)
  state_snapshot JSONB
);

CREATE INDEX idx_logs_combat ON combat_logs(combat_id);
CREATE INDEX idx_logs_timestamp ON combat_logs(timestamp);
```

### 15. `status_effect_definitions` (Reference Library)

```sql
CREATE TABLE status_effect_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  effect_type TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('buff','debuff','cc','dot','hot')),
  display_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,  -- icon component identifier
  color TEXT,  -- hex color for UI theming
  default_duration INTEGER,  -- default turns, null = varies
  stackable BOOLEAN DEFAULT false,
  value_schema JSONB,  -- describes what value_json should contain
  -- example: {"damage_per_turn": "integer", "movement_reduction": "integer"}
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 16. `skill_tree_skills` (Reference Library)

```sql
CREATE TABLE skill_tree_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('warrior', 'rogue_ranger')),
  branch TEXT NOT NULL CHECK (branch IN ('protection', 'arms', 'warrior_core', 'shadow', 'precision', 'survival', 'rogue_ranger_core')),
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 5),
  skill_type TEXT NOT NULL CHECK (skill_type IN ('active', 'passive')),
  max_rank INTEGER NOT NULL CHECK (max_rank BETWEEN 1 AND 3),
  description TEXT NOT NULL,
  rank_effects JSONB,
  lego_tip TEXT,
  effect_json JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_tree_class ON skill_tree_skills(class);
CREATE INDEX idx_skill_tree_branch ON skill_tree_skills(branch);
```

### 17. `character_skill_allocations`

```sql
CREATE TABLE character_skill_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skill_tree_skills(id) ON DELETE CASCADE,
  current_rank INTEGER NOT NULL DEFAULT 1 CHECK (current_rank >= 1),
  learned_at_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, skill_id)
);
```

### 18. `character_action_bar`

```sql
CREATE TABLE character_action_bar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 5),
  skill_id UUID REFERENCES skill_tree_skills(id) ON DELETE SET NULL,
  ability_id UUID REFERENCES abilities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, slot_number),
  CHECK (
    (skill_id IS NOT NULL AND ability_id IS NULL) OR
    (skill_id IS NULL AND ability_id IS NOT NULL) OR
    (skill_id IS NULL AND ability_id IS NULL)
  )
);
```

### 19. `item_catalog` (Reference Library)

```sql
CREATE TABLE item_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('weapon','armor','consumable','quest','misc')),
  rarity TEXT CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  description TEXT,
  effect_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_item_catalog_type ON item_catalog(item_type);
CREATE INDEX idx_item_catalog_rarity ON item_catalog(rarity);
```

---

## Stored Functions

### `increment_xp(character_uuid UUID, amount INTEGER)` -> `INTEGER`

Atomically increments a character's XP, preventing race conditions from concurrent awards. Returns the new XP total.

```sql
CREATE OR REPLACE FUNCTION increment_xp(character_uuid UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_xp INTEGER;
BEGIN
  UPDATE characters
  SET xp = xp + amount
  WHERE id = character_uuid
  RETURNING xp INTO new_xp;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character % not found', character_uuid;
  END IF;

  RETURN new_xp;
END;
$$;
```

### `allocate_skill_point(p_character_id UUID, p_skill_id UUID)` -> `INTEGER`

Validates and allocates one skill point to a skill tree skill. Checks available points (level - spent), max rank, and tier gating (branch point thresholds: tier 1=0, 2=3, 3=6, 4=10, 5=15). Returns the new rank.

```sql
CREATE OR REPLACE FUNCTION allocate_skill_point(p_character_id UUID, p_skill_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_skill RECORD;
  v_char_level INTEGER;
  v_spent INTEGER;
  v_available INTEGER;
  v_current_rank INTEGER;
  v_branch_points INTEGER;
  v_tier_requirement INTEGER;
BEGIN
  -- 1. Look up the skill
  SELECT * INTO v_skill FROM skill_tree_skills WHERE id = p_skill_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Skill % not found', p_skill_id;
  END IF;

  -- 2. Get character level
  SELECT level INTO v_char_level FROM characters WHERE id = p_character_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character % not found', p_character_id;
  END IF;

  -- 3. Compute total spent points (sum of current_rank from allocations)
  SELECT COALESCE(SUM(csa.current_rank), 0)
    INTO v_spent
    FROM character_skill_allocations csa
   WHERE csa.character_id = p_character_id;

  -- 4. Check available points (level - spent >= 1)
  v_available := v_char_level - v_spent;
  IF v_available < 1 THEN
    RAISE EXCEPTION 'No skill points available (level=%, spent=%)', v_char_level, v_spent;
  END IF;

  -- 5. Check max rank not exceeded
  SELECT COALESCE(csa.current_rank, 0)
    INTO v_current_rank
    FROM character_skill_allocations csa
   WHERE csa.character_id = p_character_id
     AND csa.skill_id = p_skill_id;

  IF NOT FOUND THEN
    v_current_rank := 0;
  END IF;

  IF v_current_rank >= v_skill.max_rank THEN
    RAISE EXCEPTION 'Skill % is already at max rank (%)', v_skill.name, v_skill.max_rank;
  END IF;

  -- 6. For non-core branches, check tier gating
  IF v_skill.branch NOT IN ('warrior_core', 'rogue_ranger_core') THEN
    SELECT COALESCE(SUM(csa.current_rank), 0)
      INTO v_branch_points
      FROM character_skill_allocations csa
      JOIN skill_tree_skills sts ON sts.id = csa.skill_id
     WHERE csa.character_id = p_character_id
       AND sts.branch = v_skill.branch;

    CASE v_skill.tier
      WHEN 1 THEN v_tier_requirement := 0;
      WHEN 2 THEN v_tier_requirement := 3;
      WHEN 3 THEN v_tier_requirement := 6;
      WHEN 4 THEN v_tier_requirement := 10;
      WHEN 5 THEN v_tier_requirement := 15;
      ELSE v_tier_requirement := 0;
    END CASE;

    IF v_branch_points < v_tier_requirement THEN
      RAISE EXCEPTION 'Need % points in % branch for tier % (have %)',
        v_tier_requirement, v_skill.branch, v_skill.tier, v_branch_points;
    END IF;
  END IF;

  -- 7. Upsert into character_skill_allocations
  INSERT INTO character_skill_allocations (character_id, skill_id, current_rank, learned_at_level)
  VALUES (p_character_id, p_skill_id, 1, v_char_level)
  ON CONFLICT (character_id, skill_id)
  DO UPDATE SET current_rank = character_skill_allocations.current_rank + 1,
                updated_at = now();

  -- 8. Return the new rank
  SELECT csa.current_rank INTO v_current_rank
    FROM character_skill_allocations csa
   WHERE csa.character_id = p_character_id
     AND csa.skill_id = p_skill_id;

  RETURN v_current_rank;
END;
$$;
```

### `respec_character(p_character_id UUID)` -> `void`

Removes all skill allocations for a character and clears skill references from the action bar.

```sql
CREATE OR REPLACE FUNCTION respec_character(p_character_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM character_skill_allocations WHERE character_id = p_character_id;
  UPDATE character_action_bar SET skill_id = NULL WHERE character_id = p_character_id AND skill_id IS NOT NULL;
END;
$$;
```

### `add_inventory_item(p_character_id UUID, p_item_name TEXT, p_item_type TEXT, p_quantity INTEGER, p_effect_json JSONB)` -> `UUID`

Upserts an item into a character's inventory with stacking. If the item already exists (by character_id + item_name), the quantity is incremented. Returns the inventory row id.

```sql
CREATE OR REPLACE FUNCTION add_inventory_item(
  p_character_id UUID,
  p_item_name TEXT,
  p_item_type TEXT DEFAULT 'misc',
  p_quantity INTEGER DEFAULT 1,
  p_effect_json JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO character_inventory (character_id, item_name, item_type, quantity, effect_json)
  VALUES (p_character_id, p_item_name, p_item_type, p_quantity, p_effect_json)
  ON CONFLICT (character_id, item_name) DO UPDATE
    SET quantity = character_inventory.quantity + EXCLUDED.quantity
  RETURNING id INTO result_id;
  RETURN result_id;
END;
$$;
```

---

## Migrations

All migrations live in `supabase/migrations/` and are applied in order:

1. `001_initial_schema.sql` — All base tables (game_config through status_effect_definitions)
2. `002_rls_policies.sql` — Hardened RLS policies replacing permissive allow_all
3. `003_atomic_xp.sql` — `increment_xp()` stored function
4. `004_skill_trees.sql` — `skill_tree_skills`, `character_skill_allocations`, `character_action_bar` tables + `allocate_skill_point()` and `respec_character()` functions
5. `005_rewards_system.sql` — `xp_reward` on monsters, `rewards_json` on combats, `item_catalog` table, inventory unique constraint, `add_inventory_item()` function

### `001_initial_schema.sql` — Base tables in dependency order:

1. `game_config`
2. `campaigns`
3. `sessions`
4. `characters`
5. `character_seals`
6. `abilities`
7. `character_abilities`
8. `character_inventory`
9. `monsters`
10. `monster_abilities`
11. `combats`
12. `combat_participants`
13. `combat_effects`
14. `combat_logs`
15. `status_effect_definitions`

---

## Seed Data

Seed SQL is embedded in the initial migration and subsequent migrations. Data seeded includes:

### Default Game Config
Insert one row with all defaults (matches core-rules.md).

### Monster Library
Seed all monsters from core-rules.md:

**Level 1:** Goblin Scout, Skeleton, Giant Rat, Slime, Bandit, Goblin King (boss)
**Level 5:** Orc Warrior, Dark Mage, Stone Golem, Wolf Pack, Shadow Thief, Dragon Hatchling (boss)
**Level 10:** Troll, Lich, Giant Spider, Minotaur, Elemental, Ancient Dragon (boss)

### Ability Library
Seed all abilities from spellbook.md — every profession ability + universal abilities.

### Status Effect Definitions
Seed all standard effects (see STATUS-EFFECTS.md for full list).

### Skill Tree Skills
Seeded via `004_skill_trees.sql` seed data or application-level inserts — warrior and rogue/ranger skill trees with protection, arms, shadow, precision, survival, and core branches.

---

## Views

### `character_full` — Character with computed fields

```sql
CREATE OR REPLACE VIEW character_full AS
SELECT
  c.*,
  -- Total stats
  (c.stat_con + c.gear_bonus_con) as total_con,
  (c.stat_str + c.gear_bonus_str) as total_str,
  (c.stat_agi + c.gear_bonus_agi) as total_agi,
  (c.stat_mna + c.gear_bonus_mna) as total_mna,
  (c.stat_int + c.gear_bonus_int) as total_int,
  (c.stat_lck + c.gear_bonus_lck) as total_lck,
  -- Stat bonuses
  (c.stat_con + c.gear_bonus_con - 3) as bonus_con,
  (c.stat_str + c.gear_bonus_str - 3) as bonus_str,
  (c.stat_agi + c.gear_bonus_agi - 3) as bonus_agi,
  (c.stat_mna + c.gear_bonus_mna - 3) as bonus_mna,
  (c.stat_int + c.gear_bonus_int - 3) as bonus_int,
  (c.stat_lck + c.gear_bonus_lck - 3) as bonus_lck,
  -- Derived
  ((c.stat_con + c.gear_bonus_con) * 3) as max_hp,
  CASE
    WHEN c.resource_type = 'mana' THEN (c.stat_mna + c.gear_bonus_mna) * 15
    WHEN c.resource_type = 'energy' THEN 100
    WHEN c.resource_type = 'rage' THEN 100
    ELSE 0
  END as max_resource,
  CASE
    WHEN (c.stat_lck + c.gear_bonus_lck) >= 12 THEN 17
    WHEN (c.stat_lck + c.gear_bonus_lck) >= 8 THEN 18
    WHEN (c.stat_lck + c.gear_bonus_lck) >= 5 THEN 19
    ELSE 20
  END as crit_range
FROM characters c;
```

---

## Supabase RLS (Row Level Security)

Since this is single-user with no auth, RLS can be permissive:

```sql
-- Allow all operations on all tables (no auth needed)
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON game_config FOR ALL USING (true) WITH CHECK (true);

-- Repeat for all tables...
```

---

## Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON game_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON character_skill_allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```
