// Core game types — Characters, Monsters, Abilities, Items

export type Profession = 'knight' | 'ranger' | 'wizard' | 'healer' | 'rogue' | 'inventor';
export type ResourceType = 'rage' | 'energy' | 'mana';
export type Rank = 'Starting Hero' | 'Apprentice' | 'Adventurer' | 'Veteran' | 'Champion' | 'Hero' | 'Legend' | 'Mythic' | 'LEGENDARY';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
export type SealTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type MonsterCategory = 'undead' | 'beast' | 'humanoid' | 'elemental' | 'construct' | 'demon';
export type DamageType = 'physical' | 'fire' | 'ice' | 'poison' | 'holy' | 'lightning';

export interface Stats {
  con: number;
  str: number;
  agi: number;
  mna: number;
  int: number;
  lck: number;
}

export type StatKey = keyof Stats;

export const STAT_KEYS: StatKey[] = ['con', 'str', 'agi', 'mna', 'int', 'lck'];

export const STAT_LABELS: Record<StatKey, { abbr: string; name: string; description: string }> = {
  con: { abbr: 'CON', name: 'Constitution', description: 'Hit Points, resist poison/traps, endurance' },
  str: { abbr: 'STR', name: 'Strength', description: 'Melee damage, lifting, breaking, melee defense' },
  agi: { abbr: 'AGI', name: 'Agility', description: 'Turn order, dodging, ranged accuracy, ranged defense' },
  mna: { abbr: 'MNA', name: 'Mana', description: 'Spell/ability power, magic checks, max mana pool' },
  int: { abbr: 'INT', name: 'Intelligence', description: 'Spotting secrets, puzzles, crafting, knowledge' },
  lck: { abbr: 'LCK', name: 'Luck', description: 'Crit range, loot quality, lucky saves' },
};

export const PROFESSION_RESOURCE: Record<Profession, ResourceType> = {
  knight: 'rage',
  ranger: 'mana',
  wizard: 'mana',
  healer: 'mana',
  rogue: 'energy',
  inventor: 'mana',
};

export const PROFESSION_INFO: Record<Profession, { name: string; role: string; bestStats: string; abilityFlavor: string }> = {
  knight:   { name: 'Knight',   role: 'Tank / Frontline',    bestStats: 'STR + CON', abilityFlavor: 'Battle Cries' },
  ranger:   { name: 'Ranger',   role: 'Ranged / Scout',      bestStats: 'AGI + INT', abilityFlavor: 'Techniques' },
  wizard:   { name: 'Wizard',   role: 'Damage Caster',       bestStats: 'MNA + INT', abilityFlavor: 'Spells' },
  healer:   { name: 'Healer',   role: 'Support',             bestStats: 'MNA + CON', abilityFlavor: 'Prayers' },
  rogue:    { name: 'Rogue',    role: 'Stealth / Burst',     bestStats: 'AGI + LCK', abilityFlavor: 'Tricks' },
  inventor: { name: 'Inventor', role: 'Gadgets / Summons',   bestStats: 'INT + AGI', abilityFlavor: 'Blueprints' },
};

