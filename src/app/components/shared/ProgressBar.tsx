import React from "react";
import { cn } from "../../../lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  valueLabel?: string;
  color?: string; // Hex or Tailwind class
  height?: "xs" | "sm" | "md" | "lg"; // 4px, 6px, 8px, 12px
  className?: string;
  showLabels?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  valueLabel,
  color = "bg-accent-gold",
  height = "md",
  className,
  showLabels = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heights = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (label || valueLabel) && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>{label}</span>
          <span>{valueLabel || `${value}/${max}`}</span>
        </div>
      )}
      <div className={cn("w-full bg-bg-input radius-full overflow-hidden", heights[height])}>
        <div
          className={cn("h-full radius-full transition-all duration-300", color.startsWith("bg-") ? color : "")}
          style={!color.startsWith("bg-") ? { backgroundColor: color, width: `${percentage}%` } : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
