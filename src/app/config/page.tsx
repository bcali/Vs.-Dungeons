"use client";

import Link from "next/link";

export default function ConfigPage() {
  return (
    <div className="min-h-screen p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-[#e5a91a]">
            ⚙ GAME CONFIGURATION
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg bg-[#0f3460] px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Reset Defaults
          </button>
          <button className="rounded-lg bg-[#e5a91a] text-[#1a1a2e] px-4 py-2 text-sm font-bold hover:bg-[#e5a91a]/80 transition-colors">
            Save
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-[#0f3460] pb-2">
        {["Stats", "Resources", "Combat", "Leveling", "Loot", "Abilities"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              i === 0
                ? "bg-[#16213e] text-[#e5a91a] border-b-2 border-[#e5a91a]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Tab Content */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-6">
          <h2 className="text-sm font-semibold text-[#e5a91a] mb-4 uppercase tracking-wider">Stat System</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Base Stat Value</span>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">-</button>
                  <span className="text-lg font-bold w-8 text-center">3</span>
                  <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Stat Cap</span>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">-</button>
                  <span className="text-lg font-bold w-8 text-center">15</span>
                  <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">HP Multiplier</span>
                <span className="text-sm text-zinc-300">CON x <span className="text-lg font-bold">3</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Mana Pool Formula</span>
                <span className="text-sm text-zinc-300">MNA x <span className="text-lg font-bold">15</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Base Movement</span>
                <span className="text-sm text-zinc-300"><span className="text-lg font-bold">6</span> studs</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs text-zinc-500 mb-3 uppercase">Stat Points Per Level</h3>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[1,1,1,1,2,1,1,2,1,2,1,2,1,1,2,1,1,2,1,3].map((pts, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0f3460]/50 rounded px-2 py-1">
                    <span className="text-zinc-500">Lv{i + 1}</span>
                    <span className="font-bold">{pts}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Total by Lv20: <span className="text-[#e5a91a] font-bold">25</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
