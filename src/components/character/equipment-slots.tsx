"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { EquipmentSlot, CharacterEquipmentItem } from "@/types/game";
import { EQUIPMENT_SLOTS, EQUIPMENT_SLOT_INFO, EQUIPMENT_RARITY_INFO, STAT_LABELS } from "@/types/game";

interface EquipmentSlotsProps {
  equipped: Partial<Record<EquipmentSlot, CharacterEquipmentItem>>;
  onSlotClick: (slot: EquipmentSlot, item: CharacterEquipmentItem | null) => void;
}

export function EquipmentSlots({ equipped, onSlotClick }: EquipmentSlotsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {EQUIPMENT_SLOTS.map((slot, idx) => {
        const info = EQUIPMENT_SLOT_INFO[slot];
        const item = equipped[slot] ?? null;
        const rarityInfo = item ? EQUIPMENT_RARITY_INFO[item.rarity] : null;

        return (
          <motion.button
            key={slot}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSlotClick(slot, item)}
            className={cn(
              "relative rounded-lg p-3 text-left transition-all",
              "border backdrop-blur-sm",
              "hover:scale-[1.02] active:scale-[0.98]",
              item
                ? "bg-white/5 border-white/10 hover:border-white/20"
                : "bg-white/[0.02] border-dashed border-white/5 hover:border-white/15"
            )}
            style={item && rarityInfo ? {
              borderColor: rarityInfo.borderGlow,
              boxShadow: `0 0 12px ${rarityInfo.borderGlow}`,
            } : undefined}
          >
            {/* Slot icon + name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{info.icon}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                {info.name}
              </span>
            </div>

            {item ? (
              <>
                {/* Item name */}
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: rarityInfo?.color }}
                >
                  {item.name}
                </p>

                {/* Stat preview */}
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                  {(Object.entries(item.statBonuses) as [string, number][])
                    .filter(([, v]) => v > 0)
                    .map(([stat, val]) => (
                      <span
                        key={stat}
                        className="text-[10px] text-green-400 font-medium"
                      >
                        +{val} {STAT_LABELS[stat as keyof typeof STAT_LABELS]?.abbr}
                      </span>
                    ))}
                </div>

                {/* Special effect indicator */}
                {item.specialEffect && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[10px]">{"\u2728"}</span>
                    <span className="text-[9px] text-yellow-400 truncate">
                      {item.specialEffect.name}
                    </span>
                  </div>
                )}

                {/* Rarity badge */}
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: rarityInfo?.color }}
                />
              </>
            ) : (
              <p className="text-xs text-text-dim italic">Empty</p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
