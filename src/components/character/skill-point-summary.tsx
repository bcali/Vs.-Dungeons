"use client";

import { useState } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";
import { GameProgressBar } from "@/components/ui/game-progress-bar";

export function SkillPointSummary() {
  const { characterLevel, getSpentPoints, getAvailablePoints, respec } = useSkillTreeStore();
  const spent = getSpentPoints();
  const available = getAvailablePoints();
  const [confirming, setConfirming] = useState(false);
  const [respeccing, setRespeccing] = useState(false);

  const handleRespec = async () => {
    setRespeccing(true);
    await respec();
    setRespeccing(false);
    setConfirming(false);
  };

  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider">Skill Points</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-bold ${available > 0 ? "text-accent-gold animate-pulse" : "text-text-secondary"}`}>
                {available}
              </span>
              <span className="text-sm text-text-muted">available</span>
            </div>
          </div>
          <div className="text-sm text-text-muted">
            <span className="text-text-secondary">{spent}</span> spent / <span className="text-text-secondary">{characterLevel}</span> total
          </div>
        </div>

        {spent > 0 && (
          <div>
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Reset all {spent} points?</span>
                <button
                  onClick={handleRespec}
                  disabled={respeccing}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                >
                  {respeccing ? "..." : "Yes, Reset"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="px-3 py-1.5 rounded-lg bg-bg-input text-text-secondary text-xs hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="px-3 py-1.5 rounded-lg bg-bg-input text-text-secondary text-xs font-medium hover:text-white transition-colors"
              >
                Respec
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <GameProgressBar value={spent} max={characterLevel} color="bg-accent-gold" className="mt-3" />
    </div>
  );
}
