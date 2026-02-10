"use client";

import { useState, useEffect, useCallback } from "react";
import type { MaterialTier, MaterialCategory } from "@/types/game";

// ─── Display Types ────────────────────────────────────────────────────

export interface BattleHero {
  id: string;
  name: string;
  profession: string;
  level: number;
}

export interface BattleLootDrop {
  name: string;
  icon: string;
  tier: MaterialTier;
  qty: number;
}

export interface BattleRoll {
  enemyName: string;
  isBoss: boolean;
  d20Roll: number;
  drops: BattleLootDrop[];
  gold: number;
}

export interface BattleXpEntry {
  heroId: string;
  name: string;
  xpEarned: number;
  xpBefore: number;
  xpNeeded: number;
  leveledUp: boolean;
  newLevel: number;
}

export interface BattleMaterialOption {
  id: string;
  name: string;
  icon: string;
  tier: MaterialTier;
  category: MaterialCategory;
}

export interface BattleResultsProps {
  encounterName: string;
  encounterSummary: string;
  turnCount: number;
  heroes: BattleHero[];
  rolls: BattleRoll[];
  xpData: BattleXpEntry[];
  materials?: BattleMaterialOption[];
  onConfirm?: () => void;
  onGmGrant?: (heroId: string, materialId: string, qty: number, gold: number) => void;
}

// ─── Tier Colors (with bg/text/border variants for display) ──────────

const DISPLAY_TIER_COLORS: Record<MaterialTier, { bg: string; text: string; border: string }> = {
  common:    { bg: "bg-green-900/60",  text: "text-green-400",  border: "border-green-600" },
  uncommon:  { bg: "bg-blue-900/60",   text: "text-blue-400",   border: "border-blue-500" },
  rare:      { bg: "bg-yellow-900/60", text: "text-yellow-300", border: "border-yellow-500" },
  epic:      { bg: "bg-purple-900/60", text: "text-purple-400", border: "border-purple-500" },
  legendary: { bg: "bg-red-900/60",    text: "text-red-400",    border: "border-red-500" },
};

// ─── Dice Roll Component ──────────────────────────────────────────────

function DiceRoll({
  value,
  isRolling,
  isCrit,
  isBoss,
}: {
  value: number;
  isRolling: boolean;
  isCrit: boolean;
  isBoss: boolean;
}) {
  return (
    <div
      className={`w-11 h-11 rounded-lg flex items-center justify-center font-display text-sm font-black shrink-0 transition-all duration-300 border-2 ${
        isCrit
          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.6)]"
          : isBoss
          ? "bg-purple-700 border-purple-500 text-white"
          : "bg-bg-input border-border-card text-white"
      }`}
      style={{
        transform: isRolling ? "rotate(720deg) scale(0.5)" : "rotate(0deg) scale(1)",
        opacity: isRolling ? 0 : 1,
      }}
    >
      {isRolling ? "?" : value}
    </div>
  );
}

// ─── XP Bar Component ─────────────────────────────────────────────────

function XpBar({
  name,
  xpBefore,
  xpEarned,
  xpNeeded,
  leveledUp,
  newLevel,
  animate,
}: {
  name: string;
  xpBefore: number;
  xpEarned: number;
  xpNeeded: number;
  leveledUp: boolean;
  newLevel: number;
  animate: boolean;
}) {
  const prevPct = Math.min((xpBefore / xpNeeded) * 100, 100);
  const newPct = Math.min(((xpBefore + xpEarned) / xpNeeded) * 100, 100);
  const currentPct = animate ? newPct : prevPct;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-accent-gold font-bold text-sm">{name}</span>
        <span className="text-text-secondary text-xs">
          +{xpEarned} XP
          {leveledUp && (
            <span
              className="ml-2 text-accent-gold bg-accent-gold/15 px-2 py-0.5 rounded text-[11px] font-bold inline-block"
              style={{ animation: animate ? "level-pulse 0.6s ease" : "none" }}
            >
              LEVEL {newLevel}!
            </span>
          )}
        </span>
      </div>
      <div className="h-3 bg-bg-page rounded-md overflow-hidden border border-border-card">
        <div
          className="h-full rounded-md transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: `${currentPct}%`,
            background:
              leveledUp && animate
                ? "linear-gradient(90deg, #2ecc71, #ffd700)"
                : "linear-gradient(90deg, #1d4ed8, #3b82f6)",
            boxShadow: animate ? "0 0 8px rgba(59,130,246,0.5)" : "none",
          }}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-text-dim text-[10px]">
          {xpBefore + xpEarned} / {xpNeeded}
        </span>
      </div>
    </div>
  );
}

