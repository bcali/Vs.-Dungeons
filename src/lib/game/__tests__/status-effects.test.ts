import type { ActiveStatusEffect, EffectCategory } from '@/types/combat';
import {
  createEffect,
  tickEffects,
  isStunned,
  isSilenced,
  applyEffect,
  removeEffect,
  effectCategoryColor,
} from '../status-effects';

// Helper: create a minimal ActiveStatusEffect for testing
function makeEffect(overrides: Partial<ActiveStatusEffect> = {}): ActiveStatusEffect {
  return {
    id: crypto.randomUUID(),
    effectType: 'test_effect',
    category: 'buff',
    remainingTurns: 3,
    value: {},
    iconName: 'Zap',
    displayName: 'Test Effect',
    ...overrides,
  };
}

// ─── createEffect ───────────────────────────────────────────────────

describe('createEffect', () => {
  it('returns an effect with all fields populated', () => {
    const effect = createEffect('burning', 'dot', 'Burning', 'Flame', 3, { damage_per_turn: 5 }, 'source-1');
    expect(effect.effectType).toBe('burning');
    expect(effect.category).toBe('dot');
    expect(effect.displayName).toBe('Burning');
    expect(effect.iconName).toBe('Flame');
    expect(effect.remainingTurns).toBe(3);
    expect(effect.value).toEqual({ damage_per_turn: 5 });
    expect(effect.sourceParticipantId).toBe('source-1');
    expect(effect.id).toBeDefined();
  });

  it('generates a unique UUID for id', () => {
    const a = createEffect('buff_a', 'buff', 'A', 'Shield', 2);
    const b = createEffect('buff_b', 'buff', 'B', 'Shield', 2);
    expect(a.id).not.toBe(b.id);
  });

  it('defaults value to empty object', () => {
    const effect = createEffect('shield', 'buff', 'Shield', 'Shield', null);
    expect(effect.value).toEqual({});
  });

  it('uses null for permanent duration', () => {
    const effect = createEffect('aura', 'buff', 'Aura', 'Sun', null);
    expect(effect.remainingTurns).toBeNull();
  });
});

// ─── tickEffects ────────────────────────────────────────────────────

describe('tickEffects', () => {
  it('keeps permanent effects (remainingTurns === null)', () => {
    const permanent = makeEffect({ remainingTurns: null });
    const result = tickEffects([permanent]);
    expect(result.updated).toHaveLength(1);
    expect(result.expired).toHaveLength(0);
    expect(result.updated[0].id).toBe(permanent.id);
  });

  it('decrements timed effects', () => {
    const effect = makeEffect({ remainingTurns: 3 });
    const result = tickEffects([effect]);
    expect(result.updated).toHaveLength(1);
    expect(result.updated[0].remainingTurns).toBe(2);
    expect(result.expired).toHaveLength(0);
  });

  it('expires effects when remainingTurns reaches 0', () => {
    const effect = makeEffect({ remainingTurns: 1 });
    const result = tickEffects([effect]);
    expect(result.updated).toHaveLength(0);
    expect(result.expired).toContain(effect.id);
  });

  it('accumulates DoT damage', () => {
    const dot1 = makeEffect({ category: 'dot', value: { damage_per_turn: 5 }, remainingTurns: 2 });
    const dot2 = makeEffect({ category: 'dot', value: { damage_per_turn: 3 }, remainingTurns: 2 });
    const result = tickEffects([dot1, dot2]);
    expect(result.dotDamage).toBe(8);
  });

  it('accumulates HoT healing', () => {
    const hot1 = makeEffect({ category: 'hot', value: { healing_per_turn: 4 }, remainingTurns: 2 });
    const hot2 = makeEffect({ category: 'hot', value: { healing_per_turn: 6 }, remainingTurns: 2 });
    const result = tickEffects([hot1, hot2]);
    expect(result.hotHealing).toBe(10);
  });

  it('returns 0 for dotDamage and hotHealing when no DoT/HoT effects', () => {
    const buff = makeEffect({ category: 'buff', remainingTurns: 2 });
    const result = tickEffects([buff]);
    expect(result.dotDamage).toBe(0);
    expect(result.hotHealing).toBe(0);
  });

  it('handles mix of permanent, timed, and expired effects', () => {
    const permanent = makeEffect({ remainingTurns: null, effectType: 'perm' });
    const timed = makeEffect({ remainingTurns: 3, effectType: 'timed' });
    const expiring = makeEffect({ remainingTurns: 1, effectType: 'expiring' });
    const result = tickEffects([permanent, timed, expiring]);
    expect(result.updated).toHaveLength(2);
    expect(result.expired).toHaveLength(1);
    expect(result.expired[0]).toBe(expiring.id);
  });
});

// ─── isStunned ──────────────────────────────────────────────────────

