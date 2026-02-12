"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { EQUIPMENT_RARITY_INFO } from "@/types/game";
import type { ForgeRecipe } from "@/data/forge-recipes";

interface ForgeSuccessProps {
  recipe: ForgeRecipe;
  onCollect: () => void;
}

const SPARK_COUNT = 24;

export function ForgeSuccess({ recipe, onCollect }: ForgeSuccessProps) {
  const [phase, setPhase] = useState<'strike' | 'sparks' | 'reveal'>('strike');
  const rarityInfo = EQUIPMENT_RARITY_INFO[recipe.rarity];

  // Auto-advance phases
  const handleStrikeComplete = () => setPhase('sparks');
  const handleSparksComplete = () => setPhase('reveal');

  // Generate spark directions
  const sparks = Array.from({ length: SPARK_COUNT }).map((_, i) => {
    const angle = (i / SPARK_COUNT) * 360;
    const distance = 60 + Math.random() * 120;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.15,
      color: ['#ffcc00', '#ff8800', '#ff6020', '#ffdd44', '#ffffff'][Math.floor(Math.random() * 5)],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <div className="relative flex flex-col items-center">
        {/* Phase 1: Hammer strike */}
        <AnimatePresence>
          {phase === 'strike' && (
            <motion.div
              initial={{ y: -100, rotate: -20 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              onAnimationComplete={handleStrikeComplete}
              className="text-6xl"
            >
              {"\u{1F528}"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Spark burst */}
        <AnimatePresence>
          {phase === 'sparks' && (
            <motion.div
              className="relative w-0 h-0"
              onAnimationComplete={handleSparksComplete}
            >
              {/* Central flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${rarityInfo.color}, transparent)`,
                }}
              />

              {/* Sparks radiating outward */}
              {sparks.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.5, delay: s.delay, ease: "easeOut" }}
                  onAnimationComplete={i === 0 ? handleSparksComplete : undefined}
                  className="absolute rounded-full"
                  style={{
                    width: s.size,
                    height: s.size,
                    background: s.color,
                    boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                    left: -s.size / 2,
                    top: -s.size / 2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Item reveal */}
        <AnimatePresence>
          {phase === 'reveal' && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Item glow backdrop */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 20px ${rarityInfo.borderGlow}`,
                    `0 0 50px ${rarityInfo.borderGlow}`,
                    `0 0 20px ${rarityInfo.borderGlow}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center mb-4"
                style={{
                  background: `${rarityInfo.color}15`,
                  borderColor: rarityInfo.color,
                }}
              >
                <span className="text-4xl">{recipe.icon}</span>
              </motion.div>

              {/* Item name */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold mb-1"
                style={{ color: rarityInfo.color }}
              >
                {recipe.name}
              </motion.h2>

              {/* Rarity badge */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs uppercase tracking-widest mb-1 font-mono"
                style={{ color: rarityInfo.color }}
              >
                {rarityInfo.name}
              </motion.p>

              {/* Effect */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-green-400 mb-6"
              >
                {recipe.effect}
              </motion.p>

              {/* Collect button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCollect}
                className={cn(
                  "rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all",
                  "bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30",
                  "border-b-2 border-yellow-700 active:border-b-0 active:translate-y-0.5"
                )}
              >
                {"\u2728"} Collect
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
