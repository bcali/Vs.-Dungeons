import type { Stats } from '@/types/game';
import {
  statBonus,
  totalStat,
  totalStats,
  maxHp,
  maxSpellSlots,
  getMov,
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
  const base: Stats = { str: 4, spd: 5, tgh: 3, smt: 3 };
  const gear: Stats = { str: 0, spd: 2, tgh: 1, smt: 0 };

  it('sums each stat individually', () => {
    const result = totalStats(base, gear);
    expect(result).toEqual({ str: 4, spd: 7, tgh: 4, smt: 3 });
  });

  it('returns correct shape with all 4 stat keys', () => {
    const result = totalStats(base, gear);
    expect(Object.keys(result).sort()).toEqual(['smt', 'spd', 'str', 'tgh']);
  });
});

// ─── maxHp ──────────────────────────────────────────────────────────

describe('maxHp', () => {
  it('calculates TGH * 3 + 5 (v1.1)', () => {
    expect(maxHp(5)).toBe(20);
  });

  it('returns 5 for TGH 0', () => {
    expect(maxHp(0)).toBe(5);
  });

  it('returns 14 for TGH 3 (starting hero)', () => {
    expect(maxHp(3)).toBe(14);
  });

  it('returns 17 for TGH 4', () => {
    expect(maxHp(4)).toBe(17);
  });
});

// ─── maxSpellSlots ──────────────────────────────────────────────────

describe('maxSpellSlots', () => {
  it('returns 0 slots at level 1', () => {
    expect(maxSpellSlots(1)).toBe(0);
  });

  it('returns 2 slots at level 2', () => {
    expect(maxSpellSlots(2)).toBe(2);
  });

  it('returns 10 slots at level 20', () => {
    expect(maxSpellSlots(20)).toBe(10);
  });

  it('clamps to max level when beyond progression table', () => {
    expect(maxSpellSlots(25)).toBe(10);
  });
});

// ─── getMov ─────────────────────────────────────────────────────────

describe('getMov', () => {
  it('returns 3 for knight', () => {
    expect(getMov('knight')).toBe(3);
  });

  it('returns 5 for ranger', () => {
    expect(getMov('ranger')).toBe(5);
  });

  it('returns 5 for rogue', () => {
    expect(getMov('rogue')).toBe(5);
  });

  it('returns 4 for healer', () => {
    expect(getMov('healer')).toBe(4);
  });

  it('returns 3 for wizard', () => {
    expect(getMov('wizard')).toBe(3);
  });

  it('returns 3 for inventor', () => {
    expect(getMov('inventor')).toBe(3);
  });
});

// ─── totalStatPointsEarned ──────────────────────────────────────────

describe('totalStatPointsEarned', () => {
  it('returns 2 for level 1 (v1.1: +2 starting)', () => {
    expect(totalStatPointsEarned(1)).toBe(2);
  });

  it('returns sum of first 5 entries for level 5', () => {
    // [2, 1, 1, 1, 2] = 7
    expect(totalStatPointsEarned(5)).toBe(7);
  });

  it('returns 0 for level 0', () => {
    expect(totalStatPointsEarned(0)).toBe(0);
  });

  it('clamps to array length when level exceeds it', () => {
    // All 20 entries sum: 2+1+1+1+2+1+1+2+1+2+1+2+1+1+2+1+1+2+1+3 = 29
    expect(totalStatPointsEarned(20)).toBe(29);
    expect(totalStatPointsEarned(25)).toBe(29);
  });
});

// ─── totalStatPointsSpent ───────────────────────────────────────────

describe('totalStatPointsSpent', () => {
  it('returns 0 when all stats are at base (3)', () => {
    const stats: Stats = { str: 3, spd: 3, tgh: 3, smt: 3 };
    expect(totalStatPointsSpent(stats)).toBe(0);
  });

  it('returns total points invested above base', () => {
    const stats: Stats = { str: 5, spd: 4, tgh: 3, smt: 3 };
    // (5-3)+(4-3) = 3
    expect(totalStatPointsSpent(stats)).toBe(3);
  });

  it('handles negative bonus (below base) correctly', () => {
    const stats: Stats = { str: 2, spd: 3, tgh: 3, smt: 3 };
    // (2-3) = -1
    expect(totalStatPointsSpent(stats)).toBe(-1);
  });

  it('respects custom statBaseValue', () => {
    const stats: Stats = { str: 5, spd: 5, tgh: 5, smt: 5 };
    expect(totalStatPointsSpent(stats, { statBaseValue: 5 })).toBe(0);
  });
});

// ─── meleeDefenseTarget ─────────────────────────────────────────────

describe('meleeDefenseTarget', () => {
  it('returns TGH + 8', () => {
    expect(meleeDefenseTarget(3)).toBe(11);
    expect(meleeDefenseTarget(5)).toBe(13);
    expect(meleeDefenseTarget(0)).toBe(8);
  });
});

// ─── rangedDefenseTarget ────────────────────────────────────────────

describe('rangedDefenseTarget', () => {
  it('returns SPD + 8', () => {
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
