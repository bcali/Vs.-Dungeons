import React from "react";
import { cn } from "../../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "active" | "hero" | "enemy" | "disabled";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-card border border-border-card",
      active: "bg-bg-card border border-border-active-gold shadow-[0_0_10px_rgba(229,169,26,0.1)]",
      hero: "bg-green-950/20 border border-border-active-green",
      enemy: "bg-red-950/20 border border-border-active-red",
      disabled: "bg-bg-card border border-zinc-700 opacity-50",
    };

    return (
      <div
        ref={ref}
        className={cn("radius-lg p-5", variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
