-- 009_seed_bestiary.sql
-- Seeds ALL monsters from the complete bestiary (12 families, 144+ total monsters)
-- Run after 007_four_stat_migration.sql which establishes the monsters table schema
-- v1.1 rebalance: Level 1 nerfed, Level 3 new tier added, is_minion column
-- Monster building formula v1.1: Level / 2 + 2 = average stat. HP = TGH x 3. Boss HP = TGH x 4 or 5. For Levels 1-3: reduce average stat by 1.

-- Add is_minion column (v1.1)
ALTER TABLE monsters ADD COLUMN IF NOT EXISTS is_minion BOOLEAN NOT NULL DEFAULT false;

DELETE FROM monsters;

INSERT INTO monsters (name, level, is_boss, is_minion, category, stat_str, stat_spd, stat_tgh, stat_smt, hp, damage, damage_type, special_abilities, description, mov, attack_range) VALUES

-- ============================================================================
-- FAMILY 1: GOBLINOIDS
-- ============================================================================

-- Standard Goblinoids
('Goblin Runt', 1, false, false, 'goblinoid', 1, 4, 1, 1, 3, 1, 'physical',
 '[{"name":"Flees at Half HP","description":"Flees at half HP"}]',
 'The smallest and weakest of goblins, these runts scatter at the first sign of danger.', 5, 'M1, ST'),

-- v1.1 nerfed: STR 2->2, SPD 4->3, TGH 2->2, SMT 1->1, HP 6->5, Dmg 2->2
('Goblin Scout', 1, false, false, 'goblinoid', 2, 3, 2, 1, 5, 2, 'physical',
 '[{"name":"+2 Initiative","description":"+2 initiative"}]',
 'Quick and cunning, goblin scouts range ahead of war bands to find targets.', 5, 'M1, ST'),

('Goblin Archer', 2, false, false, 'goblinoid', 1, 5, 2, 2, 6, 3, 'physical',
 '[{"name":"Ranged Attack","description":"Ranged attack; -3 at M1"}]',
 'Perched on ledges and behind cover, goblin archers rain crude arrows on their foes.', 4, 'Md5, ST'),

('Goblin Shaman', 3, false, false, 'goblinoid', 1, 3, 3, 5, 9, 4, 'arcane',
 '[{"name":"Heal Goblin","description":"Heal Goblin 4 HP (S4, ST)"},{"name":"Zap","description":"Zap (S3, ST, 3 dmg)"}]',
 'A goblin with a spark of dark magic, able to mend allies and zap enemies.', 3, 'S4, ST'),

('Goblin Brute', 3, false, false, 'goblinoid', 5, 3, 4, 1, 12, 5, 'physical',
 '[{"name":"Cleave","description":"Hit 2 adjacent enemies"}]',
 'A hulking goblin wielding an oversized cleaver, stronger than most of its kin.', 3, 'M1, ST'),

-- v1.1 new Level 3 monster: Goblin Warrior
('Goblin Warrior', 3, false, false, 'goblinoid', 3, 3, 3, 1, 9, 3, 'physical',
 '[{"name":"Shield Block","description":"+2 defense"}]',
 'An upgraded goblin equipped with a crude shield and better armor.', 4, 'M1, ST'),

('Goblin Wolf Rider', 4, false, false, 'goblinoid', 4, 5, 3, 2, 9, 4, 'physical',
 '[{"name":"Charge","description":"+3 dmg if moved 4+ spaces"}]',
 'Mounted atop a snarling wolf, these riders charge into battle with reckless speed.', 6, 'M1, ST'),

('Goblin Bomber', 4, false, false, 'goblinoid', 2, 4, 2, 4, 6, 5, 'fire',
 '[{"name":"Bomb","description":"S4 range, Rad 1 AoE, 5 dmg"}]',
 'A maniacal goblin carrying a sack of volatile explosives.', 4, 'S4, Rad 1'),

('Hobgoblin Soldier', 5, false, false, 'goblinoid', 5, 4, 5, 3, 15, 5, 'physical',
 '[{"name":"Shield","description":"+2 defense"},{"name":"Disciplined","description":"Immune to fear"}]',
 'Disciplined and well-armed, hobgoblin soldiers fight in organized formations.', 4, 'M1, ST'),

('Hobgoblin Captain', 7, false, false, 'goblinoid', 6, 5, 6, 4, 18, 7, 'physical',
 '[{"name":"Rally","description":"Allies within Aura 3 get +2 attack"}]',
 'A seasoned commander who drives goblinoid troops to fight harder.', 4, 'M1, ST'),

('Bugbear', 6, false, false, 'goblinoid', 7, 3, 5, 2, 15, 7, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Ambush","description":"+5 dmg from stealth"}]',
 'A massive, hairy brute that lurks in the shadows and strikes with devastating surprise attacks.', 3, 'R2, ST'),

-- Boss Goblinoids
-- v1.1 rebalance: Goblin King moved to Level 1 boss. STR 4, SPD 3, TGH 4, SMT 2, HP 16, Dmg 4. Summons below 8 HP.
('Goblin King', 1, true, false, 'goblinoid', 4, 3, 4, 2, 16, 4, 'physical',
 '[{"name":"Summon Scouts","description":"Summons 2 Goblin Scout Minions below 8 HP"},{"name":"Crown Smash","description":"M1, 8 dmg, stun 1 turn"}]',
 'Self-proclaimed ruler of the goblin warrens, wearing a battered tin crown.', 3, 'M1, ST'),

('Hobgoblin Warlord', 8, true, false, 'goblinoid', 8, 5, 7, 4, 35, 9, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"War Cry","description":"Aura 4, all goblins +3 dmg for 2 turns"},{"name":"Summon Soldiers","description":"Summons 2 Hobgoblin Soldiers at half HP"}]',
 'A fearsome hobgoblin general who commands loyalty through strength and tactical brilliance.', 4, 'R2, ST'),

-- ============================================================================
-- FAMILY 2: UNDEAD
-- ============================================================================

-- Standard Undead
-- v1.1 nerfed: STR 3->3, SPD 2->2, TGH 3->2, SMT 1->1, HP 9->6, Dmg 3->3
('Skeleton', 1, false, false, 'undead', 3, 2, 2, 1, 6, 3, 'physical',
 '[{"name":"Vulnerable to Blunt","description":"+2 dmg from maces/hammers"}]',
 'Animated bones held together by dark magic, mindlessly attacking the living.', 3, 'M1, ST'),

('Zombie', 2, false, false, 'undead', 3, 1, 4, 0, 12, 3, 'physical',
 '[{"name":"Undying","description":"First time reduced to 0 HP, stands with 1 HP"}]',
 'A shambling corpse driven by necromantic energy, relentless but slow.', 2, 'M1, ST'),

('Skeleton Archer', 3, false, false, 'undead', 2, 4, 3, 1, 9, 4, 'physical',
 '[{"name":"Ranged Attack","description":"Ranged attack; -3 at M1"}]',
 'A skeleton with a weathered bow, its bony fingers loosing arrows with eerie precision.', 3, 'Md6, ST'),

-- v1.1 new Level 3 monster: Tomb Guardian
('Tomb Guardian', 3, false, false, 'undead', 4, 2, 4, 2, 12, 4, 'physical',
 '[{"name":"Immune to Poison","description":"Immune to poison"}]',
 'An undead sentinel bound to protect ancient burial sites, tireless and unyielding.', 3, 'M1, ST'),

('Ghost', 4, false, false, 'undead', 1, 5, 3, 4, 9, 3, 'necrotic',
 '[{"name":"Phasing","description":"Moves through enemies and obstacles"},{"name":"Immune to Non-Magic","description":"Immune to non-magic weapons"}]',
 'A tormented spirit drifting between the living and the dead, untouchable by mundane weapons.', 5, 'M1, ST'),

('Bone Knight', 5, false, false, 'undead', 6, 3, 6, 2, 18, 6, 'physical',
 '[{"name":"Shield Wall","description":"+3 defense"},{"name":"Immune to Poison","description":"Immune to poison"}]',
 'An undead warrior clad in ancient armor, wielding a rusted blade and a battered shield.', 3, 'M1, ST'),

