-- LEGO QUEST — Rewards System Migration
-- Adds XP rewards to monsters, reward tracking to combats, item catalog,
-- inventory stacking, and the add_inventory_item helper function.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Add xp_reward column to monsters
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE monsters ADD COLUMN xp_reward INTEGER DEFAULT 0;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. Add rewards_json column to combats
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE combats ADD COLUMN rewards_json JSONB;

-- ═══════════════════════════════════════════════════════════════════════
-- 3. Update combats status CHECK to include 'rewards' phase
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE combats DROP CONSTRAINT IF EXISTS combats_status_check;
ALTER TABLE combats ADD CONSTRAINT combats_status_check
  CHECK (status IN ('setup', 'active', 'rewards', 'completed', 'abandoned'));

-- ═══════════════════════════════════════════════════════════════════════
-- 4. Item Catalog (Reference Table)
-- ═══════════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════════
-- 5. Row Level Security for item_catalog (Permissive — matches existing pattern)
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE item_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON item_catalog FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════
-- 6. Unique constraint for inventory stacking
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE character_inventory ADD CONSTRAINT uq_char_item UNIQUE (character_id, item_name);

-- ═══════════════════════════════════════════════════════════════════════
-- 7. Stored Function: add_inventory_item (upsert with stacking)
-- ═══════════════════════════════════════════════════════════════════════

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

GRANT EXECUTE ON FUNCTION add_inventory_item(UUID, TEXT, TEXT, INTEGER, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION add_inventory_item(UUID, TEXT, TEXT, INTEGER, JSONB) TO authenticated;
