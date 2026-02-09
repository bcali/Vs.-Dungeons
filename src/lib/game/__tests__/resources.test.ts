import {
  passiveRegen,
  rageGain,
  applyRegen,
  spendResource,
  shortRestRestore,
  longRestRestore,
} from '../resources';

// ─── passiveRegen ───────────────────────────────────────────────────

describe('passiveRegen', () => {
  it('returns 20 for mana (default manaRegenPerTurn)', () => {
    expect(passiveRegen('mana')).toBe(20);
  });

  it('returns 20 for energy (default energyRegenPerTurn)', () => {
    expect(passiveRegen('energy')).toBe(20);
  });

  it('returns 0 for rage (no passive regen)', () => {
    expect(passiveRegen('rage')).toBe(0);
  });

  it('respects custom config', () => {
    expect(passiveRegen('mana', { manaRegenPerTurn: 30, energyRegenPerTurn: 15 })).toBe(30);
    expect(passiveRegen('energy', { manaRegenPerTurn: 30, energyRegenPerTurn: 15 })).toBe(15);
  });
});

// ─── rageGain ───────────────────────────────────────────────────────

describe('rageGain', () => {
  it('returns 15 for hit_taken', () => {
    expect(rageGain('hit_taken')).toBe(15);
  });

  it('returns 10 for melee_hit', () => {
    expect(rageGain('melee_hit')).toBe(10);
  });

  it('returns 25 for crit_taken', () => {
    expect(rageGain('crit_taken')).toBe(25);
  });

  it('returns 20 for ally_ko', () => {
    expect(rageGain('ally_ko')).toBe(20);
  });

  it('respects custom config', () => {
    const config = {
      rageOnHitTaken: 10,
      rageOnMeleeHit: 5,
      rageOnCritTaken: 20,
      rageOnAllyKo: 15,
    };
    expect(rageGain('hit_taken', config)).toBe(10);
    expect(rageGain('melee_hit', config)).toBe(5);
  });
});

// ─── applyRegen ─────────────────────────────────────────────────────

describe('applyRegen', () => {
  it('adds mana regen and stays below max', () => {
    // 40 + 20 = 60, max = 75
    expect(applyRegen(40, 75, 'mana')).toBe(60);
  });

  it('clamps energy regen to max', () => {
    // 90 + 20 = 110, clamped to 100
    expect(applyRegen(90, 100, 'energy')).toBe(100);
  });

  it('does not change rage (0 passive regen)', () => {
    expect(applyRegen(50, 100, 'rage')).toBe(50);
  });

  it('handles already-at-max resource', () => {
    expect(applyRegen(100, 100, 'energy')).toBe(100);
  });
});

// ─── spendResource ──────────────────────────────────────────────────

describe('spendResource', () => {
  it('subtracts cost from current', () => {
    expect(spendResource(50, 30)).toBe(20);
  });

  it('returns null when insufficient resource', () => {
    expect(spendResource(10, 30)).toBeNull();
  });

  it('returns 0 when cost exactly equals current', () => {
    expect(spendResource(30, 30)).toBe(0);
  });

  it('handles 0 cost', () => {
    expect(spendResource(50, 0)).toBe(50);
  });
});

// ─── shortRestRestore ───────────────────────────────────────────────

describe('shortRestRestore', () => {
  it('restores mana by 30 (default shortRestResourceRestore)', () => {
    // 40 + 30 = 70, max 75
    expect(shortRestRestore(40, 75, 'mana')).toBe(70);
  });

  it('clamps mana restore to max', () => {
    // 60 + 30 = 90, clamped to 75
    expect(shortRestRestore(60, 75, 'mana')).toBe(75);
  });

  it('restores energy similarly', () => {
    // 50 + 30 = 80, max 100
    expect(shortRestRestore(50, 100, 'energy')).toBe(80);
  });

  it('resets rage to 0 on short rest', () => {
    expect(shortRestRestore(50, 100, 'rage')).toBe(0);
  });

  it('respects custom restore amount', () => {
    expect(shortRestRestore(40, 75, 'mana', { shortRestResourceRestore: 50 })).toBe(75);
  });
});

// ─── longRestRestore ────────────────────────────────────────────────

describe('longRestRestore', () => {
  it('restores mana to max', () => {
    expect(longRestRestore(75, 'mana')).toBe(75);
  });

  it('restores energy to max', () => {
    expect(longRestRestore(100, 'energy')).toBe(100);
  });

  it('resets rage to 0 on long rest', () => {
    expect(longRestRestore(100, 'rage')).toBe(0);
  });
});
