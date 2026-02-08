-- LEGO QUEST — Ability Seed Data
-- Abilities from spellbook.md organized by profession and tier

-- ═══ KNIGHT (Rage) ═══════════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Shield Slam',    'knight', 1, 30, 'rage', 2, 'Bash a target with your shield. Deals STR damage + chance to Stun for 1 turn.', '{"damage":"STR","effect":"stun","duration":1,"hitBonus":0}'),
('Battle Cry',     'knight', 1, 30, 'rage', 2, 'Shout to inspire! All allies get +2 STR for 2 turns.', '{"buff":"str","value":2,"duration":2,"target":"all_allies"}'),
-- Tier 2
('Whirlwind Slash','knight', 2, 40, 'rage', 3, 'Spin attack hitting all adjacent enemies for STR damage.', '{"damage":"STR","target":"all_adjacent_enemies"}'),
('Taunt',          'knight', 2, 30, 'rage', 3, 'Force one enemy to only attack you for 2 turns.', '{"effect":"taunt","duration":2,"target":"one_enemy"}'),
-- Tier 3
('Shield Wall',    'knight', 3, 50, 'rage', 5, 'Raise your shield. Reduce all incoming damage by 3 for 2 turns.', '{"effect":"damage_reduction","value":3,"duration":2}'),
('Charge',         'knight', 3, 40, 'rage', 5, 'Rush forward up to 4 studs and attack. +3 damage on hit.', '{"damage":"STR+3","movement":4}'),
-- Tier 4
('Rallying Blow',  'knight', 4, 60, 'rage', 8, 'A mighty strike that heals all allies for 3 HP on hit.', '{"damage":"STR","heal_allies":3}'),
-- Tier 5
('Unstoppable',    'knight', 5, 70, 'rage', 10, 'For 3 turns, you cannot be stunned, slowed, or knocked out.', '{"effect":"unstoppable","duration":3}'),
-- Tier 6
('Earthquake Slam','knight', 6, 80, 'rage', 13, 'Slam the ground! All enemies take STR+2 damage and are Slowed for 2 turns.', '{"damage":"STR+2","effect":"slow","duration":2,"target":"all_enemies"}'),
-- Ultimate
('Avatar of War',  'knight', 7, 100, 'rage', 16, 'Transform into a legendary warrior for 3 turns. Double STR, +5 max HP, immune to CC.', '{"buff":"str","multiplier":2,"hp_bonus":5,"cc_immune":true,"duration":3}');

-- ═══ RANGER (Mana) ═══════════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Aimed Shot',     'ranger', 1, 30, 'mana', 2, 'A careful shot. +3 to hit, deals AGI damage.', '{"damage":"AGI","hitBonus":3}'),
('Trap',           'ranger', 1, 30, 'mana', 2, 'Place a trap on a tile. Next enemy to enter takes 3 damage and is Slowed.', '{"damage":3,"effect":"slow","duration":1,"type":"trap"}'),
-- Tier 2
('Double Shot',    'ranger', 2, 40, 'mana', 3, 'Fire two arrows at the same or different targets. Each deals AGI-1 damage.', '{"damage":"AGI-1","hits":2}'),
('Camouflage',     'ranger', 2, 30, 'mana', 3, 'Become hidden. Next attack auto-crits. Broken if hit.', '{"effect":"stealth","nextAttackCrit":true}'),
-- Tier 3
('Volley',         'ranger', 3, 50, 'mana', 5, 'Rain arrows on a 3x3 area. Each enemy takes AGI-2 damage.', '{"damage":"AGI-2","area":"3x3","target":"all_enemies_in_area"}'),
('Beast Companion','ranger', 3, 40, 'mana', 5, 'Summon a hawk. It attacks one enemy per turn for 2 damage for 3 turns.', '{"summon":"hawk","damage":2,"duration":3}'),
-- Tier 4
('Piercing Arrow', 'ranger', 4, 60, 'mana', 8, 'Arrow pierces through targets in a line. Full damage to each.', '{"damage":"AGI","target":"line"}'),
-- Tier 5
('Wind Walk',      'ranger', 5, 70, 'mana', 10, 'Move up to 10 studs without triggering reactions. +4 AGI for 2 turns.', '{"movement":10,"buff":"agi","value":4,"duration":2}'),
-- Tier 6
('Hail of Arrows', 'ranger', 6, 80, 'mana', 13, 'Massive volley: all enemies take AGI damage. Cannot miss.', '{"damage":"AGI","target":"all_enemies","autoHit":true}'),
-- Ultimate
('One with Nature','ranger', 7, 100, 'mana', 16, 'For 3 turns: +5 AGI, all attacks crit on 15+, heal 3 HP per turn.', '{"buff":"agi","value":5,"critRange":15,"hot":3,"duration":3}');

