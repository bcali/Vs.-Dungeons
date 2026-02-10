"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PROFESSION_ABILITY_DATA, getNodeState } from "@/data/profession-abilities";
import { ProfessionNode } from "./profession-node";
import {
  fetchCharacterCraftingProfessions,
  addCharacterCraftingProfession,
  fetchProfessionChoices,
  saveProfessionChoice,
} from "@/lib/supabase/queries";
import type { CraftingProfession, CraftingProfessionData } from "@/types/game";
import { CRAFTING_PROFESSION_INFO } from "@/types/game";

interface ProfessionTreePanelProps {
  characterId: string;
  characterLevel: number;
}

// Tier titles based on how many nodes unlocked
function professionTier(unlockedCount: number): string {
  if (unlockedCount >= 8) return "Grandmaster";
  if (unlockedCount >= 6) return "Master";
  if (unlockedCount >= 4) return "Expert";
  if (unlockedCount >= 2) return "Journeyman";
  if (unlockedCount >= 1) return "Apprentice";
  return "Novice";
}

export function ProfessionTreePanel({ characterId, characterLevel }: ProfessionTreePanelProps) {
  const [chosenProfessions, setChosenProfessions] = useState<CraftingProfession[]>([]);
  const [choicesMap, setChoicesMap] = useState<Record<string, Record<number, number>>>({});
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const profs = await fetchCharacterCraftingProfessions(characterId);
    setChosenProfessions(profs);

    // Load choices for each profession
    const cm: Record<string, Record<number, number>> = {};
    for (const p of profs) {
      cm[p] = await fetchProfessionChoices(characterId, p);
    }
    setChoicesMap(cm);
    setLoading(false);
  }, [characterId]);

  useEffect(() => { load(); }, [load]);

  const handlePickProfession = async (prof: CraftingProfession) => {
    setPicking(true);
    const ok = await addCharacterCraftingProfession(characterId, prof);
    if (ok) {
      setChosenProfessions((prev) => [...prev, prof]);
      setChoicesMap((prev) => ({ ...prev, [prof]: {} }));
    }
    setPicking(false);
  };

  const handleChoiceSelect = async (profession: CraftingProfession, nodeNumber: number, optionIndex: number) => {
    if (!confirm("This choice is permanent! Are you sure?")) return;
    const ok = await saveProfessionChoice(characterId, profession, nodeNumber, optionIndex);
    if (ok) {
      setChoicesMap((prev) => ({
        ...prev,
        [profession]: { ...prev[profession], [nodeNumber]: optionIndex },
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-text-muted animate-pulse">Loading professions...</span>
      </div>
    );
  }

  // If no crafting professions chosen yet, show picker
  if (chosenProfessions.length === 0) {
    return <ProfessionPicker onPick={handlePickProfession} picking={picking} exclude={[]} characterLevel={characterLevel} />;
  }

  return (
    <div className="space-y-6">
      {/* Profession trees side by side */}
      <div className={cn(
        "grid gap-6",
        chosenProfessions.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : "grid-cols-1 md:grid-cols-2"
      )}>
        {chosenProfessions.map((profId) => {
          const data = PROFESSION_ABILITY_DATA.find((p) => p.id === profId);
          if (!data) return null;
          const choices = choicesMap[profId] ?? {};
          return (
            <SingleProfessionTree
              key={profId}
              data={data}
              characterLevel={characterLevel}
              selections={choices}
              onChoiceSelect={(nodeNumber, optionIndex) => handleChoiceSelect(profId, nodeNumber, optionIndex)}
            />
          );
        })}
      </div>

      {/* Add second profession button */}
      {chosenProfessions.length < 2 && characterLevel >= 3 && (
        <ProfessionPicker
          onPick={handlePickProfession}
          picking={picking}
          exclude={chosenProfessions}
          characterLevel={characterLevel}
          isSecondSlot
        />
      )}
    </div>
  );
}

function SingleProfessionTree({
  data,
  characterLevel,
  selections,
  onChoiceSelect,
}: {
  data: CraftingProfessionData;
  characterLevel: number;
  selections: Record<number, number>;
  onChoiceSelect: (nodeNumber: number, optionIndex: number) => void;
}) {
  // Count unlocked nodes for tier calculation
  const unlockedCount = data.nodes.filter((n) => {
    const st = getNodeState(n, characterLevel, selections);
    return st === 'unlocked' || (st === 'available' && n.type === 'auto');
  }).length;

  const tier = professionTier(unlockedCount);

  return (
    <div
      className="rounded-xl p-5 border backdrop-blur-md"
      style={{
        background: "rgba(26, 10, 62, 0.7)",
        borderColor: `color-mix(in srgb, ${data.color} 20%, transparent)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: `color-mix(in srgb, ${data.color} 15%, transparent)` }}>
        <span className="text-2xl">{data.icon}</span>
        <div>
          <h3 className="text-xs font-bold text-text-title tracking-wider">{data.name.toUpperCase()}</h3>
          <p className="text-[10px] text-text-muted">Tier: <span style={{ color: data.color }}>{tier}</span></p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-xs text-text-dim">{unlockedCount}/9 nodes</span>
        </div>
      </div>

      {/* Vertical node list with connectors */}
      <div className="relative space-y-1">
        {data.nodes.map((node, idx) => {
          const state = getNodeState(node, characterLevel, selections);

          // Skip fully locked nodes that aren't even preview
          const show = state !== 'locked' || idx < 6; // Always show first 6

          if (!show) return null;

          return (
            <div key={node.nodeNumber}>
              {/* Connector line */}
              {idx > 0 && (
                <div className="flex justify-center py-1">
                  <div
                    className={cn("w-0.5 h-4 rounded-full transition-all")}
                    style={{
                      background: state === 'unlocked' || (state === 'available' && node.type === 'auto')
                        ? data.color
                        : state === 'available'
                          ? '#ffd700'
                          : 'rgba(255, 255, 255, 0.08)',
                    }}
                  />
                </div>
              )}

              <ProfessionNode
                level={node.unlockLevel}
                type={node.type}
                state={state}
                options={node.options}
                selectedOption={selections[node.nodeNumber]}
                professionColor={data.color}
                onSelect={(optionIndex) => onChoiceSelect(node.nodeNumber, optionIndex)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfessionPicker({
  onPick,
  picking,
  exclude,
  characterLevel,
  isSecondSlot,
}: {
  onPick: (prof: CraftingProfession) => void;
  picking: boolean;
  exclude: CraftingProfession[];
  characterLevel: number;
  isSecondSlot?: boolean;
}) {
  const available = (Object.keys(CRAFTING_PROFESSION_INFO) as CraftingProfession[]).filter(
    (p) => !exclude.includes(p)
  );

  if (characterLevel < 3) {
    return (
      <div className="rounded-xl p-8 border text-center backdrop-blur-md"
        style={{ background: "rgba(26, 10, 62, 0.7)", borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <p className="text-2xl mb-3">{'\u{1F6E0}\uFE0F'}</p>
        <h3 className="text-xs font-bold text-text-title mb-2">CRAFTING PROFESSIONS</h3>
        <p className="text-sm text-text-secondary">Crafting professions unlock at <span className="text-accent-gold font-bold">Level 3</span>!</p>
        <p className="text-xs text-text-muted mt-2">Keep adventuring — you&apos;re almost there!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 border backdrop-blur-md"
      style={{ background: "rgba(26, 10, 62, 0.7)", borderColor: "rgba(255, 255, 255, 0.06)" }}
    >
      <h3 className="text-xs font-bold text-text-title mb-1 text-center tracking-wider">
        {isSecondSlot ? "CHOOSE SECOND PROFESSION" : "CHOOSE A CRAFTING PROFESSION"}
      </h3>
      <p className="text-xs text-text-muted text-center mb-4">
        {isSecondSlot ? "Pick a second specialty!" : "Each hero can learn up to 2 crafting professions"}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {available.map((prof) => {
          const info = CRAFTING_PROFESSION_INFO[prof];
          return (
            <button
              key={prof}
              onClick={() => onPick(prof)}
              disabled={picking}
              className="flex items-center gap-3 rounded-lg p-3 border text-left transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${info.color} 8%, transparent), rgba(26, 10, 62, 0.8))`,
                borderColor: `color-mix(in srgb, ${info.color} 20%, transparent)`,
              }}
            >
              <span className="text-2xl">{info.icon}</span>
              <div>
                <p className="text-sm font-bold text-text-primary">{info.name}</p>
                <p className="text-xs text-text-muted">{info.description}</p>
              </div>
              <span className="ml-auto text-xs font-bold" style={{ color: info.color }}>
                SELECT
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
