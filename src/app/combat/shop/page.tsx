"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ShoppingBag, Swords, Coins, X,
  FlaskConical, Gem, Package, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shop-store";
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

/* ── Page ── */

export default function ShopPage() {
  const router = useRouter();
  const { shopItems, heroes, questName, isLoading, selectedItem, selectedHeroId, isPurchasing, loadShop, selectItem, selectHero, purchase } = useShopStore();
  const { preCombatSetup, startCombatFromShop } = useCombatStore();

  const merchantQuote = useMemo(
    () => MERCHANT_QUOTES[Math.floor(Math.random() * MERCHANT_QUOTES.length)],
    []
  );

  useEffect(() => { loadShop(); }, [loadShop]);

  const handleHeadOut = () => {
    startCombatFromShop();
    router.push("/combat");
  };

  const handlePurchase = async () => {
    const result = await purchase();
    if (!result.success) {
      // Could add toast here, but for now the modal just closes
    }
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
        {/* ── Top Banner ── */}
        <motion.div variants={fadeUp} className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/combat/setup" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              &larr; Back to Setup
            </Link>
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
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-accent-gold" />
              <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">Brickton Merchant</span>
              <ShoppingBag className="w-4 h-4 text-accent-gold" />
            </div>
            <h1
              className="text-2xl md:text-4xl font-mono text-lego-yellow tracking-wider uppercase"
              style={{ textShadow: "3px 3px 0px #000, 0px 0px 20px rgba(242, 205, 55, 0.4)" }}
            >
              Quest Shop
            </h1>
            <p className="text-sm text-text-secondary mt-1 italic">&ldquo;{merchantQuote}&rdquo;</p>
            {questName && (
              <p className="text-[10px] text-text-muted mt-1 font-mono uppercase tracking-wider">{questName}</p>
            )}
          </div>
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

          {/* ── SHOP CATALOG (right) ── */}
          <div className="col-span-8 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-4 h-4 text-accent-gold/70" />
              <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
                Shop ({shopItems.length} items)
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {shopItems.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    onClick={() => item.stock !== 0 && selectItem(item)}
                  />
                ))}
                {shopItems.length === 0 && (
                  <div className="col-span-full rounded-xl bg-card-bg border border-card-border border-dashed backdrop-blur-md p-8 text-center">
                    <p className="text-text-muted text-sm italic">No items available for this quest.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div variants={fadeUp} className="mt-4 flex justify-center">
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

  return (
    <div
      onClick={isSoldOut ? undefined : onClick}
      className={cn(
        "rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-4 border-l-4 transition-all",
        rarityBorder,
        isSoldOut
          ? "opacity-50 cursor-default"
          : "cursor-pointer hover:border-card-border/50 hover:bg-card-bg/80"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          isSoldOut ? "bg-bg-input/50 text-text-dim" : "bg-bg-input text-text-secondary"
        )}>
          <TypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold text-sm truncate", isSoldOut ? "text-text-dim" : "text-text-primary")}>
            {item.name}
          </p>
          <p className={cn("text-[10px] uppercase tracking-wider", rarityText)}>
            {item.rarity} {item.itemType}
          </p>
        </div>
      </div>

      {item.description && (
        <p className="text-[11px] text-text-muted mt-2 leading-tight line-clamp-2">{item.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-card-border">
        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-accent-gold" />
          <span className="font-black text-sm text-accent-gold">{item.price}g</span>
        </div>
        {isSoldOut ? (
          <span className="text-[10px] font-mono text-accent-red uppercase tracking-wider">Sold Out</span>
        ) : item.stock === -1 ? (
          <span className="text-[10px] text-text-dim font-mono">&infin; stock</span>
        ) : (
          <span className="text-[10px] text-text-muted font-mono">{item.stock} left</span>
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
        className="w-full max-w-lg rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-6 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-input text-text-muted hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Item details */}
        <div className="flex items-start gap-4 mb-6">
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
            <div className="flex items-center gap-1.5 mt-2">
              <Coins className="w-4 h-4 text-accent-gold" />
              <span className="font-black text-lg text-accent-gold">{item.price}g</span>
            </div>
          </div>
        </div>

        {/* Hero selection */}
        <div className="mb-6">
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
          <div className="rounded-lg bg-bg-input/50 border border-card-border p-3 mb-6">
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
