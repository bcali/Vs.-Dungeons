"use client";

import Link from "next/link";
import { use, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, ArrowLeft, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchCharacter,
  fetchSeals,
  fetchCharacterMaterials,
  addInventoryItem,
} from "@/lib/supabase/queries";
import type {
  Character,
  CharacterSeals,
  CharacterMaterial,
} from "@/types/game";
import { TIER_COLORS, CATEGORY_ICONS } from "@/types/game";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionLabel } from "@/components/ui/section-label";
import { ForgeBackground } from "@/components/forge/forge-background";
import { RecipeList } from "@/components/forge/recipe-list";
import { CraftingWorkbench } from "@/components/forge/crafting-workbench";
import { ForgeSuccess } from "@/components/forge/forge-success";
import { useEquipmentStore } from "@/stores/equipment-store";
import type { ForgeRecipe, ForgeCategory } from "@/data/forge-recipes";
import {
  getRecipesForCategoryAndLevel,
  canAffordRecipe,
  sortRecipes,
} from "@/data/forge-recipes";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const CATEGORY_INFO: Record<ForgeCategory, { name: string; icon: string }> = {
  armor:  { name: 'Armor',   icon: '\u{1F6E1}' },
  potion: { name: 'Potions', icon: '\u{1F9EA}' },
  trap:   { name: 'Traps',   icon: '\u{1FAA4}' },
  misc:   { name: 'Misc',    icon: '\u{1F4DC}' },
};

