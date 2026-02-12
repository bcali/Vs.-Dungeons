"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { EQUIPMENT_RARITY_INFO, TIER_COLORS } from "@/types/game";
import type { CharacterMaterial, CharacterSeals } from "@/types/game";
import type { ForgeRecipe } from "@/data/forge-recipes";
import { MaterialPicker } from "./material-picker";

interface CraftingWorkbenchProps {
  recipe: ForgeRecipe;
  materials: CharacterMaterial[];
  seals: CharacterSeals | null;
  isCrafting: boolean;
  onCraft: (recipe: ForgeRecipe) => void;
  onBack: () => void;
}

export function CraftingWorkbench({
  recipe,
  materials,
  seals,
  isCrafting,
  onCraft,
  onBack,
}: CraftingWorkbenchProps) {
  const [filledSlots, setFilledSlots] = useState<boolean[]>(
    () => recipe.slots.map(() => false)
  );
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  const rarityInfo = EQUIPMENT_RARITY_INFO[recipe.rarity];
  const allFilled = filledSlots.every(Boolean);
  const slotCount = recipe.slots.length;

  // Circular slot positioning around center anvil
  function getSlotPosition(index: number, total: number): { x: number; y: number } {
    const radius = 90;
    // Start from top, distribute evenly
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  function handleSlotClick(index: number) {
    if (filledSlots[index]) return; // Already filled
    setPickerSlotIndex(index);
  }

  function handleSlotFill(index: number) {
    setFilledSlots(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setPickerSlotIndex(null);
  }

  function handleReset() {
    setFilledSlots(recipe.slots.map(() => false));
  }

  return (
    <div>
      {/* Recipe header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          &larr; Back
        </button>
        <span className="text-xl">{recipe.icon}</span>
        <div>
          <h3
            className="text-base font-bold"
            style={{ color: rarityInfo.color }}
          >
            {recipe.name}
          </h3>
          <p className="text-[10px] text-text-muted">{recipe.effect}</p>
        </div>
      </div>

      {/* Circular workbench area */}
      <div className="relative mx-auto" style={{ width: 260, height: 260 }}>
        {/* Center anvil icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <Hammer
            className="w-8 h-8"
            style={{ color: rarityInfo.color, opacity: 0.6 }}
          />
          <span className="text-[9px] text-text-dim uppercase tracking-widest">Forge</span>
        </div>

        {/* Material slots arranged in circle */}
        {recipe.slots.map((slot, i) => {
          const pos = getSlotPosition(i, slotCount);
          const isFilled = filledSlots[i];
          const tierColor = TIER_COLORS[slot.tier as keyof typeof TIER_COLORS] ?? '#8b7aaa';

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSlotClick(i)}
              disabled={isFilled || isCrafting}
              className={cn(
                "absolute w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all",
                "border-2",
                isFilled
                  ? "bg-green-500/10 border-green-500/40"
                  : "bg-white/[0.03] border-dashed border-white/10 hover:border-white/25 hover:bg-white/5 cursor-pointer"
              )}
              style={{
                left: `calc(50% + ${pos.x}px - 32px)`,
                top: `calc(50% + ${pos.y}px - 32px)`,
                ...(isFilled ? {} : {
                  animation: 'pulse-glow 2s ease-in-out infinite',
                  '--glow-rgb': '255 140 40',
                } as React.CSSProperties),
              }}
            >
              {isFilled ? (
                <>
                  <Check className="w-4 h-4 text-green-400 mb-0.5" />
                  <span className="text-[8px] text-green-400 font-bold truncate w-full text-center px-1">
                    {slot.label.split(' ').slice(1).join(' ')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm mb-0.5">
                    {slot.type === 'seal' ? '\u{1F52E}' : '\u26CF\uFE0F'}
                  </span>
                  <span
                    className="text-[8px] font-medium truncate w-full text-center px-1"
                    style={{ color: tierColor }}
                  >
                    {slot.label}
                  </span>
                </>
              )}
            </motion.button>
          );
        })}

        {/* Connecting lines from slots to center */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="260"
          height="260"
          viewBox="0 0 260 260"
        >
          {recipe.slots.map((_, i) => {
            const pos = getSlotPosition(i, slotCount);
            const isFilled = filledSlots[i];
            return (
              <line
                key={i}
                x1={130}
                y1={130}
                x2={130 + pos.x}
                y2={130 + pos.y}
                stroke={isFilled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.05)'}
                strokeWidth={1}
                strokeDasharray={isFilled ? undefined : '4 4'}
              />
            );
          })}
        </svg>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleReset}
          disabled={isCrafting || filledSlots.every(v => !v)}
          className="rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider bg-white/5 text-text-secondary hover:bg-white/10 transition-all disabled:opacity-30 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={() => onCraft(recipe)}
          disabled={!allFilled || isCrafting}
          className={cn(
            "flex-1 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
            allFilled && !isCrafting
              ? "bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border-b-2 border-yellow-700 active:border-b-0 active:translate-y-0.5"
              : "bg-white/5 text-text-dim cursor-not-allowed"
          )}
        >
          {isCrafting ? "Forging..." : allFilled ? "\u2692 Craft" : "Fill All Slots"}
        </button>
      </div>

      {/* Material picker modal */}
      <AnimatePresence>
        {pickerSlotIndex !== null && (
          <MaterialPicker
            slot={recipe.slots[pickerSlotIndex]}
            materials={materials}
            seals={seals}
            slotIndex={pickerSlotIndex}
            onSelect={handleSlotFill}
            onClose={() => setPickerSlotIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
