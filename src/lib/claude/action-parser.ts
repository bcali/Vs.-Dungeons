// Parse Claude response → game state updates

import type { ClaudeResponse, ClaudeActionResponse } from '@/types/combat';

/** Parse the raw text response from Claude into a typed object */
export function parseClaudeResponse(responseText: string): ClaudeResponse {
  // Strip markdown code fences if present
  const cleaned = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  return JSON.parse(cleaned) as ClaudeResponse;
}

/** Type guard: check if Claude understood the action */
export function isActionResponse(response: ClaudeResponse): response is ClaudeActionResponse {
  return response.understood === true;
}
