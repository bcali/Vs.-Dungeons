// Zustand store for the quest shop — no persistence needed

import { create } from 'zustand';
import type { Character, ShopItem, ItemType } from '@/types/game';
import { fetchCampaign, fetchCharacters, fetchShopItems, purchaseShopItem } from '@/lib/supabase/queries';

export interface PurchaseLogEntry {
  heroName: string;
  itemName: string;
  price: number;
  timestamp: number;
}

type CategoryFilter = 'all' | ItemType;

interface ShopState {
  shopItems: ShopItem[];
  heroes: Character[];
  questName: string;
  isLoading: boolean;

  selectedItem: ShopItem | null;
  selectedHeroId: string | null;
  isPurchasing: boolean;
  categoryFilter: CategoryFilter;
  purchaseLog: PurchaseLogEntry[];

  loadShop: () => Promise<void>;
  selectItem: (item: ShopItem | null) => void;
  selectHero: (heroId: string | null) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
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
  categoryFilter: 'all',
  purchaseLog: [],

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

  setCategoryFilter: (filter) => set({ categoryFilter: filter }),

  purchase: async () => {
    const { selectedItem, selectedHeroId, heroes, shopItems, purchaseLog } = get();
    if (!selectedItem || !selectedHeroId) return { success: false, error: 'No item or hero selected' };

    const hero = heroes.find(h => h.id === selectedHeroId);
    if (!hero) return { success: false, error: 'Hero not found' };

    set({ isPurchasing: true });
    const result = await purchaseShopItem(selectedHeroId, selectedItem.id);

    if (result.success) {
      set({
        heroes: heroes.map(h =>
          h.id === selectedHeroId ? { ...h, gold: h.gold - selectedItem.price } : h
        ),
        shopItems: shopItems.map(si =>
          si.id === selectedItem.id && si.stock > 0
            ? { ...si, stock: si.stock - 1 }
            : si
        ),
        purchaseLog: [
          { heroName: hero.heroName || 'Hero', itemName: selectedItem.name, price: selectedItem.price, timestamp: Date.now() },
          ...purchaseLog,
        ],
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
    categoryFilter: 'all',
    purchaseLog: [],
  }),
}));
