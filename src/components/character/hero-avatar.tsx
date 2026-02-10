"use client";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, { box: number; cls: string }> = {
  sm: { box: 48, cls: "w-12 h-12" },
  md: { box: 64, cls: "w-16 h-16" },
  lg: { box: 128, cls: "w-32 h-32" },
};

const PROF_COLORS: Record<string, { primary: string; accent: string; css: string }> = {
  knight:   { primary: "#c0392b", accent: "#f1c40f", css: "var(--prof-knight)" },
  rogue:    { primary: "#1abc9c", accent: "#2c3e50", css: "var(--prof-rogue)" },
  wizard:   { primary: "#8e44ad", accent: "#3498db", css: "var(--prof-wizard)" },
  healer:   { primary: "#f39c12", accent: "#ecf0f1", css: "var(--prof-healer)" },
  ranger:   { primary: "#27ae60", accent: "#e67e22", css: "var(--prof-ranger)" },
  inventor: { primary: "#d35400", accent: "#95a5a6", css: "var(--prof-inventor)" },
};

interface HeroAvatarProps {
  profession: string | null;
  level?: number;
  size?: AvatarSize;
  animate?: boolean;
  glow?: boolean;
  className?: string;
}

export function HeroAvatar({
  profession,
  level = 1,
  size = "md",
  animate = true,
  glow = true,
  className,
}: HeroAvatarProps) {
  const prof = profession ?? "knight";
  const colors = PROF_COLORS[prof] || PROF_COLORS.knight;
  const s = SIZES[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center", s.cls, className)}>
      {/* Glow halo */}
      {glow && (
        <div
          className="absolute inset-0 rounded-xl opacity-20 blur-lg"
          style={{ background: colors.primary }}
        />
      )}

      {/* Avatar SVG */}
      <svg
        viewBox="0 0 64 64"
        className={cn("relative z-10", animate && "animate-avatar-bob")}
        style={{ width: s.box, height: s.box }}
      >
        {/* Body */}
        <rect x="18" y="30" width="28" height="22" rx="3" fill={colors.primary} />
        {/* Chest detail */}
        <rect x="24" y="34" width="16" height="10" rx="2" fill={colors.accent} opacity="0.3" />

        {/* Head — oversized chibi */}
        <rect x="14" y="4" width="36" height="30" rx="8" fill={colors.primary} />
        {/* Face plate */}
        <rect x="18" y="10" width="28" height="20" rx="6" fill="#f0e6ff" opacity="0.15" />

        {/* Eyes */}
        <ellipse cx="24" cy="20" rx="4" ry="4.5" fill="white" />
        <ellipse cx="40" cy="20" rx="4" ry="4.5" fill="white" />
        <ellipse cx="25" cy="20" rx="2.5" ry="3" fill={colors.accent} />
        <ellipse cx="41" cy="20" rx="2.5" ry="3" fill={colors.accent} />
        <ellipse cx="25.5" cy="19" rx="1" ry="1.2" fill="white" />
        <ellipse cx="41.5" cy="19" rx="1" ry="1.2" fill="white" />

        {/* Mouth */}
        <path d="M28 27 Q32 30 36 27" stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Arms */}
        <rect x="10" y="32" width="8" height="16" rx="3" fill={colors.primary} opacity="0.9" />
        <rect x="46" y="32" width="8" height="16" rx="3" fill={colors.primary} opacity="0.9" />

        {/* Legs */}
        <rect x="22" y="50" width="8" height="10" rx="3" fill={colors.primary} opacity="0.8" />
        <rect x="34" y="50" width="8" height="10" rx="3" fill={colors.primary} opacity="0.8" />
        {/* Boots */}
        <rect x="20" y="56" width="12" height="6" rx="2" fill={colors.accent} opacity="0.4" />
        <rect x="32" y="56" width="12" height="6" rx="2" fill={colors.accent} opacity="0.4" />

        {/* Profession-specific weapon silhouettes */}
        <ProfessionGear profession={prof} colors={colors} />
      </svg>

      {/* Level badge */}
      {level > 0 && size !== "sm" && (
        <div
          className="absolute -bottom-1 -right-1 z-20 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2"
          style={{
            background: colors.primary,
            borderColor: colors.accent,
            color: "#fff",
          }}
        >
          {level}
        </div>
      )}
    </div>
  );
}

function ProfessionGear({ profession, colors }: { profession: string; colors: { primary: string; accent: string } }) {
  switch (profession) {
    case "knight":
      return (
        <>
          {/* Sword (right hand) */}
          <rect x="52" y="24" width="4" height="22" rx="1" fill={colors.accent} />
          <rect x="48" y="28" width="12" height="3" rx="1" fill={colors.accent} opacity="0.8" />
          {/* Shield (left hand) */}
          <ellipse cx="10" cy="40" rx="8" ry="9" fill={colors.accent} opacity="0.6" />
          <ellipse cx="10" cy="40" rx="5" ry="6" fill={colors.primary} opacity="0.5" />
        </>
      );
    case "rogue":
      return (
        <>
          {/* Dual daggers */}
          <rect x="6" y="28" width="3" height="16" rx="1" fill="#bdc3c7" transform="rotate(-15 8 36)" />
          <rect x="55" y="28" width="3" height="16" rx="1" fill="#bdc3c7" transform="rotate(15 56 36)" />
        </>
      );
    case "wizard":
      return (
        <>
          {/* Staff */}
          <rect x="54" y="12" width="3" height="38" rx="1" fill="#e67e22" />
          {/* Orb on top */}
          <circle cx="55.5" cy="10" r="5" fill={colors.accent} opacity="0.7" />
          <circle cx="54" cy="8" r="1.5" fill="white" opacity="0.6" />
        </>
      );
    case "healer":
      return (
        <>
          {/* Book */}
          <rect x="4" y="34" width="10" height="12" rx="2" fill={colors.accent} opacity="0.6" />
          <rect x="6" y="36" width="6" height="8" rx="1" fill="white" opacity="0.15" />
          {/* Halo */}
          <ellipse cx="32" cy="3" rx="10" ry="3" fill={colors.accent} opacity="0.3" stroke={colors.accent} strokeWidth="1" />
        </>
      );
    case "ranger":
      return (
        <>
          {/* Bow */}
          <path d="M56 18 Q62 36 56 54" stroke={colors.accent} strokeWidth="2.5" fill="none" />
          <line x1="56" y1="18" x2="56" y2="54" stroke="#bdc3c7" strokeWidth="0.8" />
          {/* Quiver on back */}
          <rect x="8" y="26" width="6" height="14" rx="2" fill="#8B4513" opacity="0.7" />
        </>
      );
    case "inventor":
      return (
        <>
          {/* Wrench */}
          <rect x="52" y="24" width="3" height="20" rx="1" fill="#95a5a6" />
          <circle cx="53.5" cy="22" r="4" fill="none" stroke="#95a5a6" strokeWidth="2.5" />
          {/* Gadget */}
          <rect x="4" y="36" width="8" height="6" rx="1" fill={colors.accent} opacity="0.5" />
          <circle cx="8" cy="39" r="2" fill="#e74c3c" opacity="0.6" />
        </>
      );
    default:
      return null;
  }
}
