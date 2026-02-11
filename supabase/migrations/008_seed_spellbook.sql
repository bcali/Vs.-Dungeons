-- 008_seed_spellbook.sql
-- Seed all spells from the Vs. Dungeons spellbook into the abilities table.
-- Covers: Knight, Ranger, Wizard, Healer, Rogue, Inventor, Universal

-- Clear existing ability data to avoid duplicates on re-run
DELETE FROM abilities;

INSERT INTO abilities (name, profession, tier, slot_cost, range, aoe, unlock_level, description) VALUES

-- ============================================================
-- KNIGHT (Battle Cries)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('War Shout', 'knight', 1, 1, 'Self', 'Aura 4', 2,
 'All allies within 4 spaces get +1 to their next attack roll.'),

('Shield Slam', 'knight', 1, 1, 'M1', 'ST', 2,
 'Melee attack that pushes enemy back 3 spaces and stuns for 1 turn on hit.'),

('Iron Stance', 'knight', 1, 1, 'Self', 'Self', 2,
 'Take half damage from the next attack that hits you.'),

('Challenge', 'knight', 1, 1, 'Md5', 'ST', 2,
 'One enemy within 5 spaces must attack you instead of your allies for 2 turns.'),

-- Tier 2 (Level 5)
('Earthquake Stomp', 'knight', 2, 1, 'Self', 'Cross 3', 5,
 'All enemies within 3 spaces (cross pattern) make SPD check (12) or fall prone.'),

('Rally Cry', 'knight', 2, 1, 'S4', 'ST', 5,
 'One ally within 4 spaces recovers 5 HP and gets +2 to all rolls this turn.'),

('Blade Storm', 'knight', 2, 2, 'M1', 'ST', 5,
 'Make 2 melee attacks against different adjacent enemies.'),

('Unbreakable', 'knight', 2, 1, 'Self', 'Self', 5,
 'For 2 turns, you can''t be knocked below 1 HP.'),

-- Tier 3 (Level 8)
('Titan Strike', 'knight', 3, 2, 'M1', 'ST', 8,
 'Next melee attack deals double STR damage and ignores armor.'),

('Battle Banner', 'knight', 3, 1, 'M1', 'Aura 5', 8,
 'Plant a banner. All allies within 5 spaces get +2 attack and defense for 3 turns.'),

('Reflect', 'knight', 3, 1, 'Self', 'Self', 8,
 'React: when hit by melee, deal half damage back to attacker.'),

('Charge', 'knight', 3, 1, 'Line 8', 'ST', 8,
 'Move up to 8 spaces in a line and attack first enemy hit. +5 damage if moved 5+ spaces.'),

-- Tier 4 (Level 10)
('Shockwave', 'knight', 4, 2, 'Self', 'Ring 5', 10,
 'All enemies within 5 spaces take STR damage and pushed back 4 spaces.'),

('Last Stand', 'knight', 4, 2, 'Self', 'Self', 10,
 'When KO''d this battle, stand with 1 HP and free melee attack at +5 damage.'),

('Commander', 'knight', 4, 1, 'Md6', 'ST', 10,
 'One ally within 6 spaces immediately takes a free turn.'),

('Fortress Wall', 'knight', 4, 2, 'M1', 'Line 4', 10,
 'Create 4-space wall blocking ranged and movement for 3 turns.'),

-- Tier 5 (Level 12)
('Avatar of War', 'knight', 5, 3, 'Self', 'Aura 1', 12,
 '3 turns: +3 STR, +3 TGH, all melee attacks hit every adjacent enemy.'),

('Unshakable Aura', 'knight', 5, 2, 'Self', 'Aura 6', 12,
 'All allies within 6 spaces immune to stun, fear, knockback for 3 turns.'),

-- Tier 6 (Level 15)
('Legendary Charge', 'knight', 6, 3, 'Line 10', 'Line 10', 15,
 'Charge 10 spaces, everything in path takes STR x 2 damage.'),

('One Shall Stand', 'knight', 6, 3, 'Md6', 'ST', 15,
 'Choose enemy within 6, duel for 3 turns, you get +5 to all rolls.'),

