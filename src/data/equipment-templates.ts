// Static equipment templates — generated for all level/slot/rarity combinations
// ~192 templates covering levels 2-20, 8 slots, 4 rarities

import type { EquipmentTemplate, EquipmentSlot, EquipmentRarity } from '@/types/game';
import { EQUIPMENT_SLOTS } from '@/types/game';
import {
  itemStatBudget,
  distributeStats,
  generateItemName,
  MATERIAL_TIERS,
} from '@/lib/game/equipment';
import { getSpecialEffectsForLevel } from './special-effects';

// ─── Level ranges for template generation ────────────────────────────

interface LevelRange {
  levelMin: number;
  levelMax: number;
  /** Representative level used for stat calculation */
  statLevel: number;
  /** Rarities available at this level range */
  rarities: EquipmentRarity[];
}

const LEVEL_RANGES: LevelRange[] = [
  { levelMin: 2,  levelMax: 4,  statLevel: 3,  rarities: ['common', 'rare'] },
  { levelMin: 5,  levelMax: 7,  statLevel: 6,  rarities: ['common', 'rare', 'epic'] },
  { levelMin: 8,  levelMax: 10, statLevel: 9,  rarities: ['common', 'rare', 'epic', 'legendary'] },
  { levelMin: 11, levelMax: 14, statLevel: 12, rarities: ['common', 'rare', 'epic', 'legendary'] },
  { levelMin: 15, levelMax: 17, statLevel: 16, rarities: ['common', 'rare', 'epic', 'legendary'] },
  { levelMin: 18, levelMax: 20, statLevel: 19, rarities: ['common', 'rare', 'epic', 'legendary'] },
];

// ─── Template Generation ─────────────────────────────────────────────

function buildTemplateId(slot: EquipmentSlot, range: LevelRange, rarity: EquipmentRarity): string {
  return `${slot}_${range.levelMin}-${range.levelMax}_${rarity}`;
}

function generateTemplates(): EquipmentTemplate[] {
  const templates: EquipmentTemplate[] = [];

  for (const range of LEVEL_RANGES) {
    const tier = MATERIAL_TIERS.find(
      t => range.statLevel >= t.levelMin && range.statLevel <= t.levelMax
    ) ?? MATERIAL_TIERS[0];

    for (const slot of EQUIPMENT_SLOTS) {
      for (const rarity of range.rarities) {
        const budget = itemStatBudget(range.statLevel, rarity);
        const stats = distributeStats(slot, budget, rarity);
        const name = generateItemName(slot, range.statLevel, rarity);

        // Legendary items get a special effect
        let specialEffect = null;
        if (rarity === 'legendary') {
          const pool = getSpecialEffectsForLevel(range.statLevel);
          // Deterministic assignment: use slot index to pick effect
          const slotIdx = EQUIPMENT_SLOTS.indexOf(slot);
          specialEffect = pool[slotIdx % pool.length];
        }

        templates.push({
          id: buildTemplateId(slot, range, rarity),
          slot,
          rarity,
          levelMin: range.levelMin,
          levelMax: range.levelMax,
          nameTemplate: name,
          materialPrefix: tier.prefix,
          statAllocations: stats,
          specialEffect,
        });
      }
    }
  }

  return templates;
}

/**
 * All equipment templates, pre-computed at module load.
 * Access via EQUIPMENT_TEMPLATES array or use helper functions below.
 */
export const EQUIPMENT_TEMPLATES: EquipmentTemplate[] = generateTemplates();

// ─── Lookup Helpers ──────────────────────────────────────────────────

/** Get all templates available for a given character level */
export function getTemplatesForLevel(level: number): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(t => level >= t.levelMin && level <= t.levelMax);
}

/** Get templates for a specific slot and level */
export function getTemplatesForSlot(
  slot: EquipmentSlot,
  level: number,
): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(
    t => t.slot === slot && level >= t.levelMin && level <= t.levelMax
  );
}

/** Get templates for a specific rarity and level */
export function getTemplatesForRarity(
  rarity: EquipmentRarity,
  level: number,
): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(
    t => t.rarity === rarity && level >= t.levelMin && level <= t.levelMax
  );
}

/** Get a specific template by ID */
export function getTemplateById(id: string): EquipmentTemplate | undefined {
  return EQUIPMENT_TEMPLATES.find(t => t.id === id);
}

/** Get the best available templates for a slot (highest level range) */
export function getBestTemplatesForSlot(
  slot: EquipmentSlot,
  level: number,
): EquipmentTemplate[] {
  const matching = getTemplatesForSlot(slot, level);
  if (matching.length === 0) return [];
  const maxLevelMin = Math.max(...matching.map(t => t.levelMin));
  return matching.filter(t => t.levelMin === maxLevelMin);
}
