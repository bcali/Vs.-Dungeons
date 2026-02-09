import { create } from 'zustand';
import type { SkillTreeSkill, SkillTreeClass, CharacterSkillAllocation, ActionBarSlot, SkillBranch } from '@/types/game';
import { TIER_REQUIREMENTS } from '@/types/game';
import {
  fetchSkillTreeSkills,
  fetchSkillAllocations,
  fetchActionBar,
  allocateSkillPoint,
  respecCharacter,
  setActionBarSlot,
  clearActionBarSlot,
} from '@/lib/supabase/queries';

interface SkillTreeState {
  skills: SkillTreeSkill[];
  allocations: CharacterSkillAllocation[];
  actionBar: ActionBarSlot[];
  characterId: string | null;
  characterLevel: number;
  isLoading: boolean;

  loadSkillTree: (characterId: string, characterLevel: number, skillClass: SkillTreeClass) => Promise<void>;
  allocatePoint: (skillId: string) => Promise<boolean>;
  respec: () => Promise<boolean>;
  equipToBar: (slotNumber: number, skillId: string | null, abilityId: string | null) => Promise<boolean>;
  removeFromBar: (slotNumber: number) => Promise<boolean>;

  getSpentPoints: () => number;
  getAvailablePoints: () => number;
  getBranchPoints: (branch: SkillBranch) => number;
  getHighestUnlockedTier: (branch: SkillBranch) => number;
  getAllocationForSkill: (skillId: string) => CharacterSkillAllocation | undefined;
  canAllocate: (skill: SkillTreeSkill) => boolean;
}

export const useSkillTreeStore = create<SkillTreeState>((set, get) => ({
  skills: [],
  allocations: [],
  actionBar: [],
  characterId: null,
  characterLevel: 1,
  isLoading: false,

  loadSkillTree: async (characterId, characterLevel, skillClass) => {
    set({ isLoading: true, characterId, characterLevel });
    const [skills, allocations, actionBar] = await Promise.all([
      fetchSkillTreeSkills(skillClass),
      fetchSkillAllocations(characterId),
      fetchActionBar(characterId),
    ]);
    set({ skills, allocations, actionBar, isLoading: false });
  },

  allocatePoint: async (skillId) => {
    const { characterId } = get();
    if (!characterId) return false;
    const newRank = await allocateSkillPoint(characterId, skillId);
    if (newRank === null) return false;
    set((state) => {
      const existing = state.allocations.find((a) => a.skillId === skillId);
      if (existing) {
        return {
          allocations: state.allocations.map((a) =>
            a.skillId === skillId ? { ...a, currentRank: newRank } : a
          ),
        };
      }
      return {
        allocations: [
          ...state.allocations,
          {
            id: crypto.randomUUID(),
            characterId: state.characterId!,
            skillId,
            currentRank: newRank,
            learnedAtLevel: state.characterLevel,
          },
        ],
      };
    });
    return true;
  },

  respec: async () => {
    const { characterId } = get();
    if (!characterId) return false;
    const ok = await respecCharacter(characterId);
    if (!ok) return false;
    set((state) => ({
      allocations: [],
      actionBar: state.actionBar.map((s) => ({ ...s, skillId: null })),
    }));
    return true;
  },

  equipToBar: async (slotNumber, skillId, abilityId) => {
    const { characterId } = get();
    if (!characterId) return false;
    const ok = await setActionBarSlot(characterId, slotNumber, skillId, abilityId);
    if (!ok) return false;
    set((state) => {
      const exists = state.actionBar.find((s) => s.slotNumber === slotNumber);
      if (exists) {
        return {
          actionBar: state.actionBar.map((s) =>
            s.slotNumber === slotNumber ? { ...s, skillId, abilityId } : s
          ),
        };
      }
      return {
        actionBar: [
          ...state.actionBar,
          {
            id: crypto.randomUUID(),
            characterId: characterId!,
            slotNumber,
            skillId,
            abilityId,
          },
        ],
      };
    });
    return true;
  },

  removeFromBar: async (slotNumber) => {
    const { characterId } = get();
    if (!characterId) return false;
    const ok = await clearActionBarSlot(characterId, slotNumber);
    if (!ok) return false;
    set((state) => ({
      actionBar: state.actionBar.map((s) =>
        s.slotNumber === slotNumber ? { ...s, skillId: null, abilityId: null } : s
      ),
    }));
    return true;
  },

  getSpentPoints: () => get().allocations.reduce((sum, a) => sum + a.currentRank, 0),

  getAvailablePoints: () => get().characterLevel - get().getSpentPoints(),

  getBranchPoints: (branch) => {
    const { skills, allocations } = get();
    const branchSkillIds = new Set(
      skills.filter((s) => s.branch === branch).map((s) => s.id)
    );
    return allocations
      .filter((a) => branchSkillIds.has(a.skillId))
      .reduce((sum, a) => sum + a.currentRank, 0);
  },

  getHighestUnlockedTier: (branch) => {
    const pts = get().getBranchPoints(branch);
    let tier = 1;
    for (const [t, req] of Object.entries(TIER_REQUIREMENTS)) {
      if (pts >= req) tier = Number(t);
    }
    return tier;
  },

  getAllocationForSkill: (skillId) =>
    get().allocations.find((a) => a.skillId === skillId),

  canAllocate: (skill) => {
    const state = get();
    if (state.getAvailablePoints() <= 0) return false;
    const alloc = state.getAllocationForSkill(skill.id);
    if (alloc && alloc.currentRank >= skill.maxRank) return false;
    if (skill.branch.endsWith('_core')) return true;
    return state.getHighestUnlockedTier(skill.branch) >= skill.tier;
  },
}));
