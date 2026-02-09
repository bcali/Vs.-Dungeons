"use client";

import Link from "next/link";
import { use, useEffect, useState, useCallback } from "react";
import { fetchCharacter, updateCharacter, fetchCharacterAbilities, fetchInventory, fetchSeals } from "@/lib/supabase/queries";
import { maxHp, maxResource, totalStats, statBonus, critRange, xpForLevel, rankForLevel } from "@/lib/game/stats";
import { STAT_KEYS, STAT_LABELS, PROFESSION_INFO, PROFESSION_CLASS } from "@/types/game";
import type { Character, Ability, InventoryItem, CharacterSeals, StatKey } from "@/types/game";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkillTreePanel } from "@/components/character/skill-tree-panel";
import { GameProgressBar } from "@/components/ui/game-progress-bar";

export default function CharacterSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [char, setChar] = useState<Character | null>(null);
  const [abilities, setAbilities] = useState<(Ability & { learnedAtLevel: number })[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [seals, setSeals] = useState<CharacterSeals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, ab, inv, s] = await Promise.all([
      fetchCharacter(id),
      fetchCharacterAbilities(id),
      fetchInventory(id),
      fetchSeals(id),
    ]);
    setChar(c);
    setAbilities(ab);
    setInventory(inv);
    setSeals(s);
    setLoading(false);
    setDirty(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatChange = (stat: StatKey, delta: number) => {
    if (!char) return;
    const newVal = char.stats[stat] + delta;
    if (newVal < 3 || newVal > 15) return;
    if (delta > 0 && char.unspentStatPoints <= 0) return;
    setChar({ ...char, stats: { ...char.stats, [stat]: newVal }, unspentStatPoints: char.unspentStatPoints - delta });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!char) return;
    setSaving(true);
    const ts = totalStats(char.stats, char.gearBonus);
    const hp = maxHp(ts.con);
    const mr = maxResource(char.resourceType, ts.mna);
    await updateCharacter(char.id, {
      stats: char.stats,
      unspentStatPoints: char.unspentStatPoints,
      currentHp: char.currentHp ?? hp,
      currentResource: char.currentResource ?? (char.resourceType === 'rage' ? 0 : mr),
    });
    setSaving(false);
    setDirty(false);
  };

  if (loading || !char) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <span className="text-text-muted animate-pulse">Loading character...</span>
      </div>
    );
  }

  const ts = totalStats(char.stats, char.gearBonus);
  const hp = maxHp(ts.con);
  const currentHp = char.currentHp ?? hp;
  const mr = maxResource(char.resourceType, ts.mna);
  const currentRes = char.currentResource ?? (char.resourceType === 'rage' ? 0 : mr);
  const crit = critRange(ts.lck);
  const nextXp = xpForLevel(char.level);
  const profInfo = char.profession ? PROFESSION_INFO[char.profession] : null;

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/character" className="text-text-secondary hover:text-white text-sm">&larr; Back</Link>
          <h1 className="text-2xl font-bold">
            <span className="text-accent-gold">{char.heroName || "Hero"}</span>
            <span className="text-text-secondary ml-2">&mdash; Level {char.level} {profInfo?.name ?? ""}</span>
          </h1>
        </div>
        <button onClick={handleSave} disabled={!dirty || saving}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${dirty ? 'bg-accent-gold text-bg-page hover:bg-accent-gold/80' : 'bg-bg-input text-text-muted cursor-default'}`}>
          {saving ? "Saving..." : dirty ? "Save" : "Saved"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
        <div className="col-span-2 space-y-6">
          {/* Identity */}
          <div className="rounded-xl bg-bg-card border border-border-card p-5">
            <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">Identity</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Name</span><span>{char.heroName || "TBD"}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Player</span><span>{char.playerName || "TBD"}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Profession</span><span>{profInfo?.name ?? "TBD"}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Rank</span><span>{rankForLevel(char.level)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Gold</span><span className="text-accent-gold">{char.gold}</span></div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1"><span>XP</span><span>{char.xp} / {nextXp === Infinity ? 'MAX' : nextXp}</span></div>
                <GameProgressBar value={nextXp === Infinity ? 100 : Math.round((char.xp / nextXp) * 100)} color="bg-xp-bar" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl bg-bg-card border border-border-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-accent-gold uppercase tracking-wider">Stats</h2>
              {char.unspentStatPoints > 0 && (
                <span className="text-xs bg-accent-gold/20 text-accent-gold px-2 py-1 rounded-full animate-pulse">{char.unspentStatPoints} pts available</span>
              )}
            </div>
            <div className="space-y-3">
              {STAT_KEYS.map((key) => {
                const label = STAT_LABELS[key];
                const baseVal = char.stats[key];
                const totalVal = ts[key];
                const bonus = statBonus(totalVal);
                const gearB = char.gearBonus[key];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-secondary w-8">{label.abbr}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStatChange(key, -1)} disabled={baseVal <= 3}
                        className="w-7 h-7 rounded bg-bg-input text-text-secondary hover:text-white text-sm flex items-center justify-center disabled:opacity-30">-</button>
                      <span className="text-lg font-bold w-6 text-center">{baseVal}</span>
                      <button onClick={() => handleStatChange(key, 1)} disabled={char.unspentStatPoints <= 0 || baseVal >= 15}
                        className="w-7 h-7 rounded bg-bg-input text-text-secondary hover:text-white text-sm flex items-center justify-center disabled:opacity-30">+</button>
                    </div>
                    {gearB > 0 && <span className="text-xs text-green-400">+{gearB}</span>}
                    <span className="text-xs text-text-muted">({bonus >= 0 ? "+" : ""}{bonus})</span>
                    <GameProgressBar value={totalVal} max={15} color="bg-stat-bar" className="flex-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="rounded-xl bg-bg-card border border-border-card p-5">
            <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">Combat</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1"><span>HP</span><span>{currentHp} / {hp}</span></div>
                <GameProgressBar
                  value={Math.round((currentHp / hp) * 100)}
                  color={currentHp / hp > 0.5 ? 'bg-hp-high' : currentHp / hp > 0.25 ? 'bg-hp-mid' : 'bg-hp-low'}
                  height="sm"
                />
              </div>
              {char.resourceType && (
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span className="capitalize">{char.resourceType}</span><span>{currentRes} / {mr}</span>
                  </div>
                  <GameProgressBar
                    value={mr > 0 ? Math.round((currentRes / mr) * 100) : 0}
                    color={char.resourceType === 'rage' ? 'bg-resource-rage' : char.resourceType === 'energy' ? 'bg-resource-energy' : 'bg-resource-mana'}
                    height="sm"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                <div>Movement: 6 studs</div>
                <div>Melee Dmg: {ts.str}</div>
                <div>Crit Range: {crit}+</div>
                <div>Lucky Saves: 1</div>
                <div>Melee Def: {ts.str + 8}</div>
                <div>Ranged Def: {ts.agi + 8}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <Tabs defaultValue="sheet">
            <TabsList className="bg-bg-card border border-border-card mb-4">
              <TabsTrigger value="sheet" className="data-[state=active]:bg-bg-input data-[state=active]:text-accent-gold">
                Sheet
              </TabsTrigger>
              {char.profession && PROFESSION_CLASS[char.profession] && (
                <TabsTrigger value="skills" className="data-[state=active]:bg-bg-input data-[state=active]:text-accent-gold">
                  Skills
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="sheet" className="space-y-6">
              {/* Abilities */}
              <div className="rounded-xl bg-bg-card border border-border-card p-5">
                <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">Abilities ({abilities.length})</h2>
                {abilities.length === 0 ? (
                  <p className="text-text-muted text-sm italic">No abilities learned yet</p>
                ) : (
                  <div className="space-y-2">
                    {abilities.map((ab) => (
                      <div key={ab.id} className="flex items-start justify-between rounded-lg bg-bg-input/50 px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{ab.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{ab.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className="text-xs text-text-secondary">Tier {ab.tier}</span>
                          {ab.resourceCost > 0 && <p className="text-xs text-text-muted">{ab.resourceCost} {ab.resourceType}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inventory */}
              <div className="rounded-xl bg-bg-card border border-border-card p-5">
                <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">Inventory</h2>
                <div className="text-sm text-text-secondary">
                  <div className="flex justify-between py-1 border-b border-border-card"><span>Gold Coins</span><span className="text-accent-gold">{char.gold}</span></div>
                  {inventory.map((item) => (
                    <div key={item.id} className="flex justify-between py-1 border-b border-border-card">
                      <span>{item.itemName} {item.equipped && <span className="text-green-400 text-xs">(E)</span>}</span>
                      <span className="text-text-muted">x{item.quantity}</span>
                    </div>
                  ))}
                  {inventory.length === 0 && <p className="text-text-muted text-sm italic mt-2">No items yet</p>}
                </div>
              </div>

              {/* Seals */}
              <div className="rounded-xl bg-bg-card border border-border-card p-5">
                <h2 className="text-sm font-semibold text-accent-gold mb-3 uppercase tracking-wider">Seal Collection</h2>
                <div className="flex gap-4 text-sm">
                  {[
                    { tier: 'Common', val: seals?.common ?? 0, bg: 'bg-green-900/40', border: 'border-green-500/30' },
                    { tier: 'Uncommon', val: seals?.uncommon ?? 0, bg: 'bg-blue-900/40', border: 'border-blue-500/30' },
                    { tier: 'Rare', val: seals?.rare ?? 0, bg: 'bg-yellow-900/40', border: 'border-yellow-500/30' },
                    { tier: 'Epic', val: seals?.epic ?? 0, bg: 'bg-purple-900/40', border: 'border-purple-500/30' },
                    { tier: 'Legendary', val: seals?.legendary ?? 0, bg: 'bg-red-900/40', border: 'border-red-500/30' },
                  ].map((s) => (
                    <div key={s.tier} className="text-center">
                      <div className={`w-8 h-8 rounded ${s.bg} border ${s.border} flex items-center justify-center text-xs font-bold`}>{s.val}</div>
                      <span className="text-xs text-text-muted mt-1 block">{s.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {char.profession && PROFESSION_CLASS[char.profession] && (
              <TabsContent value="skills">
                <SkillTreePanel characterId={char.id} profession={char.profession} level={char.level} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