export default function ForgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [char, setChar] = useState<Character | null>(null);
  const [seals, setSeals] = useState<CharacterSeals | null>(null);
  const [materials, setMaterials] = useState<CharacterMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ForgeCategory>('armor');
  const [selectedRecipe, setSelectedRecipe] = useState<ForgeRecipe | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [successRecipe, setSuccessRecipe] = useState<ForgeRecipe | null>(null);

  const equipmentStore = useEquipmentStore();

  const load = useCallback(async () => {
    setLoading(true);
    const [c, s, mats] = await Promise.all([
      fetchCharacter(id),
      fetchSeals(id),
      fetchCharacterMaterials(id),
    ]);
    setChar(c);
    setSeals(s);
    setMaterials(mats);
    await equipmentStore.loadEquipment(id);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Build seals record for affordability checks
  const sealsRecord = useMemo(() => ({
    common: seals?.common ?? 0,
    uncommon: seals?.uncommon ?? 0,
    rare: seals?.rare ?? 0,
    epic: seals?.epic ?? 0,
    legendary: seals?.legendary ?? 0,
  }), [seals]);

  const materialsRecord = useMemo(() =>
    materials.map(m => ({ tier: m.tier, quantity: m.quantity })),
    [materials]
  );

  // Get sorted recipes for active category
  const recipes = useMemo(() => {
    if (!char) return [];
    const categoryRecipes = getRecipesForCategoryAndLevel(activeCategory, char.level);
    return sortRecipes(categoryRecipes, sealsRecord, materialsRecord);
  }, [char, activeCategory, sealsRecord, materialsRecord]);

  const checkAfford = useCallback((recipe: ForgeRecipe) => {
    return canAffordRecipe(recipe, sealsRecord, materialsRecord);
  }, [sealsRecord, materialsRecord]);

  // Handle crafting
  async function handleCraft(recipe: ForgeRecipe) {
    if (!char) return;
    setIsCrafting(true);

    let success = false;

    if (recipe.result.type === 'equipment' && recipe.equipmentRecipe) {
      // Equipment crafting via equipment store
      success = await equipmentStore.craftItem(
        char.id,
        recipe.equipmentRecipe.template,
        char.level,
      );
    } else {
      // Consumable crafting — add to inventory
      const itemId = await addInventoryItem(
        char.id,
        recipe.result.itemName,
        recipe.result.itemType,
        1,
        recipe.result.effectJson,
      );
      success = itemId !== null;
    }

    setIsCrafting(false);

    if (success) {
      setSuccessRecipe(recipe);
      setSelectedRecipe(null);
      // Reload resources
      const [s, mats] = await Promise.all([
        fetchSeals(char.id),
        fetchCharacterMaterials(char.id),
      ]);
      setSeals(s);
      setMaterials(mats);
    }
  }

  function handleCollect() {
    setSuccessRecipe(null);
  }

  if (loading || !char) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ForgeBackground className="fixed inset-0 z-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <span className="text-text-muted animate-pulse font-semibold">Stoking the forge...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ForgeBackground className="fixed inset-0 z-0" />

      <motion.div
        className="relative z-10 flex flex-col px-4 py-6 md:py-8 max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/character/${id}`}
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Character
            </Link>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Hammer className="w-6 h-6 text-orange-400" />
            <h1
              className="text-sm md:text-lg font-mono text-orange-400"
              style={{ textShadow: "2px 2px 0px #000, 0px 0px 15px rgba(255, 140, 40, 0.3)" }}
            >
              The Forge
            </h1>
          </div>
          <p className="text-text-muted text-xs mt-1 ml-9">
            {char.heroName || "Hero"} &bull; Level {char.level}
          </p>
        </motion.div>

        {/* Main content — 2 column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar — Materials & Seals */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <GlassCard>
              <SectionLabel label="Resources" icon={Gem} />

              {/* Seals */}
              <div className="space-y-1.5 mb-4">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">Seals</p>
                {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(tier => {
                  const val = seals?.[tier] ?? 0;
                  return (
                    <div key={tier} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: TIER_COLORS[tier] }}
                      />
                      <span className="text-xs text-text-secondary capitalize flex-1">{tier}</span>
                      <span className="text-xs font-bold" style={{ color: TIER_COLORS[tier] }}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Materials */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">Materials</p>
                {materials.length === 0 ? (
                  <p className="text-text-dim text-xs italic">No materials yet</p>
                ) : (
                  <>
                    {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map(tier => {
                      const tierMats = materials.filter(m => m.tier === tier);
                      if (tierMats.length === 0) return null;
                      return (
                        <div key={tier} className="space-y-0.5">
                          {tierMats.map(m => (
                            <div key={m.materialId} className="flex items-center gap-2">
                              <span className="text-xs shrink-0">
                                {m.icon || CATEGORY_ICONS[m.category]}
                              </span>
                              <span className="text-xs text-text-secondary truncate flex-1">
                                {m.materialName}
                              </span>
                              <span
                                className="text-xs font-bold shrink-0"
                                style={{ color: TIER_COLORS[tier] }}
                              >
                                x{m.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right — Recipe browser */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <GlassCard>
              {/* Category tabs */}
              <Tabs
                value={activeCategory}
                onValueChange={(v) => {
                  setActiveCategory(v as ForgeCategory);
                  setSelectedRecipe(null);
                }}
              >
                <TabsList
                  className="border backdrop-blur-md mb-4"
                  style={{
                    background: "rgba(26, 10, 62, 0.8)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {(Object.entries(CATEGORY_INFO) as [ForgeCategory, { name: string; icon: string }][]).map(
                    ([cat, info]) => (
                      <TabsTrigger
                        key={cat}
                        value={cat}
                        className="font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-orange-400"
                      >
                        <span className="mr-1">{info.icon}</span>
                        {info.name}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>

                {(Object.keys(CATEGORY_INFO) as ForgeCategory[]).map(cat => (
                  <TabsContent key={cat} value={cat}>
                    <SectionLabel
                      label={`${CATEGORY_INFO[cat].name} (${
                        cat === activeCategory ? recipes.length : '...'
                      })`}
                      icon={Hammer}
                    />
                    <RecipeList
                      recipes={recipes}
                      selectedRecipeId={selectedRecipe?.id ?? null}
                      onSelect={setSelectedRecipe}
                      canAfford={checkAfford}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </GlassCard>

            {/* Workbench — below recipe list, no glass card so background shows through */}
            <AnimatePresence>
              {selectedRecipe && (
                <CraftingWorkbench
                  recipe={selectedRecipe}
                  materials={materials}
                  seals={seals}
                  isCrafting={isCrafting}
                  onCraft={handleCraft}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Forge success animation overlay */}
      <AnimatePresence>
        {successRecipe && (
          <ForgeSuccess recipe={successRecipe} onCollect={handleCollect} />
        )}
      </AnimatePresence>
    </div>
  );
}
