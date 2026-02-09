-- LEGO QUEST — Rogue/Ranger Skill Tree Seed Data
-- 75 skills: Shadow (23), Precision (23), Survival (23), Rogue/Ranger Core (6)

-- ═══ SHADOW BRANCH ══════════════════════════════════════════════════════

-- Tier 1 (0 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('S1', 'Backstab', 'rogue_ranger', 'shadow', 1, 'active', 2, 'Attack from behind or while hidden: deal weapon damage +3/+5 bonus damage.', NULL, 10),
('S2', 'Stealth Mastery', 'rogue_ranger', 'shadow', 1, 'passive', 3, '+2/+4/+6 to all stealth and hide rolls.', NULL, 20),
('S3', 'Poison Blade', 'rogue_ranger', 'shadow', 1, 'active', 1, 'Coat weapon in poison: next 2 attacks deal +2 poison damage each. Poison stacks if both hit same target.', 'Put a green 1x1 tile on your weapon!', 30),
('S4', 'Quick Dodge', 'rogue_ranger', 'shadow', 1, 'passive', 2, '+1/+2 to all dodge and defense rolls.', NULL, 40),
('S5', 'Pocket Sand', 'rogue_ranger', 'shadow', 1, 'active', 1, 'Throw sand in enemy face within 2 studs: blinded for 1 turn (-5 to all attack rolls). No roll needed.', NULL, 50);

-- Tier 2 (3 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('S6', 'Shadow Step', 'rogue_ranger', 'shadow', 2, 'active', 1, 'Teleport to any shadow or dark area within 6 studs. You count as hidden after teleporting.', 'Pick up the minifig and place it behind an enemy!', 60),
('S7', 'Crippling Poison', 'rogue_ranger', 'shadow', 2, 'passive', 2, 'Poison effects also slow target: -1/-2 movement for 2 turns.', NULL, 70),
('S8', 'Cheap Shot', 'rogue_ranger', 'shadow', 2, 'active', 1, 'Sucker punch from stealth: target stunned for 1 turn. Must be hidden to use.', NULL, 80),
('S9', 'Evasion', 'rogue_ranger', 'shadow', 2, 'active', 2, 'React (free action): When hit, reduce damage by half / completely negate it. Once / twice per encounter.', NULL, 90),
('S10', 'Poisoner''s Kit', 'rogue_ranger', 'shadow', 2, 'passive', 2, 'Poison Blade ability now lasts for 3/4 attacks instead of 2.', NULL, 100);

-- Tier 3 (6 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('S11', 'Vanish', 'rogue_ranger', 'shadow', 3, 'active', 1, 'Disappear in combat. Hidden for 2 turns. Next attack from hidden is automatic critical hit. Once per encounter.', NULL, 110),
('S12', 'Fan of Knives', 'rogue_ranger', 'shadow', 3, 'active', 2, 'Throw knives at every enemy within 4/5 studs. Each takes SPD damage.', NULL, 120),
('S13', 'Deadly Poison', 'rogue_ranger', 'shadow', 3, 'passive', 3, 'All poison damage: +1/+2/+3 to every tick.', NULL, 130),
('S14', 'Shadowmeld', 'rogue_ranger', 'shadow', 3, 'passive', 1, 'If you do not move or attack on your turn, automatically become hidden at end of turn.', NULL, 140),
('S15', 'Ambush', 'rogue_ranger', 'shadow', 3, 'active', 1, 'Leap from stealth to target within 4 studs: deal weapon damage + SPD bonus. Counts as attacking from behind.', NULL, 150),
('S16', 'Nimble Fingers', 'rogue_ranger', 'shadow', 3, 'passive', 2, '+2/+4 to lockpicking, trap disarming, and pickpocket rolls.', NULL, 160);

-- Tier 4 (10 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('S17', 'Death Mark', 'rogue_ranger', 'shadow', 4, 'active', 1, 'Mark one enemy: for 3 turns, ALL attacks against them deal +5 bonus damage. Once per encounter.', NULL, 170),
('S18', 'Shadow Dance', 'rogue_ranger', 'shadow', 4, 'active', 1, 'For 3 turns: after every attack, automatically become hidden again. Once per encounter.', NULL, 180),
('S19', 'Lethal Dose', 'rogue_ranger', 'shadow', 4, 'passive', 2, 'If enemy has 3+ stacks of poison, they take extra 4/8 burst damage at start of turn.', NULL, 190),
('S20', 'Cloak of Shadows', 'rogue_ranger', 'shadow', 4, 'active', 1, 'React: Immune to all magic and ranged attacks for 1 turn.', NULL, 200),
('S21', 'Heist', 'rogue_ranger', 'shadow', 4, 'active', 1, 'Steal weapon or item from enemy in combat. Against bosses: steal consumable or key item.', NULL, 210);

-- Tier 5 (15 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('S22', 'Deathstrike', 'rogue_ranger', 'shadow', 5, 'active', 1, 'Attack from stealth: deal QUADRUPLE weapon damage. Target TGH check (DC 18) or instantly defeated. Bosses take quadruple but cannot be instantly defeated. Once per encounter.', NULL, 220),
('S23', 'Living Shadow', 'rogue_ranger', 'shadow', 5, 'passive', 1, 'Shadow copies every melee attack as free action, doubling melee damage output permanently.', NULL, 230);

-- ═══ PRECISION BRANCH ═══════════════════════════════════════════════════

-- Tier 1 (0 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('R1', 'Steady Aim', 'rogue_ranger', 'precision', 1, 'passive', 3, '+1/+2/+3 to all ranged attack rolls.', 'Equip a bow or crossbow piece!', 10),
('R2', 'Quick Shot', 'rogue_ranger', 'precision', 1, 'active', 1, 'Fire two arrows this turn. Second arrow at -2 to hit.', NULL, 20),
('R3', 'Hunter''s Mark', 'rogue_ranger', 'precision', 1, 'active', 1, 'Mark one enemy: all YOUR attacks against that target deal +2 damage for the encounter. Free action.', NULL, 30),
('R4', 'Sharp Eyes', 'rogue_ranger', 'precision', 1, 'passive', 2, '+2/+4 to spot hidden enemies, traps, and secrets.', NULL, 40),
('R5', 'Kiting', 'rogue_ranger', 'precision', 1, 'passive', 2, 'After ranged attack, move 1/2 studs as free action.', NULL, 50);

-- Tier 2 (3 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('R6', 'Aimed Shot', 'rogue_ranger', 'precision', 2, 'active', 2, 'Full turn to aim (no move): deal weapon damage x 2 / x 2.5 (rounded up).', NULL, 60),
('R7', 'Critical Shot', 'rogue_ranger', 'precision', 2, 'passive', 3, 'Ranged crits deal +2/+4/+6 bonus damage on top of normal double.', NULL, 70),
('R8', 'Fire Arrow', 'rogue_ranger', 'precision', 2, 'active', 1, 'Flaming arrow: normal damage + 2 fire damage per turn for 2 turns. Also lights up dark areas.', 'Put an orange 1x1 tile on the arrow!', 80),
('R9', 'Long Range', 'rogue_ranger', 'precision', 2, 'passive', 2, 'Ranged attack range +2/+4 studs.', NULL, 90),
('R10', 'Pinning Shot', 'rogue_ranger', 'precision', 2, 'active', 1, 'Arrow through enemy foot: normal damage + cannot move for 1 turn. SPD check DC 12 to resist.', NULL, 100);

-- Tier 3 (6 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('R11', 'Piercing Shot', 'rogue_ranger', 'precision', 3, 'active', 2, 'Arrow passes through all enemies in a line (up to 3/5 targets). Each takes full weapon damage.', NULL, 110),
('R12', 'Eagle Eye', 'rogue_ranger', 'precision', 3, 'passive', 1, 'See exact HP of any enemy within ranged attack range.', NULL, 120),
('R13', 'Ice Arrow', 'rogue_ranger', 'precision', 3, 'active', 1, 'Freezing arrow: normal damage + movement halved and -2 to attacks for 2 turns.', 'Blue 1x1 tile on the arrow!', 130),
('R14', 'Headshot', 'rogue_ranger', 'precision', 3, 'passive', 3, 'On natural 20 ranged: TRIPLE damage / also stun 1 turn / also ignore all armor and defense.', NULL, 140),
('R15', 'Covering Fire', 'rogue_ranger', 'precision', 3, 'active', 1, 'Choose 3-stud area: enemies entering or starting turn there take SPD damage. Lasts 2 turns.', NULL, 150),
('R16', 'Wind Reader', 'rogue_ranger', 'precision', 3, 'passive', 2, 'Ignore -1/-2 penalties from cover, obstacles, and partial line-of-sight.', NULL, 160);

-- Tier 4 (10 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('R17', 'Rain of Arrows', 'rogue_ranger', 'precision', 4, 'active', 1, 'Volley into sky: every enemy in 5-stud area takes SPD + 3 damage. Once per encounter.', 'Drop a handful of small pieces onto the board area!', 170),
('R18', 'Killshot', 'rogue_ranger', 'precision', 4, 'active', 1, 'Against enemies below 25% HP: deal SPD x 3 damage. Auto-hits. Once per encounter.', NULL, 180),
('R19', 'Hawkeye Focus', 'rogue_ranger', 'precision', 4, 'active', 1, 'For 3 turns: all ranged attacks get +3 to hit AND +3 damage. Once per encounter.', NULL, 190),
('R20', 'Ricochet', 'rogue_ranger', 'precision', 4, 'passive', 2, 'Ranged attacks bounce to 1/2 additional enemies within 3 studs for half damage each.', NULL, 200),
('R21', 'Sniper''s Nest', 'rogue_ranger', 'precision', 4, 'active', 1, 'Cannot move but gain +5 to all ranged attacks and range doubles for 3 turns.', 'Place minifig on a raised platform or wall!', 210);

-- Tier 5 (15 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('R22', 'Phantom Arrow', 'rogue_ranger', 'precision', 5, 'active', 1, 'Single perfect arrow: auto-hit, 30 flat damage, ignores all defense and armor, stuns 2 turns. Once per encounter.', NULL, 220),
('R23', 'Bullseye Mastery', 'rogue_ranger', 'precision', 5, 'passive', 1, 'Ranged crit range permanently becomes 16-20 (25% chance to crit).', NULL, 230);

-- ═══ SURVIVAL BRANCH ════════════════════════════════════════════════════

-- Tier 1 (0 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('V1', 'Bear Trap', 'rogue_ranger', 'survival', 1, 'active', 2, 'Place hidden trap within 3 studs. First enemy stepping on it takes 4/6 damage and cannot move for 1 turn.', 'Place a small piece face-down — flip when triggered!', 10),
('V2', 'Nature''s Eye', 'rogue_ranger', 'survival', 1, 'passive', 2, '+2/+4 to spotting traps, tracking, finding hidden paths, and nature rolls.', NULL, 20),
('V3', 'Wolf Companion', 'rogue_ranger', 'survival', 1, 'active', 1, 'Call a loyal wolf: 6 HP, SPD 5, deals 3 damage, moves on your turn. Lasts until killed or combat ends. Once per encounter.', 'Place a wolf minifig or dog piece on the board!', 30),
('V4', 'Survivalist', 'rogue_ranger', 'survival', 1, 'passive', 3, '+1/+2/+3 HP healed whenever you take a short rest. Also forage for 1 gold after each rest.', NULL, 40),
('V5', 'Tripwire', 'rogue_ranger', 'survival', 1, 'active', 1, 'Stretch wire across 3-stud line. First enemy crossing takes 3 damage and falls prone.', NULL, 50);

-- Tier 2 (3 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('V6', 'Improved Companion', 'rogue_ranger', 'survival', 2, 'passive', 3, 'Wolf Companion gets +2/+4/+6 HP and +1/+2/+3 damage.', NULL, 60),
('V7', 'Caltrops', 'rogue_ranger', 'survival', 2, 'active', 1, 'Scatter caltrops across 4-stud area. Enemies entering take 2 damage and are slowed for 1 turn. Lasts 3 turns.', 'Scatter small gray pieces in the area!', 70),
('V8', 'Camouflage', 'rogue_ranger', 'survival', 2, 'active', 1, 'You and one ally within 3 studs become hidden until you attack or move. +5 to stealth rolls while camouflaged.', NULL, 80),
('V9', 'Snare Master', 'rogue_ranger', 'survival', 2, 'passive', 2, 'Traps deal +2/+4 extra damage. All traps last 1 extra turn.', NULL, 90),
('V10', 'Danger Sense', 'rogue_ranger', 'survival', 2, 'passive', 1, 'Cannot be surprised. First round of combat: +3 initiative and +2 defense.', NULL, 100);

-- Tier 3 (6 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('V11', 'Bear Companion', 'rogue_ranger', 'survival', 3, 'active', 1, 'Upgrade: summon a bear instead. 12 HP, STR 5, deals 6 damage. Slower (SPD 3) but tougher. Replaces wolf.', 'Bigger animal piece or custom build!', 110),
('V12', 'Explosive Trap', 'rogue_ranger', 'survival', 3, 'active', 2, 'Trap that explodes when triggered: 6/9 damage in 2-stud radius. Hits all enemies in blast.', 'Use a red 1x1 tile face-down!', 120),
('V13', 'Pack Tactics', 'rogue_ranger', 'survival', 3, 'passive', 2, 'When you and companion both attack same target in same turn, attacks deal +2/+4 bonus damage each.', NULL, 130),
('V14', 'Natural Remedy', 'rogue_ranger', 'survival', 3, 'active', 2, 'Mix potion from foraged ingredients: heal self or ally for 4/7 HP. Twice per encounter.', NULL, 140),
('V15', 'Trap Network', 'rogue_ranger', 'survival', 3, 'passive', 1, 'Can have 3 traps active simultaneously instead of 1.', NULL, 150),
('V16', 'Thick Fur', 'rogue_ranger', 'survival', 3, 'passive', 2, 'Animal companion takes -1/-2 less damage from all sources.', NULL, 160);

-- Tier 4 (10 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('V17', 'Eagle Companion', 'rogue_ranger', 'survival', 4, 'active', 1, 'Summon giant eagle: 10 HP, SPD 8 (flying), deals 5 damage. Can carry one ally 8 studs through air. Replaces bear/wolf.', NULL, 170),
('V18', 'Minefield', 'rogue_ranger', 'survival', 4, 'active', 1, 'Place 5 hidden traps in 5-stud area. Each deals 4 damage when stepped on. Once per encounter.', 'Place 5 small pieces face-down — chaos!', 180),
('V19', 'Alpha Command', 'rogue_ranger', 'survival', 4, 'active', 1, 'Companion makes 2 attacks this turn and moves extra 3 studs. Once per encounter.', NULL, 190),
('V20', 'Entangling Vines', 'rogue_ranger', 'survival', 4, 'active', 1, 'Vines in 4-stud area: all enemies rooted for 2 turns and take 3 damage per turn. SPD check DC 14 to break free.', NULL, 200),
('V21', 'Companion Bond', 'rogue_ranger', 'survival', 4, 'passive', 2, 'When companion deals damage, you heal 1/2 HP. When you deal damage, companion heals 1/2 HP.', NULL, 210);

-- Tier 5 (15 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('V22', 'Stampede', 'rogue_ranger', 'survival', 5, 'active', 1, 'Call stampede: every enemy takes 20 damage and is knocked prone. Allies unharmed. Once per encounter.', 'Dump a bag of animal pieces onto the board!', 220),
('V23', 'Primal Guardian', 'rogue_ranger', 'survival', 5, 'passive', 1, 'Animal companion becomes legendary: +10 HP, +3 to all stats, and it can use one of YOUR action bar abilities once per turn.', NULL, 230);

-- ═══ ROGUE/RANGER CORE ══════════════════════════════════════════════════

INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('RC1', 'Roll Away', 'rogue_ranger', 'rogue_ranger_core', 1, 'active', 1, 'React (free action): When enemy moves adjacent, immediately move 3 studs away without triggering attacks.', NULL, 10),
('RC2', 'Resourceful', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 3, '+1/+2/+3 to all non-combat skill checks.', NULL, 20),
('RC3', 'Dual Wield', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 1, 'Hold weapon in each hand. Melee attack deals +2 bonus damage from off-hand.', 'Weapon in each hand!', 30),
('RC4', 'Quick Reflexes', 'rogue_ranger', 'rogue_ranger_core', 1, 'passive', 2, '+1/+2 to initiative rolls.', NULL, 40),
('RC5', 'Smoke Bomb', 'rogue_ranger', 'rogue_ranger_core', 1, 'active', 1, 'Throw smoke bomb: 3-stud cloud. +5 to hide, -3 to attack inside. Lasts 2 turns.', 'Place a cotton ball or gray brick cluster!', 50),
('RC6', 'Grapple Hook', 'rogue_ranger', 'rogue_ranger_core', 1, 'active', 1, 'Throw hook and swing to any point within 8 studs. Ignore all terrain.', 'The minifig flies through the air!', 60);
