// Combat-specific types

import type { Stats, ItemType } from './game';

export type ActionType = 'melee_attack' | 'ranged_attack' | 'ability' | 'item' | 'defend' | 'help' | 'move' | 'other';
export type EffectCategory = 'buff' | 'debuff' | 'cc' | 'dot' | 'hot';
export type CombatStatus = 'setup' | 'active' | 'rewards' | 'completed' | 'abandoned';
export type Team = 'hero' | 'enemy';

export interface CombatAbility {
  id: string;
  name: string;
  tier: number;
  slotCost: number;
  damage?: string;
  effect?: string;
  range?: string;
  aoe?: string;
  description: string;
  source: 'ability' | 'skill';
}

export interface MonsterSpecialAbility {
  name: string;
  description: string;
  isOneTime?: boolean;
}

export interface CombatInventoryItem {
  id: string;
  itemName: string;
  itemType: ItemType;
  quantity: number;
  effectJson: Record<string, unknown> | null;
}

export interface CombatParticipant {
  id: string;
  displayName: string;
  team: Team;
  characterId?: string;
  monsterId?: string;
  stats: Stats;
  maxHp: number;
  currentHp: number;
  spellSlotsMax: number;
  spellSlotsUsed: number;
  mov: number;
  initiativeRoll: number;
  isActive: boolean;
  isDefending: boolean;
  statusEffects: ActiveStatusEffect[];
  avatarUrl?: string;
  isBoss: boolean;
  isMinion?: boolean;
  heroSurgeAvailable?: boolean;
  abilities?: CombatAbility[];
  specialAbilities?: MonsterSpecialAbility[];
  usedAbilityNames?: string[];
  inventory?: CombatInventoryItem[];
  itemUsedThisTurn?: boolean;
}

export interface ActiveStatusEffect {
  id: string;
  effectType: string;
  category: EffectCategory;
  remainingTurns: number | null;
  value: Record<string, unknown>;
  iconName: string;
  displayName: string;
  description?: string;
  sourceParticipantId?: string;
}

export interface ActionLogEntry {
  id: string;
  timestamp: Date;
  roundNumber: number;
  actorId: string;
  actorName: string;
  actionType: ActionType;
  abilityName?: string;
  itemName?: string;
  targets: { id: string; name: string }[];
  roll?: number;
  targetNumber?: number;
  success?: boolean;
  damage?: number;
  healing?: number;
  effectsApplied?: string[];
  resourceSpent?: number;
  narration?: string;
  narrationShort?: string;
  voiceTranscript?: string;
}

// Claude API response types
export interface ClaudeActionResponse {
  understood: true;
  action: {
    type: ActionType;
    name: string;
    actorId: string;
    targetIds: string[];
    roll: number;
    targetNumber: number;
    hit: boolean;
    isCritical: boolean;
    isCriticalMiss: boolean;
  };
  results: ClaudeActionResult[];
  narration: string;
  narrationShort: string;
  slotsUsed?: number;
  turnComplete: boolean;
}

export interface ClaudeClarificationResponse {
  understood: false;
  clarificationNeeded: string;
  suggestions: string[];
}

export type ClaudeResponse = ClaudeActionResponse | ClaudeClarificationResponse;

export interface ClaudeActionResult {
  participantId: string;
  hpChange: number;
  slotsUsed: number;
  newEffects: ActiveStatusEffect[];
  removedEffects: string[];
}
