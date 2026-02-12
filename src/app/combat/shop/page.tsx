"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ShoppingBag, Swords, Coins, X, Flame,
  FlaskConical, Gem, Package, Heart, Sparkles, Zap,
  CheckCircle2, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shop-store";
import type { PurchaseLogEntry } from "@/stores/shop-store";
import { useCombatStore } from "@/stores/combat-store";
import { ExplorationBackground } from "@/components/ui/exploration-background";
import { HeroAvatar } from "@/components/character/hero-avatar";
import { Button } from "@/components/ui/button";
import type { Character, ShopItem, ItemType, Profession } from "@/types/game";

/* ── Animation helpers ── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Constants ── */

const MERCHANT_QUOTES = [
  "Stock up before you head out!",
  "Fresh potions, straight from the cauldron!",
  "A wise hero prepares before battle.",
  "Best prices in the realm, guaranteed!",
  "You won't find better gear this side of the dungeon!",
];

const PROF_BORDER: Record<string, string> = {
  knight: "border-l-prof-knight",
  rogue: "border-l-prof-rogue",
  wizard: "border-l-prof-wizard",
  healer: "border-l-prof-healer",
  ranger: "border-l-prof-ranger",
  inventor: "border-l-prof-inventor",
};

const RARITY_BORDER: Record<string, string> = {
  common: "border-l-green-500",
  uncommon: "border-l-blue-500",
  rare: "border-l-yellow-500",
  epic: "border-l-purple-500",
  legendary: "border-l-red-500",
};

const RARITY_TEXT: Record<string, string> = {
  common: "text-green-400",
  uncommon: "text-blue-400",
  rare: "text-yellow-400",
  epic: "text-purple-400",
  legendary: "text-red-400",
};

const ITEM_TYPE_ICON: Record<ItemType, typeof Swords> = {
  weapon: Swords,
  armor: Shield,
  consumable: FlaskConical,
  quest: Gem,
  misc: Package,
};

const CATEGORY_TABS: { key: 'all' | ItemType; label: string; icon: typeof Swords }[] = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'consumable', label: 'Potions', icon: FlaskConical },
  { key: 'weapon', label: 'Weapons', icon: Swords },
  { key: 'armor', label: 'Armor', icon: Shield },
  { key: 'misc', label: 'Misc', icon: Package },
];

/* ── Effect parser ── */

function parseEffects(effectJson: Record<string, unknown> | null): string[] {
  if (!effectJson) return [];
  const effects: string[] = [];

  if (effectJson.gearBonus && typeof effectJson.gearBonus === 'object') {
    const bonus = effectJson.gearBonus as Record<string, number>;
    for (const [stat, val] of Object.entries(bonus)) {
      effects.push(`+${val} ${stat.toUpperCase()}`);
    }
  }
  if (typeof effectJson.healing === 'number') {
    effects.push(`Heals ${effectJson.healing} HP`);
  }
  if (typeof effectJson.manaRestore === 'number') {
    effects.push(`+${effectJson.manaRestore} MP`);
  }
  if (effectJson.dodgeNext) {
    effects.push('Dodge next attack');
  }
  if (effectJson.tempBonus && typeof effectJson.tempBonus === 'object') {
    const tb = effectJson.tempBonus as Record<string, number>;
    const dur = typeof effectJson.duration === 'number' ? effectJson.duration : 0;
    for (const [stat, val] of Object.entries(tb)) {
      effects.push(`+${val} ${stat.toUpperCase()}${dur ? ` (${dur}t)` : ''}`);
    }
  }
  if (effectJson.damageType && typeof effectJson.damageType === 'string') {
    effects.push(`${effectJson.damageType} dmg`);
  }

  return effects;
}

/* ── Page ── */

