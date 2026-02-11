"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./exploration-background.css";

interface ExplorationBackgroundProps {
  className?: string;
}

const FIREFLY_COLORS = ["#88ff66", "#aaff44", "#ffdd44", "#66ff88", "#ccff66"];
const LEAF_COLORS = ["#2a5a1a", "#4a3a10", "#6a5520", "#1a4a12", "#8a6a20"];

export function ExplorationBackground({ className }: ExplorationBackgroundProps) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 40,
        size: Math.random() * 2.5 + 0.8,
        delay: Math.random() * 4,
        duration: Math.random() * 2 + 2,
      })),
    []
  );

  const fireflies = React.useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
        left: 10 + Math.random() * 80,
        top: 25 + Math.random() * 45,
        size: Math.random() * 4 + 2,
        fx: Math.random() * 60 - 30,
        fy: -(Math.random() * 40 + 10),
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 8,
      })),
    []
  );

  const leaves = React.useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        left: 5 + Math.random() * 90,
        size: Math.random() * 6 + 4,
        lx: Math.random() * 80 - 40,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 10,
      })),
    []
  );

  return (
    <div className={cn("exploration-scene", className)}>
      {/* Sky */}
      <div className="exploration-sky" />

      {/* Stars */}
      <div className="exploration-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="exploration-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="exploration-moon" />

      {/* Mountains */}
      <div className="exploration-mountains">
        <div className="exploration-mountain exploration-mountain-1" />
        <div className="exploration-mountain exploration-mountain-2" />
        <div className="exploration-mountain exploration-mountain-3" />
      </div>

      {/* Far trees */}
      <div className="exploration-trees-far">
        <FarTree left="5%" height={120} opacity={0.5} sway={1} />
        <FarTree left="18%" height={100} opacity={0.45} sway={2} />
        <FarTree left="32%" height={130} opacity={0.55} sway={3} />
        <FarTree left="60%" height={110} opacity={0.5} sway={1} />
        <FarTree left="75%" height={125} opacity={0.48} sway={2} />
        <FarTree left="90%" height={105} opacity={0.42} sway={3} />
      </div>

      {/* Path */}
      <div className="exploration-path" />

      {/* Mine entrance */}
      <div className="exploration-mine" />

      {/* Near trees — framing the path */}
      <div className="exploration-trees-near">
        <NearTree side="left" offset="0%" height={320} />
        <NearTree side="left" offset="8%" height={280} />
        <NearTree side="right" offset="0%" height={300} />
        <NearTree side="right" offset="10%" height={260} />
      </div>

      {/* Ground */}
      <div className="exploration-ground" />

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="exploration-firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            background: f.color,
            boxShadow: `0 0 ${f.size * 2}px ${f.color}`,
            "--fx": `${f.fx}px`,
            "--fy": `${f.fy}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Fog */}
      <div className="exploration-fog" />

      {/* Floating leaves */}
      {leaves.map((l) => (
        <div
          key={l.id}
          className="exploration-leaf"
          style={{
            left: `${l.left}%`,
            top: "-10px",
            width: l.size,
            height: l.size * 0.6,
            background: l.color,
            "--lx": `${l.lx}px`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}

      {/* Vignette */}
      <div className="exploration-vignette" />

      {/* Scanlines */}
      <div className="exploration-scanlines" />
    </div>
  );
}

/* === SVG Tree Components === */

function FarTree({ left, height, opacity, sway }: { left: string; height: number; opacity: number; sway: 1 | 2 | 3 }) {
  const w = height * 0.5;
  return (
    <div
      className={`exploration-tree-far exploration-tree-sway-${sway}`}
      style={{ left, opacity, transformOrigin: "bottom center" }}
    >
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} xmlns="http://www.w3.org/2000/svg">
        {/* Trunk */}
        <rect x={w * 0.42} y={height * 0.7} width={w * 0.16} height={height * 0.3} fill="#1a0f08" />
        {/* Foliage layers */}
        <polygon points={`${w / 2},0 ${w * 0.05},${height * 0.45} ${w * 0.95},${height * 0.45}`} fill="#0a1f0a" />
        <polygon points={`${w / 2},${height * 0.15} ${w * 0.1},${height * 0.6} ${w * 0.9},${height * 0.6}`} fill="#0d2a0d" />
        <polygon points={`${w / 2},${height * 0.3} ${w * 0.15},${height * 0.75} ${w * 0.85},${height * 0.75}`} fill="#0f1f0f" />
      </svg>
    </div>
  );
}

function NearTree({ side, offset, height }: { side: "left" | "right"; offset: string; height: number }) {
  const w = height * 0.6;
  const posStyle: React.CSSProperties = side === "left"
    ? { left: offset, transform: "translateX(-40%)" }
    : { right: offset, transform: "translateX(40%)" };

  return (
    <div className="exploration-tree-near" style={posStyle}>
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} xmlns="http://www.w3.org/2000/svg">
        {/* Trunk */}
        <rect x={w * 0.4} y={height * 0.65} width={w * 0.2} height={height * 0.35} fill="#0d0804" />
        {/* Foliage — big dark shapes */}
        <polygon points={`${w / 2},0 ${w * 0.0},${height * 0.4} ${w},${height * 0.4}`} fill="#071507" />
        <polygon points={`${w / 2},${height * 0.12} ${w * 0.05},${height * 0.55} ${w * 0.95},${height * 0.55}`} fill="#091a09" />
        <polygon points={`${w / 2},${height * 0.25} ${w * 0.1},${height * 0.7} ${w * 0.9},${height * 0.7}`} fill="#071207" />
      </svg>
    </div>
  );
}
