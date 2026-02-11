-- LEGO QUEST — Seed Skill Tree Skills
-- Populates skill_tree_skills with all warrior and rogue_ranger skills.
-- Includes tier-0 starter abilities (Brave Strike, Aimed Shot, Cheap Shot).

-- ═══════════════════════════════════════════════════════════════════════
-- 0. Widen tier constraint to allow tier 0 (starter abilities)
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE skill_tree_skills
  DROP CONSTRAINT IF EXISTS skill_tree_skills_tier_check;

ALTER TABLE skill_tree_skills
  ADD CONSTRAINT skill_tree_skills_tier_check CHECK (tier BETWEEN 0 AND 5);

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Clear any existing seed data (idempotent re-runs)
-- ═══════════════════════════════════════════════════════════════════════

DELETE FROM skill_tree_skills;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. Starter Abilities (Tier 0)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  ('STARTER_W1', 'Brave Strike', 'warrior', 'warrior_core', 0, 'active', 1,
   '1/battle: Melee attack at +3 to hit, deal +2 damage.',
   '[{"rank":1,"effect":"Melee attack at +3 to hit, deal +2 damage. 1/battle"}]'::jsonb,
   NULL, NULL, 0),

  ('STARTER_RR1', 'Aimed Shot', 'rogue_ranger', 'precision', 0, 'active', 1,
   '1/battle: Ranged attack at +3 to hit and deal +2 damage.',
   '[{"rank":1,"effect":"Ranged attack at +3 to hit, deal +2 damage. 1/battle"}]'::jsonb,
   NULL, NULL, 0),

  ('STARTER_RR2', 'Cheap Shot', 'rogue_ranger', 'shadow', 0, 'active', 1,
   '1/battle: Melee attack at +3 to hit, target gets -2 on its next roll.',
   '[{"rank":1,"effect":"Melee attack at +3 to hit, target gets -2 on its next roll. 1/battle"}]'::jsonb,
   NULL, NULL, 0);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. WARRIOR — PROTECTION BRANCH
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  -- Tier 1 (Fundamentals)
  ('P1', 'Shield Block', 'warrior', 'protection', 1, 'active', 2,
   'Reduce incoming damage. Must hold shield.',
   '[{"rank":1,"effect":"Reduce damage by 3"},{"rank":2,"effect":"Reduce damage by 5"}]'::jsonb,
   NULL, NULL, 1),

  ('P2', 'Toughened Up', 'warrior', 'protection', 1, 'passive', 3,
   'Increase maximum HP.',
   '[{"rank":1,"effect":"+2 max HP"},{"rank":2,"effect":"+4 max HP"},{"rank":3,"effect":"+6 max HP"}]'::jsonb,
   NULL, NULL, 2),

  ('P3', 'Taunt', 'warrior', 'protection', 1, 'active', 1,
   'One enemy within 4 studs MUST attack you next turn.',
   '[{"rank":1,"effect":"One enemy within 4 studs MUST attack you next turn"}]'::jsonb,
   NULL, NULL, 3),

  ('P4', 'Armor Training', 'warrior', 'protection', 1, 'passive', 2,
   'Enemies need a higher roll to hit you.',
   '[{"rank":1,"effect":"Enemies need +1 to hit you"},{"rank":2,"effect":"Enemies need +2 to hit you"}]'::jsonb,
   NULL, NULL, 4),

  -- Tier 2 (Specialist, 4+ pts)
  ('P5', 'Shield Bash', 'warrior', 'protection', 2, 'active', 2,
   'Bash with your shield dealing STR damage, pushing the target and stunning them.',
   '[{"rank":1,"effect":"STR dmg + push 2 studs + stun 1 turn"},{"rank":2,"effect":"STR dmg + push 4 studs + stun 1 turn"}]'::jsonb,
   NULL, NULL, 5),

  ('P6', 'Stand Your Ground', 'warrior', 'protection', 2, 'passive', 1,
   'Cannot be pushed, pulled, or knocked prone.',
   '[{"rank":1,"effect":"Immune to push, pull, and prone effects"}]'::jsonb,
   NULL, NULL, 6),

  ('P7', 'Guardian Aura', 'warrior', 'protection', 2, 'passive', 3,
   'Allies near you take reduced damage.',
   '[{"rank":1,"effect":"Allies within 2 studs take -1 damage"},{"rank":2,"effect":"Allies within 3 studs take -1 damage"},{"rank":3,"effect":"Allies within 4 studs take -1 damage"}]'::jsonb,
   NULL, NULL, 7),

  ('P8', 'Vengeance', 'warrior', 'protection', 2, 'passive', 2,
   'Deal bonus damage on your next attack after being hit.',
   '[{"rank":1,"effect":"+2 damage on next attack vs enemy that hit you"},{"rank":2,"effect":"+4 damage on next attack vs enemy that hit you"}]'::jsonb,
   NULL, NULL, 8),

  ('P9', 'Wall of Iron', 'warrior', 'protection', 2, 'active', 1,
   'For 2 turns, you and allies behind you cannot be hit by ranged attacks.',
   '[{"rank":1,"effect":"2 turns: you and allies behind you can''t be hit by ranged attacks"}]'::jsonb,
   NULL, NULL, 9),

  -- Tier 3 (Expert, 8+ pts)
  ('P10', 'Shield Throw', 'warrior', 'protection', 3, 'active', 2,
   'Hurl your shield dealing STR damage and bouncing to additional enemies.',
   '[{"rank":1,"effect":"STR damage + bounce to 1 additional enemy"},{"rank":2,"effect":"STR damage + bounce to 2 additional enemies"}]'::jsonb,
   NULL, NULL, 10),

  ('P11', 'Fortress', 'warrior', 'protection', 3, 'active', 1,
   'For 3 turns, take half damage but cannot move.',
   '[{"rank":1,"effect":"3 turns: take half damage, cannot move"}]'::jsonb,
   NULL, NULL, 11),

  ('P12', 'Rallying Presence', 'warrior', 'protection', 3, 'passive', 2,
   'Your Protection abilities also heal nearby allies.',
   '[{"rank":1,"effect":"Protection abilities heal allies 2 HP"},{"rank":2,"effect":"Protection abilities heal allies 4 HP"}]'::jsonb,
   NULL, NULL, 12),

  ('P13', 'Retaliation Aura', 'warrior', 'protection', 3, 'passive', 1,
   'Enemies that attack you in melee take damage.',
   '[{"rank":1,"effect":"Melee attackers take 3 damage"}]'::jsonb,
   NULL, NULL, 13),

  -- Tier 4 (Mastery, 12+ pts)
  ('P14', 'Unbreakable', 'warrior', 'protection', 4, 'active', 1,
   'For 2 turns, you cannot drop below 1 HP.',
   '[{"rank":1,"effect":"2 turns: cannot drop below 1 HP"}]'::jsonb,
   NULL, NULL, 14),

  ('P15', 'Divine Shield', 'warrior', 'protection', 4, 'active', 1,
   'For 3 turns, redirect damage meant for an ally to yourself.',
   '[{"rank":1,"effect":"3 turns: redirect ally''s damage to you"}]'::jsonb,
   NULL, NULL, 15),

  ('P16', 'Last Stand', 'warrior', 'protection', 4, 'active', 1,
   'When reduced to 0 HP, stand back up at 1 HP with +5 STR and a free attack. 1/long rest.',
   '[{"rank":1,"effect":"At 0 HP: stand at 1 HP, +5 STR, free attack. 1/long rest"}]'::jsonb,
   NULL, NULL, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- 4. WARRIOR — ARMS BRANCH
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  -- Tier 1 (Fundamentals)
  ('A1', 'Power Strike', 'warrior', 'arms', 1, 'active', 2,
   'Deal bonus melee damage on your next attack.',
   '[{"rank":1,"effect":"+3 melee damage"},{"rank":2,"effect":"+5 melee damage"}]'::jsonb,
   NULL, NULL, 1),

  ('A2', 'Weapon Focus', 'warrior', 'arms', 1, 'passive', 3,
   'Improve melee attack rolls.',
   '[{"rank":1,"effect":"+1 melee attack"},{"rank":2,"effect":"+2 melee attack"},{"rank":3,"effect":"+3 melee attack"}]'::jsonb,
   NULL, NULL, 2),

  ('A3', 'Reckless Swing', 'warrior', 'arms', 1, 'active', 1,
   'A powerful but reckless melee attack. +5 to hit, +3 damage, but enemies get +3 to hit you until your next turn.',
   '[{"rank":1,"effect":"+5 hit, +3 damage, enemies get +3 to hit you"}]'::jsonb,
   NULL, NULL, 3),

  ('A4', 'Battle Fury', 'warrior', 'arms', 1, 'passive', 2,
   'Each consecutive hit increases your damage.',
   '[{"rank":1,"effect":"+1 damage per consecutive hit (max +3)"},{"rank":2,"effect":"+1 damage per consecutive hit (max +5)"}]'::jsonb,
   NULL, NULL, 4),

  -- Tier 2 (Specialist, 4+ pts)
  ('A5', 'Cleave', 'warrior', 'arms', 2, 'active', 2,
   'Swing in a wide arc damaging all nearby enemies.',
   '[{"rank":1,"effect":"STR damage to all enemies within 2 studs"},{"rank":2,"effect":"STR+2 damage to all enemies within 2 studs"}]'::jsonb,
   NULL, NULL, 5),

  ('A6', 'Execute', 'warrior', 'arms', 2, 'active', 1,
   'Deal double damage to enemies below half HP.',
   '[{"rank":1,"effect":"Double damage vs targets below half HP"}]'::jsonb,
   NULL, NULL, 6),

  ('A7', 'Bloodlust', 'warrior', 'arms', 2, 'passive', 2,
   'Heal when you kill an enemy.',
   '[{"rank":1,"effect":"Heal 3 HP on kill"},{"rank":2,"effect":"Heal 5 HP on kill"}]'::jsonb,
   NULL, NULL, 7),

  ('A8', 'Intimidating Shout', 'warrior', 'arms', 2, 'active', 1,
   'Frighten nearby enemies. Enemies within 4 studs must pass SMT 12 or be frightened for 1 turn.',
   '[{"rank":1,"effect":"Enemies within 4 studs: SMT 12 or frightened 1 turn"}]'::jsonb,
   NULL, NULL, 8),

  ('A9', 'Two-Handed Mastery', 'warrior', 'arms', 2, 'passive', 2,
   'Deal bonus damage with two-handed weapons.',
   '[{"rank":1,"effect":"+2 damage with two-handed weapons"},{"rank":2,"effect":"+4 damage with two-handed weapons"}]'::jsonb,
   NULL, NULL, 9),

  -- Tier 3 (Expert, 8+ pts)
  ('A10', 'Whirlwind', 'warrior', 'arms', 3, 'active', 2,
   'Spin attack damaging all enemies in a larger radius.',
   '[{"rank":1,"effect":"STR damage to all enemies within 3 studs"},{"rank":2,"effect":"STR+3 damage to all enemies within 3 studs"}]'::jsonb,
   NULL, NULL, 10),

  ('A11', 'Rampage', 'warrior', 'arms', 3, 'passive', 1,
   'Critical hit grants a free bonus attack.',
   '[{"rank":1,"effect":"On critical hit, gain a free bonus attack"}]'::jsonb,
   NULL, NULL, 11),

  ('A12', 'Colossus Smash', 'warrior', 'arms', 3, 'active', 1,
   'Your next attack ignores all armor and defense bonuses.',
   '[{"rank":1,"effect":"Next attack ignores armor and defense"}]'::jsonb,
   NULL, NULL, 12),

  ('A13', 'Berserker Rage', 'warrior', 'arms', 3, 'active', 1,
   'Enter a berserker rage for 3 turns. +3 STR, +3 damage, but cannot defend and take +2 damage.',
   '[{"rank":1,"effect":"3 turns: +3 STR, +3 damage, can''t defend, take +2 damage"}]'::jsonb,
   NULL, NULL, 13),

  -- Tier 4 (Mastery, 12+ pts)
  ('A14', 'Bladestorm', 'warrior', 'arms', 4, 'active', 1,
   'For 2 turns, automatically attack all enemies within 3 studs for STR damage.',
   '[{"rank":1,"effect":"2 turns: auto-attack all enemies within 3 studs for STR damage"}]'::jsonb,
   NULL, NULL, 14),

  ('A15', 'Avatar of War', 'warrior', 'arms', 4, 'active', 1,
   'Become an avatar of war for 3 turns. +5 STR, AoE attacks, immune to stun and fear. 1/long rest.',
   '[{"rank":1,"effect":"3 turns: +5 STR, AoE attacks, immune stun/fear. 1/long rest"}]'::jsonb,
   NULL, NULL, 15),

  ('A16', 'Titan''s Grip', 'warrior', 'arms', 4, 'passive', 1,
   'Wield a two-handed weapon in one hand, allowing you to also use a shield.',
   '[{"rank":1,"effect":"Two-handed weapon in one hand + shield"}]'::jsonb,
   NULL, NULL, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- 5. WARRIOR CORE
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  ('WC1', 'Second Wind', 'warrior', 'warrior_core', 1, 'active', 2,
   'Heal yourself. 1/encounter.',
   '[{"rank":1,"effect":"Heal 5 HP. 1/encounter"},{"rank":2,"effect":"Heal 8 HP. 1/encounter"}]'::jsonb,
   NULL, NULL, 1),

  ('WC2', 'Battle Shout', 'warrior', 'warrior_core', 1, 'active', 1,
   'Allies within 4 studs get +2 to attack rolls.',
   '[{"rank":1,"effect":"Allies within 4 studs get +2 attack"}]'::jsonb,
   NULL, NULL, 2),

  ('WC3', 'Thick Skin', 'warrior', 'warrior_core', 1, 'passive', 3,
   'Improve TGH checks.',
   '[{"rank":1,"effect":"+1 TGH checks"},{"rank":2,"effect":"+2 TGH checks"},{"rank":3,"effect":"+3 TGH checks"}]'::jsonb,
   NULL, NULL, 3),

  ('WC4', 'Charge', 'warrior', 'warrior_core', 1, 'active', 2,
   'Rush toward an enemy and attack with bonus damage.',
   '[{"rank":1,"effect":"Rush 8 studs + attack, +3 damage if moved 5+ studs"},{"rank":2,"effect":"Rush 10 studs + attack, +3 damage if moved 5+ studs"}]'::jsonb,
   NULL, NULL, 4),

  ('WC5', 'Heroic Leap', 'warrior', 'warrior_core', 1, 'active', 1,
   'Leap 6 studs and deal 4 damage in a 2-stud radius on landing.',
   '[{"rank":1,"effect":"Jump 6 studs, 4 damage in 2-stud radius"}]'::jsonb,
   NULL, NULL, 5),

  ('WC6', 'Weapon Swap', 'warrior', 'warrior_core', 1, 'passive', 1,
   'Switch weapon loadouts as a free action.',
   '[{"rank":1,"effect":"Switch weapon loadouts as a free action"}]'::jsonb,
   NULL, NULL, 6),

  ('WC7', 'Iron Will', 'warrior', 'warrior_core', 1, 'passive', 2,
   'Resist mental effects.',
   '[{"rank":1,"effect":"+2 vs fear, sleep, and charm"},{"rank":2,"effect":"+4 vs fear, sleep, and charm"}]'::jsonb,
   NULL, NULL, 7),

  ('WC8', 'War Veteran', 'warrior', 'warrior_core', 1, 'passive', 3,
   'Improve initiative.',
   '[{"rank":1,"effect":"+1 initiative"},{"rank":2,"effect":"+2 initiative"},{"rank":3,"effect":"+3 initiative"}]'::jsonb,
   NULL, NULL, 8);

-- ═══════════════════════════════════════════════════════════════════════
-- 6. ROGUE/RANGER — SHADOW BRANCH
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  -- Tier 1 (Fundamentals)
  ('S1', 'Stealth', 'rogue_ranger', 'shadow', 1, 'active', 2,
   'Enter stealth. Breaking stealth guarantees a hit.',
   '[{"rank":1,"effect":"+3 stealth. Breaking stealth = guaranteed hit"},{"rank":2,"effect":"+5 stealth. Breaking stealth = guaranteed hit"}]'::jsonb,
   NULL, NULL, 1),

  ('S2', 'Backstab', 'rogue_ranger', 'shadow', 1, 'passive', 3,
   'Deal bonus damage when attacking from behind or from stealth.',
   '[{"rank":1,"effect":"+2 damage from behind or stealth"},{"rank":2,"effect":"+4 damage from behind or stealth"},{"rank":3,"effect":"+6 damage from behind or stealth"}]'::jsonb,
   NULL, NULL, 2),

  ('S3', 'Shadow Step', 'rogue_ranger', 'shadow', 1, 'active', 1,
   'Teleport 4 studs to a shadow. Count as hidden after teleporting.',
   '[{"rank":1,"effect":"Teleport 4 studs to shadow, count as hidden"}]'::jsonb,
   NULL, NULL, 3),

  ('S4', 'Poison Craft', 'rogue_ranger', 'shadow', 1, 'passive', 2,
   'Your attacks apply poison damage over time.',
   '[{"rank":1,"effect":"+1 poison damage for 2 turns"},{"rank":2,"effect":"+2 poison damage for 2 turns"}]'::jsonb,
   NULL, NULL, 4),

  -- Tier 2 (Specialist, 4+ pts)
  ('S5', 'Garrote', 'rogue_ranger', 'shadow', 2, 'active', 2,
   'From stealth, strangle a target dealing damage and silencing them.',
   '[{"rank":1,"effect":"From stealth: 4 damage + silence 2 turns"},{"rank":2,"effect":"From stealth: 6 damage + silence 2 turns"}]'::jsonb,
   NULL, NULL, 5),

  ('S6', 'Cloak of Shadows', 'rogue_ranger', 'shadow', 2, 'active', 1,
   'Become immune to magical effects for 2 turns and purge all debuffs.',
   '[{"rank":1,"effect":"Immune to magical effects 2 turns, purge debuffs"}]'::jsonb,
   NULL, NULL, 6),

  ('S7', 'Deadly Poison', 'rogue_ranger', 'shadow', 2, 'passive', 3,
   'Poisoned targets suffer attack penalties.',
   '[{"rank":1,"effect":"Poisoned targets get -1 attack"},{"rank":2,"effect":"Poisoned targets get -2 attack"},{"rank":3,"effect":"Poisoned targets get -3 attack"}]'::jsonb,
   NULL, NULL, 7),

  ('S8', 'Ambush', 'rogue_ranger', 'shadow', 2, 'passive', 1,
   'Attacking from stealth grants a free bonus action.',
   '[{"rank":1,"effect":"Stealth attack = free bonus action"}]'::jsonb,
   NULL, NULL, 8),

  ('S9', 'Distraction', 'rogue_ranger', 'shadow', 2, 'active', 1,
   'One enemy turns to investigate a noise. Gain advantage on your next attack against them.',
   '[{"rank":1,"effect":"One enemy turns to investigate, advantage on next attack"}]'::jsonb,
   NULL, NULL, 9),

  -- Tier 3 (Expert, 8+ pts)
  ('S10', 'Shadow Dance', 'rogue_ranger', 'shadow', 3, 'active', 1,
   'For 3 turns, automatically hide after each attack.',
   '[{"rank":1,"effect":"3 turns: auto-hide after each attack"}]'::jsonb,
   NULL, NULL, 10),

  ('S11', 'Envenom', 'rogue_ranger', 'shadow', 3, 'active', 2,
   'Apply a deadly venom dealing heavy poison damage over time.',
   '[{"rank":1,"effect":"+8 poison damage over 3 turns"},{"rank":2,"effect":"+12 poison damage over 3 turns"}]'::jsonb,
   NULL, NULL, 11),

  ('S12', 'Smoke Bomb Mastery', 'rogue_ranger', 'shadow', 3, 'passive', 1,
   'Smoke bombs are larger and deal damage. 5-stud area, lasts 3 turns, 2 damage/turn inside.',
   '[{"rank":1,"effect":"Larger smoke (5 studs), 3 turns, 2 damage/turn inside"}]'::jsonb,
   NULL, NULL, 12),

  ('S13', 'Marked for Death', 'rogue_ranger', 'shadow', 3, 'active', 1,
   'Mark a target. All attacks against them deal +3 damage for 3 turns.',
   '[{"rank":1,"effect":"All attacks deal +3 to marked target for 3 turns"}]'::jsonb,
   NULL, NULL, 13),

  -- Tier 4 (Mastery, 12+ pts)
  ('S14', 'Death Strike', 'rogue_ranger', 'shadow', 4, 'active', 1,
   'From stealth, deal TRIPLE damage. 1/encounter.',
   '[{"rank":1,"effect":"From stealth: TRIPLE damage. 1/encounter"}]'::jsonb,
   NULL, NULL, 14),

  ('S15', 'Living Shadow', 'rogue_ranger', 'shadow', 4, 'active', 1,
   'Summon a shadow clone that copies your attacks for 3 turns.',
   '[{"rank":1,"effect":"Shadow clone copies your attacks for 3 turns"}]'::jsonb,
   NULL, NULL, 15),

  ('S16', 'Phantom Assassin', 'rogue_ranger', 'shadow', 4, 'passive', 1,
   'While hidden, you can move through enemies and walls.',
   '[{"rank":1,"effect":"Move through enemies and walls while hidden"}]'::jsonb,
   NULL, NULL, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- 7. ROGUE/RANGER — PRECISION BRANCH
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  -- Tier 1 (Fundamentals)
  ('PR1', 'Steady Aim', 'rogue_ranger', 'precision', 1, 'passive', 2,
   'Improve ranged attack rolls.',
   '[{"rank":1,"effect":"+1 ranged attack"},{"rank":2,"effect":"+2 ranged attack"}]'::jsonb,
   NULL, NULL, 1),

  ('PR2', 'Aimed Shot', 'rogue_ranger', 'precision', 1, 'active', 2,
   'Take careful aim for a powerful ranged shot. Cannot move on the same turn.',
   '[{"rank":1,"effect":"+4 ranged attack, can''t move same turn"},{"rank":2,"effect":"+6 ranged attack, can''t move same turn"}]'::jsonb,
   NULL, NULL, 2),

  ('PR3', 'Critical Shot', 'rogue_ranger', 'precision', 1, 'passive', 3,
   'Increase critical damage with ranged attacks.',
   '[{"rank":1,"effect":"+2 critical damage on ranged attacks"},{"rank":2,"effect":"+4 critical damage on ranged attacks"},{"rank":3,"effect":"+6 critical damage on ranged attacks"}]'::jsonb,
   NULL, NULL, 3),

  ('PR4', 'Kiting', 'rogue_ranger', 'precision', 1, 'passive', 1,
   'Automatically retreat 2 studs when an enemy approaches.',
   '[{"rank":1,"effect":"Free 2-stud retreat when enemy approaches"}]'::jsonb,
   NULL, NULL, 4),

  -- Tier 2 (Specialist, 4+ pts)
  ('PR5', 'Double Tap', 'rogue_ranger', 'precision', 2, 'active', 1,
   'Fire two quick shots. If both hit, deal +3 bonus damage.',
   '[{"rank":1,"effect":"Two shots, +3 bonus damage if both hit"}]'::jsonb,
   NULL, NULL, 5),

  ('PR6', 'Piercing Shot', 'rogue_ranger', 'precision', 2, 'active', 2,
   'Fire an arrow that passes through multiple enemies.',
   '[{"rank":1,"effect":"Arrow passes through 2 enemies"},{"rank":2,"effect":"Arrow passes through 3 enemies"}]'::jsonb,
   NULL, NULL, 6),

  ('PR7', 'Eagle Eye', 'rogue_ranger', 'precision', 2, 'passive', 2,
   'See enemy HP and spot hidden creatures more easily.',
   '[{"rank":1,"effect":"See enemy HP, +2 to spot hidden"},{"rank":2,"effect":"See enemy HP, +4 to spot hidden"}]'::jsonb,
   NULL, NULL, 7),

  ('PR8', 'Fire Arrow', 'rogue_ranger', 'precision', 2, 'active', 1,
   'Fire a flaming arrow dealing bonus fire damage.',
   '[{"rank":1,"effect":"+4 damage + 2 burn damage/turn for 2 turns"}]'::jsonb,
   NULL, NULL, 8),

  ('PR9', 'Pinning Shot', 'rogue_ranger', 'precision', 2, 'active', 1,
   'Pin a target in place. They cannot move for 2 turns. SPD 14 to resist.',
   '[{"rank":1,"effect":"Target can''t move 2 turns. SPD 14 to resist"}]'::jsonb,
   NULL, NULL, 9),

  -- Tier 3 (Expert, 8+ pts)
  ('PR10', 'Headshot', 'rogue_ranger', 'precision', 3, 'active', 1,
   'Aim for the head. -2 to hit, but deal TRIPLE damage.',
   '[{"rank":1,"effect":"-2 to hit, TRIPLE damage"}]'::jsonb,
   NULL, NULL, 10),

  ('PR11', 'Rain of Arrows', 'rogue_ranger', 'precision', 3, 'active', 2,
   'Fire a volley of arrows into an area.',
   '[{"rank":1,"effect":"SPD damage in 4-stud area"},{"rank":2,"effect":"SPD damage in 6-stud area"}]'::jsonb,
   NULL, NULL, 11),

  ('PR12', 'Sharpshooter', 'rogue_ranger', 'precision', 3, 'passive', 1,
   'Your ranged attacks ignore cover bonuses.',
   '[{"rank":1,"effect":"Ignore cover on ranged attacks"}]'::jsonb,
   NULL, NULL, 12),

  ('PR13', 'Ricochet', 'rogue_ranger', 'precision', 3, 'passive', 1,
   'Missed arrows bounce to a nearby enemy at -4 to hit.',
   '[{"rank":1,"effect":"Missed arrow bounces to nearby enemy at -4"}]'::jsonb,
   NULL, NULL, 13),

  -- Tier 4 (Mastery, 12+ pts)
  ('PR14', 'Phantom Arrow', 'rogue_ranger', 'precision', 4, 'active', 1,
   'Fire an arrow that phases through obstacles and hits any named target.',
   '[{"rank":1,"effect":"Arrow phases through obstacles, hits any named target"}]'::jsonb,
   NULL, NULL, 14),

  ('PR15', 'Bullseye Mastery', 'rogue_ranger', 'precision', 4, 'passive', 1,
   'Your ranged attacks score a critical hit on 19-20.',
   '[{"rank":1,"effect":"Critical hit on 19-20 with ranged attacks"}]'::jsonb,
   NULL, NULL, 15),

  ('PR16', 'Deadeye', 'rogue_ranger', 'precision', 4, 'active', 1,
   'For 3 turns, all ranged attacks automatically hit.',
   '[{"rank":1,"effect":"3 turns: all ranged attacks auto-hit"}]'::jsonb,
   NULL, NULL, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- 8. ROGUE/RANGER — SURVIVAL BRANCH
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  -- Tier 1 (Fundamentals)
  ('V1', 'Bear Trap', 'rogue_ranger', 'survival', 1, 'active', 2,
   'Place a bear trap that damages and roots enemies.',
   '[{"rank":1,"effect":"4 damage + root 1 turn"},{"rank":2,"effect":"6 damage + root 1 turn"}]'::jsonb,
   NULL, NULL, 1),

  ('V2', 'Nature''s Eye', 'rogue_ranger', 'survival', 1, 'passive', 2,
   'Improve nature knowledge and trap detection.',
   '[{"rank":1,"effect":"+2 nature/trap rolls"},{"rank":2,"effect":"+4 nature/trap rolls"}]'::jsonb,
   NULL, NULL, 2),

  ('V3', 'Wolf Companion', 'rogue_ranger', 'survival', 1, 'active', 1,
   'Summon a wolf companion. Wolf has 6 HP, SPD 5, deals 3 damage.',
   '[{"rank":1,"effect":"Summon wolf: 6 HP, SPD 5, 3 damage"}]'::jsonb,
   NULL, NULL, 3),

  ('V4', 'Survivalist', 'rogue_ranger', 'survival', 1, 'passive', 3,
   'Recover more HP on short rests and forage for gold.',
   '[{"rank":1,"effect":"+1 HP on short rest, forage 1 gold"},{"rank":2,"effect":"+2 HP on short rest, forage 1 gold"},{"rank":3,"effect":"+3 HP on short rest, forage 1 gold"}]'::jsonb,
   NULL, NULL, 4),

  -- Tier 2 (Specialist, 4+ pts)
  ('V5', 'Improved Companion', 'rogue_ranger', 'survival', 2, 'passive', 3,
   'Upgrade your animal companion.',
   '[{"rank":1,"effect":"Companion gets +2 HP, +1 damage"},{"rank":2,"effect":"Companion gets +4 HP, +2 damage"},{"rank":3,"effect":"Companion gets +6 HP, +3 damage"}]'::jsonb,
   NULL, NULL, 5),

  ('V6', 'Caltrops', 'rogue_ranger', 'survival', 2, 'active', 2,
   'Scatter caltrops in an area dealing damage and slowing enemies.',
   '[{"rank":1,"effect":"3-stud area, 3 damage + slow"},{"rank":2,"effect":"5-stud area, 3 damage + slow"}]'::jsonb,
   NULL, NULL, 6),

  ('V7', 'Tripwire', 'rogue_ranger', 'survival', 2, 'active', 1,
   'Set a 4-stud tripwire that deals 4 damage and knocks enemies prone.',
   '[{"rank":1,"effect":"4-stud wire, 4 damage + prone"}]'::jsonb,
   NULL, NULL, 7),

  ('V8', 'Natural Remedy', 'rogue_ranger', 'survival', 2, 'active', 2,
   'Heal an ally using natural remedies.',
   '[{"rank":1,"effect":"Heal ally 4 HP"},{"rank":2,"effect":"Heal ally 7 HP"}]'::jsonb,
   NULL, NULL, 8),

  ('V9', 'Pack Tactics', 'rogue_ranger', 'survival', 2, 'passive', 1,
   'When you and your companion attack the same target, gain a hit bonus.',
   '[{"rank":1,"effect":"You + companion vs same target: +2 to hit"}]'::jsonb,
   NULL, NULL, 9),

  -- Tier 3 (Expert, 8+ pts)
  ('V10', 'Bear Companion', 'rogue_ranger', 'survival', 3, 'active', 1,
   'Summon a bear companion. Bear has 12 HP, STR 6, deals 6 damage.',
   '[{"rank":1,"effect":"Summon bear: 12 HP, STR 6, 6 damage"}]'::jsonb,
   NULL, NULL, 10),

  ('V11', 'Trap Network', 'rogue_ranger', 'survival', 3, 'passive', 1,
   'Have 3 traps active at once.',
   '[{"rank":1,"effect":"3 traps active simultaneously"}]'::jsonb,
   NULL, NULL, 11),

  ('V12', 'Vine Snare', 'rogue_ranger', 'survival', 3, 'active', 2,
   'Entangle a target with vines. SPD 14 to resist.',
   '[{"rank":1,"effect":"Root target 1 turn. SPD 14 to resist"},{"rank":2,"effect":"Root target 2 turns. SPD 14 to resist"}]'::jsonb,
   NULL, NULL, 12),

  ('V13', 'Camouflage', 'rogue_ranger', 'survival', 3, 'active', 1,
   'You and 1 ally become hidden with a stealth bonus.',
   '[{"rank":1,"effect":"You + 1 ally hidden, +5 stealth"}]'::jsonb,
   NULL, NULL, 13),

  -- Tier 4 (Mastery, 12+ pts)
  ('V14', 'Eagle Companion', 'rogue_ranger', 'survival', 4, 'active', 1,
   'Summon an eagle companion. Eagle flies 12 studs, has 15 HP, deals 8 damage.',
   '[{"rank":1,"effect":"Summon eagle: flies 12 studs, 15 HP, 8 damage"}]'::jsonb,
   NULL, NULL, 14),

  ('V15', 'Stampede', 'rogue_ranger', 'survival', 4, 'active', 1,
   'All companions charge 8 studs dealing double damage.',
   '[{"rank":1,"effect":"All companions charge 8 studs + double damage"}]'::jsonb,
   NULL, NULL, 15),

  ('V16', 'Primal Guardian', 'rogue_ranger', 'survival', 4, 'passive', 1,
   'Your companion intercepts attacks meant for you.',
   '[{"rank":1,"effect":"Companion intercepts attacks meant for you"}]'::jsonb,
   NULL, NULL, 16);

-- ═══════════════════════════════════════════════════════════════════════
-- 9. ROGUE/RANGER CORE
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO skill_tree_skills
  (skill_code, name, class, branch, tier, skill_type, max_rank, description, rank_effects, lego_tip, effect_json, sort_order)
VALUES
  ('RC1', 'Roll Away', 'rogue_ranger', 'rogue_ranger_core', 1, 'active', 1,
   'React: move 3 studs when an enemy approaches.',
   '[{"rank":1,"effect":"Reaction: move 3 studs when enemy approaches"}]'::jsonb,
   NULL, NULL, 1),

  ('RC2', 'Resourceful', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 3,
   'Improve non-combat skill rolls.',
   '[{"rank":1,"effect":"+1 to non-combat rolls"},{"rank":2,"effect":"+2 to non-combat rolls"},{"rank":3,"effect":"+3 to non-combat rolls"}]'::jsonb,
   NULL, NULL, 2),

  ('RC3', 'Dual Wield', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 1,
   'Deal bonus melee damage when wielding two weapons.',
   '[{"rank":1,"effect":"+2 melee damage with two weapons"}]'::jsonb,
   NULL, NULL, 3),

  ('RC4', 'Quick Reflexes', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 2,
   'Improve initiative.',
   '[{"rank":1,"effect":"+1 initiative"},{"rank":2,"effect":"+2 initiative"}]'::jsonb,
   NULL, NULL, 4),

  ('RC5', 'Smoke Bomb', 'rogue_ranger', 'rogue_ranger_core', 1, 'active', 1,
   'Throw a smoke bomb creating a 3-stud cloud. +5 to hide, -3 to enemy attack rolls. Lasts 2 turns.',
   '[{"rank":1,"effect":"3-stud cloud, +5 hide, -3 enemy attack, 2 turns"}]'::jsonb,
   NULL, NULL, 5),

  ('RC6', 'Lucky', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 2,
   'Improve loot rolls.',
   '[{"rank":1,"effect":"+1 to loot rolls"},{"rank":2,"effect":"+2 to loot rolls"}]'::jsonb,
   NULL, NULL, 6),

  ('RC7', 'Nimble', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 2,
   'Increase movement speed.',
   '[{"rank":1,"effect":"+1 movement (7 total)"},{"rank":2,"effect":"+2 movement (8 total)"}]'::jsonb,
   NULL, NULL, 7),

  ('RC8', 'Opportunist', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 1,
   'Deal bonus damage to impaired enemies.',
   '[{"rank":1,"effect":"+3 damage vs stunned, blinded, or prone targets"}]'::jsonb,
   NULL, NULL, 8);

-- ═══════════════════════════════════════════════════════════════════════
-- Done. Total: 3 starters + 16 protection + 16 arms + 8 warrior core
--           + 16 shadow + 16 precision + 16 survival + 8 rogue/ranger core
--           = 99 skills
-- ═══════════════════════════════════════════════════════════════════════
