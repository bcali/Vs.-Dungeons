// Combat resolution helpers

import { statBonus } from './stats';
import type { Stats } from '@/types/game';

/** Roll initiative: d20 + AGI bonus */
export function rollInitiative(agi: number): number {
  const roll = Math.floor(Math.random() * 20) + 1;
  return roll + statBonus(agi);
}

/** Check if a roll is a critical hit */
export function isCriticalHit(roll: number, critRange: number): boolean {
  return roll >= critRange;
}

/** Check if a roll is a critical miss */
export function isCriticalMiss(roll: number): boolean {
  return roll === 1;
}

/** Calculate melee attack target number */
export function meleeTarget(targetStats: Stats): number {
  return targetStats.str + 8;
}

/** Calculate ranged attack target number */
export function rangedTarget(targetStats: Stats): number {
  return targetStats.agi + 8;
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