-- Ultimate (Level 20)
('Invincible', 'knight', 7, 5, 'Self', 'Self', 20,
 '1 full round: can''t be damaged, every attack auto-hits, MOV becomes 5.'),

-- ============================================================
-- RANGER (Techniques)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Quick Shot', 'ranger', 1, 1, 'Md6', 'ST', 2,
 'Extra ranged attack at -2.'),

('Hunter''s Mark', 'ranger', 1, 1, 'L8', 'ST', 2,
 'Mark enemy, +2 damage to it for encounter.'),

('Nature''s Whisper', 'ranger', 1, 1, 'Self', 'Aura 8', 2,
 'Detect traps and hidden enemies within 8.'),

('Vine Snare', 'ranger', 1, 1, 'Md5', 'ST', 2,
 'Target makes SPD check (12) or rooted 1 turn.'),

-- Tier 2 (Level 5)
('Barrage', 'ranger', 2, 2, 'Md6', 'ST', 5,
 'Fire 3 arrows at one target (roll each).'),

('Camouflage', 'ranger', 2, 1, 'Self', 'Self', 5,
 'You and one adjacent ally become hidden. +5 stealth.'),

('Beast Call', 'ranger', 2, 1, 'M1', 'ST', 5,
 'Summon wolf: 4 HP, MOV 5, 3 damage, 3 turns.'),

('Tripwire', 'ranger', 2, 1, 'S4', 'Line 4', 5,
 'Invisible wire, first enemy: 4 dmg + prone.'),

-- Tier 3 (Level 8)
('Piercing Shot', 'ranger', 3, 2, 'Line 8', 'Line 8', 8,
 'Arrow through all enemies in line (max 3 targets).'),

('Wind Run', 'ranger', 3, 1, 'Self', 'Self', 8,
 'MOV 10 this turn, no traps/opportunity attacks.'),

('Hawk Vision', 'ranger', 3, 1, 'Self', 'Aura 10', 8,
 'See through walls, reveal hidden things within 10.'),

('Poison Cloud Arrow', 'ranger', 3, 2, 'L7', 'Rad 2', 8,
 '3 dmg/turn for 3 turns in poison cloud.'),

-- Tier 4 (Level 10)
('Rain of Arrows', 'ranger', 4, 3, 'L8', 'Rad 3', 10,
 'Every enemy in Rad 3 takes SPD damage.'),

('Spirit Animal', 'ranger', 4, 2, 'M1', 'ST', 10,
 'Summon bear: 12 HP, MOV 4, 6 damage, encounter.'),

('Grapple Arrow', 'ranger', 4, 1, 'X10', 'Self', 10,
 'Move instantly to any visible point within 10.'),

('Vanish', 'ranger', 4, 1, 'Self', 'Self', 10,
 'React: attacked → invisible + move 4 spaces, attack misses.'),

-- Tier 5 (Level 12)
('Legendary Beast', 'ranger', 5, 3, 'M1', 'ST', 12,
 'Summon giant eagle: 20 HP, MOV 8, 8 dmg, encounter.'),

('Perfect Ambush', 'ranger', 5, 2, 'Self', 'Self', 12,
 'If hidden, next attack auto-crits and doesn''t reveal.'),

-- Tier 6 (Level 15)
('Nature''s Wrath', 'ranger', 6, 3, 'L8', 'Rad 4', 15,
 '6 dmg/turn for 3 turns in Rad 4.'),

('Ghost Trail', 'ranger', 6, 3, 'Self', 'Aura 5', 15,
 'You and allies within 5 move freely unseen for 1 round.'),

-- Ultimate (Level 20)
('Phantom Arrow', 'ranger', 7, 5, 'X10', 'ST', 20,
 'Never misses, 30 damage, stuns 2 turns.'),

-- ============================================================
-- WIZARD (Spells)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Spark', 'wizard', 1, 1, 'Md6', 'ST', 2,
 'SMT damage to one enemy.'),

