"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface PageHeaderProps {
  title: string;
  backHref: string;
  backLabel?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  backHref,
  backLabel = "Home",
  subtitle,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div variants={fadeUp} className={cn("mb-8 w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <Link
          href={backHref}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          &larr; {backLabel}
        </Link>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div className="text-center">
        {Icon && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon className="w-4 h-4 text-accent-gold" />
          </div>
        )}
        <h1
          className="text-xl md:text-3xl font-mono text-lego-yellow leading-tight uppercase"
          style={{
            textShadow:
              "3px 3px 0px #000, 0px 0px 20px rgba(242, 205, 55, 0.4)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
