"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Compass, Swords, Shield, Heart, Zap, Plus, X, Search, Footprints,
} from "lucide-react";
import { fetchCampaign, fetchCharacters, fetchMonsters, fetchCharacterAbilities } from "@/lib/supabase/queries";
import { maxHp, maxSpellSlots, totalStats, getMov } from "@/lib/game/stats";
import { rollInitiative } from "@/lib/game/combat";
import { buildHeroCombatAbilities, buildMonsterSpecialAbilities } from "@/lib/game/combat-abilities";
import { useCombatStore } from "@/stores/combat-store";
import { Badge } from "@/components/ui/badge";
import { ExplorationBackground } from "@/components/ui/exploration-background";
import type { Character, Monster, Campaign, Profession, Ability } from "@/types/game";
import type { CombatParticipant } from "@/types/combat";

/* ── Animation helpers (matches quest briefing) ── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Profession color map ── */

const PROF_COLOR: Record<string, string> = {
  knight: "prof-knight",
  rogue: "prof-rogue",
  wizard: "prof-wizard",
  healer: "prof-healer",
  ranger: "prof-ranger",
  inventor: "prof-inventor",
};

const PROF_BORDER: Record<string, string> = {
  knight: "border-l-prof-knight",
  rogue: "border-l-prof-rogue",
  wizard: "border-l-prof-wizard",
  healer: "border-l-prof-healer",
  ranger: "border-l-prof-ranger",
  inventor: "border-l-prof-inventor",
};

/* ── Page ── */

