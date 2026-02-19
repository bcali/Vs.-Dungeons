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
const CLAUDE_TIMEOUT_MS = 8000; // Stay under Vercel's 10s limit

export async function POST(request: Request) {
  try {
    return await handlePost(request);
  } catch (err) {
    console.error('[combat/action] Unhandled error:', err);
    return fallbackResponse('unhandled: ' + (err instanceof Error ? err.message : String(err)));
  }
}

async function handlePost(request: Request) {
  const startTime = Date.now();

  // --- Auth ---
  const authError = validateAppKey(request);
  if (authError) return authError;

  // --- Rate limiting (10 requests/minute) ---
  let rateLimitError: Response | null = null;
  try {
    rateLimitError = await rateLimit(request, { maxRequests: 10, windowMs: 60_000 });
  } catch (err) {
    console.warn('[combat/action] Rate limiter threw, allowing request:', err);
  }
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
    console.warn('[combat/action] Schema validation failed:', parsed.error.issues);
    return Response.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { transcript, combatState } = parsed.data;

  // --- Claude API with retry + timeout ---
  let lastFailReason = 'unknown';
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const anthropic = getAnthropicClient();

      // Abort if Claude takes too long (stay under Vercel's 10s timeout)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CLAUDE_TIMEOUT_MS);

      const claudeStart = Date.now();
      let message;
      try {
        message = await anthropic.messages.create(
          {
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
          },
          { signal: controller.signal },
        );
      } finally {
        clearTimeout(timeout);
      }
      const claudeMs = Date.now() - claudeStart;
      console.info(`[combat/action] Claude responded in ${claudeMs}ms (model: ${CLAUDE_MODEL}, attempt: ${attempt + 1})`);

      const responseText = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      const rawParsed = parseClaudeResponse(responseText);

      // --- Validate response schema ---
      const validated = ClaudeResponseSchema.safeParse(rawParsed);
      if (!validated.success) {
        const issues = JSON.stringify(validated.error.issues).slice(0, 300);
        console.warn(`[combat/action] Schema validation failed (attempt ${attempt + 1}):`, issues);
        lastFailReason = `schema: ${issues}`;
        if (attempt < MAX_RETRIES) continue;
        return fallbackResponse(lastFailReason);
      }

      // --- Validate game logic (if action was understood) ---
      if (validated.data.understood === true) {
        const logicErrors = validateCombatResponse(
          validated.data as unknown as ClaudeActionResponse,
          combatState.participants as unknown as CombatParticipant[]
        );

        // Separate hard errors from soft warnings
        const hardErrors = logicErrors.filter(e => !e.startsWith('[warn]'));
        const warnings = logicErrors.filter(e => e.startsWith('[warn]'));

        if (warnings.length > 0) {
          console.info('[combat/action] Validation warnings (non-blocking):', warnings);
        }

        if (hardErrors.length > 0) {
          console.warn(`[combat/action] Logic errors (attempt ${attempt + 1}):`, hardErrors);
          lastFailReason = `logic: ${hardErrors.join('; ')}`;
          if (attempt < MAX_RETRIES) continue;
          return fallbackResponse(lastFailReason);
        }
      }

      console.info(`[combat/action] Success in ${Date.now() - startTime}ms total`);
      return Response.json(validated.data);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errName = error instanceof Error ? error.constructor.name : 'Unknown';
      lastFailReason = `${errName}: ${errMsg}`;
      console.error(`[combat/action] Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed:`, lastFailReason);

      // Client errors (bad model, bad key, etc.) won't succeed on retry — bail now
      const isClientError = (
        error instanceof Anthropic.BadRequestError ||
        error instanceof Anthropic.AuthenticationError ||
        error instanceof Anthropic.PermissionDeniedError ||
        error instanceof Anthropic.NotFoundError
      );
      if (isClientError) {
        return fallbackResponse(lastFailReason);
      }

      // Retry all transient errors (rate limits, network, timeout, 5xx)
      if (attempt < MAX_RETRIES) {
        const isRateLimit = error instanceof Anthropic.RateLimitError;
        const backoffMs = isRateLimit
          ? Math.pow(3, attempt) * 1000  // 1s, 3s for rate limits
          : (attempt + 1) * 500;          // 500ms, 1s for other transient errors
        await new Promise(r => setTimeout(r, backoffMs));
        continue;
      }

      return fallbackResponse(lastFailReason);
    }
  }

  console.error(`[combat/action] All ${MAX_RETRIES + 1} attempts failed. Last: ${lastFailReason}. Total: ${Date.now() - startTime}ms`);
  return fallbackResponse(lastFailReason);
}

function fallbackResponse(reason?: string) {
  const isDev = process.env.NODE_ENV !== 'production';
  const debugInfo = (reason && isDev) ? ` [Debug: ${reason.slice(0, 200)}]` : '';
  return Response.json(
    {
      understood: false,
      clarificationNeeded: `Something went wrong resolving that action. Try again or enter the result manually.${debugInfo}`,
      suggestions: [],
    },
    { status: 502 }
  );
}
