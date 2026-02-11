# 👹 LEGO QUEST — Complete Bestiary

*Every monster in the game, organized by family. All creatures include Movement (MOV) and Attack Range for grid-based tactical combat on the 10×10 board.*

---

## Monster Stat Reference

**Formula:** Level ÷ 2 + 2 = average stat. Specialists deviate ±2–4 from average.
**HP** = TGH × 3 (standard) | TGH × 4 or 5 (boss)
**MOV** = Spaces per turn on the 10×10 grid
**Range** = Attack range in spaces (Melee 1, Reach 2, Short 3–4, Medium 5–6, Long 7–8)

### Range Key
| Code | Meaning |
|------|---------|
| M1 | Melee, 1 space (adjacent) |
| R2 | Reach, 2 spaces |
| S3 / S4 | Short, 3 or 4 spaces |
| Md5 / Md6 | Medium, 5 or 6 spaces |
| L7 / L8 | Long, 7 or 8 spaces |
| X10 | Extreme, full board |

### AoE Key
| Code | Meaning |
|------|---------|
| ST | Single target |
| Rad X | Radius X spaces |
| Line X | Line X spaces long |
| Cone X | Cone X spaces |
| Aura X | Aura X spaces around self |

---

## Family 1: Goblinoids 🟢
*Sneaky, numerous, cowardly alone but dangerous in packs. The classic starter enemy.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Goblin Runt | 1 | 1 | 4 | 1 | 1 | 3 | 1 | 5 | M1, ST | Flees at half HP |
| Goblin Scout | 1 | 2 | 4 | 2 | 1 | 6 | 2 | 5 | M1, ST | +2 initiative |
| Goblin Archer | 2 | 1 | 5 | 2 | 2 | 6 | 3 | 4 | Md5, ST | Ranged attack; −3 at M1 |
| Goblin Shaman | 3 | 1 | 3 | 3 | 5 | 9 | 4 | 3 | S4, ST | Heal Goblin 4 HP (S4, ST). Zap (S3, ST, 3 dmg) |
| Goblin Brute | 3 | 5 | 3 | 4 | 1 | 12 | 5 | 3 | M1, ST | Cleave: hit 2 adjacent enemies |
| Goblin Wolf Rider | 4 | 4 | 5 | 3 | 2 | 9 | 4 | 6 | M1, ST | Charge: +3 dmg if moved 4+ spaces |
| Goblin Bomber | 4 | 2 | 4 | 2 | 4 | 6 | 5 | 4 | S4, Rad 1 | Bomb: S4 range, Rad 1 AoE, 5 dmg |
| Hobgoblin Soldier | 5 | 5 | 4 | 5 | 3 | 15 | 5 | 4 | M1, ST | Shield: +2 defense. Disciplined (immune to fear) |
| Hobgoblin Captain | 7 | 6 | 5 | 6 | 4 | 18 | 7 | 4 | M1, ST | Rally: allies within Aura 3 get +2 attack |
| Bugbear | 6 | 7 | 3 | 5 | 2 | 15 | 7 | 3 | R2, ST | Reach 2. Ambush: +5 dmg from stealth |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Goblin King** | 3 | 4 | 3 | 5 | 2 | 20 | 5 | 3 | M1, ST | Summons 2 Goblin Scouts (adjacent spaces) below 10 HP. Crown Smash: M1, 8 dmg, stun 1 turn |
| **Hobgoblin Warlord** | 8 | 8 | 5 | 7 | 4 | 35 | 9 | 4 | R2, ST | Reach 2. War Cry: Aura 4, all goblins +3 dmg for 2 turns. Summons 2 Hobgoblin Soldiers at half HP |

---

## Family 2: Undead 💀
*Relentless, spooky, and varied. From shambling zombies to terrifying liches.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Skeleton | 1 | 3 | 2 | 3 | 1 | 9 | 3 | 3 | M1, ST | Vulnerable to blunt (+2 dmg from maces/hammers) |
| Zombie | 2 | 3 | 1 | 4 | 0 | 12 | 3 | 2 | M1, ST | Undying: first time reduced to 0 HP, stands with 1 HP |
| Skeleton Archer | 3 | 2 | 4 | 3 | 1 | 9 | 4 | 3 | Md6, ST | Ranged attack; −3 at M1 |
| Ghost | 4 | 1 | 5 | 3 | 4 | 9 | 3 | 5 | M1, ST | Phasing: moves through enemies and obstacles. Immune to non-magic weapons |
| Bone Knight | 5 | 6 | 3 | 6 | 2 | 18 | 6 | 3 | M1, ST | Shield Wall: +3 defense. Immune to poison |
| Ghoul | 5 | 5 | 5 | 4 | 2 | 12 | 5 | 4 | M1, ST | Paralyze: on hit, target TGH check (12) or loses next action |
| Shadow | 6 | 3 | 6 | 4 | 5 | 12 | 6 | 5 | M1, ST | Incorporeal: 50% miss chance (physical attacks). Drains 2 HP on hit (heals self) |
| Wraith | 8 | 4 | 6 | 5 | 7 | 15 | 8 | 5 | S3, ST | Life Drain: S3 range, heals for damage dealt. Phasing. Immune to non-magic |
| Death Knight | 10 | 9 | 5 | 8 | 6 | 24 | 10 | 4 | M1, ST | Dark Smite: M1, +6 holy dmg. Aura of Fear: Aura 2, enemies −2 all rolls |
| Bone Dragon | 12 | 10 | 6 | 9 | 7 | 27 | 12 | 4 | M1/Md6 | Breath: Necrotic Cone 4, 10 dmg. Fly (MOV 6 flying) |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Necromancer** | 8 | 3 | 4 | 5 | 9 | 20 | 10 | 3 | Md6, ST | Raise Dead: summon 2 Skeletons or 1 Zombie (S4). Dark Bolt: Md6, 10 dmg. At half HP, sacrifices minions (each killed heals him 5 HP) |
| **Lich King** | 15 | 5 | 6 | 8 | 14 | 40 | 15 | 4 | L8, ST | Soul Bolt: L8, 15 dmg. Death Wave: Cone 5, 12 dmg + stun. Phylactery: must destroy hidden object to kill permanently. Summons 2 Wraiths at half HP |
| **Vampire Lord** | 12 | 8 | 8 | 7 | 9 | 35 | 11 | 6 | M1, ST | Life Drain: heals for all damage dealt. Charm: Md5, ST, target SMT check (16) or fights for vampire 1 turn. Mist Form: becomes untargetable, moves 8 spaces, reappears. Vulnerable to holy (+5 dmg) |

