-- LEGO QUEST — Hardened RLS Policies
-- Replaces permissive "allow_all" with scoped per-table policies.
-- Reference tables: read-only via anon key.
-- Critical tables: no DELETE via anon key.
-- Run via Supabase SQL Editor or Management API.

-- =============================================================
-- Drop existing permissive policies
-- =============================================================

DROP POLICY IF EXISTS "allow_all" ON game_config;
DROP POLICY IF EXISTS "allow_all" ON campaigns;
DROP POLICY IF EXISTS "allow_all" ON sessions;
DROP POLICY IF EXISTS "allow_all" ON characters;
DROP POLICY IF EXISTS "allow_all" ON character_seals;
DROP POLICY IF EXISTS "allow_all" ON abilities;
DROP POLICY IF EXISTS "allow_all" ON character_abilities;
DROP POLICY IF EXISTS "allow_all" ON character_inventory;
DROP POLICY IF EXISTS "allow_all" ON monsters;
DROP POLICY IF EXISTS "allow_all" ON monster_abilities;
DROP POLICY IF EXISTS "allow_all" ON combats;
DROP POLICY IF EXISTS "allow_all" ON combat_participants;
DROP POLICY IF EXISTS "allow_all" ON combat_effects;
DROP POLICY IF EXISTS "allow_all" ON combat_logs;
DROP POLICY IF EXISTS "allow_all" ON status_effect_definitions;

-- =============================================================
-- Reference tables: READ-ONLY (abilities, monsters, status effects)
-- Only service_role can insert/update/delete seed data.
-- =============================================================

CREATE POLICY "anon_read" ON abilities FOR SELECT USING (true);
CREATE POLICY "anon_read" ON monsters FOR SELECT USING (true);
CREATE POLICY "anon_read" ON monster_abilities FOR SELECT USING (true);
CREATE POLICY "anon_read" ON status_effect_definitions FOR SELECT USING (true);

-- =============================================================
-- Game Config: read + update only, no insert/delete via anon
-- =============================================================

CREATE POLICY "anon_read" ON game_config FOR SELECT USING (true);
CREATE POLICY "anon_update" ON game_config FOR UPDATE USING (true) WITH CHECK (true);

-- =============================================================
-- Campaigns: read + insert + update, no delete via anon
-- =============================================================

CREATE POLICY "anon_read" ON campaigns FOR SELECT USING (true);
CREATE POLICY "anon_insert" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update" ON campaigns FOR UPDATE USING (true) WITH CHECK (true);

-- =============================================================
-- Sessions: full CRUD (low risk, tied to campaign)
-- =============================================================

CREATE POLICY "anon_all" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- =============================================================
-- Characters: read + insert + update, no delete via anon
-- (Prevents accidental character deletion from client bugs)
-- =============================================================

CREATE POLICY "anon_read" ON characters FOR SELECT USING (true);
CREATE POLICY "anon_insert" ON characters FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update" ON characters FOR UPDATE USING (true) WITH CHECK (true);

-- =============================================================
-- Character sub-tables: full CRUD (cascade-deleted with character)
-- =============================================================

CREATE POLICY "anon_all" ON character_seals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON character_abilities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON character_inventory FOR ALL USING (true) WITH CHECK (true);

-- =============================================================
-- Combat tables: full CRUD (ephemeral combat data)
-- =============================================================

CREATE POLICY "anon_all" ON combats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON combat_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON combat_effects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON combat_logs FOR ALL USING (true) WITH CHECK (true);
