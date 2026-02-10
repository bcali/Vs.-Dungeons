"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchCampaign, fetchCharacters, fetchMonsters } from "@/lib/supabase/queries";
import { maxHp, maxResource, totalStats } from "@/lib/game/stats";
import { rollInitiative } from "@/lib/game/combat";
import { useCombatStore } from "@/stores/combat-store";
import type { Character, Monster, Campaign } from "@/types/game";
import type { CombatParticipant } from "@/types/combat";
import { GameBackground } from "@/components/ui/game-background";

export default function EncounterSetupPage() {
  const router = useRouter();
  const initCombat = useCombatStore((s) => s.initCombat);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [heroes, setHeroes] = useState<Character[]>([]);
  const [monsterLib, setMonsterLib] = useState<Monster[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<{ monster: Monster; count: number }[]>([]);
  const [encounterName, setEncounterName] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const c = await fetchCampaign();
    setCampaign(c);
    if (c) {
      const [chars, monsters] = await Promise.all([
        fetchCharacters(c.id),
        fetchMonsters(),
      ]);
      setHeroes(chars);
      setMonsterLib(monsters);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addMonster = (m: Monster) => {
    setSelectedMonsters((prev) => {
      const existing = prev.find((e) => e.monster.id === m.id);
      if (existing) return prev.map((e) => e.monster.id === m.id ? { ...e, count: e.count + 1 } : e);
      return [...prev, { monster: m, count: 1 }];
    });
  };

  const removeMonster = (monsterId: string) => {
    setSelectedMonsters((prev) => {
      return prev.map((e) => e.monster.id === monsterId ? { ...e, count: e.count - 1 } : e).filter((e) => e.count > 0);
    });
  };

  const totalEnemies = selectedMonsters.reduce((s, e) => s + e.count, 0);

  const filteredMonsters = monsterLib.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (levelFilter !== null && m.level !== levelFilter) return false;
    return true;
  });

  const handleStartCombat = () => {
    const participants: CombatParticipant[] = [];

    // Build hero participants
    for (const hero of heroes) {
      const ts = totalStats(hero.stats, hero.gearBonus);
      const hp = maxHp(ts.con);
      const mr = maxResource(hero.resourceType, ts.mna);
      participants.push({
        id: crypto.randomUUID(),
        displayName: hero.heroName || "Hero",
        team: 'hero',
        characterId: hero.id,
        stats: ts,
        maxHp: hp,
        currentHp: hero.currentHp ?? hp,
        resourceType: hero.resourceType ?? undefined,
        maxResource: mr || undefined,
        currentResource: hero.currentResource ?? (hero.resourceType === 'rage' ? 0 : mr),
        initiativeRoll: rollInitiative(ts.agi),
        isActive: true,
        isDefending: false,
        statusEffects: [],
        isBoss: false,
      });
    }

    // Build monster participants
    for (const { monster, count } of selectedMonsters) {
      for (let i = 0; i < count; i++) {
        participants.push({
          id: crypto.randomUUID(),
          displayName: count > 1 ? `${monster.name} ${i + 1}` : monster.name,
          team: 'enemy',
          monsterId: monster.id,
          stats: monster.stats,
          maxHp: monster.hp,
          currentHp: monster.hp,
          resourceType: undefined,
          maxResource: undefined,
          currentResource: 0,
          initiativeRoll: rollInitiative(monster.stats.agi),
          isActive: true,
          isDefending: false,
          statusEffects: [],
          isBoss: monster.isBoss,
        });
      }
    }

    // Sort by initiative (descending)
    participants.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    const initiativeOrder = participants.map((p) => p.id);

    initCombat(encounterName || "Encounter", participants, initiativeOrder);
    router.push("/combat");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <span className="text-text-muted animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GameBackground className="fixed inset-0 z-0" />
      <div className="relative z-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/combat" className="text-text-secondary hover:text-text-primary text-sm transition-colors">&larr; Back</Link>
          <h1 className="text-base md:text-lg text-text-title tracking-wide">NEW ENCOUNTER</h1>
        </div>
        <button
          onClick={handleStartCombat}
          disabled={totalEnemies === 0 || heroes.length === 0}
          className="rounded-lg bg-accent-red px-6 py-2 font-bold hover:bg-accent-red/80 transition-colors disabled:opacity-40"
        >
          Start &rarr;
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Heroes */}
        <div>
          <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">
            Heroes ({heroes.length})
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {heroes.map((hero) => (
              <div key={hero.id} className="rounded-xl bg-bg-card border border-green-500/30 p-4 flex items-center gap-4">
                <span className="text-green-400">&#x2705;</span>
                <div>
                  <p className="font-semibold">{hero.heroName || "Unnamed"}</p>
                  <p className="text-xs text-text-secondary">Level {hero.level} {hero.profession}</p>
                </div>
              </div>
            ))}
            {heroes.length === 0 && (
              <div className="col-span-2 text-center py-4">
                <p className="text-text-muted text-sm">No heroes in campaign. <Link href="/character" className="text-accent-gold hover:underline">Create some first</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Monster Library */}
        <div>
          <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">
            Enemies &mdash; Monster Library
          </h2>
          <div className="rounded-xl bg-bg-card border border-border-card p-4">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Search monsters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-lg bg-bg-input border border-border-card px-3 py-2 text-sm text-white placeholder-text-muted"
              />
              <select
                value={levelFilter ?? ""}
                onChange={(e) => setLevelFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="rounded-lg bg-bg-input border border-border-card px-3 py-2 text-sm text-text-secondary"
              >
                <option value="">All Levels</option>
                {[1, 2, 3, 5, 7, 10].map((l) => (
                  <option key={l} value={l}>Level {l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredMonsters.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg bg-bg-input/50 px-4 py-2">
                  <div>
                    <span className="font-medium text-sm">{m.name}</span>
                    <span className="text-xs text-text-muted ml-2">(Lv{m.level})</span>
                    {m.isBoss && <span className="text-xs text-accent-gold ml-2">BOSS</span>}
                    <span className="text-xs text-text-dim ml-2">HP:{m.hp}</span>
                  </div>
                  <button
                    onClick={() => addMonster(m)}
                    className="rounded bg-accent-red/20 text-accent-red px-3 py-1 text-xs font-medium hover:bg-accent-red/40 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              ))}
              {filteredMonsters.length === 0 && (
                <p className="text-text-muted text-sm text-center py-4">No monsters found</p>
              )}
            </div>
          </div>
        </div>

        {/* Encounter Roster */}
        <div>
          <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">
            Encounter ({totalEnemies} enemies)
          </h2>
          <div className="rounded-xl bg-bg-card border border-border-card p-4">
            {selectedMonsters.length === 0 ? (
              <p className="text-text-muted text-sm italic text-center">Add enemies from the library above</p>
            ) : (
              <div className="space-y-2">
                {selectedMonsters.map(({ monster, count }) => (
                  <div key={monster.id} className="flex items-center justify-between rounded-lg bg-bg-input/50 px-4 py-2">
                    <div>
                      <span className="font-medium text-sm">{monster.name}</span>
                      <span className="text-xs text-text-muted ml-2">(Lv{monster.level})</span>
                      {monster.isBoss && <span className="text-xs text-accent-gold ml-2">BOSS</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeMonster(monster.id)} className="w-6 h-6 rounded bg-bg-input text-text-secondary hover:text-white text-xs flex items-center justify-center">-</button>
                      <span className="text-sm font-bold w-4 text-center">{count}</span>
                      <button onClick={() => addMonster(monster)} className="w-6 h-6 rounded bg-bg-input text-text-secondary hover:text-white text-xs flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Encounter Name + Start */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Encounter name (e.g., Forest Path Ambush)"
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="flex-1 rounded-lg bg-bg-card border border-border-card px-4 py-3 text-sm text-white placeholder-text-muted"
          />
          <button
            onClick={handleStartCombat}
            disabled={totalEnemies === 0 || heroes.length === 0}
            className="rounded-xl bg-accent-red px-6 py-3 font-bold hover:bg-accent-red/80 transition-colors whitespace-nowrap disabled:opacity-40"
          >
            Roll Initiative &amp; Start Combat
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
