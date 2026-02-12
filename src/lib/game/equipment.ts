// Equipment system — stat budget, distribution, gear bonus calculation
// Balance: items supplement natural stat growth, follow monster power curve

import type {
  Stats,
  StatKey,
  EquipmentSlot,
  EquipmentRarity,
  CharacterEquipmentItem,
} from '@/types/game';
import { STAT_KEYS, RARITY_STAT_COUNT, EQUIPMENT_SLOT_INFO } from '@/types/game';

// ─── Stat Budget Formula ─────────────────────────────────────────────

/**
 * Stat points granted per allocation slot at a given item level.
 * Scales with level to stay relevant as monsters grow stronger.
 *
 * Monster formula: avg stat = Level/2 + 2
 * Gear should provide ~25-30% of a stat point per allocation at each tier.
 *
 * Level 2-3:   1 point per allocation
 * Level 4-7:   2 points per allocation
 * Level 8-11:  3 points per allocation
 * Level 12-15: 4 points per allocation
 * Level 16-19: 5 points per allocation
 * Level 20:    6 points per allocation
 */
export function pointsPerAllocation(level: number): number {
  return Math.max(1, Math.floor(level / 4) + 1);
}

/**
 * Total stat budget for an item based on level and rarity.
 * Common = 1 allocation, Rare = 2, Epic = 3, Legendary = 4
 *
 * Examples:
 *   Common L2:      1×1 = 1 total stat point
 *   Rare L8:        3×2 = 6 total stat points
 *   Epic L12:       4×3 = 12 total stat points
 *   Legendary L16:  5×4 = 20 total stat points (+ special effect)
 *   Legendary L20:  6×4 = 24 total stat points (+ special effect)
 */
export function itemStatBudget(level: number, rarity: EquipmentRarity): number {
  return pointsPerAllocation(level) * RARITY_STAT_COUNT[rarity];
}

// ─── Stat Distribution ───────────────────────────────────────────────

/**
 * Distribute a stat budget across stats, weighted toward the slot's primary stat.
 *
 * Distribution rules:
 * - Common (1 alloc): 100% to primary stat
 * - Rare (2 allocs): ~60% primary, ~40% secondary
 * - Epic (3 allocs): ~50% primary, ~30% secondary, ~20% tertiary
 * - Legendary (4 allocs): all 4 stats get something, primary weighted
 *
 * Uses deterministic distribution (not random) so same template = same stats.
 */
export function distributeStats(
  slot: EquipmentSlot,
  budget: number,
  rarity: EquipmentRarity,
): Partial<Stats> {
  const slotInfo = EQUIPMENT_SLOT_INFO[slot];
  const primary = slotInfo.primaryStat;
  const allocCount = RARITY_STAT_COUNT[rarity];

  if (allocCount === 1) {
    // Common: all budget to primary stat
    return { [primary]: budget };
  }

  // Build stat priority order: primary first, then others
  const otherStats = STAT_KEYS.filter(k => k !== primary);
  const statOrder: StatKey[] = [primary, ...otherStats];

  const result: Partial<Stats> = {};
  const perAlloc = pointsPerAllocation(budget > 0 ? Math.ceil(budget / allocCount) : 1);

  if (allocCount === 2) {
    // Rare: 60/40 split
    const primaryPoints = Math.ceil(budget * 0.6);
    const secondaryPoints = budget - primaryPoints;
    result[statOrder[0]] = primaryPoints;
    if (secondaryPoints > 0) result[statOrder[1]] = secondaryPoints;
  } else if (allocCount === 3) {
    // Epic: 45/30/25 split
    const p1 = Math.ceil(budget * 0.45);
    const p2 = Math.ceil(budget * 0.30);
    const p3 = budget - p1 - p2;
    result[statOrder[0]] = p1;
    if (p2 > 0) result[statOrder[1]] = p2;
    if (p3 > 0) result[statOrder[2]] = p3;
  } else {
    // Legendary: 35/25/20/20 split across all 4 stats
    const p1 = Math.ceil(budget * 0.35);
    const p2 = Math.ceil(budget * 0.25);
    const p3 = Math.ceil(budget * 0.20);
    const p4 = budget - p1 - p2 - p3;
    result[statOrder[0]] = p1;
    if (p2 > 0) result[statOrder[1]] = p2;
    if (p3 > 0) result[statOrder[2]] = p3;
    if (p4 > 0) result[statOrder[3]] = p4;
  }

  return result;
}