('Ghoul', 5, false, false, 'undead', 5, 5, 4, 2, 12, 5, 'physical',
 '[{"name":"Paralyze","description":"On hit, target TGH check (12) or loses next action"}]',
 'A ravenous undead creature with paralytic claws, hunting for flesh.', 4, 'M1, ST'),

('Shadow', 6, false, false, 'undead', 3, 6, 4, 5, 12, 6, 'necrotic',
 '[{"name":"Incorporeal","description":"50% miss chance (physical)"},{"name":"Life Drain","description":"Drains 2 HP on hit (heals self)"}]',
 'A dark silhouette that saps the life force of the living to sustain its own wretched existence.', 5, 'M1, ST'),

('Wraith', 8, false, false, 'undead', 4, 6, 5, 7, 15, 8, 'necrotic',
 '[{"name":"Life Drain","description":"S3, heals for damage dealt"},{"name":"Phasing","description":"Moves through enemies and obstacles"},{"name":"Immune to Non-Magic","description":"Immune to non-magic weapons"}]',
 'A powerful spirit of hatred and malice, draining life with a mere touch.', 5, 'S3, ST'),

('Death Knight', 10, false, false, 'undead', 9, 5, 8, 6, 24, 10, 'necrotic',
 '[{"name":"Dark Smite","description":"M1, +6 holy dmg"},{"name":"Aura of Fear","description":"Aura 2, enemies -2 all rolls"}]',
 'A fallen paladin raised in undeath, wielding dark power and unholy might.', 4, 'M1, ST'),

('Bone Dragon', 12, false, false, 'undead', 10, 6, 9, 7, 27, 12, 'necrotic',
 '[{"name":"Necrotic Breath","description":"Necrotic Cone 4, 10 dmg"},{"name":"Fly","description":"Flying (MOV 6)"}]',
 'The reanimated skeleton of an ancient dragon, its bones crackling with necrotic energy.', 4, 'M1/Md6'),

-- Boss Undead
('Necromancer', 8, true, false, 'undead', 3, 4, 5, 9, 20, 10, 'necrotic',
 '[{"name":"Raise Dead","description":"Summon 2 Skeletons or 1 Zombie"},{"name":"Dark Bolt","description":"Md6, 10 dmg"},{"name":"Sacrifice Minions","description":"At half HP, sacrifices minions (heals 5 HP each)"}]',
 'A master of death magic who commands legions of the undead from the shadows.', 3, 'Md6, ST'),

('Lich King', 15, true, false, 'undead', 5, 6, 8, 14, 40, 15, 'necrotic',
 '[{"name":"Soul Bolt","description":"L8, 15 dmg"},{"name":"Death Wave","description":"Cone 5, 12 dmg + stun"},{"name":"Phylactery","description":"Must destroy to kill permanently"},{"name":"Summon Wraiths","description":"Summons 2 Wraiths at half HP"}]',
 'An ancient sorcerer who cheated death itself, now ruling from a throne of bones.', 4, 'L8, ST'),

('Vampire Lord', 12, true, false, 'undead', 8, 8, 7, 9, 35, 11, 'necrotic',
 '[{"name":"Life Drain","description":"Heals all damage dealt"},{"name":"Charm","description":"Md5, SMT check (16) or fights for vampire"},{"name":"Mist Form","description":"Untargetable, move 8"},{"name":"Vulnerable to Holy","description":"Vulnerable to holy (+5 dmg)"}]',
 'A lord of the night who feeds on the blood of mortals, impossibly fast and seductive.', 6, 'M1, ST'),

-- ============================================================================
-- FAMILY 3: BEASTS
-- ============================================================================

-- Standard Beasts
-- v1.1 nerfed: STR 2->1, SPD 5->4, TGH 1->1, SMT 1->1, HP 3->2, Dmg 2->1
('Giant Rat', 1, false, false, 'beast', 1, 4, 1, 1, 2, 1, 'physical',
 '[{"name":"Pack Tactics","description":"+1 attack per adjacent rat ally"}]',
 'Oversized vermin that swarm in packs through sewers and dark places.', 5, 'M1, ST'),

('Cave Bat', 1, false, false, 'beast', 1, 6, 1, 1, 3, 1, 'physical',
 '[{"name":"Flying","description":"Flying"},{"name":"Swoops","description":"Moves full MOV, attacks, moves remaining MOV"}]',
 'A large bat that dives from the darkness of cave ceilings.', 6, 'M1, ST'),

('Wolf', 3, false, false, 'beast', 4, 5, 3, 2, 9, 4, 'physical',
 '[{"name":"Pack Tactics","description":"+2 attack if adjacent wolf ally"},{"name":"Knockdown","description":"SPD check (10) or prone"}]',
 'A fierce predator that hunts in coordinated packs.', 5, 'M1, ST'),

('Boar', 3, false, false, 'beast', 5, 3, 4, 1, 12, 4, 'physical',
 '[{"name":"Charge","description":"+4 dmg if moved 3+ spaces in straight line"}]',
 'A massive wild boar that charges with tusks lowered.', 4, 'M1, ST'),

-- v1.1 new Level 3 monster: Dire Wolf (separate from Level 5 Dire Wolf)
('Dire Wolf', 3, false, false, 'beast', 4, 5, 3, 1, 9, 4, 'physical',
 '[{"name":"Pack Tactics","description":"+2 if ally adjacent"}]',
 'A large and ferocious wolf, fast and deadly when hunting with its pack.', 5, 'M1, ST'),

('Giant Spider', 5, false, false, 'beast', 5, 5, 4, 2, 12, 5, 'poison',
 '[{"name":"Web Shot","description":"S3, SPD check (12) or rooted 1 turn"},{"name":"Wall Climb","description":"Can climb walls"}]',
 'A horse-sized spider that traps prey in webs before injecting venom.', 4, 'M1/S3'),

('Dire Wolf', 5, false, false, 'beast', 6, 6, 4, 2, 12, 6, 'physical',
 '[{"name":"Pack Tactics","description":"+2 attack if adjacent wolf ally"},{"name":"Trip","description":"On crit, target prone + loses next action"}]',
 'A wolf of enormous size and ferocity, alpha of its pack.', 6, 'M1, ST'),

('Bear', 6, false, false, 'beast', 8, 4, 6, 2, 18, 7, 'physical',
 '[{"name":"Maul","description":"If both claws hit (2 attacks), bonus 4 dmg"},{"name":"Tough Hide","description":"-2 dmg from physical"}]',
 'A massive bear that mauls prey with devastating claw strikes.', 4, 'M1, ST'),

('Giant Scorpion', 7, false, false, 'beast', 7, 5, 6, 1, 18, 6, 'poison',
 '[{"name":"Reach 2","description":"Reach 2 (tail)"},{"name":"Poison Sting","description":"3 poison dmg/turn for 2 turns"}]',
 'A scorpion the size of a horse, its venomous tail striking with lethal precision.', 4, 'R2, ST'),

('Wyvern', 9, false, false, 'beast', 9, 7, 7, 3, 21, 9, 'physical',
 '[{"name":"Flying","description":"Flying (MOV 7)"},{"name":"Poison Tail","description":"R2, 6 dmg + poison 3/turn for 2 turns"}]',
 'A two-legged winged dragon-kin with a deadly venomous tail.', 5, 'M1, ST'),

('Hydra', 12, false, false, 'beast', 10, 4, 10, 3, 30, 8, 'physical',
 '[{"name":"Multi-Head","description":"3 heads = 3 attacks/turn"},{"name":"Regenerate","description":"Regenerate 4 HP/turn"},{"name":"Fire Vulnerability","description":"Fire prevents head regrowth"}]',
 'A multi-headed serpentine beast that grows new heads when old ones are severed.', 3, 'R2, ST'),

-- Boss Beasts
('Alpha Wolf', 4, true, false, 'beast', 5, 6, 4, 3, 16, 5, 'physical',
 '[{"name":"Howl","description":"Aura 5, wolves +3 attack 2 turns"},{"name":"Summon Wolves","description":"Summons 2 Wolves below half HP"},{"name":"Pack Leader","description":"Acts first"}]',
 'The leader of the pack, larger and more cunning than any ordinary wolf.', 6, 'M1, ST'),

