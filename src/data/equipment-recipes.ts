// Equipment crafting recipes — connect templates to material/seal costs
// Recipes scale with rarity and level tier

import type { EquipmentSlot, EquipmentRarity, CraftingProfession, SealTier, MaterialTier, CraftingCost } from '@/types/game';
import { EQUIPMENT_TEMPLATES } from './equipment-templates';
import type { EquipmentTemplate } from '@/types/game';

// ─── Crafting Profession Mapping ─────────────────────────────────────

/** Which crafting profession can make each slot */
export const SLOT_CRAFTING_PROFESSION: Record<EquipmentSlot, CraftingProfession> = {
  head:    'blacksmithing',
  chest:   'blacksmithing',
  hands:   'blacksmithing',
  feet:    'blacksmithing',
  weapon:  'blacksmithing',
  shield:  'blacksmithing',
  ring:    'enchanting',
  trinket: 'enchanting',
};

// ─── Cost Formulas ───────────────────────────────────────────────────

/**
 * Material tier required based on item level range.
 */
function materialTierForLevel(levelMin: number): MaterialTier {
  if (levelMin >= 18) return 'legendary';
  if (levelMin >= 15) return 'epic';
  if (levelMin >= 8) return 'rare';
  if (levelMin >= 5) return 'uncommon';
  return 'common';
}

/**
 * Calculate crafting cost for a template based on rarity and level.
 *
 * | Rarity    | Seal Cost              | Material Cost              |
 * |-----------|------------------------|----------------------------|
 * | Common    | 2 Common seals         | 1 material of tier         |
 * | Rare      | 1 Uncommon + 2 Common  | 2 materials of tier        |
 * | Epic      | 1 Rare + 2 Uncommon    | 3 materials of tier        |
 * | Legendary | 1 Epic + 2 Rare        | 4 materials + 1 higher     |
 */
export function calculateCraftingCost(rarity: EquipmentRarity, levelMin: number): CraftingCost {
  const tier = materialTierForLevel(levelMin);

  switch (rarity) {
    case 'common':
      return {
        materials: [{ tier, quantity: 1 }],
        seals: { common: 2 },
      };

    case 'rare':
      return {
        materials: [{ tier, quantity: 2 }],
        seals: { common: 2, uncommon: 1 },
      };

    case 'epic':
      return {
        materials: [{ tier, quantity: 3 }],
        seals: { uncommon: 2, rare: 1 },
      };

    case 'legendary': {
      const higherTier = getHigherTier(tier);
      const mats: CraftingCost['materials'] = [{ tier, quantity: 4 }];
      if (higherTier !== tier) {
        mats.push({ tier: higherTier, quantity: 1 });
      }
      return {
        materials: mats,
        seals: { rare: 2, epic: 1 },
      };
    }
  }
}

function getHigherTier(tier: MaterialTier): MaterialTier {
  const order: MaterialTier[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const idx = order.indexOf(tier);
  return order[Math.min(idx + 1, order.length - 1)];
}

// ─── Recipe Data ─────────────────────────────────────────────────────

export interface EquipmentRecipeEntry {
  templateId: string;
  template: EquipmentTemplate;
  craftingProfession: CraftingProfession;
  requiredLevel: number;
  cost: CraftingCost;
}

/**
 * Generate all equipment recipes from templates.
 * Every template gets a recipe with appropriate costs.
 */
function generateRecipes(): EquipmentRecipeEntry[] {
  return EQUIPMENT_TEMPLATES.map(template => ({
    templateId: template.id,
    template,
    craftingProfession: SLOT_CRAFTING_PROFESSION[template.slot],
    requiredLevel: template.levelMin,
    cost: calculateCraftingCost(template.rarity, template.levelMin),
  }));
}

export const EQUIPMENT_RECIPES: EquipmentRecipeEntry[] = generateRecipes();

// ─── Lookup Helpers ──────────────────────────────────────────────────

/** Get recipes a character can craft at their level */
export function getAvailableRecipes(
  characterLevel: number,
  craftingProfessions: CraftingProfession[],
): EquipmentRecipeEntry[] {
  return EQUIPMENT_RECIPES.filter(r =>
    characterLevel >= r.requiredLevel &&
    craftingProfessions.includes(r.craftingProfession)
  );
}

/** Get recipes for a specific slot */
export function getRecipesForSlot(
  slot: EquipmentSlot,
  characterLevel: number,
): EquipmentRecipeEntry[] {
  return EQUIPMENT_RECIPES.filter(r =>
    r.template.slot === slot && characterLevel >= r.requiredLevel
  );
}

/** Get a specific recipe by template ID */
export function getRecipeByTemplateId(templateId: string): EquipmentRecipeEntry | undefined {
  return EQUIPMENT_RECIPES.find(r => r.templateId === templateId);
}

/** Get the best (highest level) recipes available for each slot */
export function getBestRecipesPerSlot(
  characterLevel: number,
  craftingProfessions: CraftingProfession[],
): Map<EquipmentSlot, EquipmentRecipeEntry[]> {
  const available = getAvailableRecipes(characterLevel, craftingProfessions);
  const bySlot = new Map<EquipmentSlot, EquipmentRecipeEntry[]>();

  for (const recipe of available) {
    const slot = recipe.template.slot;
    if (!bySlot.has(slot)) bySlot.set(slot, []);
    bySlot.get(slot)!.push(recipe);
  }

  // For each slot, keep only the highest level range
  for (const [slot, recipes] of bySlot) {
    const maxLevel = Math.max(...recipes.map(r => r.requiredLevel));
    bySlot.set(slot, recipes.filter(r => r.requiredLevel === maxLevel));
  }

  return bySlot;
}
