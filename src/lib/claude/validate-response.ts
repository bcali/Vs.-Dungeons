// Server-side game logic validation of Claude's response.
// Catches impossible values that pass schema validation.

import type { ClaudeActionResponse, CombatParticipant } from '@/types/combat';

export function validateCombatResponse(
  response: ClaudeActionResponse,
  participants: CombatParticipant[]
): string[] {
  const errors: string[] = [];

  // Validate actor exists
  if (!participants.find(p => p.id === response.action.actorId)) {
    errors.push(`Unknown actor: ${response.action.actorId}`);
  }

  // Validate targets exist
  for (const targetId of response.action.targetIds) {
    if (!participants.find(p => p.id === targetId)) {
      errors.push(`Unknown target: ${targetId}`);
    }
  }

  // Validate ability usage
  const actor = participants.find(p => p.id === response.action.actorId);
  if (actor && response.action.type === 'ability' && response.action.name) {
    const abilityName = response.action.name.toLowerCase();
    const isBasic = abilityName === 'basic attack' || abilityName === 'defend';

    if (!isBasic && actor.abilities && actor.abilities.length > 0) {
      const matched = actor.abilities.find(
        a => a.name.toLowerCase() === abilityName
      );
      if (!matched) {
        // Warn but don't block — Claude may paraphrase ability names
        errors.push(`[warn] Actor ${actor.displayName} does not have ability "${response.action.name}"`);
      } else if (matched.slotCost > 0 && (actor.spellSlotsUsed + matched.slotCost) > actor.spellSlotsMax) {
        errors.push(`${actor.displayName} lacks spell slots for ${matched.name}: needs ${matched.slotCost}, has ${actor.spellSlotsMax - actor.spellSlotsUsed} remaining`);
      }
    }
  }

  // Validate each result
  for (const result of response.results) {
    const p = participants.find(pp => pp.id === result.participantId);
    if (!p) {
      errors.push(`Unknown participant in results: ${result.participantId}`);
      continue;
    }

    // HP can't exceed max after healing
    if (result.hpChange > 0 && p.currentHp + result.hpChange > p.maxHp) {
      errors.push(`HP would exceed max for ${p.displayName}: ${p.currentHp + result.hpChange} > ${p.maxHp}`);
    }

    // Spell slots can't exceed max
    if (result.slotsUsed > 0 && (p.spellSlotsUsed + result.slotsUsed) > p.spellSlotsMax) {
      errors.push(`Spell slots would exceed max for ${p.displayName}`);
    }

    // Sanity: single hit shouldn't do 50+ damage
    if (result.hpChange < -50) {
      errors.push(`Suspiciously high damage: ${Math.abs(result.hpChange)} to ${p.displayName}`);
    }
  }

  return errors;
}