-- v1.1 new Level 3 boss: Spider Queen. STR 5, SPD 4, TGH 5, SMT 3, HP 20, Dmg 5.
('Spider Queen', 3, true, false, 'beast', 5, 4, 5, 3, 20, 5, 'poison',
 '[{"name":"Web Attack","description":"Roots 1 target (SPD check 12)"},{"name":"Summon Spiders","description":"Summons 2 Spider Minions (1 HP, 2 dmg) each turn"}]',
 'A massive spider queen that traps prey in webs and spawns endless spiderlings.', 4, 'M1/S3'),

('Queen Spider', 8, true, false, 'beast', 7, 6, 6, 4, 30, 8, 'poison',
 '[{"name":"Web Trap","description":"S4, Rad 2, rooted 2 turns"},{"name":"Summon Spiders","description":"Summon 3 Giant Spiders"},{"name":"Poison Bite","description":"M1, 8 dmg + poison 4/turn 3 turns"}]',
 'An enormous spider queen lurking at the center of a vast web, birthing horrors.', 4, 'M1/S4'),

-- ============================================================================
-- FAMILY 4: ELEMENTALS
-- ============================================================================

-- Standard Elementals
('Fire Sprite', 3, false, false, 'elemental', 2, 6, 2, 4, 6, 4, 'fire',
 '[{"name":"Burn","description":"2 fire dmg next turn"},{"name":"Immune to Fire","description":"Immune to fire"},{"name":"Vulnerable to Ice","description":"Vulnerable to ice (+3)"}]',
 'A tiny flickering flame spirit that darts through the air.', 5, 'S3, ST'),

('Ice Shard', 3, false, false, 'elemental', 3, 3, 4, 3, 12, 3, 'ice',
 '[{"name":"Freeze","description":"MOV halved next turn"},{"name":"Immune to Ice","description":"Immune to ice"},{"name":"Vulnerable to Fire","description":"Vulnerable to fire (+3)"}]',
 'A crystalline entity of frozen magic, radiating bitter cold.', 2, 'S4, ST'),

('Dust Devil', 4, false, false, 'elemental', 4, 7, 2, 3, 6, 4, 'physical',
 '[{"name":"Whirlwind","description":"Rad 1, push all 2 spaces"},{"name":"Ranged Deflection","description":"Ranged attacks -3"}]',
 'A whirling vortex of sand and debris that scatters anything in its path.', 7, 'M1, Rad 1'),

('Fire Elemental', 7, false, false, 'elemental', 7, 5, 6, 5, 18, 8, 'fire',
 '[{"name":"Fire Bolt","description":"S4, 8 dmg"},{"name":"Burn Aura","description":"Aura 1, 3 fire dmg/turn"},{"name":"Immune to Fire","description":"Immune to fire"}]',
 'A towering pillar of living flame, leaving scorched earth in its wake.', 4, 'M1/S4'),

('Ice Elemental', 7, false, false, 'elemental', 6, 3, 7, 5, 21, 7, 'ice',
 '[{"name":"Frost Blast","description":"S4, 7 dmg + slow"},{"name":"Freeze Ground","description":"Rad 2, MOV halved"},{"name":"Immune to Ice","description":"Immune to ice"}]',
 'A hulking form of glacial ice, freezing the ground with every step.', 3, 'M1/S4'),

('Storm Elemental', 8, false, false, 'elemental', 5, 8, 5, 7, 15, 9, 'lightning',
 '[{"name":"Chain Spark","description":"Md6, bounces to 1 extra (5 dmg)"},{"name":"Flying","description":"Flying"},{"name":"Immune to Lightning","description":"Immune to lightning"}]',
 'A crackling mass of thunderclouds and arcing electricity.', 6, 'Md6, ST'),

('Earth Elemental', 8, false, false, 'elemental', 9, 2, 9, 3, 27, 9, 'physical',
 '[{"name":"Tremor","description":"Rad 2, 6 dmg + prone"},{"name":"Rocky","description":"Physical -3"},{"name":"Immune to Poison","description":"Immune to poison"}]',
 'A lumbering mass of stone and soil, nearly impervious to physical attacks.', 2, 'M1, ST'),

('Magma Golem', 10, false, false, 'elemental', 10, 3, 10, 4, 30, 11, 'fire',
 '[{"name":"Lava Spit","description":"S3, 8 fire dmg + burn 3/turn"},{"name":"Death Eruption","description":"On death: Rad 2, 10 fire dmg"}]',
 'A molten titan of rock and fire, leaving pools of lava wherever it treads.', 2, 'M1/S3'),

('Void Wisp', 10, false, false, 'elemental', 3, 8, 5, 10, 15, 12, 'arcane',
 '[{"name":"Void Bolt","description":"Md6, 12 dmg"},{"name":"Blink","description":"Teleport 3 after attack"},{"name":"Immune to Non-Magic","description":"Immune to non-magic weapons"}]',
 'An eerie floating orb of nothingness that warps reality around it.', 6, 'Md6, ST'),

('Primal Elemental', 14, false, false, 'elemental', 11, 6, 11, 8, 33, 14, 'arcane',
 '[{"name":"Elemental Shift","description":"Shifts element each turn. Uses that element''s abilities"},{"name":"Elemental Resistance","description":"Resistant to current element, weak to opposite"}]',
 'An ancient elemental that cycles through the primal forces of nature.', 4, 'M1/Md6'),

-- Boss Elementals
('Inferno Lord', 10, true, false, 'elemental', 9, 6, 8, 8, 40, 12, 'fire',
 '[{"name":"Meteor Rain","description":"Md6, Rad 2, 12 dmg + burn"},{"name":"Fire Wall","description":"Line 6"},{"name":"Summon Fire Elementals","description":"Summons 2 Fire Elementals"},{"name":"Immune to Fire","description":"Immune to fire"}]',
 'A lord of living flame, ruling over a domain of cinders and ash.', 4, 'M1/Md6'),

('Tempest King', 14, true, false, 'elemental', 7, 10, 8, 12, 40, 15, 'lightning',
 '[{"name":"Lightning Storm","description":"L8, Rad 3, 15 dmg"},{"name":"Gale Force","description":"Cone 5, push 4"},{"name":"Teleport","description":"Teleport"},{"name":"Flying","description":"Flying"},{"name":"Immune to Lightning","description":"Immune to lightning"}]',
 'Sovereign of the sky, a being of pure storm energy that commands the heavens.', 7, 'L8, ST'),

-- ============================================================================
-- FAMILY 5: CONSTRUCTS
-- ============================================================================

-- Standard Constructs
('Animated Broom', 1, false, false, 'construct', 1, 4, 2, 0, 6, 1, 'physical',
 '[{"name":"Sweep","description":"Pushes target 1 space"},{"name":"Fragile","description":"Crits destroy instantly"}]',
 'A magically animated broom that attacks intruders with surprising vigor.', 4, 'M1, ST'),

('Clay Golem', 4, false, false, 'construct', 6, 2, 6, 0, 18, 5, 'physical',
 '[{"name":"Slow Slam","description":"Stun 1 turn on hit"},{"name":"Immune to Poison/Sleep","description":"Immune to poison and sleep"}]',
 'A crude humanoid shaped from clay, animated by inscribed runes.', 2, 'M1, ST'),

('Animated Armor', 5, false, false, 'construct', 6, 3, 7, 0, 21, 6, 'physical',
 '[{"name":"Shield Block","description":"+3 defense"},{"name":"Can Equip Weapons","description":"Can equip weapons"},{"name":"Immune to Status","description":"Immune to poison, charm, fear"}]',
 'A suit of enchanted armor that fights without a wearer inside.', 3, 'M1, ST'),

('Clockwork Spider', 5, false, false, 'construct', 4, 6, 4, 3, 12, 4, 'lightning',
 '[{"name":"Zap Wire","description":"S3, 4 dmg + stun 1 turn"},{"name":"Wall Climb","description":"Can climb walls"}]',
 'A mechanical arachnid that scuttles across walls and shocks prey.', 5, 'M1/S3'),

