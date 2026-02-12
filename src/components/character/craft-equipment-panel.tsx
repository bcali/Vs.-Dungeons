"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  EquipmentSlot,
  EquipmentRarity,
  CharacterMaterial,
  CharacterSeals,
  CraftingProfession,
} from "@/types/game";
import {
  EQUIPMENT_SLOT_INFO,
  EQUIPMENT_RARITY_INFO,
  EQUIPMENT_SLOTS,
  STAT_LABELS,
  TIER_COLORS,
} from "@/types/game";
import type { EquipmentRecipeEntry } from "@/data/equipment-recipes";
import { getAvailableRecipes } from "@/data/equipment-recipes";
import { SectionLabel } from "@/components/ui/section-label";

interface CraftEquipmentPanelProps {
  characterLevel: number;
  craftingProfessions: CraftingProfession[];
  materials: CharacterMaterial[];
  seals: CharacterSeals | null;
  onCraft: (recipe: EquipmentRecipeEntry) => Promise<void>;
  isCrafting: boolean;
}

export function CraftEquipmentPanel({
  characterLevel,
  craftingProfessions,
  materials,
  seals,
  onCraft,
  isCrafting,
}: CraftEquipmentPanelProps) {
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | "all">("all");
  const [filterRarity, setFilterRarity] = useState<EquipmentRarity | "all">("all");
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // Get available recipes
  const recipes = useMemo(
    () => getAvailableRecipes(characterLevel, craftingProfessions),
    [characterLevel, craftingProfessions]
  );

  // Apply filters
  const filtered = useMemo(() => {
    let result = recipes;
    if (filterSlot !== "all") {
      result = result.filter(r => r.template.slot === filterSlot);
    }
    if (filterRarity !== "all") {
      result = result.filter(r => r.template.rarity === filterRarity);
    }
    // Sort: highest level first, then by rarity
    const rarityOrder: Record<EquipmentRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
    result.sort((a, b) => {
      const levelDiff = b.requiredLevel - a.requiredLevel;
      if (levelDiff !== 0) return levelDiff;
      return rarityOrder[a.template.rarity] - rarityOrder[b.template.rarity];
    });
    return result;
  }, [recipes, filterSlot, filterRarity]);

  // Check if player can afford a recipe
  function canAfford(recipe: EquipmentRecipeEntry): boolean {
    // Check seal costs
    for (const [tier, qty] of Object.entries(recipe.cost.seals) as [string, number][]) {
      const owned = seals?.[tier as keyof CharacterSeals] ?? 0;
      if (typeof owned === 'number' && owned < qty) return false;
    }
    // Material costs are by tier — simplified check
    // In a full implementation, we'd match specific materials
    return true;
  }

  if (craftingProfessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Hammer className="w-8 h-8 text-text-dim mx-auto mb-3" />
        <p className="text-text-secondary text-sm">No crafting professions learned yet.</p>
        <p className="text-text-dim text-xs mt-1">
          Unlock Blacksmithing or Enchanting at Level 3 to craft equipment!
        </p>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel label={`Craft Equipment (${filtered.length})`} icon={Hammer} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Slot filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilterSlot("all")}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md transition-all",
              filterSlot === "all"
                ? "bg-accent-gold/20 text-accent-gold"
                : "bg-white/5 text-text-muted hover:text-text-secondary"
            )}
          >
            All Slots
          </button>
          {EQUIPMENT_SLOTS.map(slot => (
            <button
              key={slot}
              onClick={() => setFilterSlot(slot)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-md transition-all",
                filterSlot === slot
                  ? "bg-accent-gold/20 text-accent-gold"
                  : "bg-white/5 text-text-muted hover:text-text-secondary"
              )}
            >
              {EQUIPMENT_SLOT_INFO[slot].icon}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setFilterRarity("all")}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md transition-all",
              filterRarity === "all"
                ? "bg-white/10 text-text-primary"
                : "bg-white/5 text-text-muted hover:text-text-secondary"
            )}
          >
            All
          </button>
          {(["common", "rare", "epic", "legendary"] as EquipmentRarity[]).map(rarity => (
            <button
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-md transition-all capitalize",
                filterRarity === rarity
                  ? "bg-white/10 text-text-primary"
                  : "bg-white/5 text-text-muted hover:text-text-secondary"
              )}
              style={filterRarity === rarity ? { color: EQUIPMENT_RARITY_INFO[rarity].color } : undefined}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe list */}
      {filtered.length === 0 ? (
        <p className="text-text-dim text-sm text-center py-6">
          No recipes available at your level.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((recipe) => {
            const { template } = recipe;
            const rarityInfo = EQUIPMENT_RARITY_INFO[template.rarity];
            const slotInfo = EQUIPMENT_SLOT_INFO[template.slot];
            const isExpanded = expandedRecipe === recipe.templateId;
            const affordable = canAfford(recipe);

            return (
              <motion.div
                key={recipe.templateId}
                layout
                className="rounded-lg border border-white/5 overflow-hidden"
              >
                {/* Recipe header */}
                <button
                  onClick={() => setExpandedRecipe(isExpanded ? null : recipe.templateId)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/[0.03] hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-base shrink-0">{slotInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: rarityInfo.color }}>
                      {template.nameTemplate}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      Lv.{recipe.requiredLevel}+ {slotInfo.name}
                    </p>
                  </div>

                  {/* Stat preview */}
                  <div className="flex gap-1.5 shrink-0">
                    {(Object.entries(template.statAllocations) as [string, number][])
                      .filter(([, v]) => v > 0)
                      .slice(0, 2)
                      .map(([stat, val]) => (
                        <span key={stat} className="text-[10px] text-green-400">
                          +{val} {STAT_LABELS[stat as keyof typeof STAT_LABELS]?.abbr}
                        </span>
                      ))}
                  </div>

                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-text-muted transition-transform shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 py-3 border-t border-white/5 space-y-3">
                        {/* Full stat breakdown */}
                        <div>
                          <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Stats</p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.entries(template.statAllocations) as [string, number][])
                              .filter(([, v]) => v > 0)
                              .map(([stat, val]) => (
                                <span
                                  key={stat}
                                  className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded"
                                >
                                  +{val} {STAT_LABELS[stat as keyof typeof STAT_LABELS]?.name}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Special effect */}
                        {template.specialEffect && (
                          <div className="rounded bg-yellow-500/5 border border-yellow-500/20 px-2.5 py-2">
                            <span className="text-[10px] text-yellow-400 font-bold">
                              {"\u2728"} {template.specialEffect.name}
                            </span>
                            <p className="text-[10px] text-yellow-300/70 mt-0.5">
                              {template.specialEffect.description}
                            </p>
                          </div>
                        )}

                        {/* Crafting costs */}
                        <div>
                          <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Cost</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(recipe.cost.seals).map(([tier, qty]) => (
                              <span
                                key={tier}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5"
                                style={{ color: TIER_COLORS[tier as keyof typeof TIER_COLORS] }}
                              >
                                {qty}x {tier} seal
                              </span>
                            ))}
                            {recipe.cost.materials.map((mat, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-secondary"
                              >
                                {mat.quantity}x {mat.tier} material
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Craft button */}
                        <button
                          onClick={() => onCraft(recipe)}
                          disabled={isCrafting || !affordable}
                          className={cn(
                            "w-full rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                            affordable
                              ? "bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border-b-2 border-yellow-700 active:border-b-0 active:translate-y-0.5"
                              : "bg-white/5 text-text-dim cursor-not-allowed"
                          )}
                        >
                          {isCrafting ? "Crafting..." : affordable ? "Craft" : "Need Materials"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
