"use client";

import Link from "next/link";
import { use, useEffect, useState, useCallback } from "react";
import { fetchCharacter, updateCharacter, fetchCharacterAbilities, fetchInventory, fetchSeals, fetchCharacterMaterials } from "@/lib/supabase/queries";
import { maxHp, maxResource, totalStats, totalStat, statBonus, critRange, xpForLevel, rankForLevel } from "@/lib/game/stats";
import { STAT_KEYS, STAT_LABELS, PROFESSION_INFO, PROFESSION_CLASS } from "@/types/game";
import type { Character, Ability, InventoryItem, CharacterSeals, CharacterMaterial, StatKey } from "@/types/game";
import { TIER_COLORS, CATEGORY_ICONS } from "@/types/game";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SkillTreePanel } from "@/components/character/skill-tree-panel";
import { ProfessionTreePanel } from "@/components/character/profession-tree-panel";
import { GameProgressBar } from "@/components/ui/game-progress-bar";
import { GameBackground } from "@/components/ui/game-background";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HeroAvatar } from "@/components/character/hero-avatar";
import { cn } from "@/lib/utils";

const PROFESSION_COLOR: Record<string, string> = {
  knight: "prof-knight", rogue: "prof-rogue", wizard: "prof-wizard",
  healer: "prof-healer", ranger: "prof-ranger", inventor: "prof-inventor",
};

const PROFESSION_EMOJI: Record<string, string> = {
  knight: "\u{1F6E1}", rogue: "\u{1F5E1}", wizard: "\u{1FA84}",
  healer: "\u2728", ranger: "\u{1F3F9}", inventor: "\u{1F527}",
};

const FLAVOR_TITLES: Record<string, Record<number, string>> = {
  knight:   { 1: "Squire of the Realm", 2: "Shield Bearer", 3: "Sworn Knight", 4: "Champion", 5: "Warlord" },
  rogue:    { 1: "Street Shadow", 2: "Cutpurse", 3: "Shadowblade", 4: "Phantom", 5: "Master Thief" },
  wizard:   { 1: "Spark Apprentice", 2: "Arcanist", 3: "Battlemage", 4: "Archmage", 5: "Grand Sorcerer" },
  healer:   { 1: "Acolyte of Light", 2: "Mender", 3: "Radiant Cleric", 4: "High Priest", 5: "Saint" },
  ranger:   { 1: "Trail Scout", 2: "Pathfinder", 3: "Warden", 4: "Beast Master", 5: "Wild Sovereign" },
  inventor: { 1: "Tinker Novice", 2: "Gadgeteer", 3: "Machinist", 4: "Artificer", 5: "Grand Engineer" },
};

const UPCOMING_ABILITIES: Record<string, { name: string; desc: string; icon: string }[]> = {
  knight:   [{ name: "War Shout", desc: "Rally your allies!", icon: "\u2694\uFE0F" }, { name: "Shield Slam", desc: "Bash & stun!", icon: "\u{1F6E1}" }, { name: "Iron Stance", desc: "Take half damage!", icon: "\u{1FAA8}" }, { name: "Challenge", desc: "Force enemies to you!", icon: "\u{1F4E2}" }],
  rogue:    [{ name: "Backstab", desc: "Strike from the shadows!", icon: "\u{1F5E1}" }, { name: "Smoke Bomb", desc: "Vanish from sight!", icon: "\u{1F4A8}" }, { name: "Pickpocket", desc: "Steal an item!", icon: "\u{1F91E}" }, { name: "Evasion", desc: "Dodge everything!", icon: "\u{1F3C3}" }],
  wizard:   [{ name: "Fireball", desc: "Blast with flame!", icon: "\u{1F525}" }, { name: "Frost Shield", desc: "Protect with ice!", icon: "\u2744\uFE0F" }, { name: "Lightning Bolt", desc: "Strike with thunder!", icon: "\u26A1" }, { name: "Blink", desc: "Teleport away!", icon: "\u2728" }],
  healer:   [{ name: "Heal", desc: "Restore an ally!", icon: "\u{1F49A}" }, { name: "Bless", desc: "Boost an ally!", icon: "\u{1F31F}" }, { name: "Purify", desc: "Remove a debuff!", icon: "\u2728" }, { name: "Guardian Spirit", desc: "Prevent death!", icon: "\u{1F47C}" }],
  ranger:   [{ name: "Aimed Shot", desc: "Precise ranged attack!", icon: "\u{1F3F9}" }, { name: "Trap", desc: "Snare your foes!", icon: "\u{1FAA4}" }, { name: "Beast Bond", desc: "Call a companion!", icon: "\u{1F43A}" }, { name: "Nature's Camouflage", desc: "Hide in the wild!", icon: "\u{1F33F}" }],
  inventor: [{ name: "Deploy Turret", desc: "Build a turret!", icon: "\u{1F527}" }, { name: "Smoke Grenade", desc: "Obscure the field!", icon: "\u{1F4A3}" }, { name: "Repair Bot", desc: "Heal with tech!", icon: "\u{1F916}" }, { name: "Overcharge", desc: "Power up gadgets!", icon: "\u26A1" }],
};

