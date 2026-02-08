// Zustand store for character editing

import { create } from 'zustand';
import type { Character, Stats, StatKey } from '@/types/game';

interface CharacterState {
  characters: Character[];
  activeCharacterId: string | null;
  isLoading: boolean;

  // Actions
  setCharacters: (characters: Character[]) => void;
  setActiveCharacter: (id: string | null) => void;
  updateCharacterStat: (characterId: string, stat: StatKey, value: number) => void;
  updateCharacterField: (characterId: string, field: keyof Character, value: unknown) => void;
  addCharacter: (character: Character) => void;
  getActiveCharacter: () => Character | undefined;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  activeCharacterId: null,
  isLoading: false,

  setCharacters: (characters) => set({ characters }),

  setActiveCharacter: (id) => set({ activeCharacterId: id }),

  updateCharacterStat: (characterId, stat, value) => {
    set(state => ({
      characters: state.characters.map(c => {
        if (c.id !== characterId) return c;
        return { ...c, stats: { ...c.stats, [stat]: value } };
      }),
    }));
  },

  updateCharacterField: (characterId, field, value) => {
    set(state => ({
      characters: state.characters.map(c => {
        if (c.id !== characterId) return c;
        return { ...c, [field]: value };
      }),
    }));
  },

  addCharacter: (character) => {
    set(state => ({ characters: [...state.characters, character] }));
  },

  getActiveCharacter: () => {
    const { characters, activeCharacterId } = get();
    return characters.find(c => c.id === activeCharacterId);
  },
}));