---

## Family 3: Beasts 🐺
*Animals and natural creatures. Simple but fast. Great for early encounters and swarm tactics.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Giant Rat | 1 | 2 | 5 | 1 | 1 | 3 | 2 | 5 | M1, ST | Pack Tactics: +1 attack per adjacent rat ally |
| Cave Bat | 1 | 1 | 6 | 1 | 1 | 3 | 1 | 6 | M1, ST | Flying. Swoops: moves full MOV, attacks, moves remaining MOV |
| Wolf | 3 | 4 | 5 | 3 | 2 | 9 | 4 | 5 | M1, ST | Pack Tactics: +2 attack if adjacent wolf ally. Knockdown: on hit, SPD check (10) or prone |
| Boar | 3 | 5 | 3 | 4 | 1 | 12 | 4 | 4 | M1, ST | Charge: +4 dmg if moved 3+ spaces in straight line |
| Giant Spider | 5 | 5 | 5 | 4 | 2 | 12 | 5 | 4 | M1/S3 | Web Shot: S3, ST, SPD check (12) or rooted 1 turn. Wall Climb: ignores obstacles |
| Dire Wolf | 5 | 6 | 6 | 4 | 2 | 12 | 6 | 6 | M1, ST | Pack Tactics: +2. Trip: on crit, target prone + loses next action |
| Bear | 6 | 8 | 4 | 6 | 2 | 18 | 7 | 4 | M1, ST | Maul: if both claws hit (2 attacks), bonus 4 dmg. Tough Hide: −2 dmg from physical |
| Giant Scorpion | 7 | 7 | 5 | 6 | 1 | 18 | 6 | 4 | R2, ST | Reach 2 (tail). Poison Sting: on hit, 3 poison dmg/turn for 2 turns |
| Wyvern | 9 | 9 | 7 | 7 | 3 | 21 | 9 | 5 | M1, ST | Flying (MOV 7 flying). Poison Tail: R2, 6 dmg + poison 3/turn for 2 turns |
| Hydra | 12 | 10 | 4 | 10 | 3 | 30 | 8 | 3 | R2, ST | 3 heads = 3 attacks per turn (different targets, R2 each). Regenerate 4 HP/turn. Cut head: on crit, lose 1 attack but spawn is prevented by fire dmg |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Alpha Wolf** | 4 | 5 | 6 | 4 | 3 | 16 | 5 | 6 | M1, ST | Howl: Aura 5, all wolves +3 attack for 2 turns. Summons 2 Wolves when below half HP. Pack Leader: always acts first in initiative |
| **Queen Spider** | 8 | 7 | 6 | 6 | 4 | 30 | 8 | 4 | M1/S4 | Web Trap: S4, Rad 2, all targets rooted 2 turns. Summon Spiderlings: 3 Giant Spiders. Poison Bite: M1, 8 dmg + poison 4/turn for 3 turns |

---

