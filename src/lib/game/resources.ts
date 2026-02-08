// Resource regen/spend logic

import type { ResourceType } from '@/types/game';
import type { GameConfig } from '@/types/config';
import { DEFAULT_GAME_CONFIG } from '@/types/config';

/** Calculate passive resource regen per turn */
export function passiveRegen(
  resourceType: ResourceType,
  config?: Pick<GameConfig, 'manaRegenPerTurn' | 'energyRegenPerTurn'>
): number {
  switch (resourceType) {
    case 'mana':
      return config?.manaRegenPerTurn ?? DEFAULT_GAME_CONFIG.manaRegenPerTurn;
    case 'energy':
      return config?.energyRegenPerTurn ?? DEFAULT_GAME_CONFIG.energyRegenPerTurn;
    case 'rage':
      return 0; // Rage has no passive regen
  }
}

/** Calculate rage gained from a combat event */
export function rageGain(
  event: 'hit_taken' | 'melee_hit' | 'crit_taken' | 'ally_ko',
  config?: Pick<GameConfig, 'rageOnHitTaken' | 'rageOnMeleeHit' | 'rageOnCritTaken' | 'rageOnAllyKo'>
): number {
  const c = config ?? DEFAULT_GAME_CONFIG;
  switch (event) {
    case 'hit_taken': return c.rageOnHitTaken;
    case 'melee_hit': return c.rageOnMeleeHit;
    case 'crit_taken': return c.rageOnCritTaken;
    case 'ally_ko': return c.rageOnAllyKo;
  }
}

/** Apply regen to current resource, clamping to max */
export function applyRegen(
  current: number,
  max: number,
  resourceType: ResourceType,
  config?: Pick<GameConfig, 'manaRegenPerTurn' | 'energyRegenPerTurn'>
): number {
  const regen = passiveRegen(resourceType, config);
  return Math.min(current + regen, max);
}

/** Spend resource, returns new value or null if insufficient */
export function spendResource(current: number, cost: number): number | null {
  if (current < cost) return null;
  return current - cost;
}

/** Short rest recovery */
export function shortRestRestore(
  current: number,
  max: number,
  resourceType: ResourceType,
  config?: Pick<GameConfig, 'shortRestResourceRestore'>
): number {
  if (resourceType === 'rage') return 0; // Rage resets to 0 out of combat
  const restore = config?.shortRestResourceRestore ?? DEFAULT_GAME_CONFIG.shortRestResourceRestore;
  return Math.min(current + restore, max);
}

/** Long rest recovery */
export function longRestRestore(
  max: number,
  resourceType: ResourceType
): number {
  if (resourceType === 'rage') return 0;
  return max;
}
