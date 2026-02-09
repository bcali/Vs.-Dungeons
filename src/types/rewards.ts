import type { ItemType } from './game';

export interface RewardItem {
  itemName: string;
  itemType: ItemType;
  quantity: number;
  effectJson?: Record<string, unknown> | null;
}

export interface RewardAllocation {
  characterId: string;
  heroName: string;
  xpEarned: number;
  goldEarned: number;
  items: RewardItem[];
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
}

export interface BattleRewardsSummary {
  encounterName: string;
  enemiesDefeated: { name: string; xpReward: number; isBoss: boolean }[];
  enemiesSurvived: { name: string }[];
  totalXp: number;
  xpPerHero: number;
  heroCount: number;
  allocations: RewardAllocation[];
}
