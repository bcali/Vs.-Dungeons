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
