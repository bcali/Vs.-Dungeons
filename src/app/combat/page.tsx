"use client";

import Link from "next/link";

export default function CombatTrackerPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">
            ← Home
          </Link>
          <h1 className="text-xl font-bold">
            <span className="text-[#e94560]">⚔ COMBAT</span>
            <span className="text-zinc-400 ml-2">— No Active Encounter</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-zinc-500">Round 1</span>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-500 text-lg">No combat in progress</p>
        <Link
          href="/combat/setup"
          className="rounded-xl bg-[#e94560] px-8 py-4 text-lg font-bold hover:bg-[#e94560]/80 transition-colors"
        >
          ⚔ Set Up New Encounter
        </Link>
      </div>

      {/* Voice Input Bar (placeholder) */}
      <div className="mt-4 rounded-xl bg-[#16213e] border border-[#0f3460] p-4 flex items-center justify-center gap-4">
        <button className="w-14 h-14 rounded-full bg-[#e94560] flex items-center justify-center text-2xl hover:bg-[#e94560]/80 transition-colors">
          🎤
        </button>
        <span className="text-zinc-500 text-sm">Tap to speak an action</span>
        <button className="rounded-lg bg-[#0f3460] px-3 py-2 text-xs text-zinc-400 hover:text-white">
          📝 Type Instead
        </button>
      </div>
    </div>
  );
}