('Glow', 'wizard', 1, 1, 'Md6', 'Rad 3', 2,
 'Light up Rad 3 area, reveals invisible.'),

('Push', 'wizard', 1, 1, 'Md5', 'ST', 2,
 'Shove enemy 4 spaces, no damage.'),

('Frost Touch', 'wizard', 1, 1, 'M1', 'ST', 2,
 '4 damage + enemy MOV halved next turn.'),

('Magic Shield', 'wizard', 1, 1, 'Self', 'Self', 2,
 '+3 defense until start of next turn.'),

-- Tier 2 (Level 5)
('Fireball', 'wizard', 2, 2, 'Md6', 'Rad 2', 5,
 'SMT x 2 damage in Rad 2 (friendly fire!).'),

('Ice Wall', 'wizard', 2, 1, 'Md5', 'Line 4', 5,
 '4-space wall, 10 HP to break, 3 turns.'),

('Lightning Bolt', 'wizard', 2, 2, 'Line 8', 'Line 8', 5,
 'SMT x 2 damage in line.'),

('Levitate', 'wizard', 2, 1, 'Self', 'Self', 5,
 'Float 3 turns, no melee hits, MOV 3.'),

('Sleep', 'wizard', 2, 1, 'Md5', 'ST', 5,
 'Enemy (SMT 6 or less) falls asleep, wakes if hit.'),

-- Tier 3 (Level 8)
('Teleport', 'wizard', 3, 1, 'X10', 'Self', 8,
 'Instant move to any visible space within 10.'),

('Mirror Image', 'wizard', 3, 2, 'Self', 'Self', 8,
 '2 copies, 1 in 3 chance to hit you, 3 turns.'),

('Chain Lightning', 'wizard', 3, 2, 'Md6', 'ST', 8,
 'SMT x 2 to target, bounces to 2 more for SMT each.'),

('Force Cage', 'wizard', 3, 2, 'Md5', 'ST', 8,
 'Trap enemy 2 turns, can''t act or be attacked.'),

('Counterspell', 'wizard', 3, 1, 'Md6', 'ST', 8,
 'React: cancel one enemy spell/ability within 6.'),

-- Tier 4 (Level 10)
('Meteor', 'wizard', 4, 3, 'L8', 'Rad 2', 10,
 '20 damage in Rad 2 + burning terrain 3 dmg/turn 2 turns.'),

('Dimension Door', 'wizard', 4, 2, 'X10', 'Self', 10,
 'Teleport you + adjacent ally anywhere within 10.'),

('Mind Control', 'wizard', 4, 3, 'Md6', 'ST', 10,
 'Enemy fights for you 2 turns (SMT check 16).'),

('Blizzard', 'wizard', 4, 2, 'L7', 'Rad 3', 10,
 '8 damage + MOV halved for 3 turns in Rad 3.'),

-- Tier 5 (Level 12)
('Arcane Storm', 'wizard', 5, 3, 'Self', 'Aura 5', 12,
 '3 turns: start of turn, enemies within 5 take SMT damage.'),

('Clone', 'wizard', 5, 3, 'M1', 'ST', 12,
 'Copy with half HP/stats, copies spells (1 slot each), 3 turns.'),

-- Tier 6 (Level 15)
('Gravity Well', 'wizard', 6, 3, 'L7', 'Rad 4', 15,
 'Pull all enemies to center, 12 dmg + stun 1 turn.'),

('Wish', 'wizard', 6, 4, 'Self', 'Self', 15,
 'Copy any spell you know, once per day.'),

-- Ultimate (Level 20)
('Time Stop', 'wizard', 7, 5, 'Self', 'Self', 20,
 '3 extra turns, nobody else can act, once per battle.'),

-- ============================================================
-- HEALER (Prayers)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Mend', 'healer', 1, 1, 'S4', 'ST', 2,
 'Heal ally for SMT x 2 HP.'),

('Light Barrier', 'healer', 1, 1, 'S4', 'ST', 2,
 'One ally gets +3 defense for 2 turns.'),

('Cleanse', 'healer', 1, 1, 'S4', 'ST', 2,
 'Remove one negative effect from ally.'),

