-- LEGO QUEST — Initial Schema
-- Run this in Supabase SQL editor or via `supabase db push`

-- Helper: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Game Config
CREATE TABLE game_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_count INTEGER DEFAULT 6,
  stat_names JSONB DEFAULT '["CON","STR","AGI","MNA","INT","LCK"]',
  stat_base_value INTEGER DEFAULT 3,
  stat_cap INTEGER DEFAULT 15,
  stat_bonus_formula TEXT DEFAULT 'stat - 3',
  stat_points_per_level JSONB DEFAULT '[1,1,1,1,2,1,1,2,1,2,1,2,1,1,2,1,1,2,1,3]',
  hp_formula TEXT DEFAULT 'CON * 3',
  mana_pool_formula TEXT DEFAULT 'MNA * 15',
  energy_pool_max INTEGER DEFAULT 100,
  rage_pool_max INTEGER DEFAULT 100,
  movement_base INTEGER DEFAULT 6,
  mana_regen_per_turn INTEGER DEFAULT 20,
  energy_regen_per_turn INTEGER DEFAULT 20,
  rage_on_hit_taken INTEGER DEFAULT 15,
  rage_on_melee_hit INTEGER DEFAULT 10,
  rage_on_crit_taken INTEGER DEFAULT 25,
  rage_on_ally_ko INTEGER DEFAULT 20,
  melee_defense_formula TEXT DEFAULT 'target_STR + 8',
  ranged_defense_formula TEXT DEFAULT 'target_AGI + 8',
  defend_bonus INTEGER DEFAULT 4,
  help_friend_bonus INTEGER DEFAULT 3,
  base_crit_value INTEGER DEFAULT 20,
  luck_crit_thresholds JSONB DEFAULT '{"5":19, "8":18, "12":17}',
  lucky_saves_per_session INTEGER DEFAULT 1,
  difficulty_targets JSONB DEFAULT '{"easy":8, "medium":12, "hard":16, "epic":20}',
  ability_costs JSONB DEFAULT '{"1":30, "2":[30,40], "3":[40,50], "4":[50,60], "5":[60,70], "6":[70,80], "ultimate":100}',
  short_rest_resource_restore INTEGER DEFAULT 30,
  loot_tables JSONB DEFAULT '{"1-4":{"1-8":"1 gold","9-14":"1 Common","15-18":"2 Common","19":"1 Uncommon","20":"1 Uncommon + bonus"},"5-9":{"1-8":"1 Common","9-14":"2 Common","15-18":"1 Uncommon","19":"1 Rare","20":"1 Rare + bonus"},"10+":{"1-8":"1 Uncommon","9-14":"1 Rare","15-18":"1 Rare + 1 Common","19":"1 Epic","20":"1 Epic + bonus"},"boss":{"1-8":"1 Rare","9-14":"2 Rare","15-18":"1 Epic","19":"1 Epic + 1 Rare","20":"1 Legendary"}}',
  xp_awards JSONB DEFAULT '{"monster_at_level":[3,5],"monster_below_level":1,"boss":[10,15],"quest":[10,25],"puzzle":5,"creative_moment":[2,5],"help_player":2,"explore_area":3,"session_bonus":5}',
  xp_thresholds JSONB DEFAULT '[0,10,25,45,70,100,140,190,250,320,400,500,620,760,920,1100,1300,1520,1760,2020]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER set_updated_at BEFORE UPDATE ON game_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Campaigns
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
CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  adventure_name TEXT,
  duration_minutes INTEGER,
  summary TEXT,
  key_moments JSONB,
  xp_awarded JSONB,
  loot_awarded JSONB,
  level_ups JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  hero_name TEXT,
  player_name TEXT,
  player_age INTEGER,
  profession TEXT CHECK (profession IN ('knight','ranger','wizard','healer','rogue','inventor')),
  level INTEGER DEFAULT 1,
  rank TEXT DEFAULT 'Starting Hero',
  xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 8,
  resource_type TEXT CHECK (resource_type IN ('rage','energy','mana')),
  stat_con INTEGER DEFAULT 3,
  stat_str INTEGER DEFAULT 3,
  stat_agi INTEGER DEFAULT 3,
  stat_mna INTEGER DEFAULT 3,
  stat_int INTEGER DEFAULT 3,
  stat_lck INTEGER DEFAULT 3,
  gear_bonus_con INTEGER DEFAULT 0,
  gear_bonus_str INTEGER DEFAULT 0,
  gear_bonus_agi INTEGER DEFAULT 0,
  gear_bonus_mna INTEGER DEFAULT 0,
  gear_bonus_int INTEGER DEFAULT 0,
  gear_bonus_lck INTEGER DEFAULT 0,
  unspent_stat_points INTEGER DEFAULT 1,
  current_hp INTEGER,
  current_resource INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER set_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Character Seals
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

-- 6. Abilities (Reference Library)
CREATE TABLE abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 7),
  resource_cost INTEGER NOT NULL,
  resource_type TEXT,
  unlock_level INTEGER NOT NULL,
  description TEXT NOT NULL,
  effect_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_abilities_profession ON abilities(profession);
CREATE INDEX idx_abilities_tier ON abilities(tier);

-- 7. Character Abilities
CREATE TABLE character_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  ability_id UUID REFERENCES abilities(id) ON DELETE CASCADE,
  learned_at_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, ability_id)
);

