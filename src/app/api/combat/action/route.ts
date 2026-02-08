// POST /api/combat/action — Claude AI combat resolution

import { getAnthropicClient, CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '@/lib/claude/client';
import { COMBAT_SYSTEM_PROMPT, buildCombatMessage } from '@/lib/claude/combat-prompt';
import { parseClaudeResponse } from '@/lib/claude/action-parser';
import type { CombatParticipant } from '@/types/combat';

interface CombatActionRequest {
  transcript: string;
  combatState: {
    roundNumber: number;
    participants: CombatParticipant[];
    initiativeOrder: string[];
    currentTurnIndex: number;
  };
}

export async function POST(request: Request) {
  const { transcript, combatState } = (await request.json()) as CombatActionRequest;

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
            participants: combatState.participants,
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

    const parsed = parseClaudeResponse(responseText);
    return Response.json(parsed);
  } catch (error) {
    console.error('Claude API error:', error);
    return Response.json(
      {
        understood: false,
        clarificationNeeded:
          'Sorry, I had trouble processing that. Could you try again or type the action?',
        suggestions: [],
        error: true,
      },
      { status: 500 }
    );
  }
}
