"use client";

import { useEffect, useState } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";
import { PROFESSION_CLASS, BRANCH_INFO } from "@/types/game";
import type { Profession, SkillBranch, SkillTreeClass } from "@/types/game";
import { SkillPointSummary } from "./skill-point-summary";
import { SkillTreeBranch } from "./skill-tree-branch";
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
  const [activeBranch, setActiveBranch] = useState<SkillBranch | null>(null);

  useEffect(() => {
    if (skillClass) {
      loadSkillTree(characterId, level, skillClass);
    }
  }, [characterId, level, skillClass, loadSkillTree]);

  useEffect(() => {
    if (branches.length > 0 && !activeBranch) {
      setActiveBranch(branches[0]);
    }
  }, [branches, activeBranch]);

  if (!skillClass) {
    return (
      <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-8 text-center">
        <p className="text-zinc-400">Skill trees are available for Knight, Ranger, and Rogue.</p>
        <p className="text-zinc-500 text-sm mt-2">This profession uses the Spellbook system instead.</p>
      </div>
    );
  }

  if (isLoading || skills.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-zinc-500 animate-pulse">Loading skill tree...</span>
      </div>
    );
  }

  const branchSkills = activeBranch
    ? skills.filter((s) => s.branch === activeBranch)
    : [];

  return (
    <div className="space-y-4">
      <SkillPointSummary />

      {/* Branch Selector */}
      <div className="flex gap-2">
        {branches.map((branch) => {
          const info = BRANCH_INFO[branch];
          const isActive = activeBranch === branch;
          return (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                isActive
                  ? "border-[#e5a91a] bg-[#e5a91a]/10 text-[#e5a91a]"
                  : "border-[#0f3460] bg-[#16213e] text-zinc-400 hover:text-white hover:border-zinc-500"
              }`}
            >
              <BranchPointsBadge branch={branch} />
              <span>{info.name}</span>
            </button>
          );
        })}
      </div>

      {/* Skill Tree */}
      {activeBranch && <SkillTreeBranch branch={activeBranch} skills={branchSkills} />}

      {/* Action Bar */}
      <ActionBar />
    </div>
  );
}

function BranchPointsBadge({ branch }: { branch: SkillBranch }) {
  const pts = useSkillTreeStore((s) => s.getBranchPoints(branch));
  if (pts === 0) return null;
  return (
    <span className="inline-block bg-[#e5a91a]/20 text-[#e5a91a] text-xs px-1.5 rounded-full mr-2">
      {pts}
    </span>
  );
}