export default function ShopPage() {
  const router = useRouter();
  const {
    shopItems, heroes, questName, isLoading, selectedItem, selectedHeroId, isPurchasing,
    categoryFilter, purchaseLog,
    loadShop, selectItem, selectHero, setCategoryFilter, purchase,
  } = useShopStore();
  const { preCombatSetup, startCombatFromShop } = useCombatStore();

  const [toast, setToast] = useState<PurchaseLogEntry | null>(null);

  const merchantQuote = useMemo(
    () => MERCHANT_QUOTES[Math.floor(Math.random() * MERCHANT_QUOTES.length)],
    []
  );

  useEffect(() => { loadShop(); }, [loadShop]);

  // Watch purchaseLog for new entries → show toast
  const latestPurchase = purchaseLog[0] ?? null;
  useEffect(() => {
    if (latestPurchase && latestPurchase.timestamp > Date.now() - 1000) {
      setToast(latestPurchase);
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [latestPurchase]);

  const filteredItems = categoryFilter === 'all'
    ? shopItems
    : shopItems.filter(item => item.itemType === categoryFilter);

  const handleHeadOut = () => {
    startCombatFromShop();
    router.push("/combat");
  };

  const handlePurchase = async () => {
    await purchase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <ExplorationBackground className="fixed inset-0 z-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <span className="text-text-muted animate-pulse font-semibold">Loading shop...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ExplorationBackground className="fixed inset-0 z-0" />

      <motion.div
        className="relative z-10 flex flex-col h-screen p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Top Bar ── */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-3">
          <Link href="/combat/setup" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            &larr; Back to Setup
          </Link>
          {questName && (
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{questName}</span>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleHeadOut}
            disabled={!preCombatSetup}
            className="bg-lego-green hover:bg-green-600 text-white font-black px-6 py-2.5 rounded-lg border-b-4 border-green-800 shadow-xl active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
          >
            <Swords className="w-4 h-4" />
            Head Out!
          </motion.button>
        </motion.div>

        {/* ── Main 2-column layout ── */}
        <motion.div variants={fadeUp} className="flex-1 grid grid-cols-12 gap-3 min-h-0">

          {/* ── HEROES (left) ── */}
          <div className="col-span-4 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-accent-gold/70" />
              <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
                Heroes ({heroes.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {heroes.map((hero) => (
                <ShopHeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          </div>

          {/* ── SHOP (right) ── */}
          <div className="col-span-8 flex flex-col min-h-0">

            {/* ── Merchant Visual ── */}
            <MerchantBanner quote={merchantQuote} />

            {/* ── Category Tabs ── */}
            <div className="flex gap-1.5 mb-3">
              {CATEGORY_TABS.map(tab => {
                const count = tab.key === 'all' ? shopItems.length : shopItems.filter(i => i.itemType === tab.key).length;
                if (tab.key !== 'all' && count === 0) return null;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCategoryFilter(tab.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all",
                      categoryFilter === tab.key
                        ? "bg-card-bg text-accent-gold border border-accent-gold/30"
                        : "text-text-muted hover:text-text-secondary border border-transparent"
                    )}
                  >
                    <TabIcon className="w-3 h-3" />
                    {tab.label}
                    <span className="text-text-dim">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* ── Item Grid (2-row scroll) ── */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-2.5">
                {filteredItems.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    onClick={() => item.stock !== 0 && selectItem(item)}
                  />
                ))}
                {filteredItems.length === 0 && (
                  <div className="col-span-full rounded-xl bg-card-bg border border-card-border border-dashed backdrop-blur-md p-6 text-center">
                    <p className="text-text-muted text-sm italic">No items in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div variants={fadeUp} className="mt-3 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleHeadOut}
            disabled={!preCombatSetup}
            className="bg-lego-green hover:bg-green-600 text-white font-black text-xl px-8 py-4 rounded-lg border-b-6 border-green-800 shadow-xl active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
          >
            <Swords className="w-6 h-6" />
            Head Out!
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Purchase Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <PurchaseModal
            item={selectedItem}
            heroes={heroes}
            selectedHeroId={selectedHeroId}
            isPurchasing={isPurchasing}
            onSelectHero={selectHero}
            onPurchase={handlePurchase}
            onClose={() => { selectItem(null); selectHero(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── Purchase Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-50 flex items-center gap-3 rounded-xl bg-card-bg border border-accent-gold/30 backdrop-blur-md px-5 py-3 shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-lego-green shrink-0" />
            <span className="text-sm text-text-primary font-bold">
              {toast.heroName} bought <span className="text-accent-gold">{toast.itemName}</span> for {toast.price}g
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Merchant Banner ── */

function MerchantBanner({ quote }: { quote: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden mb-3 border border-card-border">
      {/* Background — dark shop interior */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/80 via-stone-900/90 to-card-bg" />

      {/* Shelves */}
      <div className="relative px-4 pt-3 pb-4">
        {/* Top shelf with items */}
        <div className="flex items-end justify-center gap-6 mb-2">
          {/* Left shelf cluster */}
          <div className="flex items-end gap-2">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
              className="w-5 h-8 rounded-sm bg-red-500/80 border border-red-400/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
            />
            <div className="w-4 h-6 rounded-sm bg-blue-500/70 border border-blue-400/30 shadow-[0_0_6px_rgba(59,130,246,0.3)]" />
            <div className="w-3 h-5 rounded-full bg-green-500/70 border border-green-400/30 shadow-[0_0_6px_rgba(34,197,94,0.3)]" />
          </div>

          {/* Left lantern */}
          <div className="flex flex-col items-center">
            <div className="w-px h-3 bg-amber-700" />
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
            >
              <Flame className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            </motion.div>
          </div>

          {/* Merchant character */}
          <div className="flex flex-col items-center">
            {/* Head */}
            <div className="w-10 h-10 rounded-md bg-accent-gold border-2 border-amber-600 flex items-center justify-center shadow-lg relative">
              <span className="text-lg font-black text-amber-900">M</span>
              {/* Hat */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-t-lg bg-purple-800 border border-purple-600/50" />
            </div>
            {/* Body */}
            <div className="w-12 h-6 rounded-b-md bg-purple-900 border border-purple-700/40 mt-px" />
          </div>

          {/* Right lantern */}
          <div className="flex flex-col items-center">
            <div className="w-px h-3 bg-amber-700" />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" as const, delay: 0.5 }}
            >
              <Flame className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            </motion.div>
          </div>

          {/* Right shelf cluster */}
          <div className="flex items-end gap-2">
            <div className="w-3 h-5 rounded-sm bg-purple-500/70 border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.3)]" />
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" as const, delay: 1 }}
              className="w-4 h-7 rounded-sm bg-yellow-500/70 border border-yellow-400/30 shadow-[0_0_6px_rgba(234,179,8,0.3)]"
            />
            <div className="w-5 h-6 rounded-sm bg-cyan-500/60 border border-cyan-400/30 shadow-[0_0_6px_rgba(34,211,238,0.2)]" />
          </div>
        </div>

        {/* Counter / bar */}
        <div className="h-4 rounded-md bg-amber-900/90 border-t-2 border-amber-700/60 border-b-2 border-amber-950 shadow-inner" />

        {/* Merchant name + quote */}
        <div className="text-center mt-2">
          <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">Brickton Merchant</span>
          <p className="text-[11px] text-text-secondary italic mt-0.5">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

      {/* Crystal decorations on corners */}
      <div className="absolute top-2 left-3">
        <Sparkles className="w-3 h-3 text-purple-400/50" />
      </div>
      <div className="absolute top-2 right-3">
        <Sparkles className="w-3 h-3 text-cyan-400/50" />
      </div>
    </div>
  );
}

/* ── Shop Hero Card ── */

function ShopHeroCard({ hero }: { hero: Character }) {
  const prof = (hero.profession || "knight") as Profession;
  const borderClass = PROF_BORDER[prof] || "border-l-accent-gold";

  return (
    <div className={cn(
      "rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-4 border-l-4",
      borderClass
    )}>
      <div className="flex items-center gap-3 mb-2">
        <HeroAvatar profession={prof} level={hero.level} size="sm" animate={false} glow={false} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-text-primary truncate">{hero.heroName || "Unnamed"}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Lv{hero.level} {hero.profession}
          </p>
        </div>
      </div>

      {/* Gold display */}
      <div className="flex items-center gap-2 mt-2 rounded-lg bg-accent-gold/10 border border-accent-gold/20 px-3 py-2">
        <Coins className="w-4 h-4 text-accent-gold" />
        <span className="font-black text-lg text-accent-gold">{hero.gold}</span>
        <span className="text-xs text-accent-gold/70 font-mono">GOLD</span>
      </div>
    </div>
  );
}

/* ── Shop Item Card ── */

function ShopItemCard({ item, onClick }: { item: ShopItem; onClick: () => void }) {
  const isSoldOut = item.stock === 0;
  const rarityBorder = RARITY_BORDER[item.rarity] || "border-l-green-500";
  const rarityText = RARITY_TEXT[item.rarity] || "text-green-400";
  const TypeIcon = ITEM_TYPE_ICON[item.itemType] || Package;
  const effects = parseEffects(item.effectJson);

  return (
    <div
      onClick={isSoldOut ? undefined : onClick}
      className={cn(
        "rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-3 border-l-4 transition-all",
        rarityBorder,
        isSoldOut
          ? "opacity-50 cursor-default"
          : "cursor-pointer hover:border-card-border/50 hover:bg-card-bg/80"
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isSoldOut ? "bg-bg-input/50 text-text-dim" : "bg-bg-input text-text-secondary"
        )}>
          <TypeIcon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold text-xs truncate", isSoldOut ? "text-text-dim" : "text-text-primary")}>
            {item.name}
          </p>
          <p className={cn("text-[9px] uppercase tracking-wider", rarityText)}>
            {item.rarity}
          </p>
        </div>
      </div>

      {/* Effect tags */}
      {effects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {effects.map((eff, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-bg-input/80 text-text-secondary rounded px-1.5 py-0.5">
              <Zap className="w-2.5 h-2.5 text-accent-gold/70" />
              {eff}
            </span>
          ))}
        </div>
      )}

      {/* Price + stock footer */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-card-border">
        <div className="flex items-center gap-1">
          <Coins className="w-3 h-3 text-accent-gold" />
          <span className="font-black text-xs text-accent-gold">{item.price}g</span>
        </div>
        {isSoldOut ? (
          <span className="text-[9px] font-mono text-accent-red uppercase tracking-wider">Sold Out</span>
        ) : item.stock === -1 ? (
          <span className="text-[9px] text-text-dim font-mono">&infin;</span>
        ) : (
          <span className="text-[9px] text-text-muted font-mono">{item.stock} left</span>
        )}
      </div>
    </div>
  );
}

/* ── Purchase Modal ── */

function PurchaseModal({
  item,
  heroes,
  selectedHeroId,
  isPurchasing,
  onSelectHero,
  onPurchase,
  onClose,
}: {
  item: ShopItem;
  heroes: Character[];
  selectedHeroId: string | null;
  isPurchasing: boolean;
  onSelectHero: (id: string | null) => void;
  onPurchase: () => void;
  onClose: () => void;
}) {
  const rarityText = RARITY_TEXT[item.rarity] || "text-green-400";
  const TypeIcon = ITEM_TYPE_ICON[item.itemType] || Package;
  const selectedHero = heroes.find(h => h.id === selectedHeroId);
  const canAfford = selectedHero ? selectedHero.gold >= item.price : false;
  const effects = parseEffects(item.effectJson);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-input text-text-muted hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Item details */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-bg-input flex items-center justify-center">
            <TypeIcon className="w-6 h-6 text-text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-lg text-text-primary">{item.name}</h3>
            <p className={cn("text-xs uppercase tracking-wider", rarityText)}>
              {item.rarity} {item.itemType}
            </p>
            {item.description && (
              <p className="text-sm text-text-secondary mt-1">{item.description}</p>
            )}
          </div>
        </div>

        {/* Effects + price */}
        <div className="flex items-center justify-between mb-5 rounded-lg bg-bg-input/50 border border-card-border px-3 py-2.5">
          <div className="flex flex-wrap gap-1.5">
            {effects.length > 0 ? effects.map((eff, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] font-mono bg-card-bg text-text-secondary rounded px-2 py-0.5">
                <Zap className="w-3 h-3 text-accent-gold/70" />
                {eff}
              </span>
            )) : (
              <span className="text-[10px] text-text-dim italic">No special effects</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <Coins className="w-4 h-4 text-accent-gold" />
            <span className="font-black text-lg text-accent-gold">{item.price}g</span>
          </div>
        </div>

        {/* Hero selection */}
        <div className="mb-5">
          <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Select buyer</p>
          <div className="flex gap-3 flex-wrap">
            {heroes.map((hero) => {
              const canHeroAfford = hero.gold >= item.price;
              const isSelected = hero.id === selectedHeroId;
              const prof = (hero.profession || "knight") as Profession;

              return (
                <button
                  key={hero.id}
                  onClick={() => canHeroAfford && onSelectHero(hero.id)}
                  disabled={!canHeroAfford}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 transition-all",
                    isSelected
                      ? "bg-accent-gold/15 border-accent-gold shadow-[0_0_12px_rgba(242,205,55,0.2)]"
                      : canHeroAfford
                        ? "bg-bg-input border-card-border hover:border-text-muted cursor-pointer"
                        : "bg-bg-input/50 border-card-border opacity-50 cursor-not-allowed"
                  )}
                >
                  <HeroAvatar profession={prof} level={hero.level} size="sm" animate={false} glow={false} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-text-primary truncate max-w-[80px]">{hero.heroName || "Hero"}</p>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-accent-gold" />
                      <span className={cn("text-xs font-bold", canHeroAfford ? "text-accent-gold" : "text-accent-red")}>
                        {hero.gold}g
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Purchase summary */}
        {selectedHero && (
          <div className="rounded-lg bg-bg-input/50 border border-card-border p-3 mb-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {selectedHero.heroName} pays <span className="text-accent-gold font-bold">{item.price}g</span>
              </span>
              <span className="text-text-muted">
                &rarr; <span className="text-text-primary font-bold">{selectedHero.gold - item.price}g</span> remaining
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-bg-input px-4 py-3 text-sm text-text-secondary hover:text-white transition-colors font-bold"
          >
            Cancel
          </button>
          <Button
            variant="game-lego-gold"
            disabled={!selectedHeroId || !canAfford || isPurchasing}
            onClick={onPurchase}
            className="flex-1 py-3"
          >
            <Coins className="w-4 h-4 mr-2" />
            {isPurchasing ? "Buying..." : "Buy"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