## Family 4: Elementals 🌀
*Living forces of nature. Each type has a distinct personality and weakness.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Fire Sprite | 3 | 2 | 6 | 2 | 4 | 6 | 4 | 5 | S3, ST | Burn: target takes 2 fire dmg next turn. Immune to fire. Vulnerable to ice (+3 dmg) |
| Ice Shard | 3 | 3 | 3 | 4 | 3 | 12 | 3 | 2 | S4, ST | Freeze: on hit, target MOV halved next turn. Immune to ice. Vulnerable to fire (+3 dmg) |
| Dust Devil | 4 | 4 | 7 | 2 | 3 | 6 | 4 | 7 | M1, Rad 1 | Whirlwind: M1, Rad 1, 4 dmg + push all 2 spaces. Hard to hit: ranged attacks −3 |
| Fire Elemental | 7 | 7 | 5 | 6 | 5 | 18 | 8 | 4 | M1/S4 | Fire Bolt: S4, ST, 8 dmg. Burn Aura: Aura 1, adjacent enemies take 3 fire dmg/turn. Immune to fire |
| Ice Elemental | 7 | 6 | 3 | 7 | 5 | 21 | 7 | 3 | M1/S4 | Frost Blast: S4, ST, 7 dmg + slow. Freeze Ground: Rad 2 centered on self, enemies MOV halved. Immune to ice |
| Storm Elemental | 8 | 5 | 8 | 5 | 7 | 15 | 9 | 6 | Md6, ST | Chain Spark: Md6, bounces to 1 extra target within 2 spaces (5 dmg). Flying. Immune to lightning |
| Earth Elemental | 8 | 9 | 2 | 9 | 3 | 27 | 9 | 2 | M1, ST | Tremor: Rad 2, 6 dmg + prone. Rocky: physical dmg reduced by 3. Immune to poison |
| Magma Golem | 10 | 10 | 3 | 10 | 4 | 30 | 11 | 2 | M1/S3 | Lava Spit: S3, ST, 8 fire dmg + burn 3/turn. Eruption: on death, Rad 2, 10 fire dmg |
| Void Wisp | 10 | 3 | 8 | 5 | 10 | 15 | 12 | 6 | Md6, ST | Void Bolt: Md6, 12 dmg. Blink: after attacking, teleport 3 spaces. Immune to non-magic |
| Primal Elemental | 14 | 11 | 6 | 11 | 8 | 33 | 14 | 4 | M1/Md6 | Shifts element each turn (fire/ice/storm/earth). Uses that element's abilities. Resistant to current element. Weak to opposite |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Inferno Lord** | 10 | 9 | 6 | 8 | 8 | 40 | 12 | 4 | M1/Md6 | Meteor Rain: Md6, Rad 2, 12 dmg + burn 4/turn. Fire Wall: Line 6, blocks movement, 6 dmg to cross. Summons 2 Fire Elementals. Immune to fire |
| **Tempest King** | 14 | 7 | 10 | 8 | 12 | 40 | 15 | 7 | L8, ST | Lightning Storm: L8, Rad 3, 15 dmg. Gale Force: Cone 5, push all 4 spaces. Teleport: move anywhere on board once/round. Flying. Immune to lightning |

---

## Family 5: Constructs 🗿
*Built things — golems, animated armor, clockwork machines. High TGH, low SPD. Walls of HP.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Animated Broom | 1 | 1 | 4 | 2 | 0 | 6 | 1 | 4 | M1, ST | Sweep: pushes target 1 space. Fragile: crits destroy instantly |
| Clay Golem | 4 | 6 | 2 | 6 | 0 | 18 | 5 | 2 | M1, ST | Slow Slam: M1, stun 1 turn on hit. Immune to poison, sleep |
| Animated Armor | 5 | 6 | 3 | 7 | 0 | 21 | 6 | 3 | M1, ST | Shield Block: +3 defense. Can equip dropped weapons. Immune to poison, charm, fear |
| Clockwork Spider | 5 | 4 | 6 | 4 | 3 | 12 | 4 | 5 | M1/S3 | Zap Wire: S3, ST, 4 dmg + stun 1 turn. Wall Climb |
| Stone Golem | 7 | 8 | 2 | 8 | 1 | 24 | 7 | 2 | M1, ST | Earthquake: Rad 2, 5 dmg + prone. Rocky: physical dmg −3. Immune to poison, sleep, charm |
| Iron Guardian | 9 | 9 | 3 | 9 | 2 | 27 | 9 | 3 | M1/R2 | Reach 2 (halberd). Shield Wall: adjacent allies +3 defense. Immune to poison, charm, fear, magic under Tier 3 |
| Clockwork Knight | 10 | 8 | 5 | 8 | 4 | 24 | 8 | 4 | M1, ST | Overclock: for 2 turns, gets 2 actions/turn. Then shuts down for 1 turn. Immune to charm, fear |
| Siege Golem | 12 | 12 | 1 | 12 | 1 | 36 | 14 | 1 | M1/R2 | Boulder Throw: Md6, ST, 10 dmg. Siege: double damage to walls/objects. Immune to almost everything |
| Crystal Golem | 14 | 10 | 4 | 11 | 6 | 33 | 12 | 3 | M1/S4 | Reflect: 50% chance to bounce ranged spells back at caster. Laser: S4, Line 4, 10 dmg |
| Titan Construct | 18 | 14 | 3 | 14 | 4 | 42 | 18 | 3 | R2/Md6 | Reach 2. Cannon: Md6, Rad 2, 15 dmg. Stomp: Rad 2, 10 dmg + prone. Immune to all status effects |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **The Iron Colossus** | 12 | 11 | 3 | 10 | 3 | 50 | 13 | 2 | R2/Md6 | Cannon Arm: Md6, Rad 2, 12 dmg. Stomp: Rad 2, 8 dmg + prone. Armor Plates: first 3 hits deal half dmg. At half HP, overclocks (2 actions/turn for 3 turns) |
| **Arcane Engine** | 16 | 8 | 5 | 12 | 10 | 60 | 16 | 3 | L8, Rad 2 | Arcane Beam: L8, Line 6, 16 dmg. Shield Generator: Aura 3, allies take half dmg. Summons 2 Clockwork Knights. Self-Repair: heals 5 HP/turn |

---

