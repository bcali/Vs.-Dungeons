// Build compact CombatAbility[] for combat prompt context
// Transforms DB abilities + skill tree allocations into a flat list
// that Claude can use to resolve voice commands accurately.

import type { Ability, SkillTreeSkill, CharacterSkillAllocation, SkillTreeClass, Profession } from '@/types/game';
import type { CombatAbility, MonsterSpecialAbility } from '@/types/combat';
import {
  fetchCharacterAbilities,
  fetchSkillAllocations,
  fetchSkillTreeSkills,
} from '@/lib/supabase/queries';
import { PROFESSION_CLASS } from '@/types/game';

/**
 * Build the full list of usable abilities for a hero in combat.
 * Combines class abilities (from the abilities table) with
 * active skill tree skills the character has invested points in.
 */
export async function buildHeroCombatAbilities(
  characterId: string,
  profession: Profession,
): Promise<CombatAbility[]> {
  const skillClass: SkillTreeClass | undefined = PROFESSION_CLASS[profession];

  // Fetch in parallel
  const [learnedAbilities, allocations, allSkills] = await Promise.all([
    fetchCharacterAbilities(characterId),
    fetchSkillAllocations(characterId),
    skillClass ? fetchSkillTreeSkills(skillClass) : Promise.resolve([]),
  ]);

  const abilities: CombatAbility[] = [];

  // 1. Class abilities the character has learned
  for (const ab of learnedAbilities) {
    abilities.push(abilityToCombat(ab));
  }

  // 2. Active skill tree skills with at least 1 rank
  if (allSkills.length > 0 && allocations.length > 0) {
    const allocMap = new Map<string, CharacterSkillAllocation>();
    for (const alloc of allocations) {
      allocMap.set(alloc.skillId, alloc);
    }

    for (const skill of allSkills) {
      if (skill.skillType !== 'active') continue;
      const alloc = allocMap.get(skill.id);
      if (!alloc || alloc.currentRank < 1) continue;
      abilities.push(skillToCombat(skill, alloc.currentRank));
    }
  }

  return abilities;
}

/**
 * Convert a class Ability into a compact CombatAbility.
 */
function abilityToCombat(ab: Ability): CombatAbility {
  const effect = ab.effectJson;
  return {
    id: ab.id,
    name: ab.name,
    tier: ab.tier,
    slotCost: ab.slotCost,
    damage: effect?.damage as string | undefined,
    effect: effect?.effect as string | undefined,
    range: ab.range,
    aoe: ab.aoe,
    description: ab.description,
    source: 'ability',
  };
}

/**
 * Convert a SkillTreeSkill + rank into a compact CombatAbility.
 * Uses the rankEffects array to pull damage/effect for the current rank.
 */
function skillToCombat(skill: SkillTreeSkill, currentRank: number): CombatAbility {
  // rankEffects is an array where index 0 = rank 1
  const rankEffect = skill.rankEffects?.[currentRank - 1] as Record<string, unknown> | undefined;
  const baseEffect = skill.effectJson;

  return {
    id: skill.id,
    name: skill.name,
    tier: skill.tier,
    slotCost: (rankEffect?.slotCost as number) ?? (baseEffect?.slotCost as number) ?? 0,
    damage: (rankEffect?.damage as string) ?? (baseEffect?.damage as string) ?? undefined,
    effect: (rankEffect?.effect as string) ?? (baseEffect?.effect as string) ?? undefined,
    range: (baseEffect?.range as string) ?? undefined,
    aoe: (baseEffect?.aoe as string) ?? undefined,
    description: skill.description,
    source: 'skill',
  };
}

/**
 * Parse a monster's specialAbilities JSON into MonsterSpecialAbility[].
 */
export function buildMonsterSpecialAbilities(
  specialAbilities: Record<string, unknown>[] | null,
): MonsterSpecialAbility[] {
  if (!specialAbilities || specialAbilities.length === 0) return [];

  return specialAbilities.map((sa) => ({
    name: (sa.name as string) || 'Unknown',
    description: (sa.description as string) || '',
    isOneTime: (sa.one_time as boolean) ?? (sa.isOneTime as boolean) ?? false,
  }));
}