export default function EncounterSetupPage() {
  const router = useRouter();
  const initCombat = useCombatStore((s) => s.initCombat);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [heroes, setHeroes] = useState<Character[]>([]);
  const [heroAbilities, setHeroAbilities] = useState<Record<string, Ability[]>>({});
  const [monsterLib, setMonsterLib] = useState<Monster[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<{ monster: Monster; count: number }[]>([]);
  const [encounterName, setEncounterName] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedHeroes, setExpandedHeroes] = useState<Set<string>>(new Set());

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

      // Fetch abilities for all heroes in parallel
      const abilityEntries = await Promise.all(
        chars.map(async (hero) => {
          const abilities = await fetchCharacterAbilities(hero.id);
          return [hero.id, abilities] as [string, Ability[]];
        })
      );
      setHeroAbilities(Object.fromEntries(abilityEntries));
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

  const toggleHeroExpand = (id: string) => {
    setExpandedHeroes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleStartCombat = async () => {
    const participants: CombatParticipant[] = [];

    const heroAbilitiesData = await Promise.all(
      heroes.map((hero) =>
        hero.profession
          ? buildHeroCombatAbilities(hero.id, hero.profession as Profession)
          : Promise.resolve([])
      )
    );

    for (let i = 0; i < heroes.length; i++) {
      const hero = heroes[i];
      const ts = totalStats(hero.stats, hero.gearBonus);
      const hp = maxHp(ts.tgh);
      const slotsMax = maxSpellSlots(hero.level);
      participants.push({
        id: crypto.randomUUID(),
        displayName: hero.heroName || "Hero",
        team: 'hero',
        characterId: hero.id,
        stats: ts,
        maxHp: hp,
        currentHp: hero.currentHp ?? hp,
        spellSlotsMax: slotsMax,
        spellSlotsUsed: hero.spellSlotsUsed ?? 0,
        mov: getMov(hero.profession as Profession),
        initiativeRoll: rollInitiative(ts.spd),
        isActive: true,
        isDefending: false,
        statusEffects: [],
        isBoss: false,
        abilities: heroAbilitiesData[i],
      });
    }

    for (const { monster, count } of selectedMonsters) {
      const specials = buildMonsterSpecialAbilities(monster.specialAbilities);
      for (let i = 0; i < count; i++) {
        participants.push({
          id: crypto.randomUUID(),
          displayName: count > 1 ? `${monster.name} ${i + 1}` : monster.name,
          team: 'enemy',
          monsterId: monster.id,
          stats: monster.stats,
          maxHp: monster.hp,
          currentHp: monster.hp,
          spellSlotsMax: 0,
          spellSlotsUsed: 0,
          mov: monster.mov ?? 3,
          initiativeRoll: rollInitiative(monster.stats.spd),
          isActive: true,
          isDefending: false,
          statusEffects: [],
          isBoss: monster.isBoss,
          specialAbilities: specials.length > 0 ? specials : undefined,
        });
      }
    }

    participants.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    const initiativeOrder = participants.map((p) => p.id);
    initCombat(encounterName || "Encounter", participants, initiativeOrder);
    router.push("/combat");
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ExplorationBackground className="fixed inset-0 z-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <span className="text-text-muted animate-pulse font-semibold">Loading encounter...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ExplorationBackground className="fixed inset-0 z-0" />

      <motion.div
        className="relative z-10 flex flex-col h-screen p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Top Banner ── */}
        <motion.div variants={fadeUp} className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/play" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              &larr; Back
            </Link>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartCombat}
              disabled={totalEnemies === 0 || heroes.length === 0}
              className="bg-lego-green hover:bg-green-600 text-white font-black px-6 py-2.5 rounded-lg border-b-4 border-green-800 shadow-xl active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
            >
              <Swords className="w-4 h-4" />
              Start Combat
            </motion.button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Swords className="w-4 h-4 text-accent-gold" />
              <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">New Encounter</span>
              <Swords className="w-4 h-4 text-accent-gold" />
            </div>
            <input
              type="text"
              placeholder="ENCOUNTER NAME"
              value={encounterName}
              onChange={(e) => setEncounterName(e.target.value)}
              className="bg-transparent text-center text-2xl md:text-3xl font-mono text-lego-yellow placeholder-lego-yellow/30 focus:outline-none w-full max-w-lg mx-auto tracking-wider"
              style={{ textShadow: "3px 3px 0px #000, 0px 0px 20px rgba(242, 205, 55, 0.4)" }}
            />
          </div>
        </motion.div>

        {/* ── Main 3-column layout ── */}
        <motion.div variants={fadeUp} className="flex-1 grid grid-cols-12 gap-3 min-h-0">

          {/* ── HEROES (left) ── */}
          <div className="col-span-4 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-accent-gold/70" />
              <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
                Heroes ({heroes.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {heroes.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  abilities={heroAbilities[hero.id] || []}
                  expanded={expandedHeroes.has(hero.id)}
                  onToggle={() => toggleHeroExpand(hero.id)}
                />
              ))}
              {heroes.length === 0 && (
                <div className="rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-6 text-center">
                  <p className="text-text-muted text-sm">No heroes in campaign.</p>
                  <Link href="/character" className="text-accent-gold hover:underline text-sm">Create some first</Link>
                </div>
              )}
            </div>
          </div>

          {/* ── ACTIVE ENEMY TEAM (middle) ── */}
          <div className="col-span-5 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-4 h-4 text-accent-red/70" />
              <h2 className="text-xs font-mono text-accent-red uppercase tracking-widest">
                Enemy Team ({totalEnemies})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedMonsters.length === 0 ? (
                <div className="rounded-xl bg-card-bg border border-card-border border-dashed backdrop-blur-md p-8 text-center">
                  <p className="text-text-muted text-sm italic">Add enemies from the Bestiary &rarr;</p>
                </div>
              ) : (
                selectedMonsters.map(({ monster, count }) => (
                  <EnemyCard
                    key={monster.id}
                    monster={monster}
                    count={count}
                    onAdd={() => addMonster(monster)}
                    onRemove={() => removeMonster(monster.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── MONSTER LIBRARY (right) ── */}
          <div className="col-span-3 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-text-muted" />
              <h2 className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                Bestiary
              </h2>
            </div>
            <div className="rounded-xl bg-bg-input/40 border border-card-border backdrop-blur-sm p-3 flex flex-col min-h-0 flex-1">
              {/* Search + filter */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg bg-bg-input border border-border-card pl-8 pr-3 py-1.5 text-xs text-white placeholder-text-muted"
                  />
                </div>
                <select
                  value={levelFilter ?? ""}
                  onChange={(e) => setLevelFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full rounded-lg bg-bg-input border border-border-card px-3 py-1.5 text-xs text-text-secondary"
                >
                  <option value="">All Levels</option>
                  {Array.from(new Set(monsterLib.map((m) => m.level))).sort((a, b) => a - b).map((l) => (
                    <option key={l} value={l}>Level {l}</option>
                  ))}
                </select>
              </div>

              {/* Monster list */}
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {filteredMonsters.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg bg-bg-input/60 px-3 py-2 group hover:bg-bg-input transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-text-primary truncate">{m.name}</span>
                        {m.isBoss && <Badge variant="points" className="text-[9px] px-1 py-0">BOSS</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <span>Lv{m.level}</span>
                        <span>HP:{m.hp}</span>
                        <span>DMG:{m.damage}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addMonster(m)}
                      className="w-7 h-7 rounded-full bg-accent-red/20 text-accent-red hover:bg-accent-red/40 flex items-center justify-center transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {filteredMonsters.length === 0 && (
                  <p className="text-text-muted text-xs text-center py-4">No monsters found</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom Start Button ── */}
        <motion.div variants={fadeUp} className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartCombat}
            disabled={totalEnemies === 0 || heroes.length === 0}
            className="w-full bg-lego-green hover:bg-green-600 text-white font-black text-lg px-8 py-4 rounded-lg border-b-6 border-green-800 shadow-xl active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
          >
            <Swords className="w-5 h-5" />
            Roll Initiative &amp; Start Combat
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Hero Card ── */

function HeroCard({ hero, abilities, expanded, onToggle }: {
  hero: Character;
  abilities: Ability[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const prof = (hero.profession || "knight") as Profession;
  const ts = totalStats(hero.stats, hero.gearBonus);
  const hp = maxHp(ts.tgh);
  const currentHp = hero.currentHp ?? hp;
  const hpPct = (currentHp / hp) * 100;
  const slots = maxSpellSlots(hero.level);
  const slotsUsed = hero.spellSlotsUsed ?? 0;
  const mov = getMov(prof);

  const hpColor = hpPct > 60 ? "bg-hp-high" : hpPct > 30 ? "bg-hp-mid" : "bg-hp-low";
  const borderClass = PROF_BORDER[prof] || "border-l-accent-gold";

  return (
    <div
      className={`rounded-xl bg-card-bg border border-card-border backdrop-blur-md p-4 border-l-4 ${borderClass} cursor-pointer hover:border-card-border/50 transition-colors`}
      onClick={onToggle}
    >
      {/* Name + Profession */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-bold text-sm text-text-primary">{hero.heroName || "Unnamed"}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Lv{hero.level} {hero.profession}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `color-mix(in srgb, var(--${PROF_COLOR[prof] || "accent-gold"}) 30%, transparent)` }}
        >
          {hero.level}
        </div>
      </div>

      {/* HP bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] mb-0.5">
          <span className="text-text-muted flex items-center gap-1"><Heart className="w-3 h-3 text-hp-high" /> HP</span>
          <span className="text-text-secondary">{currentHp}/{hp}</span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-input overflow-hidden">
          <div className={`h-full rounded-full ${hpColor} transition-all`} style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {(["str", "spd", "tgh", "smt"] as const).map((stat) => (
          <div key={stat} className="rounded-md bg-bg-input/80 px-1.5 py-1 text-center">
            <p className="text-[9px] text-text-muted uppercase">{stat}</p>
            <p className="text-xs font-bold text-text-primary">{ts[stat]}</p>
          </div>
        ))}
      </div>

      {/* Spell Slots + MOV */}
      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1 text-text-secondary">
          <Zap className="w-3 h-3 text-resource-mana" />
          {slots - slotsUsed}/{slots} slots
        </span>
        <span className="flex items-center gap-1 text-text-secondary">
          <Footprints className="w-3 h-3 text-text-muted" />
          MOV {mov}
        </span>
      </div>

      {/* Expandable Abilities */}
      {expanded && abilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-card-border space-y-1.5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Abilities</p>
          {abilities.map((ability) => (
            <div key={ability.id} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{ability.name}</span>
              {ability.slotCost > 0 && (
                <Badge variant="cc" className="text-[9px] px-1.5 py-0">{ability.slotCost} slot</Badge>
              )}
            </div>
          ))}
        </div>
      )}
      {expanded && abilities.length === 0 && (
        <div className="mt-3 pt-3 border-t border-card-border">
          <p className="text-[10px] text-text-dim italic">No abilities learned yet</p>
        </div>
      )}
    </div>
  );
}

/* ── Enemy Card ── */

function EnemyCard({ monster, count, onAdd, onRemove }: {
  monster: Monster;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const specials = buildMonsterSpecialAbilities(monster.specialAbilities);

  return (
    <div className="rounded-xl bg-card-bg border border-accent-red/15 backdrop-blur-md p-4 border-l-4 border-l-accent-red/50 relative group">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-red/20 text-accent-red hover:bg-accent-red/40 flex items-center justify-center transition-colors opacity-60 group-hover:opacity-100"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Name + Count */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <p className="font-bold text-sm text-text-primary">{monster.name}</p>
        {monster.isBoss && <Badge variant="points" className="text-[9px] px-1.5 py-0">BOSS</Badge>}
        {count > 1 && (
          <span className="text-xs font-bold text-accent-red bg-accent-red/15 rounded-full px-2 py-0.5">
            &times;{count}
          </span>
        )}
      </div>

      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
        Level {monster.level} {monster.category || "Monster"}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {(["str", "spd", "tgh", "smt"] as const).map((stat) => (
          <div key={stat} className="rounded-md bg-bg-input/80 px-1.5 py-1 text-center">
            <p className="text-[9px] text-text-muted uppercase">{stat}</p>
            <p className="text-xs font-bold text-text-primary">{monster.stats[stat]}</p>
          </div>
        ))}
      </div>

      {/* HP, Damage, MOV, Range */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] mb-2">
        <span className="flex items-center gap-1 text-text-secondary">
          <Heart className="w-3 h-3 text-hp-high" /> HP {monster.hp}
        </span>
        <span className="flex items-center gap-1 text-text-secondary">
          <Swords className="w-3 h-3 text-accent-red" /> {monster.damage} {monster.damageType}
        </span>
        <span className="flex items-center gap-1 text-text-secondary">
          <Footprints className="w-3 h-3 text-text-muted" /> MOV {monster.mov ?? 3}
        </span>
        <span className="text-text-dim">{monster.attackRange}</span>
      </div>

      {/* Special Abilities */}
      {specials.length > 0 && (
        <div className="space-y-1">
          {specials.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <Badge variant="debuff" className="text-[9px] px-1.5 py-0 shrink-0 mt-0.5">{s.name}</Badge>
              <span className="text-[10px] text-text-dim leading-tight">{s.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* +/- controls */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-card-border">
        <button
          onClick={onRemove}
          className="w-6 h-6 rounded bg-bg-input text-text-secondary hover:text-white text-xs flex items-center justify-center transition-colors"
        >
          -
        </button>
        <span className="text-sm font-bold text-text-primary w-6 text-center">{count}</span>
        <button
          onClick={onAdd}
          className="w-6 h-6 rounded bg-bg-input text-text-secondary hover:text-white text-xs flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
