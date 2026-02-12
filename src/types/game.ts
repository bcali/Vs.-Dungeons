// Core game types — Characters, Monsters, Abilities, Items

export type Profession = 'knight' | 'ranger' | 'wizard' | 'healer' | 'rogue' | 'inventor';
export type Rank = 'Starting Hero' | 'Apprentice' | 'Adventurer' | 'Veteran' | 'Champion' | 'Hero' | 'Legend' | 'Mythic' | 'LEGENDARY';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
export type SealTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type MonsterCategory = 'undead' | 'beast' | 'humanoid' | 'elemental' | 'construct' | 'demon';
export type DamageType = 'physical' | 'fire' | 'ice' | 'poison' | 'holy' | 'lightning';

export interface Stats {
  str: number;  // Strength — melee damage, physical power
  spd: number;  // Speed — initiative, ranged defense, dodge
  tgh: number;  // Toughness — HP, melee defense, endurance
  smt: number;  // Smarts — spell power, puzzles, perception
}

export const STAT_KEYS = ['str', 'spd', 'tgh', 'smt'] as const;
export type StatKey = (typeof STAT_KEYS)[number];

export const STAT_LABELS: Record<StatKey, { abbr: string; name: string; description: string }> = {
  str: { abbr: 'STR', name: 'Strength', description: 'Melee damage, lifting, breaking things' },
  spd: { abbr: 'SPD', name: 'Speed', description: 'Turn order, dodging, ranged accuracy, ranged defense' },
  tgh: { abbr: 'TGH', name: 'Toughness', description: 'Hit Points, melee defense, endurance' },
  smt: { abbr: 'SMT', name: 'Smarts', description: 'Spell power, puzzles, perception, crafting' },
};

