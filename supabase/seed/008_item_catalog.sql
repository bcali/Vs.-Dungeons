-- LEGO QUEST — Item Catalog Seed Data
-- ~25 items across all types and rarities for the GM quick-pick menu

-- ═══ WEAPONS ═════════════════════════════════════════════════════════════

INSERT INTO item_catalog (name, item_type, rarity, description, effect_json) VALUES
('Brick Blade',           'weapon', 'common',    'A sturdy sword forged from interlocking bricks. Reliable and sharp.',                     '{"gearBonus": {"str": 1}}'),
('Rusty Spanner Mace',    'weapon', 'common',    'A heavy wrench repurposed as a weapon. Surprisingly effective.',                          '{"gearBonus": {"str": 1}}'),
('Stud Shooter',          'weapon', 'uncommon',  'A crossbow that fires LEGO studs at high velocity. Plinks enemies from afar.',            '{"gearBonus": {"agi": 1}}'),
('Flame-Tipped Lance',    'weapon', 'uncommon',  'A jousting lance with a fire crystal embedded in the point.',                             '{"gearBonus": {"str": 1}, "damageType": "fire"}'),
('Arcane Staff of Tiles',  'weapon', 'rare',     'A wizard staff made from translucent tiles. Hums with magical energy.',                   '{"gearBonus": {"mna": 2}}'),
('Technic Greataxe',      'weapon', 'rare',      'An enormous axe built with Technic gears. Each swing has mechanical force behind it.',    '{"gearBonus": {"str": 2}}'),
('Shadow Dagger',         'weapon', 'epic',      'A dark blade that phases through armor. Whispers when drawn.',                            '{"gearBonus": {"agi": 2, "lck": 1}}'),
('The Golden Claymore',   'weapon', 'legendary', 'A gleaming golden sword said to be built by the Master Builders themselves.',             '{"gearBonus": {"str": 3, "lck": 1}}');

-- ═══ ARMOR ═══════════════════════════════════════════════════════════════

INSERT INTO item_catalog (name, item_type, rarity, description, effect_json) VALUES
('Brick-Link Chainmail',  'armor', 'common',    'Armor woven from tiny chain links. Light and surprisingly tough.',                         '{"gearBonus": {"con": 1}}'),
('Plate Piece Shield',    'armor', 'common',    'A sturdy round shield made from a single large plate piece.',                              '{"gearBonus": {"con": 1}}'),
('Minifig Helmet',        'armor', 'uncommon',  'A classic castle helmet with a flip-down visor. Iconic protection.',                       '{"gearBonus": {"con": 1, "str": 1}}'),
('Crystal Armor',         'armor', 'rare',      'Translucent armor that glows faintly blue. Deflects magical attacks.',                     '{"gearBonus": {"con": 2, "mna": 1}}'),
('Dragon Scale Vest',     'armor', 'epic',      'Scales harvested from a defeated dragon, stitched into a chestplate.',                     '{"gearBonus": {"con": 3}}'),
('Crown of the Builders', 'armor', 'legendary', 'A legendary headpiece that enhances every stat. Only true heroes can wear it.',            '{"gearBonus": {"con": 2, "int": 2, "lck": 1}}');

-- ═══ CONSUMABLES ═════════════════════════════════════════════════════════

INSERT INTO item_catalog (name, item_type, rarity, description, effect_json) VALUES
('Red Health Stud',       'consumable', 'common',    'A glowing red stud. Crunch it to restore health.',                                    '{"healing": 5}'),
('Blue Mana Stud',        'consumable', 'common',    'A translucent blue stud. Restores magical energy when absorbed.',                      '{"manaRestore": 20}'),
('Green Luck Stud',       'consumable', 'uncommon',  'A shimmering green stud. Grants a burst of fortune.',                                  '{"tempBonus": {"lck": 3}, "duration": 3}'),
('Purple Mega Stud',      'consumable', 'rare',      'A massive purple stud radiating energy. Full heal in a pinch.',                         '{"healing": 15}'),
('Ghost Pepper Potion',   'consumable', 'uncommon',  'A bubbling orange brew. Makes you phase through one attack.',                           '{"dodgeNext": true}'),
('Elixir of the Baseplate', 'consumable', 'epic',    'A legendary brew that restores everything. Health, mana, and courage.',                 '{"healing": 20, "manaRestore": 50}');

-- ═══ QUEST ITEMS ═════════════════════════════════════════════════════════

INSERT INTO item_catalog (name, item_type, rarity, description) VALUES
('Goblin King''s Tin Crown',       'quest', 'uncommon', 'A battered tin crown taken from the Goblin King. Might be worth something.'),
('Shadow Tower Key Fragment',      'quest', 'rare',     'One piece of the key that unlocks the Shadow Tower. Pulses with dark energy.'),
('Dragon Scale (Quest)',           'quest', 'rare',     'A single pristine scale from the Dragon of the Stolen Crown. Proof of your encounter.'),
('The Stolen Crown',               'quest', 'legendary', 'The legendary crown stolen by the dragon. Returning it could save the kingdom.');

-- ═══ MISC ITEMS ══════════════════════════════════════════════════════════

INSERT INTO item_catalog (name, item_type, rarity, description, effect_json) VALUES
('Torch',                 'misc', 'common',    'A simple brick torch. Lights up dark dungeon rooms.',                                       NULL),
('Rope (10 studs)',       'misc', 'common',    'A length of rope measured in studs. Good for climbing or tying things up.',                  NULL),
('Minifig Disguise Kit',  'misc', 'uncommon',  'Spare hair, hats, and accessories. Lets you swap looks to fool enemies.',                    NULL),
('Bag of Holding Bricks', 'misc', 'rare',      'A tiny pouch that fits way more bricks than it should. Doubles carry capacity.',             '{"carryBonus": 10}');
