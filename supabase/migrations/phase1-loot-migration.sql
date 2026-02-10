-- ============================================================
-- PHASE 1: LOOT SYSTEM — Database Foundation
-- Vs. Dungeons / LEGO QUEST
-- ============================================================
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLE 1: Materials Catalog
-- All collectible materials organized by category and tier
-- ============================================================

CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('metal', 'herb', 'monster_part', 'arcane', 'seal')),
  tier TEXT NOT NULL CHECK (tier IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  icon TEXT,
  lego_token TEXT,
  drop_level_min INT DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE 2: Character Material Inventory
-- Tracks how many of each material each character owns
-- ============================================================

CREATE TABLE IF NOT EXISTS character_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  quantity INT DEFAULT 0 CHECK (quantity >= 0),
  UNIQUE(character_id, material_id)
);

-- ============================================================
-- TABLE 3: Loot Drop Tables (Config)
-- Stores the d20 roll ranges for each level bracket
-- Queried at combat end to determine drops
-- ============================================================

CREATE TABLE IF NOT EXISTS loot_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_min INT NOT NULL,
  level_max INT NOT NULL,
  is_boss BOOLEAN DEFAULT FALSE,
  roll_min INT NOT NULL,
  roll_max INT NOT NULL,
  drops JSONB NOT NULL,
  -- drops format: [{"tier": "common", "category": "any", "qty": 2}, {"tier": "uncommon", "category": "seal", "qty": 1}]
  description TEXT
);

-- ============================================================
-- TABLE 4: Encounter Loot Log
-- Records every loot drop for history / session recaps
-- ============================================================

