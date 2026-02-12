"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./forge-background.css";

interface ForgeBackgroundProps {
  className?: string;
}

const EMBER_COLORS = ["#ff6020", "#ff8040", "#ffaa30", "#ff4010", "#ffc060"];
const SPARK_COLORS = ["#ffcc00", "#ffaa00", "#ff8800", "#ffdd44"];

export function ForgeBackground({ className }: ForgeBackgroundProps) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 30,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 2 + 2,
      })),
    []
  );

  const embers = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
        left: 30 + Math.random() * 40,
        top: 60 + Math.random() * 30,
        size: Math.random() * 4 + 2,
        ex: Math.random() * 60 - 30,
        ey: -(Math.random() * 120 + 60),
        duration: 4 + Math.random() * 5,
        delay: Math.random() * 6,
      })),
    []
  );

  const sparks = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        left: 40 + Math.random() * 20,
        top: 70 + Math.random() * 15,
        size: Math.random() * 2 + 1,
        sx: Math.random() * 40 - 20,
        sy: -(Math.random() * 80 + 30),
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className={cn("forge-scene", className)}>
      {/* Cavern ceiling */}
      <div className="forge-ceiling" />

      {/* Stars (cracks in cavern) */}
      <div className="forge-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="forge-star"
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

      {/* Cave walls */}
      <div className="forge-walls">
        <div className="forge-wall-left" />
        <div className="forge-wall-right" />
      </div>

      {/* Forge fire glow */}
      <div className="forge-fire-glow" />

      {/* Anvil silhouette */}
      <div className="forge-anvil">
        <div className="forge-anvil-body" />
        <div className="forge-anvil-top" />
        <div className="forge-anvil-horn" />
      </div>

      {/* Ground */}
      <div className="forge-ground" />

      {/* Embers */}
      {embers.map((e) => (
        <div
          key={e.id}
          className="forge-ember"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 2}px ${e.color}`,
            "--ex": `${e.ex}px`,
            "--ey": `${e.ey}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Sparks */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="forge-spark"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            "--sx": `${s.sx}px`,
            "--sy": `${s.sy}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Heat haze */}
      <div className="forge-haze" />

      {/* Vignette */}
      <div className="forge-vignette" />

      {/* Scanlines */}
      <div className="forge-scanlines" />
    </div>
  );
}