const STAT_TIPS: Record<string, string> = {
  con: "How tough you are \u2014 more CON = more HP!",
  str: "How hard you hit \u2014 SMASH!",
  agi: "How quick you are \u2014 dodge & move!",
  mna: "Your magical power \u2014 fuel for spells!",
  int: "Your cleverness \u2014 better skills & crafting!",
  lck: "Your fortune \u2014 lucky crits & saves!",
};

export default function CharacterSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [char, setChar] = useState<Character | null>(null);
  const [abilities, setAbilities] = useState<(Ability & { learnedAtLevel: number })[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [seals, setSeals] = useState<CharacterSeals | null>(null);
  const [materials, setMaterials] = useState<CharacterMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, ab, inv, s, mats] = await Promise.all([
      fetchCharacter(id),
      fetchCharacterAbilities(id),
      fetchInventory(id),
      fetchSeals(id),
      fetchCharacterMaterials(id),
    ]);
    setChar(c);
    setAbilities(ab);
    setInventory(inv);
    setSeals(s);
    setMaterials(mats);
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
      <div className="min-h-screen relative">
        <GameBackground className="fixed inset-0 z-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <span className="text-text-muted animate-pulse font-semibold">Loading character...</span>
        </div>
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
  const profKey = char.profession ?? "";
  const colorToken = PROFESSION_COLOR[profKey] || "prof-knight";
  const emoji = PROFESSION_EMOJI[profKey] || "\u{1F9D1}";
  const flavorTitle = profKey ? (FLAVOR_TITLES[profKey]?.[Math.min(char.level, 5)] || "Adventurer") : "Adventurer";

  // Find highest stat
  const highestStat = STAT_KEYS.reduce((a, b) => ts[a] > ts[b] ? a : b);

  return (
    <div className="min-h-screen relative">
      <GameBackground className="fixed inset-0 z-0" />

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="rounded-xl p-5 mb-6 border backdrop-blur-md animate-slide-up"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, var(--${colorToken}) 15%, transparent), rgba(13, 2, 33, 0.85))`,
            borderColor: `color-mix(in srgb, var(--${colorToken}) 25%, transparent)`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/character" className="text-text-secondary hover:text-text-primary text-sm transition-colors">&larr; Back</Link>
            <button onClick={handleSave} disabled={!dirty || saving}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-bold transition-all active:scale-95",
                dirty ? "bg-accent-gold text-bg-page hover:bg-accent-gold/80" : "bg-white/5 text-text-muted cursor-default"
              )}>
              {saving ? "Saving..." : dirty ? "Save" : "Saved \u2713"}
            </button>
          </div>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <HeroAvatar profession={char.profession} level={char.level} size="lg" />

            <div className="flex-1 min-w-0">
              <h1 className="text-sm md:text-base text-text-title truncate">{char.heroName || "Hero"}</h1>
              <p className="text-sm text-text-secondary mt-1">
                Level {char.level} {profInfo?.name ?? ""} &bull; <span className="italic text-accent-gold/60">{flavorTitle}</span>
              </p>
              <div className="mt-2 max-w-sm">
                <GameProgressBar
                  value={char.xp}
                  max={nextXp === Infinity ? 1 : nextXp}
                  color="bg-xp-bar"
                  height="sm"
                  showLabel
                  label="XP"
                />
              </div>
              <p className="text-xs text-accent-gold mt-1">{"\u{1F4B0}"} {char.gold} Gold</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sheet">
          <TabsList
            className="border backdrop-blur-md mb-4"
            style={{
              background: "rgba(26, 10, 62, 0.8)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <TabsTrigger value="sheet" className="data-[state=active]:bg-white/10 data-[state=active]:text-accent-gold">Sheet</TabsTrigger>
            {char.profession && PROFESSION_CLASS[char.profession] && (
              <TabsTrigger value="skills" className="data-[state=active]:bg-white/10 data-[state=active]:text-accent-gold">Skills</TabsTrigger>
            )}
            <TabsTrigger value="professions" className="data-[state=active]:bg-white/10 data-[state=active]:text-accent-gold">Professions</TabsTrigger>
          </TabsList>

          <TabsContent value="sheet">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column — Stats + Combat */}
              <div className="md:col-span-2 space-y-6">
                {/* Stats Panel */}
                <GlassPanel title="STATS" colorToken={colorToken} delay={0}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-text-muted">{"\u{1F4CA}"} Stat Points</span>
                    {char.unspentStatPoints > 0 ? (
                      <span className="text-xs bg-accent-gold/20 text-accent-gold px-2 py-1 rounded-full animate-pulse-glow font-bold" style={{ "--glow-rgb": "255 215 0" } as React.CSSProperties}>
                        {char.unspentStatPoints} available
                      </span>
                    ) : (
                      <span className="text-xs text-text-dim">0 available</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {STAT_KEYS.map((key) => {
                      const label = STAT_LABELS[key];
                      const baseVal = char.stats[key];
                      const totalVal = ts[key];
                      const bonus = statBonus(totalVal);
                      const gearB = char.gearBonus[key];
                      const isHighest = key === highestStat;
                      return (
                        <div key={key} className={cn("flex items-center gap-2", isHighest && "relative")}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={cn("text-xs font-bold w-8 cursor-help", isHighest ? "text-accent-gold" : "text-text-secondary")}>{label.abbr}</span>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-bg-card border border-white/10 text-text-primary text-xs p-2 max-w-[180px]">
                              <p className="font-bold">{label.name}</p>
                              <p className="text-text-muted mt-0.5">{STAT_TIPS[key]}</p>
                            </TooltipContent>
                          </Tooltip>
                          <button onClick={() => handleStatChange(key, -1)} disabled={baseVal <= 3}
                            className="w-7 h-7 rounded bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 text-sm flex items-center justify-center disabled:opacity-20 transition-all active:scale-90">-</button>
                          <span className="text-base font-bold w-6 text-center tabular-nums">{baseVal}</span>
                          <button onClick={() => handleStatChange(key, 1)} disabled={char.unspentStatPoints <= 0 || baseVal >= 15}
                            className={cn(
                              "w-7 h-7 rounded text-sm flex items-center justify-center disabled:opacity-20 transition-all active:scale-90",
                              char.unspentStatPoints > 0 && baseVal < 15
                                ? "bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
                                : "bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10"
                            )}>+</button>
                          {gearB > 0 && <span className="text-xs text-green-400">+{gearB}</span>}
                          <span className="text-xs text-text-dim w-8 text-right">({bonus >= 0 ? "+" : ""}{bonus})</span>
                          <GameProgressBar
                            value={totalVal}
                            max={15}
                            color={isHighest ? "bg-accent-gold" : `bg-stat-bar`}
                            height="xs"
                            className="flex-1"
                          />
                          {isHighest && <span className="text-[9px] text-accent-gold">{"\u2B06"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </GlassPanel>

                {/* Combat Panel */}
                <GlassPanel title="COMBAT" colorToken={colorToken} delay={100}>
                  <div className="space-y-3 mb-4">
                    <GameProgressBar
                      value={currentHp}
                      max={hp}
                      color={currentHp / hp > 0.5 ? "bg-hp-high" : currentHp / hp > 0.25 ? "bg-hp-mid" : "bg-hp-low"}
                      height="lg"
                      showLabel
                      label={"\u2764\uFE0F HP"}
                    />
                    {char.resourceType && (
                      <GameProgressBar
                        value={currentRes}
                        max={mr}
                        color={char.resourceType === "rage" ? "bg-resource-rage" : char.resourceType === "energy" ? "bg-resource-energy" : "bg-resource-mana"}
                        height="md"
                        showLabel
                        label={char.resourceType === "rage" ? "\u{1F525} Rage" : char.resourceType === "energy" ? "\u26A1 Energy" : "\u{1F52E} Mana"}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: "\u2694\uFE0F", label: "Melee Dmg", val: String(ts.str) },
                      { icon: "\u{1F3C3}", label: "Move", val: "6 studs" },
                      { icon: "\u{1F6E1}", label: "Melee Def", val: String(ts.str + 8) },
                      { icon: "\u{1F3F9}", label: "Ranged Def", val: String(ts.agi + 8) },
                      { icon: "\u{1F4A5}", label: "Crit Range", val: `${crit}+` },
                      { icon: "\u{1F340}", label: "Lucky Saves", val: "1" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-white/5 px-3 py-2 text-center">
                        <div className="text-base">{s.icon}</div>
                        <div className="text-xs text-text-secondary">{s.label}</div>
                        <div className="text-sm font-bold">{s.val}</div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Right Column */}
              <div className="md:col-span-3 space-y-6">
                {/* Abilities */}
                <GlassPanel title={`ABILITIES (${abilities.length})`} colorToken={colorToken} delay={50}>
                  {abilities.length === 0 ? (
                    <div>
                      <p className="text-text-secondary text-sm mb-3">{"\u{1F512}"} Abilities unlock at Level 2!</p>
                      {profKey && UPCOMING_ABILITIES[profKey] && (
                        <div className="space-y-2">
                          <p className="text-xs text-text-muted">Upcoming for {profInfo?.name}:</p>
                          {UPCOMING_ABILITIES[profKey].map((ab) => (
                            <div key={ab.name} className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2 opacity-50">
                              <span>{ab.icon}</span>
                              <div>
                                <span className="text-sm font-medium text-text-secondary">{ab.name}</span>
                                <span className="text-xs text-text-dim ml-2">&mdash; {ab.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-accent-gold/50 italic mt-3">&ldquo;Keep fighting, hero &mdash; power awaits!&rdquo;</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {abilities.map((ab) => (
                        <div key={ab.id} className="flex items-start justify-between rounded-lg bg-white/5 px-4 py-3">
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
                </GlassPanel>

                {/* Seal Collection */}
                <GlassPanel title="SEAL COLLECTION" colorToken={colorToken} delay={150}>
                  <div className="space-y-2">
                    {[
                      { tier: "Common", val: seals?.common ?? 0, color: "bg-green-500", dim: "bg-green-900/20" },
                      { tier: "Uncommon", val: seals?.uncommon ?? 0, color: "bg-blue-500", dim: "bg-blue-900/20" },
                      { tier: "Rare", val: seals?.rare ?? 0, color: "bg-yellow-500", dim: "bg-yellow-900/20" },
                      { tier: "Epic", val: seals?.epic ?? 0, color: "bg-purple-500", dim: "bg-purple-900/20" },
                      { tier: "Legendary", val: seals?.legendary ?? 0, color: "bg-red-500", dim: "bg-red-900/20" },
                    ].map((s) => (
                      <div key={s.tier} className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full shrink-0", s.color)} />
                        <span className="text-sm text-text-secondary w-20">{s.tier}</span>
                        <div className="flex gap-1 flex-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn("w-2 h-2 rounded-full", i < s.val ? s.color : "bg-white/10")}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-text-muted w-4 text-right">{s.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                    <span>Total Seals: {(seals?.common ?? 0) + (seals?.uncommon ?? 0) + (seals?.rare ?? 0) + (seals?.epic ?? 0) + (seals?.legendary ?? 0)}</span>
                  </div>
                </GlassPanel>

                {/* Inventory */}
                <GlassPanel title="INVENTORY" colorToken={colorToken} delay={200}>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-text-secondary">{"\u{1F4B0}"} Gold Coins</span>
                      <span className="font-bold text-accent-gold">&times;{char.gold}</span>
                    </div>
                    <div>
                      <p className="text-xs text-text-dim mb-1">{"\u{1F4E6}"} Equipment</p>
                      {inventory.filter(i => i.equipped).length > 0 ? (
                        inventory.filter(i => i.equipped).map((item) => (
                          <div key={item.id} className="flex justify-between py-1 text-text-secondary">
                            <span>{item.itemName} <span className="text-green-400 text-xs">(E)</span></span>
                            <span className="text-text-muted">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-dim text-xs italic">Empty &mdash; visit a shop!</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-text-dim mb-1">{"\u{1F9EA}"} Consumables</p>
                      {inventory.filter(i => !i.equipped).length > 0 ? (
                        inventory.filter(i => !i.equipped).map((item) => (
                          <div key={item.id} className="flex justify-between py-1 text-text-secondary">
                            <span>{item.itemName}</span>
                            <span className="text-text-muted">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-dim text-xs italic">Empty &mdash; craft potions from seals!</p>
                      )}
                    </div>
                  </div>
                </GlassPanel>

                {/* Crafting Materials */}
                <GlassPanel title={`MATERIALS (${materials.length})`} colorToken={colorToken} delay={250}>
                  {materials.length === 0 ? (
                    <div>
                      <p className="text-text-secondary text-sm">{"\u26CF\uFE0F"} No materials yet!</p>
                      <p className="text-xs text-text-muted mt-1">Defeat enemies and explore to find crafting materials.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map((tier) => {
                        const tierMats = materials.filter((m) => m.tier === tier);
                        if (tierMats.length === 0) return null;
                        return (
                          <div key={tier}>
                            <p className="text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: TIER_COLORS[tier] }}>
                              {tier}
                            </p>
                            <div className="space-y-1">
                              {tierMats.map((m) => (
                                <div key={m.materialId} className="flex items-center justify-between py-1 rounded-md px-2 bg-white/3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{m.icon || CATEGORY_ICONS[m.category]}</span>
                                    <span className="text-sm text-text-secondary">{m.materialName}</span>
                                  </div>
                                  <span className="text-sm font-bold" style={{ color: TIER_COLORS[tier] }}>&times;{m.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-white/5 text-xs text-text-muted">
                        Total: {materials.reduce((s, m) => s + m.quantity, 0)} items across {materials.length} types
                      </div>
                    </div>
                  )}</GlassPanel>
              </div>
            </div>
          </TabsContent>

          {char.profession && PROFESSION_CLASS[char.profession] && (
            <TabsContent value="skills">
              <SkillTreePanel characterId={char.id} profession={char.profession} level={char.level} />
            </TabsContent>
          )}

          <TabsContent value="professions">
            <ProfessionTreePanel characterId={char.id} characterLevel={char.level} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GlassPanel({ title, colorToken, delay = 0, children }: { title: string; colorToken: string; delay?: number; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 border backdrop-blur-md animate-slide-up"
      style={{
        background: "rgba(26, 10, 62, 0.7)",
        borderColor: "rgba(255, 255, 255, 0.06)",
        animationDelay: `${delay}ms`,
      }}
    >
      <h2 className="text-xs font-bold text-text-title mb-4 tracking-wider">{title}</h2>
      {children}
    </div>
  );
}
