// Combat resolution helpers
// Core rules: 4 stats, nat 20 crits, TGH+8 melee defense, SPD+8 ranged defense

import { statBonus } from './stats';
import type { Stats } from '@/types/game';

/** Roll initiative: d20 + SPD bonus */
export function rollInitiative(spd: number): number {
  const roll = Math.floor(Math.random() * 20) + 1;
  return roll + statBonus(spd);
}

/** Check if a roll is a critical hit (nat 20 only) */
export function isCriticalHit(roll: number): boolean {
  return roll === 20;
}

/** Check if a roll is a critical miss */
export function isCriticalMiss(roll: number): boolean {
  return roll === 1;
}

/** Calculate melee attack target number: TGH + 8 */
export function meleeTarget(targetStats: Stats): number {
  return targetStats.tgh + 8;
}

/** Calculate ranged attack target number: SPD + 8 */
export function rangedTarget(targetStats: Stats): number {
  return targetStats.spd + 8;
}

/** Check if an attack hits (roll + bonus >= target) */
export function doesHit(roll: number, attackerBonus: number, targetNumber: number, defendBonus: number = 0): boolean {
  if (roll === 20) return true; // Nat 20 always hits
  if (roll === 1) return false; // Nat 1 always misses
  return (roll + attackerBonus) >= (targetNumber + defendBonus);
}

/** Calculate melee damage (attacker STR, doubled on crit) */
export function meleeDamage(attackerStr: number, isCrit: boolean): number {
  return isCrit ? attackerStr * 2 : attackerStr;
}

/** Apply damage, clamping to 0 minimum */
export function applyDamage(currentHp: number, damage: number): number {
  return Math.max(0, currentHp - damage);
}

/** Apply healing, clamping to max HP */
export function applyHealing(currentHp: number, healing: number, maxHp: number): number {
  return Math.min(maxHp, currentHp + healing);
}

/** Check if a combatant is knocked out */
export function isKnockedOut(currentHp: number): boolean {
  return currentHp <= 0;
}

/** Revive a knocked out combatant (1 HP by default) */
export function reviveHp(healAmount: number = 1): number {
  return Math.max(1, healAmount);
}
