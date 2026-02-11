import type { CombatParticipant } from '@/types/combat';
import { calculateBattleRewards, checkLevelUp } from '../rewards';

// Helper: create a minimal CombatParticipant
function makeParticipant(overrides: Partial<CombatParticipant> = {}): CombatParticipant {
  return {
    id: crypto.randomUUID(),
    displayName: 'Test',
    team: 'hero',
    stats: { str: 3, spd: 3, tgh: 3, smt: 3 },
    maxHp: 9,
    currentHp: 9,
    spellSlotsMax: 0,
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

// ─── calculateBattleRewards ─────────────────────────────────────────

describe('calculateBattleRewards', () => {
  it('calculates correct XP split for 2 heroes and 3 enemies (2 defeated)', () => {
    const hero1 = makeParticipant({ displayName: 'Hero1', team: 'hero', characterId: 'c1' });
    const hero2 = makeParticipant({ displayName: 'Hero2', team: 'hero', characterId: 'c2' });
    const enemy1 = makeParticipant({
      displayName: 'Goblin', team: 'enemy', monsterId: 'm1', isActive: false, currentHp: 0,
    });
    const enemy2 = makeParticipant({
      displayName: 'Orc', team: 'enemy', monsterId: 'm2', isActive: false, currentHp: 0,
    });
    const enemy3 = makeParticipant({
      displayName: 'Dragon', team: 'enemy', monsterId: 'm3', isActive: true, currentHp: 50,
    });

    const xpMap = new Map([['m1', 10], ['m2', 20], ['m3', 100]]);
    const result = calculateBattleRewards([hero1, hero2, enemy1, enemy2, enemy3], xpMap, 'Forest Battle');

    // Only defeated enemies grant XP: 10 + 20 = 30
    expect(result.totalXp).toBe(30);
    expect(result.xpPerHero).toBe(15); // floor(30 / 2)
    expect(result.heroCount).toBe(2);
    expect(result.encounterName).toBe('Forest Battle');
    expect(result.enemiesDefeated).toHaveLength(2);
    expect(result.enemiesSurvived).toHaveLength(1);
    expect(result.enemiesSurvived[0].name).toBe('Dragon');
    expect(result.allocations).toHaveLength(2);
    expect(result.allocations[0].xpEarned).toBe(15);
    expect(result.allocations[1].xpEarned).toBe(15);
  });

  it('includes isBoss flag on defeated enemies', () => {
    const hero = makeParticipant({ team: 'hero', characterId: 'c1' });
    const boss = makeParticipant({
      displayName: 'Big Boss', team: 'enemy', monsterId: 'b1', isBoss: true, isActive: false,
    });

    const xpMap = new Map([['b1', 50]]);
    const result = calculateBattleRewards([hero, boss], xpMap, 'Boss Fight');

    expect(result.enemiesDefeated[0].isBoss).toBe(true);
    expect(result.enemiesDefeated[0].xpReward).toBe(50);
  });

  it('returns xpPerHero = 0 when there are 0 heroes', () => {
    const enemy = makeParticipant({
      team: 'enemy', monsterId: 'm1', isActive: false,
    });

    const xpMap = new Map([['m1', 10]]);
    const result = calculateBattleRewards([enemy], xpMap, 'No Heroes');

    expect(result.totalXp).toBe(10);
    expect(result.xpPerHero).toBe(0);
    expect(result.heroCount).toBe(0);
    expect(result.allocations).toHaveLength(0);
  });

  it('returns 0 XP for enemies without monsterId', () => {
    const hero = makeParticipant({ team: 'hero', characterId: 'c1' });
    const enemy = makeParticipant({
      team: 'enemy', isActive: false,
      // no monsterId
    });

    const xpMap = new Map<string, number>();
    const result = calculateBattleRewards([hero, enemy], xpMap, 'Unknown Enemies');

    expect(result.totalXp).toBe(0);
    expect(result.xpPerHero).toBe(0);
  });

  it('returns 0 XP when no enemies are defeated', () => {
    const hero = makeParticipant({ team: 'hero', characterId: 'c1' });
    const enemy = makeParticipant({
      team: 'enemy', monsterId: 'm1', isActive: true,
    });

    const xpMap = new Map([['m1', 50]]);
    const result = calculateBattleRewards([hero, enemy], xpMap, 'Retreat');

    expect(result.totalXp).toBe(0);
    expect(result.xpPerHero).toBe(0);
    expect(result.enemiesDefeated).toHaveLength(0);
    expect(result.enemiesSurvived).toHaveLength(1);
  });

  it('floors XP division (odd split)', () => {
    const hero1 = makeParticipant({ team: 'hero', characterId: 'c1' });
    const hero2 = makeParticipant({ team: 'hero', characterId: 'c2' });
    const hero3 = makeParticipant({ team: 'hero', characterId: 'c3' });
    const enemy = makeParticipant({
      team: 'enemy', monsterId: 'm1', isActive: false,
    });

    const xpMap = new Map([['m1', 10]]);
    const result = calculateBattleRewards([hero1, hero2, hero3, enemy], xpMap, 'Split');

    // floor(10 / 3) = 3
    expect(result.xpPerHero).toBe(3);
  });

  it('sets default allocation fields correctly', () => {
    const hero = makeParticipant({ displayName: 'Aria', team: 'hero', characterId: 'c1' });
    const enemy = makeParticipant({ team: 'enemy', monsterId: 'm1', isActive: false });

    const xpMap = new Map([['m1', 20]]);
    const result = calculateBattleRewards([hero, enemy], xpMap, 'Test');

    const alloc = result.allocations[0];
    expect(alloc.characterId).toBe('c1');
    expect(alloc.heroName).toBe('Aria');
    expect(alloc.goldEarned).toBe(0);
    expect(alloc.items).toEqual([]);
    expect(alloc.leveledUp).toBe(false);
    expect(alloc.previousLevel).toBe(0);
    expect(alloc.newLevel).toBe(0);
  });
});

// ─── checkLevelUp ───────────────────────────────────────────────────

describe('checkLevelUp', () => {
  it('returns no level up when XP is below threshold', () => {
    // Level 1, currentXp=0, gain 5. nextThreshold for level 1 = 10. 0+5=5 < 10
    const result = checkLevelUp(0, 1, 5);
    expect(result.newLevel).toBe(1);
    expect(result.levelsGained).toBe(0);
  });

  it('returns single level up', () => {
    // Level 1, currentXp=5, gain 5. newXp=10. threshold[1]=10, 10>=10 => level 2.
    // threshold[2]=25, 10<25 => stop.
    const result = checkLevelUp(5, 1, 5);
    expect(result.newLevel).toBe(2);
    expect(result.levelsGained).toBe(1);
  });

  it('returns multi-level up with large XP gain', () => {
    // Level 1, currentXp=0, gain 50. newXp=50.
    // threshold[1]=10 => level 2. threshold[2]=25 => level 3.
    // threshold[3]=45 => level 4. threshold[4]=70 => 50<70 stop.
    const result = checkLevelUp(0, 1, 50);
    expect(result.newLevel).toBe(4);
    expect(result.levelsGained).toBe(3);
  });

  it('stays at same level when already at max level (beyond thresholds)', () => {
    // xpThresholds has 20 entries (indices 0-19). Level 20 => xpForLevel(20) = Infinity
    const result = checkLevelUp(9999, 20, 1000);
    expect(result.newLevel).toBe(20);
    expect(result.levelsGained).toBe(0);
  });

  it('handles exact threshold match', () => {
    // Level 1, currentXp=0, gain 10. newXp=10. threshold[1]=10 => level 2.
    // threshold[2]=25 => 10<25 stop.
    const result = checkLevelUp(0, 1, 10);
    expect(result.newLevel).toBe(2);
    expect(result.levelsGained).toBe(1);
  });

  it('handles 0 XP gain', () => {
    const result = checkLevelUp(5, 1, 0);
    expect(result.newLevel).toBe(1);
    expect(result.levelsGained).toBe(0);
  });
});
