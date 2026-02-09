"use client";

import { useSkillTreeStore } from "@/stores/skill-tree-store";
import { TIER_REQUIREMENTS, BRANCH_INFO } from "@/types/game";
import type { SkillTreeSkill, SkillBranch } from "@/types/game";
import { SkillNode } from "./skill-node";

interface SkillTreeBranchProps {
  branch: SkillBranch;
  skills: SkillTreeSkill[];
}

export function SkillTreeBranch({ branch, skills }: SkillTreeBranchProps) {
  const { getBranchPoints, getHighestUnlockedTier } = useSkillTreeStore();
  const branchPoints = getBranchPoints(branch);
  const unlockedTier = getHighestUnlockedTier(branch);
  const isCore = branch.endsWith("_core");

  // Group skills by tier
  const tiers = new Map<number, SkillTreeSkill[]>();
  for (const skill of skills) {
    const list = tiers.get(skill.tier) || [];
    list.push(skill);
    tiers.set(skill.tier, list);
  }

  const sortedTiers = Array.from(tiers.entries()).sort(([a], [b]) => a - b);

  return (
    <div className="space-y-4">
      {sortedTiers.map(([tier, tierSkills]) => {
        const req = TIER_REQUIREMENTS[tier] ?? 0;
        const locked = !isCore && branchPoints < req;
        const pointsNeeded = req - branchPoints;

        return (
          <div key={tier} className={`rounded-xl border p-4 transition-colors ${
            locked
              ? "bg-[#16213e]/50 border-[#0f3460]/50 opacity-60"
              : "bg-[#16213e] border-[#0f3460]"
          }`}>
            {/* Tier Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: BRANCH_INFO[branch].color }}>
                  Tier {tier}
                </span>
                {req > 0 && !isCore && (
                  <span className="text-xs text-zinc-500">
                    ({req} pts required)
                  </span>
                )}
              </div>
              {locked && (
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Need {pointsNeeded} more {pointsNeeded === 1 ? "point" : "points"}
                </span>
              )}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 gap-2">
              {tierSkills.map((skill) => (
                <SkillNode key={skill.id} skill={skill} locked={locked} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
