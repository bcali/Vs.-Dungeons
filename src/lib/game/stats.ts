// Stat calculations — bonuses, HP, spell slots, defense, MOV
// Core rules: 4 stats (STR, SPD, TGH, SMT), spell slots, nat 20 crits

import type { Stats, Profession } from '@/types/game';
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

/** Calculate all total stats (base + gear) */
export function totalStats(base: Stats, gear: Partial<Stats>): Stats {
  return {
    str: base.str + (gear.str ?? 0),
    spd: base.spd + (gear.spd ?? 0),
    tgh: base.tgh + (gear.tgh ?? 0),
    smt: base.smt + (gear.smt ?? 0),
  };
}

/** Calculate max HP: TGH * 3 + 5 (v1.1 rebalance) */
export function maxHp(totalTgh: number): number {
  return totalTgh * 3 + 5;
}

/** Calculate max spell slots for a given level (core rules progression) */
export function maxSpellSlots(
  level: number,
  config?: Pick<GameConfig, 'spellSlotProgression'>
): number {
  const progression = config?.spellSlotProgression ?? DEFAULT_GAME_CONFIG.spellSlotProgression;
  const idx = Math.min(level, progression.length) - 1;
  if (idx < 0) return 0;
  return progression[idx];
}

/** Get movement speed for a profession */
export function getMov(
  profession: Profession,
  config?: Pick<GameConfig, 'movByProfession'>
): number {
  const table = config?.movByProfession ?? DEFAULT_GAME_CONFIG.movByProfession;
  return table[profession];
}

/** Calculate melee defense target: TGH + 8 */
export function meleeDefenseTarget(targetTgh: number): number {
  return targetTgh + 8;
}

/** Calculate ranged defense target: SPD + 8 */
export function rangedDefenseTarget(targetSpd: number): number {
  return targetSpd + 8;
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
  return thresholds[level];
}
