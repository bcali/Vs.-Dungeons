"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { fetchCampaign, fetchCharacters, createCharacter, deleteCharacter } from "@/lib/supabase/queries";
import { maxHp, totalStat, xpForLevel } from "@/lib/game/stats";
import type { Character, Campaign, Profession } from "@/types/game";
import { PROFESSION_INFO } from "@/types/game";

export default function CharacterListPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const c = await fetchCampaign();
    setCampaign(c);
    if (c) {
      const chars = await fetchCharacters(c.id);
      setCharacters(chars);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">&larr; Home</Link>
          <h1 className="text-3xl font-bold text-[#e5a91a]">LEGO QUEST &mdash; Heroes</h1>
        </div>
        <Link href="/config" className="text-zinc-400 hover:text-white text-sm">&#9881; Config</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="text-zinc-500 animate-pulse">Loading heroes...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {characters.map((char) => <HeroCard key={char.id} char={char} onDelete={() => load()} />)}
            {characters.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <p className="text-zinc-500 text-lg mb-4">No heroes yet. Create your first character!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-[#0f3460] border border-[#e5a91a]/30 px-6 py-3 font-semibold hover:bg-[#e5a91a]/20 transition-colors"
            >
              + Create Character
            </button>
            <Link href="/combat/setup" className="rounded-xl bg-[#e94560] px-6 py-3 font-semibold hover:bg-[#e94560]/80 transition-colors">
              Start Combat
            </Link>
          </div>
        </>
      )}

      {showCreate && campaign && (
        <CreateCharacterModal
          campaignId={campaign.id}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function HeroCard({ char, onDelete }: { char: Character; onDelete: () => void }) {
  const tCon = totalStat(char.stats.con, char.gearBonus.con);
  const hp = maxHp(tCon);
  const currentHp = char.currentHp ?? hp;
  const hpPct = Math.round((currentHp / hp) * 100);
  const nextXp = xpForLevel(char.level);
  const xpPct = nextXp === Infinity ? 100 : Math.round((char.xp / nextXp) * 100);
  const profInfo = char.profession ? PROFESSION_INFO[char.profession] : null;
  const emoji = char.profession === 'knight' ? '\u{1F6E1}' :
                char.profession === 'wizard' ? '\u{1FA84}' :
                char.profession === 'ranger' ? '\u{1F3F9}' :
                char.profession === 'healer' ? '\u2728' :
                char.profession === 'rogue'  ? '\u{1F5E1}' :
                char.profession === 'inventor' ? '\u{1F527}' : '\u{1F9D1}';

  return (
    <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-6">
      <div className="w-16 h-16 rounded-lg bg-[#0f3460] mb-4 flex items-center justify-center text-2xl">{emoji}</div>
      <h2 className="text-xl font-bold mb-1">{char.heroName || "Unnamed Hero"}</h2>
      <p className="text-zinc-400 text-sm mb-3">
        {profInfo?.name ?? "No profession"} &bull; Level {char.level}
        {char.playerName && <span className="text-zinc-500"> ({char.playerName})</span>}
      </p>
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1"><span>HP</span><span>{currentHp}/{hp}</span></div>
          <div className="w-full h-2 bg-[#0f3460] rounded-full">
            <div className={`h-full rounded-full transition-all ${hpPct > 50 ? 'bg-green-500' : hpPct > 25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${hpPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1"><span>XP</span><span>{char.xp}/{nextXp === Infinity ? 'MAX' : nextXp}</span></div>
          <div className="w-full h-2 bg-[#0f3460] rounded-full">
            <div className="h-full bg-[#e5a91a] rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/character/${char.id}`} className="flex-1 text-center rounded-lg bg-[#0f3460] px-4 py-2 text-sm font-medium hover:bg-[#e94560] transition-colors">
          View Sheet
        </Link>
        <button
          onClick={async () => { if (confirm(`Delete ${char.heroName || 'this hero'}?`)) { await deleteCharacter(char.id); onDelete(); } }}
          className="rounded-lg bg-[#0f3460] px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}

function CreateCharacterModal({ campaignId, onClose, onCreated }: { campaignId: string; onClose: () => void; onCreated: () => void }) {
  const [heroName, setHeroName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [profession, setProfession] = useState<Profession>("knight");
  const [playerAge, setPlayerAge] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!heroName.trim()) return;
    setSaving(true);
    await createCharacter(campaignId, heroName.trim(), playerName.trim(), profession, playerAge ? parseInt(playerAge) : undefined);
    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#e5a91a]">Create New Hero</h2>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Hero Name *</label>
          <input type="text" value={heroName} onChange={(e) => setHeroName(e.target.value)} autoFocus
            className="w-full rounded-lg bg-[#0f3460] border border-[#0f3460] px-3 py-2 text-sm text-white placeholder-zinc-500" placeholder="Sir Bricksalot" />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Player Name</label>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
            className="w-full rounded-lg bg-[#0f3460] border border-[#0f3460] px-3 py-2 text-sm text-white placeholder-zinc-500" placeholder="Player name" />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Profession</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PROFESSION_INFO) as Profession[]).map((p) => (
              <button key={p} onClick={() => setProfession(p)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${profession === p ? "bg-[#e5a91a] text-[#1a1a2e]" : "bg-[#0f3460] text-zinc-400 hover:text-white"}`}>
                {PROFESSION_INFO[p].name}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1">{PROFESSION_INFO[profession].role} &mdash; {PROFESSION_INFO[profession].bestStats}</p>
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Player Age (optional)</label>
          <input type="number" value={playerAge} onChange={(e) => setPlayerAge(e.target.value)}
            className="w-full rounded-lg bg-[#0f3460] border border-[#0f3460] px-3 py-2 text-sm text-white placeholder-zinc-500" placeholder="7" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 rounded-lg bg-[#0f3460] px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleCreate} disabled={saving || !heroName.trim()}
            className="flex-1 rounded-lg bg-[#e5a91a] text-[#1a1a2e] px-4 py-2 text-sm font-bold hover:bg-[#e5a91a]/80 transition-colors disabled:opacity-50">
            {saving ? "Creating..." : "Create Hero"}
          </button>
        </div>
      </div>
    </div>
  );
}
