-- 011: Fix character_full view blocking column drops from migration 007
--
-- The character_full view (created in 001) references old 6-stat columns
-- (stat_con, stat_agi, stat_mna, stat_int, stat_lck, gear_bonus_*, resource_type).
-- PostgreSQL prevents DROP COLUMN when a view depends on that column,
-- so migration 007's column drops silently failed.
--
-- This migration:
--   1. Drops the outdated character_full view
--   2. Re-runs the column drops from 007 (idempotent)
--   3. Ensures new 4-stat columns exist (idempotent)

-- ═══════════════════════════════════════════════════════════════
-- 1. Drop the outdated view that blocks column drops
-- ═══════════════════════════════════════════════════════════════

DROP VIEW IF EXISTS character_full;

-- ═══════════════════════════════════════════════════════════════
-- 2. Now drop old stat columns (safe — no view dependency)
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

-- ═══════════════════════════════════════════════════════════════
-- 3. Ensure new 4-stat columns exist
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS stat_spd INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_tgh INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS stat_smt INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS gear_bonus_spd INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gear_bonus_tgh INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gear_bonus_smt INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spell_slots_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mov INTEGER NOT NULL DEFAULT 3;
