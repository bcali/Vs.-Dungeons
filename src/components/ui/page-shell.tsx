"use client";

import { motion } from "motion/react";
import { ExplorationBackground } from "@/components/ui/exploration-background";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
  withBackground?: boolean;
}

export function PageShell({
  children,
  className,
  maxWidth = "max-w-5xl",
  padding = "px-4 py-8 md:py-12",
  withBackground = true,
}: PageShellProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {withBackground && (
        <ExplorationBackground className="fixed inset-0 z-0" />
      )}
      <motion.div
        className={cn(
          "relative z-10 flex flex-col",
          padding,
          maxWidth,
          "mx-auto",
          className,
        )}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </div>
  );
}
