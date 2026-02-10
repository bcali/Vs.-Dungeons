# 🛠️ LEGO QUEST — Crafting Profession Abilities

*Complete profession skill trees for the Professions tab. Unlocks every 2 levels from 3–19.*

---

## Overview

Each crafting profession has a **9-node ability tree** with unlocks at every even level starting from 3. Nodes alternate between **automatic unlocks** (milestones everyone gets) and **choice nodes** (pick 1 of 2 options). This creates meaningful build variety — two players with the same profession can end up with different strengths.

### Node Structure

| Level | Node # | Type | Pattern |
|-------|--------|------|---------|
| 3 | 1 | 🔓 AUTO | Profession starter — you just learned this! |
| 5 | 2 | ⚡ CHOICE | Pick 1 of 2 — early specialization |
| 7 | 3 | ⚡ CHOICE | Pick 1 of 2 — deepen your path |
| 9 | 4 | 🔓 AUTO | Milestone — crafting efficiency reward |
| 11 | 5 | ⚡ CHOICE | Pick 1 of 2 — mid-career power spike |
| 13 | 6 | 🔓 AUTO | Master milestone — big passive upgrade |
| 15 | 7 | ⚡ CHOICE | Pick 1 of 2 — advanced specialization |
| 17 | 8 | 🔓 AUTO | Grandmaster milestone — profession mastery |
| 19 | 9 | ⚡ CHOICE | Pick 1 of 2 — capstone ultimate |

**Per profession:** 4 auto-unlocks + 5 choice nodes (10 options) = **14 unique abilities**
**Across all 5 professions:** **70 unique abilities**

### Ability Categories

| Category | Icon | Description |
|----------|------|-------------|
| **Passive** | 🟢 | Always active once learned. Permanent bonus. |
| **Active** | 🔴 | Usable once per session or once per encounter. Requires a conscious trigger. |
| **Unique Recipe** | 🟡 | Unlocks a special recipe only available through this ability node. |

---

## Tab UI Spec — Professions Tab

The Professions tab on the character detail page shows both of the player's chosen professions as **vertical skill trees** side by side.

