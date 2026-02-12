"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EquipmentSlot, EquipmentRarity, CharacterEquipmentItem } from "@/types/game";
import {
  EQUIPMENT_SLOT_INFO,
  EQUIPMENT_RARITY_INFO,
  EQUIPMENT_SLOTS,
  STAT_LABELS,
} from "@/types/game";

type SortMode = "newest" | "rarity" | "level" | "slot";
const RARITY_ORDER: Record<EquipmentRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };

interface EquipmentStashProps {
  items: CharacterEquipmentItem[];
  onItemClick: (item: CharacterEquipmentItem) => void;
  onEquip: (item: CharacterEquipmentItem) => void;
}

export function EquipmentStash({ items, onItemClick, onEquip }: EquipmentStashProps) {
  const [filterSlot, setFilterSlot] = useState<EquipmentSlot | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  // Filter
  const filtered = filterSlot === "all"
    ? items
    : items.filter(i => i.slot === filterSlot);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortMode) {
      case "rarity":
        return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
      case "level":
        return b.level - a.level;
      case "slot":
        return EQUIPMENT_SLOTS.indexOf(a.slot) - EQUIPMENT_SLOTS.indexOf(b.slot);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-accent-gold/70" />
          <h3 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
            Loot Chest ({items.length})
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Slot filter */}
        <div className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-text-muted" />
          <button
            onClick={() => setFilterSlot("all")}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md transition-all",
              filterSlot === "all"
                ? "bg-accent-gold/20 text-accent-gold"
                : "bg-white/5 text-text-muted hover:text-text-secondary"
            )}
          >
            All
          </button>
          {EQUIPMENT_SLOTS.map(slot => {
            const count = items.filter(i => i.slot === slot).length;
            if (count === 0) return null;
            return (
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
                {EQUIPMENT_SLOT_INFO[slot].icon} {count}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="w-3 h-3 text-text-muted" />
          {(["newest", "rarity", "level", "slot"] as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-md transition-all capitalize",
                sortMode === mode
                  ? "bg-white/10 text-text-primary"
                  : "bg-white/5 text-text-muted hover:text-text-secondary"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-dim text-sm">
            {items.length === 0
              ? "Your loot chest is empty \u2014 craft some gear!"
              : "No items match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((item) => {
              const rarityInfo = EQUIPMENT_RARITY_INFO[item.rarity];
              const slotInfo = EQUIPMENT_SLOT_INFO[item.slot];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2.5 hover:bg-white/5 transition-all cursor-pointer group"
                  onClick={() => onItemClick(item)}
                >
                  {/* Slot icon */}
                  <span className="text-base shrink-0">{slotInfo.icon}</span>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: rarityInfo.color }}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-muted">
                        Lv.{item.level} {slotInfo.name}
                      </span>
                      <span className="text-[10px]" style={{ color: rarityInfo.color }}>
                        {rarityInfo.name}
                      </span>
                    </div>
                  </div>

                  {/* Stat preview */}
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    {(Object.entries(item.statBonuses) as [string, number][])
                      .filter(([, v]) => v > 0)
                      .slice(0, 2)
                      .map(([stat, val]) => (
                        <span
                          key={stat}
                          className="text-[10px] text-green-400 font-medium"
                        >
                          +{val} {STAT_LABELS[stat as keyof typeof STAT_LABELS]?.abbr}
                        </span>
                      ))}
                    {item.specialEffect && (
                      <span className="text-[9px] text-yellow-400">
                        {"\u2728"} {item.specialEffect.name}
                      </span>
                    )}
                  </div>

                  {/* Equip button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onEquip(item); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 transition-all"
                  >
                    Equip
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
