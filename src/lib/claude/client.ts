// Claude API wrapper for combat resolution

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
export const CLAUDE_MAX_TOKENS = 512;