('Guiding Light', 'healer', 1, 1, 'Md6', 'ST', 2,
 'One ally gets +3 to next attack roll.'),

-- Tier 2 (Level 5)
('Healing Rain', 'healer', 2, 2, 'Md5', 'Rad 2', 5,
 'All allies in Rad 2 recover 5 HP.'),

('Bless', 'healer', 2, 1, 'Md5', 'ST', 5,
 'Ally gets +2 to ALL rolls for 3 turns.'),

('Smite', 'healer', 2, 1, 'M1', 'ST', 5,
 'Melee or ranged (Md5): +SMT holy damage, +3 vs undead.'),

('Spirit Link', 'healer', 2, 1, 'Md5', 'ST', 5,
 'Link 2 allies, damage split between them, 3 turns.'),

('Calm', 'healer', 2, 1, 'Md5', 'ST', 5,
 'Enemy stops attacking 1 turn (SMT check 12).'),

-- Tier 3 (Level 8)
('Resurrection', 'healer', 3, 2, 'S4', 'ST', 8,
 'Revive KO''d ally at half max HP.'),

('Holy Nova', 'healer', 3, 2, 'Self', 'Rad 2', 8,
 'Allies heal 8, enemies take 8 holy damage.'),

('Divine Shield', 'healer', 3, 2, 'Md5', 'ST', 8,
 'Ally takes zero damage from next 2 attacks.'),

('Purify Zone', 'healer', 3, 1, 'S4', 'Zone 3x3', 8,
 'Allies inside immune to negative effects, 3 turns.'),

-- Tier 4 (Level 10)
('Sanctuary', 'healer', 4, 3, 'Md5', 'Zone 4x4', 10,
 'Allies inside regen 4 HP/turn for 4 turns.'),

('Guardian Angel', 'healer', 4, 2, 'Md6', 'ST', 10,
 'If ally would KO, healed to half HP instead (once).'),

('Mass Bless', 'healer', 4, 2, 'Self', 'Aura 5', 10,
 'All allies within 5 get +2 to all rolls for 3 turns.'),

('Judgment', 'healer', 4, 2, 'Md6', 'ST', 10,
 'SMT x 3 holy damage, double vs undead.'),

-- Tier 5 (Level 12)
('Beam of Light', 'healer', 5, 3, 'L7', 'ST', 12,
 '10 holy dmg/turn, concentrate to maintain.'),

('Immortality', 'healer', 5, 3, 'Md5', 'ST', 12,
 'Ally can''t die for 3 turns, stays at 1 HP minimum.'),

-- Tier 6 (Level 15)
('Divine Storm', 'healer', 6, 3, 'Self', 'Rad 5', 15,
 'Enemies take 15 holy, allies heal 15.'),

('Rebirth', 'healer', 6, 4, 'Self', 'X10', 15,
 'Revive all KO''d allies at full HP, once per day.'),

-- Ultimate (Level 20)
('Miracle', 'healer', 7, 5, 'Self', 'X10', 20,
 'Full heal entire party, remove all negatives, +5 all stats 3 turns.'),

-- ============================================================
-- ROGUE (Tricks)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Sneak Attack', 'rogue', 1, 1, 'M1', 'ST', 2,
 'If behind/hidden: double damage on next melee.'),

('Smoke Bomb', 'rogue', 1, 1, 'S3', 'Rad 2', 2,
 'Smoke cloud: +5 hide, -3 attacks, 2 turns.'),

('Pocket Sand', 'rogue', 1, 1, 'M1', 'ST', 2,
 'Blinded 1 turn (-5 attacks).'),

('Quick Fingers', 'rogue', 1, 1, 'M1', 'ST', 2,
 'Steal item or pick lock, no roll.'),

-- Tier 2 (Level 5)
('Shadow Step', 'rogue', 2, 1, 'Md6', 'Self', 5,
 'Teleport within 6, count as hidden.'),

('Poison Blade', 'rogue', 2, 1, 'Self', 'Self', 5,
 'Next 3 melee attacks deal +3 poison each.'),