export const PROFESSION_INFO: Record<Profession, { name: string; role: string; bestStats: string; abilityFlavor: string }> = {
  knight:   { name: 'Knight',   role: 'Tank / Frontline',    bestStats: 'STR + TGH', abilityFlavor: 'Battle Cries' },
  ranger:   { name: 'Ranger',   role: 'Ranged / Scout',      bestStats: 'SPD + SMT', abilityFlavor: 'Techniques' },
  wizard:   { name: 'Wizard',   role: 'Damage Caster',       bestStats: 'SMT + TGH', abilityFlavor: 'Spells' },
  healer:   { name: 'Healer',   role: 'Support',             bestStats: 'SMT + TGH', abilityFlavor: 'Prayers' },
  rogue:    { name: 'Rogue',    role: 'Stealth / Burst',     bestStats: 'SPD + STR', abilityFlavor: 'Tricks' },
  inventor: { name: 'Inventor', role: 'Gadgets / Summons',   bestStats: 'SMT + SPD', abilityFlavor: 'Blueprints' },
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
  stats: Stats;
  gearBonus: Stats;
  unspentStatPoints: number;
  currentHp: number | null;
  spellSlotsUsed: number;
  mov: number;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ability {
  id: string;
  name: string;
  profession: string;
  tier: number;
  slotCost: number;
  unlockLevel: number;
  description: string;
  range: string;
  aoe: string;
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
  mov: number;
  attackRange: string;
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

export interface ShopItem {
  id: string;
  questName: string;
  catalogItemId: string;
  price: number;
  stock: number;       // -1 = unlimited, 0 = sold out
  sortOrder: number;
  // Joined from item_catalog:
  name: string;
  itemType: ItemType;
  rarity: CatalogItem['rarity'];
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
  tier: MaterialTier | 'gold';
  category?: MaterialCategory | 'any';
  qty: number;
}

export interface LootTableRow {
  id: string;
  levelMin: number;
  levelMax: number;
  isBoss: boolean;
  rollMin: number;
  rollMax: number;
  drops: LootDrop[];
  description: string | null;
}

export interface EnemyLootRoll {
  enemyName: string;
  enemyLevel: number;
  isBoss: boolean;
  d20Roll: number;
  drops: ResolvedDrop[];
}

export interface ResolvedDrop {
  material: Material;
  quantity: number;
}

export interface EncounterLootResult {
  encounterName: string;
  rolls: EnemyLootRoll[];
  totalDrops: ResolvedDrop[];
  goldEarned: number;
}

export interface CharacterInventoryItem {
  characterId: string;
  materialId: string;
  quantity: number;
  materialName: string;
  category: MaterialCategory;
  tier: MaterialTier;
  icon: string | null;
  legoToken: string | null;
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

export interface DefeatedEnemy {
  name: string;
  level: number;
  isBoss: boolean;
}

export interface LootAssignment {
  characterId: string;
  materials: ResolvedDrop[];
  gold: number;
}

export interface LootEngineCache {
  materials: Material[];
  lootTables: LootTableRow[];
}

export const TIER_ORDER: Record<MaterialTier, number> = {
  legendary: 1,
  epic: 2,
  rare: 3,
  uncommon: 4,
  common: 5,
};

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

// ─── Equipment System ─────────────────────────────────────────────────

export type EquipmentSlot = 'head' | 'chest' | 'hands' | 'feet' | 'weapon' | 'shield' | 'ring' | 'trinket';
export type EquipmentRarity = 'common' | 'rare' | 'epic' | 'legendary';

export const EQUIPMENT_SLOTS: EquipmentSlot[] = ['head', 'chest', 'hands', 'feet', 'weapon', 'shield', 'ring', 'trinket'];

export const EQUIPMENT_SLOT_INFO: Record<EquipmentSlot, { name: string; icon: string; description: string; primaryStat: StatKey }> = {
  head:    { name: 'Head',    icon: '\u{1FA96}', description: 'Helmets, hoods, crowns',      primaryStat: 'smt' },
  chest:   { name: 'Chest',   icon: '\u{1F6E1}', description: 'Armor, robes, tunics',        primaryStat: 'tgh' },
  hands:   { name: 'Hands',   icon: '\u{1F9E4}', description: 'Gauntlets, gloves, bracers',  primaryStat: 'str' },
  feet:    { name: 'Feet',    icon: '\u{1F462}', description: 'Boots, greaves, sandals',     primaryStat: 'spd' },
  weapon:  { name: 'Weapon',  icon: '\u2694\uFE0F', description: 'Swords, bows, staffs, daggers', primaryStat: 'str' },
  shield:  { name: 'Shield',  icon: '\u{1F6E1}\uFE0F', description: 'Shields, bucklers, wards',   primaryStat: 'tgh' },
  ring:    { name: 'Ring',    icon: '\u{1F48D}', description: 'Enchanted rings',             primaryStat: 'smt' },
  trinket: { name: 'Trinket', icon: '\u{1F4FF}', description: 'Amulets, charms, tokens',    primaryStat: 'spd' },
};

export const RARITY_STAT_COUNT: Record<EquipmentRarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export const EQUIPMENT_RARITY_INFO: Record<EquipmentRarity, { name: string; color: string; borderGlow: string }> = {
  common:    { name: 'Common',    color: '#22c55e', borderGlow: 'rgba(34, 197, 94, 0.3)' },
  rare:      { name: 'Rare',      color: '#eab308', borderGlow: 'rgba(234, 179, 8, 0.3)' },
  epic:      { name: 'Epic',      color: '#a855f7', borderGlow: 'rgba(168, 85, 247, 0.3)' },
  legendary: { name: 'Legendary', color: '#ef4444', borderGlow: 'rgba(239, 68, 60, 0.4)' },
};

export interface SpecialEffect {
  id: string;
  name: string;
  description: string;
  effectType: 'damage_boost' | 'damage_reduction' | 'heal_per_turn' | 'ability_boost' | 'all_stats' | 'crit_chance';
  value: number;
  targetAbility?: string;
}

export interface EquipmentTemplate {
  id: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  levelMin: number;
  levelMax: number;
  nameTemplate: string;
  materialPrefix: string;
  statAllocations: Partial<Stats>;
  specialEffect: SpecialEffect | null;
}

export interface CharacterEquipmentItem {
  id: string;
  characterId: string;
  templateId: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  level: number;
  statBonuses: Partial<Stats>;
  specialEffect: SpecialEffect | null;
  equippedSlot: EquipmentSlot | null;
  createdAt: string;
}

export interface EquipmentRecipe {
  id: string;
  templateId: string;
  requiredLevel: number;
  craftingProfession: CraftingProfession;
  materialCosts: { materialId: string; quantity: number }[];
  sealCosts: Partial<Record<SealTier, number>>;
}

export interface CraftingCost {
  materials: { tier: MaterialTier; quantity: number }[];
  seals: Partial<Record<SealTier, number>>;
}
