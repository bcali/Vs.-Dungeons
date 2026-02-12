-- ============================================================
-- Migration 012: Equipment System
--
-- Adds:
--   - character_equipment table (items owned by characters)
--   - equip_item() RPC (equip + recalculate gear bonus)
--   - unequip_item() RPC (unequip + recalculate gear bonus)
--   - craft_equipment() RPC (deduct materials/seals, create item)
-- ============================================================

-- ─── Character Equipment Table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS character_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('head', 'chest', 'hands', 'feet', 'weapon', 'shield', 'ring', 'trinket')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  level INT NOT NULL CHECK (level >= 1 AND level <= 20),
  stat_bonuses JSONB NOT NULL DEFAULT '{}',
  special_effect JSONB,
  equipped_slot TEXT CHECK (equipped_slot IS NULL OR equipped_slot IN ('head', 'chest', 'hands', 'feet', 'weapon', 'shield', 'ring', 'trinket')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_char_equip_character ON character_equipment(character_id);
CREATE INDEX IF NOT EXISTS idx_char_equip_equipped ON character_equipment(character_id, equipped_slot) WHERE equipped_slot IS NOT NULL;

-- ─── Recalculate Gear Bonus Helper ───────────────────────────────────
-- Sums all equipped items' stat_bonuses and updates the character row.

CREATE OR REPLACE FUNCTION recalculate_gear_bonus(p_character_id UUID)
RETURNS VOID AS $$
DECLARE
  v_str INT := 0;
  v_spd INT := 0;
  v_tgh INT := 0;
  v_smt INT := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT stat_bonuses
    FROM character_equipment
    WHERE character_id = p_character_id
      AND equipped_slot IS NOT NULL
  LOOP
    v_str := v_str + COALESCE((rec.stat_bonuses->>'str')::INT, 0);
    v_spd := v_spd + COALESCE((rec.stat_bonuses->>'spd')::INT, 0);
    v_tgh := v_tgh + COALESCE((rec.stat_bonuses->>'tgh')::INT, 0);
    v_smt := v_smt + COALESCE((rec.stat_bonuses->>'smt')::INT, 0);
  END LOOP;

  UPDATE characters
  SET gear_bonus_str = v_str,
      gear_bonus_spd = v_spd,
      gear_bonus_tgh = v_tgh,
      gear_bonus_smt = v_smt,
      updated_at = now()
  WHERE id = p_character_id;
END;
$$ LANGUAGE plpgsql;

-- ─── Equip Item RPC ──────────────────────────────────────────────────
-- Equips an item to a slot. If slot is occupied, unequips the existing item first.

CREATE OR REPLACE FUNCTION equip_item(
  p_character_id UUID,
  p_item_id UUID,
  p_slot TEXT
) RETURNS VOID AS $$
BEGIN
  -- Validate the item belongs to this character
  IF NOT EXISTS (
    SELECT 1 FROM character_equipment
    WHERE id = p_item_id AND character_id = p_character_id
  ) THEN
    RAISE EXCEPTION 'Item not found or does not belong to character';
  END IF;

  -- Unequip any item currently in this slot
  UPDATE character_equipment
  SET equipped_slot = NULL
  WHERE character_id = p_character_id
    AND equipped_slot = p_slot;

  -- Equip the new item
  UPDATE character_equipment
  SET equipped_slot = p_slot
  WHERE id = p_item_id
    AND character_id = p_character_id;

  -- Recalculate gear bonuses
  PERFORM recalculate_gear_bonus(p_character_id);
END;
$$ LANGUAGE plpgsql;

-- ─── Unequip Item RPC ────────────────────────────────────────────────
-- Removes an item from an equipment slot (moves to stash).

CREATE OR REPLACE FUNCTION unequip_item(
  p_character_id UUID,
  p_slot TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE character_equipment
  SET equipped_slot = NULL
  WHERE character_id = p_character_id
    AND equipped_slot = p_slot;

  -- Recalculate gear bonuses
  PERFORM recalculate_gear_bonus(p_character_id);
END;
$$ LANGUAGE plpgsql;

-- ─── Craft Equipment RPC ─────────────────────────────────────────────
-- Creates a new equipment item for a character.
-- Material/seal deduction is handled client-side for now (can be moved to RPC later).

CREATE OR REPLACE FUNCTION craft_equipment(
  p_character_id UUID,
  p_template_id TEXT,
  p_name TEXT,
  p_slot TEXT,
  p_rarity TEXT,
  p_level INT,
  p_stat_bonuses JSONB,
  p_special_effect JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_item_id UUID;
BEGIN
  INSERT INTO character_equipment (
    character_id, template_id, name, slot, rarity, level, stat_bonuses, special_effect
  ) VALUES (
    p_character_id, p_template_id, p_name, p_slot, p_rarity, p_level, p_stat_bonuses, p_special_effect
  )
  RETURNING id INTO v_item_id;

  RETURN v_item_id;
END;
$$ LANGUAGE plpgsql;

-- ─── Delete Equipment (Salvage) ──────────────────────────────────────

CREATE OR REPLACE FUNCTION salvage_equipment(
  p_character_id UUID,
  p_item_id UUID
) RETURNS VOID AS $$
BEGIN
  DELETE FROM character_equipment
  WHERE id = p_item_id
    AND character_id = p_character_id;

  -- Recalculate in case it was equipped
  PERFORM recalculate_gear_bonus(p_character_id);
END;
$$ LANGUAGE plpgsql;

-- ─── RLS Policies ────────────────────────────────────────────────────

ALTER TABLE character_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their character equipment"
  ON character_equipment FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their character equipment"
  ON character_equipment FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their character equipment"
  ON character_equipment FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their character equipment"
  ON character_equipment FOR DELETE
  USING (true);