// ─── Loot Drop Item ───────────────────────────────────────────────────

function LootItem({
  icon,
  name,
  qty,
  tier,
  animate,
  delay,
}: {
  icon: string;
  name: string;
  qty: number;
  tier: MaterialTier;
  animate: boolean;
  delay: number;
}) {
  const colors = DISPLAY_TIER_COLORS[tier] || DISPLAY_TIER_COLORS.common;

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${colors.bg} border ${colors.border} rounded-md px-2.5 py-1 text-xs ${colors.text} font-semibold transition-all duration-400`}
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(8px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span>{icon}</span>
      <span>{name}</span>
      <span className="opacity-70">&times;{qty}</span>
    </div>
  );
}

// ─── Enemy Roll Row ───────────────────────────────────────────────────

function EnemyRollRow({
  roll,
  index,
  revealed,
  onReveal,
}: {
  roll: BattleRoll;
  index: number;
  revealed: boolean;
  onReveal: (index: number) => void;
}) {
  const isCrit = roll.d20Roll === 20;

  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1.5 transition-all duration-300 ${
        revealed
          ? "bg-bg-page/60"
          : "bg-bg-page/30 cursor-pointer hover:bg-bg-page/50"
      } ${isCrit && revealed ? "border border-yellow-500/30" : "border border-transparent"}`}
      onClick={() => !revealed && onReveal(index)}
    >
      <DiceRoll value={roll.d20Roll} isRolling={!revealed} isCrit={isCrit} isBoss={roll.isBoss} />

      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-1.5 ${revealed ? "mb-1.5" : ""}`}>
          <span className="text-text-primary text-[13px] font-semibold">
            {roll.enemyName}
          </span>
          {roll.isBoss && (
            <span className="text-[10px] bg-purple-700 text-purple-200 px-1.5 py-px rounded font-bold">
              BOSS
            </span>
          )}
          {isCrit && revealed && (
            <span className="text-[10px] bg-yellow-800 text-yellow-200 px-1.5 py-px rounded font-bold animate-crit-flash">
              NAT 20!
            </span>
          )}
          {!revealed && (
            <span className="text-text-dim text-[11px] ml-auto">tap to roll</span>
          )}
        </div>
        {revealed && (
          <div className="flex flex-wrap gap-1.5">
            {roll.drops.map((d, i) => (
              <LootItem key={i} icon={d.icon} name={d.name} qty={d.qty} tier={d.tier} animate={revealed} delay={i * 150} />
            ))}
            {roll.gold > 0 && (
              <LootItem icon="\uD83D\uDCB0" name="Gold" qty={roll.gold} tier="rare" animate={revealed} delay={roll.drops.length * 150} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Total Haul ───────────────────────────────────────────────────────

function TotalHaul({ rolls, show }: { rolls: BattleRoll[]; show: boolean }) {
  if (!show) return null;

  const totals = new Map<string, BattleLootDrop>();
  let totalGold = 0;

  for (const r of rolls) {
    for (const d of r.drops) {
      const existing = totals.get(d.name);
      if (existing) {
        existing.qty += d.qty;
      } else {
        totals.set(d.name, { ...d });
      }
    }
    totalGold += r.gold;
  }

  const items = Array.from(totals.values());

  return (
    <div className="bg-bg-page/80 border border-border-card rounded-xl p-4 mt-3 animate-slide-up">
      <div className="text-accent-gold font-bold text-[13px] mb-2.5">
        TOTAL HAUL
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <LootItem key={i} icon={item.icon} name={item.name} qty={item.qty} tier={item.tier} animate={true} delay={i * 100} />
        ))}
        {totalGold > 0 && (
          <LootItem icon="\uD83D\uDCB0" name="Gold" qty={totalGold} tier="rare" animate={true} delay={items.length * 100} />
        )}
      </div>
    </div>
  );
}

// ─── Loot Splitter ────────────────────────────────────────────────────

function LootSplitter({
  rolls,
  heroes,
  show,
  splitMode,
  onSplitModeChange,
}: {
  rolls: BattleRoll[];
  heroes: BattleHero[];
  show: boolean;
  splitMode: string;
  onSplitModeChange: (mode: string) => void;
}) {
  if (!show) return null;

  const totals = new Map<string, BattleLootDrop>();
  let totalGold = 0;
  for (const r of rolls) {
    for (const d of r.drops) {
      const existing = totals.get(d.name);
      if (existing) existing.qty += d.qty;
      else totals.set(d.name, { ...d });
    }
    totalGold += r.gold;
  }

  const items = Array.from(totals.values());

  const splits = heroes.map((h, hi) => {
    const myItems = items
      .map((item) => {
        const each = Math.floor(item.qty / heroes.length);
        const remainder = item.qty % heroes.length;
        return { ...item, qty: each + (hi < remainder ? 1 : 0) };
      })
      .filter((i) => i.qty > 0);

    const goldEach = Math.floor(totalGold / heroes.length);
    const goldRemainder = totalGold % heroes.length;

    return {
      hero: h,
      items: myItems,
      gold: goldEach + (hi < goldRemainder ? 1 : 0),
    };
  });

  return (
    <div className="bg-bg-page/80 border border-border-card rounded-xl p-4 mt-3 animate-slide-up">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-accent-gold font-bold text-[13px]">SPLIT LOOT</span>
        <div className="flex gap-1">
          {(["auto", "manual", "give-all"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onSplitModeChange(mode)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                splitMode === mode
                  ? "bg-accent-gold text-bg-page"
                  : "bg-bg-input text-text-secondary hover:text-white"
              }`}
            >
              {mode === "auto" ? "Auto" : mode === "manual" ? "Manual" : "Give All"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {splits.map((split, i) => (
          <div key={i} className="flex-1 bg-bg-page rounded-lg p-3 border border-border-card">
            <div className="text-accent-gold font-bold text-xs mb-2">{split.hero.name}</div>
            <div className="flex flex-col gap-1.5">
              {split.items.map((item, j) => (
                <LootItem key={j} icon={item.icon} name={item.name} qty={item.qty} tier={item.tier} animate={true} delay={j * 80} />
              ))}
              {split.gold > 0 && (
                <LootItem icon="\uD83D\uDCB0" name="Gold" qty={split.gold} tier="rare" animate={true} delay={split.items.length * 80} />
              )}
              {split.items.length === 0 && split.gold === 0 && (
                <span className="text-text-dim text-[11px]">Nothing yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Manual Grant ─────────────────────────────────────────────────────

function ManualGrant({
  heroes,
  materials,
  show,
  onClose,
}: {
  heroes: BattleHero[];
  materials: BattleMaterialOption[];
  show: boolean;
  onClose: () => void;
}) {
  const [selectedHero, setSelectedHero] = useState(heroes[0]?.id || "");
  const [goldAmount, setGoldAmount] = useState(0);

  if (!show) return null;

  return (
    <div className="bg-bg-page/95 border border-accent-gold rounded-xl p-4 mt-3 animate-slide-up">
      <div className="flex justify-between items-center mb-3">
        <span className="text-accent-gold font-bold text-[13px]">GM GRANT</span>
        <button onClick={onClose} className="text-text-secondary hover:text-white text-base leading-none">
          &times;
        </button>
      </div>

      {/* Hero Selector */}
      <div className="flex gap-1.5 mb-3">
        {heroes.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHero(h.id)}
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
              selectedHero === h.id
                ? "bg-accent-gold text-bg-page"
                : "bg-bg-input text-text-secondary hover:text-white"
            }`}
          >
            {h.name}
          </button>
        ))}
      </div>

      {/* Material Buttons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {materials.map((m, i) => {
          const colors = DISPLAY_TIER_COLORS[m.tier];
          return (
            <button
              key={i}
              className={`inline-flex items-center gap-1 ${colors.bg} border ${colors.border} rounded-md px-2.5 py-1 text-[11px] ${colors.text} font-semibold hover:opacity-80 transition-opacity`}
            >
              {m.icon} {m.name} <span className="opacity-50">+1</span>
            </button>
          );
        })}
      </div>

      {/* Gold Control */}
      <div className="flex items-center gap-2">
        <span className="text-text-primary text-xs">Gold:</span>
        <button
          onClick={() => setGoldAmount(Math.max(0, goldAmount - 1))}
          className="w-7 h-7 rounded bg-bg-input text-white text-sm hover:bg-bg-input/80 transition-colors"
        >
          -
        </button>
        <span className="text-accent-gold font-bold text-base min-w-6 text-center">{goldAmount}</span>
        <button
          onClick={() => setGoldAmount(goldAmount + 1)}
          className="w-7 h-7 rounded bg-bg-input text-white text-sm hover:bg-bg-input/80 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setGoldAmount(goldAmount + 5)}
          className="px-2 py-1 rounded bg-bg-input text-text-secondary text-[10px] hover:text-white transition-colors"
        >
          +5
        </button>
      </div>
    </div>
  );
}

// ─── Main: Battle Results ─────────────────────────────────────────────

export function BattleResults({
  encounterName,
  encounterSummary,
  turnCount,
  heroes,
  rolls,
  xpData,
  materials = [],
  onConfirm,
}: BattleResultsProps) {
  const [phase, setPhase] = useState<"intro" | "xp" | "rolls">("intro");
  const [revealedRolls, setRevealedRolls] = useState<Set<number>>(new Set());
  const [xpAnimated, setXpAnimated] = useState(false);
  const [splitMode, setSplitMode] = useState("auto");
  const [showManualGrant, setShowManualGrant] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const allRevealed = revealedRolls.size === rolls.length;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("xp"), 800);
    const t2 = setTimeout(() => setXpAnimated(true), 1200);
    const t3 = setTimeout(() => setPhase("rolls"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const revealRoll = useCallback((index: number) => {
    setRevealedRolls((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const revealAll = () => {
    const next = new Set<number>();
    rolls.forEach((_, i) => next.add(i));
    setRevealedRolls(next);
  };

  const handleConfirm = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    onConfirm?.();
  };

  const confettiColors = ["#ffd700", "#e74c3c", "#2ecc71", "#3b82f6", "#a855f7", "#ec4899"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-page via-bg-card to-bg-page font-body p-5 max-w-[640px] mx-auto relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute -top-2.5 w-2 h-2"
              style={{
                left: `${Math.random() * 100}%`,
                borderRadius: Math.random() > 0.5 ? "50%" : 0,
                background: confettiColors[i % confettiColors.length],
                animation: `confetti-fall ${1.5 + Math.random() * 2}s ease ${Math.random() * 0.5}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 animate-battle-slide-down">
        <div className="text-[28px] font-black text-accent-gold tracking-widest animate-banner-glow mb-1">
          BATTLE COMPLETE!
        </div>
        <div className="text-text-muted text-xs">
          {encounterSummary} &middot; {turnCount} turns
        </div>
      </div>

      {/* XP Section */}
      {(phase === "xp" || phase === "rolls") && (
        <div className="bg-bg-card/50 rounded-xl p-4 mb-4 border border-border-card animate-slide-up">
          <div className="text-text-secondary text-[11px] font-bold tracking-widest mb-3">
            XP EARNED
          </div>
          {xpData.map((xp) => (
            <XpBar key={xp.heroId} {...xp} animate={xpAnimated} />
          ))}
        </div>
      )}

      {/* Loot Rolls */}
      {phase === "rolls" && (
        <div className="bg-bg-card/50 rounded-xl p-4 mb-4 border border-border-card animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-[11px] font-bold tracking-widest">
              LOOT DROPS
            </span>
            {!allRevealed && (
              <button
                onClick={revealAll}
                className="px-3 py-1 text-[10px] font-bold rounded border border-border-card bg-bg-input text-text-secondary hover:text-white transition-colors"
              >
                Reveal All
              </button>
            )}
          </div>

          {rolls.map((roll, i) => (
            <EnemyRollRow
              key={i}
              roll={roll}
              index={i}
              revealed={revealedRolls.has(i)}
              onReveal={revealRoll}
            />
          ))}

          <TotalHaul rolls={rolls} show={allRevealed} />
        </div>
      )}

      {/* Loot Splitter */}
      {allRevealed && (
        <LootSplitter
          rolls={rolls}
          heroes={heroes}
          show={true}
          splitMode={splitMode}
          onSplitModeChange={setSplitMode}
        />
      )}

      {/* Manual Grant */}
      <ManualGrant
        heroes={heroes}
        materials={materials}
        show={showManualGrant}
        onClose={() => setShowManualGrant(false)}
      />

      {/* Bottom Actions */}
      {allRevealed && (
        <div className="flex gap-2.5 mt-4 animate-slide-up">
          <button
            onClick={() => setShowManualGrant(!showManualGrant)}
            className="flex-1 py-3 text-[13px] font-bold rounded-lg border border-accent-gold bg-transparent text-accent-gold hover:bg-accent-gold/10 transition-colors"
          >
            GM Grant
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] py-3 text-[13px] font-bold rounded-lg border-none text-white shadow-[0_4px_15px_rgba(46,204,113,0.3)] hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
            }}
          >
            Confirm & Save
          </button>
        </div>
      )}
    </div>
  );
}
