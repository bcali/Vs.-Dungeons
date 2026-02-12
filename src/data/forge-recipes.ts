// Unified Forge recipe catalog — equipment templates + core rules recipes
// Categories: armor (equipment), potion, trap, misc

import type { EquipmentRarity, SealTier, MaterialTier, EquipmentSlot, ItemType } from '@/types/game';
import { EQUIPMENT_RECIPES } from './equipment-recipes';
import type { EquipmentRecipeEntry } from './equipment-recipes';

// ─── Types ───────────────────────────────────────────────────────────

export type ForgeCategory = 'armor' | 'potion' | 'trap' | 'misc';

export interface ForgeSlot {
  type: 'seal' | 'material';
  tier: SealTier | MaterialTier;
  quantity: number;
  label: string;
}

export interface ForgeResult {
  type: 'equipment' | 'consumable';
  templateId?: string;
  itemName: string;
  itemType: ItemType;
  effectJson?: Record<string, unknown>;
}

export interface ForgeRecipe {
  id: string;
  name: string;
  category: ForgeCategory;
  icon: string;
  description: string;
  effect: string;
  rarity: EquipmentRarity;
  requiredLevel: number;
  slots: ForgeSlot[];
  result: ForgeResult;
  /** For armor recipes, the original equipment recipe entry */
  equipmentRecipe?: EquipmentRecipeEntry;
}

// ─── Core Rules Recipes (from game rules doc) ─────────────────────────

