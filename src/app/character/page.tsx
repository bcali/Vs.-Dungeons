"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { fetchCampaign, fetchCharacters, createCharacter, deleteCharacter } from "@/lib/supabase/queries";
import { maxHp, totalStat, xpForLevel } from "@/lib/game/stats";
import type { Character, Campaign, Profession } from "@/types/game";
import { PROFESSION_INFO } from "@/types/game";
import { GameProgressBar } from "@/components/ui/game-progress-bar";
import { GameBackground } from "@/components/ui/game-background";
import { HeroAvatar } from "@/components/character/hero-avatar";
import { cn } from "@/lib/utils";

const PROFESSION_COLOR: Record<string, string> = {
  knight:   "prof-knight",
  rogue:    "prof-rogue",
  wizard:   "prof-wizard",
  healer:   "prof-healer",
  ranger:   "prof-ranger",
  inventor: "prof-inventor",
};

const PROFESSION_EMOJI: Record<string, string> = {
  knight: "\u{1F6E1}",
  rogue: "\u{1F5E1}",
  wizard: "\u{1FA84}",
  healer: "\u2728",
  ranger: "\u{1F3F9}",
  inventor: "\u{1F527}",
};

const FLAVOR_TITLES: Record<string, Record<number, string>> = {
  knight:   { 1: "Squire of the Realm", 2: "Shield Bearer", 3: "Sworn Knight", 4: "Champion", 5: "Warlord" },
  rogue:    { 1: "Street Shadow", 2: "Cutpurse", 3: "Shadowblade", 4: "Phantom", 5: "Master Thief" },
  wizard:   { 1: "Spark Apprentice", 2: "Arcanist", 3: "Battlemage", 4: "Archmage", 5: "Grand Sorcerer" },
  healer:   { 1: "Acolyte of Light", 2: "Mender", 3: "Radiant Cleric", 4: "High Priest", 5: "Saint" },
  ranger:   { 1: "Trail Scout", 2: "Pathfinder", 3: "Warden", 4: "Beast Master", 5: "Wild Sovereign" },
  inventor: { 1: "Tinker Novice", 2: "Gadgeteer", 3: "Machinist", 4: "Artificer", 5: "Grand Engineer" },
};

function getFlavorTitle(profession: string | null, level: number): string {
  if (!profession) return "Adventurer";
  const titles = FLAVOR_TITLES[profession];
  if (!titles) return "Adventurer";
  const lvl = Math.min(level, 5);
  return titles[lvl] || titles[1] || "Adventurer";
}

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
    <div className="min-h-screen relative">
      <GameBackground className="fixed inset-0 z-0" />

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary hover:text-text-primary text-sm transition-colors">&larr; Home</Link>
            <h1 className="text-lg md:text-2xl text-text-title tracking-wide">YOUR HEROES</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-accent-gold/20 border border-accent-gold/40 px-5 py-2.5 font-semibold text-accent-gold hover:bg-accent-gold/30 transition-all active:scale-95"
          >
            + Create Hero
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-text-muted animate-pulse font-semibold">Loading heroes...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {characters.map((char, i) => (
                <div
                  key={char.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <HeroCard char={char} onDelete={() => load()} />
                </div>
              ))}
              {characters.length === 0 && (
                <div className="col-span-2 text-center py-16 rounded-xl border border-white/5 bg-card-bg backdrop-blur-md">
                  <p className="text-4xl mb-4">{"\u2694\uFE0F"}</p>
                  <p className="text-text-secondary text-lg font-semibold mb-2">No heroes yet</p>
                  <p className="text-text-muted text-sm">Create your first character to begin the adventure!</p>
                </div>
              )}
            </div>

            {characters.length > 0 && (
              <div className="flex justify-center">
                <Link
                  href="/combat/setup"
                  className="rounded-xl bg-accent-red px-10 py-4 font-black text-xl text-white hover:bg-accent-red/80 transition-all active:scale-95 animate-pulse-glow"
                  style={{ "--glow-rgb": "231 76 60" } as React.CSSProperties}
                >
                  {"\u2694\uFE0F"} Start Combat
                </Link>
              </div>
            )}
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
    </div>
  );
}