-- 8. Character Inventory
CREATE TABLE character_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('weapon','armor','consumable','quest','misc')),
  quantity INTEGER DEFAULT 1,
  effect_json JSONB,
  equipped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Monsters (Pre-built Library)
CREATE TABLE monsters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  is_boss BOOLEAN DEFAULT false,
  category TEXT,
  stat_con INTEGER NOT NULL,
  stat_str INTEGER NOT NULL,
  stat_agi INTEGER NOT NULL,
  stat_mna INTEGER NOT NULL,
  stat_int INTEGER NOT NULL,
  stat_lck INTEGER NOT NULL,
  hp INTEGER NOT NULL,
  damage INTEGER NOT NULL,
  damage_type TEXT DEFAULT 'physical',
  special_abilities JSONB,
  description TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_monsters_level ON monsters(level);
CREATE INDEX idx_monsters_boss ON monsters(is_boss);

-- 10. Monster Abilities
CREATE TABLE monster_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monster_id UUID REFERENCES monsters(id) ON DELETE CASCADE,
  ability_name TEXT NOT NULL,
  resource_cost INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  effect_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Combats
CREATE TABLE combats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('setup','active','completed','abandoned')),
  current_turn INTEGER DEFAULT 0,
  current_combatant_id UUID,
  initiative_order JSONB,
  round_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 12. Combat Participants
CREATE TABLE combat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  monster_id UUID REFERENCES monsters(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  team TEXT CHECK (team IN ('hero','enemy')),
  stat_con INTEGER NOT NULL,
  stat_str INTEGER NOT NULL,
  stat_agi INTEGER NOT NULL,
  stat_mna INTEGER NOT NULL,
  stat_int INTEGER NOT NULL,
  stat_lck INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  current_hp INTEGER NOT NULL,
  resource_type TEXT,
  max_resource INTEGER,
  current_resource INTEGER DEFAULT 0,
  initiative_roll INTEGER,
  is_active BOOLEAN DEFAULT true,
  position_x INTEGER,
  position_y INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_participants_combat ON combat_participants(combat_id);

-- 13. Combat Effects (Active Status Effects)
CREATE TABLE combat_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES combat_participants(id) ON DELETE CASCADE,
  effect_type TEXT NOT NULL,
  effect_category TEXT CHECK (effect_category IN ('buff','debuff','cc','dot','hot')),
  source_participant_id UUID REFERENCES combat_participants(id),
  remaining_turns INTEGER,
  applied_at_round INTEGER,
  value_json JSONB,
  icon_name TEXT,
  display_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_effects_participant ON combat_effects(participant_id);
CREATE INDEX idx_effects_combat ON combat_effects(combat_id);

-- 14. Combat Logs
CREATE TABLE combat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  round_number INTEGER,
  turn_number INTEGER,
  timestamp TIMESTAMPTZ DEFAULT now(),
  actor_id UUID REFERENCES combat_participants(id),
  action_type TEXT,
  ability_name TEXT,
  target_ids UUID[],
  roll_value INTEGER,
  target_number INTEGER,
  success BOOLEAN,
  damage_dealt INTEGER,
  healing_done INTEGER,
  effects_applied JSONB,
  resource_spent INTEGER,
  voice_transcript TEXT,
  claude_response JSONB,
  narration TEXT,
  state_snapshot JSONB
);
CREATE INDEX idx_logs_combat ON combat_logs(combat_id);
CREATE INDEX idx_logs_timestamp ON combat_logs(timestamp);

-- 15. Status Effect Definitions (Reference Library)
CREATE TABLE status_effect_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  effect_type TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('buff','debuff','cc','dot','hot')),
  display_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  color TEXT,
  default_duration INTEGER,
  stackable BOOLEAN DEFAULT false,
  value_schema JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Character Full View (computed fields)
CREATE OR REPLACE VIEW character_full AS
SELECT
  c.*,
  (c.stat_con + c.gear_bonus_con) as total_con,
  (c.stat_str + c.gear_bonus_str) as total_str,
  (c.stat_agi + c.gear_bonus_agi) as total_agi,
  (c.stat_mna + c.gear_bonus_mna) as total_mna,
  (c.stat_int + c.gear_bonus_int) as total_int,
  (c.stat_lck + c.gear_bonus_lck) as total_lck,
  (c.stat_con + c.gear_bonus_con - 3) as bonus_con,
  (c.stat_str + c.gear_bonus_str - 3) as bonus_str,
  (c.stat_agi + c.gear_bonus_agi - 3) as bonus_agi,
  (c.stat_mna + c.gear_bonus_mna - 3) as bonus_mna,
  (c.stat_int + c.gear_bonus_int - 3) as bonus_int,
  (c.stat_lck + c.gear_bonus_lck - 3) as bonus_lck,
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

-- Permissive RLS (single user, no auth)
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON game_config FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON campaigns FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON characters FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE character_seals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON character_seals FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE abilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON abilities FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE character_abilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON character_abilities FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE character_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON character_inventory FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON monsters FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE monster_abilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON monster_abilities FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE combats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON combats FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE combat_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON combat_participants FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE combat_effects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON combat_effects FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON combat_logs FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE status_effect_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON status_effect_definitions FOR ALL USING (true) WITH CHECK (true);

-- Seed default config
INSERT INTO game_config DEFAULT VALUES;

-- Seed default campaign
INSERT INTO campaigns (name, current_quest, world_threat) VALUES ('LEGO QUEST Campaign', 'The Stolen Crown', 'The Shadow Tower');
