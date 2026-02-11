import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Hero, Enemy, Encounter, Combatant } from '../types/game';

interface GameState {
  heroes: Hero[];
  enemies: Enemy[];
  encounters: Encounter[];
  activeEncounterId: string | null;
  
  // Actions
  addHero: (hero: Hero) => void;
  deleteHero: (id: string) => void;
  updateHero: (id: string, updates: Partial<Hero>) => void;
  
  addEncounter: (encounter: Encounter) => void;
  setActiveEncounter: (id: string | null) => void;
}

const mockHeroes: Hero[] = [
  {
    id: 'h1',
    name: 'Sir Bricksalot',
    playerName: 'Brandon',
    profession: 'Knight',
    level: 3,
    stats: { CON: 5, STR: 7, AGI: 4, MNA: 3, INT: 3, LCK: 4 },
    hp: { current: 18, max: 21 },
    xp: { current: 25, max: 45 },
    resource: { type: 'rage', current: 45, max: 100 },
    gold: 150,
    movement: 4,
    abilities: [
        { id: 'a1', name: 'Heavy Swing', cost: 0, cooldown: 0, resourceType: 'rage', description: 'Basic attack generating rage.' },
        { id: 'a2', name: 'Shield Bash', cost: 15, cooldown: 2, resourceType: 'rage', description: 'Stun target for 1 turn.' },
        { id: 'a3', name: 'Cleave', cost: 30, cooldown: 0, resourceType: 'rage', description: 'Hit up to 3 adjacent enemies.' }
    ],
    availableStatPoints: 3,
    availableSkillPoints: 1
  },
  {
    id: 'h2',
    name: 'Merlin the Wise',
    profession: 'Wizard',
    level: 3,
    stats: { CON: 3, STR: 2, AGI: 4, MNA: 8, INT: 7, LCK: 3 },
    hp: { current: 12, max: 15 },
    xp: { current: 30, max: 45 },
    resource: { type: 'mana', current: 80, max: 120 },
    gold: 200,
    movement: 3,
    abilities: [
        { id: 'w1', name: 'Arcane Bolt', cost: 5, cooldown: 0, resourceType: 'mana', description: 'Small magic damage.' },
        { id: 'w2', name: 'Fireball', cost: 35, cooldown: 3, resourceType: 'mana', description: 'Massive area damage.' },
        { id: 'w3', name: 'Teleport', cost: 20, cooldown: 2, resourceType: 'mana', description: 'Move instantly to any tile.' }
    ],
    availableStatPoints: 0,
    availableSkillPoints: 2
  },
    {
    id: 'h3',
    name: 'Shadowstep',
    profession: 'Rogue',
    level: 3,
    stats: { CON: 4, STR: 3, AGI: 8, MNA: 2, INT: 4, LCK: 6 },
    hp: { current: 14, max: 18 },
    xp: { current: 40, max: 45 },
    resource: { type: 'energy', current: 100, max: 100 },
    gold: 120,
    movement: 6,
    abilities: [
        { id: 'r1', name: 'Backstab', cost: 40, cooldown: 0, resourceType: 'energy', description: 'High damage from behind.' },
        { id: 'r2', name: 'Quick Dash', cost: 20, cooldown: 1, resourceType: 'energy', description: 'Move extra tiles.' },
        { id: 'r3', name: 'Poison Dart', cost: 15, cooldown: 2, resourceType: 'energy', description: 'Apply DOT effect.' }
    ],
    availableStatPoints: 1,
    availableSkillPoints: 0
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      heroes: mockHeroes,
      enemies: [
        {
          id: "e1",
          name: "Goblin Scavenger",
          level: 1,
          hp: { current: 7, max: 7 },
          xpReward: 10,
          movement: 5,
          abilities: [
             { id: 'e1a1', name: 'Shank', cost: 0, cooldown: 0, description: 'Melee poke.' }
          ]
        },
        {
          id: "e2",
          name: "Orc Brute",
          level: 3,
          hp: { current: 22, max: 22 },
          resource: { type: "rage", current: 0, max: 20 },
          xpReward: 35,
          movement: 4,
          abilities: [
             { id: 'e2a1', name: 'Smash', cost: 10, resourceType: 'rage', cooldown: 1, description: 'Heavy hit.' }
          ]
        },
        {
          id: "e3",
          name: "Dark Sorcerer",
          level: 5,
          isBoss: true,
          hp: { current: 45, max: 45 },
          resource: { type: "mana", current: 50, max: 50 },
          xpReward: 100,
          movement: 3,
          abilities: [
             { id: 'e3a1', name: 'Void Blast', cost: 15, resourceType: 'mana', cooldown: 0, description: 'Ranged dark damage.' },
             { id: 'e3a2', name: 'Summon Minion', cost: 40, resourceType: 'mana', cooldown: 4, description: 'Summons a skeleton.' }
          ]
        },
        {
          id: "e4",
          name: "Skeleton Warrior",
          level: 2,
          hp: { current: 15, max: 15 },
          xpReward: 20,
          movement: 3,
          abilities: [
             { id: 'e4a1', name: 'Bone Rattle', cost: 0, cooldown: 0, description: 'Scary noise.' }
          ]
        }
      ],
      encounters: [],
      activeEncounterId: null,

      addHero: (hero) => set((state) => ({ heroes: [...state.heroes, hero] })),
      deleteHero: (id) => set((state) => ({ heroes: state.heroes.filter((h) => h.id !== id) })),
      updateHero: (id, updates) =>
        set((state) => ({
          heroes: state.heroes.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      addEncounter: (encounter) => set((state) => ({ encounters: [...state.encounters, encounter] })),
      setActiveEncounter: (id) => set({ activeEncounterId: id }),
    }),
    {
      name: 'vs-dungeons-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
