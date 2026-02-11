"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  goldBorder?: boolean;
  animate?: boolean;
  title?: string;
}

export function GlassCard({
  children,
  className,
  goldBorder = false,
  animate = true,
  title,
}: GlassCardProps) {
  const inner = (
    <div
      className={cn(
        "rounded-xl bg-card-bg border border-card-border p-5 md:p-6 backdrop-blur-md",
        goldBorder && "border-l-4 border-l-accent-gold",
        className,
      )}
    >
      {title && (
        <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );

  if (animate) {
    return <motion.div variants={fadeUp}>{inner}</motion.div>;
  }
  return inner;
}
