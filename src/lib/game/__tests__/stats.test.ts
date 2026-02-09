import type { Stats } from '@/types/game';
import {
  statBonus,
  totalStat,
  totalStats,
  maxHp,
  maxResource,
  critRange,
  totalStatPointsEarned,
  totalStatPointsSpent,
  meleeDefenseTarget,
  rangedDefenseTarget,
  rankForLevel,
  xpForLevel,
} from '../stats';

// ─── statBonus ──────────────────────────────────────────────────────

describe('statBonus', () => {
  it('returns 0 when stat equals default base (3)', () => {
    expect(statBonus(3)).toBe(0);
  });

  it('returns positive bonus when stat is above base', () => {
    expect(statBonus(5)).toBe(2);
  });

  it('returns negative bonus when stat is below base', () => {
    expect(statBonus(1)).toBe(-2);
  });

  it('respects a custom base value from config', () => {
    expect(statBonus(5, { statBaseValue: 5 })).toBe(0);
    expect(statBonus(7, { statBaseValue: 5 })).toBe(2);
  });
});

// ─── totalStat ──────────────────────────────────────────────────────

describe('totalStat', () => {
  it('adds base and gear bonus', () => {
    expect(totalStat(5, 2)).toBe(7);
  });

  it('handles zero gear bonus', () => {
    expect(totalStat(4, 0)).toBe(4);
  });

  it('handles negative gear bonus (cursed item)', () => {
    expect(totalStat(4, -1)).toBe(3);
  });
});

// ─── totalStats ─────────────────────────────────────────────────────

describe('totalStats', () => {
  const base: Stats = { con: 3, str: 4, agi: 5, mna: 3, int: 3, lck: 3 };
  const gear: Stats = { con: 1, str: 0, agi: 2, mna: 0, int: 1, lck: 0 };

  it('sums each stat individually', () => {
    const result = totalStats(base, gear);
    expect(result).toEqual({ con: 4, str: 4, agi: 7, mna: 3, int: 4, lck: 3 });
  });

  it('returns correct shape with all 6 stat keys', () => {
    const result = totalStats(base, gear);
    expect(Object.keys(result).sort()).toEqual(['agi', 'con', 'int', 'lck', 'mna', 'str']);
  });
});

// ─── maxHp ──────────────────────────────────────────────────────────

describe('maxHp', () => {
  it('calculates CON * 3', () => {
    expect(maxHp(5)).toBe(15);
  });

  it('returns 0 for CON 0', () => {
    expect(maxHp(0)).toBe(0);
  });

  it('returns 9 for CON 3', () => {
    expect(maxHp(3)).toBe(9);
  });
});

// ─── maxResource ────────────────────────────────────────────────────

describe('maxResource', () => {
  it('returns 100 for energy (default)', () => {
    expect(maxResource('energy', 3)).toBe(100);
  });

  it('returns 100 for rage (default)', () => {
    expect(maxResource('rage', 3)).toBe(100);
  });

  it('returns MNA * 15 for mana', () => {
    expect(maxResource('mana', 5)).toBe(75);
    expect(maxResource('mana', 10)).toBe(150);
  });

  it('returns 0 for null resource type', () => {
    expect(maxResource(null, 5)).toBe(0);
  });

  it('respects custom config for energy and rage pools', () => {
    expect(maxResource('energy', 3, { energyPoolMax: 80, ragePoolMax: 120, manaPoolFormula: 'MNA * 15' })).toBe(80);
    expect(maxResource('rage', 3, { energyPoolMax: 80, ragePoolMax: 120, manaPoolFormula: 'MNA * 15' })).toBe(120);
  });
});

// ─── critRange ──────────────────────────────────────────────────────

describe('critRange', () => {
  it('returns base crit (20) for LCK below all thresholds', () => {
    expect(critRange(3)).toBe(20);
  });

  it('returns 19 at LCK 5 (first threshold)', () => {
    expect(critRange(5)).toBe(19);
  });

  it('returns 18 at LCK 8 (second threshold)', () => {
    expect(critRange(8)).toBe(18);
  });

  it('returns 17 at LCK 12 (third threshold)', () => {
    expect(critRange(12)).toBe(17);
  });

  it('uses highest matching threshold for LCK between thresholds', () => {
    // LCK 6 matches threshold 5 => 19
    expect(critRange(6)).toBe(19);
    // LCK 10 matches threshold 8 => 18
    expect(critRange(10)).toBe(18);
  });

  it('returns 17 for LCK above all thresholds', () => {
    expect(critRange(15)).toBe(17);
  });
});

// ─── totalStatPointsEarned ──────────────────────────────────────────

