# 🤖 CLAUDE API INTEGRATION — Voice Pipeline & Combat Resolution

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser     │     │  Next.js API │     │  Claude API  │
│   (iPad)      │     │  Server      │     │  (Anthropic) │
│               │     │              │     │              │
│ Web Speech ──►│────►│ /api/combat/ │────►│  Sonnet 4.5  │
│ API           │     │ action       │     │              │
│               │◄────│              │◄────│  Returns     │
│ UI Update     │     │ Parse JSON   │     │  structured  │
│               │     │              │     │  JSON        │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Voice Input Pipeline

### Step 1: Speech Recognition (Browser)

Using the Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`).

```typescript
// lib/voice/speech-recognition.ts

interface VoiceInputConfig {
  language: string;        // 'en-US'
  continuous: boolean;     // false (single utterance)
  interimResults: boolean; // true (show live transcript)
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
}

// Key behaviors:
// - Tap mic button → start listening
// - Show interim results in real-time (gray text)
// - On final result → show transcript for confirmation
// - GM can edit transcript before sending
// - Tap "Send" or auto-send after 2s silence
// - Tap mic again to cancel

// Error handling:
// - "no-speech" → prompt GM to try again
// - "audio-capture" → check mic permissions
// - "not-allowed" → guide to enable mic in Safari settings
// - Any error → fall back to text input
```

### Step 2: Transcript → API Route

```typescript
// POST /api/combat/action
{
  "transcript": "Hero 1 uses Shield Slam on Goblin 2, rolled 14",
  "combatState": {
    "roundNumber": 2,
    "participants": [ /* full participant array */ ],
    "initiativeOrder": ["hero_1", "goblin_2", "hero_2", "goblin_1"],
    "currentTurnIndex": 0
  },
  "gameConfig": {
    "meleeDefenseFormula": "target_STR + 8",
    "rangedDefenseFormula": "target_AGI + 8",
    "defendBonus": 4,
    "critRange": { /* per-participant */ }
  }
}
```

### Step 3: Build Claude Request

```typescript
// lib/claude/client.ts

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  system: COMBAT_SYSTEM_PROMPT,  // see below
  messages: [
    {
      role: "user",
      content: buildCombatMessage(transcript, combatState, gameConfig)
    }
  ]
});
```

### Step 4: Parse Response → State Updates

Claude returns structured JSON that the client can directly apply to the Zustand combat store.

---

## Combat System Prompt

This is the system prompt sent with every combat action request. It contains condensed game rules so Claude can correctly resolve actions.

```typescript
// lib/claude/combat-prompt.ts