export interface Character {
  id: string;
  campaignId: string;
  heroName: string | null;
  playerName: string | null;
  playerAge: number | null;
  profession: Profession | null;
  level: number;
  rank: string;
  xp: number;
  gold: number;
  resourceType: ResourceType | null;
  stats: Stats;
  gearBonus: Stats;
  unspentStatPoints: number;
  currentHp: number | null;
  currentResource: number | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ability {
  id: string;
  name: string;
  profession: string;
  tier: number;
  resourceCost: number;
  resourceType: string | null;
  unlockLevel: number;
  description: string;
  effectJson: Record<string, unknown> | null;
}

export interface CharacterAbility {
  id: string;
  characterId: string;
  abilityId: string;
  learnedAtLevel: number;
  ability?: Ability;
}

export interface InventoryItem {
  id: string;
  characterId: string;
  itemName: string;
  itemType: ItemType;
  quantity: number;
  effectJson: Record<string, unknown> | null;
  equipped: boolean;
}

export interface CharacterSeals {
  id: string;
  characterId: string;
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  isBoss: boolean;
  category: MonsterCategory | null;
  stats: Stats;
  hp: number;
  damage: number;
  damageType: DamageType;
  specialAbilities: Record<string, unknown>[] | null;
  description: string | null;
  avatarUrl: string | null;
  xpReward: number;
}

export interface Campaign {
  id: string;
  name: string;
  currentQuest: string | null;
  partyLevel: number;
  worldThreat: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill Tree Types ──────────────────────────────────────────────────

export type SkillTreeClass = 'warrior' | 'rogue_ranger';
export type SkillBranch = 'protection' | 'arms' | 'warrior_core' | 'shadow' | 'precision' | 'survival' | 'rogue_ranger_core';
export type SkillType = 'active' | 'passive';

export interface SkillTreeSkill {
  id: string;
  skillCode: string;
  name: string;
  class: SkillTreeClass;
  branch: SkillBranch;
  tier: number;
  skillType: SkillType;
  maxRank: number;
  description: string;
  rankEffects: Record<string, unknown>[] | null;
  legoTip: string | null;
  effectJson: Record<string, unknown> | null;
  sortOrder: number;
}

export interface CharacterSkillAllocation {
  id: string;
  characterId: string;
  skillId: string;
  currentRank: number;
  learnedAtLevel: number | null;
}

export interface ActionBarSlot {
  id: string;
  characterId: string;
  slotNumber: number;
  skillId: string | null;
  abilityId: string | null;
}

export const PROFESSION_CLASS: Partial<Record<Profession, SkillTreeClass>> = {
  knight: 'warrior',
  ranger: 'rogue_ranger',
  rogue: 'rogue_ranger',
};

export const TIER_REQUIREMENTS: Record<number, number> = {
  1: 0, 2: 3, 3: 6, 4: 10, 5: 15,
};

export const BRANCH_INFO: Record<SkillBranch, { name: string; icon: string; color: string }> = {
  protection:        { name: 'Protection',  icon: 'Shield',    color: '#3b82f6' },
  arms:              { name: 'Arms',        icon: 'Sword',     color: '#ef4444' },
  warrior_core:      { name: 'Core',        icon: 'Swords',    color: '#a855f7' },
  shadow:            { name: 'Shadow',      icon: 'Moon',      color: '#6366f1' },
  precision:         { name: 'Precision',   icon: 'Target',    color: '#22c55e' },
  survival:          { name: 'Survival',    icon: 'Trees',     color: '#84cc16' },
  rogue_ranger_core: { name: 'Core',        icon: 'Dagger',    color: '#a855f7' },
};

export interface CatalogItem {
  id: string;
  name: string;
  itemType: ItemType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string | null;
  effectJson: Record<string, unknown> | null;
}

// ─── Crafting Profession Ability Types ──────────────────────────────────

export type CraftingProfession = 'blacksmithing' | 'alchemy' | 'cooking' | 'enchanting' | 'trap_making';

export type ProfessionAbilityCategory = 'passive' | 'active' | 'unique_recipe' | 'mixed';

export type ProfessionNodeType = 'auto' | 'choice';

export type ProfessionNodeState = 'locked' | 'preview' | 'available' | 'unlocked';

export interface ProfessionAbilityOption {
  name: string;
  category: ProfessionAbilityCategory;
  icon: string;
  description: string;
  effect: string;
}

export interface ProfessionAbilityNode {
  nodeNumber: number;
  unlockLevel: number;
  type: ProfessionNodeType;
  options: ProfessionAbilityOption[];
}

export interface CraftingProfessionData {
  id: CraftingProfession;
  name: string;
  icon: string;
  description: string;
  color: string;
  nodes: ProfessionAbilityNode[];
}

export const CRAFTING_PROFESSIONS: CraftingProfession[] = ['blacksmithing', 'alchemy', 'cooking', 'enchanting', 'trap_making'];

export const CRAFTING_PROFESSION_INFO: Record<CraftingProfession, { name: string; icon: string; description: string; color: string }> = {
  blacksmithing: { name: 'Blacksmithing', icon: '\u2692\uFE0F', description: 'Forge weapons and armor', color: '#e74c3c' },
  alchemy:       { name: 'Alchemy',       icon: '\u{1F9EA}', description: 'Brew potions and elixirs', color: '#9b59b6' },
  cooking:       { name: 'Cooking',       icon: '\u{1F373}', description: 'Prepare meals and snacks', color: '#e67e22' },
  enchanting:    { name: 'Enchanting',    icon: '\u2728',    description: 'Imbue gear with magic', color: '#3498db' },
  trap_making:   { name: 'Trap Making',   icon: '\u{1FAA4}', description: 'Build traps and gadgets', color: '#2ecc71' },
};

// ─── Materials & Loot Types ─────────────────────────────────────────────

export type MaterialCategory = 'metal' | 'herb' | 'monster_part' | 'arcane' | 'seal';
export type MaterialTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type LootSource = 'combat' | 'puzzle' | 'chest' | 'exploration' | 'boss' | 'manual';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  tier: MaterialTier;
  icon: string | null;
  legoToken: string | null;
  dropLevelMin: number;
  description: string | null;
}

export interface CharacterMaterial {
  characterId: string;
  materialId: string;
  quantity: number;
  materialName: string;
  category: MaterialCategory;
  tier: MaterialTier;
  icon: string | null;
  legoToken: string | null;
}

export interface LootDrop {
  tier: string;
  category: string;
  qty: number;
}

export interface EncounterLootEntry {
  id: string;
  sessionId: string | null;
  encounterName: string | null;
  characterId: string | null;
  materialId: string | null;
  quantity: number;
  rollValue: number | null;
  source: LootSource;
  createdAt: string;
}

export const TIER_COLORS: Record<MaterialTier, string> = {
  common:    '#22c55e',
  uncommon:  '#3b82f6',
  rare:      '#eab308',
  epic:      '#a855f7',
  legendary: '#ef4444',
};

export const CATEGORY_ICONS: Record<MaterialCategory, string> = {
  metal:        '\u26CF\uFE0F',
  herb:         '\u{1F33F}',
  monster_part: '\u{1F9B4}',
  arcane:       '\u2728',
  seal:         '\u{1F52E}',
};
