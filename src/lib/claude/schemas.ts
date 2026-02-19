// Zod validation schemas for Claude API request/response

import { z } from 'zod';

// --- Request validation (validates client payload before hitting Claude) ---

export const CombatActionRequestSchema = z.object({
  transcript: z.string().min(1).max(1000),
  combatState: z.object({
    roundNumber: z.number().int().min(1),
    participants: z.array(z.object({
      id: z.string(),
      displayName: z.string(),
      team: z.enum(['hero', 'enemy']),
      currentHp: z.number().int(),
      maxHp: z.number().int().positive(),
      stats: z.object({
        str: z.number().int().default(0), spd: z.number().int().default(0),
        tgh: z.number().int().default(0), smt: z.number().int().default(0),
      }).passthrough(),
      spellSlotsMax: z.number().int(),
      spellSlotsUsed: z.number().int(),
      mov: z.number().int(),
      isActive: z.boolean(),
      isDefending: z.boolean().optional(),
      statusEffects: z.array(z.any()).optional(),
    }).passthrough()),
    initiativeOrder: z.array(z.string()),
    currentTurnIndex: z.number().int().min(0),
  }).passthrough(),
});

// --- Response validation (validates Claude's output before applying to state) ---

const EffectSchema = z.object({
  effectType: z.string(),
  category: z.enum(['buff', 'debuff', 'cc', 'dot', 'hot']),
  displayName: z.string(),
  iconName: z.string(),
  duration: z.number().int().min(0).nullable(),
  value: z.record(z.string(), z.unknown()),
});

const ActionResultSchema = z.object({
  participantId: z.string(),
  hpChange: z.number().int(),
  slotsUsed: z.number().int(),
  newEffects: z.array(EffectSchema),
  removedEffects: z.array(z.string()),
});

const UnderstoodResponseSchema = z.object({
  understood: z.literal(true),
  action: z.object({
    type: z.string(),
    name: z.string(),
    actorId: z.string(),
    targetIds: z.array(z.string()),
    roll: z.number().int().min(1).max(20).nullable(),
    targetNumber: z.number().int().nullable(),
    hit: z.boolean().nullable(),
    isCritical: z.boolean(),
    isCriticalMiss: z.boolean(),
  }),
  results: z.array(ActionResultSchema),
  narration: z.string(),
  narrationShort: z.string(),
  slotsUsed: z.number().int().optional(),
  turnComplete: z.boolean(),
});

const ClarificationResponseSchema = z.object({
  understood: z.literal(false),
  clarificationNeeded: z.string(),
  suggestions: z.array(z.string()).optional(),
});

export const ClaudeResponseSchema = z.discriminatedUnion('understood', [
  UnderstoodResponseSchema,
  ClarificationResponseSchema,
]);

export type ValidatedClaudeResponse = z.infer<typeof ClaudeResponseSchema>;
