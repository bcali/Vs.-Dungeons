// Zustand store for active combat state

import { create } from 'zustand';
import type { CombatParticipant, ActiveStatusEffect, ActionLogEntry, CombatStatus } from '@/types/combat';
import { tickEffects, applyEffect, removeEffect as removeEffectFromList } from '@/lib/game/status-effects';
import { applyDamage, applyHealing as healHp, isKnockedOut } from '@/lib/game/combat';
import { applyRegen } from '@/lib/game/resources';

interface CombatState {
  combatId: string | null;
  encounterName: string;
  status: CombatStatus;
  roundNumber: number;
  participants: CombatParticipant[];
  initiativeOrder: string[];
  currentTurnIndex: number;
  actionLog: ActionLogEntry[];

  // Actions
  initCombat: (encounterName: string, participants: CombatParticipant[], initiativeOrder: string[]) => void;
  advanceTurn: () => void;
  applyDamage: (targetId: string, amount: number) => void;
  applyHealing: (targetId: string, amount: number) => void;
  applyStatusEffect: (targetId: string, effect: ActiveStatusEffect) => void;
  removeEffect: (targetId: string, effectId: string) => void;
  tickParticipantEffects: (participantId: string) => void;
  regenResource: (participantId: string) => void;
  setResource: (participantId: string, amount: number) => void;
  setDefending: (participantId: string, defending: boolean) => void;
  addLogEntry: (entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) => void;
  getParticipant: (id: string) => CombatParticipant | undefined;
  endCombat: () => void;
  resetCombat: () => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  combatId: null,
  encounterName: '',
  status: 'setup',
  roundNumber: 1,
  participants: [],
  initiativeOrder: [],
  currentTurnIndex: 0,
  actionLog: [],

  initCombat: (encounterName, participants, initiativeOrder) => {
    set({
      combatId: crypto.randomUUID(),
      encounterName,
      status: 'active',
      roundNumber: 1,
      participants,
      initiativeOrder,
      currentTurnIndex: 0,
      actionLog: [],
    });
  },

  advanceTurn: () => {
    const { currentTurnIndex, initiativeOrder, roundNumber } = get();
    const nextIndex = currentTurnIndex + 1;

    if (nextIndex >= initiativeOrder.length) {
      set({ currentTurnIndex: 0, roundNumber: roundNumber + 1 });
    } else {
      set({ currentTurnIndex: nextIndex });
    }
  },

  applyDamage: (targetId, amount) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== targetId) return p;
        const newHp = applyDamage(p.currentHp, amount);
        return { ...p, currentHp: newHp, isActive: !isKnockedOut(newHp) };
      }),
    }));
  },

  applyHealing: (targetId, amount) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== targetId) return p;
        const newHp = healHp(p.currentHp, amount, p.maxHp);
        return { ...p, currentHp: newHp, isActive: newHp > 0 };
      }),
    }));
  },

  applyStatusEffect: (targetId, effect) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== targetId) return p;
        return { ...p, statusEffects: applyEffect(p.statusEffects, effect) };
      }),
    }));
  },

  removeEffect: (targetId, effectId) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== targetId) return p;
        return { ...p, statusEffects: removeEffectFromList(p.statusEffects, effectId) };
      }),
    }));
  },

  tickParticipantEffects: (participantId) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== participantId) return p;
        const result = tickEffects(p.statusEffects);
        let hp = p.currentHp;
        if (result.dotDamage > 0) hp = applyDamage(hp, result.dotDamage);
        if (result.hotHealing > 0) hp = healHp(hp, result.hotHealing, p.maxHp);
        return {
          ...p,
          currentHp: hp,
          isActive: !isKnockedOut(hp),
          statusEffects: result.updated,
        };
      }),
    }));
  },

  regenResource: (participantId) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== participantId || !p.resourceType || !p.maxResource) return p;
        return {
          ...p,
          currentResource: applyRegen(p.currentResource, p.maxResource, p.resourceType),
        };
      }),
    }));
  },

  setResource: (participantId, amount) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== participantId) return p;
        return { ...p, currentResource: Math.max(0, Math.min(amount, p.maxResource ?? 100)) };
      }),
    }));
  },

  setDefending: (participantId, defending) => {
    set(state => ({
      participants: state.participants.map(p => {
        if (p.id !== participantId) return p;
        return { ...p, isDefending: defending };
      }),
    }));
  },

  addLogEntry: (entry) => {
    const newEntry: ActionLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set(state => ({ actionLog: [newEntry, ...state.actionLog] }));
  },

  getParticipant: (id) => {
    return get().participants.find(p => p.id === id);
  },

  endCombat: () => {
    set({ status: 'completed' });
  },

  resetCombat: () => {
    set({
      combatId: null,
      encounterName: '',
      status: 'setup',
      roundNumber: 1,
      participants: [],
      initiativeOrder: [],
      currentTurnIndex: 0,
      actionLog: [],
    });
  },
}));