('Stone Golem', 7, false, false, 'construct', 8, 2, 8, 1, 24, 7, 'physical',
 '[{"name":"Earthquake","description":"Rad 2, 5 dmg + prone"},{"name":"Rocky","description":"Physical -3"},{"name":"Immune to Status","description":"Immune to poison, sleep, charm"}]',
 'A massive humanoid carved from solid stone, nearly indestructible.', 2, 'M1, ST'),

('Iron Guardian', 9, false, false, 'construct', 9, 3, 9, 2, 27, 9, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Shield Wall","description":"Allies +3 defense"},{"name":"Immune to Status","description":"Immune to poison, charm, fear, magic under Tier 3"}]',
 'An iron sentinel built to protect ancient vaults and their treasures.', 3, 'M1/R2'),

('Clockwork Knight', 10, false, false, 'construct', 8, 5, 8, 4, 24, 8, 'physical',
 '[{"name":"Overclock","description":"2 actions/turn for 2 turns, then shutdown 1 turn"},{"name":"Immune to Status","description":"Immune to charm, fear"}]',
 'A sophisticated mechanical warrior capable of bursts of incredible speed.', 4, 'M1, ST'),

('Siege Golem', 12, false, false, 'construct', 12, 1, 12, 1, 36, 14, 'physical',
 '[{"name":"Boulder Throw","description":"Md6, 10 dmg"},{"name":"Siege","description":"Double dmg to walls"},{"name":"Immune to Almost Everything","description":"Immune to almost all status effects"}]',
 'A colossal stone construct built for warfare, capable of demolishing fortifications.', 1, 'M1/R2'),

('Crystal Golem', 14, false, false, 'construct', 10, 4, 11, 6, 33, 12, 'arcane',
 '[{"name":"Reflect","description":"50% bounce ranged spells"},{"name":"Laser","description":"S4, Line 4, 10 dmg"}]',
 'A golem made of living crystal that refracts and redirects magical energy.', 3, 'M1/S4'),

('Titan Construct', 18, false, false, 'construct', 14, 3, 14, 4, 42, 18, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Cannon","description":"Md6, Rad 2, 15 dmg"},{"name":"Stomp","description":"Rad 2, 10 dmg + prone"},{"name":"Immune to All Status","description":"Immune to all status effects"}]',
 'An ancient war machine of titanic proportions, bristling with weapons.', 3, 'R2/Md6'),

-- Boss Constructs
('The Iron Colossus', 12, true, false, 'construct', 11, 3, 10, 3, 50, 13, 'physical',
 '[{"name":"Cannon Arm","description":"Md6, Rad 2, 12 dmg"},{"name":"Stomp","description":"Rad 2, 8 dmg + prone"},{"name":"Armor Plates","description":"First 3 hits deal half dmg"},{"name":"Overclock","description":"Overclock at half HP"}]',
 'A towering iron war machine, nearly impervious to damage.', 2, 'R2/Md6'),

('Arcane Engine', 16, true, false, 'construct', 8, 5, 12, 10, 60, 16, 'arcane',
 '[{"name":"Arcane Beam","description":"L8, Line 6, 16 dmg"},{"name":"Shield Generator","description":"Aura 3, half dmg"},{"name":"Summon Knights","description":"Summons 2 Clockwork Knights"},{"name":"Self-Repair","description":"Self-Repair 5 HP/turn"}]',
 'A masterwork of arcane engineering, channeling pure magical energy as a weapon.', 3, 'L8, Rad 2'),

-- ============================================================================
-- FAMILY 6: DRAGONS
-- ============================================================================

-- Standard Dragons
('Dragon Wyrmling', 3, false, false, 'dragon', 4, 4, 3, 3, 9, 4, 'fire',
 '[{"name":"Baby Breath","description":"Cone 2, 4 dmg"},{"name":"Flying","description":"Flying (MOV 5)"}]',
 'A young dragon barely out of the egg, already dangerous.', 4, 'M1/S3'),

('Drake', 5, false, false, 'dragon', 7, 4, 6, 2, 18, 7, 'physical',
 '[{"name":"Tail Sweep","description":"R2, hits adjacent behind"},{"name":"Tough Scales","description":"Physical -2"}]',
 'A wingless dragon-kin that hunts in rocky terrain with powerful tail strikes.', 4, 'M1, ST'),

('Young Red Dragon', 8, false, false, 'dragon', 8, 6, 7, 5, 21, 9, 'fire',
 '[{"name":"Fire Breath","description":"Cone 3, 10 fire dmg"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Immune to Fire","description":"Immune to fire"}]',
 'A young red dragon, already commanding fire and inspiring fear.', 4, 'M1/Md5'),

('Young Blue Dragon', 8, false, false, 'dragon', 7, 7, 6, 6, 18, 10, 'lightning',
 '[{"name":"Lightning Bolt","description":"Line 6, 10 dmg"},{"name":"Flying","description":"Flying (MOV 7)"},{"name":"Immune to Lightning","description":"Immune to lightning"}]',
 'A sleek young blue dragon that rides the storm and strikes with lightning.', 5, 'M1/Md6'),

('Young White Dragon', 8, false, false, 'dragon', 8, 5, 8, 4, 24, 8, 'ice',
 '[{"name":"Ice Breath","description":"Cone 3, 8 ice dmg + slow"},{"name":"Flying","description":"Flying (MOV 5)"},{"name":"Immune to Ice","description":"Immune to ice"}]',
 'A young white dragon of the frozen wastes, breathing deadly frost.', 3, 'M1/S4'),

('Young Green Dragon', 8, false, false, 'dragon', 7, 6, 7, 5, 21, 8, 'poison',
 '[{"name":"Poison Cloud","description":"Rad 2, 6 poison/turn 2 turns"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Immune to Poison","description":"Immune to poison"}]',
 'A cunning young green dragon that fills its lair with toxic fumes.', 4, 'M1/Md5'),

('Adult Red Dragon', 14, false, false, 'dragon', 12, 7, 11, 8, 33, 14, 'fire',
 '[{"name":"Fire Breath","description":"Cone 4, 15 fire dmg"},{"name":"Tail Sweep","description":"R2, 10 dmg"},{"name":"Flying","description":"Flying (MOV 7)"},{"name":"Immune to Fire","description":"Immune to fire"},{"name":"Frightful Presence","description":"Aura 4"}]',
 'A fully grown red dragon, lord of fire and devastation.', 4, 'M1/Md6'),

('Adult Blue Dragon', 14, false, false, 'dragon', 11, 8, 10, 9, 30, 15, 'lightning',
 '[{"name":"Lightning Bolt","description":"Line 7, 15 dmg"},{"name":"Wing Buffet","description":"Rad 2, push 3"},{"name":"Flying","description":"Flying (MOV 8)"},{"name":"Immune to Lightning","description":"Immune to lightning"}]',
 'A mature blue dragon that commands devastating lightning strikes from above.', 5, 'M1/L7'),

('Shadow Dragon', 16, false, false, 'dragon', 10, 8, 10, 10, 30, 14, 'necrotic',
 '[{"name":"Shadow Breath","description":"Cone 4, 14 dmg + blind 1 turn"},{"name":"Phasing","description":"Phasing"},{"name":"Flying","description":"Flying (MOV 7)"},{"name":"Invisible in Darkness","description":"Invisible in darkness"}]',
 'A dragon corrupted by shadow, slipping between planes of existence.', 5, 'M1/Md6'),

('Dragon Turtle', 15, false, false, 'dragon', 13, 2, 14, 5, 42, 16, 'fire',
 '[{"name":"Steam Breath","description":"Cone 4, 14 dmg"},{"name":"Shell","description":"Half dmg while defending"},{"name":"Aquatic","description":"Aquatic. MOV 5 in water"}]',
 'An ancient creature with a dragon''s head and a turtle''s massive shell.', 2, 'M1/S4'),

-- Boss Dragons
('Dragon Hatchling', 5, true, false, 'dragon', 8, 5, 7, 4, 30, 10, 'fire',
 '[{"name":"Fire Breath","description":"Cone 3, 8 dmg"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Tail Swipe","description":"R2, 6 dmg"}]',
 'A freshly hatched dragon, small but already deadly and fiercely protective of its territory.', 4, 'M1/S4'),

