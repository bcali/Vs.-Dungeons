"use client";

import Link from "next/link";

export default function CharacterListPage() {
  return (
    <div className="min-h-screen p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-[#e5a91a]">
            LEGO QUEST — Heroes
          </h1>
        </div>
        <Link
          href="/config"
          className="text-zinc-400 hover:text-white text-sm"
        >
          ⚙ Config
        </Link>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {/* Hero 1 Placeholder */}
        <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-6">
          <div className="w-16 h-16 rounded-lg bg-[#0f3460] mb-4 flex items-center justify-center text-2xl">
            🧑
          </div>
          <h2 className="text-xl font-bold mb-1">Hero 1</h2>
          <p className="text-zinc-400 text-sm mb-3">No profession yet &bull; Level 1</p>
          <div className="space-y-2 mb-4">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>HP</span><span>9/9</span>
              </div>
              <div className="w-full h-2 bg-[#0f3460] rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>XP</span><span>0/10</span>
              </div>
              <div className="w-full h-2 bg-[#0f3460] rounded-full">
                <div className="h-full bg-[#e5a91a] rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          </div>
          <Link
            href="/character/hero-1"
            className="block text-center rounded-lg bg-[#0f3460] px-4 py-2 text-sm font-medium hover:bg-[#e94560] transition-colors"
          >
            View Sheet
          </Link>
        </div>

        {/* Hero 2 Placeholder */}
        <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-6">
          <div className="w-16 h-16 rounded-lg bg-[#0f3460] mb-4 flex items-center justify-center text-2xl">
            🧑
          </div>
          <h2 className="text-xl font-bold mb-1">Hero 2</h2>
          <p className="text-zinc-400 text-sm mb-3">No profession yet &bull; Level 1</p>
          <div className="space-y-2 mb-4">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>HP</span><span>9/9</span>
              </div>
              <div className="w-full h-2 bg-[#0f3460] rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>XP</span><span>0/10</span>
              </div>
              <div className="w-full h-2 bg-[#0f3460] rounded-full">
                <div className="h-full bg-[#e5a91a] rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          </div>
          <Link
            href="/character/hero-2"
            className="block text-center rounded-lg bg-[#0f3460] px-4 py-2 text-sm font-medium hover:bg-[#e94560] transition-colors"
          >
            View Sheet
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 max-w-4xl mx-auto">
        <button className="rounded-xl bg-[#0f3460] border border-[#e5a91a]/30 px-6 py-3 font-semibold hover:bg-[#e5a91a]/20 transition-colors">
          + Create Character
        </button>
        <Link
          href="/combat/setup"
          className="rounded-xl bg-[#e94560] px-6 py-3 font-semibold hover:bg-[#e94560]/80 transition-colors"
        >
          🎮 Start Combat
        </Link>
      </div>
    </div>
  );
}
