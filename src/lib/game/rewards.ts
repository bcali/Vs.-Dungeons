import type { CombatParticipant } from '@/types/combat';
import type { BattleRewardsSummary, RewardAllocation } from '@/types/rewards';
import { xpForLevel } from './stats';

export function calculateBattleRewards(
  participants: CombatParticipant[],
  monsterXpMap: Map<string, number>,
  encounterName: string
): BattleRewardsSummary {
  const heroes = participants.filter(p => p.team === 'hero');
  const enemies = participants.filter(p => p.team === 'enemy');
  const defeatedEnemies = enemies.filter(p => !p.isActive);
  const survivedEnemies = enemies.filter(p => p.isActive);

  const totalXp = defeatedEnemies.reduce((sum, enemy) => {
    const xp = enemy.monsterId ? (monsterXpMap.get(enemy.monsterId) ?? 0) : 0;
    return sum + xp;
  }, 0);

  const heroCount = heroes.length;
  const xpPerHero = heroCount > 0 ? Math.floor(totalXp / heroCount) : 0;

  const allocations: RewardAllocation[] = heroes.map(hero => ({
    characterId: hero.characterId!,
    heroName: hero.displayName,
    xpEarned: xpPerHero,
    goldEarned: 0,
    items: [],
    leveledUp: false,
    previousLevel: 0,
    newLevel: 0,
  }));

  return {
    encounterName,
    enemiesDefeated: defeatedEnemies.map(e => ({
      name: e.displayName,
      xpReward: e.monsterId ? (monsterXpMap.get(e.monsterId) ?? 0) : 0,
      isBoss: e.isBoss,
    })),
    enemiesSurvived: survivedEnemies.map(e => ({ name: e.displayName })),
    totalXp,
    xpPerHero,
    heroCount,
    allocations,
  };
}

export function checkLevelUp(
  currentXp: number,
  currentLevel: number,
  xpAmount: number
): { newLevel: number; levelsGained: number } {
  const newXp = currentXp + xpAmount;
  let newLevel = currentLevel;

  while (true) {
    const nextThreshold = xpForLevel(newLevel);
    if (nextThreshold === Infinity || newXp < nextThreshold) break;
    newLevel++;
  }

  return {
    newLevel,
    levelsGained: newLevel - currentLevel,
  };
}