('Ancient Dragon', 15, true, false, 'dragon', 13, 8, 12, 10, 60, 15, 'fire',
 '[{"name":"Fire Breath","description":"Cone 5, 18 dmg"},{"name":"Tail Sweep","description":"R2, 12 dmg"},{"name":"Wing Buffet","description":"Rad 3, push 4 + prone"},{"name":"Frightful Presence","description":"Aura 5"},{"name":"Flying","description":"Flying (MOV 8)"},{"name":"Legendary Actions","description":"2 extra reactions"}]',
 'An ancient dragon of immense power, feared across the land for centuries.', 4, 'M1/L7'),

('Dragon God', 20, true, false, 'dragon', 15, 10, 15, 13, 75, 20, 'fire',
 '[{"name":"Elemental Storm","description":"X10, Rad 3, 20 dmg"},{"name":"Devour","description":"M1, 25 dmg, swallows target"},{"name":"Flying","description":"Flying (MOV 10)"},{"name":"Immune to All Elements","description":"Immune to all elements"},{"name":"Legendary Actions","description":"3 legendary actions"}]',
 'A god among dragons, a cataclysmic force of nature that reshapes the world.', 5, 'M1/X10'),

-- ============================================================================
-- FAMILY 7: DEMONS
-- ============================================================================

-- Standard Demons
('Imp', 3, false, false, 'demon', 2, 5, 2, 3, 6, 3, 'fire',
 '[{"name":"Fire Bolt","description":"S3, 3 fire dmg"},{"name":"Flying","description":"Flying (MOV 5)"},{"name":"Invisible","description":"Invisible at will"}]',
 'A tiny winged fiend that delights in tormenting mortals with fire and trickery.', 4, 'M1/S3'),

-- v1.1 new Level 3 monster: Shadow Imp
('Shadow Imp', 3, false, false, 'demon', 2, 5, 2, 3, 6, 3, 'necrotic',
 '[{"name":"Teleport","description":"Teleports 4 studs after attacking"}]',
 'A shadowy imp that strikes and vanishes, reappearing elsewhere on the battlefield.', 4, 'M1, ST'),

('Hell Hound', 5, false, false, 'demon', 6, 5, 5, 2, 15, 6, 'fire',
 '[{"name":"Fire Breath","description":"Cone 2, 6 fire dmg"},{"name":"Immune to Fire","description":"Immune to fire"},{"name":"Pack Tactics","description":"+2 attack"}]',
 'A fiendish canine wreathed in infernal flames, hunting in packs.', 5, 'M1/S3'),

('Demon Soldier', 7, false, false, 'demon', 7, 5, 6, 4, 18, 8, 'fire',
 '[{"name":"Flame Blade","description":"8 fire dmg"},{"name":"Fire Resistant","description":"Fire resistant"},{"name":"Fear Aura","description":"Aura 1, -1 attack"}]',
 'A disciplined fiend armed with a blade of hellfire, serving the infernal legions.', 4, 'M1, ST'),

('Succubus', 8, false, false, 'demon', 4, 6, 5, 8, 15, 6, 'psychic',
 '[{"name":"Charm","description":"Md5, SMT check (14) or fights for succubus"},{"name":"Drain Kiss","description":"M1, 6 dmg + heal"},{"name":"Shapechanger","description":"Shapechanger"}]',
 'A fiend of seduction who bends minds to its will and drains life with a kiss.', 4, 'M1/Md5'),

('Shadow Demon', 9, false, false, 'demon', 6, 7, 5, 7, 15, 9, 'necrotic',
 '[{"name":"Shadow Strike","description":"9 dmg + blind 1 turn"},{"name":"Phasing","description":"Phasing"},{"name":"Vulnerable to Holy","description":"Vulnerable to holy (+5)"},{"name":"Invisible in Darkness","description":"Invisible in darkness"}]',
 'A demon of pure shadow that strikes from the darkness and vanishes.', 5, 'M1, ST'),

('Barbed Devil', 10, false, false, 'demon', 9, 5, 8, 5, 24, 10, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Barbs","description":"Melee attackers take 3 dmg"},{"name":"Fire Resistant","description":"Fire resistant"}]',
 'A fiend covered in razor-sharp spines that punish anyone who strikes it.', 4, 'M1/R2'),

('Pit Fiend', 14, false, false, 'demon', 12, 6, 10, 8, 30, 14, 'fire',
 '[{"name":"Hellfire","description":"Md6, Rad 2, 12 fire dmg"},{"name":"Fear Aura","description":"Aura 3"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Immune to Fire/Poison","description":"Immune to fire, poison"}]',
 'A towering fiend general, wreathed in hellfire and commanding lesser demons.', 4, 'M1/Md6'),

('Balor', 16, false, false, 'demon', 14, 5, 12, 7, 36, 16, 'fire',
 '[{"name":"Fire Whip","description":"R2, 12 fire dmg + pull 2"},{"name":"Flame Sword","description":"M1, 16 fire dmg"},{"name":"Fire Aura","description":"Aura 1, 5 fire/turn"},{"name":"Flying","description":"Flying (MOV 5)"},{"name":"Death Explosion","description":"On death: Rad 3, 15 fire dmg"}]',
 'One of the most fearsome demons, a titanic figure of fire and shadow.', 4, 'R2/S4'),

('Arch-Demon', 18, false, false, 'demon', 13, 7, 13, 11, 39, 18, 'fire',
 '[{"name":"Doom Bolt","description":"L8, 18 dmg"},{"name":"Corruption","description":"Md5, loses 1 action/turn 3 turns"},{"name":"Summon Soldiers","description":"Summons 2 Demon Soldiers"},{"name":"Immune to Status","description":"Immune to fire, poison, charm, fear"}]',
 'A demon of immense power and cunning, a lieutenant of the Abyss.', 5, 'M1/L8'),

-- Boss Demons
('Demon Prince', 12, true, false, 'demon', 10, 7, 9, 9, 45, 13, 'fire',
 '[{"name":"Hellfire Storm","description":"Md6, Rad 3, 13 fire dmg"},{"name":"Dark Pact","description":"Sacrifice minion, heal 10"},{"name":"Summon Demons","description":"Summons Imps (3) + Demon Soldiers (2)"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Phase 2","description":"At half HP: 2 actions/turn"}]',
 'A prince of the infernal realms, surrounded by an army of fiends.', 5, 'M1/Md6'),

('The Abyss Lord', 20, true, false, 'demon', 15, 8, 15, 14, 75, 22, 'fire',
 '[{"name":"Abyss Gate","description":"Summon 4 demons"},{"name":"Void Blast","description":"X10, Rad 3, 20 dmg"},{"name":"Devour Soul","description":"Md5, 22 dmg + no revive"},{"name":"Immune to Status","description":"Immune to fire/poison/charm/fear"},{"name":"Legendary Actions","description":"3 legendary actions"}]',
 'The supreme overlord of the Abyss, a being of apocalyptic power.', 5, 'M1/X10'),

-- ============================================================================
-- FAMILY 8: ORCS & BRUTES
-- ============================================================================

-- Standard Orcs
('Orc Grunt', 3, false, false, 'orc', 5, 3, 4, 1, 12, 4, 'physical',
 '[{"name":"Aggressive","description":"Move 2 extra toward nearest enemy"}]',
 'A brutish orc foot soldier, eager for combat and plunder.', 4, 'M1, ST'),

('Orc Archer', 4, false, false, 'orc', 4, 5, 3, 2, 9, 4, 'physical',
 '[{"name":"Ranged","description":"Ranged"},{"name":"Melee Switch","description":"Switches to melee when adjacent"}]',
 'An orc with a crude bow, preferring ranged combat but ready to brawl.', 4, 'Md5, ST'),

('Orc Warrior', 5, false, false, 'orc', 6, 4, 5, 2, 15, 6, 'physical',
 '[{"name":"Charge","description":"+3 dmg if moved 3+"},{"name":"Rage","description":"+2 below half HP"}]',
 'A battle-hardened orc who fights with savage fury, growing stronger when wounded.', 4, 'M1, ST'),