## Family 6: Dragons 🐉
*The apex predators. Iconic bosses. Each color = different element.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Dragon Wyrmling | 3 | 4 | 4 | 3 | 3 | 9 | 4 | 4 | M1/S3 | Baby Breath: Cone 2, 4 dmg (element varies). Flying (MOV 5 flying) |
| Drake (wingless) | 5 | 7 | 4 | 6 | 2 | 18 | 7 | 4 | M1, ST | Tail Sweep: R2, hits all adjacent behind. Tough Scales: physical dmg −2 |
| Young Red Dragon | 8 | 8 | 6 | 7 | 5 | 21 | 9 | 4 | M1/Md5 | Fire Breath: Cone 3, 10 fire dmg. Flying (MOV 6). Immune to fire |
| Young Blue Dragon | 8 | 7 | 7 | 6 | 6 | 18 | 10 | 5 | M1/Md6 | Lightning Bolt: Line 6, 10 lightning dmg. Flying (MOV 7). Immune to lightning |
| Young White Dragon | 8 | 8 | 5 | 8 | 4 | 24 | 8 | 3 | M1/S4 | Ice Breath: Cone 3, 8 ice dmg + slow. Flying (MOV 5). Immune to ice |
| Young Green Dragon | 8 | 7 | 6 | 7 | 5 | 21 | 8 | 4 | M1/Md5 | Poison Cloud: Rad 2, 6 poison dmg/turn for 2 turns. Flying (MOV 6). Immune to poison |
| Adult Red Dragon | 14 | 12 | 7 | 11 | 8 | 33 | 14 | 4 | M1/Md6 | Fire Breath: Cone 4, 15 fire dmg. Tail Sweep: R2, 10 dmg. Flying (MOV 7). Immune to fire. Frightful Presence: Aura 4, enemies SMT check (14) or −3 all rolls |
| Adult Blue Dragon | 14 | 11 | 8 | 10 | 9 | 30 | 15 | 5 | M1/L7 | Lightning Bolt: Line 7, 15 dmg. Wing Buffet: Rad 2, push 3 spaces. Flying (MOV 8). Immune to lightning |
| Shadow Dragon | 16 | 10 | 8 | 10 | 10 | 30 | 14 | 5 | M1/Md6 | Shadow Breath: Cone 4, 14 dmg + blind 1 turn. Phasing: moves through obstacles. Flying (MOV 7). Invisible in darkness |
| Dragon Turtle | 15 | 13 | 2 | 14 | 5 | 42 | 16 | 2 | M1/S4 | Steam Breath: Cone 4, 14 dmg. Shell: takes half damage while defending. Aquatic. MOV 5 in water |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Dragon Hatchling** | 5 | 8 | 5 | 7 | 4 | 30 | 10 | 4 | M1/S4 | Fire Breath: Cone 3, 8 dmg. Flying (MOV 6). Tail Swipe: R2, 6 dmg |
| **Ancient Dragon** | 15 | 13 | 8 | 12 | 10 | 60 | 15 | 4 | M1/L7 | Fire Breath: Cone 5, 18 dmg. Tail Sweep: R2, all behind, 12 dmg. Wing Buffet: Rad 3, push 4 + prone. Frightful Presence: Aura 5, SMT check (16) or skip turn. Flying (MOV 8). Legendary: 2 extra reactions/round |
| **Dragon God** | 20 | 15 | 10 | 15 | 13 | 75 | 20 | 5 | M1/X10 | Elemental Storm: X10, Rad 3, 20 dmg (element shifts). Devour: M1, 25 dmg, swallows target (10 dmg/turn until freed). Flying (MOV 10). Immune to all elements. 3 legendary actions/round |

---

## Family 7: Demons 😈
*Evil, brutal, and powerful. High-level threats with nasty abilities.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Imp | 3 | 2 | 5 | 2 | 3 | 6 | 3 | 4 | M1/S3 | Fire Bolt: S3, 3 fire dmg. Flying (MOV 5). Invisible at will (breaks on attack). Annoying laugh |
| Hell Hound | 5 | 6 | 5 | 5 | 2 | 15 | 6 | 5 | M1/S3 | Fire Breath: Cone 2, 6 fire dmg. Immune to fire. Pack Tactics: +2 with adjacent hell hound |
| Demon Soldier | 7 | 7 | 5 | 6 | 4 | 18 | 8 | 4 | M1, ST | Flame Blade: M1, 8 fire dmg. Fire Resistant (half fire dmg). Fear Aura: Aura 1, enemies −1 attack |
| Succubus | 8 | 4 | 6 | 5 | 8 | 15 | 6 | 4 | M1/Md5 | Charm: Md5, ST, SMT check (14) or target fights for succubus 1 turn. Drain Kiss: M1, 6 dmg + heal self. Shapechanger |
| Shadow Demon | 9 | 6 | 7 | 5 | 7 | 15 | 9 | 5 | M1, ST | Shadow Strike: M1, 9 dmg + blind 1 turn. Phasing. Vulnerable to holy (+5 dmg). Invisible in darkness |
| Barbed Devil | 10 | 9 | 5 | 8 | 5 | 24 | 10 | 4 | M1/R2 | Reach 2 (barbed whip). Barbs: attackers who hit in melee take 3 dmg. Fire Resistant |
| Pit Fiend | 14 | 12 | 6 | 10 | 8 | 30 | 14 | 4 | M1/Md6 | Hellfire: Md6, Rad 2, 12 fire dmg. Fear Aura: Aura 3, SMT check (14) or flee. Flying (MOV 6). Immune to fire, poison |
| Balor | 16 | 14 | 5 | 12 | 7 | 36 | 16 | 4 | R2/S4 | Fire Whip: R2, ST, 12 fire dmg + pull 2 spaces. Flame Sword: M1, 16 dmg. Fire Aura: Aura 1, 5 fire dmg/turn. Flying (MOV 5). On death: Rad 3, 15 fire dmg |
| Arch-Demon | 18 | 13 | 7 | 13 | 11 | 39 | 18 | 5 | M1/L8 | Doom Bolt: L8, ST, 18 dmg. Corruption: Md5, ST, target loses 1 action/turn for 3 turns. Summons 2 Demon Soldiers. Immune to fire, poison, charm, fear |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Demon Prince** | 12 | 10 | 7 | 9 | 9 | 45 | 13 | 5 | M1/Md6 | Hellfire Storm: Md6, Rad 3, 13 fire dmg. Dark Pact: sacrifices minion to heal 10 HP. Summons Imps (3) and Demon Soldiers (2). Flying (MOV 6). Phase 2 at half HP: gains 2 actions/turn |
| **The Abyss Lord** | 20 | 15 | 8 | 15 | 14 | 75 | 22 | 5 | M1/X10 | Abyss Gate: summon 4 demons anywhere on board. Void Blast: X10, Rad 3, 20 dmg. Devour Soul: Md5, ST, 22 dmg + no revive until boss dies. Immune to fire/poison/charm/fear. 3 legendary actions/round |

