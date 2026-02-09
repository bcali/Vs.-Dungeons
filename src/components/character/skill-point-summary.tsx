"use client";

import { useState } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";

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
    <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Skill Points</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-bold ${available > 0 ? "text-[#e5a91a] animate-pulse" : "text-zinc-400"}`}>
                {available}
              </span>
              <span className="text-sm text-zinc-500">available</span>
            </div>
          </div>
          <div className="text-sm text-zinc-500">
            <span className="text-zinc-400">{spent}</span> spent / <span className="text-zinc-400">{characterLevel}</span> total
          </div>
        </div>

        {spent > 0 && (
          <div>
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Reset all {spent} points?</span>
                <button
                  onClick={handleRespec}
                  disabled={respeccing}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                >
                  {respeccing ? "..." : "Yes, Reset"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#0f3460] text-zinc-400 text-xs hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="px-3 py-1.5 rounded-lg bg-[#0f3460] text-zinc-400 text-xs font-medium hover:text-white transition-colors"
              >
                Respec
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full h-2 bg-[#0f3460] rounded-full">
        <div
          className="h-full bg-[#e5a91a] rounded-full transition-all"
          style={{ width: `${characterLevel > 0 ? (spent / characterLevel) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