('Orc Berserker', 7, false, false, 'orc', 8, 5, 5, 1, 15, 9, 'physical',
 '[{"name":"Frenzy","description":"2 attacks, -2 defense"},{"name":"Rage","description":"+3 below half HP"},{"name":"Won''t Retreat","description":"Won''t retreat"}]',
 'A wild-eyed orc in a blood frenzy, attacking relentlessly until death.', 5, 'M1, ST'),

('Ogre', 6, false, false, 'orc', 8, 2, 7, 1, 21, 8, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Sweep","description":"All adjacent, 5 dmg"},{"name":"Dim","description":"Immune to charm/illusions"}]',
 'A massive, dim-witted brute that smashes everything in reach.', 3, 'R2, ST'),

('Orc Shaman', 7, false, false, 'orc', 4, 4, 5, 6, 15, 7, 'arcane',
 '[{"name":"Blood Bolt","description":"Md5, 7 dmg"},{"name":"War Drum","description":"Aura 4, +2 attack +1 MOV"},{"name":"Heal","description":"S4, 6 HP"}]',
 'An orc spiritual leader who channels primal magic to empower the war band.', 3, 'Md5, ST'),

('Hill Giant', 10, false, false, 'orc', 11, 3, 10, 2, 30, 12, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Rock Throw","description":"Md5, 10 dmg"},{"name":"Stomp","description":"Rad 1, 8 dmg + prone"}]',
 'A towering giant that hurls boulders and crushes foes underfoot.', 3, 'R2/Md5'),

('Orc War Chief', 10, false, false, 'orc', 9, 5, 8, 4, 24, 10, 'physical',
 '[{"name":"Rally","description":"Aura 4, orcs +3 attack 2 turns"},{"name":"Execute","description":"Below 10 HP auto-kill"}]',
 'A cunning and powerful orc leader who inspires brutal efficiency in battle.', 4, 'M1, ST'),

-- Boss Orcs
('Orc Warlord', 8, true, false, 'orc', 8, 5, 7, 3, 35, 9, 'physical',
 '[{"name":"War Cry","description":"Aura 5, orcs +3 dmg 3 turns"},{"name":"Charge","description":"Move 6, 12 dmg"},{"name":"Summon Warriors","description":"Summons 2 Orc Warriors at half HP"},{"name":"Rage","description":"+4 below quarter HP"}]',
 'A legendary orc warlord who unites the clans through sheer might.', 4, 'M1, ST'),

('Troll King', 12, true, false, 'orc', 12, 4, 11, 3, 55, 14, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Regenerate","description":"Regenerate 5/turn (fire stops)"},{"name":"Hurl","description":"Grab + throw, 10 dmg both"},{"name":"Roar","description":"Aura 3, flee 3"}]',
 'A massive troll that has subjugated the orc tribes through brute force and regenerative might.', 3, 'R2, ST'),

-- ============================================================================
-- FAMILY 9: DARK CASTERS
-- ============================================================================

-- Standard Dark Casters
('Cultist', 2, false, false, 'dark_caster', 2, 3, 2, 3, 6, 3, 'arcane',
 '[{"name":"Dark Bolt","description":"S3, 3 dmg"},{"name":"Sacrifice","description":"Self-kill, boss heals 10"}]',
 'A fanatical follower of dark powers, willing to die for their master.', 3, 'S3, ST'),

('Dark Apprentice', 4, false, false, 'dark_caster', 2, 4, 3, 5, 9, 5, 'arcane',
 '[{"name":"Shadow Bolt","description":"Md5, 5 dmg"},{"name":"Curse","description":"S4, -2 all rolls 2 turns"}]',
 'A student of forbidden magic, wielding shadow and curses.', 3, 'Md5, ST'),

('Dark Mage', 5, false, false, 'dark_caster', 3, 4, 4, 7, 12, 8, 'arcane',
 '[{"name":"Shadow Bolt","description":"Md6, 8 dmg"},{"name":"Dark Shield","description":"+4 defense 1 turn"},{"name":"Teleport","description":"Teleport 4"}]',
 'A practitioner of shadow magic who bends darkness to their will.', 3, 'Md6, ST'),

('Warlock', 7, false, false, 'dark_caster', 3, 5, 5, 7, 15, 9, 'arcane',
 '[{"name":"Eldritch Blast","description":"Md6, 9 dmg"},{"name":"Hex","description":"Md5, +3 dmg from all 3 turns"},{"name":"Demon Minion","description":"Summon 1 Imp"}]',
 'A sorcerer who has made dark pacts for power, binding demons to their service.', 3, 'Md6, ST'),

('Necromancer', 8, false, false, 'dark_caster', 3, 4, 5, 9, 15, 10, 'necrotic',
 '[{"name":"Death Bolt","description":"Md6, 10 dmg"},{"name":"Raise Dead","description":"S4, 2 Skeletons"},{"name":"Life Drain","description":"S4, 6 dmg + heal"}]',
 'A dark caster specializing in the animation of the dead and draining life force.', 3, 'Md6, ST'),

('Shadow Weaver', 10, false, false, 'dark_caster', 3, 6, 6, 10, 18, 12, 'arcane',
 '[{"name":"Shadow Bolt","description":"Md6, 12 dmg"},{"name":"Darkness","description":"Rad 3, enemies blind"},{"name":"Teleport","description":"Teleport 5"}]',
 'A master of shadow magic who plunges the battlefield into impenetrable darkness.', 4, 'Md6, ST'),

('Arch-Mage', 12, false, false, 'dark_caster', 4, 5, 7, 12, 21, 14, 'arcane',
 '[{"name":"Arcane Barrage","description":"L8, 14 dmg"},{"name":"Chain Lightning","description":"L7, Line 5, bounces 2 (8 each)"},{"name":"Counterspell","description":"Counterspell 1/round"}]',
 'A dark mage of immense power who has mastered devastating offensive magic.', 3, 'L8, ST'),

('Void Sorcerer', 15, false, false, 'dark_caster', 4, 6, 8, 13, 24, 16, 'arcane',
 '[{"name":"Void Beam","description":"L8, Line 6, 16 dmg"},{"name":"Gravity Well","description":"Md6, Rad 2, pull + 10 dmg"},{"name":"Teleport Anywhere","description":"Teleport anywhere"}]',
 'A sorcerer who channels the void itself, warping space and crushing foes.', 4, 'L8, ST'),

-- Boss Dark Casters
('The Dark Witch', 10, true, false, 'dark_caster', 4, 6, 6, 11, 30, 12, 'arcane',
 '[{"name":"Curse Storm","description":"L7, Rad 2, 10 dmg + random curse"},{"name":"Summon Mages","description":"Summons 2 Dark Mages"},{"name":"Mirror Image","description":"2 copies"},{"name":"Teleport","description":"Teleport"},{"name":"Phase 2","description":"Shadow Dragon form at half HP"}]',
 'A powerful witch who commands curses and illusions, transforming when cornered.', 4, 'L7, ST'),

('The Lich', 15, true, false, 'dark_caster', 5, 6, 8, 14, 40, 15, 'necrotic',
 '[{"name":"Soul Bolt","description":"L8, 15 dmg"},{"name":"Death Wave","description":"Cone 5, 12 dmg + stun"},{"name":"Raise Army","description":"4 undead"},{"name":"Phylactery","description":"Must destroy to kill permanently"},{"name":"Immune to Status","description":"Immune to poison, cold, charm"}]',
 'An undying master of necromancy, sustained by a phylactery hidden away in darkness.', 4, 'L8, ST'),

-- ============================================================================
-- FAMILY 10: THIEVES & OUTLAWS
-- ============================================================================

-- Standard Thieves
-- v1.1 nerfed: Bandit stays same (STR 3, SPD 3, TGH 3, SMT 2, HP 9, Dmg 3)
('Bandit', 1, false, false, 'thief', 3, 3, 3, 2, 9, 3, 'physical',
 '[{"name":"Dirty Fight","description":"+2 dmg from stealth"}]',
 'A common highway robber who preys on travelers.', 4, 'M1, ST'),

