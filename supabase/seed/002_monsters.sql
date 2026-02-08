-- LEGO QUEST — Monster Seed Data
-- Monsters from core-rules.md

-- Level 1 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Goblin Scout',    1, false, 'humanoid',  2, 2, 4, 1, 2, 3,  6, 2, 'physical', 'A sneaky goblin with a rusty dagger. Quick but fragile.'),
('Skeleton',        1, false, 'undead',    3, 3, 2, 1, 1, 1,  9, 3, 'physical', 'Bones rattle as it shambles forward with a chipped sword.'),
('Giant Rat',       1, false, 'beast',     2, 2, 3, 1, 1, 2,  6, 2, 'physical', 'An oversized rat with glowing red eyes.'),
('Slime',           1, false, 'elemental', 4, 1, 1, 1, 1, 1, 12, 1, 'physical', 'A wobbly blob of green goo. Hard to hurt, easy to dodge.'),
('Bandit',          1, false, 'humanoid',  3, 3, 3, 1, 2, 2,  9, 3, 'physical', 'A rough-looking thief armed with a short sword.');

-- Level 2 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Goblin Warrior',  2, false, 'humanoid',  3, 3, 4, 1, 2, 3,  9, 3, 'physical', 'Tougher than a scout, with a real shield.'),
('Zombie',          2, false, 'undead',    5, 3, 1, 1, 1, 1, 15, 3, 'physical', 'Slow but sturdy. Keeps coming even when hit hard.'),
('Wolf',            2, false, 'beast',     3, 3, 4, 1, 2, 2,  9, 3, 'physical', 'A snarling grey wolf with sharp fangs.'),
('Fire Beetle',     2, false, 'beast',     3, 2, 3, 2, 1, 2,  9, 2, 'fire',     'A beetle with a glowing hot shell. Spits tiny sparks.');

-- Level 3 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Orc Grunt',       3, false, 'humanoid',  4, 5, 2, 1, 2, 2, 12, 5, 'physical', 'A burly orc swinging a heavy axe.'),
('Shadow Wisp',     3, false, 'elemental', 2, 1, 5, 4, 3, 3,  6, 4, 'ice',      'A floating dark cloud that chills everything it touches.'),
('Poison Spider',   3, false, 'beast',     3, 2, 4, 2, 2, 3,  9, 2, 'poison',   'Skitters fast and leaves sticky webs. Venomous bite.');

-- Level 5 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Orc Shaman',      5, false, 'humanoid',  4, 3, 3, 6, 4, 3, 12, 6, 'fire',     'An orc caster hurling fire bolts and buffing allies.'),
('Stone Golem',     5, false, 'construct', 7, 6, 1, 1, 1, 1, 21, 6, 'physical', 'A hulking stone figure. Slow but hits like a boulder.'),
('Dire Wolf',       5, false, 'beast',     5, 5, 5, 1, 3, 3, 15, 5, 'physical', 'Bigger and meaner than a normal wolf. Hunts in packs.');

-- Level 7 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Dark Knight',     7, false, 'humanoid',  6, 7, 4, 3, 4, 4, 18, 7, 'physical', 'An armored warrior wreathed in shadow.'),
('Flame Elemental', 7, false, 'elemental', 5, 4, 5, 7, 3, 3, 15, 7, 'fire',     'A living pillar of fire that scorches everything nearby.'),
('Wraith',          7, false, 'undead',    4, 3, 6, 6, 5, 5, 12, 6, 'ice',      'A ghostly figure that drains life with its touch.');

-- Level 10 Monsters
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, description) VALUES
('Demon Soldier',  10, false, 'demon',     7, 8, 5, 5, 4, 4, 21, 8, 'fire',     'A horned fiend from the Shadow Tower.'),
('Ancient Treant', 10, false, 'elemental', 10, 7, 2, 4, 6, 3, 30, 7, 'physical', 'A massive living tree that guards the forest.');

-- BOSSES
INSERT INTO monsters (name, level, is_boss, category, stat_con, stat_str, stat_agi, stat_mna, stat_int, stat_lck, hp, damage, damage_type, special_abilities, description) VALUES
('Goblin King',        3, true, 'humanoid',  5, 4, 4, 2, 3, 5, 15, 4, 'physical',
  '[{"name":"Rally Cry","description":"All goblins get +2 STR for 2 turns"},{"name":"Dirty Trick","description":"Throws sand, target loses next attack"}]',
  'The Goblin King sits on his junk throne, wearing a tin crown.'),
('Bone Dragon',        5, true, 'undead',    8, 7, 4, 5, 4, 3, 24, 7, 'ice',
  '[{"name":"Frost Breath","description":"3 damage ice to all heroes in a cone"},{"name":"Tail Sweep","description":"2 damage physical to 2 adjacent heroes"}]',
  'A skeletal dragon that breathes freezing cold mist.'),
('Shadow Lord',        7, true, 'demon',     7, 6, 6, 8, 7, 5, 21, 8, 'ice',
  '[{"name":"Shadow Bolt","description":"5 damage ice to one hero, ignores armor"},{"name":"Summon Shadows","description":"Summons 2 Shadow Wisps"},{"name":"Dark Shield","description":"Absorbs next 5 damage"}]',
  'The master of the Shadow Tower. Dark magic crackles around him.'),
('Dragon of the Stolen Crown', 10, true, 'beast', 12, 10, 5, 8, 7, 6, 36, 10, 'fire',
  '[{"name":"Fire Breath","description":"5 damage fire to all heroes"},{"name":"Wing Buffet","description":"3 damage physical, pushes back 2 studs"},{"name":"Terrifying Roar","description":"All heroes must pass INT+8 or lose next action"},{"name":"Crown Blast","description":"Ultimate: 8 damage holy to one hero"}]',
  'The final boss. A colossal dragon wearing the Stolen Crown on its horned head.');
