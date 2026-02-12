-- LEGO QUEST — Shop Items for "The Stolen Crown" quest
-- Heroes start with 8 gold each

-- Clear existing shop data to avoid duplicates on re-run
DELETE FROM quest_shop_items WHERE quest_name = 'The Stolen Crown';

-- ═══ CONSUMABLES ════════════════════════════════════════════════════════════

INSERT INTO quest_shop_items (quest_name, catalog_item_id, price, stock, sort_order) VALUES
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Red Health Stud'),     2, -1, 1),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Blue Mana Stud'),      2, -1, 2),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Green Luck Stud'),     4,  3, 3),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Ghost Pepper Potion'), 5,  2, 4),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Purple Mega Stud'),    8,  1, 5);

-- ═══ WEAPONS ════════════════════════════════════════════════════════════════

INSERT INTO quest_shop_items (quest_name, catalog_item_id, price, stock, sort_order) VALUES
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Brick Blade'),         5,  2, 10),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Rusty Spanner Mace'),  5,  2, 11),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Stud Shooter'),        8,  1, 12);

-- ═══ ARMOR ══════════════════════════════════════════════════════════════════

INSERT INTO quest_shop_items (quest_name, catalog_item_id, price, stock, sort_order) VALUES
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Brick-Link Chainmail'), 4, 2, 20),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Plate Piece Shield'),   4, 2, 21);

-- ═══ MISC ═══════════════════════════════════════════════════════════════════

INSERT INTO quest_shop_items (quest_name, catalog_item_id, price, stock, sort_order) VALUES
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Torch'),               1, -1, 30),
('The Stolen Crown', (SELECT id FROM item_catalog WHERE name = 'Rope (10 studs)'),     2,  3, 31);