// ─── Gear Bonus Aggregation ──────────────────────────────────────────

/**
 * Calculate total gear bonus from all equipped items.
 * Returns a Stats object summing all statBonuses from equipped gear.
 */
export function calculateGearBonus(equippedItems: CharacterEquipmentItem[]): Stats {
  const bonus: Stats = { str: 0, spd: 0, tgh: 0, smt: 0 };

  for (const item of equippedItems) {
    if (!item.equippedSlot) continue;
    for (const key of STAT_KEYS) {
      bonus[key] += item.statBonuses[key] ?? 0;
    }
  }

  return bonus;
}

// ─── Name Generation ─────────────────────────────────────────────────

/** Material prefix by level range */
export const MATERIAL_TIERS: { levelMin: number; levelMax: number; prefix: string; craftingTier: string }[] = [
  { levelMin: 2,  levelMax: 4,  prefix: 'Iron',       craftingTier: 'common' },
  { levelMin: 5,  levelMax: 7,  prefix: 'Steel',      craftingTier: 'uncommon' },
  { levelMin: 8,  levelMax: 10, prefix: 'Cobalt',     craftingTier: 'rare' },
  { levelMin: 11, levelMax: 14, prefix: 'Mithril',    craftingTier: 'rare' },
  { levelMin: 15, levelMax: 17, prefix: 'Adamantine', craftingTier: 'epic' },
  { levelMin: 18, levelMax: 20, prefix: 'Dragon',     craftingTier: 'legendary' },
];

/** Slot-specific item suffix */
export const SLOT_SUFFIXES: Record<EquipmentSlot, string[]> = {
  head:    ['Helm', 'Crown', 'Hood'],
  chest:   ['Plate', 'Chestguard', 'Tunic'],
  hands:   ['Gauntlets', 'Gloves', 'Bracers'],
  feet:    ['Greaves', 'Boots', 'Sabatons'],
  weapon:  ['Sword', 'Blade', 'Edge'],
  shield:  ['Shield', 'Buckler', 'Ward'],
  ring:    ['Ring', 'Band', 'Loop'],
  trinket: ['Amulet', 'Charm', 'Talisman'],
};

/** Rarity adjective for item names */
const RARITY_ADJECTIVES: Record<EquipmentRarity, string[]> = {
  common:    ['', '', ''],                              // No adjective for common
  rare:      ['Fine', 'Sturdy', 'Reinforced'],
  epic:      ['Enchanted', 'Arcane', 'Mystic'],
  legendary: ['Legendary', 'Mythic', 'Divine'],
};

/**
 * Generate an item name from slot, level, and rarity.
 * e.g. "Iron Helm", "Fine Steel Gauntlets", "Legendary Dragon Blade"
 */
export function generateItemName(
  slot: EquipmentSlot,
  level: number,
  rarity: EquipmentRarity,
  variantIndex: number = 0,
): string {
  const tier = MATERIAL_TIERS.find(t => level >= t.levelMin && level <= t.levelMax)
    ?? MATERIAL_TIERS[0];
  const suffix = SLOT_SUFFIXES[slot][variantIndex % SLOT_SUFFIXES[slot].length];
  const adj = RARITY_ADJECTIVES[rarity][variantIndex % RARITY_ADJECTIVES[rarity].length];

  if (adj) {
    return `${adj} ${tier.prefix} ${suffix}`;
  }
  return `${tier.prefix} ${suffix}`;
}

/**
 * Get the material tier info for a given level.
 */
export function getMaterialTier(level: number) {
  return MATERIAL_TIERS.find(t => level >= t.levelMin && level <= t.levelMax)
    ?? MATERIAL_TIERS[0];
}