```
╔══════════════════════════════════════════════════════════════╗
║  [ Sheet ]  [ Skills ]  [ Professions ]                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ⚒️ BLACKSMITHING              🍳 COOKING                    ║
║  Tier: Journeyman               Tier: Apprentice             ║
║                                                              ║
║  ┌──────────────────────┐      ┌──────────────────────┐      ║
║  │                      │      │                      │      ║
║  │  Lv.3 ✅ Forge       │      │  Lv.3 ✅ Camp Cook   │      ║
║  │  Basics              │      │  Basics              │      ║
║  │      │               │      │      │               │      ║
║  │      ▼               │      │      ▼               │      ║
║  │  Lv.5 ✅ [Chosen:    │      │  Lv.5 🔒 Choice:    │      ║
║  │  Weapon Focus]       │      │  ??? / ???           │      ║
║  │      │               │      │      │               │      ║
║  │      ▼               │      │      ▼               │      ║
║  │  Lv.7 🔒 Choice:    │      │  Lv.7 🔒 Choice:    │      ║
║  │  ??? / ???           │      │  ??? / ???           │      ║
║  │      │               │      │      │               │      ║
║  │      ▼               │      │      ▼               │      ║
║  │  Lv.9 🔒 Auto       │      │  Lv.9 🔒 Auto       │      ║
║  │      │               │      │      │               │      ║
║  │     ...              │      │     ...              │      ║
║  │      ▼               │      │      ▼               │      ║
║  │  Lv.19 🔒 Capstone  │      │  Lv.19 🔒 Capstone  │      ║
║  │                      │      │                      │      ║
║  └──────────────────────┘      └──────────────────────┘      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Node States

| State | Visual | Description |
|-------|--------|-------------|
| ✅ Unlocked | Bright, profession-colored, glowing border | Learned and active |
| ⚡ Available | Pulsing gold border, "CHOOSE!" badge | Ready to pick (choice node at current level) |
| 🔒 Locked | Dimmed, grayed out, lock icon | Not yet available (shows level requirement) |
| 👁️ Preview | Semi-transparent, visible but unclickable | Next 1–2 upcoming nodes shown for anticipation |

### Choice Selection UI

When a player reaches a CHOICE node, tapping it expands into a selection panel:

```
┌─── LEVEL 5: CHOOSE YOUR PATH ────────────────────┐
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │  ⚔️ WEAPON FOCUS  │  │  🛡️ ARMOR FOCUS  │       │
│  │  🟢 Passive       │  │  🟢 Passive       │       │
│  │                    │  │                    │       │
│  │  All crafted       │  │  All crafted       │       │
│  │  weapons get +1    │  │  armor gets +1     │       │
│  │  bonus damage      │  │  bonus defense     │       │
│  │                    │  │                    │       │
│  │  "Hit harder!"     │  │  "Stand stronger!" │       │
│  │                    │  │                    │       │
│  │    [ SELECT ]      │  │    [ SELECT ]      │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                    │
│  ⚠️ This choice is permanent!                      │
└────────────────────────────────────────────────────┘
```

---

## ⚒️ Blacksmithing — Ability Tree

*Forge weapons and armor. The reliable gear profession.*

### Node 1 — Level 3 🔓 AUTO

**Forge Basics** | 🟢 Passive
> *"You learn to work the anvil. The heat doesn't bother you anymore."*

- Unlock all Apprentice Blacksmithing recipes
- **Sturdy Craft:** All items you forge have +1 HP durability (gear doesn't break on nat 1 fumbles)

---

### Node 2 — Level 5 ⚡ CHOICE (pick 1)

**Option A: Weapon Focus** | 🟢 Passive
> *"Your blades are sharper than anyone else's."*

- All weapons you craft gain **+1 bonus damage** on top of their base stats
- Unlock Journeyman weapon recipes

**Option B: Armor Focus** | 🟢 Passive
> *"Your armor fits like a second skin."*

- All armor and shields you craft gain **+1 bonus defense** on top of their base stats
- Unlock Journeyman armor recipes

---

### Node 3 — Level 7 ⚡ CHOICE (pick 1)

**Option A: Salvage** | 🔴 Active (1/session)
> *"Nothing goes to waste in your forge."*

- **Salvage** an unwanted crafted item to recover **half its materials** (rounded up)
- Great for recycling old gear when you've outleveled it

**Option B: Rush Order** | 🟡 Unique Recipe
> *"When your friends need gear NOW, you deliver."*

- Unlock **Quickforge Blade**: 2 Iron Scraps + 1 Beast Fang → +2 melee damage weapon
- This recipe uses fewer materials than normal but produces slightly weaker gear
- Can craft **during a session** instead of only between sessions (exception to the normal rule)

---

### Node 4 — Level 9 🔓 AUTO

**Efficient Forging** | 🟢 Passive
> *"You waste less metal with every swing of the hammer."*

- All Blacksmithing recipes require **1 fewer Common-tier material** (minimum 1)
- Unlock Expert Blacksmithing recipes

---

### Node 5 — Level 11 ⚡ CHOICE (pick 1)

**Option A: Masterwork** | 🟢 Passive
> *"People can tell YOUR work from a mile away. It just looks... better."*

- Once per session, when you craft an item, you can make it **Masterwork quality**: the item's primary stat bonus increases by **+2**
- Masterwork items glow faintly (LEGO: add a transparent piece)

**Option B: Battle Repair** | 🔴 Active (1/encounter)
> *"A quick hammer tap and it's good as new!"*

- During combat, spend 1 action to **repair** an ally's gear, restoring any broken effects or granting them **+2 defense for 2 turns**
- This is one of the few crafting abilities usable IN combat

---

### Node 6 — Level 13 🔓 AUTO

**Master Smith** | 🟢 Passive + 🟡 Unique Recipe
> *"The forge sings when you work. Legends are made here."*

- All Blacksmithing recipes require **1 fewer Uncommon-tier material** (minimum 1)
- Unlock Master Blacksmithing recipes
- Unlock unique recipe: **Named Weapon**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Named Weapon** (unique) | 2 Dragonscale Metal + 1 Elemental Core + 1 Epic Seal | +6 damage weapon. The player **names it**. Once per battle, the wielder can shout the name to deal **double damage** on their next attack. |

---

### Node 7 — Level 15 ⚡ CHOICE (pick 1)

**Option A: Legendary Temper** | 🟡 Unique Recipe
> *"Fire, ice, lightning — you can fold any element into steel."*

- Unlock unique recipe: **Elemental Forge Weapon**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Elemental Forge Weapon** | 3 Dragonscale Metal + 2 Elemental Cores + choice of element material | +7 damage. Player picks element at craft time (fire/ice/lightning). Weapon deals +4 elemental damage and applies matching status (burn/slow/stun) on crit. |

**Option B: Impenetrable Plate** | 🟡 Unique Recipe
> *"They'll need a battering ram to get through THIS armor."*

- Unlock unique recipe: **Fortress Armor**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Fortress Armor** | 4 Dragonscale Metal + 2 Mithril Ore + 1 Epic Seal | +9 defense. Once per encounter, when the wearer would be knocked out, they instead survive with 1 HP. |

---

### Node 8 — Level 17 🔓 AUTO

**Grandmaster Forgewright** | 🟢 Passive
> *"Your hands remember what your mind hasn't learned yet. Muscle memory of a thousand blades."*

- All Blacksmithing recipes require **1 fewer Rare-tier material** (minimum 1)
- Unlock Grandmaster Blacksmithing recipes
- All crafted gear now has a **faint profession-colored glow** (LEGO: transparent colored piece added to gear)

---

### Node 9 — Level 19 ⚡ CHOICE (pick 1)

**Option A: Forge of Legends** | 🟡 Unique Recipe
> *"Only three of these have ever been made. Yours is the fourth."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Destiny Blade** | 4 Starmetal + 2 Dragon Hearts + 2 Legendary Seals | +14 melee damage. Crit range 17–20. On crit, releases a shockwave hitting all adjacent enemies for 8 damage. The weapon **levels up** — after 10 crits total, it gains +2 more damage permanently. |

**Option B: Living Armor** | 🟡 Unique Recipe
> *"It breathes. It adapts. It protects you like it's alive."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Adamantine Shell** | 4 Starmetal + 2 Eternity Stones + 1 Legendary Seal | +12 defense. Immune to crit damage (crits deal normal damage instead). Regenerate 3 HP per turn. Once per session, automatically blocks a killing blow completely. |

---

## 🧪 Alchemy — Ability Tree

*Brew potions, elixirs, and volatile concoctions. The utility master.*

### Node 1 — Level 3 🔓 AUTO

**Budding Alchemist** | 🟢 Passive
> *"Your first potion didn't explode! ...Your second one did, but that was on purpose."*

- Unlock all Apprentice Alchemy recipes
- **Double Brew:** When crafting any Common-tier potion, create **2 copies** instead of 1 (same materials)

---

### Node 2 — Level 5 ⚡ CHOICE (pick 1)

**Option A: Potion Specialist** | 🟢 Passive
> *"Your healing potions are the good stuff."*

- All healing potions you brew restore **+3 bonus HP** beyond their base
- Unlock Journeyman potion recipes

**Option B: Bomb Specialist** | 🟢 Passive
> *"More boom. Bigger boom. LOUDER boom."*

- All bombs and offensive flasks you brew deal **+2 bonus damage** and their AoE radius increases by **1 stud**
- Unlock Journeyman bomb recipes

---

### Node 3 — Level 7 ⚡ CHOICE (pick 1)

**Option A: Ingredient Stretcher** | 🟢 Passive
> *"A pinch here, a dash there — you make a little go a long way."*

- When crafting Alchemy recipes, you may replace **1 Uncommon material** with **2 Common materials** of the same category

**Option B: Volatile Mixtures** | 🟡 Unique Recipe
> *"Unstable? Yes. Powerful? VERY yes."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Chaos Flask** | 2 Mana Crystals + 2 Wild Herbs + 1 Uncommon Seal | Throw: Roll d6 for random effect. 1–2: 10 fire damage (3-stud). 3–4: All enemies slowed 2 turns. 5–6: All allies heal 8 HP. Always exciting! |

---

### Node 4 — Level 9 🔓 AUTO

**Efficient Brewing** | 🟢 Passive
> *"You could brew a potion in your sleep. Actually, you did once."*

- All Alchemy recipes require **1 fewer Common-tier material** (minimum 1)
- Unlock Expert Alchemy recipes
- **Quick Sip:** Drinking a potion in combat is now a **free action** (doesn't cost your action) once per encounter

---

### Node 5 — Level 11 ⚡ CHOICE (pick 1)

**Option A: Splash Brewing** | 🔴 Active (1/encounter)
> *"Why drink it when you can THROW it at your friends?"*

- When using any healing potion, you may throw it at an ally within **4 studs** instead of having to be adjacent. The potion also heals **nearby allies within 2 studs for half the amount**

**Option B: Concentrated Formula** | 🟢 Passive
> *"Same bottle, twice the punch."*

- All potions and elixirs you brew have their **duration doubled** (3 turns → 6 turns, 1 encounter → 2 encounters)
- Stat-boosting elixirs from Alchemy become the best buffs in the game with this

---

### Node 6 — Level 13 🔓 AUTO

**Master Alchemist** | 🟢 Passive + 🟡 Unique Recipe
> *"Your potions shimmer with an inner light. Even the bottles look magical."*

- All Alchemy recipes require **1 fewer Uncommon-tier material** (minimum 1)
- Unlock Master Alchemy recipes
- Unlock unique recipe: **Transmutation Brew**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Transmutation Brew** | 2 Void Shards + 1 Enchanted Gem + 1 Epic Seal | Transform **3 materials of one tier** into **1 material of the next tier up** (your choice of category). Turns your surplus into exactly what you need. |

---

### Node 7 — Level 15 ⚡ CHOICE (pick 1)

**Option A: Philosopher's Method** | 🟡 Unique Recipe
> *"The ancient alchemists searched for this formula. You found it in a dream."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Philosopher's Elixir** | 3 Ghostroots + 2 Void Shards + 1 Epic Seal | Permanently increase one stat by **+1** (consumed, one-time use). Can only be used once per character ever. |

**Option B: Plague Doctor** | 🔴 Active (1/session) + 🟡 Unique Recipe
> *"Your poisons are legendary. And slightly terrifying."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Creeping Doom Poison** | 3 Venom Glands + 2 Void Shards | Apply to weapon: next 5 hits deal +5 poison damage AND reduce enemy STR by 1 per hit (stacks). Bosses melt. |

- Active ability: **Toxic Aura** — Once per session, for 3 turns all enemies within 3 studs of you take 4 poison damage at start of their turn

---

### Node 8 — Level 17 🔓 AUTO

**Grandmaster Alchemist** | 🟢 Passive
> *"You see the world differently now. Everything is an ingredient."*

- All Alchemy recipes require **1 fewer Rare-tier material** (minimum 1)
- Unlock Grandmaster Alchemy recipes
- **Triple Brew:** When crafting any Uncommon-tier or below potion, create **3 copies** instead of 1

---

### Node 9 — Level 19 ⚡ CHOICE (pick 1)

**Option A: Elixir of Eternity** | 🟡 Unique Recipe
> *"One sip and time stops. Two sips and it reverses. Three sips and... let's not find out."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Elixir of Eternity** | 3 World Tree Leaves + 3 Eternity Stones + 2 Legendary Seals | For 1 full encounter: the drinker gets **2 actions per turn**, all potions they drink have **double effect**, and they are immune to all negative status effects. Once per campaign. |

**Option B: Panacea** | 🟡 Unique Recipe
> *"The cure to everything. Literally everything."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Panacea** | 3 World Tree Leaves + 2 Dragon Hearts + 1 Legendary Seal | Full heal entire party to max HP, cure all negative effects, restore all spell slots, and grant +3 to all stats for 3 turns. Once per campaign. |

---

## 🍳 Cooking — Ability Tree

*Prepare meals and snacks that fuel heroes. The most consistently rewarding profession.*

### Node 1 — Level 3 🔓 AUTO

**Camp Cook** | 🟢 Passive
> *"The campfire is your kingdom. Everyone gathers when you start cooking."*

- Unlock all Apprentice Cooking recipes
- **Tasty!:** All snacks you craft restore **+2 bonus HP** on top of their base effect

---

### Node 2 — Level 5 ⚡ CHOICE (pick 1)

**Option A: Feast Master** | 🟢 Passive
> *"Your meals are so good, heroes fight BETTER on a full stomach."*

- All meals you cook grant an additional **+1 to all stats** on top of their base buff
- Unlock Journeyman meal recipes

**Option B: Snack Packer** | 🟢 Passive
> *"Pockets full of goodies. Always prepared."*

- Heroes can now carry **3 snacks** instead of 2 per session
- All snacks you craft produce **2 copies** instead of 1 (same materials)
- Unlock Journeyman snack recipes

---

### Node 3 — Level 7 ⚡ CHOICE (pick 1)

**Option A: Forager** | 🟢 Passive
> *"You spot edible plants that nobody else even notices."*

- At the start of every session, you automatically gain **2 Wild Herbs** for free (no roll, no encounter needed)
- When the party finds a foraging node, you find **double materials**

**Option B: Monster Chef** | 🟡 Unique Recipe
> *"If it has a fang, you can probably cook it. And it'll be delicious."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Monster Stew** | 3 Beast Fangs + 2 Wild Herbs | Meal: +2 STR and +2 TGH for session. Special: the stat bonus matches the strongest stat of the monster the fangs came from (GM decides). |
| **Mystery Meat Skewers** (×3) | 2 Beast Fangs + 1 Tough Hide | Snack: Restore 8 HP + gain a random buff for 1 encounter (d4: 1=+2 STR, 2=+2 SPD, 3=+2 TGH, 4=+2 SMT). Fun to roll! |

---

### Node 4 — Level 9 🔓 AUTO

**Efficient Kitchen** | 🟢 Passive
> *"Zero waste. Every scrap becomes something delicious."*

- All Cooking recipes require **1 fewer Common-tier material** (minimum 1)
- Unlock Expert Cooking recipes
- **Second Helping:** When you cook a meal, you create **1 extra snack** of your choice (Apprentice tier) for free alongside it

---

### Node 5 — Level 11 ⚡ CHOICE (pick 1)

**Option A: Comfort Food** | 🔴 Active (1/session)
> *"Your cooking heals more than just hunger."*

- Once per session, at the start of an encounter, declare a **Comfort Food bonus**: all allies who ate your meal this session heal **8 HP** and gain **+2 to their next roll**
- This is the "mom's cooking gives you strength" ability

**Option B: Spicy Specialist** | 🟡 Unique Recipe
> *"HOT HOT HOT! But SO good."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Dragonfire Curry** | 2 Sunblooms + 2 Venom Glands + 1 Rare Seal | Meal: +3 STR, +3 damage to all attacks, and melee attacks deal **2 fire damage** to adjacent enemies on hit for entire session. |
| **Firecracker Candy** (×3) | 1 Sunbloom + 1 Venom Gland | Snack: next attack deals +6 fire damage in 2-stud area (instant, free action). |

---

### Node 6 — Level 13 🔓 AUTO

**Master Chef** | 🟢 Passive + 🟡 Unique Recipe
> *"Kings would pay fortunes for your recipes. You cook for heroes instead."*

- All Cooking recipes require **1 fewer Uncommon-tier material** (minimum 1)
- Unlock Master Cooking recipes
- Heroes can now eat **2 meals** per session (but the second meal must be a different recipe)
- Unlock unique recipe: **Hero's Banquet**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Hero's Banquet** | 3 Ghostroots + 2 Elemental Cores + 1 Epic Seal | Meal: Feeds **entire party**. +3 all stats, +10 max HP, and immunity to poison for session. One recipe, everyone benefits. |

---

### Node 7 — Level 15 ⚡ CHOICE (pick 1)

**Option A: Legendary Recipes** | 🟡 Unique Recipe
> *"These recipes were lost for a thousand years. You rediscovered them by accident."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Phoenix Egg Omelette** | 2 Ghostroots + 2 Elemental Cores + 1 Dragon Heart | Meal: +4 all stats for session. If knocked out, automatically revive at half HP (1/session). |
| **Titan's Protein Bar** (×2) | 2 Ghostroots + 1 Elemental Core | Snack: +5 STR and +5 melee damage for 1 encounter (instant). |

**Option B: Battlefield Catering** | 🔴 Active (1/encounter)
> *"Who says you can't cook during a fight?"*

- Active ability: **Quick Snack** — Once per encounter, you may feed a snack to any ally within 3 studs as a **free action** on your turn (normally they'd use their own action)
- All snacks consumed during combat also grant **+1 to all stats for 2 turns** as bonus

---

### Node 8 — Level 17 🔓 AUTO

**Grandmaster Chef** | 🟢 Passive
> *"Your food is magical. Not metaphorically — it actually glows."*

- All Cooking recipes require **1 fewer Rare-tier material** (minimum 1)
- Unlock Grandmaster Cooking recipes
- **Leftovers:** Any uneaten snacks at session end are preserved for the next session (normally they expire)
- All meals now also grant **+5 max HP** as a baseline bonus

---

### Node 9 — Level 19 ⚡ CHOICE (pick 1)

**Option A: Feast of the Gods** | 🟡 Unique Recipe
> *"When you cook this, the sky changes color. Legends say the gods themselves can smell it."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Feast of the Gods** | 3 World Tree Leaves + 2 Dragon Hearts + 2 Legendary Seals | Meal (feeds entire party): +8 all stats, +50 max HP, immune to all negative effects, +5 damage to all attacks for entire session. Once per campaign. |

**Option B: Endless Pantry** | 🟢 Passive + 🔴 Active
> *"Your backpack is basically a restaurant. Nobody in your party ever goes hungry."*

- Passive: You start every session with **5 free Apprentice-tier snacks** of your choice (no materials needed)
- Active: Once per session, you may cook **any Expert-tier or below recipe instantly** with no materials (your skill is so great you improvise from nothing)

---

## ✨ Enchanting — Ability Tree

*Imbue gear with magical power. The force multiplier.*

### Node 1 — Level 3 🔓 AUTO

**Rune Apprentice** | 🟢 Passive
> *"The runes whisper to you. Mostly helpful things. Mostly."*

- Unlock all Apprentice Enchanting recipes
- **Identify:** You can automatically identify any magical item, enchantment, or trap the party encounters (no roll needed)

---

### Node 2 — Level 5 ⚡ CHOICE (pick 1)

**Option A: Weapon Enchanter** | 🟢 Passive
> *"Swords that shoot lightning? Yes please."*

- Weapon enchantments you apply deal **+1 bonus elemental damage** on top of their base effect
- Unlock Journeyman weapon enchant recipes

**Option B: Ward Enchanter** | 🟢 Passive
> *"Your shields shimmer. Your armor hums. Everything you touch becomes safer."*

- Armor enchantments you apply grant **+1 bonus defense** on top of their base effect
- Unlock Journeyman armor enchant recipes

---

### Node 3 — Level 7 ⚡ CHOICE (pick 1)

**Option A: Scroll Scribe** | 🟡 Unique Recipe
> *"Why memorize spells when you can write them down?"*

- Unlock ability to craft scrolls of **any spell your party knows** (not just preset scroll recipes):

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Custom Scroll** | 2 Mana Crystals + 1 Arcane Dust per spell tier | Creates a scroll of any spell known by a party member. The scroll user casts it without spending a spell slot. |

**Option B: Dual Enchant** | 🟢 Passive
> *"One enchantment? That's for beginners."*

- Gear you enchant can hold **2 enchantments** instead of the normal limit of 1
- The second enchantment must be a different element/type than the first

---

### Node 4 — Level 9 🔓 AUTO

**Efficient Enchanting** | 🟢 Passive
> *"The runes flow from your fingers like you've done this a thousand times."*

- All Enchanting recipes require **1 fewer Common-tier material** (minimum 1)
- Unlock Expert Enchanting recipes
- **Resonance:** When you enchant an item, all other enchanted items held by the same hero glow brighter — heroes with 2+ enchanted items gain **+1 to all rolls** (stacking passive)

---

### Node 5 — Level 11 ⚡ CHOICE (pick 1)

**Option A: Dispel** | 🔴 Active (1/encounter)
> *"If you can put magic IN, you can pull magic OUT."*

- Active ability: **Dispel** — Target one enemy. Remove one magical buff, enchantment, or active spell effect from them. Against magical barriers, instantly destroy them.
- Range: 6 studs, no roll needed

**Option B: Power Surge** | 🔴 Active (1/encounter)
> *"OVERCHARGE! Everything magical goes to eleven."*

- Active ability: **Power Surge** — For 2 turns, all enchanted items held by all allies deal/grant **double their enchantment bonus** (Fire Enchant +2 becomes +4, Toughness Rune +2 becomes +4, etc.)

---

### Node 6 — Level 13 🔓 AUTO

**Master Enchanter** | 🟢 Passive + 🟡 Unique Recipe
> *"Your enchantments are permanent. Your runes are perfect. Your scrolls never fail."*

- All Enchanting recipes require **1 fewer Uncommon-tier material** (minimum 1)
- Unlock Master Enchanting recipes
- Unlock unique recipe: **Soul Gem**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Soul Gem** | 2 Void Shards + 2 Enchanted Gems + 1 Epic Seal | Capture the essence of a defeated boss. The gem stores one of the boss's abilities. Can be socketed into any weapon — the weapon's wielder can use that boss ability once per encounter. |

---

### Node 7 — Level 15 ⚡ CHOICE (pick 1)

**Option A: Runeforged Mastery** | 🟡 Unique Recipe
> *"The greatest enchanters don't add magic to items. They make items that ARE magic."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Runeforged Amulet** | 3 Void Shards + 2 Enchanted Gems + 1 Epic Seal | Accessory: Wearer's spell damage increased by +5. Spells cost 1 fewer slot (minimum 1). The amulet pulses with light when magic is near. |

**Option B: Curse Breaker** | 🔴 Active (1/session) + 🟢 Passive
> *"Curses, hexes, dark magic — none of it sticks when you're around."*

- Passive: All allies within 4 studs of you are **immune to curse effects**
- Active: **Break Curse** — Once per session, remove any permanent negative effect from a character, item, or location. This includes story curses, cursed items, and magical locks.

---

### Node 8 — Level 17 🔓 AUTO

**Grandmaster Enchanter** | 🟢 Passive
> *"You see the threads of magic that hold the world together. And you can pull them."*

- All Enchanting recipes require **1 fewer Rare-tier material** (minimum 1)
- Unlock Grandmaster Enchanting recipes
- **Permanent Scrolls:** Scrolls you craft can now be used **twice** before being consumed

---

### Node 9 — Level 19 ⚡ CHOICE (pick 1)

**Option A: Arcane Singularity** | 🟡 Unique Recipe
> *"This is the most powerful enchantment ever created. Use it wisely."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Arcane Singularity Gem** | 4 Eternity Stones + 2 Dragon Hearts + 2 Legendary Seals | Socket into any weapon. That weapon gains: +10 damage, attacks ignore all resistances and immunities, crit range 17–20, and on crit the target must pass TGH check (20) or be instantly defeated. Even works on bosses. Once per campaign. |

**Option B: Living Enchantment** | 🟡 Unique Recipe + 🟢 Passive
> *"Your enchantments evolve. They grow. They learn."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Evolving Enchantment** | 3 Eternity Stones + 2 Void Shards + 1 Legendary Seal | Apply to any gear. The enchantment starts at +3 to its primary effect. After every session in which the wielder gets a crit, the bonus increases by +1 permanently (no cap). The item becomes a legend. |

- Passive: All enchantments you've ever applied to party gear gain **+1 to their effects** retroactively

---

## 🪤 Trap Making — Ability Tree

*Build traps, bombs, turrets, and gadgets. Battlefield control master.*

### Node 1 — Level 3 🔓 AUTO

**Tinkerer** | 🟢 Passive
> *"Springs, gears, levers — you see machines in your dreams."*

- Unlock all Apprentice Trap Making recipes
- **Quick Setup:** Placing a trap during combat takes a **bonus action** instead of a full action (you can attack AND place a trap on the same turn)

---

### Node 2 — Level 5 ⚡ CHOICE (pick 1)

**Option A: Trap Specialist** | 🟢 Passive
> *"Your traps are meaner. And better hidden."*

- All traps you craft deal **+2 bonus damage** and enemies get **−2 to checks to spot or avoid** them
- Unlock Journeyman trap recipes

**Option B: Gadget Specialist** | 🟢 Passive
> *"Jetpacks, grapple hooks, smoke machines — your toy box is endless."*

- You can carry **4 traps/gadgets** per session instead of 3
- Gadgets you craft gain **+1 use** per session (reusable gadgets like Grapple Launcher get 1 extra use)
- Unlock Journeyman gadget recipes

---

### Node 3 — Level 7 ⚡ CHOICE (pick 1)

**Option A: Remote Trigger** | 🔴 Active (unlimited)
> *"Why step on the trap when you can press a button?"*

- All your traps can now be detonated **remotely** at any time on your turn (normally they trigger on enemy movement)
- This lets you time detonations for maximum impact and combo with other players' attacks

**Option B: Recycler** | 🟢 Passive
> *"Your traps don't break — they reset."*

- When a trap you placed activates, roll d20. On **12+**, the trap **resets** and can activate again next turn
- Effectively doubles the value of every trap if you're lucky

---

### Node 4 — Level 9 🔓 AUTO

**Efficient Assembly** | 🟢 Passive
> *"Leftover parts from one gadget become the start of the next one."*

- All Trap Making recipes require **1 fewer Common-tier material** (minimum 1)
- Unlock Expert Trap Making recipes
- **Carry Capacity:** Increase trap/gadget carry limit by **+1** (stacks with Gadget Specialist if chosen)

---

### Node 5 — Level 11 ⚡ CHOICE (pick 1)

**Option A: Minefield** | 🔴 Active (1/encounter)
> *"Why place one trap when you can place FIVE?"*

- Active ability: **Minefield** — At the start of combat, before initiative, you may place **up to 3 Apprentice-tier traps** instantly across the battlefield for free (from your carried inventory). No action cost.

**Option B: Turret Mastery** | 🟢 Passive + 🟡 Unique Recipe
> *"Your turrets are smarter, tougher, and meaner."*

- All turrets you craft get **+4 HP** and **+2 damage**
- Unlock unique recipe: **Smart Turret**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Smart Turret** | 3 Mithril Ore + 2 Enchanted Gems + 1 Rare Seal | Place: 10 damage/turn, 20 HP, targets the enemy your party is focusing. If an ally is below 25% HP, it switches to healing mode (heals 5 HP/turn to lowest-HP ally instead). |

---

### Node 6 — Level 13 🔓 AUTO

**Master Engineer** | 🟢 Passive + 🟡 Unique Recipe
> *"You don't just build traps. You build WAR MACHINES."*

- All Trap Making recipes require **1 fewer Uncommon-tier material** (minimum 1)
- Unlock Master Trap Making recipes
- Unlock unique recipe: **Deployable Cover**

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Deployable Cover** | 2 Dragonscale Metal + 2 Mithril Ore + 1 Epic Seal | Gadget: Throw to deploy a 3-stud wall of metal plates. Provides full cover (+8 defense) to anyone behind it. 20 HP. Can be redeployed once. LEGO: Build an actual small wall! |

---

### Node 7 — Level 15 ⚡ CHOICE (pick 1)

**Option A: Mech Builder** | 🟡 Unique Recipe
> *"You've been building up to this your whole life. A real, walking, fighting MECH."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Assault Mech** | 4 Dragonscale Metal + 2 Elemental Cores + 1 Epic Seal | Summon a mech for the encounter. The mech is a separate combatant: 30 HP, STR 8, SPD 4, deals 12 damage/attack, and has a rocket launcher (15 damage, 3-stud area, 1/encounter). LEGO: Build a sick mech! |

**Option B: Trap Maze** | 🔴 Active (1/session)
> *"The entire room becomes your weapon."*

- Active ability: **Trap Maze** — Once per session, at the start of an encounter, declare the battlefield a Trap Maze. Place 5 trap tokens across the map. Every time an enemy moves, they have a **50% chance** (d20, 11+) of triggering one, taking 8 damage and being slowed for 1 turn. Lasts entire encounter.

---

### Node 8 — Level 17 🔓 AUTO

**Grandmaster Engineer** | 🟢 Passive
> *"Everything you build works perfectly. Every time. Without exception."*

- All Trap Making recipes require **1 fewer Rare-tier material** (minimum 1)
- Unlock Grandmaster Trap Making recipes
- **Overengineered:** All traps and turrets you build have **double HP** and last **+2 extra turns** (if they have a duration)
- Trap/gadget carry limit increases by **+1** again

---

### Node 9 — Level 19 ⚡ CHOICE (pick 1)

**Option A: Titan Mech** | 🟡 Unique Recipe
> *"This isn't a gadget. This is a TITAN. You climb inside it and become UNSTOPPABLE."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Titan Mech Suit** | 4 Starmetal + 3 Dragon Hearts + 2 Legendary Seals | The player climbs into the mech. For the entire encounter: +20 HP, +8 STR, +4 SPD, +6 defense, ranged attack dealing 15 damage, and a once-per-encounter **Orbital Cannon** (30 damage in 5-stud area). LEGO: Build the biggest mech possible! |

**Option B: Doomsday Network** | 🔴 Active (1/campaign) + 🟡 Unique Recipe
> *"You've been planting devices all campaign. Time to press the big red button."*

| Recipe | Materials | Effect |
|--------|-----------|--------|
| **Doomsday Trigger** | 3 Starmetal + 2 Eternity Stones + 1 Legendary Seal | Create the trigger device. Active ability: Once per campaign, activate the Doomsday Network. ALL enemies in the current encounter take **25 damage**, are stunned for 2 turns, and have their defenses reduced to 0 for 3 turns. The battlefield shakes, explosions everywhere. Cinematic. |

---

## Summary — All Abilities at a Glance

### ⚒️ Blacksmithing

| Level | Type | Name | Category | One-Line |
|-------|------|------|----------|----------|
| 3 | 🔓 | Forge Basics | 🟢 Passive | Apprentice recipes + gear doesn't break on nat 1 |
| 5 | ⚡ | Weapon Focus / Armor Focus | 🟢 Passive | +1 damage to crafted weapons OR +1 defense to crafted armor |
| 7 | ⚡ | Salvage / Rush Order | 🔴/🟡 | Recycle gear for materials OR unlock quick-craft mid-session recipe |
| 9 | 🔓 | Efficient Forging | 🟢 Passive | −1 Common material on all recipes + Expert unlock |
| 11 | ⚡ | Masterwork / Battle Repair | 🟢/🔴 | +2 bonus to one craft per session OR repair gear mid-combat |
| 13 | 🔓 | Master Smith | 🟢+🟡 | −1 Uncommon material + Named Weapon recipe |
| 15 | ⚡ | Legendary Temper / Impenetrable Plate | 🟡/🟡 | Elemental weapon recipe OR survive-knockout armor recipe |
| 17 | 🔓 | Grandmaster Forgewright | 🟢 Passive | −1 Rare material + gear glows |
| 19 | ⚡ | Forge of Legends / Living Armor | 🟡/🟡 | Leveling-up legendary weapon OR regenerating legendary armor |

### 🧪 Alchemy

| Level | Type | Name | Category | One-Line |
|-------|------|------|----------|----------|
| 3 | 🔓 | Budding Alchemist | 🟢 Passive | Apprentice recipes + double brew on Common potions |
| 5 | ⚡ | Potion Specialist / Bomb Specialist | 🟢 Passive | +3 HP on heals OR +2 damage and +1 stud AoE on bombs |
| 7 | ⚡ | Ingredient Stretcher / Volatile Mixtures | 🟢/🟡 | Material substitution OR random-effect Chaos Flask recipe |
| 9 | 🔓 | Efficient Brewing | 🟢 Passive | −1 Common material + Expert unlock + free-action potion drinking |
| 11 | ⚡ | Splash Brewing / Concentrated Formula | 🔴/🟢 | Throw healing potions at range OR double potion durations |
| 13 | 🔓 | Master Alchemist | 🟢+🟡 | −1 Uncommon material + Transmutation Brew recipe |
| 15 | ⚡ | Philosopher's Method / Plague Doctor | 🟡/🔴+🟡 | Permanent +1 stat elixir OR devastating poison + toxic aura |
| 17 | 🔓 | Grandmaster Alchemist | 🟢 Passive | −1 Rare material + triple brew on Common/Uncommon |
| 19 | ⚡ | Elixir of Eternity / Panacea | 🟡/🟡 | God-mode personal elixir OR full party mega-heal |

### 🍳 Cooking

| Level | Type | Name | Category | One-Line |
|-------|------|------|----------|----------|
| 3 | 🔓 | Camp Cook | 🟢 Passive | Apprentice recipes + snacks get +2 HP bonus |
| 5 | ⚡ | Feast Master / Snack Packer | 🟢 Passive | +1 all stats on meals OR carry 3 snacks + double snack output |
| 7 | ⚡ | Forager / Monster Chef | 🟢/🟡 | Free herbs each session OR unique monster-based recipes |
| 9 | 🔓 | Efficient Kitchen | 🟢 Passive | −1 Common material + Expert unlock + free bonus snack |
| 11 | ⚡ | Comfort Food / Spicy Specialist | 🔴/🟡 | Mid-session party heal OR fire damage food recipes |
| 13 | 🔓 | Master Chef | 🟢+🟡 | −1 Uncommon material + 2 meals/session + Hero's Banquet recipe |
| 15 | ⚡ | Legendary Recipes / Battlefield Catering | 🟡/🔴 | Phoenix/Titan food recipes OR feed allies in combat |
| 17 | 🔓 | Grandmaster Chef | 🟢 Passive | −1 Rare material + snacks persist between sessions + meal HP bonus |
| 19 | ⚡ | Feast of the Gods / Endless Pantry | 🟡/🟢+🔴 | Campaign-level god feast OR infinite free snacks + improvised meals |

### ✨ Enchanting

| Level | Type | Name | Category | One-Line |
|-------|------|------|----------|----------|
| 3 | 🔓 | Rune Apprentice | 🟢 Passive | Apprentice recipes + auto-identify magical items |
| 5 | ⚡ | Weapon Enchanter / Ward Enchanter | 🟢 Passive | +1 elemental damage on weapon enchants OR +1 defense on armor enchants |
| 7 | ⚡ | Scroll Scribe / Dual Enchant | 🟡/🟢 | Craft scrolls of any party-known spell OR gear holds 2 enchantments |
| 9 | 🔓 | Efficient Enchanting | 🟢 Passive | −1 Common material + Expert unlock + resonance bonus for multi-enchant |
| 11 | ⚡ | Dispel / Power Surge | 🔴/🔴 | Strip enemy buffs OR double all enchantment bonuses for 2 turns |
| 13 | 🔓 | Master Enchanter | 🟢+🟡 | −1 Uncommon material + Soul Gem recipe (capture boss abilities) |
| 15 | ⚡ | Runeforged Mastery / Curse Breaker | 🟡/🔴+🟢 | Spell-boosting amulet recipe OR party curse immunity + curse removal |
| 17 | 🔓 | Grandmaster Enchanter | 🟢 Passive | −1 Rare material + scrolls get 2 uses |
| 19 | ⚡ | Arcane Singularity / Living Enchantment | 🟡/🟡+🟢 | Boss-killing weapon gem OR self-improving enchantment system |

### 🪤 Trap Making

| Level | Type | Name | Category | One-Line |
|-------|------|------|----------|----------|
| 3 | 🔓 | Tinkerer | 🟢 Passive | Apprentice recipes + traps only cost bonus action to place |
| 5 | ⚡ | Trap Specialist / Gadget Specialist | 🟢 Passive | +2 trap damage and stealth OR carry 4 gadgets + extra gadget uses |
| 7 | ⚡ | Remote Trigger / Recycler | 🔴/🟢 | Detonate traps on command OR 50% chance traps reset after trigger |
| 9 | 🔓 | Efficient Assembly | 🟢 Passive | −1 Common material + Expert unlock + carry +1 |
| 11 | ⚡ | Minefield / Turret Mastery | 🔴/🟢+🟡 | Place 3 free traps pre-combat OR turret buffs + Smart Turret recipe |
| 13 | 🔓 | Master Engineer | 🟢+🟡 | −1 Uncommon material + Deployable Cover recipe |
| 15 | ⚡ | Mech Builder / Trap Maze | 🟡/🔴 | Assault Mech recipe OR turn entire battlefield into a trap |
| 17 | 🔓 | Grandmaster Engineer | 🟢 Passive | −1 Rare material + double trap HP + extended durations + carry +1 |
| 19 | ⚡ | Titan Mech / Doomsday Network | 🟡/🔴+🟡 | Climb-inside mech suit OR campaign-level battlefield nuke |

---

## Database Schema Addition

```sql
-- Profession ability nodes
CREATE TABLE profession_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id UUID REFERENCES crafting_professions(id),
  node_number INT NOT NULL CHECK (node_number BETWEEN 1 AND 9),
  unlock_level INT NOT NULL,
  unlock_type TEXT NOT NULL CHECK (unlock_type IN ('auto', 'choice')),
  option_index INT DEFAULT 0,    -- 0 for auto, 1 or 2 for choice options
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('passive', 'active', 'unique_recipe', 'mixed')),
  description TEXT NOT NULL,      -- kid-friendly flavor text
  effect_summary TEXT NOT NULL,   -- mechanical effect
  icon TEXT,
  unique_recipe_id UUID REFERENCES recipes(id),  -- links to recipe if applicable
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profession_id, node_number, option_index)
);

