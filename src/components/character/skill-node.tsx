"use client";

import { useState } from "react";
import { useSkillTreeStore } from "@/stores/skill-tree-store";
import type { SkillTreeSkill } from "@/types/game";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface SkillNodeProps {
  skill: SkillTreeSkill;
  locked: boolean;
}

export function SkillNode({ skill, locked }: SkillNodeProps) {
  const { canAllocate, getAllocationForSkill, allocatePoint, equipToBar, actionBar } =
    useSkillTreeStore();
  const [allocating, setAllocating] = useState(false);

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
    const usedSlots = new Set(actionBar.filter((s) => s.skillId || s.abilityId).map((s) => s.slotNumber));
    let emptySlot = 0;
    for (let i = 1; i <= 5; i++) {
      if (!usedSlots.has(i)) {
        emptySlot = i;
        break;
      }
    }
    if (emptySlot === 0) return;
    await equipToBar(emptySlot, skill.id, null);
  };

  // Border color based on state
  let borderColor = "border-zinc-700";
  if (canLearn && !isLearned) borderColor = "border-green-500/50";
  if (isLearned && !isMaxed) borderColor = "border-green-500";
  if (isMaxed) borderColor = "border-amber-400";

  // Icon opacity
  let iconClass = "opacity-40 grayscale";
  if (canLearn) iconClass = "opacity-70";
  if (isLearned) iconClass = "opacity-100";

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Node button */}
          <button
            onClick={handleAllocate}
            onContextMenu={(e) => {
              e.preventDefault();
              if (isActive && isLearned && !isEquipped) handleEquip();
            }}
            disabled={locked || (!canLearn && !isLearned)}
            className={cn(
              "w-full aspect-square rounded-lg bg-black/60 border-2 transition-all relative overflow-hidden",
              "hover:scale-105 active:scale-95 disabled:hover:scale-100",
              borderColor,
              isMaxed && "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
              locked && "opacity-40"
            )}
          >
            {/* Icon area */}
            <div className={cn("w-full h-full flex items-center justify-center p-1.5", iconClass)}>
              <span className="text-lg">
                {isActive ? "⚔️" : "🛡️"}
              </span>
            </div>

            {/* Rank counter */}
            <div className={cn(
              "absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded-sm border leading-tight",
              isMaxed ? "bg-amber-500 text-black border-amber-400" :
              isLearned ? "bg-green-900 text-green-100 border-green-700" :
              "bg-black/80 text-zinc-500 border-zinc-700"
            )}>
              {currentRank}/{skill.maxRank}
            </div>

            {/* Equip indicator */}
            {isEquipped && (
              <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-green-400" />
            )}
          </button>
        </TooltipTrigger>

        {/* Tooltip — renders via portal, escapes all overflow containers */}
        <TooltipContent
          side="top"
          sideOffset={8}
          className="w-52 bg-zinc-900/95 border border-white/20 rounded-lg p-3 shadow-xl text-left"
        >
          <h4 className="font-bold text-white text-sm">{skill.name}</h4>
          <div className="text-[10px] text-text-dim mt-0.5">{skill.skillCode}</div>
          <div className="text-xs text-accent-gold mt-1">
            Rank {currentRank}/{skill.maxRank} — {isActive ? "Active" : "Passive"}
          </div>
          <p className="text-xs text-text-secondary mt-1.5 leading-tight">{skill.description}</p>
          {skill.legoTip && isLearned && (
            <p className="text-xs text-amber-600/70 mt-1.5 italic">{skill.legoTip}</p>
          )}
          {canLearn && !isMaxed && (
            <div className="mt-2 text-xs text-green-400">Click to learn</div>
          )}
          {isActive && isLearned && !isEquipped && (
            <div className="mt-1 text-xs text-stat-bar">Right-click to equip</div>
          )}
          {locked && (
            <div className="mt-2 text-xs text-red-400 italic">Requires more points in tree</div>
          )}
        </TooltipContent>
      </Tooltip>

      {/* Name below node */}
      <p className={cn(
        "text-[10px] text-center mt-1 leading-tight truncate",
        isMaxed ? "text-accent-gold" : isLearned ? "text-white" : "text-text-muted"
      )}>
        {skill.name}
      </p>
    </div>
  );
}
