"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
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
}

/* ── SVG Sub-components ─────────────────────────────── */

function Furnace() {
  return (
    <div className="relative w-[100px] h-[140px]">
      <svg viewBox="0 0 100 140" width="100" height="140" className="block">
        {/* Stone body */}
        <rect x="10" y="20" width="80" height="110" rx="6" fill="#1a1020" stroke="#2a1830" strokeWidth="2" />
        {/* Brick lines */}
        <line x1="10" y1="45" x2="90" y2="45" stroke="#2a1830" strokeWidth="1" />
        <line x1="10" y1="70" x2="90" y2="70" stroke="#2a1830" strokeWidth="1" />
        <line x1="10" y1="95" x2="90" y2="95" stroke="#2a1830" strokeWidth="1" />
        <line x1="50" y1="20" x2="50" y2="45" stroke="#2a1830" strokeWidth="1" />
        <line x1="50" y1="70" x2="50" y2="95" stroke="#2a1830" strokeWidth="1" />
        <line x1="30" y1="45" x2="30" y2="70" stroke="#2a1830" strokeWidth="1" />
        <line x1="70" y1="45" x2="70" y2="70" stroke="#2a1830" strokeWidth="1" />
        {/* Opening */}
        <rect x="22" y="55" width="56" height="40" rx="4" fill="#0a0510" />
        <rect x="22" y="55" width="56" height="40" rx="4" fill="none" stroke="#3a2040" strokeWidth="1.5" />
        {/* Chimney */}
        <rect x="35" y="2" width="30" height="22" rx="3" fill="#1a1020" stroke="#2a1830" strokeWidth="1.5" />
      </svg>

      {/* Fire inside furnace opening */}
      <div
        className="forge-furnace-fire absolute"
        style={{ left: 28, top: 60, width: 44, height: 30 }}
      >
        <svg viewBox="0 0 44 30" width="44" height="30">
          <ellipse cx="22" cy="28" rx="20" ry="6" fill="rgba(255,60,10,0.3)" />
          <ellipse cx="22" cy="22" rx="12" ry="10" fill="rgba(255,120,20,0.6)" />
          <ellipse cx="22" cy="18" rx="7" ry="8" fill="rgba(255,200,60,0.5)" />
          <ellipse cx="18" cy="20" rx="4" ry="7" fill="rgba(255,160,30,0.4)" />
          <ellipse cx="26" cy="20" rx="4" ry="7" fill="rgba(255,160,30,0.4)" />
        </svg>
      </div>

      {/* Furnace glow */}
      <div
        className="forge-furnace-glow absolute pointer-events-none"
        style={{
          left: 15,
          top: 50,
          width: 70,
          height: 50,
          background: "radial-gradient(ellipse, rgba(255,80,20,0.25), transparent 70%)",
        }}
      />

      {/* Melt drips */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="forge-melt-drip absolute rounded-full"
          style={{
            left: 34 + i * 14,
            top: 92,
            width: 4,
            height: 6,
            background: `linear-gradient(180deg, #ff8820, #ff5500)`,
            boxShadow: "0 0 4px rgba(255,120,20,0.6)",
            "--drip-dur": `${1.8 + i * 0.4}s`,
            "--drip-delay": `${i * 0.6}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Bellows() {
  return (
    <div className="relative w-[100px] h-[140px] flex items-center justify-center">
      {/* Bellows body with puff animation */}
      <div className="forge-bellows-puff relative" style={{ transformOrigin: "left center" }}>
        <svg viewBox="0 0 90 80" width="90" height="80" className="block">
          {/* Bottom plate */}
          <path d="M5,70 L85,70 L75,78 L15,78 Z" fill="#2a1830" stroke="#3a2840" strokeWidth="1" />
          {/* Top plate */}
          <path d="M5,10 L85,10 L75,2 L15,2 Z" fill="#2a1830" stroke="#3a2840" strokeWidth="1" />
          {/* Leather sides */}
          <path
            d="M5,10 C-5,25 -5,55 5,70 L15,78 L15,2 Z"
            fill="#1a0f18"
            stroke="#3a2840"
            strokeWidth="1"
          />
          <path
            d="M85,10 C95,25 95,55 85,70 L75,78 L75,2 Z"
            fill="#1a0f18"
            stroke="#3a2840"
            strokeWidth="1"
          />
          {/* Accordion folds */}
          <path d="M15,18 Q50,24 75,18" fill="none" stroke="#2a1830" strokeWidth="1.5" />
          <path d="M15,30 Q50,38 75,30" fill="none" stroke="#2a1830" strokeWidth="1.5" />
          <path d="M15,42 Q50,48 75,42" fill="none" stroke="#2a1830" strokeWidth="1.5" />
          <path d="M15,54 Q50,60 75,54" fill="none" stroke="#2a1830" strokeWidth="1.5" />
          <path d="M15,66 Q50,72 75,66" fill="none" stroke="#2a1830" strokeWidth="1.5" />
          {/* Nozzle (points left toward furnace) */}
          <rect x="-12" y="34" width="20" height="12" rx="2" fill="#2a1830" stroke="#3a2840" strokeWidth="1" />
        </svg>
      </div>

      {/* Air puff particles */}
      <div
        className="forge-air-puff absolute"
        style={{
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 20,
          height: 20,
        }}
      >
        <svg viewBox="0 0 20 20" width="20" height="20">
          <circle cx="10" cy="10" r="6" fill="rgba(255,200,100,0.3)" />
          <circle cx="6" cy="8" r="3" fill="rgba(255,180,80,0.2)" />
          <circle cx="14" cy="12" r="3" fill="rgba(255,180,80,0.2)" />
        </svg>
      </div>
    </div>
  );
}

function LargeAnvil({ glowColor }: { glowColor: string }) {
  return (
    <div className="forge-wb-anvil-glow relative mx-auto" style={{ width: 220, height: 90 }}>
      <svg viewBox="0 0 220 90" width="220" height="90" className="block">
        {/* Base/feet */}
        <path
          d="M60,90 L50,72 L170,72 L160,90 Z"
          fill="url(#anvilBase)"
          stroke="#3a2840"
          strokeWidth="1"
        />
        {/* Main body */}
        <rect x="40" y="42" width="140" height="32" rx="4" fill="url(#anvilBody)" stroke="#3a2840" strokeWidth="1.5" />
        {/* Top face */}
        <rect x="30" y="28" width="120" height="16" rx="3" fill="url(#anvilTop)" stroke="#4a3850" strokeWidth="1" />
        {/* Horn (right) */}
        <path
          d="M150,36 L200,32 Q210,36 200,40 L150,44 Z"
          fill="url(#anvilHorn)"
          stroke="#3a2840"
          strokeWidth="1"
        />
        {/* Heel (left) */}
        <path
          d="M30,34 L12,30 Q6,36 12,42 L30,38 Z"
          fill="url(#anvilHorn)"
          stroke="#3a2840"
          strokeWidth="1"
        />
        {/* Top surface highlight */}
        <rect x="34" y="29" width="112" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        {/* Impact mark */}
        <circle cx="90" cy="36" r="6" fill="none" stroke="rgba(255,140,40,0.15)" strokeWidth="1" />
        <circle cx="90" cy="36" r="2" fill="rgba(255,140,40,0.1)" />

        <defs>
          <linearGradient id="anvilBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2030" />
            <stop offset="100%" stopColor="#15101a" />
          </linearGradient>
          <linearGradient id="anvilBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2840" />
            <stop offset="100%" stopColor="#1a1020" />
          </linearGradient>
          <linearGradient id="anvilTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3850" />
            <stop offset="50%" stopColor="#3a2840" />
            <stop offset="100%" stopColor="#2a1830" />
          </linearGradient>
          <linearGradient id="anvilHorn" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a2840" />
            <stop offset="100%" stopColor="#1a0f20" />
          </linearGradient>
        </defs>
      </svg>

      {/* Underglow */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 180,
          height: 20,
          background: `radial-gradient(ellipse, ${glowColor}30, transparent 70%)`,
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */

export function CraftingWorkbench({
  recipe,
  materials,
  seals,
  isCrafting,
  onCraft,
}: CraftingWorkbenchProps) {
  const [filledSlots, setFilledSlots] = useState<boolean[]>(
    () => recipe.slots.map(() => false)
  );
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  // Reset slots when recipe changes
  useEffect(() => {
    setFilledSlots(recipe.slots.map(() => false));
  }, [recipe.id]);

  const rarityInfo = EQUIPMENT_RARITY_INFO[recipe.rarity];
  const allFilled = filledSlots.every(Boolean);

  function handleSlotClick(index: number) {
    if (filledSlots[index]) return;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 py-6"
    >
      {/* Recipe header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-3xl">{recipe.icon}</span>
        <div className="text-center">
          <h3
            className="text-lg font-bold"
            style={{ color: rarityInfo.color, textShadow: `0 0 12px ${rarityInfo.color}40` }}
          >
            {recipe.name}
          </h3>
          <p className="text-xs text-text-muted">{recipe.effect}</p>
        </div>
      </div>

      {/* Furnace + Bellows row */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Furnace />
        <Bellows />
      </div>

      {/* Large Anvil */}
      <div className="mb-8">
        <LargeAnvil glowColor={rarityInfo.color} />
      </div>

      {/* Ingredient slots — horizontal row */}
      <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
        {recipe.slots.map((slot, i) => {
          const isFilled = filledSlots[i];
          const tierColor = TIER_COLORS[slot.tier as keyof typeof TIER_COLORS] ?? "#8b7aaa";

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => handleSlotClick(i)}
              disabled={isFilled || isCrafting}
              className={cn(
                "w-[72px] h-[72px] rounded-xl flex flex-col items-center justify-center transition-all",
                "border-2 shrink-0",
                isFilled
                  ? "bg-green-500/10 border-green-500/40"
                  : "bg-white/[0.03] border-dashed border-white/10 hover:border-white/25 hover:bg-white/5 cursor-pointer"
              )}
              style={
                isFilled
                  ? undefined
                  : ({
                      animation: "pulse-glow 2s ease-in-out infinite",
                      "--glow-rgb": "255 140 40",
                    } as React.CSSProperties)
              }
            >
              {isFilled ? (
                <>
                  <Check className="w-5 h-5 text-green-400 mb-1" />
                  <span className="text-[9px] text-green-400 font-bold truncate w-full text-center px-1 leading-tight">
                    {slot.label.split(" ").slice(1).join(" ") || slot.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg mb-0.5">
                    {slot.type === "seal" ? "\u{1F52E}" : "\u26CF\uFE0F"}
                  </span>
                  <span
                    className="text-[9px] font-medium truncate w-full text-center px-1 leading-tight"
                    style={{ color: tierColor }}
                  >
                    {slot.label}
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center max-w-sm mx-auto">
        <button
          onClick={handleReset}
          disabled={isCrafting || filledSlots.every((v) => !v)}
          className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white/5 text-text-secondary hover:bg-white/10 transition-all disabled:opacity-30 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={() => onCraft(recipe)}
          disabled={!allFilled || isCrafting}
          className={cn(
            "flex-1 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
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
    </motion.div>
  );
}
