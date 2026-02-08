"use client";

import Link from "next/link";

export default function EncounterSetupPage() {
  return (
    <div className="min-h-screen p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/combat" className="text-zinc-400 hover:text-white text-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-[#e94560]">
            ⚔ NEW ENCOUNTER
          </h1>
        </div>
        <button className="rounded-lg bg-[#e94560] px-6 py-2 font-bold hover:bg-[#e94560]/80 transition-colors">
          Start →
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Heroes */}
        <div>
          <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">
            Heroes (auto-loaded from campaign)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#16213e] border border-green-500/30 p-4 flex items-center gap-4">
              <span className="text-green-400">✅</span>
              <div>
                <p className="font-semibold">Hero 1</p>
                <p className="text-xs text-zinc-400">Level 1</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#16213e] border border-green-500/30 p-4 flex items-center gap-4">
              <span className="text-green-400">✅</span>
              <div>
                <p className="font-semibold">Hero 2</p>
                <p className="text-xs text-zinc-400">Level 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monster Library */}
        <div>
          <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">
            Enemies — Monster Library
          </h2>
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-4">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Search monsters..."
                className="flex-1 rounded-lg bg-[#0f3460] border border-[#0f3460] px-3 py-2 text-sm text-white placeholder-zinc-500"
              />
              <select className="rounded-lg bg-[#0f3460] border border-[#0f3460] px-3 py-2 text-sm text-zinc-400">
                <option>Level 1</option>
                <option>Level 5</option>
                <option>Level 10</option>
              </select>
            </div>
            <div className="space-y-2">
              {["Goblin Scout", "Skeleton", "Giant Rat", "Slime", "Bandit"].map((name) => (
                <div key={name} className="flex items-center justify-between rounded-lg bg-[#0f3460]/50 px-4 py-2">
                  <div>
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-zinc-500 ml-2">(Lv1)</span>
                  </div>
                  <button className="rounded bg-[#e94560]/20 text-[#e94560] px-3 py-1 text-xs font-medium hover:bg-[#e94560]/40 transition-colors">
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Encounter Roster */}
        <div>
          <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">
            Encounter (0 enemies)
          </h2>
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-4 text-center">
            <p className="text-zinc-500 text-sm italic">Add enemies from the library above</p>
          </div>
        </div>

        {/* Encounter Name + Start */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Encounter name (e.g., Forest Path Ambush)"
            className="flex-1 rounded-lg bg-[#16213e] border border-[#0f3460] px-4 py-3 text-sm text-white placeholder-zinc-500"
          />
          <button className="rounded-xl bg-[#e94560] px-6 py-3 font-bold hover:bg-[#e94560]/80 transition-colors whitespace-nowrap">
            🎲 Roll Initiative & Start Combat
          </button>
        </div>
      </div>
    </div>
  );
}