---

## Family 8: Orcs & Brutes 🪓
*Straightforward brawlers. High STR, charge forward, hit hard.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Orc Grunt | 3 | 5 | 3 | 4 | 1 | 12 | 4 | 4 | M1, ST | Aggressive: can move 2 extra spaces toward nearest enemy |
| Orc Archer | 4 | 4 | 5 | 3 | 2 | 9 | 4 | 4 | Md5, ST | Ranged. Switches to melee (M1, 4 dmg) when enemy adjacent |
| Orc Warrior | 5 | 6 | 4 | 5 | 2 | 15 | 6 | 4 | M1, ST | Charge: +3 dmg if moved 3+ spaces. Rage: +2 dmg when below half HP |
| Orc Berserker | 7 | 8 | 5 | 5 | 1 | 15 | 9 | 5 | M1, ST | Frenzy: 2 attacks per turn but −2 defense. Rage: +3 dmg below half HP. Won't retreat |
| Ogre | 6 | 8 | 2 | 7 | 1 | 21 | 8 | 3 | R2, ST | Reach 2 (club). Sweep: hits all adjacent, 5 dmg. Dim: immune to charm/illusions (too dumb) |
| Orc Shaman | 7 | 4 | 4 | 5 | 6 | 15 | 7 | 3 | Md5, ST | Blood Bolt: Md5, 7 dmg. War Drum: Aura 4, allies +2 attack + +1 MOV. Heal: S4, 6 HP |
| Hill Giant | 10 | 11 | 3 | 10 | 2 | 30 | 12 | 3 | R2/Md5 | Reach 2. Rock Throw: Md5, ST, 10 dmg. Stomp: Rad 1, 8 dmg + prone |
| Orc War Chief | 10 | 9 | 5 | 8 | 4 | 24 | 10 | 4 | M1, ST | Rally: Aura 4, all orcs +3 attack for 2 turns. Execute: if target below 10 HP, auto-kill |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Orc Warlord** | 8 | 8 | 5 | 7 | 3 | 35 | 9 | 4 | M1, ST | War Cry: Aura 5, all orcs +3 dmg for 3 turns. Charge: move 6 spaces, 12 dmg. Summons 2 Orc Warriors at half HP. Rage: +4 dmg below quarter HP |
| **Troll King** | 12 | 12 | 4 | 11 | 3 | 55 | 14 | 3 | R2, ST | Reach 2. Regenerate 5 HP/turn (stopped by fire). Hurl: grab adjacent creature, throw Md5, 10 dmg to both. Roar: Aura 3, enemies SMT check (14) or flee 3 spaces |

---

## Family 9: Dark Casters 🌑
*Mages, necromancers, and warlocks. Ranged and deadly, but fragile.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Cultist | 2 | 2 | 3 | 2 | 3 | 6 | 3 | 3 | S3, ST | Dark Bolt: S3, 3 dmg. Sacrifice: kills self to heal boss 10 HP |
| Dark Apprentice | 4 | 2 | 4 | 3 | 5 | 9 | 5 | 3 | Md5, ST | Shadow Bolt: Md5, 5 dmg. Curse: S4, ST, target −2 all rolls for 2 turns |
| Dark Mage | 5 | 3 | 4 | 4 | 7 | 12 | 8 | 3 | Md6, ST | Shadow Bolt: Md6, 8 dmg. Dark Shield: +4 defense for 1 turn. Teleport: move 4 spaces instantly |
| Warlock | 7 | 3 | 5 | 5 | 7 | 15 | 9 | 3 | Md6, ST | Eldritch Blast: Md6, 9 dmg. Hex: Md5, ST, target takes +3 dmg from all sources for 3 turns. Demon Minion: summon 1 Imp |
| Necromancer | 8 | 3 | 4 | 5 | 9 | 15 | 10 | 3 | Md6, ST | Death Bolt: Md6, 10 dmg. Raise Dead: S4, summon 2 Skeletons. Life Drain: S4, ST, 6 dmg + heal self |
| Shadow Weaver | 10 | 3 | 6 | 6 | 10 | 18 | 12 | 4 | Md6, ST | Shadow Bolt: Md6, 12 dmg. Darkness: Rad 3 centered on self, enemies inside blind. Teleport 5 spaces |
| Arch-Mage | 12 | 4 | 5 | 7 | 12 | 21 | 14 | 3 | L8, ST | Arcane Barrage: L8, 14 dmg. Chain Lightning: L7, Line 5, bounces to 2 extra targets (8 dmg each). Counterspell: negate 1 spell/round |
| Void Sorcerer | 15 | 4 | 6 | 8 | 13 | 24 | 16 | 4 | L8, ST | Void Beam: L8, Line 6, 16 dmg. Gravity Well: Md6, Rad 2, pulls all to center + 10 dmg. Teleport anywhere on board |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **The Dark Witch** | 10 | 4 | 6 | 6 | 11 | 30 | 12 | 4 | L7, ST | Curse Storm: L7, Rad 2, 10 dmg + random curse (slow/blind/weak). Summons 2 Dark Mages. Mirror Image: 2 copies. Teleport. Phase 2: transforms into Shadow Dragon form (use Shadow Dragon stats + spellcasting) |
| **The Lich** | 15 | 5 | 6 | 8 | 14 | 40 | 15 | 4 | L8, ST | Soul Bolt: L8, 15 dmg. Death Wave: Cone 5, 12 dmg + stun. Raise Army: summon 4 undead. Phylactery: hidden on board, must be found and destroyed or Lich revives at full HP in 3 turns. Immune to poison, cold, charm |

