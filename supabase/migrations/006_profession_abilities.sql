-- 006: Crafting Profession Abilities
-- Stores character profession selections (which crafting professions they've chosen
-- and which ability choices they've made at each choice node).
--
-- The ability definitions themselves are stored as static data in the app
-- (src/data/profession-abilities.ts) since they never change per-character.

-- Track which crafting professions a character has chosen (max 2 per character)
CREATE TABLE IF NOT EXISTS character_crafting_professions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  profession TEXT NOT NULL CHECK (profession IN ('blacksmithing', 'alchemy', 'cooking', 'enchanting', 'trap_making')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, profession)
);

-- Track ability selections at choice nodes
CREATE TABLE IF NOT EXISTS character_profession_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  profession TEXT NOT NULL CHECK (profession IN ('blacksmithing', 'alchemy', 'cooking', 'enchanting', 'trap_making')),
  node_number INT NOT NULL CHECK (node_number BETWEEN 1 AND 9),
  selected_option INT NOT NULL CHECK (selected_option IN (0, 1)),
  selected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, profession, node_number)
);

-- RLS policies
ALTER TABLE character_crafting_professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_profession_choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for character_crafting_professions"
  ON character_crafting_professions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for character_profession_choices"
  ON character_profession_choices FOR ALL USING (true) WITH CHECK (true);
