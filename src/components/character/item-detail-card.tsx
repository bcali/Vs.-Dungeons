"use client";

import { motion } from "motion/react";
import { X, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CharacterEquipmentItem, EquipmentSlot, Stats } from "@/types/game";
import { EQUIPMENT_SLOT_INFO, EQUIPMENT_RARITY_INFO, STAT_LABELS, STAT_KEYS } from "@/types/game";

interface ItemDetailCardProps {
  item: CharacterEquipmentItem;
  /** Currently equipped item in the same slot (for comparison) */
  comparisonItem?: CharacterEquipmentItem | null;
  onEquip?: () => void;
  onUnequip?: () => void;
  onSalvage?: () => void;
  onClose: () => void;
}

export function ItemDetailCard({
  item,
  comparisonItem,
  onEquip,
  onUnequip,
  onSalvage,
  onClose,
}: ItemDetailCardProps) {
  const rarityInfo = EQUIPMENT_RARITY_INFO[item.rarity];
  const slotInfo = EQUIPMENT_SLOT_INFO[item.slot];
  const isEquipped = item.equippedSlot !== null;

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
        className="w-full max-w-sm rounded-xl border backdrop-blur-md p-5"
        style={{
          background: "rgba(26, 10, 62, 0.95)",
          borderColor: rarityInfo.borderGlow,
          boxShadow: `0 0 30px ${rarityInfo.borderGlow}, 0 0 60px ${rarityInfo.borderGlow}`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <X className="w-3.5 h-3.5 text-text-muted" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border"
            style={{
              background: `${rarityInfo.color}15`,
              borderColor: `${rarityInfo.color}30`,
            }}
          >
            {slotInfo.icon}
          </div>
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: rarityInfo.color }}
            >
              {item.name}
            </h3>
            <p className="text-xs text-text-muted">
              Level {item.level} {slotInfo.name}
              {" \u2022 "}
              <span style={{ color: rarityInfo.color }}>{rarityInfo.name}</span>
            </p>
          </div>
        </div>

        {/* Stat bonuses */}
        <div className="space-y-1.5 mb-4">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            Stat Bonuses
          </p>
          {STAT_KEYS.map(key => {
            const val = item.statBonuses[key] ?? 0;
            if (val === 0 && (!comparisonItem || (comparisonItem.statBonuses[key] ?? 0) === 0)) return null;

            const compVal = comparisonItem ? (comparisonItem.statBonuses[key] ?? 0) : 0;
            const diff = val - compVal;

            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  {STAT_LABELS[key].name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    val > 0 ? "text-green-400" : "text-text-muted"
                  )}>
                    {val > 0 ? `+${val}` : "0"}
                  </span>
                  {comparisonItem && diff !== 0 && (
                    <span className={cn(
                      "flex items-center gap-0.5 text-[10px] font-medium",
                      diff > 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {diff > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                      {Math.abs(diff)}
                    </span>
                  )}
                  {comparisonItem && diff === 0 && val > 0 && (
                    <span className="flex items-center text-[10px] text-text-dim">
                      <Minus className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Special effect */}
        {item.specialEffect && (
          <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3 mb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{"\u2728"}</span>
              <span className="text-xs font-bold text-yellow-400">
                {item.specialEffect.name}
              </span>
            </div>
            <p className="text-xs text-yellow-300/70">
              {item.specialEffect.description}
            </p>
          </div>
        )}

        {/* Comparison label */}
        {comparisonItem && !isEquipped && (
          <p className="text-[10px] text-text-dim italic mb-3">
            Compared to: {comparisonItem.name}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isEquipped ? (
            <button
              onClick={onUnequip}
              className="flex-1 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white/5 text-text-secondary hover:bg-white/10 transition-all"
            >
              Unequip
            </button>
          ) : (
            <button
              onClick={onEquip}
              className="flex-1 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border-b-2 border-yellow-700 transition-all active:border-b-0 active:translate-y-0.5"
            >
              Equip
            </button>
          )}
          <button
            onClick={onSalvage}
            className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            Salvage
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
