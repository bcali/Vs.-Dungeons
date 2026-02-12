"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIER_COLORS, CATEGORY_ICONS } from "@/types/game";
import type { CharacterMaterial, CharacterSeals } from "@/types/game";
import type { ForgeSlot } from "@/data/forge-recipes";

interface MaterialPickerProps {
  slot: ForgeSlot;
  materials: CharacterMaterial[];
  seals: CharacterSeals | null;
  onSelect: (slotIndex: number) => void;
  onClose: () => void;
  slotIndex: number;
}

export function MaterialPicker({
  slot,
  materials,
  seals,
  onSelect,
  onClose,
  slotIndex,
}: MaterialPickerProps) {
  const tierColor = TIER_COLORS[slot.tier as keyof typeof TIER_COLORS] ?? '#8b7aaa';

  if (slot.type === 'seal') {
    const owned = seals?.[slot.tier as keyof CharacterSeals] ?? 0;
    const ownedNum = typeof owned === 'number' ? owned : 0;
    const hasEnough = ownedNum >= slot.quantity;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xs rounded-xl border border-white/10 backdrop-blur-md p-4"
          style={{ background: "rgba(26, 10, 62, 0.95)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
              Select Seal
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </div>

          <button
            onClick={() => hasEnough && onSelect(slotIndex)}
            disabled={!hasEnough}
            className={cn(
              "w-full flex items-center justify-between rounded-lg px-3 py-3 transition-all",
              hasEnough
                ? "bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                : "bg-white/[0.02] border border-white/[0.03] opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{"\u{1F52E}"}</span>
              <div>
                <p className="text-sm font-semibold capitalize" style={{ color: tierColor }}>
                  {slot.tier} Seal
                </p>
                <p className="text-[10px] text-text-muted">
                  Need {slot.quantity} &bull; Own {ownedNum}
                </p>
              </div>
            </div>
            {hasEnough ? (
              <span className="text-xs text-green-400 font-bold">{"\u2713"}</span>
            ) : (
              <span className="text-[10px] text-red-400">Not enough</span>
            )}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // Material type picker
  const matchingMaterials = materials.filter(m => m.tier === slot.tier);
  const totalOwned = matchingMaterials.reduce((s, m) => s + m.quantity, 0);
  const hasEnough = totalOwned >= slot.quantity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-xl border border-white/10 backdrop-blur-md p-4 max-h-[60vh] overflow-y-auto"
        style={{ background: "rgba(26, 10, 62, 0.95)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
            Select Material
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>

        <p className="text-[10px] text-text-muted mb-3">
          Need {slot.quantity}x <span className="capitalize" style={{ color: tierColor }}>{slot.tier}</span> material
        </p>

        {matchingMaterials.length === 0 ? (
          <p className="text-sm text-text-dim text-center py-4">
            No {slot.tier} materials in inventory.
          </p>
        ) : (
          <div className="space-y-1.5">
            {matchingMaterials.map((mat) => (
              <button
                key={mat.materialId}
                onClick={() => hasEnough && onSelect(slotIndex)}
                disabled={!hasEnough}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-3 py-2.5 transition-all",
                  hasEnough
                    ? "bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                    : "bg-white/[0.02] border border-white/[0.03] opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{mat.icon || CATEGORY_ICONS[mat.category]}</span>
                  <div className="text-left">
                    <p className="text-sm text-text-secondary">{mat.materialName}</p>
                    <p className="text-[10px] text-text-muted capitalize">{mat.tier} {mat.category.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: tierColor }}>
                  x{mat.quantity}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-[10px] text-text-dim">
          <span>Total owned: {totalOwned}</span>
          <span>Need: {slot.quantity}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
