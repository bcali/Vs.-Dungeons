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

    // Resources can't go below 0
    if (result.resourceChange < 0 && p.currentResource + result.resourceChange < 0) {
      errors.push(`Resource would go negative for ${p.displayName}`);
    }

    // Sanity: single hit shouldn't do 50+ damage
    if (result.hpChange < -50) {
      errors.push(`Suspiciously high damage: ${Math.abs(result.hpChange)} to ${p.displayName}`);
    }
  }

  return errors;
}
