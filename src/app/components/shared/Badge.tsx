import React from "react";
import { cn } from "../../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "buff" | "debuff" | "cc" | "dot" | "hot" | "points";
  animatePulse?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", animatePulse, children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-input text-text-secondary",
      buff: "bg-green-900/50 text-green-400 border border-green-900",
      debuff: "bg-red-900/50 text-red-400 border border-red-900",
      cc: "bg-yellow-900/50 text-yellow-400 border border-yellow-900",
      dot: "bg-orange-900/50 text-orange-400 border border-orange-900",
      hot: "bg-emerald-900/50 text-emerald-400 border border-emerald-900",
      points: "bg-accent-gold/20 text-accent-gold font-bold",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center radius-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
          variant === "points" && "radius-full px-2 py-1 text-xs normal-case tracking-normal",
          animatePulse && "animate-pulse",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