---

## Family 10: Thieves & Outlaws 🗡️
*Humans and humanoids who fight dirty. Traps, poison, ambushes.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Bandit | 1 | 3 | 3 | 3 | 2 | 9 | 3 | 4 | M1, ST | Dirty Fight: +2 dmg from stealth |
| Bandit Archer | 2 | 2 | 4 | 2 | 2 | 6 | 3 | 4 | Md5, ST | Ranged. Retreats 2 spaces after shooting |
| Bandit Captain | 4 | 5 | 4 | 4 | 3 | 12 | 5 | 4 | M1, ST | Rally: adjacent bandits +2 attack. Parry: +3 defense 1/round |
| Thug | 3 | 5 | 2 | 5 | 1 | 15 | 5 | 3 | M1, ST | Intimidate: Aura 1, enemies −1 attack. Grapple: M1, SPD check (10) or target can't move |
| Assassin | 7 | 5 | 7 | 4 | 5 | 12 | 8 | 6 | M1, ST | Stealth: invisible until attacks. Ambush: +8 dmg from stealth. Poison Blade: +4 poison dmg for 2 turns. Escape: after attack, can move 3 spaces without triggering opportunity attacks |
| Pirate | 5 | 5 | 5 | 4 | 3 | 12 | 5 | 4 | M1/S3 | Cutlass: M1, 5 dmg. Pistol: S3, ST, 5 dmg (1 use, then reload 1 turn). Dirty Tricks: throw sand, blind 1 turn |
| Poison Master | 6 | 3 | 5 | 4 | 6 | 12 | 4 | 4 | S4, ST | Poison Dart: S4, 4 dmg + poison 3/turn for 3 turns. Poison Cloud: S4, Rad 1, 3 poison dmg/turn for 2 turns. Immune to poison |
| Trap Master | 6 | 3 | 5 | 4 | 6 | 12 | 4 | 4 | M1, ST | Place Trap: any adjacent space, hidden. Trap deals 8 dmg + effect (net=rooted, spike=bleed, bomb=Rad 1 6 dmg). Max 3 traps active |
| Crime Boss | 9 | 6 | 6 | 6 | 7 | 18 | 8 | 4 | M1/S4 | Pistol: S4, 8 dmg. Order: all outlaws take free move (3 spaces). Bodyguard: redirects 1 attack/turn to adjacent minion |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **The Shadow Blade** | 8 | 6 | 8 | 5 | 6 | 25 | 9 | 6 | M1, ST | Shadow Step: teleport to any shadow within 5 spaces. Triple Strike: 3 attacks, −2 each. Vanish: becomes invisible for 2 turns. Summons 2 Assassins at half HP. Poison on all attacks |
| **The Pirate King** | 10 | 8 | 7 | 7 | 5 | 40 | 10 | 5 | M1/Md5 | Cannon Barrage: Md5, Rad 2, 12 dmg. Cutlass Flurry: M1, 2 attacks at 10 dmg. Rally the Crew: summons 3 Pirates. "The ship is mine!": once per fight, all allies get free attack |

---