const CORE_RECIPES: ForgeRecipe[] = [
  // Potions
  {
    id: 'potion_health',
    name: 'Health Potion',
    category: 'potion',
    icon: '\u{1F9EA}',
    description: 'A bubbling red elixir that restores vitality.',
    effect: 'Restore 10 HP',
    rarity: 'common',
    requiredLevel: 1,
    slots: [
      { type: 'seal', tier: 'common', quantity: 2, label: '2x Common Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Health Potion',
      itemType: 'consumable',
      effectJson: { heal: 10 },
    },
  },
  {
    id: 'potion_greater_health',
    name: 'Greater Health Potion',
    category: 'potion',
    icon: '\u{1F9EA}',
    description: 'A potent crimson draught that mends serious wounds.',
    effect: 'Restore 25 HP',
    rarity: 'rare',
    requiredLevel: 5,
    slots: [
      { type: 'seal', tier: 'uncommon', quantity: 2, label: '2x Uncommon Seal' },
      { type: 'seal', tier: 'rare', quantity: 1, label: '1x Rare Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Greater Health Potion',
      itemType: 'consumable',
      effectJson: { heal: 25 },
    },
  },
  {
    id: 'potion_mana',
    name: 'Mana Potion',
    category: 'potion',
    icon: '\u{1F52E}',
    description: 'Shimmering blue liquid that restores spell energy.',
    effect: 'Restore 1 Spell Slot',
    rarity: 'common',
    requiredLevel: 2,
    slots: [
      { type: 'seal', tier: 'common', quantity: 3, label: '3x Common Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Mana Potion',
      itemType: 'consumable',
      effectJson: { restoreSpellSlots: 1 },
    },
  },

  // Traps
  {
    id: 'trap_fire_bomb',
    name: 'Fire Bomb',
    category: 'trap',
    icon: '\u{1F4A3}',
    description: 'An explosive charge that detonates on impact.',
    effect: '8 damage, 2-stud area',
    rarity: 'common',
    requiredLevel: 1,
    slots: [
      { type: 'seal', tier: 'common', quantity: 3, label: '3x Common Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Fire Bomb',
      itemType: 'consumable',
      effectJson: { damage: 8, aoe: 2, damageType: 'fire' },
    },
  },
  {
    id: 'trap_snare',
    name: 'Snare Trap',
    category: 'trap',
    icon: '\u{1FAA4}',
    description: 'A hidden trap that immobilizes the unwary.',
    effect: 'Root enemy for 1 turn',
    rarity: 'common',
    requiredLevel: 2,
    slots: [
      { type: 'seal', tier: 'common', quantity: 2, label: '2x Common Seal' },
      { type: 'material', tier: 'common', quantity: 1, label: '1x Common Material' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Snare Trap',
      itemType: 'consumable',
      effectJson: { root: 1 },
    },
  },
  {
    id: 'trap_frost_mine',
    name: 'Frost Mine',
    category: 'trap',
    icon: '\u2744\uFE0F',
    description: 'A frigid explosive that slows all caught in its blast.',
    effect: '6 ice damage, slow 2 turns, 2-stud area',
    rarity: 'rare',
    requiredLevel: 5,
    slots: [
      { type: 'seal', tier: 'uncommon', quantity: 2, label: '2x Uncommon Seal' },
      { type: 'seal', tier: 'rare', quantity: 1, label: '1x Rare Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Frost Mine',
      itemType: 'consumable',
      effectJson: { damage: 6, aoe: 2, damageType: 'ice', slow: 2 },
    },
  },

  // Misc
  {
    id: 'misc_shadow_cloak',
    name: 'Shadow Cloak',
    category: 'misc',
    icon: '\u{1F319}',
    description: 'Woven from shadow threads, this cloak conceals the wearer.',
    effect: '+3 stealth for 3 turns',
    rarity: 'rare',
    requiredLevel: 5,
    slots: [
      { type: 'seal', tier: 'uncommon', quantity: 2, label: '2x Uncommon Seal' },
      { type: 'seal', tier: 'rare', quantity: 1, label: '1x Rare Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Shadow Cloak',
      itemType: 'consumable',
      effectJson: { stealth: 3, duration: 3 },
    },
  },
  {
    id: 'misc_phoenix_feather',
    name: 'Phoenix Feather',
    category: 'misc',
    icon: '\u{1F525}',
    description: 'A legendary feather that burns with immortal fire.',
    effect: 'Auto-revive at full HP (one use)',
    rarity: 'legendary',
    requiredLevel: 12,
    slots: [
      { type: 'seal', tier: 'epic', quantity: 3, label: '3x Epic Seal' },
      { type: 'seal', tier: 'legendary', quantity: 1, label: '1x Legendary Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Phoenix Feather',
      itemType: 'misc',
      effectJson: { autoRevive: true, healPercent: 100 },
    },
  },
  {
    id: 'misc_crown_of_ages',
    name: 'Crown of Ages',
    category: 'misc',
    icon: '\u{1F451}',
    description: 'An ancient crown of immeasurable power — the pinnacle of crafting.',
    effect: 'All stats +2, immune to stun',
    rarity: 'legendary',
    requiredLevel: 15,
    slots: [
      { type: 'seal', tier: 'legendary', quantity: 5, label: '5x Legendary Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Crown of Ages',
      itemType: 'misc',
      effectJson: { allStats: 2, immuneStun: true },
    },
  },
  {
    id: 'misc_smoke_bomb',
    name: 'Smoke Bomb',
    category: 'misc',
    icon: '\u{1F4A8}',
    description: 'Vanish in a cloud of smoke. Perfect for a hasty retreat.',
    effect: 'Escape combat, no opportunity attacks',
    rarity: 'common',
    requiredLevel: 1,
    slots: [
      { type: 'seal', tier: 'common', quantity: 2, label: '2x Common Seal' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Smoke Bomb',
      itemType: 'consumable',
      effectJson: { escapeCombat: true },
    },
  },
  {
    id: 'misc_scroll_identify',
    name: 'Scroll of Identify',
    category: 'misc',
    icon: '\u{1F4DC}',
    description: 'A scroll that reveals the true nature of mysterious items.',
    effect: 'Identify one unknown item',
    rarity: 'common',
    requiredLevel: 1,
    slots: [
      { type: 'seal', tier: 'common', quantity: 1, label: '1x Common Seal' },
      { type: 'material', tier: 'common', quantity: 1, label: '1x Common Material' },
    ],
    result: {
      type: 'consumable',
      itemName: 'Scroll of Identify',
      itemType: 'consumable',
      effectJson: { identify: true },
    },
  },
];

// ─── Equipment → ForgeRecipe adapter ──────────────────────────────────

const SLOT_ICONS: Record<EquipmentSlot, string> = {
  head:    '\u{1FA96}',
  chest:   '\u{1F6E1}',
  hands:   '\u{1F9E4}',
  feet:    '\u{1F462}',
  weapon:  '\u2694\uFE0F',
  shield:  '\u{1F6E1}\uFE0F',
  ring:    '\u{1F48D}',
  trinket: '\u{1F4FF}',
};

function equipmentToForgeRecipe(recipe: EquipmentRecipeEntry): ForgeRecipe {
  const { template, cost, requiredLevel, templateId } = recipe;

  // Build forge slots from cost
  const forgeSlots: ForgeSlot[] = [];
  for (const [tier, qty] of Object.entries(cost.seals) as [SealTier, number][]) {
    if (qty > 0) {
      forgeSlots.push({
        type: 'seal',
        tier,
        quantity: qty,
        label: `${qty}x ${tier.charAt(0).toUpperCase() + tier.slice(1)} Seal`,
      });
    }
  }
  for (const mat of cost.materials) {
    forgeSlots.push({
      type: 'material',
      tier: mat.tier,
      quantity: mat.quantity,
      label: `${mat.quantity}x ${mat.tier.charAt(0).toUpperCase() + mat.tier.slice(1)} Material`,
    });
  }

  // Build stat description
  const statDescParts: string[] = [];
  for (const [stat, val] of Object.entries(template.statAllocations) as [string, number][]) {
    if (val > 0) statDescParts.push(`+${val} ${stat.toUpperCase()}`);
  }
  const effect = statDescParts.join(', ') +
    (template.specialEffect ? ` + ${template.specialEffect.name}` : '');

  return {
    id: `equipment_${templateId}`,
    name: template.nameTemplate,
    category: 'armor',
    icon: SLOT_ICONS[template.slot],
    description: `Level ${requiredLevel}+ ${template.slot} crafted from ${template.materialPrefix} materials.`,
    effect,
    rarity: template.rarity,
    requiredLevel,
    slots: forgeSlots,
    result: {
      type: 'equipment',
      templateId,
      itemName: template.nameTemplate,
      itemType: 'armor',
    },
    equipmentRecipe: recipe,
  };
}

// ─── Combined Catalog ─────────────────────────────────────────────────

function buildCatalog(): ForgeRecipe[] {
  const equipmentRecipes = EQUIPMENT_RECIPES.map(equipmentToForgeRecipe);
  return [...CORE_RECIPES, ...equipmentRecipes];
}

export const FORGE_RECIPES: ForgeRecipe[] = buildCatalog();

// ─── Lookup Helpers ───────────────────────────────────────────────────

/** Get all recipes for a category */
export function getRecipesByCategory(category: ForgeCategory): ForgeRecipe[] {
  return FORGE_RECIPES.filter(r => r.category === category);
}

/** Get recipes available at a given level */
export function getRecipesForLevel(level: number): ForgeRecipe[] {
  return FORGE_RECIPES.filter(r => level >= r.requiredLevel);
}

/** Get recipes for a category at a given level */
export function getRecipesForCategoryAndLevel(
  category: ForgeCategory,
  level: number,
): ForgeRecipe[] {
  return FORGE_RECIPES.filter(r => r.category === category && level >= r.requiredLevel);
}

/** Check if a player can afford a recipe given their seals and materials */
export function canAffordRecipe(
  recipe: ForgeRecipe,
  seals: Record<string, number>,
  materials: { tier: string; quantity: number }[],
): boolean {
  for (const slot of recipe.slots) {
    if (slot.type === 'seal') {
      const owned = seals[slot.tier] ?? 0;
      if (owned < slot.quantity) return false;
    } else {
      // Material check: sum all materials of matching tier
      const ownedQty = materials
        .filter(m => m.tier === slot.tier)
        .reduce((sum, m) => sum + m.quantity, 0);
      if (ownedQty < slot.quantity) return false;
    }
  }
  return true;
}

/** Sort recipes: craftable first, then by level desc, then rarity */
const RARITY_SORT: Record<EquipmentRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };

export function sortRecipes(
  recipes: ForgeRecipe[],
  seals: Record<string, number>,
  materials: { tier: string; quantity: number }[],
): ForgeRecipe[] {
  return [...recipes].sort((a, b) => {
    const aAfford = canAffordRecipe(a, seals, materials) ? 0 : 1;
    const bAfford = canAffordRecipe(b, seals, materials) ? 0 : 1;
    if (aAfford !== bAfford) return aAfford - bAfford;
    const levelDiff = b.requiredLevel - a.requiredLevel;
    if (levelDiff !== 0) return levelDiff;
    return RARITY_SORT[a.rarity] - RARITY_SORT[b.rarity];
  });
}
