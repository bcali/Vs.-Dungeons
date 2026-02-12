"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Settings,
  Trophy,
  Gamepad2,
  Newspaper,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ExplorationBackground } from "@/components/ui/exploration-background";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="flex h-screen bg-bg-page text-white overflow-hidden font-sans selection:bg-accent-gold selection:text-black">
      {/* --- Left Sidebar (Launcher Style) --- */}
      <div className="w-20 md:w-64 flex-shrink-0 bg-card-bg/80 backdrop-blur-xl border-r border-card-border flex flex-col z-20">
        {/* User Profile Stub */}
        <div className="p-4 flex items-center gap-3 border-b border-card-border">
          <div className="w-10 h-10 rounded-md bg-accent-gold flex items-center justify-center text-black font-bold text-xl shrink-0 border-2 border-white/10 shadow-lg">
            GM
          </div>
          <div className="hidden md:block overflow-hidden">
            <div className="font-black text-sm truncate tracking-wide">
              DungeonMaster
            </div>
            <div className="text-xs text-hp-high font-bold">Online</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 space-y-2 px-2">
          <SidebarItem
            icon={Gamepad2}
            label="Play"
            isActive={activeTab === "play"}
            onClick={() => setActiveTab("play")}
          />
          <SidebarItem
            icon={Newspaper}
            label="Patch Notes"
            isActive={activeTab === "news"}
            onClick={() => setActiveTab("news")}
          />
          <div className="my-4 border-t border-card-border" />
          <Link href="/character">
            <SidebarItem icon={Users} label="My Heroes" isActive={false} />
          </Link>
          <Link href="/combat">
            <SidebarItem icon={Trophy} label="Combat" isActive={false} />
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-card-border">
          <Link href="/config">
            <SidebarItem icon={Settings} label="Settings" isActive={false} />
          </Link>
          <div className="mt-4 hidden md:block text-[10px] text-text-dim text-center font-mono tracking-wider">
            Vs. Dungeons Launcher v1.4.2
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 relative flex flex-col min-w-0 bg-bg-page">
        {/* Background */}
        <ExplorationBackground className="absolute inset-0 z-0" />

        {/* Top Bar */}
        <div className="relative z-10 p-6 flex justify-between items-start">
          <div className="flex gap-4">
            <span className="text-xs font-black text-white uppercase tracking-widest px-3 py-1.5 rounded bg-lego-red border-b-4 border-red-900 shadow-lg transform rotate-[-2deg] font-mono">
              Season 4: Blocky Realms
            </span>
          </div>
        </div>

        {/* Center Content - Hero & Logo */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20 pointer-events-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className="relative inline-block pointer-events-auto">
              {/* VS. — big, golden, stacked block shadow */}
              <h1 className="font-mono font-black tracking-tight leading-none select-none">
                <span
                  className="block text-7xl md:text-[10rem] text-lego-yellow"
                  style={{
                    textShadow:
                      "3px 3px 0 #b8860b, 6px 6px 0 #000, 0 0 40px rgba(242,205,55,0.3)",
                  }}
                >
                  VS.
                </span>

                {/* Pixel sword divider */}
                <div className="flex items-center justify-center gap-3 -my-1 md:-my-2">
                  <div className="h-[3px] w-12 md:w-20 bg-gradient-to-r from-transparent via-accent-gold to-accent-gold/40" />
                  <svg viewBox="0 0 24 12" className="w-8 md:w-12 h-4 md:h-6 text-accent-gold" fill="currentColor">
                    {/* Pixel blade */}
                    <rect x="0" y="5" width="16" height="2" />
                    <rect x="14" y="4" width="2" height="4" />
                    <rect x="16" y="3" width="2" height="6" />
                    {/* Crossguard */}
                    <rect x="12" y="1" width="2" height="10" />
                    {/* Handle */}
                    <rect x="18" y="4.5" width="4" height="3" rx="0.5" opacity="0.6" />
                    <rect x="22" y="4" width="2" height="4" rx="1" opacity="0.4" />
                  </svg>
                  <div className="h-[3px] w-12 md:w-20 bg-gradient-to-l from-transparent via-accent-gold to-accent-gold/40" />
                </div>

                <span
                  className="block text-5xl md:text-8xl text-lego-red"
                  style={{
                    textShadow:
                      "3px 3px 0 #8b0000, 6px 6px 0 #000, 0 0 30px rgba(227,0,11,0.25)",
                  }}
                >
                  DUNGEONS
                </span>
              </h1>

              {/* Floating blocks — slightly subtler */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [8, 12, 8] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -top-8 -right-10 w-12 h-12 md:w-14 md:h-14 bg-lego-blue rounded-sm shadow-lg opacity-80"
                style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/15" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [-8, -12, -8] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }}
                className="absolute -bottom-6 -left-12 w-10 h-10 md:w-12 md:h-12 bg-lego-green rounded-sm shadow-lg opacity-80"
                style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/15" />
                </div>
              </motion.div>
            </div>

            <p className="mt-6 font-mono font-bold text-lg md:text-2xl tracking-wide uppercase">
              <span
                className="text-text-secondary"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                Build your heroes. Fight the monsters.
              </span>
              <br />
              <span
                className="text-accent-gold"
                style={{ textShadow: "2px 2px 0 #000, 0 0 12px rgba(242,205,55,0.3)" }}
              >
                Save the realm.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Bottom Play Bar */}
        <div className="relative z-20 bg-card-bg/90 backdrop-blur-xl border-t-4 border-card-border p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden md:block w-16 h-16 bg-lego-blue rounded-md border-b-4 border-blue-900 relative overflow-hidden group cursor-pointer shadow-lg transform transition-transform hover:-translate-y-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/10" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-black text-xl tracking-wide font-mono">
                Vs. Dungeons
              </h3>
              <div className="flex items-center gap-2 text-sm text-text-muted font-bold">
                <span>Ready to play</span>
                <span className="w-2 h-2 rounded-full bg-lego-green animate-pulse" />
              </div>
            </div>
          </div>

          <Link href="/play" className="w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-lego-green hover:bg-green-600 text-white font-black text-3xl px-16 py-5 rounded-lg border-b-8 border-green-800 shadow-xl active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              Play Now
            </motion.button>
          </Link>

          <div className="hidden md:flex gap-3">
            <Link href="/character">
              <Button
                variant="game-secondary"
                className="h-14 px-6 rounded-md text-lg border-b-4 border-black"
              >
                <Users className="mr-2 w-5 h-5" />
                Heroes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function SidebarItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-all font-bold",
        isActive
          ? "bg-bg-input text-white border-l-4 border-accent-gold"
          : "text-text-muted hover:text-white hover:bg-bg-card"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-transform group-hover:scale-110",
          isActive && "text-accent-gold"
        )}
      />
      <span className="hidden md:block text-sm font-mono uppercase tracking-wider">{label}</span>
    </div>
  );
}