describe('totalStatPointsEarned', () => {
  it('returns 1 for level 1 (first entry)', () => {
    // statPointsPerLevel[0] = 1
    expect(totalStatPointsEarned(1)).toBe(1);
  });

  it('returns sum of first 5 entries for level 5', () => {
    // [1, 1, 1, 1, 2] = 6
    expect(totalStatPointsEarned(5)).toBe(6);
  });

  it('returns 0 for level 0', () => {
    expect(totalStatPointsEarned(0)).toBe(0);
  });

  it('clamps to array length when level exceeds it', () => {
    // All 20 entries sum: 1+1+1+1+2+1+1+2+1+2+1+2+1+1+2+1+1+2+1+3 = 28
    expect(totalStatPointsEarned(20)).toBe(28);
    // Beyond the array should return same total
    expect(totalStatPointsEarned(25)).toBe(28);
  });
});

// ─── totalStatPointsSpent ───────────────────────────────────────────

describe('totalStatPointsSpent', () => {
  it('returns 0 when all stats are at base (3)', () => {
    const stats: Stats = { con: 3, str: 3, agi: 3, mna: 3, int: 3, lck: 3 };
    expect(totalStatPointsSpent(stats)).toBe(0);
  });

  it('returns total points invested above base', () => {
    const stats: Stats = { con: 5, str: 4, agi: 3, mna: 3, int: 3, lck: 3 };
    // (5-3)+(4-3) = 3
    expect(totalStatPointsSpent(stats)).toBe(3);
  });

  it('handles negative bonus (below base) correctly', () => {
    const stats: Stats = { con: 2, str: 3, agi: 3, mna: 3, int: 3, lck: 3 };
    // (2-3) = -1
    expect(totalStatPointsSpent(stats)).toBe(-1);
  });

  it('respects custom statBaseValue', () => {
    const stats: Stats = { con: 5, str: 5, agi: 5, mna: 5, int: 5, lck: 5 };
    expect(totalStatPointsSpent(stats, { statBaseValue: 5 })).toBe(0);
  });
});

// ─── meleeDefenseTarget ─────────────────────────────────────────────

describe('meleeDefenseTarget', () => {
  it('returns STR + 8', () => {
    expect(meleeDefenseTarget(3)).toBe(11);
    expect(meleeDefenseTarget(5)).toBe(13);
    expect(meleeDefenseTarget(0)).toBe(8);
  });
});

// ─── rangedDefenseTarget ────────────────────────────────────────────

describe('rangedDefenseTarget', () => {
  it('returns AGI + 8', () => {
    expect(rangedDefenseTarget(3)).toBe(11);
    expect(rangedDefenseTarget(5)).toBe(13);
    expect(rangedDefenseTarget(0)).toBe(8);
  });
});

// ─── rankForLevel ───────────────────────────────────────────────────

describe('rankForLevel', () => {
  it('returns "Starting Hero" for level 1', () => {
    expect(rankForLevel(1)).toBe('Starting Hero');
  });

  it('returns "Apprentice" for level 2', () => {
    expect(rankForLevel(2)).toBe('Apprentice');
  });

  it('returns "Adventurer" for level 3', () => {
    expect(rankForLevel(3)).toBe('Adventurer');
  });

  it('returns "Veteran" for level 5', () => {
    expect(rankForLevel(5)).toBe('Veteran');
  });

  it('returns "Champion" for level 8', () => {
    expect(rankForLevel(8)).toBe('Champion');
  });

  it('returns "Hero" for level 10', () => {
    expect(rankForLevel(10)).toBe('Hero');
  });

  it('returns "Legend" for level 13', () => {
    expect(rankForLevel(13)).toBe('Legend');
  });

  it('returns "Mythic" for level 16', () => {
    expect(rankForLevel(16)).toBe('Mythic');
  });

  it('returns "LEGENDARY" for level 20', () => {
    expect(rankForLevel(20)).toBe('LEGENDARY');
  });

  it('returns "LEGENDARY" for levels beyond 20', () => {
    expect(rankForLevel(25)).toBe('LEGENDARY');
  });
});

// ─── xpForLevel ─────────────────────────────────────────────────────

describe('xpForLevel', () => {
  it('returns 0 for level 0 (thresholds[0])', () => {
    expect(xpForLevel(0)).toBe(0);
  });

  it('returns 10 for level 1 (thresholds[1])', () => {
    expect(xpForLevel(1)).toBe(10);
  });

  it('returns 25 for level 2 (thresholds[2])', () => {
    expect(xpForLevel(2)).toBe(25);
  });

  it('returns Infinity when level is beyond the thresholds array', () => {
    expect(xpForLevel(20)).toBe(Infinity);
    expect(xpForLevel(100)).toBe(Infinity);
  });

  it('respects custom thresholds', () => {
    expect(xpForLevel(1, { xpThresholds: [0, 50, 100] })).toBe(50);
  });
});