describe('isStunned', () => {
  it('returns true for "stunned" cc effect', () => {
    expect(isStunned([makeEffect({ category: 'cc', effectType: 'stunned' })])).toBe(true);
  });

  it('returns true for "frozen" cc effect', () => {
    expect(isStunned([makeEffect({ category: 'cc', effectType: 'frozen' })])).toBe(true);
  });

  it('returns true for "slept" cc effect', () => {
    expect(isStunned([makeEffect({ category: 'cc', effectType: 'slept' })])).toBe(true);
  });

  it('returns true for "knocked_down" cc effect', () => {
    expect(isStunned([makeEffect({ category: 'cc', effectType: 'knocked_down' })])).toBe(true);
  });

  it('returns false for non-stunning cc effects (e.g. silenced)', () => {
    expect(isStunned([makeEffect({ category: 'cc', effectType: 'silenced' })])).toBe(false);
  });

  it('returns false for non-cc effects with stun-like names', () => {
    expect(isStunned([makeEffect({ category: 'debuff', effectType: 'stunned' })])).toBe(false);
  });

  it('returns false for empty effects array', () => {
    expect(isStunned([])).toBe(false);
  });
});

// ─── isSilenced ─────────────────────────────────────────────────────

describe('isSilenced', () => {
  it('returns true when silenced effect is present', () => {
    expect(isSilenced([makeEffect({ effectType: 'silenced' })])).toBe(true);
  });

  it('returns true when silenced is among multiple effects', () => {
    expect(isSilenced([
      makeEffect({ effectType: 'burning' }),
      makeEffect({ effectType: 'silenced' }),
    ])).toBe(true);
  });

  it('returns false when no silenced effect', () => {
    expect(isSilenced([makeEffect({ effectType: 'stunned' })])).toBe(false);
  });

  it('returns false for empty effects', () => {
    expect(isSilenced([])).toBe(false);
  });
});

// ─── applyEffect ────────────────────────────────────────────────────

describe('applyEffect', () => {
  it('appends a new effect type', () => {
    const existing = [makeEffect({ effectType: 'burning' })];
    const newEff = makeEffect({ effectType: 'frozen' });
    const result = applyEffect(existing, newEff);
    expect(result).toHaveLength(2);
    expect(result[1].effectType).toBe('frozen');
  });

  it('refreshes duration on non-stackable duplicate', () => {
    const existing = [makeEffect({ effectType: 'burning', remainingTurns: 1 })];
    const newEff = makeEffect({ effectType: 'burning', remainingTurns: 3 });
    const result = applyEffect(existing, newEff, false);
    expect(result).toHaveLength(1);
    expect(result[0].remainingTurns).toBe(3);
  });

  it('stacks up to 3 for stackable effects', () => {
    const existing = [
      makeEffect({ effectType: 'bleed', remainingTurns: 2 }),
    ];
    const newEff = makeEffect({ effectType: 'bleed', remainingTurns: 3 });
    const result = applyEffect(existing, newEff, true);
    // Now 2 stacks
    expect(result).toHaveLength(2);
  });

  it('appends second stack when at 1 (stackable)', () => {
    const first = makeEffect({ effectType: 'poison', remainingTurns: 2 });
    const second = makeEffect({ effectType: 'poison', remainingTurns: 3 });
    const third = makeEffect({ effectType: 'poison', remainingTurns: 3 });
    let result = applyEffect([first], second, true);
    expect(result).toHaveLength(2);
    result = applyEffect(result, third, true);
    expect(result).toHaveLength(3);
  });

  it('refreshes oldest when at max stacks (3)', () => {
    const s1 = makeEffect({ effectType: 'bleed', remainingTurns: 1 });
    const s2 = makeEffect({ effectType: 'bleed', remainingTurns: 2 });
    const s3 = makeEffect({ effectType: 'bleed', remainingTurns: 3 });
    const existing = [s1, s2, s3];
    const newEff = makeEffect({ effectType: 'bleed', remainingTurns: 5 });
    const result = applyEffect(existing, newEff, true);
    // Same count, first one refreshed
    expect(result).toHaveLength(3);
    expect(result[0].remainingTurns).toBe(5);
  });
});

// ─── removeEffect ───────────────────────────────────────────────────

describe('removeEffect', () => {
  it('removes effect by id', () => {
    const a = makeEffect({ effectType: 'a' });
    const b = makeEffect({ effectType: 'b' });
    const result = removeEffect([a, b], a.id);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(b.id);
  });

  it('returns same list if id not found', () => {
    const a = makeEffect({ effectType: 'a' });
    const result = removeEffect([a], 'nonexistent-id');
    expect(result).toHaveLength(1);
  });

  it('handles empty array', () => {
    expect(removeEffect([], 'any-id')).toHaveLength(0);
  });
});

// ─── effectCategoryColor ────────────────────────────────────────────

describe('effectCategoryColor', () => {
  it('returns green for buff', () => {
    expect(effectCategoryColor('buff')).toBe('#22c55e');
  });

  it('returns red for debuff', () => {
    expect(effectCategoryColor('debuff')).toBe('#ef4444');
  });

  it('returns purple for cc', () => {
    expect(effectCategoryColor('cc')).toBe('#a855f7');
  });

  it('returns orange for dot', () => {
    expect(effectCategoryColor('dot')).toBe('#f97316');
  });

  it('returns teal for hot', () => {
    expect(effectCategoryColor('hot')).toBe('#14b8a6');
  });
});
