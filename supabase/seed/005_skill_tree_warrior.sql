-- LEGO QUEST — Warrior Skill Tree Seed Data
-- 52 skills: Protection (23), Arms (23), Warrior Core (6)

-- ═══ PROTECTION BRANCH ═════════════════════════════════════════════════

-- Tier 1 (0 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('P1', 'Shield Mastery', 'warrior', 'protection', 1, 'passive', 3, '+1/+2/+3 defense when a shield is equipped.', 'Attach a shield piece to your minifig for the bonus!', 10),
('P2', 'Shield Bash', 'warrior', 'protection', 1, 'active', 1, 'Melee attack: deal STR damage + push enemy back 2 studs. If they hit a wall or another enemy, stunned for 1 turn.', NULL, 20),
('P3', 'Toughened Hide', 'warrior', 'protection', 1, 'passive', 3, '+2/+4/+6 max HP permanently.', NULL, 30),
('P4', 'Taunt', 'warrior', 'protection', 1, 'active', 1, 'Force one enemy within 4 studs to attack only you for 2 turns. No roll needed.', NULL, 40),
('P5', 'Battle Stance', 'warrior', 'protection', 1, 'passive', 2, 'Reduce all incoming damage by 1/2 (minimum 1 damage). Requires shield equipped.', NULL, 50);

-- Tier 2 (3 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('P6', 'Iron Wall', 'warrior', 'protection', 2, 'active', 1, 'Raise your shield: completely block the next 2 attacks against you. Uses your action.', NULL, 60),
('P7', 'Revenge', 'warrior', 'protection', 2, 'active', 2, 'React (free action): After being hit by melee, next attack deals +3/+5 bonus damage. Must use before next turn ends.', NULL, 70),
('P8', 'Thick Skin', 'warrior', 'protection', 2, 'passive', 3, '+10%/+15%/+20% max HP (rounded up). Stacks with Toughened Hide.', NULL, 80),
('P9', 'Shield Throw', 'warrior', 'protection', 2, 'active', 1, 'Hurl shield at enemy within 6 studs: deal STR damage. Bounces to 1 adjacent enemy for half damage, returns to you.', NULL, 90),
('P10', 'Fortified', 'warrior', 'protection', 2, 'passive', 2, 'Reduce damage from poison, fire, and traps by 2/4.', NULL, 100);

-- Tier 3 (6 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('P11', 'Bodyguard', 'warrior', 'protection', 3, 'active', 1, 'Choose ally within 3 studs. For 3 turns, attacks targeting them hit you instead. You take half damage from redirected attacks.', NULL, 110),
('P12', 'Shield Slam Combo', 'warrior', 'protection', 3, 'active', 2, 'Upgraded Shield Bash: hits in a 2-stud cone. Deals STR +2/STR +4 damage. Pushes all targets back 2 studs.', NULL, 120),
('P13', 'Armored to the Teeth', 'warrior', 'protection', 3, 'passive', 3, '+1/+2/+3 to ALL defense rolls (stacks with Shield Mastery).', NULL, 130),
('P14', 'Rallying Presence', 'warrior', 'protection', 3, 'passive', 2, 'All allies within 4 studs get +1/+2 to defense rolls while you are standing. Aura - always active.', NULL, 140),
('P15', 'Counter Strike', 'warrior', 'protection', 3, 'active', 1, 'React (free action): When enemy misses melee attack against you, immediately attack them for STR damage.', NULL, 150),
('P16', 'Regeneration', 'warrior', 'protection', 3, 'passive', 3, 'Heal 1/2/3 HP at start of each of your turns. Does not work while knocked out.', NULL, 160);

-- Tier 4 (10 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('P17', 'Fortress', 'warrior', 'protection', 4, 'active', 1, 'Plant yourself (cannot move for 3 turns). Take half damage from ALL sources. Enemies within 3 studs deal -3 damage to everyone.', NULL, 170),
('P18', 'Mass Taunt', 'warrior', 'protection', 4, 'active', 1, 'ALL enemies within 5 studs must attack only you for 2 turns. No roll, no save. Once per encounter.', NULL, 180),
('P19', 'Living Shield', 'warrior', 'protection', 4, 'passive', 2, 'When ally within 3 studs would be knocked out, you take the killing blow instead. Triggers 1/2 times per encounter.', NULL, 190),
('P20', 'Unbreakable Spirit', 'warrior', 'protection', 4, 'passive', 2, 'When knocked to 0 HP, automatically revive with 5/10 HP. Once per encounter.', NULL, 200),
('P21', 'Shield Fortress', 'warrior', 'protection', 4, 'active', 1, 'Create a 4-stud-wide shield wall. Blocks ALL ranged attacks and movement for 3 turns. Allies behind it get +3 defense.', NULL, 210);

-- Tier 5 (15 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('P22', 'Avatar of the Shield', 'warrior', 'protection', 5, 'active', 1, 'For 3 turns: immune to knockback, stun, and fear. All damage halved. All allies within 6 studs share your damage reduction. Once per encounter.', NULL, 220),
('P23', 'Immortal Sentinel', 'warrior', 'protection', 5, 'passive', 1, 'Cannot be knocked below 1 HP. While at 1 HP, melee damage is doubled. Can still be healed normally.', NULL, 230);

-- ═══ ARMS BRANCH ════════════════════════════════════════════════════════

-- Tier 1 (0 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('A1', 'Weapon Specialization', 'warrior', 'arms', 1, 'passive', 3, '+1/+2/+3 melee damage with two-handed weapons.', 'Equip a big sword, axe, or hammer piece!', 10),
('A2', 'Mighty Swing', 'warrior', 'arms', 1, 'active', 1, 'Powerful overhead strike: deal STR + 3 damage to one target. Uses your full turn (no move).', NULL, 20),
('A3', 'Battle Fury', 'warrior', 'arms', 1, 'passive', 3, 'After defeating an enemy, gain +1/+2/+3 to your next attack roll. Stacks if you defeat multiple enemies. Resets at end of combat.', NULL, 30),
('A4', 'Reckless Strike', 'warrior', 'arms', 1, 'active', 1, 'Attack with +5 to your hit roll, but enemies get +3 to hit YOU until your next turn.', NULL, 40),
('A5', 'Bloodlust', 'warrior', 'arms', 1, 'passive', 2, 'Heal 1/2 HP whenever you defeat an enemy.', NULL, 50);

-- Tier 2 (3 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('A6', 'Cleave', 'warrior', 'arms', 2, 'active', 2, 'Swing hitting ALL enemies within 2/3 studs in front of you. Each takes STR damage.', 'Sweep the minifig weapon across multiple enemies!', 60),
('A7', 'Critical Eye', 'warrior', 'arms', 2, 'passive', 3, 'Critical hit range improves: 19-20 / 18-20 / 17-20.', NULL, 70),
('A8', 'Charge', 'warrior', 'arms', 2, 'active', 1, 'Rush up to 8 studs in a straight line. Attack the first enemy you reach. Deal +3 bonus damage if moved at least 4 studs.', 'Slide the minifig across the board!', 80),
('A9', 'Focused Rage', 'warrior', 'arms', 2, 'passive', 2, 'When you take damage, next melee attack deals +2/+4 bonus damage. Resets after you attack.', NULL, 90),
('A10', 'Intimidating Shout', 'warrior', 'arms', 2, 'active', 1, 'All enemies within 3 studs make TGH check (DC 12) or frightened for 1 turn: -2 to attack rolls.', NULL, 100);

-- Tier 3 (6 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('A11', 'Whirlwind', 'warrior', 'arms', 3, 'active', 2, 'Spin attack: hit ALL enemies within 2 studs for STR +2/STR +5 damage.', 'Spin the minifig on the board!', 110),
('A12', 'Execute', 'warrior', 'arms', 3, 'active', 1, 'Against enemies below half HP: deal STR x 2 damage. If this kills them, take another action this turn.', NULL, 120),
('A13', 'Deep Wounds', 'warrior', 'arms', 3, 'passive', 3, 'Critical hits cause bleeding: target takes extra 2/3/4 damage at start of their next 2 turns.', NULL, 130),
('A14', 'Titan''s Grip', 'warrior', 'arms', 3, 'passive', 1, 'Hold a two-handed weapon in ONE hand. Can dual-wield two-handed weapons, or hold two-hander + shield.', 'Put a big weapon in each hand!', 140),
('A15', 'War Cry', 'warrior', 'arms', 3, 'active', 2, 'All allies within 4 studs get +2/+4 to next attack roll. Free action.', NULL, 150),
('A16', 'Relentless', 'warrior', 'arms', 3, 'passive', 2, 'On your turn, move +1/+2 extra studs (total 7/8 instead of 6).', NULL, 160);

-- Tier 4 (10 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('A17', 'Devastating Blow', 'warrior', 'arms', 4, 'active', 1, 'Single massive strike: deal STR x 3 damage. Target stunned for 1 turn. 3-turn cooldown.', NULL, 170),
('A18', 'Bloodbath', 'warrior', 'arms', 4, 'active', 1, 'For 3 turns: every melee damage heals you for half the damage dealt. Once per encounter.', NULL, 180),
('A19', 'Unstoppable Force', 'warrior', 'arms', 4, 'passive', 2, 'Immune to slow, root, and stun effects for the first 1/2 rounds of combat.', NULL, 190),
('A20', 'Rampage', 'warrior', 'arms', 4, 'active', 1, 'Go berserk: make 3 separate melee attacks this turn against any enemies within reach. Once per encounter.', NULL, 200),
('A21', 'Blade Storm', 'warrior', 'arms', 4, 'active', 1, 'Move up to 6 studs in any path. Every enemy you pass within 1 stud takes STR + 3 damage. Cannot be stopped.', NULL, 210);

-- Tier 5 (15 points required)
INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('A22', 'Avatar of War', 'warrior', 'arms', 5, 'active', 1, 'For 3 turns: +5 STR, every melee attack hits ALL adjacent enemies, crits deal TRIPLE damage. Once per encounter.', NULL, 220),
('A23', 'One-Shot Kill', 'warrior', 'arms', 5, 'passive', 1, 'Once per encounter: if damage would reduce non-boss enemy to 5 HP or less, instantly defeated. Bosses immune.', NULL, 230);

-- ═══ WARRIOR CORE ═══════════════════════════════════════════════════════

INSERT INTO skill_tree_skills (skill_code, name, class, branch, tier, skill_type, max_rank, description, lego_tip, sort_order) VALUES
('WC1', 'Second Wind', 'warrior', 'warrior_core', 1, 'active', 2, 'Heal yourself for 5/8 HP. Once per encounter. Free action alongside normal action.', NULL, 10),
('WC2', 'Battle Hardened', 'warrior', 'warrior_core', 1, 'passive', 3, '+1/+2/+3 to initiative rolls.', NULL, 20),
('WC3', 'Weapon Swap', 'warrior', 'warrior_core', 1, 'passive', 1, 'Switch between two equipped weapon sets as a free action during combat.', 'Keep two weapon loadouts ready and swap pieces mid-fight!', 30),
('WC4', 'Victory Rush', 'warrior', 'warrior_core', 1, 'passive', 2, 'After defeating an enemy, gain +2/+4 movement on your next turn.', NULL, 40),
('WC5', 'Demoralizing Shout', 'warrior', 'warrior_core', 1, 'active', 1, 'All enemies within 4 studs deal -2 damage for 2 turns.', NULL, 50),
('WC6', 'Heroic Leap', 'warrior', 'warrior_core', 1, 'active', 1, 'Jump to any point within 6 studs (ignore terrain). Enemies within 2 studs of landing take 3 damage and are knocked prone.', 'Physically leap the minifig through the air!', 60);