CREATE TABLE IF NOT EXISTS encounter_loot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID,
  encounter_name TEXT,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  roll_value INT,
  source TEXT DEFAULT 'combat' CHECK (source IN ('combat', 'puzzle', 'chest', 'exploration', 'boss', 'manual')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_character_materials_char ON character_materials(character_id);
CREATE INDEX IF NOT EXISTS idx_encounter_loot_char ON encounter_loot(character_id);
CREATE INDEX IF NOT EXISTS idx_encounter_loot_session ON encounter_loot(session_id);
CREATE INDEX IF NOT EXISTS idx_loot_tables_level ON loot_tables(level_min, level_max, is_boss);

-- ============================================================
-- SEED DATA: Materials (25 materials + 5 seals + gold)
-- ============================================================

-- ⛏️ Metals & Stone
INSERT INTO materials (name, category, tier, icon, lego_token, drop_level_min, description) VALUES
  ('Iron Scraps',       'metal', 'common',    '⛏️', 'Gray 1×1 flat',              1,  'Rough chunks of iron from goblins and mine chests'),
  ('Steel Chunk',       'metal', 'uncommon',  '⛏️', 'Dark gray 1×1 round',        3,  'Solid steel from armored enemies and ore veins'),
  ('Mithril Ore',       'metal', 'rare',      '⛏️', 'Silver 1×1 round',           5,  'Shimmering ore from deep mines and golems'),
  ('Dragonscale Metal', 'metal', 'epic',      '⛏️', 'Black 1×1 w/ glitter',       8,  'Heat-forged metal from dragon-type enemies'),
  ('Starmetal',         'metal', 'legendary', '⛏️', 'Chrome/metallic 1×1',        12, 'Fallen from the sky — found at meteor sites');

-- 🌿 Herbs & Plants
INSERT INTO materials (name, category, tier, icon, lego_token, drop_level_min, description) VALUES
  ('Wild Herbs',      'herb', 'common',    '🌿', 'Green 1×1 plant piece',       1,  'Found in any forest, garden, or outdoor area'),
  ('Moonpetal',       'herb', 'uncommon',  '🌿', 'White flower piece',          3,  'Blooms only in moonlit clearings'),
  ('Sunbloom',        'herb', 'rare',      '🌿', 'Yellow/orange flower',        5,  'Hidden in secret gardens and druid sanctums'),
  ('Ghostroot',       'herb', 'epic',      '🌿', 'Trans-purple plant',          8,  'Grows in haunted ground, pulled by spectral hands'),
  ('World Tree Leaf', 'herb', 'legendary', '🌿', 'Large green leaf piece',      12, 'A single leaf from the ancient World Tree');

-- 🦴 Monster Parts
INSERT INTO materials (name, category, tier, icon, lego_token, drop_level_min, description) VALUES
  ('Beast Fang',      'monster_part', 'common',    '🦴', 'White 1×1 cone',            1,  'A sharp tooth from any beast or creature'),
  ('Tough Hide',      'monster_part', 'uncommon',  '🦴', 'Brown 1×1 flat',            3,  'Thick leather from trolls and large beasts'),
  ('Venom Gland',     'monster_part', 'rare',      '🦴', 'Trans-green 1×1 round',     5,  'Poisonous sac from spiders, snakes, and worse'),
  ('Elemental Core',  'monster_part', 'epic',      '🦴', 'Trans-blue/red gem',        8,  'The living heart of an elemental'),
  ('Dragon Heart',    'monster_part', 'legendary', '🦴', 'Large red gem piece',       12, 'Still warm — taken from a true dragon');

-- ✨ Arcane Components
INSERT INTO materials (name, category, tier, icon, lego_token, drop_level_min, description) VALUES
  ('Arcane Dust',     'arcane', 'common',    '✨', 'Trans-light-blue 1×1 flat',  1,  'Glittering residue from magical enemies'),
  ('Mana Crystal',    'arcane', 'uncommon',  '✨', 'Trans-blue 1×1 round',       3,  'Crystallized mana from enchanted sources'),
  ('Enchanted Gem',   'arcane', 'rare',      '✨', 'Trans-purple gem',           5,  'Pulses with magical energy'),
  ('Void Shard',      'arcane', 'epic',      '✨', 'Trans-black 1×1',           8,  'A fragment of the shadow realm itself'),
  ('Eternity Stone',  'arcane', 'legendary', '✨', 'Large trans-purple crystal', 12, 'Contains a frozen moment of time');

-- 🔮 Seals (Wildcard Materials)
INSERT INTO materials (name, category, tier, icon, lego_token, drop_level_min, description) VALUES
  ('Common Seal',    'seal', 'common',    '🟢', 'Green 1×1 flat tile',   1,  'A basic seal — can substitute for any Common material'),
  ('Uncommon Seal',  'seal', 'uncommon',  '🔵', 'Blue stud',             3,  'Can substitute for any Uncommon material'),
  ('Rare Seal',      'seal', 'rare',      '🟡', 'Gold coin piece',       5,  'Can substitute for any Rare material'),
  ('Epic Seal',      'seal', 'epic',      '🟣', 'Purple gem',            8,  'Can substitute for any Epic material'),
  ('Legendary Seal', 'seal', 'legendary', '🔴', 'Red 1×1 flat tile',     12, 'Can substitute for any Legendary material');

-- ============================================================
-- SEED DATA: Loot Drop Tables
-- Format: level range, boss flag, d20 roll range, drops as JSONB
-- "category": "any" means random from metal/herb/monster_part/arcane
-- "category": "seal" means specifically a seal
-- "category": "gold" means gold coins (not a material, handled in app)
-- ============================================================

-- ---- LEVEL 1–4 NORMAL ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (1, 4, false, 1,  5,  '[{"tier":"gold","qty":1}]',
    'Just gold'),
  (1, 4, false, 6,  10, '[{"tier":"common","category":"any","qty":1}]',
    '1 Common material'),
  (1, 4, false, 11, 14, '[{"tier":"common","category":"any","qty":2}]',
    '2 Common materials'),
  (1, 4, false, 15, 17, '[{"tier":"common","category":"any","qty":2},{"tier":"common","category":"seal","qty":1}]',
    '2 Common + 1 Common Seal'),
  (1, 4, false, 18, 19, '[{"tier":"uncommon","category":"any","qty":1}]',
    '1 Uncommon material'),
  (1, 4, false, 20, 20, '[{"tier":"uncommon","category":"any","qty":1},{"tier":"common","category":"seal","qty":1}]',
    'Nat 20! Uncommon + Common Seal + bonus');

-- ---- LEVEL 1–4 BOSS ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (1, 4, true, 1,  8,  '[{"tier":"common","category":"any","qty":2},{"tier":"uncommon","category":"any","qty":1}]',
    '2 Common + 1 Uncommon'),
  (1, 4, true, 9,  14, '[{"tier":"common","category":"any","qty":3},{"tier":"uncommon","category":"any","qty":1}]',
    '3 Common + 1 Uncommon'),
  (1, 4, true, 15, 18, '[{"tier":"common","category":"any","qty":2},{"tier":"uncommon","category":"any","qty":2}]',
    '2 Common + 2 Uncommon'),
  (1, 4, true, 19, 19, '[{"tier":"uncommon","category":"any","qty":1},{"tier":"rare","category":"any","qty":1}]',
    '1 Uncommon + 1 Rare'),
  (1, 4, true, 20, 20, '[{"tier":"rare","category":"any","qty":1},{"tier":"uncommon","category":"seal","qty":1}]',
    'Nat 20! Rare + Uncommon Seal + bonus');

-- ---- LEVEL 5–9 NORMAL ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (5, 9, false, 1,  5,  '[{"tier":"common","category":"any","qty":1}]',
    '1 Common material'),
  (5, 9, false, 6,  10, '[{"tier":"common","category":"any","qty":2}]',
    '2 Common materials'),
  (5, 9, false, 11, 14, '[{"tier":"uncommon","category":"any","qty":1},{"tier":"common","category":"any","qty":1}]',
    '1 Uncommon + 1 Common'),
  (5, 9, false, 15, 17, '[{"tier":"uncommon","category":"any","qty":2}]',
    '2 Uncommon materials'),
  (5, 9, false, 18, 19, '[{"tier":"rare","category":"any","qty":1}]',
    '1 Rare material'),
  (5, 9, false, 20, 20, '[{"tier":"rare","category":"any","qty":1},{"tier":"uncommon","category":"seal","qty":1}]',
    'Nat 20! Rare + Uncommon Seal + bonus');

-- ---- LEVEL 5–9 BOSS ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (5, 9, true, 1,  8,  '[{"tier":"uncommon","category":"any","qty":2},{"tier":"rare","category":"any","qty":1}]',
    '2 Uncommon + 1 Rare'),
  (5, 9, true, 9,  14, '[{"tier":"uncommon","category":"any","qty":3},{"tier":"rare","category":"any","qty":1}]',
    '3 Uncommon + 1 Rare'),
  (5, 9, true, 15, 18, '[{"tier":"rare","category":"any","qty":2},{"tier":"uncommon","category":"any","qty":1}]',
    '2 Rare + 1 Uncommon'),
  (5, 9, true, 19, 19, '[{"tier":"rare","category":"any","qty":2},{"tier":"rare","category":"seal","qty":1}]',
    '2 Rare + 1 Rare Seal'),
  (5, 9, true, 20, 20, '[{"tier":"epic","category":"any","qty":1},{"tier":"rare","category":"any","qty":1},{"tier":"rare","category":"seal","qty":1}]',
    'Nat 20! Epic + Rare + Rare Seal');

-- ---- LEVEL 10–14 NORMAL ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (10, 14, false, 1,  5,  '[{"tier":"uncommon","category":"any","qty":1}]',
    '1 Uncommon material'),
  (10, 14, false, 6,  10, '[{"tier":"uncommon","category":"any","qty":2}]',
    '2 Uncommon materials'),
  (10, 14, false, 11, 14, '[{"tier":"rare","category":"any","qty":1},{"tier":"uncommon","category":"any","qty":1}]',
    '1 Rare + 1 Uncommon'),
  (10, 14, false, 15, 17, '[{"tier":"rare","category":"any","qty":2}]',
    '2 Rare materials'),
  (10, 14, false, 18, 19, '[{"tier":"epic","category":"any","qty":1}]',
    '1 Epic material'),
  (10, 14, false, 20, 20, '[{"tier":"epic","category":"any","qty":1},{"tier":"rare","category":"seal","qty":1}]',
    'Nat 20! Epic + Rare Seal + bonus');

-- ---- LEVEL 10–14 BOSS ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (10, 14, true, 1,  8,  '[{"tier":"rare","category":"any","qty":2},{"tier":"epic","category":"any","qty":1}]',
    '2 Rare + 1 Epic'),
  (10, 14, true, 9,  14, '[{"tier":"rare","category":"any","qty":3},{"tier":"epic","category":"any","qty":1}]',
    '3 Rare + 1 Epic'),
  (10, 14, true, 15, 18, '[{"tier":"epic","category":"any","qty":2},{"tier":"rare","category":"any","qty":1}]',
    '2 Epic + 1 Rare'),
  (10, 14, true, 19, 19, '[{"tier":"epic","category":"any","qty":2},{"tier":"epic","category":"seal","qty":1}]',
    '2 Epic + 1 Epic Seal'),
  (10, 14, true, 20, 20, '[{"tier":"legendary","category":"any","qty":1},{"tier":"epic","category":"any","qty":1},{"tier":"epic","category":"seal","qty":1}]',
    'Nat 20! Legendary + Epic + Epic Seal');

-- ---- LEVEL 15–20 NORMAL ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (15, 20, false, 1,  5,  '[{"tier":"rare","category":"any","qty":1}]',
    '1 Rare material'),
  (15, 20, false, 6,  10, '[{"tier":"rare","category":"any","qty":2}]',
    '2 Rare materials'),
  (15, 20, false, 11, 14, '[{"tier":"epic","category":"any","qty":1},{"tier":"rare","category":"any","qty":1}]',
    '1 Epic + 1 Rare'),
  (15, 20, false, 15, 17, '[{"tier":"epic","category":"any","qty":2}]',
    '2 Epic materials'),
  (15, 20, false, 18, 19, '[{"tier":"legendary","category":"any","qty":1}]',
    '1 Legendary material'),
  (15, 20, false, 20, 20, '[{"tier":"legendary","category":"any","qty":1},{"tier":"epic","category":"seal","qty":1}]',
    'Nat 20! Legendary + Epic Seal + bonus');

-- ---- LEVEL 15–20 BOSS ----
INSERT INTO loot_tables (level_min, level_max, is_boss, roll_min, roll_max, drops, description) VALUES
  (15, 20, true, 1,  8,  '[{"tier":"epic","category":"any","qty":2},{"tier":"legendary","category":"any","qty":1}]',
    '2 Epic + 1 Legendary'),
  (15, 20, true, 9,  14, '[{"tier":"epic","category":"any","qty":3},{"tier":"legendary","category":"any","qty":1}]',
    '3 Epic + 1 Legendary'),
  (15, 20, true, 15, 18, '[{"tier":"legendary","category":"any","qty":2},{"tier":"epic","category":"any","qty":1}]',
    '2 Legendary + 1 Epic'),
  (15, 20, true, 19, 19, '[{"tier":"legendary","category":"any","qty":2},{"tier":"legendary","category":"seal","qty":1}]',
    '2 Legendary + 1 Legendary Seal'),
  (15, 20, true, 20, 20, '[{"tier":"legendary","category":"any","qty":3},{"tier":"legendary","category":"seal","qty":1}]',
    'Nat 20! 3 Legendary + Legendary Seal + named unique');

-- ============================================================
-- RLS POLICIES (adjust to your auth setup)
-- ============================================================

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE loot_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounter_loot ENABLE ROW LEVEL SECURITY;

-- Materials catalog: readable by all authenticated users
CREATE POLICY "Materials are viewable by authenticated users"
  ON materials FOR SELECT
  TO authenticated
  USING (true);

-- Character materials: users can read/write their own characters' inventories
CREATE POLICY "Users can view their characters' materials"
  ON character_materials FOR SELECT
  TO authenticated
  USING (
    character_id IN (
      SELECT id FROM characters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert materials for their characters"
  ON character_materials FOR INSERT
  TO authenticated
  WITH CHECK (
    character_id IN (
      SELECT id FROM characters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their characters' materials"
  ON character_materials FOR UPDATE
  TO authenticated
  USING (
    character_id IN (
      SELECT id FROM characters WHERE user_id = auth.uid()
    )
  );

-- Loot tables: readable by all (config data)
CREATE POLICY "Loot tables are viewable by authenticated users"
  ON loot_tables FOR SELECT
  TO authenticated
  USING (true);

-- Encounter loot log: users can read/write for their characters
CREATE POLICY "Users can view their encounter loot"
  ON encounter_loot FOR SELECT
  TO authenticated
  USING (
    character_id IN (
      SELECT id FROM characters WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert encounter loot"
  ON encounter_loot FOR INSERT
  TO authenticated
  WITH CHECK (
    character_id IN (
      SELECT id FROM characters WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- HELPER VIEW: Material inventory with names (for UI queries)
-- ============================================================

CREATE OR REPLACE VIEW character_inventory_view AS
SELECT
  cm.character_id,
  cm.material_id,
  cm.quantity,
  m.name AS material_name,
  m.category,
  m.tier,
  m.icon,
  m.lego_token
FROM character_materials cm
JOIN materials m ON cm.material_id = m.id
WHERE cm.quantity > 0
ORDER BY
  CASE m.tier
    WHEN 'legendary' THEN 1
    WHEN 'epic' THEN 2
    WHEN 'rare' THEN 3
    WHEN 'uncommon' THEN 4
    WHEN 'common' THEN 5
  END,
  m.category,
  m.name;

-- ============================================================
-- HELPER FUNCTION: Add materials to a character (upsert)
-- Call this from the app when awarding loot
-- ============================================================

CREATE OR REPLACE FUNCTION add_character_material(
  p_character_id UUID,
  p_material_id UUID,
  p_quantity INT DEFAULT 1
)
RETURNS void AS $$
BEGIN
  INSERT INTO character_materials (character_id, material_id, quantity)
  VALUES (p_character_id, p_material_id, p_quantity)
  ON CONFLICT (character_id, material_id)
  DO UPDATE SET quantity = character_materials.quantity + p_quantity;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- HELPER FUNCTION: Look up loot table for a given level + roll
-- Returns the drops JSONB for the matching row
-- ============================================================

CREATE OR REPLACE FUNCTION get_loot_drops(
  p_enemy_level INT,
  p_is_boss BOOLEAN,
  p_roll INT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT drops INTO result
  FROM loot_tables
  WHERE p_enemy_level BETWEEN level_min AND level_max
    AND is_boss = p_is_boss
    AND p_roll BETWEEN roll_min AND roll_max
  LIMIT 1;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;