('Caltrops', 'rogue', 2, 1, 'S3', 'Line 4', 5,
 'Enemies entering take 3 dmg, MOV halved 1 turn.'),

('Feint', 'rogue', 2, 1, 'M1', 'ST', 5,
 'Next melee auto-hits (no roll).'),

('Disguise', 'rogue', 2, 1, 'Self', 'Self', 5,
 'Look like any humanoid 10 min, breaks on attack.'),

-- Tier 3 (Level 8)
('Vanish', 'rogue', 3, 1, 'Self', 'Self', 8,
 'Invisible 2 turns, attack from invisible = auto-crit.'),

('Fan of Knives', 'rogue', 3, 2, 'Self', 'Rad 3', 8,
 'All enemies within 3 take SPD damage.'),

('Decoy', 'rogue', 3, 1, 'M1', 'ST', 8,
 'Place dummy (1 HP), absorbs next attack on you.'),

('Sap', 'rogue', 3, 1, 'M1', 'ST', 8,
 'KO humanoid 3 turns, breaks on damage, must be hidden/behind.'),

-- Tier 4 (Level 10)
('Shadow Clone Army', 'rogue', 4, 3, 'Self', 'Rad 2', 10,
 '3 clones: 1 HP, MOV 5, 5 damage each.'),

('Death Mark', 'rogue', 4, 2, 'Md6', 'ST', 10,
 'Enemy takes +5 damage from everyone for 3 turns.'),

('Escape Artist', 'rogue', 4, 1, 'Self', 'Self', 10,
 'React: avoid trap/stun/cage, move 2 spaces free.'),

('Heist', 'rogue', 4, 2, 'M1', 'ST', 10,
 'Steal weapon/item from enemy, use immediately.'),

-- Tier 5 (Level 12)
('Shadow Dance', 'rogue', 5, 3, 'Self', 'Self', 12,
 '3 turns: after attack, auto-hide + move 2 free.'),

('Perfect Crime', 'rogue', 5, 2, 'Self', 'Self', 12,
 'Auto-succeed any non-combat check.'),

-- Tier 6 (Level 15)
('Living Shadow', 'rogue', 6, 3, 'M1', 'ST', 15,
 'Shadow fighter: your HP/stats, copies attacks, 3 turns.'),

('Master Thief', 'rogue', 6, 3, 'Md5', 'ST', 15,
 'Steal any item including quest/boss items, no roll.'),

-- Ultimate (Level 20)
('Assassinate', 'rogue', 7, 5, 'M1', 'ST', 20,
 'From stealth: quadruple damage + TGH check (20) or instant defeat.'),

-- ============================================================
-- INVENTOR (Blueprints)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Boom Box', 'inventor', 1, 1, 'S4', 'Rad 1', 2,
 '5 damage in Rad 1.'),

('Grapple Hook', 'inventor', 1, 1, 'L8', 'Self', 2,
 'Move instantly to any point within 8 spaces.'),

('Repair Bot', 'inventor', 1, 1, 'M1', 'ST', 2,
 'Deploy bot: 2 HP, MOV 3, heals 4 HP/turn for 2 turns.'),

('Flashbang', 'inventor', 1, 1, 'S3', 'Rad 2', 2,
 'All enemies in Rad 2 blinded 1 turn (-5 attacks).'),

-- Tier 2 (Level 5)
('Robot Buddy', 'inventor', 2, 1, 'M1', 'ST', 5,
 'Deploy robot: 8 HP, MOV 4, 4 damage, until destroyed.'),

('Turret', 'inventor', 2, 2, 'M1', 'ST', 5,
 'Auto-turret: 6 HP, Md6 range, 4 dmg/turn, 4 turns.'),

('Jetpack Boost', 'inventor', 2, 1, 'Self', 'Self', 5,
 'Fly 8 spaces ignoring everything, 1 turn.'),

('Smoke Screen', 'inventor', 2, 1, 'S4', 'Rad 3', 5,
 'Smoke cloud blocking vision 3 turns.'),

