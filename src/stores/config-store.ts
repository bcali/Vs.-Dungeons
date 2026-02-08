// Zustand store for GM game config

import { create } from 'zustand';
import type { GameConfig } from '@/types/config';
import { DEFAULT_GAME_CONFIG } from '@/types/config';

interface ConfigState {
  config: GameConfig | null;
  isLoading: boolean;
  isDirty: boolean;

  // Actions
  setConfig: (config: GameConfig) => void;
  updateConfigField: <K extends keyof GameConfig>(field: K, value: GameConfig[K]) => void;
  resetToDefaults: () => void;
  markClean: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoading: false,
  isDirty: false,

  setConfig: (config) => set({ config, isDirty: false }),

  updateConfigField: (field, value) => {
    set(state => {
      if (!state.config) return state;
      return { config: { ...state.config, [field]: value }, isDirty: true };
    });
  },

  resetToDefaults: () => {
    set(state => {
      if (!state.config) return state;
      return {
        config: {
          ...state.config,
          ...DEFAULT_GAME_CONFIG,
        },
        isDirty: true,
      };
    });
  },

  markClean: () => set({ isDirty: false }),
}));