-- Character ability selections
CREATE TABLE character_profession_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  profession_id UUID REFERENCES crafting_professions(id),
  ability_id UUID REFERENCES profession_abilities(id),
  selected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, profession_id, ability_id)
);
```

---

## Profession Tab — Detailed Component Spec

### Ability Node Component

```tsx
<ProfessionNode
  level={5}
  type="choice"         // "auto" | "choice"
  state="available"     // "locked" | "preview" | "available" | "unlocked"
  options={[
    {
      name: "Weapon Focus",
      category: "passive",
      icon: "⚔️",
      description: "Your blades are sharper than anyone else's.",
      effect: "All weapons you craft gain +1 bonus damage.",
      selected: false
    },
    {
      name: "Armor Focus",
      category: "passive",
      icon: "🛡️",
      description: "Your armor fits like a second skin.",
      effect: "All armor and shields you craft gain +1 bonus defense.",
      selected: false
    }
  ]}
  onSelect={(optionIndex) => handleSelect(5, optionIndex)}
/>
```

### Visual Treatment

```
Node States (vertical tree, top to bottom):

  ✅ UNLOCKED          ⚡ AVAILABLE           🔒 LOCKED            👁️ PREVIEW
  ┌──────────┐       ┌──────────┐         ┌──────────┐       ┌──────────┐
  │ Bright   │       │ Gold     │         │ Dark     │       │ Semi-    │
  │ colored  │       │ pulsing  │         │ gray     │       │ visible  │
  │ glow     │       │ border   │         │ lock 🔒  │       │ ghosted  │
  │ ───────  │       │ CHOOSE!  │         │ Lv. 11   │       │ Lv. 13   │
  │ Name     │       │ ───────  │         │ ───────  │       │ ───────  │
  │ Effect   │       │ Option A │         │ ???      │       │ Name     │
  │          │       │ Option B │         │          │       │ (dimmed) │
  └──────────┘       └──────────┘         └──────────┘       └──────────┘
       │                   │                    │                  │
       ▼                   ▼                    ▼                  ▼
  Connector line    Connector line       Connector line     Connector line
  (solid, bright)   (solid, gold)       (dashed, gray)     (dotted, dim)
```

### Animations

- When a node becomes **available**, the node does a pop-in + glow pulse
- When selecting a **choice**, the chosen option expands and glows while the unchosen fades out
- **Locked** nodes have a subtle lock-wiggle on tap (communicating "not yet!")
- **Connector lines** between nodes fill in with color as nodes are unlocked (like a progress path)
