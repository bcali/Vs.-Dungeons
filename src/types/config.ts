// Game configuration types — GM calibration dashboard

import type { Profession } from './game';

export interface GameConfig {
  id: string;

  // Stat system (4 stats: STR, SPD, TGH, SMT)
  statCount: number;
  statNames: string[];
  statBaseValue: number;
  statCap: number;
  statBonusFormula: string;

  // Stat points per level (index = level - 1)
  statPointsPerLevel: number[];

  // Derived stats
  hpFormula: string;

  // Spell slots per level (index = level - 1, value = max slots)
  spellSlotProgression: number[];

  // Movement by profession
  movByProfession: Record<Profession, number>;

  // Combat formulas
  meleeDefenseFormula: string;
  rangedDefenseFormula: string;
  defendBonus: number;
  helpFriendBonus: number;
  flankingBonus: number;
  surroundingBonus: number;

  // Crit — natural 20 only
  critOnNat20: boolean;

  // Difficulty targets
  difficultyTargets: {
    easy: number;
    medium: number;
    hard: number;
    epic: number;
  };

  // Rest recovery
  shortRestSlotsRestore: string;

  // Loot tables
  lootTables: Record<string, Record<string, string>>;

  // XP awards
  xpAwards: Record<string, number | number[]>;

  // Level thresholds (index = level - 1)
  xpThresholds: number[];

  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_GAME_CONFIG: Omit<GameConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  statCount: 4,
  statNames: ['STR', 'SPD', 'TGH', 'SMT'],
  statBaseValue: 3,
  statCap: 15,
  statBonusFormula: 'stat - 3',
  statPointsPerLevel: [2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 3],
  hpFormula: 'TGH * 3 + 5',
  spellSlotProgression: [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 10],
  movByProfession: { knight: 3, ranger: 5, wizard: 3, healer: 4, rogue: 5, inventor: 3 },
  meleeDefenseFormula: 'target_TGH + 8',
  rangedDefenseFormula: 'target_SPD + 8',
  defendBonus: 4,
  helpFriendBonus: 3,
  flankingBonus: 2,
  surroundingBonus: 3,
  critOnNat20: true,
  difficultyTargets: { easy: 8, medium: 12, hard: 16, epic: 20 },
  shortRestSlotsRestore: '1',
  lootTables: {
    '1-4': { '1-8': '1 gold', '9-14': '1 Common', '15-18': '2 Common', '19': '1 Uncommon', '20': '1 Uncommon + bonus' },
    '5-9': { '1-8': '1 Common', '9-14': '2 Common', '15-18': '1 Uncommon', '19': '1 Rare', '20': '1 Rare + bonus' },
    '10+': { '1-8': '1 Uncommon', '9-14': '1 Rare', '15-18': '1 Rare + 1 Common', '19': '1 Epic', '20': '1 Epic + bonus' },
    boss: { '1-8': '1 Rare', '9-14': '2 Rare', '15-18': '1 Epic', '19': '1 Epic + 1 Rare', '20': '1 Legendary' },
  },
  xpAwards: {
    monster_at_level: [3, 5],
    monster_below_level: 1,
    boss: [10, 15],
    quest: [10, 25],
    puzzle: 5,
    creative_moment: [2, 5],
    help_player: 2,
    explore_area: 3,
    session_bonus: 5,
  },
  xpThresholds: [0, 10, 25, 45, 70, 100, 140, 190, 250, 320, 400, 500, 620, 760, 920, 1100, 1300, 1520, 1760, 2020],
};
