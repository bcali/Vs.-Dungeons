"use client";

import { useSkillTreeStore } from "@/stores/skill-tree-store";

export function ActionBar() {
  const { actionBar, skills, removeFromBar } = useSkillTreeStore();

  const slots = Array.from({ length: 5 }, (_, i) => {
    const slot = actionBar.find((s) => s.slotNumber === i + 1);
    const skill = slot?.skillId ? skills.find((s) => s.id === slot.skillId) : null;
    return { slotNumber: i + 1, slot, skill };
  });

  const hasAny = slots.some((s) => s.skill);
  if (!hasAny) return null;

  return (
    <div className="rounded-xl bg-bg-card border border-border-card p-4">
      <h3 className="text-xs font-semibold text-accent-gold mb-3 uppercase tracking-wider">
        Action Bar
      </h3>
      <div className="flex gap-2">
        {slots.map(({ slotNumber, slot, skill }) => (
          <div
            key={slotNumber}
            className={`flex-1 rounded-lg border p-2 text-center min-h-[56px] flex flex-col items-center justify-center ${
              skill
                ? "border-accent-gold/30 bg-accent-gold/5"
                : "border-border-card border-dashed bg-bg-input/20"
            }`}
          >
            {skill ? (
              <>
                <span className="text-xs font-medium text-white truncate w-full">
                  {skill.name}
                </span>
                <button
                  onClick={() => removeFromBar(slotNumber)}
                  className="text-xs text-text-muted hover:text-red-400 mt-1 transition-colors"
                >
                  remove
                </button>
              </>
            ) : (
              <span className="text-xs text-text-dim">{slotNumber}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
