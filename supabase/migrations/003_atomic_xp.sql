-- LEGO QUEST — Atomic XP increment
-- Prevents race conditions from concurrent XP awards overwriting each other.
-- Usage: SELECT increment_xp('character-uuid', 10);

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

-- Grant execute to anon (client-side calls)
GRANT EXECUTE ON FUNCTION increment_xp(UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION increment_xp(UUID, INTEGER) TO authenticated;
