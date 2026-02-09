"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./lego-battle-background.css";

interface LegoBattleBackgroundProps {
  className?: string;
}

const PARTICLE_COLORS = ["#ff6600", "#ffcc00", "#66bbff", "#cc66ff", "#66ff66", "#ff3366"];
const EMBER_COLORS = ["#ff6600", "#ff8800", "#ffaa00", "#ff4400"];
const RAY_COLORS = [
  "rgba(255,200,0,0.6)",
  "rgba(255,100,0,0.5)",
  "rgba(100,200,255,0.4)",
  "rgba(255,60,60,0.4)",
];

export function LegoBattleBackground({ className }: LegoBattleBackgroundProps) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 50,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 1.5,
      })),
    []
  );

  const speedLines = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: 20 + Math.random() * 50,
        width: 100 + Math.random() * 200,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.8,
      })),
    []
  );

  const energyRays = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        angle: (i / 12) * 360,
        color: RAY_COLORS[i % 4],
        delay: i * 0.15,
      })),
    []
  );

  const particles = React.useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        left: 15 + Math.random() * 70,
        bottom: 5 + Math.random() * 20,
        size: Math.random() * 5 + 2,
        dx: Math.random() * 60 - 30,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    []
  );

  const embers = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => {
        const color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
        return {
          id: i,
          left: 20 + Math.random() * 60,
          bottom: 5 + Math.random() * 15,
          ex: Math.random() * 80 - 40,
          duration: 3 + Math.random() * 4,
          delay: Math.random() * 5,
          color,
        };
      }),
    []
  );

  return (
    <div className={cn("battle-scene", className)}>
      {/* Sky */}
      <div className="battle-sky" />

      {/* Stars */}
      <div className="battle-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="battle-star"
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
      <div className="battle-moon" />

      {/* Mountains */}
      <div className="battle-mountains">
        <div className="battle-mountain battle-mountain-1" />
        <div className="battle-mountain battle-mountain-2" />
        <div className="battle-mountain battle-mountain-3" />
        <div className="battle-mountain battle-mountain-4" />
      </div>

      {/* Dark Tower */}
      <div className="battle-tower" />

      {/* Ground */}
      <div className="battle-ground" />

      {/* Speed lines */}
      <div className="battle-speed-lines">
        {speedLines.map((l) => (
          <div
            key={l.id}
            className="battle-speed-line"
            style={{
              top: `${l.top}%`,
              left: 0,
              width: l.width,
              animationDelay: `${l.delay}s`,
              animationDuration: `${l.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Spell projectiles */}
      <div className="battle-spell-bolt battle-bolt-fire" />
      <div className="battle-spell-bolt battle-bolt-ice" />
      <div className="battle-spell-bolt battle-bolt-arrow" />
      <div className="battle-spell-bolt battle-bolt-dark" />

      {/* Energy clash */}
      <div className="battle-clash-point">
        <div className="battle-clash-burst" />
        <div>
          {energyRays.map((r) => (
            <div
              key={r.id}
              className="battle-energy-ray"
              style={{
                background: `linear-gradient(90deg, ${r.color}, transparent)`,
                transform: `rotate(${r.angle}deg)`,
                animationDelay: `${r.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* HEROES (Left Side) */}
      <div className="battle-heroes">
        <KnightSVG />
        <MageSVG />
        <RogueSVG />
        <RangerSVG />
      </div>

      {/* VILLAINS (Right Side) */}
      <div className="battle-villains">
        <OrcSVG />
        <GolemSVG />
        <WitchSVG />
      </div>

      {/* Floating particles */}
      <div className="battle-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="battle-particle"
            style={
              {
                background: p.color,
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                width: p.size,
                height: p.size,
                "--dx": `${p.dx}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Embers */}
      <div>
        {embers.map((e) => (
          <div
            key={e.id}
            className="battle-ember"
            style={
              {
                left: `${e.left}%`,
                bottom: `${e.bottom}%`,
                "--ex": `${e.ex}px`,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                background: e.color,
                boxShadow: `0 0 4px ${e.color}`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="battle-vignette" />

      {/* Scanlines */}
      <div className="battle-scanlines" />
    </div>
  );
}

/* ====== SVG CHARACTER COMPONENTS ====== */

function KnightSVG() {
  return (
    <div className="battle-character battle-knight">
      <svg viewBox="0 0 140 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="115" cy="60" rx="15" ry="40" fill="rgba(100,180,255,0.2)" />
        <rect x="40" y="80" width="45" height="55" rx="5" fill="#2855a8" />
        <rect x="40" y="80" width="45" height="20" rx="3" fill="#3268c4" />
        <rect x="45" y="90" width="35" height="15" rx="2" fill="#4080e0" opacity="0.5" />
        <ellipse cx="38" cy="85" rx="12" ry="8" fill="#3670d0" />
        <ellipse cx="87" cy="85" rx="12" ry="8" fill="#3670d0" />
        <rect x="48" y="50" width="30" height="30" rx="4" fill="#ffd280" />
        <path d="M45 65 L48 45 Q63 35 78 45 L80 65" fill="#6699dd" stroke="#4477bb" strokeWidth="1.5" />
        <rect x="48" y="60" width="30" height="8" rx="1" fill="#5588cc" />
        <rect x="52" y="62" width="22" height="3" rx="1" fill="#1a1a2e" />
        <circle cx="57" cy="63" r="1.5" fill="#88ddff" />
        <circle cx="67" cy="63" r="1.5" fill="#88ddff" />
        <path d="M63 45 L63 32 Q63 28 60 30 L63 38" fill="#ff4444" />
        <path d="M20 82 L18 120 L33 130 L38 85 Z" fill="#3366bb" stroke="#2255aa" strokeWidth="1.5" />
        <path d="M25 90 L28 118 L33 122 L35 92 Z" fill="#4488dd" opacity="0.4" />
        <polygon points="28,98 32,92 36,98 34,106 30,106" fill="#ffcc00" />
        <line x1="95" y1="85" x2="120" y2="30" stroke="#c0d8f0" strokeWidth="5" strokeLinecap="round" />
        <line x1="95" y1="85" x2="120" y2="30" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round" />
        <rect x="88" y="82" width="18" height="5" rx="2" fill="#aa8833" />
        <line x1="120" y1="30" x2="125" y2="15" stroke="rgba(100,200,255,0.6)" strokeWidth="8" strokeLinecap="round" />
        <rect x="85" y="85" width="10" height="30" rx="3" fill="#2855a8" />
        <rect x="30" y="85" width="10" height="25" rx="3" fill="#2855a8" />
        <rect x="45" y="135" width="15" height="35" rx="3" fill="#1e3a6e" />
        <rect x="65" y="135" width="15" height="35" rx="3" fill="#1e3a6e" />
        <rect x="43" y="165" width="19" height="10" rx="3" fill="#444" />
        <rect x="63" y="165" width="19" height="10" rx="3" fill="#444" />
        <path d="M48 78 Q35 120 30 170 L55 160 Q55 120 50 85" fill="rgba(200,50,50,0.7)" />
      </svg>
    </div>
  );
}

function MageSVG() {
  return (
    <div className="battle-character battle-mage">
      <svg viewBox="0 0 130 190" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="50" r="20" fill="rgba(180,60,255,0.15)" />
        <circle cx="25" cy="50" r="12" fill="rgba(200,100,255,0.1)" />
        <path d="M40 85 L35 160 L90 160 L85 85" fill="#5020a0" />
        <path d="M40 85 L35 160 L62 155 L55 85" fill="#6030b8" opacity="0.5" />
        <path d="M35 155 Q62 150 90 155 L90 160 Q62 156 35 160 Z" fill="#8844dd" opacity="0.5" />
        <rect x="42" y="110" width="40" height="6" rx="2" fill="#aa66ff" opacity="0.6" />
        <polygon points="50,120 51,117 54,117 52,115 53,112 50,114 47,112 48,115 46,117 49,117" fill="#ccaaff" opacity="0.4" />
        <polygon points="72,130 73,127 76,127 74,125 75,122 72,124 69,122 70,125 68,127 71,127" fill="#ccaaff" opacity="0.4" />
        <rect x="48" y="58" width="28" height="27" rx="4" fill="#ffe0b0" />
        <path d="M42 68 L65 10 L82 68" fill="#5020a0" />
        <path d="M42 68 L55 15 L65 68" fill="#6030b8" opacity="0.4" />
        <rect x="38" y="64" width="50" height="8" rx="3" fill="#6830c0" />
        <polygon points="62,35 64,30 66,35 64,32" fill="#ffcc00" />
        <circle cx="55" cy="70" r="3" fill="#cc66ff" />
        <circle cx="68" cy="70" r="3" fill="#cc66ff" />
        <circle cx="55" cy="70" r="1.5" fill="#fff" />
        <circle cx="68" cy="70" r="1.5" fill="#fff" />
        <path d="M50 80 Q60 95 55 100 Q62 92 70 80" fill="#ddd" opacity="0.7" />
        <line x1="25" y1="50" x2="32" y2="140" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" />
        <circle cx="25" cy="45" r="10" fill="rgba(180,80,255,0.6)" />
        <circle cx="25" cy="45" r="6" fill="rgba(220,150,255,0.8)" />
        <circle cx="23" cy="43" r="2" fill="#fff" opacity="0.7" />
        <circle cx="25" cy="45" r="15" fill="none" stroke="rgba(180,80,255,0.3)" strokeWidth="2">
          <animate attributeName="r" values="15;25;15" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <rect x="80" y="88" width="10" height="25" rx="3" fill="#5020a0" transform="rotate(-20 85 88)" />
        <rect x="30" y="85" width="10" height="30" rx="3" fill="#5020a0" transform="rotate(10 35 85)" />
        <rect x="48" y="152" width="12" height="12" rx="2" fill="#3a1580" />
        <rect x="64" y="152" width="12" height="12" rx="2" fill="#3a1580" />
      </svg>
    </div>
  );
}

function RogueSVG() {
  return (
    <div className="battle-character battle-rogue">
      <svg viewBox="0 0 110 170" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="65" width="40" height="45" rx="4" fill="#2a2a2a" />
        <path d="M30 65 L40 65 L40 110 L30 110" fill="#333" opacity="0.5" />
        <line x1="35" y1="70" x2="65" y2="95" stroke="#555" strokeWidth="2" />
        <line x1="65" y1="70" x2="35" y2="95" stroke="#555" strokeWidth="2" />
        <rect x="36" y="38" width="26" height="27" rx="4" fill="#ffd280" />
        <path d="M30 52 Q49 25 70 52 L68 65 L32 65 Z" fill="#1a1a1a" />
        <path d="M32 52 Q49 28 68 52" fill="#222" opacity="0.5" />
        <path d="M40 50 L47 48 L47 52 Z" fill="#00ff88" />
        <path d="M58 50 L51 48 L51 52 Z" fill="#00ff88" />
        <rect x="36" y="55" width="26" height="8" rx="2" fill="#1a1a1a" />
        <line x1="78" y1="60" x2="100" y2="40" stroke="#c0c0c0" strokeWidth="3" strokeLinecap="round" />
        <line x1="78" y1="60" x2="100" y2="40" stroke="#e0e0e0" strokeWidth="1.5" />
        <line x1="15" y1="75" x2="5" y2="55" stroke="#c0c0c0" strokeWidth="3" strokeLinecap="round" />
        <line x1="15" y1="75" x2="5" y2="55" stroke="#e0e0e0" strokeWidth="1.5" />
        <rect x="74" y="58" width="10" height="4" rx="1" fill="#888" transform="rotate(-30 79 60)" />
        <rect x="11" y="73" width="10" height="4" rx="1" fill="#888" transform="rotate(-30 16 75)" />
        <rect x="70" y="68" width="8" height="25" rx="3" fill="#2a2a2a" transform="rotate(-15 74 68)" />
        <rect x="22" y="68" width="8" height="25" rx="3" fill="#2a2a2a" transform="rotate(10 26 68)" />
        <rect x="33" y="110" width="14" height="35" rx="3" fill="#222" transform="rotate(-8 40 110)" />
        <rect x="55" y="110" width="14" height="35" rx="3" fill="#222" transform="rotate(12 62 110)" />
        <rect x="28" y="140" width="18" height="8" rx="3" fill="#333" transform="rotate(-8 37 144)" />
        <rect x="58" y="142" width="18" height="8" rx="3" fill="#333" transform="rotate(12 67 146)" />
        <path d="M35 65 Q15 100 10 145 Q20 140 30 130 Q32 100 35 75" fill="rgba(30,30,30,0.8)" />
        <circle cx="95" cy="42" r="4" fill="rgba(0,255,100,0.4)">
          <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function RangerSVG() {
  return (
    <div className="battle-character battle-ranger">
      <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
        <rect x="38" y="75" width="38" height="48" rx="4" fill="#2d5a1e" />
        <rect x="38" y="75" width="20" height="48" rx="3" fill="#357522" opacity="0.4" />
        <rect x="42" y="48" width="26" height="27" rx="4" fill="#e8c090" />
        <path d="M38 58 Q55 30 72 58 L70 68 L40 68 Z" fill="#2d5a1e" />
        <circle cx="55" cy="42" r="3" fill="#8bc34a" opacity="0.6" />
        <circle cx="49" cy="60" r="2" fill="#66bb6a" />
        <circle cx="62" cy="60" r="2" fill="#66bb6a" />
        <circle cx="49" cy="59.5" r="1" fill="#fff" />
        <circle cx="62" cy="59.5" r="1" fill="#fff" />
        <path d="M85 40 Q105 75 85 115" fill="none" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
        <line x1="85" y1="40" x2="65" y2="78" stroke="#ddd" strokeWidth="1.5" />
        <line x1="65" y1="78" x2="85" y2="115" stroke="#ddd" strokeWidth="1.5" />
        <line x1="65" y1="78" x2="45" y2="78" stroke="#8B4513" strokeWidth="2" />
        <polygon points="43,78 48,75 48,81" fill="#aaa" />
        <circle cx="45" cy="78" r="5" fill="rgba(100,255,60,0.3)">
          <animate attributeName="r" values="5;8;5" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <rect x="28" y="70" width="8" height="35" rx="2" fill="#654321" />
        <line x1="30" y1="68" x2="28" y2="60" stroke="#8B4513" strokeWidth="2" />
        <line x1="32" y1="68" x2="31" y2="58" stroke="#8B4513" strokeWidth="2" />
        <line x1="34" y1="68" x2="35" y2="60" stroke="#8B4513" strokeWidth="2" />
        <rect x="72" y="78" width="8" height="20" rx="3" fill="#2d5a1e" />
        <rect x="28" y="78" width="8" height="20" rx="3" fill="#2d5a1e" />
        <rect x="42" y="123" width="13" height="32" rx="3" fill="#2a4a18" />
        <rect x="58" y="123" width="13" height="32" rx="3" fill="#2a4a18" />
        <rect x="40" y="150" width="17" height="8" rx="3" fill="#5d4037" />
        <rect x="56" y="150" width="17" height="8" rx="3" fill="#5d4037" />
        <path d="M42 72 Q25 110 22 155 L42 145 Q40 110 42 80" fill="rgba(30,80,20,0.6)" />
      </svg>
    </div>
  );
}

function OrcSVG() {
  return (
    <div className="battle-character battle-orc">
      <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="85" width="65" height="65" rx="6" fill="#4a6b20" />
        <rect x="40" y="85" width="35" height="65" fill="#557728" opacity="0.3" rx="3" />
        <line x1="55" y1="95" x2="80" y2="120" stroke="#3a5515" strokeWidth="3" opacity="0.6" />
        <rect x="48" y="45" width="45" height="40" rx="6" fill="#5a8030" />
        <path d="M48 72 Q70 90 93 72" fill="#4a6b20" />
        <path d="M55 58 L66 55 L66 63 Z" fill="#ff3300" />
        <path d="M85 58 L74 55 L74 63 Z" fill="#ff3300" />
        <circle cx="61" cy="58" r="2" fill="#ffcc00" />
        <circle cx="79" cy="58" r="2" fill="#ffcc00" />
        <path d="M55 74 L52 82 L58 76" fill="#eee" />
        <path d="M85 74 L88 82 L82 76" fill="#eee" />
        <path d="M50 52 Q60 48 70 54" fill="none" stroke="#3a5515" strokeWidth="3" />
        <path d="M90 52 Q80 48 70 54" fill="none" stroke="#3a5515" strokeWidth="3" />
        <path d="M45 50 L48 35 Q70 28 92 35 L95 50" fill="#555" stroke="#444" strokeWidth="1" />
        <circle cx="70" cy="36" r="4" fill="#8b0000" />
        <line x1="15" y1="30" x2="55" y2="120" stroke="#8B4513" strokeWidth="7" strokeLinecap="round" />
        <path d="M5 15 Q-5 30 15 40 L25 25 Q15 10 5 15" fill="#666" stroke="#555" strokeWidth="1.5" />
        <path d="M8 18 Q2 28 15 35" fill="#888" opacity="0.3" />
        <circle cx="12" cy="28" r="15" fill="rgba(255,50,20,0.15)">
          <animate attributeName="r" values="15;22;15" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="25" y="88" width="15" height="40" rx="5" fill="#4a6b20" transform="rotate(15 32 88)" />
        <rect x="105" y="88" width="15" height="35" rx="5" fill="#4a6b20" transform="rotate(-10 112 88)" />
        <rect x="28" y="100" width="12" height="5" rx="2" fill="#555" />
        <rect x="108" y="98" width="12" height="5" rx="2" fill="#555" />
        <rect x="48" y="150" width="20" height="40" rx="4" fill="#3a5515" />
        <rect x="75" y="150" width="20" height="40" rx="4" fill="#3a5515" />
        <rect x="45" y="185" width="25" height="12" rx="4" fill="#444" />
        <rect x="73" y="185" width="25" height="12" rx="4" fill="#444" />
        <rect x="40" y="140" width="65" height="10" rx="3" fill="#654321" />
        <circle cx="72" cy="145" r="5" fill="#888" />
      </svg>
    </div>
  );
}

function GolemSVG() {
  return (
    <div className="battle-character battle-golem">
      <svg viewBox="0 0 150 210" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="70" width="80" height="75" rx="8" fill="#5a5a70" />
        <rect x="35" y="75" width="35" height="30" rx="4" fill="#666680" opacity="0.3" />
        <path d="M50 80 L55 95 L48 110 L55 130" fill="none" stroke="#444458" strokeWidth="2" />
        <path d="M85 85 L80 100 L88 120" fill="none" stroke="#444458" strokeWidth="2" />
        <circle cx="70" cy="100" r="8" fill="none" stroke="#aa66ff" strokeWidth="2" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="100" r="3" fill="#aa66ff" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="45" y="35" width="50" height="38" rx="5" fill="#6a6a80" />
        <rect x="52" y="48" width="12" height="8" rx="2" fill="#9933ff">
          <animate attributeName="fill" values="#9933ff;#cc66ff;#9933ff" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="75" y="48" width="12" height="8" rx="2" fill="#9933ff">
          <animate attributeName="fill" values="#9933ff;#cc66ff;#9933ff" dur="3s" repeatCount="indefinite" />
        </rect>
        <path d="M50 65 L55 70 L85 70 L90 65" fill="none" stroke="#555568" strokeWidth="2" />
        <rect x="5" y="75" width="25" height="50" rx="8" fill="#505068" />
        <rect x="110" y="75" width="25" height="50" rx="8" fill="#505068" />
        <rect x="2" y="120" width="30" height="25" rx="8" fill="#5a5a72" />
        <rect x="108" y="120" width="30" height="25" rx="8" fill="#5a5a72" />
        <circle cx="17" cy="132" r="5" fill="none" stroke="#aa66ff" strokeWidth="1.5" opacity="0.5" />
        <circle cx="123" cy="132" r="5" fill="none" stroke="#aa66ff" strokeWidth="1.5" opacity="0.5" />
        <rect x="38" y="145" width="25" height="40" rx="6" fill="#4a4a60" />
        <rect x="75" y="145" width="25" height="40" rx="6" fill="#4a4a60" />
        <rect x="33" y="180" width="35" height="15" rx="5" fill="#444458" />
        <rect x="70" y="180" width="35" height="15" rx="5" fill="#444458" />
        <path d="M40 195 L30 210 M70 195 L75 210 M100 195 L110 210" stroke="#444" strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  );
}

function WitchSVG() {
  return (
    <div className="battle-character battle-witch">
      <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
        <circle cx="95" cy="70" r="18" fill="rgba(150,0,255,0.15)">
          <animate attributeName="r" values="18;25;18" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M35 80 L25 155 L90 155 L80 80" fill="#2a0845" />
        <path d="M35 80 L25 155 L55 150 L50 80" fill="#380860" opacity="0.4" />
        <path d="M40 120 Q55 115 50 135 Q65 125 60 145" fill="none" stroke="#5a1a80" strokeWidth="1.5" opacity="0.5" />
        <rect x="42" y="48" width="25" height="28" rx="4" fill="#c8e0c8" />
        <path d="M35 55 L58 0 L78 55" fill="#1a0030" />
        <path d="M35 55 L50 5 L60 55" fill="#250045" opacity="0.4" />
        <rect x="30" y="52" width="55" height="8" rx="3" fill="#2a0845" />
        <rect x="50" y="53" width="12" height="6" rx="1" fill="#8844cc" />
        <path d="M47 60 L53 57 L53 63 Z" fill="#ff00ff" />
        <path d="M63 60 L57 57 L57 63 Z" fill="#ff00ff" />
        <path d="M47 70 Q55 78 63 70" fill="none" stroke="#4a0060" strokeWidth="1.5" />
        <line x1="90" y1="45" x2="82" y2="145" stroke="#444" strokeWidth="4" strokeLinecap="round" />
        <circle cx="92" cy="42" r="9" fill="#ddd" />
        <circle cx="88" cy="40" r="3" fill="#1a0030" />
        <circle cx="95" cy="40" r="3" fill="#1a0030" />
        <path d="M87 46 L91 44 L95 46" fill="none" stroke="#1a0030" strokeWidth="1" />
        <circle cx="92" cy="42" r="14" fill="none" stroke="rgba(150,0,255,0.4)" strokeWidth="2">
          <animate attributeName="r" values="14;20;14" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <rect x="25" y="82" width="10" height="20" rx="3" fill="#2a0845" transform="rotate(20 30 82)" />
        <circle cx="22" cy="78" r="6" fill="rgba(200,0,255,0.3)">
          <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
        </circle>
        <rect x="78" y="82" width="10" height="25" rx="3" fill="#2a0845" />
        <rect x="40" y="148" width="15" height="12" rx="2" fill="#1a0030" />
        <rect x="60" y="148" width="15" height="12" rx="2" fill="#1a0030" />
        <circle cx="35" cy="145" r="2" fill="#9933ff" opacity="0.5">
          <animate attributeName="cy" values="145;135;145" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="148" r="1.5" fill="#cc66ff" opacity="0.4">
          <animate attributeName="cy" values="148;138;148" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
