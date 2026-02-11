import { Profession, Stats, ResourceType } from './game';

export type Profession = 'Knight' | 'Wizard' | 'Ranger' | 'Healer' | 'Rogue' | 'Inventor';

export type StatName = 'CON' | 'STR' | 'AGI' | 'MNA' | 'INT' | 'LCK';

export interface Stats {
  CON: number;
  STR: number;
  AGI: number;
  MNA: number;
  INT: number;
  LCK: number;
}

export type ResourceType = 'rage' | 'energy' | 'mana';

export interface Ability {
  id: string;
  name: string;
  cost: number;
  resourceType?: ResourceType; // Optional if not matching main resource or if generic
  cooldown: number; // max turns
  description?: string;
  range?: number; // tiles
  damage?: string;
}

export interface Hero {
  id: string;
  name: string;
  playerName?: string;
  profession: Profession;
  level: number;
  stats: Stats;
  movement: number;
  abilities: Ability[];
  hp: {
    current: number;
    max: number;
  };
  xp: {
    current: number;
    max: number;
  };
  resource?: {
    type: ResourceType;
    current: number;
    max: number;
  };
  availableStatPoints: number;
  availableSkillPoints: number;
  gold: number;
  avatarUrl?: string;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  isBoss?: boolean;
  movement: number;
  abilities: Ability[];
  hp: {
    current: number;
    max: number;
  };
  resource?: {
    type: ResourceType;
    current: number;
    max: number;
  };
  stats?: Partial<Stats>; // Monsters might not have full stats
  xpReward: number;
}

export interface Combatant {
  id: string; // matches hero/enemy id
  instanceId: string; // unique for this combat (e.g. multiple goblins)
  type: 'hero' | 'enemy';
  name: string;
  movement: number;
  abilities: (Ability & { currentCooldown: number })[];
  hp: { current: number; max: number };
  resource?: { type: ResourceType; current: number; max: number };
  initiative: number;
  statusEffects: StatusEffect[];
  isKO: boolean;
  isBoss?: boolean;
  profession?: Profession; // for heroes
}

export type StatusCategory = 'buff' | 'debuff' | 'cc' | 'dot' | 'hot';

export interface StatusEffect {
  id: string;
  name: string;
  category: StatusCategory;
  remainingTurns: number;
  description?: string;
}

export interface Encounter {
  id: string;
  name: string;
  enemies: { enemyId: string; count: number }[];
  status: 'setup' | 'active' | 'victory' | 'defeat';
}
