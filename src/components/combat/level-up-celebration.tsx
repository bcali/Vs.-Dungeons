"use client";

import { useEffect, useState } from "react";
import { rankForLevel } from "@/lib/game/stats";

interface LevelUpHero {
  name: string;
  previousLevel: number;
  newLevel: number;
}

interface LevelUpCelebrationProps {
  heroes: LevelUpHero[];
  onComplete: () => void;
}

export function LevelUpCelebration({ heroes, onComplete }: LevelUpCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (heroes.length === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => {
        setVisible(false);
        setTimeout(onComplete, 300);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent-gold animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative text-center space-y-8">
        <h1 className="text-6xl font-black text-accent-gold tracking-wider animate-pulse drop-shadow-lg">
          LEVEL UP!
        </h1>

        <div className="space-y-6">
          {heroes.map((hero) => {
            const newRank = rankForLevel(hero.newLevel);
            const levelsGained = hero.newLevel - hero.previousLevel;
            return (
              <div
                key={hero.name}
                className="rounded-xl bg-bg-card/90 border-2 border-accent-gold px-8 py-5 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white mb-2">{hero.name}</p>
                <p className="text-lg text-zinc-300">
                  Level {hero.previousLevel} → <span className="text-accent-gold font-bold">Level {hero.newLevel}</span>
                </p>
                <p className="text-sm text-accent-gold mt-1">{newRank}</p>
                <div className="flex justify-center gap-4 mt-3 text-xs text-zinc-300">
                  <span className="bg-bg-input rounded-lg px-3 py-1">+{levelsGained} Stat Point{levelsGained > 1 ? "s" : ""}</span>
                  <span className="bg-bg-input rounded-lg px-3 py-1">+{levelsGained} Skill Point{levelsGained > 1 ? "s" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-text-muted text-sm">Click anywhere to continue</p>
      </div>
    </div>
  );
}
