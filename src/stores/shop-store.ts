// Zustand store for the quest shop — no persistence needed

import { create } from 'zustand';
import type { Character, ShopItem } from '@/types/game';
import { fetchCampaign, fetchCharacters, fetchShopItems, purchaseShopItem } from '@/lib/supabase/queries';

interface ShopState {
  shopItems: ShopItem[];
  heroes: Character[];
  questName: string;
  isLoading: boolean;

  selectedItem: ShopItem | null;
  selectedHeroId: string | null;
  isPurchasing: boolean;

  loadShop: () => Promise<void>;
  selectItem: (item: ShopItem | null) => void;
  selectHero: (heroId: string | null) => void;
  purchase: () => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
}

export const useShopStore = create<ShopState>()((set, get) => ({
  shopItems: [],
  heroes: [],
  questName: '',
  isLoading: true,

  selectedItem: null,
  selectedHeroId: null,
  isPurchasing: false,

  loadShop: async () => {
    set({ isLoading: true });
    const campaign = await fetchCampaign();
    if (!campaign) { set({ isLoading: false }); return; }

    const questName = campaign.currentQuest || '';
    const [heroes, shopItems] = await Promise.all([
      fetchCharacters(campaign.id),
      questName ? fetchShopItems(questName) : Promise.resolve([]),
    ]);

    set({ heroes, shopItems, questName, isLoading: false });
  },

  selectItem: (item) => set({ selectedItem: item }),

  selectHero: (heroId) => set({ selectedHeroId: heroId }),

  purchase: async () => {
    const { selectedItem, selectedHeroId, heroes, shopItems } = get();
    if (!selectedItem || !selectedHeroId) return { success: false, error: 'No item or hero selected' };

    set({ isPurchasing: true });
    const result = await purchaseShopItem(selectedHeroId, selectedItem.id);

    if (result.success) {
      // Optimistic update: deduct hero gold + decrement stock
      set({
        heroes: heroes.map(h =>
          h.id === selectedHeroId ? { ...h, gold: h.gold - selectedItem.price } : h
        ),
        shopItems: shopItems.map(si =>
          si.id === selectedItem.id && si.stock > 0
            ? { ...si, stock: si.stock - 1 }
            : si
        ),
        selectedItem: null,
        selectedHeroId: null,
        isPurchasing: false,
      });
    } else {
      set({ isPurchasing: false });
    }

    return result;
  },

  reset: () => set({
    shopItems: [],
    heroes: [],
    questName: '',
    isLoading: true,
    selectedItem: null,
    selectedHeroId: null,
    isPurchasing: false,
  }),
}));
