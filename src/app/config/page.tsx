"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Settings } from "lucide-react";
import { useConfigStore } from "@/stores/config-store";
import { fetchGameConfig, saveGameConfig } from "@/lib/supabase/queries";
import { PageShell, fadeUp } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { GameConfig } from "@/types/config";

type Tab = 'stats' | 'spellslots' | 'combat' | 'leveling' | 'loot';
const TABS: { key: Tab; label: string }[] = [
  { key: 'stats', label: 'Stats' },
  { key: 'spellslots', label: 'Spell Slots' },
  { key: 'combat', label: 'Combat' },
  { key: 'leveling', label: 'Leveling' },
  { key: 'loot', label: 'Loot' },
];

export default function ConfigPage() {
  const { config, isDirty, setConfig, updateConfigField, resetToDefaults, markClean } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const c = await fetchGameConfig();
    if (c) setConfig(c);
    setLoading(false);
  }, [setConfig]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!config || !isDirty) return;
    setSaving(true);
    const saved = await saveGameConfig(config);
    if (saved) { setConfig(saved); markClean(); }
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Reset all config to defaults?")) resetToDefaults();
  };

  if (loading || !config) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <span className="text-text-muted animate-pulse font-semibold">Loading config...</span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="GAME CONFIG"
        backHref="/"
        backLabel="Home"
        icon={Settings}
        actions={
          <div className="flex gap-3">
            <button onClick={handleReset} className="rounded-lg bg-bg-input px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors">
              Reset Defaults
            </button>
            {isDirty ? (
              <Button variant="game-lego-gold" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            ) : (
              <button className="rounded-lg bg-bg-input px-4 py-2 text-sm text-text-muted cursor-default">
                Saved
              </button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 mb-6 border-b border-card-border pb-2">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-mono text-[10px] uppercase tracking-widest transition-colors ${
              activeTab === tab.key ? "bg-card-bg text-accent-gold border-b-2 border-accent-gold" : "text-text-muted hover:text-zinc-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {activeTab === 'stats' && <StatsTab config={config} update={updateConfigField} />}
        {activeTab === 'spellslots' && <SpellSlotsTab config={config} />}
        {activeTab === 'combat' && <CombatTab config={config} update={updateConfigField} />}
        {activeTab === 'leveling' && <LevelingTab config={config} />}
        {activeTab === 'loot' && <LootTab config={config} />}
      </div>
    </PageShell>
  );
}

type UpdateFn = <K extends keyof GameConfig>(field: K, value: GameConfig[K]) => void;

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min ?? 0, value - 1))} className="w-7 h-7 rounded bg-bg-input text-text-secondary hover:text-white text-sm flex items-center justify-center">-</button>
        <span className="text-lg font-bold w-8 text-center">{value}</span>
        <button onClick={() => onChange(Math.min(max ?? 999, value + 1))} className="w-7 h-7 rounded bg-bg-input text-text-secondary hover:text-white text-sm flex items-center justify-center">+</button>
      </div>
    </div>
  );
}

