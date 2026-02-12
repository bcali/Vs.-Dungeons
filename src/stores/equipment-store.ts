// Zustand store for equipment system
// Manages equipped items (8 slots) and stash (loot chest)

import { create } from 'zustand';
import type {
  Stats,
  EquipmentSlot,
  CharacterEquipmentItem,
} from '@/types/game';
import { EQUIPMENT_SLOTS } from '@/types/game';
import { calculateGearBonus } from '@/lib/game/equipment';
import {
  fetchCharacterEquipment,
  equipItem as equipItemQuery,
  unequipItem as unequipItemQuery,
  craftEquipment as craftEquipmentQuery,
  salvageEquipment as salvageEquipmentQuery,
  updateCharacter,
} from '@/lib/supabase/queries';
import type { EquipmentTemplate } from '@/types/game';

// ─── Types ───────────────────────────────────────────────────────────

interface EquipmentState {
  // All items owned by the character
  items: CharacterEquipmentItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEquipment: (characterId: string) => Promise<void>;
  equipItem: (characterId: string, itemId: string, slot: EquipmentSlot) => Promise<boolean>;
  unequipItem: (characterId: string, slot: EquipmentSlot) => Promise<boolean>;
  craftItem: (characterId: string, template: EquipmentTemplate, level: number) => Promise<boolean>;
  salvageItem: (characterId: string, itemId: string) => Promise<boolean>;

  // Derived getters
  getEquippedItems: () => CharacterEquipmentItem[];
  getStashItems: () => CharacterEquipmentItem[];
  getItemInSlot: (slot: EquipmentSlot) => CharacterEquipmentItem | undefined;
  getGearBonus: () => Stats;

  reset: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadEquipment: async (characterId) => {
    set({ isLoading: true, error: null });
    const items = await fetchCharacterEquipment(characterId);
    set({ items, isLoading: false });
  },

  equipItem: async (characterId, itemId, slot) => {
    const success = await equipItemQuery(characterId, itemId, slot);
    if (!success) {
      set({ error: 'Failed to equip item' });
      return false;
    }

    // Optimistic update: move item to equipped slot, unequip any existing
    set(state => {
      const updated = state.items.map(item => {
        // Unequip existing item in this slot
        if (item.equippedSlot === slot && item.id !== itemId) {
          return { ...item, equippedSlot: null };
        }
        // Equip the target item
        if (item.id === itemId) {
          return { ...item, equippedSlot: slot };
        }
        return item;
      });
      return { items: updated };
    });

    // Sync gear bonus to character
    const gearBonus = get().getGearBonus();
    await updateCharacter(characterId, { gearBonus });

    return true;
  },

  unequipItem: async (characterId, slot) => {
    const success = await unequipItemQuery(characterId, slot);
    if (!success) {
      set({ error: 'Failed to unequip item' });
      return false;
    }

    // Optimistic update
    set(state => ({
      items: state.items.map(item =>
        item.equippedSlot === slot ? { ...item, equippedSlot: null } : item
      ),
    }));

    // Sync gear bonus
    const gearBonus = get().getGearBonus();
    await updateCharacter(characterId, { gearBonus });

    return true;
  },

  craftItem: async (characterId, template, level) => {
    const itemId = await craftEquipmentQuery(
      characterId,
      template.id,
      template.nameTemplate,
      template.slot,
      template.rarity,
      level,
      template.statAllocations,
      template.specialEffect,
    );

    if (!itemId) {
      set({ error: 'Failed to craft item' });
      return false;
    }

    // Add new item to local state
    const newItem: CharacterEquipmentItem = {
      id: itemId,
      characterId,
      templateId: template.id,
      name: template.nameTemplate,
      slot: template.slot,
      rarity: template.rarity,
      level,
      statBonuses: template.statAllocations,
      specialEffect: template.specialEffect,
      equippedSlot: null,
      createdAt: new Date().toISOString(),
    };

    set(state => ({ items: [newItem, ...state.items] }));
    return true;
  },

  salvageItem: async (characterId, itemId) => {
    const success = await salvageEquipmentQuery(characterId, itemId);
    if (!success) {
      set({ error: 'Failed to salvage item' });
      return false;
    }

    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
    }));

    // Sync gear bonus in case item was equipped
    const gearBonus = get().getGearBonus();
    await updateCharacter(characterId, { gearBonus });

    return true;
  },

  getEquippedItems: () => {
    return get().items.filter(item => item.equippedSlot !== null);
  },

  getStashItems: () => {
    return get().items.filter(item => item.equippedSlot === null);
  },

  getItemInSlot: (slot) => {
    return get().items.find(item => item.equippedSlot === slot);
  },

  getGearBonus: () => {
    return calculateGearBonus(get().getEquippedItems());
  },

  reset: () => set({ items: [], isLoading: false, error: null }),
}));
