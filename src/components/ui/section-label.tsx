"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionLabelProps {
  label: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionLabel({ label, icon: Icon, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      {Icon && <Icon className="w-4 h-4 text-accent-gold/70" />}
      <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
        {label}
      </h2>
    </div>
  );
}