function StatsTab({ config, update }: { config: GameConfig; update: UpdateFn }) {
  return (
    <GlassCard title="Stat System (4 Stats)">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Base Stat Value" value={config.statBaseValue} onChange={(v) => update('statBaseValue', v)} min={1} max={10} />
          <NumberField label="Stat Cap" value={config.statCap} onChange={(v) => update('statCap', v)} min={5} max={30} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">HP Formula</span>
            <span className="text-sm text-zinc-300">TGH x <span className="text-lg font-bold">3</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Stat Bonus Formula</span>
            <span className="text-sm text-zinc-300">{config.statBonusFormula}</span>
          </div>
        </div>
        <div>
          <h3 className="text-xs text-text-muted mb-3 uppercase">Stat Points Per Level</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {config.statPointsPerLevel.map((pts, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-input/50 rounded px-2 py-1">
                <span className="text-text-muted">Lv{i + 1}</span>
                <span className="font-bold">{pts}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2">
            Total by Lv20: <span className="text-accent-gold font-bold">{config.statPointsPerLevel.reduce((s, v) => s + v, 0)}</span>
          </p>
        </div>
      </div>

      {/* MOV by Profession */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <h3 className="text-xs text-text-muted mb-3 uppercase">Movement (MOV) by Profession</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {Object.entries(config.movByProfession).map(([prof, mov]) => (
            <div key={prof} className="flex justify-between bg-bg-input/50 rounded px-3 py-2">
              <span className="text-text-secondary capitalize">{prof}</span>
              <span className="font-bold">{mov} spaces</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function SpellSlotsTab({ config }: { config: GameConfig }) {
  return (
    <GlassCard title="Spell Slot Progression" className="space-y-6">
      <div className="grid grid-cols-4 gap-2 text-xs">
        {config.spellSlotProgression.map((slots, i) => (
          <div key={i} className="flex items-center justify-between bg-bg-input/50 rounded px-3 py-2">
            <span className="text-text-muted">Lv{i + 1}</span>
            <span className="font-bold text-blue-400">{slots} slots</span>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-white/5 space-y-2 text-sm text-text-secondary">
        <p>Cantrips (slot cost 0) are always free.</p>
        <p>Short rest restores: <span className="text-zinc-300 font-medium">{config.shortRestSlotsRestore}</span> slots.</p>
      </div>
    </GlassCard>
  );
}

function CombatTab({ config, update }: { config: GameConfig; update: UpdateFn }) {
  return (
    <GlassCard title="Combat Rules" className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Defend Bonus" value={config.defendBonus} onChange={(v) => update('defendBonus', v)} min={1} max={10} />
          <NumberField label="Help Friend Bonus" value={config.helpFriendBonus} onChange={(v) => update('helpFriendBonus', v)} min={1} max={10} />
          <NumberField label="Flanking Bonus" value={config.flankingBonus} onChange={(v) => update('flankingBonus', v)} min={0} max={10} />
          <NumberField label="Surrounding Bonus" value={config.surroundingBonus} onChange={(v) => update('surroundingBonus', v)} min={0} max={10} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Critical Hits</span>
            <span className="text-sm text-zinc-300">{config.critOnNat20 ? "Natural 20 only" : "Custom"}</span>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs text-text-muted uppercase">Difficulty Targets</h3>
          <NumberField label="Easy" value={config.difficultyTargets.easy} onChange={(v) => update('difficultyTargets', { ...config.difficultyTargets, easy: v })} min={1} max={25} />
          <NumberField label="Medium" value={config.difficultyTargets.medium} onChange={(v) => update('difficultyTargets', { ...config.difficultyTargets, medium: v })} min={1} max={25} />
          <NumberField label="Hard" value={config.difficultyTargets.hard} onChange={(v) => update('difficultyTargets', { ...config.difficultyTargets, hard: v })} min={1} max={30} />
          <NumberField label="Epic" value={config.difficultyTargets.epic} onChange={(v) => update('difficultyTargets', { ...config.difficultyTargets, epic: v })} min={1} max={30} />
        </div>
      </div>
      <div>
        <h3 className="text-xs text-text-muted uppercase mb-2">Defense Formulas</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
          <div>Melee Defense: <span className="text-zinc-300">{config.meleeDefenseFormula}</span></div>
          <div>Ranged Defense: <span className="text-zinc-300">{config.rangedDefenseFormula}</span></div>
        </div>
      </div>
    </GlassCard>
  );
}

function LevelingTab({ config }: { config: GameConfig }) {
  return (
    <GlassCard>
      <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest mb-4">XP Thresholds</h2>
      <div className="grid grid-cols-4 gap-2 text-xs mb-6">
        {config.xpThresholds.map((xp, i) => (
          <div key={i} className="flex items-center justify-between bg-bg-input/50 rounded px-3 py-2">
            <span className="text-text-muted">Lv{i + 1}</span>
            <span className="font-bold text-accent-gold">{xp} XP</span>
          </div>
        ))}
      </div>
      <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest mb-4 mt-6">XP Awards</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {Object.entries(config.xpAwards).map(([key, value]) => (
          <div key={key} className="flex justify-between bg-bg-input/50 rounded px-3 py-2">
            <span className="text-text-secondary">{key.replace(/_/g, ' ')}</span>
            <span className="font-bold">{Array.isArray(value) ? value.join('-') : value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function LootTab({ config }: { config: GameConfig }) {
  return (
    <GlassCard title="Loot Tables">
      <div className="space-y-4">
        {Object.entries(config.lootTables).map(([tier, table]) => (
          <div key={tier}>
            <h3 className="text-xs text-text-muted uppercase mb-2">Level {tier}</h3>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {Object.entries(table).map(([roll, reward]) => (
                <div key={roll} className="bg-bg-input/50 rounded px-2 py-1.5 text-center">
                  <div className="text-text-muted">{roll}</div>
                  <div className="font-medium">{reward}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
