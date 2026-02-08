// Stat calculations — bonuses, HP, mana pool, crit range

import type { Stats, StatKey, ResourceType } from '@/types/game';
import type { GameConfig } from '@/types/config';
import { DEFAULT_GAME_CONFIG } from '@/types/config';

/** Calculate stat bonus: stat - base (default: stat - 3) */
export function statBonus(statValue: number, config?: Pick<GameConfig, 'statBaseValue'>): number {
  return statValue - (config?.statBaseValue ?? DEFAULT_GAME_CONFIG.statBaseValue);
}

/** Calculate total stat (base + gear bonus) */
export function totalStat(base: number, gearBonus: number): number {
  return base + gearBonus;
}

/** Calculate all total stats */
export function totalStats(base: Stats, gear: Stats): Stats {
  return {
    con: base.con + gear.con,
    str: base.str + gear.str,
    agi: base.agi + gear.agi,
    mna: base.mna + gear.mna,
    int: base.int + gear.int,
    lck: base.lck + gear.lck,
  };
}

/** Calculate max HP: CON * 3 (default) */
export function maxHp(totalCon: number, config?: Pick<GameConfig, 'hpFormula'>): number {
  // Formula is always "CON * N" for now
  const multiplier = 3; // extracted from config.hpFormula if needed
  return totalCon * multiplier;
}

/** Calculate max resource pool */
export function maxResource(
  resourceType: ResourceType | null,
  totalMna: number,
  config?: Pick<GameConfig, 'energyPoolMax' | 'ragePoolMax' | 'manaPoolFormula'>
): number {
  switch (resourceType) {
    case 'energy':
      return config?.energyPoolMax ?? DEFAULT_GAME_CONFIG.energyPoolMax;
    case 'rage':
      return config?.ragePoolMax ?? DEFAULT_GAME_CONFIG.ragePoolMax;
    case 'mana':
      return totalMna * 15; // MNA * 15
    default:
      return 0;
  }
}

/** Calculate crit range based on total LCK */
export function critRange(
  totalLck: number,
  config?: Pick<GameConfig, 'baseCritValue' | 'luckCritThresholds'>
): number {
  const thresholds = config?.luckCritThresholds ?? DEFAULT_GAME_CONFIG.luckCritThresholds;
  const base = config?.baseCritValue ?? DEFAULT_GAME_CONFIG.baseCritValue;

  // Check thresholds from highest to lowest
  const sortedKeys = Object.keys(thresholds)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of sortedKeys) {
    if (totalLck >= threshold) {
      return thresholds[String(threshold)];
    }
  }
  return base;
}

/** Calculate total stat points earned by a given level */
export function totalStatPointsEarned(
  level: number,
  config?: Pick<GameConfig, 'statPointsPerLevel'>
): number {
  const pointsPerLevel = config?.statPointsPerLevel ?? DEFAULT_GAME_CONFIG.statPointsPerLevel;
  let total = 0;
  for (let i = 0; i < Math.min(level, pointsPerLevel.length); i++) {
    total += pointsPerLevel[i];
  }
  return total;
}

/** Calculate total stat points spent */
export function totalStatPointsSpent(
  stats: Stats,
  config?: Pick<GameConfig, 'statBaseValue'>
): number {
  const base = config?.statBaseValue ?? DEFAULT_GAME_CONFIG.statBaseValue;
  return Object.values(stats).reduce((sum, val) => sum + (val - base), 0);
}

/** Calculate melee defense target number */
export function meleeDefenseTarget(targetStr: number): number {
  return targetStr + 8;
}

/** Calculate ranged defense target number */
export function rangedDefenseTarget(targetAgi: number): number {
  return targetAgi + 8;
}

/** Get the rank name for a given level */
export function rankForLevel(level: number): string {
  if (level >= 20) return 'LEGENDARY';
  if (level >= 16) return 'Mythic';
  if (level >= 13) return 'Legend';
  if (level >= 10) return 'Hero';
  if (level >= 8) return 'Champion';
  if (level >= 5) return 'Veteran';
  if (level >= 3) return 'Adventurer';
  if (level >= 2) return 'Apprentice';
  return 'Starting Hero';
}

/** Get XP needed for next level */
export function xpForLevel(
  level: number,
  config?: Pick<GameConfig, 'xpThresholds'>
): number {
  const thresholds = config?.xpThresholds ?? DEFAULT_GAME_CONFIG.xpThresholds;
  if (level >= thresholds.length) return Infinity;
  return thresholds[level]; // level is 1-indexed, array is next-level XP
}
