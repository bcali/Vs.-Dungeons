"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useConfigStore } from "@/stores/config-store";
import { fetchGameConfig, saveGameConfig } from "@/lib/supabase/queries";
import type { GameConfig } from "@/types/config";

type Tab = 'stats' | 'resources' | 'combat' | 'leveling' | 'loot' | 'abilities';
const TABS: { key: Tab; label: string }[] = [
  { key: 'stats', label: 'Stats' },
  { key: 'resources', label: 'Resources' },
  { key: 'combat', label: 'Combat' },
  { key: 'leveling', label: 'Leveling' },
  { key: 'loot', label: 'Loot' },
  { key: 'abilities', label: 'Abilities' },
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
      <div className="min-h-screen p-6 flex items-center justify-center">
        <span className="text-text-muted animate-pulse">Loading config...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-text-secondary hover:text-white text-sm">&larr; Home</Link>
          <h1 className="text-2xl font-bold text-accent-gold">GAME CONFIGURATION</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="rounded-lg bg-bg-input px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors">
            Reset Defaults
          </button>
          <button onClick={handleSave} disabled={!isDirty || saving}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${isDirty ? 'bg-accent-gold text-bg-page hover:bg-accent-gold/80' : 'bg-bg-input text-text-muted cursor-default'}`}>
            {saving ? "Saving..." : isDirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border-card pb-2">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-bg-card text-accent-gold border-b-2 border-accent-gold" : "text-text-muted hover:text-zinc-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {activeTab === 'stats' && <StatsTab config={config} update={updateConfigField} />}
        {activeTab === 'resources' && <ResourcesTab config={config} update={updateConfigField} />}
        {activeTab === 'combat' && <CombatTab config={config} update={updateConfigField} />}
        {activeTab === 'leveling' && <LevelingTab config={config} />}
        {activeTab === 'loot' && <LootTab config={config} />}
        {activeTab === 'abilities' && <AbilitiesTab config={config} />}
      </div>
    </div>
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
    <div className="rounded-xl bg-bg-card border border-border-card p-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">Stat System</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Base Stat Value" value={config.statBaseValue} onChange={(v) => update('statBaseValue', v)} min={1} max={10} />
          <NumberField label="Stat Cap" value={config.statCap} onChange={(v) => update('statCap', v)} min={5} max={30} />
          <NumberField label="Base Movement" value={config.movementBase} onChange={(v) => update('movementBase', v)} min={1} max={20} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">HP Formula</span>
            <span className="text-sm text-zinc-300">CON x <span className="text-lg font-bold">3</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Mana Pool Formula</span>
            <span className="text-sm text-zinc-300">MNA x <span className="text-lg font-bold">15</span></span>
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
    </div>
  );
}

function ResourcesTab({ config, update }: { config: GameConfig; update: UpdateFn }) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-6 space-y-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">Resource Pools</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Energy Pool Max" value={config.energyPoolMax} onChange={(v) => update('energyPoolMax', v)} min={10} max={500} />
          <NumberField label="Rage Pool Max" value={config.ragePoolMax} onChange={(v) => update('ragePoolMax', v)} min={10} max={500} />
          <NumberField label="Mana Regen / Turn" value={config.manaRegenPerTurn} onChange={(v) => update('manaRegenPerTurn', v)} min={0} max={100} />
          <NumberField label="Energy Regen / Turn" value={config.energyRegenPerTurn} onChange={(v) => update('energyRegenPerTurn', v)} min={0} max={100} />
        </div>
        <div className="space-y-4">
          <h3 className="text-xs text-text-muted uppercase">Rage Generation</h3>
          <NumberField label="On Hit Taken" value={config.rageOnHitTaken} onChange={(v) => update('rageOnHitTaken', v)} min={0} max={50} />
          <NumberField label="On Melee Hit Landed" value={config.rageOnMeleeHit} onChange={(v) => update('rageOnMeleeHit', v)} min={0} max={50} />
          <NumberField label="On Crit Taken" value={config.rageOnCritTaken} onChange={(v) => update('rageOnCritTaken', v)} min={0} max={50} />
          <NumberField label="On Ally KO" value={config.rageOnAllyKo} onChange={(v) => update('rageOnAllyKo', v)} min={0} max={50} />
          <NumberField label="Short Rest Restore" value={config.shortRestResourceRestore} onChange={(v) => update('shortRestResourceRestore', v)} min={0} max={100} />
        </div>
      </div>
    </div>
  );
}

function CombatTab({ config, update }: { config: GameConfig; update: UpdateFn }) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-6 space-y-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">Combat Rules</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Defend Bonus" value={config.defendBonus} onChange={(v) => update('defendBonus', v)} min={1} max={10} />
          <NumberField label="Help Friend Bonus" value={config.helpFriendBonus} onChange={(v) => update('helpFriendBonus', v)} min={1} max={10} />
          <NumberField label="Base Crit Value" value={config.baseCritValue} onChange={(v) => update('baseCritValue', v)} min={15} max={20} />
          <NumberField label="Lucky Saves / Session" value={config.luckySavesPerSession} onChange={(v) => update('luckySavesPerSession', v)} min={0} max={5} />
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
    </div>
  );
}

function LevelingTab({ config }: { config: GameConfig }) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">XP Thresholds</h2>
      <div className="grid grid-cols-4 gap-2 text-xs mb-6">
        {config.xpThresholds.map((xp, i) => (
          <div key={i} className="flex items-center justify-between bg-bg-input/50 rounded px-3 py-2">
            <span className="text-text-muted">Lv{i + 1}</span>
            <span className="font-bold text-accent-gold">{xp} XP</span>
          </div>
        ))}
      </div>
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">XP Awards</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {Object.entries(config.xpAwards).map(([key, value]) => (
          <div key={key} className="flex justify-between bg-bg-input/50 rounded px-3 py-2">
            <span className="text-text-secondary">{key.replace(/_/g, ' ')}</span>
            <span className="font-bold">{Array.isArray(value) ? value.join('-') : value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LootTab({ config }: { config: GameConfig }) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">Loot Tables</h2>
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
    </div>
  );
}

function AbilitiesTab({ config }: { config: GameConfig }) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-6">
      <h2 className="text-sm font-semibold text-accent-gold mb-4 uppercase tracking-wider">Ability Costs by Tier</h2>
      <div className="grid grid-cols-4 gap-3 text-sm">
        {Object.entries(config.abilityCosts).map(([tier, cost]) => (
          <div key={tier} className="bg-bg-input/50 rounded px-3 py-2 text-center">
            <div className="text-xs text-text-muted mb-1">Tier {tier}</div>
            <div className="font-bold">{Array.isArray(cost) ? cost.join('-') : cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