export const COMBAT_SYSTEM_PROMPT = `
You are the combat resolution engine for LEGO QUEST, a tabletop RPG for kids ages 7 and 9. You receive a voice transcript of the Game Master describing an action, plus the full combat state. You resolve the action according to the rules and return structured JSON.

## GAME RULES

### Stats
Every combatant has 6 stats: CON (constitution), STR (strength), AGI (agility), MNA (mana), INT (intelligence), LCK (luck).
Stat Bonus = Stat - 3.
HP = CON × 3.

### Attack Resolution
- Melee Attack: d20 + attacker's STR bonus vs target's STR + 8. Hit = attacker's STR damage (or weapon/ability damage).
- Ranged Attack: d20 + attacker's AGI bonus vs target's AGI + 8. Hit = weapon damage.
- Ability: uses the ability's specific rules. Cost deducted from attacker's resource pool.
- If target is Defending: add +4 to their defense target number.

### Critical Hits
Nat 20 always crits. Check attacker's LCK for expanded crit range:
- LCK 5+ → crit on 19-20
- LCK 8+ → crit on 18-20
- LCK 12+ → crit on 17-20
Critical hit = double damage + describe something awesome.

### Critical Miss
Nat 1 = auto-miss. Describe something funny, never punishing.

### Resources
- Rage (Knight): +15 on hit taken, +10 on melee hit landed, +25 on crit taken, +20 on ally KO. Max 100. Starts at 0.
- Energy (Rogue): +20 per turn passive. Max 100.
- Mana (Wizard/Healer/Ranger/Inventor): +20 per turn passive. Max = MNA × 15.

### Status Effects
When applying effects, include: type, category (buff/debuff/cc/dot/hot), duration in turns, and any values.

### Difficulty Targets
Easy: 8, Medium: 12, Hard: 16, Epic: 20.

### KO Rules
At 0 HP: knocked out, not dead. Can be revived by ally action (1 HP) or ability/potion.

## YOUR TASK

Given the GM's voice transcript and current combat state, resolve the action and return ONLY valid JSON in this exact format:

\`\`\`json
{
  "understood": true,
  "action": {
    "type": "melee_attack|ranged_attack|ability|item|defend|help|move|other",
    "name": "Shield Slam",
    "actorId": "participant_id",
    "targetIds": ["participant_id"],
    "roll": 14,
    "targetNumber": 10,
    "hit": true,
    "isCritical": false,
    "isCriticalMiss": false
  },
  "results": [
    {
      "participantId": "target_id",
      "hpChange": -3,
      "resourceChange": 0,
      "newEffects": [
        {
          "effectType": "stun",
          "category": "cc",
          "displayName": "Stunned",
          "iconName": "stun",
          "duration": 1,
          "value": {}
        }
      ],
      "removedEffects": []
    },
    {
      "participantId": "actor_id",
      "hpChange": 0,
      "resourceChange": -30,
      "newEffects": [],
      "removedEffects": []
    }
  ],
  "narration": "Sir Bricksworth raises his shield and SLAMS it into the goblin scout! CLANG! The goblin goes spinning across the cave floor, dazed and confused! That's 3 damage and the goblin is STUNNED!",
  "narrationShort": "Shield Slam hits Goblin 2 for 3 damage + Stun!",
  "rageGenerated": 10,
  "turnComplete": true
}
\`\`\`

If the transcript is unclear, return:
\`\`\`json
{
  "understood": false,
  "clarificationNeeded": "I heard 'Hero 1 uses... on Goblin'. Which ability? And which Goblin (1 or 2)?",
  "suggestions": ["Shield Slam on Goblin 1", "Shield Slam on Goblin 2", "War Shout (targets all allies)"]
}
\`\`\`

## IMPORTANT RULES FOR NARRATION
- Be cinematic and fun. These are kids aged 7 and 9.
- Critical hits: go BIG. Sound effects in caps. "CRAAAASH!" "KABOOM!"
- Critical misses: funny, never mean. "The arrow flies wide and bonks a nearby mushroom."
- Keep narration to 2-3 sentences max.
- Use the character's name, not "Hero 1".
- Give monsters personality in narration (goblins are sneaky, skeletons rattle, slimes giggle).
`;
```

---

## User Message Builder

```typescript
// lib/claude/combat-prompt.ts

export function buildCombatMessage(
  transcript: string,
  combatState: CombatState,
  gameConfig: GameConfig
): string {
  const currentActor = combatState.participants.find(
    p => p.id === combatState.initiativeOrder[combatState.currentTurnIndex]
  );

  return `
## CURRENT COMBAT STATE

Round: ${combatState.roundNumber}
Current Turn: ${currentActor?.displayName} (${currentActor?.team})

### All Combatants:
${combatState.participants.map(p => `
**${p.displayName}** (${p.team}) [ID: ${p.id}]
- HP: ${p.currentHp}/${p.maxHp} ${p.isActive ? '' : '(KNOCKED OUT)'}
- Stats: CON ${p.stats.con}, STR ${p.stats.str}, AGI ${p.stats.agi}, MNA ${p.stats.mna}, INT ${p.stats.int}, LCK ${p.stats.lck}
${p.resourceType ? `- ${p.resourceType}: ${p.currentResource}/${p.maxResource}` : ''}
${p.isDefending ? '- DEFENDING (+4 to defense)' : ''}
${p.statusEffects.length > 0 ? `- Effects: ${p.statusEffects.map(e => `${e.displayName}(${e.remainingTurns}t)`).join(', ')}` : ''}
${p.team === 'hero' ? `- Known Abilities: ${getAbilityList(p)}` : ''}
`).join('\n')}

### GM's Voice Command:
"${transcript}"

Resolve this action according to the game rules. Return only valid JSON.
`;
}
```

---

## API Route Handler

```typescript
// app/api/combat/action/route.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const { transcript, combatState, gameConfig } = await request.json();

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: COMBAT_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: buildCombatMessage(transcript, combatState, gameConfig)
      }]
    });

    // Extract JSON from response
    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    const parsed = JSON.parse(
      responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    );

    return Response.json(parsed);

  } catch (error) {
    console.error('Claude API error:', error);
    return Response.json(
      {
        understood: false,
        clarificationNeeded: "Sorry, I had trouble processing that. Could you try again or type the action?",
        error: true
      },
      { status: 500 }
    );
  }
}
```

---

## Response Parser & State Applicator

```typescript
// lib/claude/action-parser.ts

