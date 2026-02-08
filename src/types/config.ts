// Game configuration types — GM calibration dashboard

export interface GameConfig {
  id: string;

  // Stat system
  statCount: number;
  statNames: string[];
  statBaseValue: number;
  statCap: number;
  statBonusFormula: string;

  // Stat points per level (index = level - 1)
  statPointsPerLevel: number[];

  // Derived stats
  hpFormula: string;
  manaPoolFormula: string;
  energyPoolMax: number;
  ragePoolMax: number;
  movementBase: number;

  // Resource regen
  manaRegenPerTurn: number;
  energyRegenPerTurn: number;
  rageOnHitTaken: number;
  rageOnMeleeHit: number;
  rageOnCritTaken: number;
  rageOnAllyKo: number;

  // Combat formulas
  meleeDefenseFormula: string;
  rangedDefenseFormula: string;
  defendBonus: number;
  helpFriendBonus: number;

  // Crit / Luck
  baseCritValue: number;
  luckCritThresholds: Record<string, number>;
  luckySavesPerSession: number;

  // Difficulty targets
  difficultyTargets: {
    easy: number;
    medium: number;
    hard: number;
    epic: number;
  };

  // Ability costs by tier
  abilityCosts: Record<string, number | number[]>;

  // Rest recovery
  shortRestResourceRestore: number;

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
  statCount: 6,
  statNames: ['CON', 'STR', 'AGI', 'MNA', 'INT', 'LCK'],
  statBaseValue: 3,
  statCap: 15,
  statBonusFormula: 'stat - 3',
  statPointsPerLevel: [1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 3],
  hpFormula: 'CON * 3',
  manaPoolFormula: 'MNA * 15',
  energyPoolMax: 100,
  ragePoolMax: 100,
  movementBase: 6,
  manaRegenPerTurn: 20,
  energyRegenPerTurn: 20,
  rageOnHitTaken: 15,
  rageOnMeleeHit: 10,
  rageOnCritTaken: 25,
  rageOnAllyKo: 20,
  meleeDefenseFormula: 'target_STR + 8',
  rangedDefenseFormula: 'target_AGI + 8',
  defendBonus: 4,
  helpFriendBonus: 3,
  baseCritValue: 20,
  luckCritThresholds: { '5': 19, '8': 18, '12': 17 },
  luckySavesPerSession: 1,
  difficultyTargets: { easy: 8, medium: 12, hard: 16, epic: 20 },
  abilityCosts: { '1': 30, '2': [30, 40], '3': [40, 50], '4': [50, 60], '5': [60, 70], '6': [70, 80], ultimate: 100 },
  shortRestResourceRestore: 30,
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
