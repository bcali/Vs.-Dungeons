# 🏰 LEGO QUEST — Digital GM Toolkit

## Project Overview

A tablet-optimized web application for running LEGO QUEST tabletop RPG sessions. Two core screens: a **Character Sheet Manager** and a **Combat Tracker** powered by Claude AI voice input.

Built for a single GM running sessions with two kids (ages 7 and 9) using Lego minifigures on a physical table, with an iPad as the digital companion.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | React framework, SSR, tablet PWA |
| **UI Library** | Tailwind CSS + shadcn/ui | Responsive tablet-first design |
| **State Management** | Zustand | Lightweight client state for combat |
| **Database** | Supabase (PostgreSQL) | Characters, monsters, combat logs, campaigns |
| **Realtime** | Supabase Realtime | Live combat state sync (future multi-device) |
| **AI Engine** | Anthropic Claude API (claude-sonnet-4-5-20250929) | Combat resolution, action narration |
| **Voice Input** | Web Speech API (browser native) | Speech-to-text for GM commands |
| **Voice Output** | Web Speech Synthesis API | Optional narration read-aloud |
| **Hosting** | Google Cloud Platform (Cloud Run) | Container hosting |
| **CDN/Static** | GCP Cloud CDN or Firebase Hosting | Static assets, fast tablet loading |
| **CI/CD** | GitHub Actions | Auto-deploy on push to main |
| **Design** | Figma Make | UI design → Claude Code implementation |
| **Dev Tool** | Claude Code | AI-assisted development |

---

## Repository Structure