function HeroCard({ char, onDelete }: { char: Character; onDelete: () => void }) {
  const tTgh = totalStat(char.stats.tgh, char.gearBonus.tgh);
  const hp = maxHp(tTgh);
  const currentHp = char.currentHp ?? hp;
  const hpPct = Math.round((currentHp / hp) * 100);
  const nextXp = xpForLevel(char.level);
  const profKey = char.profession ?? "";
  const profInfo = char.profession ? PROFESSION_INFO[char.profession] : null;
  const emoji = PROFESSION_EMOJI[profKey] || "\u{1F9D1}";
  const colorToken = PROFESSION_COLOR[profKey] || "prof-knight";
  const flavorTitle = getFlavorTitle(char.profession, char.level);

  // Compute quick power summary
  const atk = totalStat(char.stats.str, char.gearBonus.str);
  const def = totalStat(char.stats.tgh, char.gearBonus.tgh) + 8;
  const spd = totalStat(char.stats.spd, char.gearBonus.spd);

  return (
    <div
      className={cn(
        "group rounded-xl p-5 backdrop-blur-md border transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg cursor-default"
      )}
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, var(--${colorToken}) 15%, transparent), rgba(13, 2, 33, 0.85))`,
        borderColor: `color-mix(in srgb, var(--${colorToken}) 30%, transparent)`,
        boxShadow: `0 0 20px color-mix(in srgb, var(--${colorToken}) 10%, transparent)`,
      }}
    >
      {/* Avatar area */}
      <div className="flex items-start gap-4 mb-4">
        <HeroAvatar profession={char.profession} level={char.level} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text-primary truncate">{char.heroName || "Unnamed Hero"}</h2>
          <p className="text-sm text-text-secondary">
            {emoji} {profInfo?.name ?? "No profession"} &bull; Lv.{char.level}
            {char.playerName && <span className="text-text-muted"> ({char.playerName})</span>}
          </p>
          <p className="text-xs text-accent-gold/60 italic mt-0.5">&ldquo;{flavorTitle}&rdquo;</p>
        </div>
      </div>

      {/* HP + XP bars */}
      <div className="space-y-2 mb-3">
        <GameProgressBar
          value={currentHp}
          max={hp}
          color={hpPct > 50 ? "bg-hp-high" : hpPct > 25 ? "bg-hp-mid" : "bg-hp-low"}
          height="sm"
          showLabel
          label="HP"
        />
        <GameProgressBar
          value={char.xp}
          max={nextXp === Infinity ? 1 : nextXp}
          color="bg-xp-bar"
          height="sm"
          showLabel
          label="XP"
        />
      </div>

      {/* Quick power summary */}
      <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
        <span>{"\u2694\uFE0F"} ATK: {atk}</span>
        <span>{"\u{1F6E1}\uFE0F"} DEF: {def}</span>
        <span>{"\u{1F3C3}"} SPD: {spd}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/character/${char.id}`}
          className="flex-1 text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
          style={{
            background: `color-mix(in srgb, var(--${colorToken}) 20%, transparent)`,
          }}
        >
          View Sheet
        </Link>
        <button
          onClick={async () => { if (confirm(`Delete ${char.heroName || "this hero"}?`)) { await deleteCharacter(char.id); onDelete(); } }}
          className="rounded-lg bg-white/5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/30 transition-colors active:scale-95"
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
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!heroName.trim()) return;
    setSaving(true);
    setError(null);
    const result = await createCharacter(campaignId, heroName.trim(), playerName.trim(), profession, playerAge ? parseInt(playerAge) : undefined);
    setSaving(false);
    if (!result) {
      setError("Failed to create hero. Check the browser console for details.");
      return;
    }
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="rounded-xl border border-white/10 p-6 w-full max-w-md space-y-4 animate-slide-up"
        style={{ background: "linear-gradient(135deg, rgba(26, 10, 62, 0.95), rgba(13, 2, 33, 0.98))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-bold text-text-title">CREATE NEW HERO</h2>
        <div>
          <label className="text-xs text-text-secondary block mb-1">Hero Name *</label>
          <input type="text" value={heroName} onChange={(e) => setHeroName(e.target.value)} autoFocus
            className="w-full rounded-lg bg-bg-surface border border-white/10 px-3 py-2 text-sm text-text-primary placeholder-text-dim focus:border-accent-gold/50 focus:outline-none transition-colors" placeholder="Sir Bricksalot" />
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">Player Name</label>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
            className="w-full rounded-lg bg-bg-surface border border-white/10 px-3 py-2 text-sm text-text-primary placeholder-text-dim" placeholder="Player name" />
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">Profession</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PROFESSION_INFO) as Profession[]).map((p) => {
              const token = PROFESSION_COLOR[p];
              return (
                <button
                  key={p}
                  onClick={() => setProfession(p)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold transition-all active:scale-95",
                    profession === p
                      ? "text-white border"
                      : "bg-white/5 text-text-secondary hover:text-text-primary"
                  )}
                  style={profession === p ? {
                    background: `color-mix(in srgb, var(--${token}) 30%, transparent)`,
                    borderColor: `color-mix(in srgb, var(--${token}) 50%, transparent)`,
                  } : undefined}
                >
                  {PROFESSION_INFO[p].name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-1">{PROFESSION_INFO[profession].role} &mdash; {PROFESSION_INFO[profession].bestStats}</p>
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">Player Age (optional)</label>
          <input type="number" value={playerAge} onChange={(e) => setPlayerAge(e.target.value)}
            className="w-full rounded-lg bg-bg-surface border border-white/10 px-3 py-2 text-sm text-text-primary placeholder-text-dim" placeholder="7" />
        </div>
        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors active:scale-95">Cancel</button>
          <button onClick={handleCreate} disabled={saving || !heroName.trim()}
            className="flex-1 rounded-lg bg-accent-gold text-bg-page px-4 py-2.5 text-sm font-bold hover:bg-accent-gold/80 transition-all active:scale-95 disabled:opacity-50">
            {saving ? "Creating..." : "Create Hero"}
          </button>
        </div>
      </div>
    </div>
  );
}