-- ═══ WIZARD (Mana) ═══════════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Fire Bolt',      'wizard', 1, 30, 'mana', 2, 'Hurl a bolt of fire. Deals MNA damage.', '{"damage":"MNA","damageType":"fire"}'),
('Frost Shield',   'wizard', 1, 30, 'mana', 2, 'Surround yourself with ice. +3 to defense for 2 turns.', '{"buff":"defense","value":3,"duration":2}'),
-- Tier 2
('Lightning Arc',  'wizard', 2, 40, 'mana', 3, 'Chain lightning hits 2 targets for MNA-1 damage each.', '{"damage":"MNA-1","hits":2,"damageType":"lightning"}'),
('Teleport',       'wizard', 2, 30, 'mana', 3, 'Instantly move up to 6 studs. Cannot be intercepted.', '{"movement":6,"type":"teleport"}'),
-- Tier 3
('Fireball',       'wizard', 3, 50, 'mana', 5, 'Massive explosion in a 3x3 area. MNA damage to all enemies.', '{"damage":"MNA","area":"3x3","damageType":"fire"}'),
('Counterspell',   'wizard', 3, 40, 'mana', 5, 'React to cancel one enemy ability. Uses your reaction.', '{"type":"reaction","effect":"cancel_ability"}'),
-- Tier 4
('Blizzard',       'wizard', 4, 60, 'mana', 8, 'Ice storm in a 4x4 area. MNA-1 damage + Slow for 2 turns.', '{"damage":"MNA-1","area":"4x4","effect":"slow","duration":2,"damageType":"ice"}'),
-- Tier 5
('Time Warp',      'wizard', 5, 70, 'mana', 10, 'One ally takes an extra turn immediately after yours.', '{"effect":"extra_turn","target":"one_ally"}'),
-- Tier 6
('Meteor Strike',  'wizard', 6, 80, 'mana', 13, 'Call a meteor! All enemies take MNA+3 damage. Massive area.', '{"damage":"MNA+3","target":"all_enemies","damageType":"fire"}'),
-- Ultimate
('Arcane Ascension','wizard', 7, 100, 'mana', 16, 'For 3 turns: all spell costs halved, MNA doubled, spells cannot miss.', '{"costMultiplier":0.5,"buff":"mna","multiplier":2,"autoHit":true,"duration":3}');

-- ═══ HEALER (Mana) ═══════════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Heal',           'healer', 1, 30, 'mana', 2, 'Restore MNA HP to one ally.', '{"heal":"MNA","target":"one_ally"}'),
('Holy Light',     'healer', 1, 30, 'mana', 2, 'Deal MNA-1 holy damage to one undead or demon enemy.', '{"damage":"MNA-1","damageType":"holy","bonus_vs":"undead,demon"}'),
-- Tier 2
('Blessing',       'healer', 2, 40, 'mana', 3, 'One ally gets +2 to all stats for 2 turns.', '{"buff":"all_stats","value":2,"duration":2,"target":"one_ally"}'),
('Purify',         'healer', 2, 30, 'mana', 3, 'Remove all negative effects from one ally.', '{"effect":"cleanse","target":"one_ally"}'),
-- Tier 3
('Prayer of Healing','healer', 3, 50, 'mana', 5, 'All allies heal MNA-1 HP.', '{"heal":"MNA-1","target":"all_allies"}'),
('Guardian Angel', 'healer', 3, 40, 'mana', 5, 'Place a ward. If target drops to 0 HP, they pop back to 5 HP instead.', '{"effect":"death_ward","reviveHp":5,"duration":3,"target":"one_ally"}'),
-- Tier 4
('Radiant Burst',  'healer', 4, 60, 'mana', 8, 'All enemies take MNA holy damage. All allies heal MNA-2.', '{"damage":"MNA","damageType":"holy","heal":"MNA-2","target":"all"}'),
-- Tier 5
('Resurrection',   'healer', 5, 70, 'mana', 10, 'Revive a knocked out ally with half their max HP.', '{"effect":"revive","heal":"50%","target":"ko_ally"}'),
-- Tier 6
('Divine Shield',  'healer', 6, 80, 'mana', 13, 'One ally is invulnerable for 2 turns. Cannot attack while shielded.', '{"effect":"invulnerable","duration":2,"cannot_attack":true,"target":"one_ally"}'),
-- Ultimate
('Miracle',        'healer', 7, 100, 'mana', 16, 'All allies fully healed, all negative effects removed, +3 to all stats for 3 turns.', '{"heal":"full","cleanse":true,"buff":"all_stats","value":3,"duration":3,"target":"all_allies"}');