```
lego-quest/
├── README.md                          # This file
├── .env.example                       # Environment variables template
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # GCP Cloud Run deploy
│       └── ci.yml                     # Lint, type-check, test
├── docs/
│   ├── ARCHITECTURE.md                # System architecture & data flow
│   ├── DATABASE.md                    # Supabase schema & migrations
│   ├── FEATURE-CHARACTER-SHEET.md     # Character sheet feature spec
│   ├── FEATURE-COMBAT-TRACKER.md      # Combat tracker feature spec
│   ├── FEATURE-GM-CONFIG.md           # GM config dashboard spec
│   ├── CLAUDE-API-INTEGRATION.md      # Claude API + voice integration
│   ├── STATUS-EFFECTS.md              # Status effect system reference
│   ├── DEPLOYMENT.md                  # GCP + Supabase setup guide
│   └── GAME-RULES-REFERENCE.md        # Condensed rules for Claude context
├── game-rules/                        # Source-of-truth game system files
│   ├── core-rules.md
│   ├── spellbook.md
│   ├── character-sheets.md
│   ├── campaign-log.md
│   └── game-master-prompt.md
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_monster_library.sql
│   │   └── 003_seed_data.sql
│   └── seed/
│       ├── monsters.sql
│       ├── abilities.sql
│       └── default_config.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (tablet meta, PWA manifest)
│   │   ├── page.tsx                   # Home / campaign selector
│   │   ├── character/
│   │   │   ├── page.tsx               # Character sheet list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Individual character sheet
│   │   ├── combat/
│   │   │   ├── page.tsx               # Combat tracker main screen
│   │   │   └── setup/
│   │   │       └── page.tsx           # Encounter setup (pick monsters)
│   │   └── config/
│   │       └── page.tsx               # GM config dashboard
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives
│   │   ├── character/
│   │   │   ├── StatBlock.tsx           # Stat display + allocation
│   │   │   ├── StatAllocator.tsx       # Point-buy interface
│   │   │   ├── AbilityList.tsx         # Known abilities display
│   │   │   ├── AbilityPicker.tsx       # Choose new abilities at level-up
│   │   │   ├── InventoryPanel.tsx      # Items + seals
│   │   │   ├── ResourceBar.tsx         # HP / Mana / Energy / Rage bar
│   │   │   └── CharacterSummary.tsx    # Quick overview card
│   │   ├── combat/
│   │   │   ├── CombatArena.tsx         # Main combat layout
│   │   │   ├── HeroCard.tsx            # Hero combat card (stats + effects)
│   │   │   ├── EnemyCard.tsx           # Enemy combat card
│   │   │   ├── InitiativeTracker.tsx   # Turn order bar
│   │   │   ├── ActionLog.tsx           # Combat event feed
│   │   │   ├── VoiceInput.tsx          # Mic button + transcription
│   │   │   ├── StatusEffectIcon.tsx    # Individual effect badge
│   │   │   ├── StatusEffectBar.tsx     # Row of active effects on a combatant
│   │   │   ├── LootRoller.tsx          # Post-encounter loot UI
│   │   │   ├── ResourceTracker.tsx     # Energy/Rage/Mana per-turn tracking
│   │   │   └── DamagePopup.tsx         # Floating damage/heal numbers
│   │   └── config/
│   │       ├── StatConfig.tsx          # Adjust base stats, per-level points
│   │       ├── XPConfig.tsx            # Adjust XP thresholds
│   │       ├── ResourceConfig.tsx      # Adjust resource pools/regen
│   │       └── CombatConfig.tsx        # Adjust combat formulas
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Supabase browser client
│   │   │   ├── server.ts              # Supabase server client
│   │   │   └── types.ts               # Generated DB types
│   │   ├── claude/
│   │   │   ├── client.ts              # Claude API wrapper
│   │   │   ├── combat-prompt.ts       # System prompt for combat resolution
│   │   │   ├── action-parser.ts       # Parse Claude response → game state
│   │   │   └── types.ts               # Claude request/response types
│   │   ├── voice/
│   │   │   ├── speech-recognition.ts  # Web Speech API wrapper
│   │   │   ├── speech-synthesis.ts    # TTS for narration
│   │   │   └── types.ts
│   │   ├── game/
│   │   │   ├── stats.ts               # Stat calculations (bonus, HP, mana pool)
│   │   │   ├── combat.ts              # Combat resolution helpers
│   │   │   ├── resources.ts           # Resource regen/spend logic
│   │   │   ├── status-effects.ts      # Effect application/tick/removal
│   │   │   ├── loot.ts                # Loot table roller
│   │   │   └── config.ts              # Game config type + defaults
│   │   └── utils/
│   │       ├── constants.ts           # Static game constants
│   │       └── helpers.ts             # Shared utility functions
│   ├── stores/
│   │   ├── combat-store.ts            # Zustand store for active combat
│   │   ├── character-store.ts         # Zustand store for character editing
│   │   └── config-store.ts            # Zustand store for GM config
│   └── types/
│       ├── game.ts                    # Core game types (Character, Monster, etc.)
│       ├── combat.ts                  # Combat-specific types
│       └── config.ts                  # Config types
├── public/
│   ├── manifest.json                  # PWA manifest for tablet
│   ├── icons/                         # App icons for home screen
│   └── sounds/                        # Optional: crit hit, level up SFX
├── Dockerfile                         # For GCP Cloud Run
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                         # Local env (gitignored)
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data flow, tech decisions |
| [DATABASE.md](docs/DATABASE.md) | Full Supabase schema, migrations, relationships |
| [FEATURE-CHARACTER-SHEET.md](docs/FEATURE-CHARACTER-SHEET.md) | Character sheet screen — full feature spec |
| [FEATURE-COMBAT-TRACKER.md](docs/FEATURE-COMBAT-TRACKER.md) | Combat tracker screen — full feature spec |
| [FEATURE-GM-CONFIG.md](docs/FEATURE-GM-CONFIG.md) | GM config dashboard — calibration controls |
| [CLAUDE-API-INTEGRATION.md](docs/CLAUDE-API-INTEGRATION.md) | Claude API integration + voice pipeline |
| [STATUS-EFFECTS.md](docs/STATUS-EFFECTS.md) | Complete status effect system reference |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | GCP Cloud Run + Supabase + GitHub Actions setup |
| [GAME-RULES-REFERENCE.md](docs/GAME-RULES-REFERENCE.md) | Condensed rules injected into Claude context |

---

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/lego-quest.git
cd lego-quest

# Install
npm install

# Set up environment
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY

# Run Supabase locally (optional)
npx supabase start
npx supabase db push

# Dev server
npm run dev

# Open on iPad: http://YOUR_LOCAL_IP:3000
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Project scaffold (Next.js + Tailwind + shadcn/ui)
- [ ] Supabase schema + migrations
- [ ] Seed monster library + ability data
- [ ] Core game logic library (stats, resources, effects)
- [ ] GM config system with defaults

### Phase 2 — Character Sheet (Week 2–3)
- [ ] Character creation flow
- [ ] Stat allocation with point-buy
- [ ] Derived stat calculations (HP, mana pool, crit range)
- [ ] Ability picker by profession + tier
- [ ] Inventory + seal tracking
- [ ] Character persistence to Supabase

### Phase 3 — Combat Tracker (Week 3–5)
- [ ] Encounter setup (select heroes + pick monsters from library)
- [ ] Initiative roller + turn order
- [ ] Combat arena layout (heroes + up to 8 enemies)
- [ ] HP / resource bars with real-time updates
- [ ] Status effect system (apply, tick, expire, display)
- [ ] Action resolution (manual entry first)
- [ ] Loot roller post-encounter

### Phase 4 — Claude AI Integration (Week 5–6)
- [ ] Claude API route handler
- [ ] Combat system prompt with game rules context
- [ ] Action resolution via Claude (text input)
- [ ] Structured response parsing → state updates
- [ ] Combat narration display

### Phase 5 — Voice Input (Week 6–7)
- [ ] Web Speech API integration
- [ ] Mic button UI with visual feedback
- [ ] Speech → text → Claude pipeline
- [ ] Optional: TTS narration output
- [ ] Error handling (unrecognized speech, API failures)

### Phase 6 — Polish & Deploy (Week 7–8)
- [ ] Tablet optimization (touch targets, gestures, landscape)
- [ ] PWA manifest + home screen install
- [ ] Combat log persistence to Supabase
- [ ] Session history viewer
- [ ] GCP Cloud Run deployment
- [ ] GitHub Actions CI/CD

---

## Design Notes

- UI will be designed in **Figma Make** and shared to Claude Code for implementation
- Dark fantasy theme (inspired by Diablo character sheets — see reference images)
- Tablet-first: large touch targets, landscape orientation, no tiny buttons
- Physical Lego tokens still used at the table — the app tracks state, not replaces tactile play
