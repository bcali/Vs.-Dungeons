"use client";

import { useSkillTreeStore } from "@/stores/skill-tree-store";
import { TIER_REQUIREMENTS, BRANCH_INFO } from "@/types/game";
import type { SkillTreeSkill, SkillBranch } from "@/types/game";
import { SkillNode } from "./skill-node";
import {
  Shield, Sword, Swords, Moon, Target, Trees, PocketKnife,
} from "lucide-react";

const BRANCH_ICONS: Record<string, React.ElementType> = {
  Shield, Sword, Swords, Moon, Target, Trees, Dagger: PocketKnife,
};

interface SkillTreeColumnProps {
  branch: SkillBranch;
  skills: SkillTreeSkill[];
}

export function SkillTreeColumn({ branch, skills }: SkillTreeColumnProps) {
  const { getBranchPoints, getHighestUnlockedTier } = useSkillTreeStore();
  const branchPoints = getBranchPoints(branch);
  const info = BRANCH_INFO[branch];
  const isCore = branch.endsWith("_core");
  const IconComponent = BRANCH_ICONS[info.icon] ?? Shield;

  // Group skills by tier
  const tiers = new Map<number, SkillTreeSkill[]>();
  for (const skill of skills) {
    const list = tiers.get(skill.tier) || [];
    list.push(skill);
    tiers.set(skill.tier, list);
  }
  const sortedTiers = Array.from(tiers.entries()).sort(([a], [b]) => a - b);

  return (
    <div className="flex flex-col h-full" style={{ background: `linear-gradient(to bottom, ${info.color}08, ${info.color}03)` }}>
      {/* Branch Header */}
      <div className="p-3 flex items-center gap-3 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div
          className="p-2 rounded-full bg-black/50 border border-white/10"
          style={{ color: info.color }}
        >
          <IconComponent size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm" style={{ color: info.color }}>
            {info.name}
          </h3>
          <span className="text-xs text-text-muted">{branchPoints} points</span>
        </div>
      </div>

      {/* Tiers */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {sortedTiers.map(([tier, tierSkills]) => {
          const req = TIER_REQUIREMENTS[tier] ?? 0;
          const locked = !isCore && branchPoints < req;

          return (
            <div key={tier}>
              {/* Tier divider */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: locked ? undefined : info.color }}
                >
                  {locked ? (
                    <span className="text-text-dim">T{tier} — {req} pts</span>
                  ) : (
                    <>T{tier}</>
                  )}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Skill nodes grid */}
              <div className="grid grid-cols-2 gap-2">
                {tierSkills.map((skill) => (
                  <SkillNode key={skill.id} skill={skill} locked={locked} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
