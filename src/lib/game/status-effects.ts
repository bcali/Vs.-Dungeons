// Status effect application, ticking, and removal

import type { ActiveStatusEffect, EffectCategory } from '@/types/combat';

/** Create a new status effect instance */
export function createEffect(
  effectType: string,
  category: EffectCategory,
  displayName: string,
  iconName: string,
  duration: number | null,
  value: Record<string, unknown> = {},
  sourceParticipantId?: string
): ActiveStatusEffect {
  return {
    id: crypto.randomUUID(),
    effectType,
    category,
    remainingTurns: duration,
    value,
    iconName,
    displayName,
    sourceParticipantId,
  };
}

/** Tick all effects: decrement durations, return expired IDs */
export function tickEffects(effects: ActiveStatusEffect[]): {
  updated: ActiveStatusEffect[];
  expired: string[];
  dotDamage: number;
  hotHealing: number;
} {
  let dotDamage = 0;
  let hotHealing = 0;
  const expired: string[] = [];
  const updated: ActiveStatusEffect[] = [];

  for (const effect of effects) {
    // Calculate DoT damage
    if (effect.category === 'dot') {
      const dmg = (effect.value as { damage_per_turn?: number }).damage_per_turn ?? 0;
      dotDamage += dmg;
    }

    // Calculate HoT healing
    if (effect.category === 'hot') {
      const heal = (effect.value as { healing_per_turn?: number }).healing_per_turn ?? 0;
      hotHealing += heal;
    }

    // Decrement duration
    if (effect.remainingTurns !== null) {
      const remaining = effect.remainingTurns - 1;
      if (remaining <= 0) {
        expired.push(effect.id);
      } else {
        updated.push({ ...effect, remainingTurns: remaining });
      }
    } else {
      // Permanent effect, keep it
      updated.push(effect);
    }
  }

  return { updated, expired, dotDamage, hotHealing };
}

/** Check if a participant is stunned (cannot act) */
export function isStunned(effects: ActiveStatusEffect[]): boolean {
  return effects.some(e =>
    e.category === 'cc' &&
    ['stunned', 'frozen', 'slept', 'knocked_down'].includes(e.effectType)
  );
}

/** Check if a participant is silenced (basic attacks only) */
export function isSilenced(effects: ActiveStatusEffect[]): boolean {
  return effects.some(e => e.effectType === 'silenced');
}

/** Apply or refresh an effect on a list */
export function applyEffect(
  existing: ActiveStatusEffect[],
  newEffect: ActiveStatusEffect,
  stackable: boolean = false
): ActiveStatusEffect[] {
  const sameType = existing.findIndex(e => e.effectType === newEffect.effectType);

  if (sameType === -1) {
    return [...existing, newEffect];
  }

  if (stackable) {
    // Stack up to 3
    const stacks = existing.filter(e => e.effectType === newEffect.effectType);
    if (stacks.length < 3) {
      return [...existing, newEffect];
    }
    // At max stacks, refresh the oldest
    const result = [...existing];
    result[sameType] = { ...result[sameType], remainingTurns: newEffect.remainingTurns };
    return result;
  }

  // Non-stackable: refresh duration
  const result = [...existing];
  result[sameType] = { ...result[sameType], remainingTurns: newEffect.remainingTurns };
  return result;
}

/** Remove an effect by ID */
export function removeEffect(effects: ActiveStatusEffect[], effectId: string): ActiveStatusEffect[] {
  return effects.filter(e => e.id !== effectId);
}

/** Get effect category color */
export function effectCategoryColor(category: EffectCategory): string {
  switch (category) {
    case 'buff': return '#22c55e';
    case 'debuff': return '#ef4444';
    case 'cc': return '#a855f7';
    case 'dot': return '#f97316';
    case 'hot': return '#14b8a6';
  }
}