('Electro Net', 'inventor', 2, 1, 'Md5', 'ST', 5,
 'SPD check (14) or stunned 2 turns.'),

-- Tier 3 (Level 8)
('Mega Turret', 'inventor', 3, 2, 'M1', 'ST', 8,
 'Turret: 12 HP, L7 range, 8 dmg/turn, until destroyed.'),

('Force Field', 'inventor', 3, 2, 'S4', 'Rad 2', 8,
 'Dome: allies inside half damage, 3 turns.'),

('Overclock', 'inventor', 3, 1, 'S4', 'ST', 8,
 'Ally gets +2 all stats for 2 turns.'),

('Drone Scout', 'inventor', 3, 1, 'Self', 'ST', 8,
 'Flying drone: 1 HP, MOV 8, full board vision, 3 turns.'),

-- Tier 4 (Level 10)
('Battle Mech', 'inventor', 4, 3, 'Self', 'Self', 10,
 'Mech suit: +8 HP, +4 STR, +2 SPD, MOV 4, R2 melee, 4 turns.'),

('Chain Reaction', 'inventor', 4, 2, 'S4', 'Rad 1', 10,
 'Place 3 bombs, 8 dmg each in Rad 1 on detonate.'),

('Upgrade All', 'inventor', 4, 2, 'Self', 'Aura 5', 10,
 'All allies within 5: weapons +3 damage for encounter.'),

('Hologram', 'inventor', 4, 1, 'Md6', 'Zone 2x2', 10,
 'Fake monster/wall: SMT check (14) to see through.'),

-- Tier 5 (Level 12)
('Robot Army', 'inventor', 5, 3, 'M1', 'ST', 12,
 'Deploy 4 small robots: 4 HP, MOV 3, 3 damage each.'),

('Orbital Strike', 'inventor', 5, 3, 'L8', 'Rad 2', 12,
 '1 turn delay, then 20 damage in Rad 2.'),

-- Tier 6 (Level 15)
('Titan Mech', 'inventor', 6, 4, 'Self', 'Self', 15,
 'Full mech: +15 HP, +6 STR, +4 SPD, MOV 5, L7 ranged 10 dmg.'),

('Gravity Bomb', 'inventor', 6, 3, 'Md6', 'Rad 3', 15,
 'Pull to center, 15 dmg + stun 1 turn (friendly fire!).'),

-- Ultimate (Level 20)
('Doomsday Device', 'inventor', 7, 5, 'Self', 'ST', 20,
 'Build 1 turn, then: 40 ST or 20 all enemies.'),

-- ============================================================
-- UNIVERSAL (Any Profession - from Spell Scrolls)
-- ============================================================

-- Tier 1 (Level 2, 1 slot each)
('Second Wind', 'universal', 1, 1, 'Self', 'Self', 2,
 'Heal 5 HP.'),

('Lucky Break', 'universal', 1, 1, 'Self', 'Self', 2,
 'Reroll any one die.'),

('Detect Magic', 'universal', 1, 1, 'Self', 'Aura 8', 2,
 'See all magic within 8.'),

('Jump', 'universal', 1, 1, 'Self', 'Self', 2,
 'Leap 6 spaces over everything.'),

-- Tier 2 (Level 5)
('Elemental Weapon', 'universal', 2, 1, 'M1', 'ST', 5,
 '+4 fire/ice/lightning damage 3 turns.'),

('Haste', 'universal', 2, 2, 'S4', 'ST', 5,
 'Target takes 2 actions, +3 MOV.'),

('Slow', 'universal', 2, 1, 'Md6', 'ST', 5,
 'MOV halved, -2 all rolls, 2 turns.'),

-- Tier 3 (Level 8)
('Fly', 'universal', 3, 2, 'Self', 'Self', 8,
 '3 turns: MOV 6, ignore terrain, no melee.'),

-- Tier 4 (Level 10)
('Earthquake', 'universal', 4, 3, 'L7', 'Rad 3', 10,
 '10 damage + prone in Rad 3.'),

('Resurrection', 'universal', 4, 3, 'S4', 'ST', 10,
 'Revive KO''d ally at half HP.');
