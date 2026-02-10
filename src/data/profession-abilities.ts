// Static data for all 70 crafting profession abilities
// Source: profession-abilities.md

import type { CraftingProfessionData } from '@/types/game';

export const PROFESSION_ABILITY_DATA: CraftingProfessionData[] = [
  // ═══════════════════════════════════════════════════════════════════
  // BLACKSMITHING
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    icon: '\u2692\uFE0F',
    description: 'Forge weapons and armor. The reliable gear profession.',
    color: '#e74c3c',
    nodes: [
      {
        nodeNumber: 1, unlockLevel: 3, type: 'auto',
        options: [{
          name: 'Forge Basics', category: 'passive', icon: '\u{1F525}',
          description: 'You learn to work the anvil. The heat doesn\'t bother you anymore.',
          effect: 'Unlock Apprentice Blacksmithing recipes. All items you forge have +1 HP durability (gear doesn\'t break on nat 1 fumbles).',
        }],
      },
      {
        nodeNumber: 2, unlockLevel: 5, type: 'choice',
        options: [
          {
            name: 'Weapon Focus', category: 'passive', icon: '\u2694\uFE0F',
            description: 'Your blades are sharper than anyone else\'s.',
            effect: 'All weapons you craft gain +1 bonus damage. Unlock Journeyman weapon recipes.',
          },
          {
            name: 'Armor Focus', category: 'passive', icon: '\u{1F6E1}\uFE0F',
            description: 'Your armor fits like a second skin.',
            effect: 'All armor and shields you craft gain +1 bonus defense. Unlock Journeyman armor recipes.',
          },
        ],
      },
      {
        nodeNumber: 3, unlockLevel: 7, type: 'choice',
        options: [
          {
            name: 'Salvage', category: 'active', icon: '\u267B\uFE0F',
            description: 'Nothing goes to waste in your forge.',
            effect: 'Salvage an unwanted crafted item to recover half its materials (rounded up). 1/session.',
          },
          {
            name: 'Rush Order', category: 'unique_recipe', icon: '\u26A1',
            description: 'When your friends need gear NOW, you deliver.',
            effect: 'Unlock Quickforge Blade: 2 Iron Scraps + 1 Beast Fang \u2192 +2 melee damage weapon. Can craft during a session.',
          },
        ],
      },
      {
        nodeNumber: 4, unlockLevel: 9, type: 'auto',
        options: [{
          name: 'Efficient Forging', category: 'passive', icon: '\u{1F528}',
          description: 'You waste less metal with every swing of the hammer.',
          effect: 'All Blacksmithing recipes require 1 fewer Common-tier material (minimum 1). Unlock Expert recipes.',
        }],
      },
      {
        nodeNumber: 5, unlockLevel: 11, type: 'choice',
        options: [
          {
            name: 'Masterwork', category: 'passive', icon: '\u2B50',
            description: 'People can tell YOUR work from a mile away. It just looks... better.',
            effect: 'Once per session, craft a Masterwork item: +2 to primary stat bonus. Masterwork items glow faintly.',
          },
          {
            name: 'Battle Repair', category: 'active', icon: '\u{1F6E0}\uFE0F',
            description: 'A quick hammer tap and it\'s good as new!',
            effect: 'During combat, spend 1 action to repair ally\'s gear, granting +2 defense for 2 turns. 1/encounter.',
          },
        ],
      },
      {
        nodeNumber: 6, unlockLevel: 13, type: 'auto',
        options: [{
          name: 'Master Smith', category: 'mixed', icon: '\u{1F451}',
          description: 'The forge sings when you work. Legends are made here.',
          effect: 'All recipes require 1 fewer Uncommon material (min 1). Unlock Master recipes + Named Weapon: +6 damage, shout its name for double damage once/battle.',
        }],
      },
      {
        nodeNumber: 7, unlockLevel: 15, type: 'choice',
        options: [
          {
            name: 'Legendary Temper', category: 'unique_recipe', icon: '\u{1F525}',
            description: 'Fire, ice, lightning \u2014 you can fold any element into steel.',
            effect: 'Elemental Forge Weapon: +7 damage, pick element at craft. Deals +4 elemental damage, applies status on crit.',
          },
          {
            name: 'Impenetrable Plate', category: 'unique_recipe', icon: '\u{1F6E1}\uFE0F',
            description: 'They\'ll need a battering ram to get through THIS armor.',
            effect: 'Fortress Armor: +9 defense. Once per encounter, survive knockout with 1 HP instead.',
          },
        ],
      },
      {
        nodeNumber: 8, unlockLevel: 17, type: 'auto',
        options: [{
          name: 'Grandmaster Forgewright', category: 'passive', icon: '\u{1F48E}',
          description: 'Your hands remember what your mind hasn\'t learned yet.',
          effect: 'All recipes require 1 fewer Rare material (min 1). Unlock Grandmaster recipes. All crafted gear glows with profession color.',
        }],
      },
      {
        nodeNumber: 9, unlockLevel: 19, type: 'choice',
        options: [
          {
            name: 'Forge of Legends', category: 'unique_recipe', icon: '\u{1F52E}',
            description: 'Only three of these have ever been made. Yours is the fourth.',
            effect: 'Destiny Blade: +14 melee damage, crit 17\u201320. Crit shockwave hits adjacent for 8 damage. Levels up after 10 crits.',
          },
          {
            name: 'Living Armor', category: 'unique_recipe', icon: '\u{1F9EC}',
            description: 'It breathes. It adapts. It protects you like it\'s alive.',
            effect: 'Adamantine Shell: +12 defense. Immune to crit damage. Regen 3 HP/turn. Blocks killing blow 1/session.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ALCHEMY
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'alchemy',
    name: 'Alchemy',
    icon: '\u{1F9EA}',
    description: 'Brew potions, elixirs, and volatile concoctions. The utility master.',
    color: '#9b59b6',
    nodes: [
      {
        nodeNumber: 1, unlockLevel: 3, type: 'auto',
        options: [{
          name: 'Budding Alchemist', category: 'passive', icon: '\u{1F9EA}',
          description: 'Your first potion didn\'t explode! ...Your second one did, but that was on purpose.',
          effect: 'Unlock Apprentice Alchemy recipes. Double Brew: Common-tier potions produce 2 copies.',
        }],
      },
      {
        nodeNumber: 2, unlockLevel: 5, type: 'choice',
        options: [
          {
            name: 'Potion Specialist', category: 'passive', icon: '\u{1F48A}',
            description: 'Your healing potions are the good stuff.',
            effect: 'All healing potions restore +3 bonus HP. Unlock Journeyman potion recipes.',
          },
          {
            name: 'Bomb Specialist', category: 'passive', icon: '\u{1F4A3}',
            description: 'More boom. Bigger boom. LOUDER boom.',
            effect: 'All bombs deal +2 bonus damage, AoE radius +1 stud. Unlock Journeyman bomb recipes.',
          },
        ],
      },
      {
        nodeNumber: 3, unlockLevel: 7, type: 'choice',
        options: [
          {
            name: 'Ingredient Stretcher', category: 'passive', icon: '\u{1F33F}',
            description: 'A pinch here, a dash there \u2014 you make a little go a long way.',
            effect: 'Replace 1 Uncommon material with 2 Common materials of the same category when crafting.',
          },
          {
            name: 'Volatile Mixtures', category: 'unique_recipe', icon: '\u{1F32A}\uFE0F',
            description: 'Unstable? Yes. Powerful? VERY yes.',
            effect: 'Chaos Flask: Roll d6 for random effect. 1\u20132: 10 fire damage. 3\u20134: Enemies slowed 2 turns. 5\u20136: Allies heal 8 HP.',
          },
        ],
      },
      {
        nodeNumber: 4, unlockLevel: 9, type: 'auto',
        options: [{
          name: 'Efficient Brewing', category: 'passive', icon: '\u2697\uFE0F',
          description: 'You could brew a potion in your sleep. Actually, you did once.',
          effect: 'All recipes require 1 fewer Common material (min 1). Unlock Expert recipes. Quick Sip: free-action potion 1/encounter.',
        }],
      },
      {
        nodeNumber: 5, unlockLevel: 11, type: 'choice',
        options: [
          {
            name: 'Splash Brewing', category: 'active', icon: '\u{1F4A6}',
            description: 'Why drink it when you can THROW it at your friends?',
            effect: 'Throw healing potions at allies within 4 studs. Nearby allies within 2 studs heal half. 1/encounter.',
          },
          {
            name: 'Concentrated Formula', category: 'passive', icon: '\u{1F9EC}',
            description: 'Same bottle, twice the punch.',
            effect: 'All potions and elixirs have doubled duration (3 turns \u2192 6 turns).',
          },
        ],
      },
      {
        nodeNumber: 6, unlockLevel: 13, type: 'auto',
        options: [{
          name: 'Master Alchemist', category: 'mixed', icon: '\u{1F451}',
          description: 'Your potions shimmer with an inner light. Even the bottles look magical.',
          effect: 'All recipes require 1 fewer Uncommon material (min 1). Unlock Master recipes + Transmutation Brew: convert 3 materials to 1 of next tier.',
        }],
      },
      {
        nodeNumber: 7, unlockLevel: 15, type: 'choice',
        options: [
          {
            name: 'Philosopher\'s Method', category: 'unique_recipe', icon: '\u{1F48E}',
            description: 'The ancient alchemists searched for this formula. You found it in a dream.',
            effect: 'Philosopher\'s Elixir: Permanently +1 to one stat. One-time use per character ever.',
          },
          {
            name: 'Plague Doctor', category: 'mixed', icon: '\u2620\uFE0F',
            description: 'Your poisons are legendary. And slightly terrifying.',
            effect: 'Creeping Doom Poison: +5 poison damage for 5 hits, reduces STR. Toxic Aura: 4 poison damage to nearby enemies for 3 turns. 1/session.',
          },
        ],
      },
      {
        nodeNumber: 8, unlockLevel: 17, type: 'auto',
        options: [{
          name: 'Grandmaster Alchemist', category: 'passive', icon: '\u{1F48E}',
          description: 'You see the world differently now. Everything is an ingredient.',
          effect: 'All recipes require 1 fewer Rare material (min 1). Unlock Grandmaster recipes. Triple Brew on Uncommon-tier or below potions.',
        }],
      },
      {
        nodeNumber: 9, unlockLevel: 19, type: 'choice',
        options: [
          {
            name: 'Elixir of Eternity', category: 'unique_recipe', icon: '\u231B',
            description: 'One sip and time stops. Two sips and it reverses. Three sips and... let\'s not find out.',
            effect: '2 actions/turn, double potion effects, immune to negative statuses for 1 encounter. Once per campaign.',
          },
          {
            name: 'Panacea', category: 'unique_recipe', icon: '\u{1F31F}',
            description: 'The cure to everything. Literally everything.',
            effect: 'Full heal entire party, cure all effects, restore all slots, +3 all stats for 3 turns. Once per campaign.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // COOKING
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '\u{1F373}',
    description: 'Prepare meals and snacks that fuel heroes. The most consistently rewarding profession.',
    color: '#e67e22',
    nodes: [
      {
        nodeNumber: 1, unlockLevel: 3, type: 'auto',
        options: [{
          name: 'Camp Cook', category: 'passive', icon: '\u{1F525}',
          description: 'The campfire is your kingdom. Everyone gathers when you start cooking.',
          effect: 'Unlock Apprentice Cooking recipes. All snacks restore +2 bonus HP.',
        }],
      },
      {
        nodeNumber: 2, unlockLevel: 5, type: 'choice',
        options: [
          {
            name: 'Feast Master', category: 'passive', icon: '\u{1F37D}\uFE0F',
            description: 'Your meals are so good, heroes fight BETTER on a full stomach.',
            effect: 'All meals grant +1 to all stats on top of base buff. Unlock Journeyman meal recipes.',
          },
          {
            name: 'Snack Packer', category: 'passive', icon: '\u{1F36A}',
            description: 'Pockets full of goodies. Always prepared.',
            effect: 'Heroes carry 3 snacks instead of 2. All snacks produce 2 copies. Unlock Journeyman snack recipes.',
          },
        ],
      },
      {
        nodeNumber: 3, unlockLevel: 7, type: 'choice',
        options: [
          {
            name: 'Forager', category: 'passive', icon: '\u{1F33F}',
            description: 'You spot edible plants that nobody else even notices.',
            effect: 'Gain 2 Wild Herbs free at session start. Double materials from foraging nodes.',
          },
          {
            name: 'Monster Chef', category: 'unique_recipe', icon: '\u{1F356}',
            description: 'If it has a fang, you can probably cook it. And it\'ll be delicious.',
            effect: 'Monster Stew: +2 STR, +2 TGH for session. Mystery Meat Skewers (x3): 8 HP + random buff.',
          },
        ],
      },
      {
        nodeNumber: 4, unlockLevel: 9, type: 'auto',
        options: [{
          name: 'Efficient Kitchen', category: 'passive', icon: '\u{1F374}',
          description: 'Zero waste. Every scrap becomes something delicious.',
          effect: 'All recipes require 1 fewer Common material (min 1). Unlock Expert recipes. Second Helping: free bonus snack with every meal.',
        }],
      },
      {
        nodeNumber: 5, unlockLevel: 11, type: 'choice',
        options: [
          {
            name: 'Comfort Food', category: 'active', icon: '\u{1F60A}',
            description: 'Your cooking heals more than just hunger.',
            effect: 'At encounter start, allies who ate your meal heal 8 HP and get +2 to next roll. 1/session.',
          },
          {
            name: 'Spicy Specialist', category: 'unique_recipe', icon: '\u{1F336}\uFE0F',
            description: 'HOT HOT HOT! But SO good.',
            effect: 'Dragonfire Curry: +3 STR, +3 damage, melee deals 2 fire damage. Firecracker Candy (x3): +6 fire damage AoE.',
          },
        ],
      },
      {
        nodeNumber: 6, unlockLevel: 13, type: 'auto',
        options: [{
          name: 'Master Chef', category: 'mixed', icon: '\u{1F451}',
          description: 'Kings would pay fortunes for your recipes. You cook for heroes instead.',
          effect: 'All recipes require 1 fewer Uncommon material (min 1). Eat 2 meals/session. Hero\'s Banquet: feeds party, +3 all stats, +10 max HP.',
        }],
      },
      {
        nodeNumber: 7, unlockLevel: 15, type: 'choice',
        options: [
          {
            name: 'Legendary Recipes', category: 'unique_recipe', icon: '\u{1F4D6}',
            description: 'These recipes were lost for a thousand years. You rediscovered them by accident.',
            effect: 'Phoenix Egg Omelette: +4 all stats, auto-revive at half HP. Titan\'s Protein Bar (x2): +5 STR, +5 melee damage.',
          },
          {
            name: 'Battlefield Catering', category: 'active', icon: '\u{1F3C3}',
            description: 'Who says you can\'t cook during a fight?',
            effect: 'Feed a snack to ally within 3 studs as free action 1/encounter. Combat snacks also grant +1 all stats for 2 turns.',
          },
        ],
      },
      {
        nodeNumber: 8, unlockLevel: 17, type: 'auto',
        options: [{
          name: 'Grandmaster Chef', category: 'passive', icon: '\u{1F48E}',
          description: 'Your food is magical. Not metaphorically \u2014 it actually glows.',
          effect: 'All recipes require 1 fewer Rare material (min 1). Unlock Grandmaster recipes. Uneaten snacks persist between sessions. Meals grant +5 max HP.',
        }],
      },
      {
        nodeNumber: 9, unlockLevel: 19, type: 'choice',
        options: [
          {
            name: 'Feast of the Gods', category: 'unique_recipe', icon: '\u{1F30C}',
            description: 'When you cook this, the sky changes color. Legends say the gods themselves can smell it.',
            effect: 'Feeds entire party: +8 all stats, +50 max HP, immune to negatives, +5 damage for session. Once per campaign.',
          },
          {
            name: 'Endless Pantry', category: 'mixed', icon: '\u{1F4E6}',
            description: 'Your backpack is basically a restaurant. Nobody in your party ever goes hungry.',
            effect: '5 free Apprentice snacks per session. 1/session: cook any Expert-tier recipe instantly with no materials.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ENCHANTING
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'enchanting',
    name: 'Enchanting',
    icon: '\u2728',
    description: 'Imbue gear with magical power. The force multiplier.',
    color: '#3498db',
    nodes: [
      {
        nodeNumber: 1, unlockLevel: 3, type: 'auto',
        options: [{
          name: 'Rune Apprentice', category: 'passive', icon: '\u{1F4DC}',
          description: 'The runes whisper to you. Mostly helpful things. Mostly.',
          effect: 'Unlock Apprentice Enchanting recipes. Identify: auto-identify any magical item, enchantment, or trap.',
        }],
      },
      {
        nodeNumber: 2, unlockLevel: 5, type: 'choice',
        options: [
          {
            name: 'Weapon Enchanter', category: 'passive', icon: '\u2694\uFE0F',
            description: 'Swords that shoot lightning? Yes please.',
            effect: 'Weapon enchantments deal +1 bonus elemental damage. Unlock Journeyman weapon enchant recipes.',
          },
          {
            name: 'Ward Enchanter', category: 'passive', icon: '\u{1F6E1}\uFE0F',
            description: 'Your shields shimmer. Your armor hums. Everything you touch becomes safer.',
            effect: 'Armor enchantments grant +1 bonus defense. Unlock Journeyman armor enchant recipes.',
          },
        ],
      },
      {
        nodeNumber: 3, unlockLevel: 7, type: 'choice',
        options: [
          {
            name: 'Scroll Scribe', category: 'unique_recipe', icon: '\u{1F4DC}',
            description: 'Why memorize spells when you can write them down?',
            effect: 'Custom Scroll: craft scrolls of any party-known spell. User casts without spending a slot.',
          },
          {
            name: 'Dual Enchant', category: 'passive', icon: '\u{1F300}',
            description: 'One enchantment? That\'s for beginners.',
            effect: 'Gear you enchant can hold 2 enchantments instead of 1 (must be different elements).',
          },
        ],
      },
      {
        nodeNumber: 4, unlockLevel: 9, type: 'auto',
        options: [{
          name: 'Efficient Enchanting', category: 'passive', icon: '\u2728',
          description: 'The runes flow from your fingers like you\'ve done this a thousand times.',
          effect: 'All recipes require 1 fewer Common material (min 1). Unlock Expert recipes. Resonance: heroes with 2+ enchanted items get +1 to all rolls.',
        }],
      },
      {
        nodeNumber: 5, unlockLevel: 11, type: 'choice',
        options: [
          {
            name: 'Dispel', category: 'active', icon: '\u{1F6AB}',
            description: 'If you can put magic IN, you can pull magic OUT.',
            effect: 'Remove one magical buff/enchantment from an enemy. Destroy magical barriers. Range 6 studs. 1/encounter.',
          },
          {
            name: 'Power Surge', category: 'active', icon: '\u26A1',
            description: 'OVERCHARGE! Everything magical goes to eleven.',
            effect: 'For 2 turns, all enchanted items held by allies deal/grant double their enchantment bonus. 1/encounter.',
          },
        ],
      },
      {
        nodeNumber: 6, unlockLevel: 13, type: 'auto',
        options: [{
          name: 'Master Enchanter', category: 'mixed', icon: '\u{1F451}',
          description: 'Your enchantments are permanent. Your runes are perfect.',
          effect: 'All recipes require 1 fewer Uncommon material (min 1). Unlock Master recipes + Soul Gem: capture boss ability, socket into weapon for 1/encounter use.',
        }],
      },
      {
        nodeNumber: 7, unlockLevel: 15, type: 'choice',
        options: [
          {
            name: 'Runeforged Mastery', category: 'unique_recipe', icon: '\u{1F48E}',
            description: 'The greatest enchanters don\'t add magic to items. They make items that ARE magic.',
            effect: 'Runeforged Amulet: +5 spell damage, spells cost 1 fewer slot (min 1). Pulses with light near magic.',
          },
          {
            name: 'Curse Breaker', category: 'mixed', icon: '\u{1F9F9}',
            description: 'Curses, hexes, dark magic \u2014 none of it sticks when you\'re around.',
            effect: 'Passive: allies within 4 studs immune to curses. Active: remove any permanent negative effect 1/session.',
          },
        ],
      },
      {
        nodeNumber: 8, unlockLevel: 17, type: 'auto',
        options: [{
          name: 'Grandmaster Enchanter', category: 'passive', icon: '\u{1F48E}',
          description: 'You see the threads of magic that hold the world together.',
          effect: 'All recipes require 1 fewer Rare material (min 1). Unlock Grandmaster recipes. Scrolls get 2 uses.',
        }],
      },
      {
        nodeNumber: 9, unlockLevel: 19, type: 'choice',
        options: [
          {
            name: 'Arcane Singularity', category: 'unique_recipe', icon: '\u{1F300}',
            description: 'This is the most powerful enchantment ever created. Use it wisely.',
            effect: 'Socket gem: +10 damage, ignore resistances, crit 17\u201320, TGH 20 check or instantly defeated. Once per campaign.',
          },
          {
            name: 'Living Enchantment', category: 'mixed', icon: '\u{1F9EC}',
            description: 'Your enchantments evolve. They grow. They learn.',
            effect: 'Evolving Enchantment: starts +3, gains +1 per session with a crit (no cap). All past enchantments gain +1 retroactively.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRAP MAKING
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'trap_making',
    name: 'Trap Making',
    icon: '\u{1FAA4}',
    description: 'Build traps, bombs, turrets, and gadgets. Battlefield control master.',
    color: '#2ecc71',
    nodes: [
      {
        nodeNumber: 1, unlockLevel: 3, type: 'auto',
        options: [{
          name: 'Tinkerer', category: 'passive', icon: '\u{1F527}',
          description: 'Springs, gears, levers \u2014 you see machines in your dreams.',
          effect: 'Unlock Apprentice Trap Making recipes. Quick Setup: placing traps costs a bonus action instead of full action.',
        }],
      },
      {
        nodeNumber: 2, unlockLevel: 5, type: 'choice',
        options: [
          {
            name: 'Trap Specialist', category: 'passive', icon: '\u{1FAA4}',
            description: 'Your traps are meaner. And better hidden.',
            effect: 'All traps deal +2 damage, enemies get \u22122 to spot/avoid. Unlock Journeyman trap recipes.',
          },
          {
            name: 'Gadget Specialist', category: 'passive', icon: '\u{1F529}',
            description: 'Jetpacks, grapple hooks, smoke machines \u2014 your toy box is endless.',
            effect: 'Carry 4 traps/gadgets per session instead of 3. Reusable gadgets get +1 use. Unlock Journeyman gadget recipes.',
          },
        ],
      },
      {
        nodeNumber: 3, unlockLevel: 7, type: 'choice',
        options: [
          {
            name: 'Remote Trigger', category: 'active', icon: '\u{1F4E1}',
            description: 'Why step on the trap when you can press a button?',
            effect: 'All traps can be detonated remotely on your turn. Time detonations for max impact.',
          },
          {
            name: 'Recycler', category: 'passive', icon: '\u267B\uFE0F',
            description: 'Your traps don\'t break \u2014 they reset.',
            effect: 'When a trap activates, roll d20. On 12+, the trap resets and can activate again next turn.',
          },
        ],
      },
      {
        nodeNumber: 4, unlockLevel: 9, type: 'auto',
        options: [{
          name: 'Efficient Assembly', category: 'passive', icon: '\u{1F529}',
          description: 'Leftover parts from one gadget become the start of the next one.',
          effect: 'All recipes require 1 fewer Common material (min 1). Unlock Expert recipes. Carry limit +1.',
        }],
      },
      {
        nodeNumber: 5, unlockLevel: 11, type: 'choice',
        options: [
          {
            name: 'Minefield', category: 'active', icon: '\u{1F4A3}',
            description: 'Why place one trap when you can place FIVE?',
            effect: 'Before initiative, place up to 3 Apprentice traps from inventory for free. 1/encounter.',
          },
          {
            name: 'Turret Mastery', category: 'mixed', icon: '\u{1F3EF}',
            description: 'Your turrets are smarter, tougher, and meaner.',
            effect: 'All turrets get +4 HP, +2 damage. Smart Turret: 10 dmg/turn, 20 HP, auto-targets focus or heals lowest ally.',
          },
        ],
      },
      {
        nodeNumber: 6, unlockLevel: 13, type: 'auto',
        options: [{
          name: 'Master Engineer', category: 'mixed', icon: '\u{1F451}',
          description: 'You don\'t just build traps. You build WAR MACHINES.',
          effect: 'All recipes require 1 fewer Uncommon material (min 1). Unlock Master recipes + Deployable Cover: 3-stud wall, +8 defense, 20 HP.',
        }],
      },
      {
        nodeNumber: 7, unlockLevel: 15, type: 'choice',
        options: [
          {
            name: 'Mech Builder', category: 'unique_recipe', icon: '\u{1F916}',
            description: 'You\'ve been building up to this your whole life. A real, walking, fighting MECH.',
            effect: 'Assault Mech: 30 HP, STR 8, SPD 4, 12 damage/attack. Rocket launcher: 15 damage 3-stud area 1/encounter.',
          },
          {
            name: 'Trap Maze', category: 'active', icon: '\u{1F310}',
            description: 'The entire room becomes your weapon.',
            effect: 'Declare Trap Maze: 5 trap tokens, enemies have 50% chance to trigger (8 damage + slow) on move. 1/session.',
          },
        ],
      },
      {
        nodeNumber: 8, unlockLevel: 17, type: 'auto',
        options: [{
          name: 'Grandmaster Engineer', category: 'passive', icon: '\u{1F48E}',
          description: 'Everything you build works perfectly. Every time. Without exception.',
          effect: 'All recipes require 1 fewer Rare material (min 1). Unlock Grandmaster recipes. All traps/turrets have double HP, +2 turns duration. Carry +1.',
        }],
      },
      {
        nodeNumber: 9, unlockLevel: 19, type: 'choice',
        options: [
          {
            name: 'Titan Mech', category: 'unique_recipe', icon: '\u{1F680}',
            description: 'This isn\'t a gadget. This is a TITAN. You climb inside it and become UNSTOPPABLE.',
            effect: 'Titan Mech Suit: +20 HP, +8 STR, +4 SPD, +6 def. Ranged 15 damage. Orbital Cannon: 30 damage 5-stud area 1/encounter.',
          },
          {
            name: 'Doomsday Network', category: 'mixed', icon: '\u{1F4A5}',
            description: 'You\'ve been planting devices all campaign. Time to press the big red button.',
            effect: 'All enemies take 25 damage, stunned 2 turns, defenses reduced to 0 for 3 turns. Once per campaign.',
          },
        ],
      },
    ],
  },
];

// Helper to look up a profession by ID
export function getProfessionData(id: string): CraftingProfessionData | undefined {
  return PROFESSION_ABILITY_DATA.find((p) => p.id === id);
}

// Helper to compute node state based on character level and selections
export function getNodeState(
  node: { nodeNumber: number; unlockLevel: number; type: 'auto' | 'choice' },
  characterLevel: number,
  selections: Record<number, number>, // nodeNumber -> optionIndex
): 'locked' | 'preview' | 'available' | 'unlocked' {
  // Already selected?
  if (selections[node.nodeNumber] !== undefined) return 'unlocked';

  // Character meets level requirement?
  if (characterLevel >= node.unlockLevel) {
    // Auto nodes unlock automatically
    if (node.type === 'auto') return 'unlocked';
    return 'available';
  }

  // Preview: next 1-2 upcoming nodes
  if (node.unlockLevel <= characterLevel + 4) return 'preview';

  return 'locked';
}
