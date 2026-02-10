"use client";

import { cn } from "@/lib/utils";

const heightClasses = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-5",
} as const;

interface GameProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: keyof typeof heightClasses;
  previewValue?: number;
  previewColor?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function GameProgressBar({
  value,
  max = 100,
  color = "bg-stat-bar",
  height = "md",
  previewValue,
  previewColor = "bg-white/20",
  showLabel = false,
  label,
  className,
}: GameProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const previewPct =
    previewValue != null
      ? Math.min(100, Math.max(0, (previewValue / max) * 100))
      : undefined;

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-0.5 text-xs">
          {label && (
            <span className="text-text-secondary font-semibold">{label}</span>
          )}
          <span className="text-text-muted tabular-nums ml-auto">
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-white/10 rounded-full relative overflow-hidden",
          heightClasses[height]
        )}
      >
        {previewPct != null && previewPct > pct && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              previewColor
            )}
            style={{ width: `${previewPct}%` }}
          />
        )}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out relative",
            color
          )}
          style={{ width: `${pct}%` }}
        >
          {/* Shine gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