export function applyResolvedAction(
  store: CombatStore,
  response: ClaudeActionResponse
): void {
  if (!response.understood) {
    // Show clarification UI
    store.showClarification(response.clarificationNeeded, response.suggestions);
    return;
  }

  // Apply each result
  for (const result of response.results) {
    if (result.hpChange !== 0) {
      if (result.hpChange < 0) {
        store.applyDamage(result.participantId, Math.abs(result.hpChange));
      } else {
        store.applyHealing(result.participantId, result.hpChange);
      }
    }

    if (result.resourceChange !== 0) {
      const participant = store.getParticipant(result.participantId);
      store.setResource(
        result.participantId,
        (participant?.currentResource ?? 0) + result.resourceChange
      );
    }

    for (const effect of result.newEffects) {
      store.applyEffect(result.participantId, effect);
    }

    for (const effectId of result.removedEffects) {
      store.removeEffect(result.participantId, effectId);
    }
  }

  // Handle rage generation (Knight-specific)
  if (response.rageGenerated && response.action.actorId) {
    const actor = store.getParticipant(response.action.actorId);
    if (actor?.resourceType === 'rage') {
      store.setResource(
        response.action.actorId,
        Math.min((actor.currentResource ?? 0) + response.rageGenerated, actor.maxResource ?? 100)
      );
    }
  }

  // Add to action log
  store.addLogEntry({
    actorId: response.action.actorId,
    actionType: response.action.type,
    abilityName: response.action.name,
    targets: response.action.targetIds,
    roll: response.action.roll,
    targetNumber: response.action.targetNumber,
    success: response.action.hit,
    narration: response.narration,
    narrationShort: response.narrationShort,
  });

  // Advance turn if action is complete
  if (response.turnComplete) {
    store.advanceTurn();
  }
}
```

---

## Voice Input Component

```typescript
// components/combat/VoiceInput.tsx

// States:
// 1. IDLE — Mic button visible, "Tap to Speak"
// 2. LISTENING — Pulsing red mic, interim transcript showing
// 3. CONFIRMING — Final transcript shown, "Send" / "Edit" / "Cancel"
// 4. PROCESSING — Spinner, "Claude is thinking..."
// 5. RESOLVED — Action applied, narration displayed
// 6. CLARIFICATION — Claude needs more info, show suggestions
// 7. ERROR — Something went wrong, show retry

// Visual feedback:
// - LISTENING: mic icon pulses red, ripple animation
// - CONFIRMING: transcript in editable text field
// - PROCESSING: loading spinner with "Resolving action..."
// - RESOLVED: green checkmark, narration fades in
```

---

## Optional: Text-to-Speech for Narration

```typescript
// lib/voice/speech-synthesis.ts

export function speakNarration(text: string, options?: SpeechOptions): void {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;    // slightly slower for drama
  utterance.pitch = 1.0;
  utterance.volume = 0.8;

  // Use a "storyteller" voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Daniel') || v.name.includes('Samantha'));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

// Can be toggled on/off in settings
// Useful for cinematic moments, crit narrations
// Skip for routine actions to maintain pace
```

---

## Token & Cost Estimation

Each combat action request sends approximately:
- System prompt: ~800 tokens
- Combat state (10 combatants): ~600 tokens
- User message: ~100 tokens
- **Total input: ~1,500 tokens per action**
- **Output: ~300 tokens per response**

For a typical session (20–30 combat actions):
- ~45,000 input tokens + ~9,000 output tokens
- At Sonnet 4.5 pricing: approximately $0.20–0.30 per session
- Very affordable for personal use

---

## Error Handling Matrix

| Scenario | Handling |
|----------|---------|
| Mic permission denied | Show setup guide, fall back to text |
| Speech not recognized | Show "Didn't catch that" + retry button |
| Claude API timeout | Retry once, then fall back to manual |
| Claude returns malformed JSON | Retry with "Please return only valid JSON" |
| Claude doesn't understand action | Show clarification UI with suggestions |
| Rate limit hit | Queue action, retry after delay |
| Network offline | Show offline indicator, manual mode only |
| Invalid game state in response | Validate before applying, reject impossible values (negative HP below 0, etc.) |
