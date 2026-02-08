"use client";

import Link from "next/link";
import { use } from "react";
import { STAT_KEYS, STAT_LABELS } from "@/types/game";

export default function CharacterSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Placeholder data — will be loaded from Supabase
  const stats = { con: 3, str: 3, agi: 3, mna: 3, int: 3, lck: 3 };
  const unspentPoints = 1;

  return (
    <div className="min-h-screen p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/character" className="text-zinc-400 hover:text-white text-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">
            <span className="text-[#e5a91a]">Hero</span>
            <span className="text-zinc-400 ml-2">— Level 1</span>
          </h1>
        </div>
        <button className="rounded-lg bg-[#e5a91a] text-[#1a1a2e] px-4 py-2 text-sm font-bold hover:bg-[#e5a91a]/80 transition-colors">
          Save
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
        {/* Left Column — Identity + Stats + Combat */}
        <div className="col-span-2 space-y-6">
          {/* Identity */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">Identity</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Name</span>
                <span className="text-zinc-300 italic">TBD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Profession</span>
                <span className="text-zinc-300 italic">TBD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Rank</span>
                <span className="text-zinc-300">Starting Hero</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Gold</span>
                <span className="text-[#e5a91a]">8</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>XP</span><span>0 / 10</span>
                </div>
                <div className="w-full h-2 bg-[#0f3460] rounded-full">
                  <div className="h-full bg-[#e5a91a] rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#e5a91a] uppercase tracking-wider">Stats</h2>
              {unspentPoints > 0 && (
                <span className="text-xs bg-[#e5a91a]/20 text-[#e5a91a] px-2 py-1 rounded-full animate-pulse">
                  {unspentPoints} pts available
                </span>
              )}
            </div>
            <div className="space-y-3">
              {STAT_KEYS.map((key) => {
                const label = STAT_LABELS[key];
                const value = stats[key];
                const bonus = value - 3;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400 w-8">{label.abbr}</span>
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">
                        -
                      </button>
                      <span className="text-lg font-bold w-6 text-center">{value}</span>
                      <button className="w-7 h-7 rounded bg-[#0f3460] text-zinc-400 hover:text-white text-sm flex items-center justify-center">
                        +
                      </button>
                    </div>
                    <span className="text-xs text-zinc-500">
                      ({bonus >= 0 ? "+" : ""}{bonus})
                    </span>
                    <div className="flex-1 h-2 bg-[#0f3460] rounded-full">
                      <div
                        className="h-full bg-[#3b82f6] rounded-full transition-all"
                        style={{ width: `${(value / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">Combat</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>HP</span><span>9 / 9</span>
                </div>
                <div className="w-full h-3 bg-[#0f3460] rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Resource</span><span>TBD</span>
                </div>
                <div className="w-full h-3 bg-[#0f3460] rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <div>Movement: 6 studs</div>
                <div>Melee Dmg: 3</div>
                <div>Crit Range: 20</div>
                <div>Lucky Saves: 1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Abilities + Inventory + Seals */}
        <div className="col-span-3 space-y-6">
          {/* Abilities */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">Abilities</h2>
            <p className="text-zinc-500 text-sm italic">None yet — unlocks at Level 2</p>
          </div>

          {/* Inventory */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">Inventory</h2>
            <div className="text-sm text-zinc-400">
              <div className="flex justify-between py-1 border-b border-[#0f3460]">
                <span>Gold Coins</span>
                <span className="text-[#e5a91a]">8</span>
              </div>
              <p className="text-zinc-500 text-sm italic mt-2">Starting gear TBD</p>
            </div>
          </div>

          {/* Seals */}
          <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-5">
            <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">Seal Collection</h2>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 rounded bg-green-900/40 border border-green-500/30 flex items-center justify-center text-xs font-bold">0</div>
                <span className="text-xs text-zinc-500 mt-1 block">Common</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-xs font-bold">0</div>
                <span className="text-xs text-zinc-500 mt-1 block">Uncommon</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded bg-yellow-900/40 border border-yellow-500/30 flex items-center justify-center text-xs font-bold">0</div>
                <span className="text-xs text-zinc-500 mt-1 block">Rare</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-xs font-bold">0</div>
                <span className="text-xs text-zinc-500 mt-1 block">Epic</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded bg-red-900/40 border border-red-500/30 flex items-center justify-center text-xs font-bold">0</div>
                <span className="text-xs text-zinc-500 mt-1 block">Legendary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
