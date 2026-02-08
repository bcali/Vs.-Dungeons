# 🏗️ ARCHITECTURE — System Architecture & Data Flow

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    iPad (Safari / PWA)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Character    │  │  Combat Tracker  │  │  GM Config   │  │
│  │  Sheet        │  │  + Voice Input   │  │  Dashboard   │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────┬───────┘  │
│         │                   │                    │          │
│         └───────────────────┼────────────────────┘          │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  Zustand Store  │                      │
│                    │  (Client State) │                      │
│                    └────────┬────────┘                      │
└─────────────────────────────┼───────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Next.js API       │
                    │  Routes (Server)   │
                    ├───────────────────┤
                    │ /api/claude       │ ◄── Claude API (combat resolution)
                    │ /api/voice        │ ◄── Voice transcript → Claude
                    │ /api/combat       │ ◄── Combat state CRUD
                    │ /api/characters   │ ◄── Character CRUD
                    │ /api/config       │ ◄── Game config CRUD
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼──────┐  ┌────▼─────┐  ┌──────▼──────┐
    │   Supabase     │  │ Claude   │  │ Web Speech  │
    │   (Postgres)   │  │ API      │  │ API         │
    │                │  │          │  │ (Browser)   │
    │ • Characters   │  │ Sonnet   │  │             │
    │ • Monsters     │  │ 4.5      │  │ Speech →    │
    │ • Combat logs  │  │          │  │ Text        │
    │ • Sessions     │  │ Resolves │  │             │
    │ • Abilities    │  │ actions  │  │ Text →      │
    │ • Config       │  │ + narr.  │  │ Speech      │
    └────────────────┘  └──────────┘  └─────────────┘
```

---

## Data Flow: Voice Combat Action

This is the core loop that runs during every combat action at the table:

```
Step 1: GM speaks
    "Hero 1 uses Shield Slam on Goblin 2, rolled 14"
         │
         ▼
Step 2: Web Speech API (browser-native)
    Converts speech → text transcript
    "Hero 1 uses Shield Slam on Goblin 2, rolled 14"
         │
         ▼
Step 3: Client sends to Next.js API route
    POST /api/combat/action
    {
      transcript: "Hero 1 uses Shield Slam on Goblin 2, rolled 14",
      combatState: { ...current full combat state },
      gameConfig: { ...current rules config }
    }
         │
         ▼
Step 4: Server builds Claude API request
    System prompt: condensed game rules + combat formulas
    User message: transcript + serialized combat state
    Response format: structured JSON
         │
         ▼
Step 5: Claude API resolves the action
    Returns JSON:
    {
      success: true,
      action: "Shield Slam",
      attacker: "hero_1",
      target: "goblin_2",
      roll: 14,
      targetNumber: 10,  // goblin STR 2 + 8
      hit: true,
      damage: 3,
      effects: [
        { type: "stun", target: "goblin_2", duration: 1 },
        { type: "knockback", target: "goblin_2", distance: 3 }
      ],
      resourceCost: { type: "rage", amount: 30 },
      narration: "The knight's shield CRASHES into the goblin scout, sending it tumbling back across the cave floor! The goblin looks dazed — it's stunned until next turn!",
      stateUpdates: {
        "goblin_2": { hp: 3, statusEffects: ["stun:1"] },
        "hero_1": { rage: 25 }  // was 55, spent 30
      }
    }
         │
         ▼
Step 6: Client applies state updates
    Zustand store updates all affected combatants
    UI re-renders: HP bars, resource bars, status icons
    Narration text displayed in action log
    Optional: TTS reads narration aloud
         │
         ▼
Step 7: Persist to Supabase
    Combat log entry saved (async, non-blocking)
    Character state updated if HP/resources changed
```

---

## Data Flow: Character Sheet Editing

```
Step 1: GM opens character sheet
    Supabase → load character data + game config
         │
         ▼
Step 2: GM allocates stat points
    Local Zustand state updates immediately
    Derived stats recalculate (HP, mana pool, crit range, etc.)
    UI reflects changes in real-time
         │
         ▼
Step 3: GM saves
    Character data → Supabase upsert
    Optimistic UI (already showing updated state)
```

---

## Data Flow: GM Config Change

```
Step 1: GM adjusts config (e.g., changes stat points per level)
    Config dashboard → local state update
         │
         ▼
Step 2: Derived values recalculate everywhere
    Character sheets recalculate available stat points
    Combat formulas adjust
    Claude API context will use new config on next action
         │
         ▼
Step 3: Config persists to Supabase
    game_config table updated
    All future sessions use new values
```

---

## Key Architecture Decisions

### Why Next.js (not plain React)?
- API routes keep Claude API key server-side (never exposed to browser)
- SSR for fast initial tablet load
- App Router for clean page structure
- Easy deployment to GCP Cloud Run via Docker

### Why Zustand (not Redux or Context)?
- Minimal boilerplate — combat state updates need to be fast
- Works great with React Server Components
- Easy to persist slices to Supabase
- Simple enough for Claude Code to maintain

### Why Supabase (not Firebase)?
- PostgreSQL = real relational data (characters → abilities → effects)
- Row-level security if auth is ever added
- Realtime subscriptions for future multi-device support
- Supabase CLI for local development + migrations
- Better fit for structured RPG data than document stores

### Why Claude API for combat resolution (not local logic)?
- Natural language understanding of voice input ("the goblin shoots an arrow at the wizard")
- Handles ambiguous commands gracefully
- Generates cinematic narration automatically
- Can reason about edge cases (ability interactions, complex status effects)
- Local game logic still validates and constrains (Claude suggests, game engine confirms)

### Why Web Speech API (not Whisper or Deepgram)?
- Zero cost — runs entirely in the browser
- No additional API calls or latency
- Good enough accuracy for structured game commands
- Works offline (speech recognition)
- Fallback: text input always available

---

## Security Model

Since this is a single-user app with no auth:

| Concern | Approach |
|---------|----------|
| Claude API key | Server-side only via Next.js API routes. Never sent to browser. |
| Supabase access | Anon key with permissive RLS (single user, no sensitive data) |
| Data privacy | All game data is personal/family — no PII beyond kid names |
| Voice data | Processed locally in browser. No audio sent to any server. Text transcript sent to Claude only. |

---

## Performance Targets

| Metric | Target | Why |
|--------|--------|-----|
| Initial page load | < 2s on iPad WiFi | Kids won't wait |
| Combat action resolution | < 3s (voice → UI update) | Maintains table flow |
| Voice recognition latency | < 500ms | Feels responsive |
| State update (UI) | < 100ms | Animations smooth at 60fps |
| Supabase query | < 200ms | Not blocking UI |

---

## Offline Considerations

The app should function with degraded service if WiFi drops mid-session:

| Feature | Offline Behavior |
|---------|-----------------|
| Combat state | Zustand store is in-memory — works without network |
| Character display | Cached from last load |
| Voice input | Web Speech API works offline |
| Claude resolution | Falls back to manual mode (GM enters results directly) |
| Save to Supabase | Queued, syncs when back online |
| Config changes | Local only until reconnected |