('Bandit Archer', 2, false, false, 'thief', 2, 4, 2, 2, 6, 3, 'physical',
 '[{"name":"Ranged","description":"Ranged"},{"name":"Retreats","description":"Retreats 2 after shooting"}]',
 'A sharpshooter who fires from cover and keeps their distance.', 4, 'Md5, ST'),

('Bandit Captain', 4, false, false, 'thief', 5, 4, 4, 3, 12, 5, 'physical',
 '[{"name":"Rally","description":"Adjacent allies +2 attack"},{"name":"Parry","description":"+3 defense 1/round"}]',
 'A seasoned outlaw who leads a band of thieves with cunning and skill.', 4, 'M1, ST'),

('Thug', 3, false, false, 'thief', 5, 2, 5, 1, 15, 5, 'physical',
 '[{"name":"Intimidate","description":"Aura 1, -1 attack"},{"name":"Grapple","description":"SPD check (10) or can''t move"}]',
 'A brutish enforcer who uses fear and brute strength to control enemies.', 3, 'M1, ST'),

('Assassin', 7, false, false, 'thief', 5, 7, 4, 5, 12, 8, 'physical',
 '[{"name":"Stealth","description":"Invisible"},{"name":"Ambush","description":"+8 dmg from stealth"},{"name":"Poison Blade","description":"+4 poison 2 turns"},{"name":"Escape","description":"3 spaces no opportunity attacks"}]',
 'A lethal killer who strikes from the shadows with poisoned blades.', 6, 'M1, ST'),

('Pirate', 5, false, false, 'thief', 5, 5, 4, 3, 12, 5, 'physical',
 '[{"name":"Cutlass","description":"M1, 5 dmg"},{"name":"Pistol","description":"S3, 5 dmg, 1 use"},{"name":"Dirty Tricks","description":"Blind 1 turn"}]',
 'A swashbuckling sea raider who fights with cutlass and a single-shot pistol.', 4, 'M1/S3'),

('Poison Master', 6, false, false, 'thief', 3, 5, 4, 6, 12, 4, 'poison',
 '[{"name":"Poison Dart","description":"S4, 4 dmg + poison 3/turn 3 turns"},{"name":"Poison Cloud","description":"S4, Rad 1"},{"name":"Immune to Poison","description":"Immune to poison"}]',
 'An alchemist specializing in lethal toxins and venomous concoctions.', 4, 'S4, ST'),

('Trap Master', 6, false, false, 'thief', 3, 5, 4, 6, 12, 4, 'physical',
 '[{"name":"Place Trap","description":"Adjacent, hidden. 8 dmg + effect"},{"name":"Max 3 Traps","description":"Max 3 traps at a time"}]',
 'A cunning engineer who rigs the battlefield with deadly hidden traps.', 4, 'M1, ST'),

('Crime Boss', 9, false, false, 'thief', 6, 6, 6, 7, 18, 8, 'physical',
 '[{"name":"Pistol","description":"S4, 8 dmg"},{"name":"Order","description":"All outlaws free 3 move"},{"name":"Bodyguard","description":"Redirect 1 attack to minion"}]',
 'A ruthless underworld kingpin who commands a network of thieves and killers.', 4, 'M1/S4'),

-- Boss Thieves
('The Shadow Blade', 8, true, false, 'thief', 6, 8, 5, 6, 25, 9, 'physical',
 '[{"name":"Shadow Step","description":"Teleport 5"},{"name":"Triple Strike","description":"3 attacks, -2 each"},{"name":"Vanish","description":"Invisible 2 turns"},{"name":"Summon Assassins","description":"Summons 2 Assassins at half HP"},{"name":"Poison","description":"Poison on all attacks"}]',
 'A legendary assassin who moves through shadows like water, striking from everywhere at once.', 6, 'M1, ST'),

('The Pirate King', 10, true, false, 'thief', 8, 7, 7, 5, 40, 10, 'physical',
 '[{"name":"Cannon Barrage","description":"Md5, Rad 2, 12 dmg"},{"name":"Cutlass Flurry","description":"M1, 2x10 dmg"},{"name":"Rally","description":"Summons 3 Pirates"},{"name":"Free Attack","description":"Free attack for all allies once/fight"}]',
 'The undisputed ruler of the seas, feared by merchants and navies alike.', 5, 'M1/Md5'),

-- ============================================================================
-- FAMILY 11: TROLLS & GIANTS
-- ============================================================================

-- Standard Trolls & Giants
('Troll', 6, false, false, 'troll', 7, 4, 7, 2, 21, 7, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Regenerate","description":"Regenerate 3/turn (fire stops)"},{"name":"Multi-Attack","description":"2 attacks/turn"}]',
 'A lanky, green-skinned brute with incredible regenerative powers.', 4, 'R2, ST'),

('Cave Troll', 8, false, false, 'troll', 9, 3, 8, 1, 24, 9, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Regenerate","description":"Regenerate 4/turn (fire stops)"},{"name":"Rock Throw","description":"Md5, 7 dmg"},{"name":"Sunlight Weakness","description":"Sunlight: -2 all stats"}]',
 'A massive troll that dwells deep underground, loathing the sun.', 3, 'R2, ST'),

('Ice Troll', 9, false, false, 'troll', 8, 4, 8, 3, 24, 9, 'ice',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Regenerate","description":"Regenerate 4/turn (fire stops)"},{"name":"Ice Breath","description":"Cone 2, 7 ice dmg + slow"},{"name":"Immune to Ice","description":"Immune to ice"}]',
 'A frost-covered troll that breathes freezing cold and thrives in arctic conditions.', 4, 'R2/S3'),

('Ogre Mage', 8, false, false, 'troll', 7, 4, 6, 6, 18, 8, 'fire',
 '[{"name":"Fireball","description":"Md5, Rad 2, 8 fire dmg"},{"name":"Invisibility","description":"Invisibility"},{"name":"Flying","description":"Flying (MOV 5)"}]',
 'A rare ogre with innate magical abilities, combining brawn and sorcery.', 3, 'M1/Md5'),

('Stone Giant', 12, false, false, 'troll', 12, 3, 11, 4, 33, 13, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Rock Throw","description":"L7, 10 dmg"},{"name":"Stomp","description":"Rad 2, 8 dmg + prone"},{"name":"Large","description":"2x2 spaces"}]',
 'A towering giant of living stone, hurling boulders with deadly precision.', 3, 'R2/L7'),

('Frost Giant', 14, false, false, 'troll', 13, 4, 12, 5, 36, 15, 'ice',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Ice Axe","description":"15 ice dmg"},{"name":"Blizzard","description":"Rad 3, 10 ice + slow"},{"name":"Rock Throw","description":"Md6, 12 dmg"},{"name":"Immune to Ice","description":"Immune to ice"},{"name":"Large","description":"2x2 spaces"}]',
 'A colossal giant from the frozen north, wielding a massive ice-encrusted axe.', 3, 'R2/Md6'),

('Fire Giant', 14, false, false, 'troll', 14, 3, 12, 4, 36, 16, 'fire',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Flame Sword","description":"16 fire dmg"},{"name":"Boulder","description":"Md6, 12 dmg"},{"name":"Lava Armor","description":"Melee attackers take 4 fire"},{"name":"Immune to Fire","description":"Immune to fire"},{"name":"Large","description":"2x2 spaces"}]',
 'A giant clad in molten armor, wielding a blade wreathed in flames.', 3, 'R2/Md6'),

('Storm Giant', 18, false, false, 'troll', 14, 6, 14, 10, 42, 18, 'lightning',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Lightning Sword","description":"18 lightning dmg"},{"name":"Thunderbolt","description":"L8, 15 dmg"},{"name":"Storm Aura","description":"Aura 3, -2 attack"},{"name":"Flying","description":"Flying (MOV 6)"},{"name":"Immune to Lightning","description":"Immune to lightning"},{"name":"Large","description":"2x2 spaces"}]',
 'The mightiest of giants, commanding the power of storms and wielding lightning.', 4, 'R2/L8'),