-- ═══ ROGUE (Energy) ═════════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Backstab',       'rogue', 1, 30, 'energy', 2, 'Attack from behind. Deals AGI+2 damage if target is flanked.', '{"damage":"AGI+2","condition":"flanked"}'),
('Smoke Bomb',     'rogue', 1, 30, 'energy', 2, 'Create a cloud. All allies in area get +3 to defense for 1 turn.', '{"buff":"defense","value":3,"duration":1,"area":"2x2"}'),
-- Tier 2
('Cheap Shot',     'rogue', 2, 40, 'energy', 3, 'Dirty move! Target is Stunned for 1 turn.', '{"effect":"stun","duration":1}'),
('Dash',           'rogue', 2, 30, 'energy', 3, 'Move up to 8 studs. Does not provoke reactions.', '{"movement":8,"safe":true}'),
-- Tier 3
('Poison Blade',   'rogue', 3, 50, 'energy', 5, 'Apply poison to your weapon. Next 3 attacks deal +2 poison damage.', '{"buff":"poison_damage","value":2,"charges":3,"damageType":"poison"}'),
('Vanish',         'rogue', 3, 40, 'energy', 5, 'Become invisible for 2 turns. First attack breaks stealth but auto-crits.', '{"effect":"stealth","duration":2,"firstAttackCrit":true}'),
-- Tier 4
('Fan of Knives',  'rogue', 4, 60, 'energy', 8, 'Throw knives at all adjacent enemies. AGI-1 damage each.', '{"damage":"AGI-1","target":"all_adjacent_enemies"}'),
-- Tier 5
('Assassinate',    'rogue', 5, 70, 'energy', 10, 'If target is below 25% HP, instantly KO them. Otherwise, triple damage.', '{"effect":"execute","threshold":"25%","failDamage":"AGI*3"}'),
-- Tier 6
('Shadow Dance',   'rogue', 6, 80, 'energy', 13, 'For 3 turns: +5 AGI, all attacks from stealth, cannot be targeted by melee.', '{"buff":"agi","value":5,"stealth":true,"meleeImmune":true,"duration":3}'),
-- Ultimate
('Perfect Heist',  'rogue', 7, 100, 'energy', 16, 'Steal one equipped item or buff from any enemy. You gain its effects permanently.', '{"effect":"steal_item_or_buff","target":"one_enemy"}');

-- ═══ INVENTOR (Mana) ═══════════════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
-- Tier 1
('Zap Turret',     'inventor', 1, 30, 'mana', 2, 'Deploy a turret that shoots 2 lightning damage to nearest enemy each turn for 3 turns.', '{"summon":"turret","damage":2,"duration":3,"damageType":"lightning"}'),
('Repair Kit',     'inventor', 1, 30, 'mana', 2, 'Heal one ally for INT HP. Works on constructs too.', '{"heal":"INT","target":"one_ally"}'),
-- Tier 2
('Boom Bot',       'inventor', 2, 40, 'mana', 3, 'Deploy a robot that walks toward nearest enemy and explodes for 5 damage in 2x2 area.', '{"summon":"boom_bot","damage":5,"area":"2x2","delay":1}'),
('Shield Generator','inventor', 2, 30, 'mana', 3, 'Deploy a device. All allies within 3 studs get +2 defense for 3 turns.', '{"buff":"defense","value":2,"duration":3,"area":"3_radius"}'),
-- Tier 3
('Rocket Boots',   'inventor', 3, 50, 'mana', 5, 'Target ally can fly! +4 movement, ignore terrain for 3 turns.', '{"buff":"movement","value":4,"fly":true,"duration":3,"target":"one_ally"}'),
('Net Launcher',   'inventor', 3, 40, 'mana', 5, 'Fire a net. Target is Rooted (cannot move) for 2 turns.', '{"effect":"root","duration":2}'),
-- Tier 4
('Overclock',      'inventor', 4, 60, 'mana', 8, 'One ally gets an extra action this turn. They gain +2 to all stats for that action.', '{"effect":"extra_action","buff":"all_stats","value":2,"target":"one_ally"}'),
-- Tier 5
('Mech Suit',      'inventor', 5, 70, 'mana', 10, 'Summon a mech suit for one ally. +5 STR, +5 CON, +3 damage for 3 turns.', '{"buff":"str","value":5,"buff2":"con","value2":5,"damage_bonus":3,"duration":3}'),
-- Tier 6
('Tesla Coil',     'inventor', 6, 80, 'mana', 13, 'Deploy a massive coil. Each turn it hits all enemies for INT damage (lightning).', '{"summon":"tesla_coil","damage":"INT","duration":3,"target":"all_enemies","damageType":"lightning"}'),
-- Ultimate
('MEGA BUILD',     'inventor', 7, 100, 'mana', 16, 'Build a giant LEGO mech! Ally rides it: +10 STR, +10 CON, +8 movement, immune to CC for 3 turns.', '{"summon":"mega_mech","buff":"str","value":10,"buff2":"con","value2":10,"movement":8,"cc_immune":true,"duration":3}');

-- ═══ UNIVERSAL (any profession) ═════════════════════════════════════

INSERT INTO abilities (name, profession, tier, resource_cost, resource_type, unlock_level, description, effect_json) VALUES
('Basic Attack',   'universal', 1, 0, null, 1, 'A basic melee or ranged attack using STR (melee) or AGI (ranged).', '{"damage":"STR_or_AGI","cost":0}'),
('Defend',         'universal', 1, 0, null, 1, 'Brace for impact. +4 to all defense until your next turn.', '{"buff":"defense","value":4,"duration":1,"cost":0}'),
('Help a Friend',  'universal', 1, 0, null, 1, 'Help an adjacent ally. They get +3 on their next roll.', '{"buff":"next_roll","value":3,"target":"adjacent_ally","cost":0}'),
('Use Item',       'universal', 1, 0, null, 1, 'Use a consumable item from your inventory.', '{"type":"use_item","cost":0}');
