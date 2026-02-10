// ============================================================
// Phase 4: Loot Store (Zustand)
//
// Manages the full post-combat loot flow:
//   Combat ends → preload engine → roll loot → split → confirm → persist
// ============================================================

import { create } from 'zustand';
import type {
  Material,
  LootTableRow,
  EnemyLootRoll,
  ResolvedDrop,
  LootAssignment,
  DefeatedEnemy,
} from '@/types/game';

// ============================================================
// Types
// ============================================================

export type LootPhase =
  | 'idle'        // No loot flow active
  | 'loading'     // Preloading materials + loot tables
  | 'rolling'     // Dice rolling animation phase
  | 'splitting'   // Player choosing how to split
  | 'confirming'  // Final review before save
  | 'saving'      // Writing to Supabase
  | 'complete'    // Done — show confetti
  | 'error';      // Something went wrong

export type SplitMode = 'auto' | 'manual' | 'give-all';

export interface XpAward {
  characterId: string;
  heroName: string;
  xpBefore: number;
  xpEarned: number;
  xpNeeded: number;    // XP threshold for next level
  leveledUp: boolean;
  newLevel?: number;
}

interface LootState {
  // Flow state
  phase: LootPhase;
  error: string | null;

  // Encounter context
  encounterName: string;
  turnsTaken: number;
  defeatedEnemies: DefeatedEnemy[];

  // Engine cache (preloaded at combat start)
  materials: Material[];
  lootTables: LootTableRow[];

  // XP (calculated from defeated enemies)
  xpAwards: XpAward[];

  // Loot rolls (one per enemy)
  enemyRolls: (EnemyLootRoll & { gold: number })[];
  revealedRolls: Set<number>;  // indices that have been "revealed" in UI
  totalDrops: ResolvedDrop[];
  totalGold: number;

  // Splitting
  splitMode: SplitMode;
  assignments: LootAssignment[];
  giveAllTargetId: string | null;

  // Manual grants (GM extras)
  manualGrants: {
    characterId: string;
    materials: { materialId: string; materialName: string; quantity: number }[];
    gold: number;
  }[];

  // Actions
  setPhase: (phase: LootPhase) => void;
  preloadCache: (materials: Material[], lootTables: LootTableRow[]) => void;

  startLootFlow: (params: {
    encounterName: string;
    turnsTaken: number;
    defeatedEnemies: DefeatedEnemy[];
    heroCharacterIds: string[];
  }) => void;

  setXpAwards: (awards: XpAward[]) => void;
  setEnemyRolls: (rolls: (EnemyLootRoll & { gold: number })[], totalDrops: ResolvedDrop[], totalGold: number) => void;
  revealRoll: (index: number) => void;
  revealAllRolls: () => void;

  setSplitMode: (mode: SplitMode) => void;
  setGiveAllTarget: (characterId: string) => void;
  setAssignments: (assignments: LootAssignment[]) => void;
  updateAssignment: (characterId: string, materials: ResolvedDrop[], gold: number) => void;

  addManualGrant: (characterId: string, materialId: string, materialName: string, quantity: number) => void;
  addManualGold: (characterId: string, amount: number) => void;
  removeManualGrant: (characterId: string, materialId: string) => void;

  confirmAndSave: () => void;
  setComplete: () => void;
  setError: (error: string) => void;
  reset: () => void;
}

// ============================================================
// Store
// ============================================================

const initialState = {
  phase: 'idle' as LootPhase,
  error: null as string | null,
  encounterName: '',
  turnsTaken: 0,
  defeatedEnemies: [] as DefeatedEnemy[],
  materials: [] as Material[],
  lootTables: [] as LootTableRow[],
  xpAwards: [] as XpAward[],
  enemyRolls: [] as (EnemyLootRoll & { gold: number })[],
  revealedRolls: new Set<number>(),
  totalDrops: [] as ResolvedDrop[],
  totalGold: 0,
  splitMode: 'auto' as SplitMode,
  assignments: [] as LootAssignment[],
  giveAllTargetId: null as string | null,
  manualGrants: [] as LootState['manualGrants'],
};

export const useLootStore = create<LootState>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  preloadCache: (materials, lootTables) =>
    set({ materials, lootTables }),

  startLootFlow: ({ encounterName, turnsTaken, defeatedEnemies }) =>
    set({
      phase: 'rolling',
      encounterName,
      turnsTaken,
      defeatedEnemies,
      error: null,
      revealedRolls: new Set(),
      enemyRolls: [],
      totalDrops: [],
      totalGold: 0,
      assignments: [],
      manualGrants: [],
    }),

  setXpAwards: (awards) => set({ xpAwards: awards }),

  setEnemyRolls: (rolls, totalDrops, totalGold) =>
    set({ enemyRolls: rolls, totalDrops, totalGold }),

  revealRoll: (index) =>
    set((state) => {
      const next = new Set(state.revealedRolls);
      next.add(index);
      // Auto-advance to splitting when all revealed
      const allRevealed = next.size === state.enemyRolls.length;
      return {
        revealedRolls: next,
        phase: allRevealed ? 'splitting' : state.phase,
      };
    }),

  revealAllRolls: () =>
    set((state) => {
      const all = new Set<number>();
      state.enemyRolls.forEach((_, i) => all.add(i));
      return { revealedRolls: all, phase: 'splitting' };
    }),

  setSplitMode: (mode) => set({ splitMode: mode }),

  setGiveAllTarget: (characterId) => set({ giveAllTargetId: characterId }),

  setAssignments: (assignments) => set({ assignments }),

  updateAssignment: (characterId, materials, gold) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.characterId === characterId ? { ...a, materials, gold } : a
      ),
    })),

  addManualGrant: (characterId, materialId, materialName, quantity) =>
    set((state) => {
      const grants = state.manualGrants.map((g) => ({ ...g, materials: [...g.materials] }));
      let charGrant = grants.find((g) => g.characterId === characterId);
      if (!charGrant) {
        charGrant = { characterId, materials: [], gold: 0 };
        grants.push(charGrant);
      }
      const existing = charGrant.materials.find((m) => m.materialId === materialId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        charGrant.materials.push({ materialId, materialName, quantity });
      }
      return { manualGrants: grants };
    }),

  addManualGold: (characterId, amount) =>
    set((state) => {
      const grants = state.manualGrants.map((g) => ({ ...g }));
      let charGrant = grants.find((g) => g.characterId === characterId);
      if (!charGrant) {
        charGrant = { characterId, materials: [], gold: 0 };
        grants.push(charGrant);
      }
      charGrant.gold += amount;
      return { manualGrants: grants };
    }),

  removeManualGrant: (characterId, materialId) =>
    set((state) => ({
      manualGrants: state.manualGrants.map((g) =>
        g.characterId === characterId
          ? { ...g, materials: g.materials.filter((m) => m.materialId !== materialId) }
          : g
      ),
    })),

  confirmAndSave: () => set({ phase: 'saving' }),
  setComplete: () => set({ phase: 'complete' }),
  setError: (error) => set({ phase: 'error', error }),
  reset: () => set({ ...initialState, revealedRolls: new Set() }),
}));
