"use client";

import { useState } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";
import type { SkillTreeSkill } from "@/types/game";

interface SkillNodeProps {
  skill: SkillTreeSkill;
  locked: boolean;
}

export function SkillNode({ skill, locked }: SkillNodeProps) {
  const { canAllocate, getAllocationForSkill, allocatePoint, equipToBar, actionBar } =
    useSkillTreeStore();
  const [allocating, setAllocating] = useState(false);
  const [equipping, setEquipping] = useState(false);

  const allocation = getAllocationForSkill(skill.id);
  const currentRank = allocation?.currentRank ?? 0;
  const isLearned = currentRank > 0;
  const isMaxed = currentRank >= skill.maxRank;
  const canLearn = !locked && canAllocate(skill);
  const isActive = skill.skillType === "active";
  const isEquipped = actionBar.some((s) => s.skillId === skill.id);

  const handleAllocate = async () => {
    if (!canLearn) return;
    setAllocating(true);
    await allocatePoint(skill.id);
    setAllocating(false);
  };

  const handleEquip = async () => {
    // Find first empty slot
    const usedSlots = new Set(actionBar.filter((s) => s.skillId || s.abilityId).map((s) => s.slotNumber));
    let emptySlot = 0;
    for (let i = 1; i <= 5; i++) {
      if (!usedSlots.has(i)) {
        emptySlot = i;
        break;
      }
    }
    if (emptySlot === 0) return; // All slots full
    setEquipping(true);
    await equipToBar(emptySlot, skill.id, null);
    setEquipping(false);
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg px-4 py-3 transition-colors ${
        locked
          ? "bg-[#0f3460]/20"
          : isMaxed
          ? "bg-[#e5a91a]/5 border border-[#e5a91a]/20"
          : isLearned
          ? "bg-[#0f3460]/50 border border-[#3b82f6]/20"
          : "bg-[#0f3460]/30 hover:bg-[#0f3460]/50"
      }`}
    >
      {/* Type Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {isActive ? (
          <span className="text-base" title="Active - uses action bar slot">
            ⚔️
          </span>
        ) : (
          <span className="text-base" title="Passive - always on">
            🛡️
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${isMaxed ? "text-[#e5a91a]" : isLearned ? "text-white" : locked ? "text-zinc-500" : "text-zinc-300"}`}>
            {skill.name}
          </span>
          <span className="text-xs text-zinc-600">{skill.skillCode}</span>
        </div>
        <p className={`text-xs mt-0.5 ${locked ? "text-zinc-600" : "text-zinc-400"}`}>
          {skill.description}
        </p>
        {skill.legoTip && isLearned && (
          <p className="text-xs text-amber-600/70 mt-1 italic">{skill.legoTip}</p>
        )}
      </div>

      {/* Rank + Actions */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {/* Rank dots */}
        <div className="flex gap-1">
          {Array.from({ length: skill.maxRank }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full border ${
                i < currentRank
                  ? "bg-[#e5a91a] border-[#e5a91a]"
                  : "bg-transparent border-zinc-600"
              }`}
            />
          ))}
        </div>

        {/* Action buttons */}
        {!locked && (
          <div className="flex gap-1">
            {canLearn && (
              <button
                onClick={handleAllocate}
                disabled={allocating}
                className="px-2 py-1 rounded text-xs font-medium bg-[#e5a91a]/20 text-[#e5a91a] hover:bg-[#e5a91a]/30 transition-colors disabled:opacity-50"
              >
                {allocating ? "..." : isLearned ? "+1" : "Learn"}
              </button>
            )}
            {isActive && isLearned && !isEquipped && (
              <button
                onClick={handleEquip}
                disabled={equipping}
                className="px-2 py-1 rounded text-xs font-medium bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/30 transition-colors disabled:opacity-50"
              >
                {equipping ? "..." : "Equip"}
              </button>
            )}
            {isEquipped && (
              <span className="px-2 py-1 text-xs text-green-400">Equipped</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