-- Boss Trolls & Giants
('Troll King', 10, true, false, 'troll', 10, 4, 9, 3, 45, 10, 'physical',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Regenerate","description":"Regenerate 5/turn (fire stops)"},{"name":"Hurl","description":"Throw creature Md5, 10 dmg both"},{"name":"Roar","description":"Aura 3, flee 3"},{"name":"Summon Trolls","description":"Summons 2 Trolls at half HP"}]',
 'The king of trolls, a hulking monstrosity that rules through sheer regenerative might.', 3, 'R2, ST'),

('The Mountain Titan', 20, true, false, 'troll', 15, 5, 15, 8, 75, 22, 'physical',
 '[{"name":"Huge","description":"3x3 spaces"},{"name":"Reach 2","description":"Reach 2"},{"name":"Boulder Barrage","description":"X10, Rad 2, 18 dmg"},{"name":"Earthquake","description":"Rad 5, 15 dmg + prone"},{"name":"Grabs","description":"M1, 10/turn, STR 18 to escape"},{"name":"Legendary Actions","description":"3 legendary actions"}]',
 'An ancient titan of the mountains, large enough to reshape the landscape.', 4, 'R2/X10'),

-- ============================================================================
-- FAMILY 12: ABERRATIONS
-- ============================================================================

-- Standard Aberrations
-- v1.1 nerfed: STR 1->1, SPD 1->1, TGH 4->3, SMT 1->1, HP 12->9, Dmg 1->1
('Slime', 1, false, false, 'aberration', 1, 1, 3, 1, 9, 1, 'physical',
 '[{"name":"Split","description":"6+ dmg splits into 2 mini-slimes (3 HP, 1 dmg)"},{"name":"Immune to Physical Crits","description":"Immune to physical crits"}]',
 'A mindless blob of ooze that dissolves anything it touches.', 2, 'M1, ST'),

-- v1.1 new Level 3 monster: Mushroom Beast
('Mushroom Beast', 3, false, false, 'aberration', 5, 1, 4, 1, 12, 5, 'physical',
 '[{"name":"Poison Spore","description":"On death: Rad 1, 3 poison dmg"}]',
 'A lumbering fungal creature that releases deadly spores upon death.', 2, 'M1, ST'),

('Mimic', 3, false, false, 'aberration', 5, 2, 5, 3, 15, 5, 'physical',
 '[{"name":"Surprise","description":"Auto-crit first attack"},{"name":"Sticky","description":"Weapon stuck 1 turn"}]',
 'A shapeshifting predator disguised as a treasure chest or other object.', 2, 'M1, ST'),

('Gelatinous Cube', 5, false, false, 'aberration', 4, 1, 7, 0, 21, 3, 'physical',
 '[{"name":"Engulf","description":"SPD (12) or engulfed, 6 acid/turn"},{"name":"Transparent","description":"SPD (14) to spot"},{"name":"Large","description":"2x2 spaces"}]',
 'A perfectly transparent cube of digestive ooze that fills entire corridors.', 2, 'M1, ST'),

('Eye Stalker', 6, false, false, 'aberration', 3, 3, 5, 7, 15, 5, 'arcane',
 '[{"name":"Eye Rays","description":"2/turn, Md6, random (dmg/slow/fear/push)"},{"name":"Anti-Magic Eye","description":"Cone 4 anti-magic"},{"name":"Flying","description":"Flying (MOV 4)"}]',
 'A floating orb covered in eyes, each projecting a different magical ray.', 3, 'Md6, ST'),

('Mind Flayer', 8, false, false, 'aberration', 5, 5, 5, 10, 15, 6, 'psychic',
 '[{"name":"Mind Blast","description":"Cone 3, SMT (14) or stun 2 turns"},{"name":"Dominate","description":"Md5, SMT (16) or controlled 2 turns"},{"name":"Teleport","description":"Teleport 4"}]',
 'A tentacle-faced horror from the deep that feeds on the minds of sentient beings.', 3, 'M1/Md5'),

('Carrion Crawler', 5, false, false, 'aberration', 6, 4, 5, 1, 15, 5, 'poison',
 '[{"name":"Reach 2","description":"Reach 2"},{"name":"Paralyze","description":"TGH (12) or can''t move 2 turns"},{"name":"Wall Climb","description":"Wall Climb"}]',
 'A centipede-like horror that paralyzes prey with its tentacles.', 4, 'R2, ST'),

('Phase Spider', 7, false, false, 'aberration', 5, 6, 4, 4, 12, 6, 'poison',
 '[{"name":"Phase Shift","description":"Teleport 5 after attacking"},{"name":"Poison","description":"4 poison/turn 2 turns"},{"name":"No Opportunity Attacks","description":"Does not provoke opportunity attacks"}]',
 'A spider that shifts between dimensions, striking and vanishing.', 5, 'M1, ST'),

('Rust Monster', 4, false, false, 'aberration', 3, 5, 3, 2, 9, 2, 'physical',
 '[{"name":"Corrode","description":"Weapon/armor loses 1 bonus (permanent)"},{"name":"Harmless Otherwise","description":"Otherwise harmless"}]',
 'An insectoid creature that corrodes and devours metal on contact.', 5, 'M1, ST'),

('Beholder', 14, false, false, 'aberration', 5, 4, 8, 13, 24, 12, 'arcane',
 '[{"name":"Eye Rays","description":"3/turn, Md6, random (12 dmg/petrify/disintegrate 15/telekinesis/fear/sleep)"},{"name":"Anti-Magic Cone","description":"Anti-Magic Cone 5"},{"name":"Flying","description":"Flying (MOV 4)"}]',
 'A floating sphere of malice and paranoia, each eye stalk a deadly weapon.', 3, 'Md6, ST'),

('Eldritch Horror', 18, false, false, 'aberration', 12, 5, 13, 14, 39, 18, 'psychic',
 '[{"name":"Tentacle Storm","description":"Rad 3, 12 dmg"},{"name":"Madness","description":"L8, SMT (18) or attacks random 2 turns"},{"name":"Immune to Status","description":"Immune to charm, fear, stun"},{"name":"Regenerate","description":"Regenerate 5/turn"}]',
 'An incomprehensible entity from beyond reality, driving mortals mad with its presence.', 3, 'M1/L8'),

-- Boss Aberrations
('The Mimic King', 8, true, false, 'aberration', 7, 4, 7, 5, 35, 8, 'physical',
 '[{"name":"Shape Shift","description":"Any object/NPC"},{"name":"Surprise","description":"Auto-crit first attack"},{"name":"Sticky Grab","description":"STR 14 to escape"},{"name":"Spawn Mimics","description":"Spawn 2 Mimics"},{"name":"Devour","description":"Grappled target takes 8/turn"}]',
 'The ultimate mimic, capable of imitating anything and spawning lesser copies.', 3, 'M1/S3'),

('The Elder Brain', 16, true, false, 'aberration', 6, 3, 10, 15, 50, 16, 'psychic',
 '[{"name":"Psychic Blast","description":"X10, Rad 3, 16 dmg + stun"},{"name":"Mass Domination","description":"SMT (18) or controlled"},{"name":"Mind Shield","description":"Aura 5, +3 defense"},{"name":"Summon Mind Flayers","description":"Summons 2 Mind Flayers"},{"name":"Immune to Status","description":"Immune to charm/fear/stun/psychic"},{"name":"Huge","description":"3x3 spaces"}]',
 'The collective consciousness of a mind flayer colony, an immense psychic entity.', 2, 'X10, ST'),

('The World Eater', 20, true, false, 'aberration', 15, 6, 15, 15, 80, 25, 'psychic',
 '[{"name":"Tentacles","description":"R2, 4 attacks, 15 each"},{"name":"Void Scream","description":"X10, Rad 4, 20 dmg + random status"},{"name":"Reality Warp","description":"Teleport any 3 creatures"},{"name":"Devour Reality","description":"Rad 2, TGH (20) or instant KO"},{"name":"Immune to Everything Except Holy","description":"Immune to everything except holy"},{"name":"Legendary Actions","description":"3 legendary actions"}]',
 'An entity of cosmic horror that consumes reality itself, the ultimate aberration.', 4, 'R2/X10');
