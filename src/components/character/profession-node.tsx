"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProfessionAbilityOption, ProfessionNodeState } from "@/types/game";

const CATEGORY_BADGE: Record<string, { label: string; color: string }> = {
  passive:       { label: 'Passive',  color: 'bg-green-500/20 text-green-400' },
  active:        { label: 'Active',   color: 'bg-red-500/20 text-red-400' },
  unique_recipe: { label: 'Recipe',   color: 'bg-yellow-500/20 text-yellow-400' },
  mixed:         { label: 'Mixed',    color: 'bg-purple-500/20 text-purple-400' },
};

interface ProfessionNodeProps {
  level: number;
  type: 'auto' | 'choice';
  state: ProfessionNodeState;
  options: ProfessionAbilityOption[];
  selectedOption?: number;
  professionColor: string;
  onSelect?: (optionIndex: number) => void;
}

export function ProfessionNode({
  level,
  type,
  state,
  options,
  selectedOption,
  professionColor,
  onSelect,
}: ProfessionNodeProps) {
  const [expanded, setExpanded] = useState(false);

  // Unlocked auto or already-chosen choice
  if (state === 'unlocked') {
    const chosen = type === 'auto' ? options[0] : options[selectedOption ?? 0];
    return (
      <div
        className="rounded-xl p-4 border transition-all"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${professionColor} 12%, transparent), rgba(26, 10, 62, 0.7))`,
          borderColor: `color-mix(in srgb, ${professionColor} 40%, transparent)`,
          boxShadow: `0 0 12px color-mix(in srgb, ${professionColor} 15%, transparent)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{chosen.icon}</span>
          <span className="text-sm font-bold text-text-primary">{chosen.name}</span>
          <CategoryBadge category={chosen.category} />
          <span className="ml-auto text-xs text-text-dim">Lv.{level}</span>
        </div>
        <p className="text-xs text-text-secondary italic mb-1">&ldquo;{chosen.description}&rdquo;</p>
        <p className="text-xs text-text-muted">{chosen.effect}</p>
      </div>
    );
  }

  // Available choice — interactive
  if (state === 'available' && type === 'choice') {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full rounded-xl p-4 border-2 text-left transition-all",
            "animate-pulse-glow"
          )}
          style={{
            background: "rgba(26, 10, 62, 0.8)",
            borderColor: "#ffd700",
            "--glow-rgb": "255 215 0",
          } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent-gold uppercase tracking-wider">Level {level} &mdash; Choose!</span>
            </div>
            <span className="text-accent-gold text-xs">{expanded ? '\u25B2' : '\u25BC'}</span>
          </div>
        </button>

        {expanded && (
          <div className="rounded-xl border border-accent-gold/30 bg-bg-card/90 backdrop-blur-md p-4 space-y-3 animate-slide-up">
            <p className="text-xs text-text-muted text-center uppercase tracking-wider">Choose your path</p>
            <div className="grid grid-cols-1 gap-3">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onSelect?.(i)}
                  className="rounded-lg p-4 border text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${professionColor} 8%, transparent), rgba(26, 10, 62, 0.8))`,
                    borderColor: `color-mix(in srgb, ${professionColor} 25%, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-sm font-bold text-text-primary">{opt.name}</span>
                    <CategoryBadge category={opt.category} />
                  </div>
                  <p className="text-xs text-text-secondary italic mb-1">&ldquo;{opt.description}&rdquo;</p>
                  <p className="text-xs text-text-muted">{opt.effect}</p>
                  <div className="mt-3 text-center">
                    <span
                      className="inline-block rounded-lg px-4 py-1.5 text-xs font-bold transition-colors"
                      style={{
                        background: `color-mix(in srgb, ${professionColor} 20%, transparent)`,
                        color: professionColor,
                      }}
                    >
                      SELECT
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-dim text-center">{'\u26A0\uFE0F'} This choice is permanent!</p>
          </div>
        )}
      </div>
    );
  }

  // Available auto — just shows as unlocked automatically
  if (state === 'available' && type === 'auto') {
    const auto = options[0];
    return (
      <div
        className="rounded-xl p-4 border transition-all"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${professionColor} 12%, transparent), rgba(26, 10, 62, 0.7))`,
          borderColor: `color-mix(in srgb, ${professionColor} 40%, transparent)`,
          boxShadow: `0 0 12px color-mix(in srgb, ${professionColor} 15%, transparent)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{auto.icon}</span>
          <span className="text-sm font-bold text-text-primary">{auto.name}</span>
          <CategoryBadge category={auto.category} />
          <span className="ml-auto text-xs text-accent-gold font-bold">NEW!</span>
        </div>
        <p className="text-xs text-text-secondary italic mb-1">&ldquo;{auto.description}&rdquo;</p>
        <p className="text-xs text-text-muted">{auto.effect}</p>
      </div>
    );
  }

  // Preview — semi-transparent
  if (state === 'preview') {
    return (
      <div className="rounded-xl p-4 border opacity-40 transition-all"
        style={{
          background: "rgba(26, 10, 62, 0.5)",
          borderColor: "rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-dim">{'\u{1F441}\uFE0F'} Lv.{level}</span>
          <span className="text-xs text-text-dim">&mdash;</span>
          {type === 'auto' ? (
            <span className="text-xs text-text-muted">{options[0].name}</span>
          ) : (
            <span className="text-xs text-text-muted">{options.map(o => o.name).join(' / ')}</span>
          )}
        </div>
      </div>
    );
  }

  // Locked
  return (
    <div className="rounded-xl p-3 border opacity-25 transition-all"
      style={{
        background: "rgba(26, 10, 62, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.04)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-dim">{'\u{1F512}'} Lv.{level}</span>
        {type === 'choice' ? (
          <span className="text-xs text-text-dim">Choice: ??? / ???</span>
        ) : (
          <span className="text-xs text-text-dim">Auto unlock</span>
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const badge = CATEGORY_BADGE[category] ?? CATEGORY_BADGE.passive;
  return (
    <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium", badge.color)}>
      {badge.label}
    </span>
  );
}
