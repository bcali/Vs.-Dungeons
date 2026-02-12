"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { EQUIPMENT_RARITY_INFO, TIER_COLORS } from "@/types/game";
import type { ForgeRecipe } from "@/data/forge-recipes";

interface RecipeListProps {
  recipes: ForgeRecipe[];
  selectedRecipeId: string | null;
  onSelect: (recipe: ForgeRecipe) => void;
  canAfford: (recipe: ForgeRecipe) => boolean;
}

export function RecipeList({ recipes, selectedRecipeId, onSelect, canAfford }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-dim text-sm">No recipes available at your level.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {recipes.map((recipe) => {
          const rarityInfo = EQUIPMENT_RARITY_INFO[recipe.rarity];
          const affordable = canAfford(recipe);
          const isSelected = selectedRecipeId === recipe.id;

          return (
            <motion.button
              key={recipe.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              onClick={() => onSelect(recipe)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all",
                "border backdrop-blur-sm",
                isSelected
                  ? "bg-white/[0.06] border-accent-gold/40"
                  : affordable
                    ? "bg-white/[0.03] border-white/5 hover:bg-white/5 hover:border-white/10"
                    : "bg-white/[0.01] border-white/[0.03] opacity-50"
              )}
              style={isSelected ? {
                boxShadow: `0 0 16px ${rarityInfo.borderGlow}`,
                borderColor: rarityInfo.borderGlow,
              } : undefined}
            >
              {/* Recipe icon */}
              <span className="text-xl shrink-0">{recipe.icon}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: affordable ? rarityInfo.color : undefined }}
                >
                  {recipe.name}
                </p>
                <p className="text-[10px] text-text-muted truncate mt-0.5">
                  {recipe.description}
                </p>
                <p className="text-[10px] text-green-400/80 mt-0.5">
                  {recipe.effect}
                </p>
              </div>

              {/* Cost pills */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {recipe.slots.slice(0, 2).map((slot, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 whitespace-nowrap"
                    style={{ color: TIER_COLORS[slot.tier as keyof typeof TIER_COLORS] ?? '#8b7aaa' }}
                  >
                    {slot.label}
                  </span>
                ))}
                {recipe.slots.length > 2 && (
                  <span className="text-[9px] text-text-dim">
                    +{recipe.slots.length - 2} more
                  </span>
                )}
              </div>

              {/* Affordable indicator */}
              {!affordable && (
                <span className="text-[9px] text-red-400/60 shrink-0">
                  Need Materials
                </span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
