-- 007: Migrate to 4-stat system (STR, SPD, TGH, SMT)
-- Replaces: CON/STR/AGI/MNA/INT/LCK → STR/SPD/TGH/SMT
-- Replaces: resource pools (rage/energy/mana) → spell slots
-- Adds: MOV (movement), attack_range
-- FRESH START: truncates all data tables

-- ═══════════════════════════════════════════════════════════════
-- 1. CHARACTERS — drop old stat/resource columns, add new ones
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE characters
  DROP COLUMN IF EXISTS stat_con,
  DROP COLUMN IF EXISTS stat_agi,
  DROP COLUMN IF EXISTS stat_mna,
  DROP COLUMN IF EXISTS stat_int,
  DROP COLUMN IF EXISTS stat_lck,
  DROP COLUMN IF EXISTS gear_bonus_con,
  DROP COLUMN IF EXISTS gear_bonus_agi,
  DROP COLUMN IF EXISTS gear_bonus_mna,
  DROP COLUMN IF EXISTS gear_bonus_int,
  DROP COLUMN IF EXISTS gear_bonus_lck,
  DROP COLUMN IF EXISTS resource_type,
  DROP COLUMN IF EXISTS current_resource;

-- Rename existing stat_str / gear_bonus_str (they stay as STR)
-- Add new stat columns
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS stat_spd INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_tgh INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_smt INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS gear_bonus_spd INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gear_bonus_tgh INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gear_bonus_smt INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spell_slots_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mov INTEGER NOT NULL DEFAULT 3;

-- ═══════════════════════════════════════════════════════════════
-- 2. MONSTERS — drop old stat columns, add new ones + MOV/range
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE monsters
  DROP COLUMN IF EXISTS stat_con,
  DROP COLUMN IF EXISTS stat_agi,
  DROP COLUMN IF EXISTS stat_mna,
  DROP COLUMN IF EXISTS stat_int,
  DROP COLUMN IF EXISTS stat_lck;

ALTER TABLE monsters
  ADD COLUMN IF NOT EXISTS stat_spd INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_tgh INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_smt INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS mov INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS attack_range TEXT NOT NULL DEFAULT 'Melee';

-- ═══════════════════════════════════════════════════════════════
-- 3. ABILITIES — drop resource columns, add spell slot + range/aoe
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE abilities
  DROP COLUMN IF EXISTS resource_cost,
  DROP COLUMN IF EXISTS resource_type;

ALTER TABLE abilities
  ADD COLUMN IF NOT EXISTS slot_cost INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS range TEXT NOT NULL DEFAULT 'Self',
  ADD COLUMN IF NOT EXISTS aoe TEXT NOT NULL DEFAULT 'Single';

-- ═══════════════════════════════════════════════════════════════
-- 4. COMBAT PARTICIPANTS — update to match new system
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE combat_participants
  DROP COLUMN IF EXISTS stat_con,
  DROP COLUMN IF EXISTS stat_agi,
  DROP COLUMN IF EXISTS stat_mna,
  DROP COLUMN IF EXISTS stat_int,
  DROP COLUMN IF EXISTS stat_lck,
  DROP COLUMN IF EXISTS resource_type,
  DROP COLUMN IF EXISTS max_resource,
  DROP COLUMN IF EXISTS current_resource;

ALTER TABLE combat_participants
  ADD COLUMN IF NOT EXISTS stat_spd INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_tgh INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_smt INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS spell_slots_max INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spell_slots_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mov INTEGER NOT NULL DEFAULT 3;

-- ═══════════════════════════════════════════════════════════════
-- 5. GAME CONFIG — update defaults for 4-stat system
-- ═══════════════════════════════════════════════════════════════

-- Drop old resource columns
ALTER TABLE game_config
  DROP COLUMN IF EXISTS mana_pool_formula,
  DROP COLUMN IF EXISTS energy_pool_max,
  DROP COLUMN IF EXISTS rage_pool_max,
  DROP COLUMN IF EXISTS mana_regen_per_turn,
  DROP COLUMN IF EXISTS energy_regen_per_turn,
  DROP COLUMN IF EXISTS rage_on_hit_taken,
  DROP COLUMN IF EXISTS rage_on_melee_hit,
  DROP COLUMN IF EXISTS rage_on_crit_taken,
  DROP COLUMN IF EXISTS rage_on_ally_ko,
  DROP COLUMN IF EXISTS base_crit_value,
  DROP COLUMN IF EXISTS luck_crit_thresholds,
  DROP COLUMN IF EXISTS lucky_saves_per_session,
  DROP COLUMN IF EXISTS ability_costs,
  DROP COLUMN IF EXISTS short_rest_resource_restore;

