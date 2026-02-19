// Zustand store for active combat state
// Includes localStorage persistence for crash recovery and auto-save to Supabase

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CombatParticipant, ActiveStatusEffect, ActionLogEntry, CombatStatus } from '@/types/combat';
import { tickEffects, applyEffect, removeEffect as removeEffectFromList } from '@/lib/game/status-effects';
import { applyDamage, applyHealing as healHp, isKnockedOut } from '@/lib/game/combat';
import { useSpellSlots, restoreAllSlots } from '@/lib/game/spell-slots';
import { saveQueue } from '@/lib/utils/save-queue';
import { getSupabase } from '@/lib/supabase/client';

interface PreCombatHero {
  characterId: string;
  currentHp: number;
  spellSlotsUsed: number;
}

interface PreCombatSetup {
  encounterName: string;
  participants: CombatParticipant[];
  initiativeOrder: string[];
}

interface CombatState {
  combatId: string | null;
  encounterName: string;
  status: CombatStatus;
  roundNumber: number;
  participants: CombatParticipant[];
  initiativeOrder: string[];
  currentTurnIndex: number;
  actionLog: ActionLogEntry[];
  preCombatSnapshot: PreCombatHero[];
  preCombatSetup: PreCombatSetup | null;

  // Actions
  initCombat: (encounterName: string, participants: CombatParticipant[], initiativeOrder: string[]) => void;
  setPreCombatSetup: (setup: PreCombatSetup) => void;
  startCombatFromShop: () => void;
  advanceTurn: () => void;
  applyDamage: (targetId: string, amount: number) => void;
  applyHealing: (targetId: string, amount: number) => void;
  applyStatusEffect: (targetId: string, effect: ActiveStatusEffect) => void;
  removeEffect: (targetId: string, effectId: string) => void;
  tickParticipantEffects: (participantId: string) => void;
  useSpellSlot: (participantId: string, cost: number) => void;
  restoreSpellSlots: (participantId: string) => void;
  setDefending: (participantId: string, defending: boolean) => void;
  markAbilityUsed: (participantId: string, abilityName: string) => void;
  useHeroSurge: (participantId: string) => void;
  useItem: (participantId: string, itemName: string) => void;
  resetItemUsedFlag: (participantId: string) => void;
  restoreSpellSlotsPartial: (participantId: string, amount: number) => void;
  addLogEntry: (entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) => void;
  getParticipant: (id: string) => CombatParticipant | undefined;
  abandonCombat: () => void;
  endCombat: () => void;
  enterRewardsPhase: () => void;
  resetCombat: () => void;
  persistCombatSnapshot: () => void;
  checkForActiveCombat: () => Promise<boolean>;
  resumeCombat: () => boolean;
}

