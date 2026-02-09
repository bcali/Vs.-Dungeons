import type { Stats } from '@/types/game';
import {
  rollInitiative,
  isCriticalHit,
  isCriticalMiss,
  meleeTarget,
  rangedTarget,
  doesHit,
  meleeDamage,
  applyDamage,
  applyHealing,
  isKnockedOut,
  reviveHp,
} from '../combat';

// Helper: create a Stats object with defaults
function makeStats(overrides: Partial<Stats> = {}): Stats {
  return { con: 3, str: 3, agi: 3, mna: 3, int: 3, lck: 3, ...overrides };
}

// ─── rollInitiative ─────────────────────────────────────────────────

describe('rollInitiative', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns roll (1) + AGI bonus when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // floor(0*20)+1 = 1
    // AGI 3 => bonus 0 (3-3=0), so result = 1 + 0 = 1
    expect(rollInitiative(3)).toBe(1);
  });

  it('returns roll (20) + AGI bonus when Math.random returns 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95); // floor(0.95*20)+1 = 20
    // AGI 5 => bonus 2 (5-3=2), so result = 20 + 2 = 22
    expect(rollInitiative(5)).toBe(22);
  });

  it('adds negative bonus for low AGI', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // floor(0.5*20)+1 = 11
    // AGI 1 => bonus -2 (1-3=-2), so result = 11 + (-2) = 9
    expect(rollInitiative(1)).toBe(9);
  });
});

// ─── isCriticalHit ──────────────────────────────────────────────────

describe('isCriticalHit', () => {
  it('returns true when roll equals critRange', () => {
    expect(isCriticalHit(20, 20)).toBe(true);
  });

  it('returns true when roll exceeds critRange', () => {
    expect(isCriticalHit(20, 19)).toBe(true);
  });

  it('returns false when roll is below critRange', () => {
    expect(isCriticalHit(19, 20)).toBe(false);
  });

  it('returns true for expanded crit range', () => {
    expect(isCriticalHit(18, 18)).toBe(true);
  });
});

// ─── isCriticalMiss ─────────────────────────────────────────────────

describe('isCriticalMiss', () => {
  it('returns true for roll 1', () => {
    expect(isCriticalMiss(1)).toBe(true);
  });

  it('returns false for roll 2', () => {
    expect(isCriticalMiss(2)).toBe(false);
  });

  it('returns false for roll 20', () => {
    expect(isCriticalMiss(20)).toBe(false);
  });
});

// ─── meleeTarget ────────────────────────────────────────────────────

describe('meleeTarget', () => {
  it('returns STR + 8', () => {
    expect(meleeTarget(makeStats({ str: 5 }))).toBe(13);
  });

  it('handles base STR', () => {
    expect(meleeTarget(makeStats())).toBe(11);
  });
});

// ─── rangedTarget ───────────────────────────────────────────────────

describe('rangedTarget', () => {
  it('returns AGI + 8', () => {
    expect(rangedTarget(makeStats({ agi: 5 }))).toBe(13);
  });

  it('handles base AGI', () => {
    expect(rangedTarget(makeStats())).toBe(11);
  });
});

// ─── doesHit ────────────────────────────────────────────────────────

describe('doesHit', () => {
  it('nat 20 always hits regardless of bonus and target', () => {
    expect(doesHit(20, -10, 100)).toBe(true);
  });

  it('nat 1 always misses regardless of bonus', () => {
    expect(doesHit(1, 100, 1)).toBe(false);
  });

  it('hits when roll + bonus equals target', () => {
    // 10 + 2 = 12 >= 12
    expect(doesHit(10, 2, 12)).toBe(true);
  });

  it('hits when roll + bonus exceeds target', () => {
    // 10 + 2 = 12 >= 11
    expect(doesHit(10, 2, 11)).toBe(true);
  });

  it('misses when roll + bonus is below target', () => {
    // 10 + 1 = 11 < 13
    expect(doesHit(10, 1, 13)).toBe(false);
  });

  it('accounts for defend bonus', () => {
    // 10 + 2 = 12 >= 11 + 4 = 15 => false
    expect(doesHit(10, 2, 11, 4)).toBe(false);
    // 10 + 2 = 12 >= 8 + 4 = 12 => true
    expect(doesHit(10, 2, 8, 4)).toBe(true);
  });
});

// ─── meleeDamage ────────────────────────────────────────────────────

describe('meleeDamage', () => {
  it('returns STR for normal hit', () => {
    expect(meleeDamage(5, false)).toBe(5);
  });

  it('returns STR * 2 for critical hit', () => {
    expect(meleeDamage(5, true)).toBe(10);
  });

  it('returns 0 for 0 STR normal hit', () => {
    expect(meleeDamage(0, false)).toBe(0);
  });
});

// ─── applyDamage ────────────────────────────────────────────────────

describe('applyDamage', () => {
  it('subtracts damage from current HP', () => {
    expect(applyDamage(10, 3)).toBe(7);
  });

  it('clamps to 0 when damage exceeds HP', () => {
    expect(applyDamage(2, 5)).toBe(0);
  });

  it('returns 0 for exact kill', () => {
    expect(applyDamage(5, 5)).toBe(0);
  });

  it('handles 0 damage', () => {
    expect(applyDamage(10, 0)).toBe(10);
  });
});

// ─── applyHealing ───────────────────────────────────────────────────

describe('applyHealing', () => {
  it('adds healing to current HP', () => {
    expect(applyHealing(5, 3, 15)).toBe(8);
  });

  it('clamps to max HP', () => {
    expect(applyHealing(13, 5, 15)).toBe(15);
  });

  it('handles exact max', () => {
    expect(applyHealing(12, 3, 15)).toBe(15);
  });

  it('handles healing when already at max', () => {
    expect(applyHealing(15, 5, 15)).toBe(15);
  });
});

// ─── isKnockedOut ───────────────────────────────────────────────────

describe('isKnockedOut', () => {
  it('returns true for 0 HP', () => {
    expect(isKnockedOut(0)).toBe(true);
  });

  it('returns true for negative HP', () => {
    expect(isKnockedOut(-1)).toBe(true);
  });

  it('returns false for positive HP', () => {
    expect(isKnockedOut(1)).toBe(false);
  });
});

// ─── reviveHp ───────────────────────────────────────────────────────

describe('reviveHp', () => {
  it('returns 1 HP by default', () => {
    expect(reviveHp()).toBe(1);
  });

  it('returns specified heal amount', () => {
    expect(reviveHp(5)).toBe(5);
  });

  it('returns at least 1 even if 0 is passed', () => {
    expect(reviveHp(0)).toBe(1);
  });

  it('returns at least 1 even if negative is passed', () => {
    expect(reviveHp(-3)).toBe(1);
  });
});
