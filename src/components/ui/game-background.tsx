"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface GameBackgroundProps {
  className?: string;
}

export function GameBackground({ className }: GameBackgroundProps) {
  const stars = useMemo(() => {
    const result: { x: number; y: number; size: number; opacity: number; delay: number }[] = [];
    for (let i = 0; i < 60; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 4,
      });
    }
    return result;
  }, []);

  const particles = useMemo(() => {
    const colors = [
      "bg-prof-knight",     // crimson
      "bg-prof-wizard",     // purple
      "bg-prof-ranger",     // green
      "bg-accent-gold",     // gold
      "bg-prof-rogue",      // teal
      "bg-lego-blue",       // blue
    ];
    const result: { color: string; size: number; x: number; duration: number; delay: number }[] = [];
    for (let i = 0; i < 7; i++) {
      result.push({
        color: colors[i % colors.length],
        size: Math.random() * 10 + 6,
        x: Math.random() * 100,
        duration: Math.random() * 15 + 20,
        delay: Math.random() * 10,
      });
    }
    return result;
  }, []);

  return (
    <div className={cn("pointer-events-none select-none overflow-hidden", className)}>
      {/* Deep gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0d0221 0%, #1a0a3e 40%, #0d0221 100%)",
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating colored blocks */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className={cn("absolute rounded-sm animate-float-drift", p.color)}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              bottom: "-20px",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
