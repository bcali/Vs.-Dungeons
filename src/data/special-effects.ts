// Legendary special effects pool
// These are assigned to legendary equipment items for bonus power

import type { SpecialEffect } from '@/types/game';

/**
 * All available legendary special effects.
 * Each legendary item gets one effect from this pool.
 * Effects are categorized by the type of bonus they provide.
 */
export const SPECIAL_EFFECTS: SpecialEffect[] = [
  // ─── Damage Boosts ──────────────────────────────────────────────────
  {
    id: 'crushing_blow',
    name: 'Crushing Blow',
    description: '+20% damage to Shield Slam',
    effectType: 'ability_boost',
    value: 20,
    targetAbility: 'shield_slam',
  },
  {
    id: 'assassins_edge',
    name: "Assassin's Edge",
    description: '+25% damage to Backstab',
    effectType: 'ability_boost',
    value: 25,
    targetAbility: 'backstab',
  },
  {
    id: 'arcane_amplifier',
    name: 'Arcane Amplifier',
    description: '+20% spell damage',
    effectType: 'damage_boost',
    value: 20,
  },
  {
    id: 'berserker_fury',
    name: "Berserker's Fury",
    description: '+15% melee damage when below 50% HP',
    effectType: 'damage_boost',
    value: 15,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: '+20% damage to Aimed Shot',
    effectType: 'ability_boost',
    value: 20,
    targetAbility: 'aimed_shot',
  },

  // ─── Damage Reduction ───────────────────────────────────────────────
  {
    id: 'dragonhide',
    name: 'Dragonhide',
    description: 'Reduce fire damage by 25%',
    effectType: 'damage_reduction',
    value: 25,
  },
  {
    id: 'frost_ward',
    name: 'Frost Ward',
    description: 'Reduce ice damage by 25%',
    effectType: 'damage_reduction',
    value: 25,
  },
  {
    id: 'iron_skin',
    name: 'Iron Skin',
    description: 'Reduce all physical damage by 10%',
    effectType: 'damage_reduction',
    value: 10,
  },
  {
    id: 'shadow_veil',
    name: 'Shadow Veil',
    description: 'Reduce damage from first hit each combat by 50%',
    effectType: 'damage_reduction',
    value: 50,
  },

  // ─── Healing ────────────────────────────────────────────────────────
  {
    id: 'vampiric_touch',
    name: 'Vampiric Touch',
    description: 'Heal 3 HP at start of each turn',
    effectType: 'heal_per_turn',
    value: 3,
  },
  {
    id: 'natures_blessing',
    name: "Nature's Blessing",
    description: 'Heal 5 HP at start of each turn',
    effectType: 'heal_per_turn',
    value: 5,
  },
  {
    id: 'phoenix_heart',
    name: 'Phoenix Heart',
    description: 'Heal 2 HP whenever you deal damage',
    effectType: 'heal_per_turn',
    value: 2,
  },

  // ─── All Stats ──────────────────────────────────────────────────────
  {
    id: 'titans_might',
    name: "Titan's Might",
    description: '+2 to all stats',
    effectType: 'all_stats',
    value: 2,
  },
  {
    id: 'ancient_wisdom',
    name: 'Ancient Wisdom',
    description: '+3 to all stats',
    effectType: 'all_stats',
    value: 3,
  },

  // ─── Critical Chance ────────────────────────────────────────────────
  {
    id: 'lucky_star',
    name: 'Lucky Star',
    description: 'Critical hit on 19 or 20',
    effectType: 'crit_chance',
    value: 19,
  },
  {
    id: 'precision_strike',
    name: 'Precision Strike',
    description: 'Critical hit on 18, 19, or 20',
    effectType: 'crit_chance',
    value: 18,
  },

  // ─── Ability Boosts ─────────────────────────────────────────────────
  {
    id: 'battle_cry_echo',
    name: 'Battle Cry Echo',
    description: '+30% to Brave Strike damage',
    effectType: 'ability_boost',
    value: 30,
    targetAbility: 'brave_strike',
  },
  {
    id: 'shadow_mastery',
    name: 'Shadow Mastery',
    description: '+25% to Cheap Shot debuff duration',
    effectType: 'ability_boost',
    value: 25,
    targetAbility: 'cheap_shot',
  },
  {
    id: 'holy_radiance',
    name: 'Holy Radiance',
    description: '+30% to Soothe healing',
    effectType: 'ability_boost',
    value: 30,
    targetAbility: 'soothe',
  },
  {
    id: 'overcharged_bolt',
    name: 'Overcharged Bolt',
    description: '+25% to Boom Bolt damage',
    effectType: 'ability_boost',
    value: 25,
    targetAbility: 'boom_bolt',
  },
];

/**
 * Get special effects appropriate for a given level range.
 * Lower-level legendaries get weaker effects, higher-level get stronger ones.
 */
export function getSpecialEffectsForLevel(level: number): SpecialEffect[] {
  if (level >= 18) return SPECIAL_EFFECTS; // All effects available
  if (level >= 15) {
    // Exclude the most powerful effects
    return SPECIAL_EFFECTS.filter(e =>
      !(e.id === 'ancient_wisdom' || e.id === 'precision_strike' || e.id === 'natures_blessing')
    );
  }
  // Level 8-14: basic effects only
  return SPECIAL_EFFECTS.filter(e =>
    e.effectType !== 'all_stats' &&
    e.id !== 'precision_strike' &&
    e.id !== 'natures_blessing' &&
    e.id !== 'shadow_veil'
  );
}
