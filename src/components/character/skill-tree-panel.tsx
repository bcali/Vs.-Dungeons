"use client";

import { useEffect } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";
import { PROFESSION_CLASS, BRANCH_INFO } from "@/types/game";
import type { Profession, SkillBranch, SkillTreeClass } from "@/types/game";
import { SkillPointSummary } from "./skill-point-summary";
import { SkillTreeColumn } from "./skill-tree-column";
import { ActionBar } from "./action-bar";

const CLASS_BRANCHES: Record<SkillTreeClass, SkillBranch[]> = {
  warrior: ["protection", "warrior_core", "arms"],
  rogue_ranger: ["shadow", "rogue_ranger_core", "precision", "survival"],
};

interface SkillTreePanelProps {
  characterId: string;
  profession: Profession;
  level: number;
}

export function SkillTreePanel({ characterId, profession, level }: SkillTreePanelProps) {
  const skillClass = PROFESSION_CLASS[profession];
  const { loadSkillTree, isLoading, skills } = useSkillTreeStore();
  const branches = skillClass ? CLASS_BRANCHES[skillClass] : [];

  useEffect(() => {
    if (skillClass) {
      loadSkillTree(characterId, level, skillClass);
    }
  }, [characterId, level, skillClass, loadSkillTree]);

  if (!skillClass) {
    return (
      <div className="rounded-xl bg-bg-card border border-border-card p-8 text-center">
        <p className="text-text-secondary">Skill trees are available for Knight, Ranger, and Rogue.</p>
        <p className="text-text-muted text-sm mt-2">This profession uses the Spellbook system instead.</p>
      </div>
    );
  }

  if (isLoading || skills.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-text-muted animate-pulse">Loading skill tree...</span>
      </div>
    );
  }

  const cols = branches.length;

  return (
    <div className="flex flex-col gap-4">
      <SkillPointSummary />

      {/* Multi-column skill tree grid */}
      <div
        className="grid gap-px bg-white/5 rounded-xl border border-white/10 overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {branches.map((branch) => {
          const branchSkills = skills.filter((s) => s.branch === branch);
          return (
            <SkillTreeColumn
              key={branch}
              branch={branch}
              skills={branchSkills}
            />
          );
        })}
      </div>

      <ActionBar />
    </div>
  );
}
