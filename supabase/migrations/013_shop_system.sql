-- 013_shop_system.sql
-- Quest-based shop system: items for sale per quest + atomic purchase RPC

-- ═══ QUEST SHOP ITEMS TABLE ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS quest_shop_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_name      TEXT NOT NULL,
  catalog_item_id UUID NOT NULL REFERENCES item_catalog(id) ON DELETE CASCADE,
  price           INTEGER NOT NULL CHECK (price > 0),
  stock           INTEGER NOT NULL DEFAULT -1 CHECK (stock >= -1),  -- -1 = unlimited
  sort_order      INTEGER NOT NULL DEFAULT 0,
  UNIQUE (quest_name, catalog_item_id)
);

-- RLS: allow all for now (single-user / GM app)
ALTER TABLE quest_shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all quest_shop_items" ON quest_shop_items FOR ALL USING (true) WITH CHECK (true);

-- ═══ PURCHASE RPC ══════════════════════════════════════════════════════════
-- Atomic: lock shop item + character, validate gold & stock, deduct, add item

CREATE OR REPLACE FUNCTION purchase_shop_item(
  p_character_id UUID,
  p_shop_item_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_price       INTEGER;
  v_stock       INTEGER;
  v_item_name   TEXT;
  v_item_type   TEXT;
  v_effect_json JSONB;
  v_gold        INTEGER;
  v_inv_id      UUID;
BEGIN
  -- 1. Lock and read the shop item + catalog details
  SELECT qs.price, qs.stock, ic.name, ic.item_type, ic.effect_json
    INTO v_price, v_stock, v_item_name, v_item_type, v_effect_json
    FROM quest_shop_items qs
    JOIN item_catalog ic ON ic.id = qs.catalog_item_id
   WHERE qs.id = p_shop_item_id
     FOR UPDATE OF qs;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Shop item not found';
  END IF;

  -- 2. Check stock
  IF v_stock = 0 THEN
    RAISE EXCEPTION 'Item is sold out';
  END IF;

  -- 3. Lock and read character gold
  SELECT gold INTO v_gold
    FROM characters
   WHERE id = p_character_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character not found';
  END IF;

  -- 4. Check gold
  IF v_gold < v_price THEN
    RAISE EXCEPTION 'Not enough gold (have %, need %)', v_gold, v_price;
  END IF;

  -- 5. Deduct gold
  UPDATE characters SET gold = gold - v_price WHERE id = p_character_id;

  -- 6. Decrement stock (skip if unlimited = -1)
  IF v_stock > 0 THEN
    UPDATE quest_shop_items SET stock = stock - 1 WHERE id = p_shop_item_id;
  END IF;

  -- 7. Add item to inventory (uses existing stacking RPC)
  SELECT add_inventory_item(p_character_id, v_item_name, v_item_type, 1, v_effect_json)
    INTO v_inv_id;

  RETURN v_inv_id;
END;
$$;
