-- LEGO QUEST — Monster XP Values Seed Data
-- Sets xp_reward for all monsters from 002_monsters.sql

-- Level 1 Monsters (3 XP each)
UPDATE monsters SET xp_reward = 3  WHERE name = 'Goblin Scout'    AND is_boss = false;
UPDATE monsters SET xp_reward = 3  WHERE name = 'Skeleton'        AND is_boss = false;
UPDATE monsters SET xp_reward = 3  WHERE name = 'Giant Rat'       AND is_boss = false;
UPDATE monsters SET xp_reward = 3  WHERE name = 'Slime'           AND is_boss = false;
UPDATE monsters SET xp_reward = 3  WHERE name = 'Bandit'          AND is_boss = false;

-- Level 2 Monsters (4 XP each)
UPDATE monsters SET xp_reward = 4  WHERE name = 'Goblin Warrior'  AND is_boss = false;
UPDATE monsters SET xp_reward = 4  WHERE name = 'Zombie'          AND is_boss = false;
UPDATE monsters SET xp_reward = 4  WHERE name = 'Wolf'            AND is_boss = false;
UPDATE monsters SET xp_reward = 4  WHERE name = 'Fire Beetle'     AND is_boss = false;

-- Level 3 Monsters (5 XP each)
UPDATE monsters SET xp_reward = 5  WHERE name = 'Orc Grunt'       AND is_boss = false;
UPDATE monsters SET xp_reward = 5  WHERE name = 'Shadow Wisp'     AND is_boss = false;
UPDATE monsters SET xp_reward = 5  WHERE name = 'Poison Spider'   AND is_boss = false;

-- Level 5 Monsters (7 XP each)
UPDATE monsters SET xp_reward = 7  WHERE name = 'Orc Shaman'      AND is_boss = false;
UPDATE monsters SET xp_reward = 7  WHERE name = 'Stone Golem'     AND is_boss = false;
UPDATE monsters SET xp_reward = 7  WHERE name = 'Dire Wolf'       AND is_boss = false;

-- Level 7 Monsters (9 XP each)
UPDATE monsters SET xp_reward = 9  WHERE name = 'Dark Knight'     AND is_boss = false;
UPDATE monsters SET xp_reward = 9  WHERE name = 'Flame Elemental' AND is_boss = false;
UPDATE monsters SET xp_reward = 9  WHERE name = 'Wraith'          AND is_boss = false;

-- Level 10 Monsters (12 XP each)
UPDATE monsters SET xp_reward = 12 WHERE name = 'Demon Soldier'   AND is_boss = false;
UPDATE monsters SET xp_reward = 12 WHERE name = 'Ancient Treant'  AND is_boss = false;

-- Bosses
UPDATE monsters SET xp_reward = 10 WHERE name = 'Goblin King'              AND is_boss = true;
UPDATE monsters SET xp_reward = 15 WHERE name = 'Bone Dragon'              AND is_boss = true;
UPDATE monsters SET xp_reward = 20 WHERE name = 'Shadow Lord'              AND is_boss = true;
UPDATE monsters SET xp_reward = 30 WHERE name = 'Dragon of the Stolen Crown' AND is_boss = true;