export const useCombatStore = create<CombatState>()(
  persist(
    (set, get) => ({
      combatId: null,
      encounterName: '',
      status: 'setup',
      roundNumber: 1,
      participants: [],
      initiativeOrder: [],
      currentTurnIndex: 0,
      actionLog: [],
      preCombatSnapshot: [],
      preCombatSetup: null,

      setPreCombatSetup: (setup) => {
        set({ preCombatSetup: setup });
      },

      startCombatFromShop: () => {
        const { preCombatSetup, initCombat } = get();
        if (!preCombatSetup) return;
        initCombat(preCombatSetup.encounterName, preCombatSetup.participants, preCombatSetup.initiativeOrder);
        set({ preCombatSetup: null });
      },

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
          preCombatSnapshot: participants
            .filter(p => p.team === 'hero' && p.characterId)
            .map(p => ({ characterId: p.characterId!, currentHp: p.currentHp, spellSlotsUsed: p.spellSlotsUsed })),
        });
      },

      advanceTurn: () => {
        const { currentTurnIndex, initiativeOrder, roundNumber } = get();
        // Reset item used flag for the outgoing actor
        const outgoingId = initiativeOrder[currentTurnIndex];
        if (outgoingId) get().resetItemUsedFlag(outgoingId);

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

      useSpellSlot: (participantId, cost) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            return { ...p, spellSlotsUsed: useSpellSlots(p.spellSlotsUsed, cost) };
          }),
        }));
      },

      restoreSpellSlots: (participantId) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            return { ...p, spellSlotsUsed: restoreAllSlots() };
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

      markAbilityUsed: (participantId, abilityName) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            const used = p.usedAbilityNames ?? [];
            if (used.includes(abilityName)) return p;
            return { ...p, usedAbilityNames: [...used, abilityName] };
          }),
        }));
      },

      useHeroSurge: (participantId) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            return { ...p, heroSurgeAvailable: false };
          }),
        }));
      },

      useItem: (participantId, itemName) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId || !p.inventory) return p;
            return {
              ...p,
              inventory: p.inventory.map(i =>
                i.itemName === itemName ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
              ),
              itemUsedThisTurn: true,
            };
          }),
        }));
      },

      resetItemUsedFlag: (participantId) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            return { ...p, itemUsedThisTurn: false };
          }),
        }));
      },

      restoreSpellSlotsPartial: (participantId, amount) => {
        set(state => ({
          participants: state.participants.map(p => {
            if (p.id !== participantId) return p;
            return { ...p, spellSlotsUsed: Math.max(0, p.spellSlotsUsed - amount) };
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

      abandonCombat: () => {
        const { preCombatSnapshot, combatId } = get();

        // Restore each hero's HP/spell slots to pre-combat values
        for (const hero of preCombatSnapshot) {
          saveQueue.save(`hero-hp-${hero.characterId}`, async () => {
            const supabase = getSupabase();
            const { error } = await supabase
              .from('characters')
              .update({
                current_hp: hero.currentHp,
                spell_slots_used: hero.spellSlotsUsed,
              })
              .eq('id', hero.characterId);
            if (error) throw error;
          });
        }

        // Mark combat as abandoned in DB
        if (combatId) {
          saveQueue.save(`combat-meta-${combatId}`, async () => {
            const supabase = getSupabase();
            const { error } = await supabase
              .from('combats')
              .update({ status: 'abandoned' })
              .eq('id', combatId);
            if (error) throw error;
          });
        }

        // Reset store
        get().resetCombat();
      },

      enterRewardsPhase: () => {
        set({ status: 'rewards' });
        get().persistCombatSnapshot();
      },

      endCombat: () => {
        set({ status: 'completed' });
        // Write final hero HP/resources back to characters table
        get().persistCombatSnapshot();
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
          preCombatSnapshot: [],
          preCombatSetup: null,
        });
      },

      /** Save hero HP/spell slots to Supabase after each action */
      persistCombatSnapshot: () => {
        const { combatId, participants, status, roundNumber } = get();
        if (!combatId) return;

        const heroes = participants.filter(p => p.team === 'hero' && p.characterId);

        // Update each hero's current HP + spell slots in the characters table
        for (const hero of heroes) {
          saveQueue.save(`hero-hp-${hero.characterId}`, async () => {
            const supabase = getSupabase();
            const { error } = await supabase
              .from('characters')
              .update({
                current_hp: hero.currentHp,
                spell_slots_used: hero.spellSlotsUsed,
              })
              .eq('id', hero.characterId!);
            if (error) throw error;
          });
        }

        // Update combat record metadata
        saveQueue.save(`combat-meta-${combatId}`, async () => {
          const supabase = getSupabase();
          const { error } = await supabase
            .from('combats')
            .update({
              status,
              round_number: roundNumber,
            })
            .eq('id', combatId);
          if (error) throw error;
        });
      },

      /** Check Supabase for any active combat (e.g. after tab crash) */
      checkForActiveCombat: async () => {
        try {
          const supabase = getSupabase();
          const { data } = await supabase
            .from('combats')
            .select('id')
            .eq('status', 'active')
            .limit(1)
            .single();
          return !!data;
        } catch {
          return false;
        }
      },

      /** Try restoring combat state from localStorage (hydrated by persist middleware) */
      resumeCombat: () => {
        const { combatId, status, participants } = get();
        if (combatId && status === 'active' && participants.length > 0) {
          return true;
        }
        return false;
      },
    }),
    {
      name: 'lego-quest-combat',
      // Only persist the data fields, not functions
      partialize: (state) => ({
        combatId: state.combatId,
        encounterName: state.encounterName,
        status: state.status,
        roundNumber: state.roundNumber,
        participants: state.participants,
        initiativeOrder: state.initiativeOrder,
        currentTurnIndex: state.currentTurnIndex,
        actionLog: state.actionLog,
        preCombatSnapshot: state.preCombatSnapshot,
        preCombatSetup: state.preCombatSetup,
      }),
    }
  )
);