-- Add new config columns
ALTER TABLE game_config
  ADD COLUMN IF NOT EXISTS spell_slot_progression JSONB DEFAULT '[0,2,2,3,3,4,4,5,5,6,6,7,7,7,8,8,8,8,8,10]',
  ADD COLUMN IF NOT EXISTS mov_by_profession JSONB DEFAULT '{"knight":3,"ranger":5,"wizard":3,"healer":4,"rogue":5,"inventor":3}',
  ADD COLUMN IF NOT EXISTS flanking_bonus INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS surrounding_bonus INTEGER DEFAULT 3,
  ADD COLUMN IF NOT EXISTS crit_on_nat20 BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS short_rest_slots_restore TEXT DEFAULT 'all';

-- Update defaults for existing columns
ALTER TABLE game_config
  ALTER COLUMN stat_count SET DEFAULT 4,
  ALTER COLUMN stat_names SET DEFAULT '["STR","SPD","TGH","SMT"]',
  ALTER COLUMN hp_formula SET DEFAULT 'TGH * 3',
  ALTER COLUMN melee_defense_formula SET DEFAULT 'target_TGH + 8',
  ALTER COLUMN ranged_defense_formula SET DEFAULT 'target_SPD + 8';

-- ═══════════════════════════════════════════════════════════════
-- 6. TRUNCATE DATA TABLES (fresh start)
-- ═══════════════════════════════════════════════════════════════

TRUNCATE combat_effects CASCADE;
TRUNCATE combat_participants CASCADE;
TRUNCATE combats CASCADE;
TRUNCATE character_abilities CASCADE;
TRUNCATE character_inventory CASCADE;
TRUNCATE character_seals CASCADE;
TRUNCATE characters CASCADE;
TRUNCATE monsters CASCADE;
TRUNCATE abilities CASCADE;
TRUNCATE game_config CASCADE;

-- Re-insert default game config
INSERT INTO game_config (
  stat_count, stat_names, stat_base_value, stat_cap, stat_bonus_formula,
  stat_points_per_level, hp_formula, spell_slot_progression, mov_by_profession,
  melee_defense_formula, ranged_defense_formula, defend_bonus, help_friend_bonus,
  flanking_bonus, surrounding_bonus, crit_on_nat20,
  difficulty_targets, short_rest_slots_restore,
  loot_tables, xp_awards, xp_thresholds
) VALUES (
  4,
  '["STR","SPD","TGH","SMT"]',
  3, 15, 'stat - 3',
  '[1,1,1,1,2,1,1,2,1,2,1,2,1,1,2,1,1,2,1,3]',
  'TGH * 3',
  '[0,2,2,3,3,4,4,5,5,6,6,7,7,7,8,8,8,8,8,10]',
  '{"knight":3,"ranger":5,"wizard":3,"healer":4,"rogue":5,"inventor":3}',
  'target_TGH + 8',
  'target_SPD + 8',
  4, 3, 2, 3, true,
  '{"easy":8,"medium":12,"hard":16,"epic":20}',
  'all',
  '{"1-4":{"1-8":"1 gold","9-14":"1 Common","15-18":"2 Common","19":"1 Uncommon","20":"1 Uncommon + bonus"},"5-9":{"1-8":"1 Common","9-14":"2 Common","15-18":"1 Uncommon","19":"1 Rare","20":"1 Rare + bonus"},"10+":{"1-8":"1 Uncommon","9-14":"1 Rare","15-18":"1 Rare + 1 Common","19":"1 Epic","20":"1 Epic + bonus"},"boss":{"1-8":"1 Rare","9-14":"2 Rare","15-18":"1 Epic","19":"1 Epic + 1 Rare","20":"1 Legendary"}}',
  '{"monster_at_level":[3,5],"monster_below_level":1,"boss":[10,15],"quest":[10,25],"puzzle":5,"creative_moment":[2,5],"help_player":2,"explore_area":3,"session_bonus":5}',
  '[0,10,25,45,70,100,140,190,250,320,400,500,620,760,920,1100,1300,1520,1760,2020]'
);
