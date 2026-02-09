-- LEGO QUEST — Skill Trees Migration
-- Adds skill tree system: reference skills, character allocations, and action bar.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Skill Tree Skills (Reference Table)
-- ═══════════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════════
-- 2. Character Skill Allocations
-- ═══════════════════════════════════════════════════════════════════════

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

CREATE TRIGGER set_updated_at BEFORE UPDATE ON character_skill_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════
-- 3. Character Action Bar
-- ═══════════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════════
-- 4. Row Level Security (Permissive — matches existing pattern)
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE skill_tree_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON skill_tree_skills FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE character_skill_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON character_skill_allocations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE character_action_bar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON character_action_bar FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════
-- 5. Stored Function: allocate_skill_point
-- ═══════════════════════════════════════════════════════════════════════

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
  --    Points in that branch must meet requirement: tier 1=0, 2=3, 3=6, 4=10, 5=15
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

GRANT EXECUTE ON FUNCTION allocate_skill_point(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION allocate_skill_point(UUID, UUID) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════
-- 6. Stored Function: respec_character
-- ═══════════════════════════════════════════════════════════════════════

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

GRANT EXECUTE ON FUNCTION respec_character(UUID) TO anon;
GRANT EXECUTE ON FUNCTION respec_character(UUID) TO authenticated;