## Family 11: Trolls & Giants 🏔️
*Big, dumb, and devastating. They control space and hit like trucks.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Troll | 6 | 7 | 4 | 7 | 2 | 21 | 7 | 4 | R2, ST | Reach 2. Regenerate 3 HP/turn (stopped by fire). Claws: 2 attacks/turn |
| Cave Troll | 8 | 9 | 3 | 8 | 1 | 24 | 9 | 3 | R2, ST | Reach 2. Regenerate 4 HP/turn. Rock Throw: Md5, 7 dmg. Sunlight Weakness: −2 all stats in bright light |
| Ice Troll | 9 | 8 | 4 | 8 | 3 | 24 | 9 | 4 | R2/S3 | Reach 2. Regenerate 4 HP/turn (stopped by fire). Ice Breath: Cone 2, 7 ice dmg + slow. Immune to ice |
| Ogre Mage | 8 | 7 | 4 | 6 | 6 | 18 | 8 | 3 | M1/Md5 | Fireball: Md5, Rad 2, 8 dmg. Invisibility. Surprisingly smart. Flies (MOV 5 flying) |
| Stone Giant | 12 | 12 | 3 | 11 | 4 | 33 | 13 | 3 | R2/L7 | Reach 2. Rock Throw: L7, 10 dmg. Stomp: Rad 2, 8 dmg + prone. Occupies 2×2 spaces |
| Frost Giant | 14 | 13 | 4 | 12 | 5 | 36 | 15 | 3 | R2/Md6 | Reach 2. Ice Axe: 15 ice dmg. Blizzard: Rad 3, 10 ice dmg + slow. Rock Throw: Md6, 12 dmg. Immune to ice. Occupies 2×2 spaces |
| Fire Giant | 14 | 14 | 3 | 12 | 4 | 36 | 16 | 3 | R2/Md6 | Reach 2. Flame Sword: 16 fire dmg. Hurl Boulder: Md6, 12 dmg. Lava Armor: attackers in melee take 4 fire dmg. Immune to fire. Occupies 2×2 spaces |
| Storm Giant | 18 | 14 | 6 | 14 | 10 | 42 | 18 | 4 | R2/L8 | Reach 2. Lightning Sword: 18 lightning dmg. Thunderbolt: L8, 15 dmg. Storm Aura: Aura 3, enemies −2 attack. Flying (MOV 6). Immune to lightning. Occupies 2×2 spaces |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **Troll King** | 10 | 10 | 4 | 9 | 3 | 45 | 10 | 3 | R2, ST | Reach 2. Regenerate 5 HP/turn (fire stops it). Hurl: grab creature, throw Md5, 10 dmg to both. Roar: Aura 3, enemies flee 3 spaces. Summons 2 Trolls at half HP |
| **The Mountain Titan** | 20 | 15 | 5 | 15 | 8 | 75 | 22 | 4 | R2/X10 | Occupies 3×3 spaces. Reach 2. Boulder Barrage: X10, Rad 2, 18 dmg. Earthquake: Rad 5, 15 dmg + prone (half board!). Grabs: M1, picks up creature, 10 dmg/turn until freed (STR check 18). 3 legendary actions/round |

---

## Family 12: Aberrations 🌀
*Weird, alien, unpredictable. Slimes, mimics, mind flayers, and eldritch horrors.*

### Standard Creatures

| Monster | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| Slime | 1 | 1 | 1 | 4 | 1 | 12 | 1 | 2 | M1, ST | Split: when hit for 6+ dmg, splits into 2 mini-slimes (3 HP, 1 dmg each). Immune to physical crits |
| Mimic (Chest) | 3 | 5 | 2 | 5 | 3 | 15 | 5 | 2 | M1, ST | Surprise: looks like treasure chest. First attack is auto-crit. Sticky: M1 attacker must SPD check (10) or weapon stuck 1 turn |
| Gelatinous Cube | 5 | 4 | 1 | 7 | 0 | 21 | 3 | 2 | M1, ST | Engulf: moves into creature's space, SPD check (12) or engulfed (6 acid dmg/turn, can't act, STR check 12 to escape). Transparent: SPD check (14) to spot before it moves. Occupies 2×2 spaces |
| Eye Stalker | 6 | 3 | 3 | 5 | 7 | 15 | 5 | 3 | Md6, ST | Eye Rays: 2 rays/turn, Md6 each, random effect per ray — 1: 5 dmg, 2: slow, 3: fear, 4: push 3 spaces. Anti-Magic Eye: Cone 4 in front, no spells work inside. Flying (MOV 4) |
| Mind Flayer | 8 | 5 | 5 | 5 | 10 | 15 | 6 | 3 | M1/Md5 | Mind Blast: Cone 3, SMT check (14) or stunned 2 turns. Tentacles: M1, 6 dmg. Dominate: Md5, ST, target fights for mind flayer 2 turns (SMT check 16 resists). Teleport 4 spaces |
| Carrion Crawler | 5 | 6 | 4 | 5 | 1 | 15 | 5 | 4 | R2, ST | Reach 2 (tentacles). Paralyze: on hit, TGH check (12) or can't move 2 turns. 8 tentacle attacks but only 2 per turn. Wall Climb |
| Phase Spider | 7 | 5 | 6 | 4 | 4 | 12 | 6 | 5 | M1, ST | Phase Shift: teleport 5 spaces as free action after attacking. Poison Bite: M1, 6 dmg + poison 4/turn for 2 turns. Can't be targeted by opportunity attacks |
| Rust Monster | 4 | 3 | 5 | 3 | 2 | 9 | 2 | 5 | M1, ST | Corrode: on hit, target's weapon/armor loses 1 point of bonus (permanent until repaired!). Scary for equipment, harmless otherwise |
| Beholder | 14 | 5 | 4 | 8 | 13 | 24 | 12 | 3 | Md6, ST | Eye Rays: 3 rays/turn, Md6, random effects — 1: 12 dmg, 2: petrify 1 turn, 3: disintegrate (15 dmg), 4: telekinesis (move target 4 spaces), 5: fear, 6: sleep. Anti-Magic Cone: Cone 5, no magic works inside. Flying (MOV 4) |
| Eldritch Horror | 18 | 12 | 5 | 13 | 14 | 39 | 18 | 3 | M1/L8 | Tentacle Storm: Rad 3, R2, 12 dmg to all. Madness: L8, ST, SMT check (18) or target attacks random creature for 2 turns. Immune to charm, fear, stun. Regenerate 5/turn |

