import type { ClaudeActionResponse, CombatParticipant } from '@/types/combat';
import { validateCombatResponse } from '../validate-response';

// Helper: create a minimal CombatParticipant
function makeParticipant(overrides: Partial<CombatParticipant> = {}): CombatParticipant {
  return {
    id: 'p1',
    displayName: 'Hero',
    team: 'hero',
    stats: { str: 3, spd: 3, tgh: 3, smt: 3 },
    maxHp: 15,
    currentHp: 10,
    spellSlotsMax: 4,
    spellSlotsUsed: 0,
    mov: 3,
    initiativeRoll: 10,
    isActive: true,
    isDefending: false,
    statusEffects: [],
    isBoss: false,
    ...overrides,
  };
}

// Helper: create a minimal ClaudeActionResponse
function makeResponse(overrides: Partial<ClaudeActionResponse> = {}): ClaudeActionResponse {
  return {
    understood: true,
    action: {
      type: 'melee_attack',
      name: 'Sword Slash',
      actorId: 'p1',
      targetIds: ['p2'],
      roll: 15,
      targetNumber: 11,
      hit: true,
      isCritical: false,
      isCriticalMiss: false,
    },
    results: [
      {
        participantId: 'p2',
        hpChange: -5,
        slotsUsed: 0,
        newEffects: [],
        removedEffects: [],
      },
    ],
    narration: 'The hero strikes!',
    narrationShort: 'Hit!',
    turnComplete: true,
    ...overrides,
  };
}

const defaultParticipants: CombatParticipant[] = [
  makeParticipant({ id: 'p1', displayName: 'Hero', team: 'hero', maxHp: 15, currentHp: 10, spellSlotsMax: 4, spellSlotsUsed: 0 }),
  makeParticipant({ id: 'p2', displayName: 'Goblin', team: 'enemy', maxHp: 9, currentHp: 9, spellSlotsMax: 0, spellSlotsUsed: 0 }),
];

// ─── validateCombatResponse ─────────────────────────────────────────

describe('validateCombatResponse', () => {
  it('returns empty error array for a valid response', () => {
    const response = makeResponse();
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toEqual([]);
  });

  it('returns error for unknown actor ID', () => {
    const response = makeResponse({
      action: {
        ...makeResponse().action,
        actorId: 'unknown-actor',
      },
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('Unknown actor'));
    expect(errors).toContainEqual(expect.stringContaining('unknown-actor'));
  });

  it('returns error for unknown target ID', () => {
    const response = makeResponse({
      action: {
        ...makeResponse().action,
        targetIds: ['unknown-target'],
      },
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('Unknown target'));
    expect(errors).toContainEqual(expect.stringContaining('unknown-target'));
  });

  it('returns error when HP would exceed max after healing', () => {
    // Goblin: currentHp=9, maxHp=9. hpChange=+5 => 14 > 9
    const response = makeResponse({
      results: [
        {
          participantId: 'p2',
          hpChange: 5,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('HP healing overcap'));
    expect(errors).toContainEqual(expect.stringContaining('Goblin'));
  });

  it('does not error when healing stays within max HP', () => {
    // Hero: currentHp=10, maxHp=15. hpChange=+5 => 15 = max, OK
    const response = makeResponse({
      results: [
        {
          participantId: 'p1',
          hpChange: 5,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toEqual([]);
  });

  it('returns error when spell slots would exceed max', () => {
    // Hero: spellSlotsUsed=0, spellSlotsMax=4. slotsUsed=5 => 5 > 4
    const response = makeResponse({
      results: [
        {
          participantId: 'p1',
          hpChange: 0,
          slotsUsed: 5,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('Spell slots would exceed max'));
  });

  it('does not error when spell slot spend is within budget', () => {
    // Hero: spellSlotsUsed=0, spellSlotsMax=4. slotsUsed=2 => 2 <= 4, OK
    const response = makeResponse({
      results: [
        {
          participantId: 'p1',
          hpChange: 0,
          slotsUsed: 2,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toEqual([]);
  });

  it('returns error when damage exceeds 50', () => {
    // hpChange < -50 triggers the check
    const response = makeResponse({
      results: [
        {
          participantId: 'p2',
          hpChange: -51,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('High damage'));
    expect(errors).toContainEqual(expect.stringContaining('Goblin'));
  });

  it('does not flag exactly -50 damage', () => {
    const response = makeResponse({
      results: [
        {
          participantId: 'p2',
          hpChange: -50,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    // -50 is NOT < -50, so no high damage warning
    expect(errors.some(e => e.includes('High damage'))).toBe(false);
  });

  it('returns error for unknown participant in results', () => {
    const response = makeResponse({
      results: [
        {
          participantId: 'nonexistent',
          hpChange: -5,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    expect(errors).toContainEqual(expect.stringContaining('Unknown participant in results'));
  });

  it('returns multiple errors at once', () => {
    const response = makeResponse({
      action: {
        ...makeResponse().action,
        actorId: 'unknown-actor',
        targetIds: ['unknown-target'],
      },
      results: [
        {
          participantId: 'p2',
          hpChange: -60,
          slotsUsed: 0,
          newEffects: [],
          removedEffects: [],
        },
        {
          participantId: 'p1',
          hpChange: 0,
          slotsUsed: 5,
          newEffects: [],
          removedEffects: [],
        },
      ],
    });
    const errors = validateCombatResponse(response, defaultParticipants);
    // Should have at least: unknown actor, unknown target, high damage, spell slots exceed
    expect(errors.length).toBeGreaterThanOrEqual(4);
    expect(errors.some(e => e.includes('Unknown actor'))).toBe(true);
    expect(errors.some(e => e.includes('Unknown target'))).toBe(true);
    expect(errors.some(e => e.includes('High damage'))).toBe(true);
    expect(errors.some(e => e.includes('Spell slots would exceed max'))).toBe(true);
  });
});
