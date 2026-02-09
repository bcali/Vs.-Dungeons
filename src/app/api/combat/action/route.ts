// POST /api/combat/action — Claude AI combat resolution
// Protected with API key auth, rate limiting, Zod validation, and retry logic

import { getAnthropicClient, CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '@/lib/claude/client';
import { COMBAT_SYSTEM_PROMPT, buildCombatMessage } from '@/lib/claude/combat-prompt';
import { parseClaudeResponse } from '@/lib/claude/action-parser';
import { validateAppKey } from '@/lib/auth/validate-key';
import { rateLimit } from '@/lib/auth/rate-limit';
import { CombatActionRequestSchema, ClaudeResponseSchema } from '@/lib/claude/schemas';
import { validateCombatResponse } from '@/lib/claude/validate-response';
import type { CombatParticipant } from '@/types/combat';
import type { ClaudeActionResponse } from '@/types/combat';
import Anthropic from '@anthropic-ai/sdk';

const MAX_RETRIES = 2;

export async function POST(request: Request) {
  // --- Auth ---
  const authError = validateAppKey(request);
  if (authError) return authError;

  // --- Rate limiting (10 requests/minute) ---
  const rateLimitError = await rateLimit(request, { maxRequests: 10, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  // --- Payload size ---
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 50_000) {
    return Response.json({ error: 'Payload too large' }, { status: 413 });
  }

  // --- Parse + validate input ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = CombatActionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { transcript, combatState } = parsed.data;

  // --- Claude API with retry + timeout ---
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const anthropic = getAnthropicClient();

      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: CLAUDE_MAX_TOKENS,
        system: COMBAT_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildCombatMessage({
              transcript,
              roundNumber: combatState.roundNumber,
              participants: combatState.participants as unknown as CombatParticipant[],
              initiativeOrder: combatState.initiativeOrder,
              currentTurnIndex: combatState.currentTurnIndex,
            }),
          },
        ],
      });

      const responseText = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      const rawParsed = parseClaudeResponse(responseText);

      // --- Validate response schema ---
      const validated = ClaudeResponseSchema.safeParse(rawParsed);
      if (!validated.success) {
        console.warn('Claude response failed schema validation:', validated.error.issues);
        if (attempt < MAX_RETRIES) continue;
        return fallbackResponse();
      }

      // --- Validate game logic (if action was understood) ---
      if (validated.data.understood === true) {
        const logicErrors = validateCombatResponse(
          validated.data as unknown as ClaudeActionResponse,
          combatState.participants as unknown as CombatParticipant[]
        );
        if (logicErrors.length > 0) {
          console.warn('Claude returned invalid game state:', logicErrors);
          if (attempt < MAX_RETRIES) continue;
          return fallbackResponse();
        }
      }

      return Response.json(validated.data);
    } catch (error: unknown) {
      const isRateLimit = error instanceof Anthropic.RateLimitError;

      if (isRateLimit && attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, Math.pow(3, attempt) * 1000));
        continue;
      }

      if (attempt >= MAX_RETRIES) {
        console.error('Claude API error after retries:', error);
        return fallbackResponse();
      }
    }
  }

  return fallbackResponse();
}

function fallbackResponse() {
  return Response.json(
    {
      understood: false,
      clarificationNeeded: 'Something went wrong resolving that action. Try again or enter the result manually.',
      suggestions: [],
    },
    { status: 502 }
  );
}