### Bosses

| Boss | Lvl | STR | SPD | TGH | SMT | HP | Dmg | MOV | Range | Special |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-------|---------|
| **The Mimic King** | 8 | 7 | 4 | 7 | 5 | 35 | 8 | 3 | M1/S3 | Shape Shift: looks like any object or NPC. Surprise auto-crit. Sticky Grab: M1, target grappled (STR 14 to escape). Spawn Mimics: summons 2 Mimic Chests. Devour: grappled target takes 8 dmg/turn |
| **The Elder Brain** | 16 | 6 | 3 | 10 | 15 | 50 | 16 | 2 | X10, ST | Psychic Blast: X10, Rad 3, 16 psychic dmg + stun. Mass Domination: all enemies SMT check (18) or dominated 1 turn. Mind Shield: Aura 5, all minions +3 defense. Summons 2 Mind Flayers. Immune to charm, fear, stun, psychic. Occupies 3×3 spaces |
| **The World Eater** | 20 | 15 | 6 | 15 | 15 | 80 | 25 | 4 | R2/X10 | Tentacles: R2, 4 attacks/turn, 15 dmg each. Void Scream: X10, Rad 4, 20 dmg + random status. Reality Warp: teleport any 3 creatures to random spaces. Devour Reality: Rad 2, instant KO if TGH check (20) fails. Immune to everything except holy dmg. 3 legendary actions/round |

---

## Monster Quick-Build Guide

For creating custom monsters on the fly:

| Level | Avg Stat | HP (Std) | HP (Boss) | Dmg | MOV | Suggested Range |
|-------|----------|----------|-----------|-----|-----|----------------|
| 1 | 3 | 6–9 | 16–20 | 2–3 | 3–5 | M1 or S3 |
| 3 | 4 | 9–12 | 20–25 | 4–5 | 3–5 | M1–S4 |
| 5 | 5 | 12–18 | 25–35 | 5–7 | 3–5 | M1–Md6 |
| 7 | 6 | 15–21 | 30–40 | 7–9 | 3–5 | M1–Md6 |
| 10 | 7 | 21–30 | 40–50 | 10–12 | 2–5 | M1–L7 |
| 12 | 8 | 24–33 | 45–55 | 12–14 | 2–5 | M1–L8 |
| 14 | 9 | 27–36 | 50–60 | 14–16 | 3–5 | M1–L8 |
| 16 | 10 | 30–39 | 55–65 | 16–18 | 3–5 | M1–X10 |
| 18 | 11 | 33–42 | 60–70 | 18–20 | 3–5 | M1–X10 |
| 20 | 12 | 36–45 | 70–80 | 20–25 | 3–5 | M1–X10 |

### MOV Guidelines by Monster Archetype

| Archetype | MOV | Examples |
|-----------|-----|---------|
| Immobile/Slow tank | 1–2 | Siege Golem, Gelatinous Cube, Slime |
| Heavy melee | 3 | Golems, Knights, Giants, Wizards |
| Standard melee | 4 | Most humanoids, soldiers, brutes |
| Fast melee | 5–6 | Wolves, Rogues, Berserkers, Riders |
| Flyer (ground) | 3–4 | Dragons/flyers when grounded |
| Flyer (air) | 5–8 | Flying MOV is listed separately |
| Phaser/Teleporter | 3 + teleport X | Mind Flayers, Phase Spiders |

---

## Encounter Design Reference

### Encounter Budget by Party Level

| Party Level | Easy Fight | Medium Fight | Hard Fight | Boss Fight |
|-------------|-----------|-------------|-----------|-----------|
| 1 | 2–3 Lvl 1 | 4 Lvl 1 | 5 Lvl 1 + Lvl 2 | 1 Boss + 2 minions |
| 3 | 3 Lvl 3 | 4–5 Lvl 3 | 3 Lvl 3 + 1 Lvl 5 | 1 Boss + 3 minions |
| 5 | 3 Lvl 5 | 4 Lvl 5 | 3 Lvl 5 + 1 Lvl 7 | 1 Boss + 4 minions |
| 8 | 3 Lvl 7–8 | 4 Lvl 8 | 3 Lvl 8 + 1 Lvl 10 | 1 Boss + 3–4 elites |
| 10 | 3 Lvl 10 | 4 Lvl 10 | 3 Lvl 10 + 1 Lvl 12 | 1 Boss + 4 elites |
| 15 | 3 Lvl 14–15 | 4 Lvl 15 | 3 Lvl 15 + 1 Lvl 16 | 1 Boss + 2 Lvl 14 |
| 20 | 3 Lvl 18 | 4 Lvl 18 | 3 Lvl 18 + 1 Lvl 20 | 1 Boss + 2 Lvl 16+ |

*For a party of 2 heroes, reduce monster count by 1 from each column.*

### Grid Placement Tips

- **Ranged enemies:** Place in rows 8–10 with melee blockers in rows 6–7
- **Ambush encounters:** Enemies appear from sides (columns 1 and 10)
- **Boss fights:** Boss in center of back row, minions spread across rows 6–8
- **Swarm encounters:** Enemies in tight cluster, reward AoE
- **Chase encounters:** Enemies start at row 5, heroes at row 1, objective at row 10
