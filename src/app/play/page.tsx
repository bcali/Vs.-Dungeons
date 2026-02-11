"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Compass,
  Swords,
  Clock,
  Shield,
  Users,
  Star,
  Map,
  Wrench,
} from "lucide-react";
import { ExplorationBackground } from "@/components/ui/exploration-background";

/* ── Quest data (hardcoded for now — will eventually come from Supabase) ── */

const QUEST = {
  title: "The Stolen Crown",
  level: 1,
  heroes: "2 (any professions)",
  duration: "30-45 min",
  encounters: 3,
  difficulty: "Easy \u2192 Boss",
  specialRules: "Heroic Start",
  storyHook:
    "The village of Brickton has been peaceful for years, protected by the Golden Crown \u2014 a magic artifact that keeps the village gates sealed against monsters. But last night, a band of goblins crept in through the sewers and stole the Crown! Without it, the village gates are weakening. Monsters are already gathering in the forest. Track the goblins through the Dark Forest, enter the Old Mine, and defeat the Goblin King to reclaim the Stolen Crown!",
  scenes: [
    { name: "Brickton Village", type: "Roleplay", icon: "village" },
    { name: "The Dark Forest", type: "Easy Combat", icon: "combat" },
    { name: "The Mine Entrance", type: "Medium + Puzzle", icon: "puzzle" },
    { name: "Goblin King\u2019s Throne", type: "Boss Fight", icon: "boss" },
    { name: "Victory!", type: "Rewards", icon: "reward" },
  ],
  tease: "The Shadow Tower looms on the horizon\u2026 what waits inside?",
};

const SCENE_ICONS: Record<string, string> = {
  village: "\uD83C\uDFE0",
  combat: "\u2694\uFE0F",
  puzzle: "\uD83D\uDD12",
  boss: "\uD83D\uDC51",
  reward: "\uD83C\uDF1F",
};

/* ── Detail card config ── */

const DETAIL_CARDS = [
  { label: "Level", value: String(QUEST.level), Icon: Star },
  { label: "Heroes", value: QUEST.heroes, Icon: Users },
  { label: "Duration", value: QUEST.duration, Icon: Clock },
  { label: "Encounters", value: String(QUEST.encounters), Icon: Swords },
  { label: "Difficulty", value: QUEST.difficulty, Icon: Shield },
  { label: "Special", value: QUEST.specialRules, Icon: Wrench },
];

/* ── Animation stagger helpers ── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ── Page ── */

export default function PlayPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ExplorationBackground className="fixed inset-0 z-0" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-4 py-8 md:py-12 max-w-2xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Back link */}
        <motion.div variants={fadeUp} className="self-start mb-8">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            &larr; Home
          </Link>
        </motion.div>

        {/* Quest banner */}
        <motion.div variants={fadeUp} className="text-center mb-8 w-full">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-accent-gold" />
            <span className="text-xs font-mono text-accent-gold uppercase tracking-widest">
              Quest Briefing
            </span>
            <Compass className="w-4 h-4 text-accent-gold" />
          </div>
          <h1
            className="text-2xl md:text-4xl font-mono text-lego-yellow leading-tight"
            style={{
              textShadow:
                "3px 3px 0px #000, 0px 0px 20px rgba(242, 205, 55, 0.4)",
            }}
          >
            {QUEST.title.toUpperCase()}
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            A Level {QUEST.level} Adventure
          </p>
        </motion.div>

        {/* Story hook */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-xl bg-card-bg border border-card-border p-5 md:p-6 border-l-4 border-l-accent-gold mb-8 backdrop-blur-md"
        >
          <p className="text-text-secondary text-sm md:text-base leading-relaxed italic">
            &ldquo;{QUEST.storyHook}&rdquo;
          </p>
        </motion.div>

        {/* Detail cards */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-8"
        >
          {DETAIL_CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-lg bg-bg-input/80 border border-border-card p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <card.Icon className="w-3.5 h-3.5 text-accent-gold/70" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
                  {card.label}
                </span>
              </div>
              <p className="text-sm font-bold text-text-primary">{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Scene timeline */}
        <motion.div variants={fadeUp} className="w-full mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-4 h-4 text-accent-gold/70" />
            <h2 className="text-xs font-mono text-accent-gold uppercase tracking-widest">
              Scenes
            </h2>
          </div>
          <div className="relative border-l-2 border-accent-gold/20 ml-3 pl-6 space-y-4">
            {QUEST.scenes.map((scene, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-accent-gold/60"
                  style={{
                    background:
                      i === QUEST.scenes.length - 1
                        ? "var(--accent-gold)"
                        : "var(--bg-input)",
                  }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {SCENE_ICONS[scene.icon] || "\u2022"}
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {scene.name}
                  </span>
                  <span className="text-xs text-text-muted">&mdash;</span>
                  <span className="text-xs text-text-secondary italic">
                    {scene.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row gap-3 w-full mb-10"
        >
          <Link href="/combat/setup" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-lego-green hover:bg-green-600 text-white font-black text-xl px-8 py-4 rounded-lg border-b-6 border-green-800 shadow-xl active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              <Swords className="w-6 h-6" />
              Begin Quest
            </motion.button>
          </Link>
          <Link href="/combat/setup" className="md:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-bg-input/80 hover:bg-bg-input text-text-secondary hover:text-text-primary border border-border-card px-6 py-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Custom Encounter
            </motion.button>
          </Link>
        </motion.div>

        {/* Story tease */}
        <motion.p
          variants={fadeUp}
          className="text-center text-text-dim text-xs italic"
        >
          &ldquo;{QUEST.tease}&rdquo;
        </motion.p>
      </motion.div>
    </div>
  );
}
