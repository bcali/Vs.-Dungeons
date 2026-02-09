import React, { useState } from "react";
import { 
  Sword, Shield, Skull, Zap, Flame, Snowflake, 
  Heart, Sparkles, Cross, Target, Anchor, 
  ArrowUp, Lock, RefreshCw, HandMetal, Axe, Eye
} from "lucide-react";
import { Hero } from "../../../types/game";
import { cn } from "../../../../lib/utils";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";
import { Badge } from "../../shared/Badge";

// --- Types ---
interface Talent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  maxRank: number;
  reqPointsInTree: number; // Points spent in this tree required to unlock row
  prereqId?: string; // ID of required talent
  col: number; // 0-3
  row: number; // 0-6
}

interface TreeData {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  backgroundUrl: string; // CSS gradient or image
  talents: Talent[];
}

// --- Data: Knight Trees ---
const ARMS_TREE: TreeData = {
  id: "arms",
  name: "Arms",
  icon: Sword,
  color: "text-red-500",
  backgroundUrl: "linear-gradient(to bottom, #2a0a0a, #1a0505)",
  talents: [
    { id: "a1", name: "Heroic Strike", description: "A strong attack that increases melee damage.", icon: Sword, maxRank: 5, reqPointsInTree: 0, col: 1, row: 0 },
    { id: "a2", name: "Deflection", description: "Increases your Parry chance.", icon: RefreshCw, maxRank: 5, reqPointsInTree: 0, col: 2, row: 0 },
    { id: "a3", name: "Charge", description: "Rush to an enemy and stun them.", icon: Zap, maxRank: 1, reqPointsInTree: 5, prereqId: "a1", col: 1, row: 1 },
    { id: "a4", name: "Tactical Mastery", description: "Retain rage when changing stance.", icon: Target, maxRank: 3, reqPointsInTree: 5, col: 3, row: 1 },
    { id: "a5", name: "Deep Wounds", description: "Crits cause enemy to bleed.", icon: Flame, maxRank: 3, reqPointsInTree: 10, prereqId: "a3", col: 1, row: 2 },
    { id: "a6", name: "Two-Handed Spec", description: "Increases damage with 2H weapons.", icon: Axe, maxRank: 5, reqPointsInTree: 10, col: 2, row: 2 },
    { id: "a7", name: "Mortal Strike", description: "A massive hit that reduces healing.", icon: Skull, maxRank: 1, reqPointsInTree: 15, prereqId: "a5", col: 1, row: 3 },
    { id: "a8", name: "Bladestorm", description: "Become a whirlwind of destruction.", icon: RefreshCw, maxRank: 1, reqPointsInTree: 20, prereqId: "a7", col: 1, row: 4 },
  ]
};

const PROTECTION_TREE: TreeData = {
  id: "protection",
  name: "Protection",
  icon: Shield,
  color: "text-blue-500",
  backgroundUrl: "linear-gradient(to bottom, #0a1a2a, #050a15)",
  talents: [
    { id: "p1", name: "Shield Bash", description: "Slam the enemy, interrupting casting.", icon: Shield, maxRank: 5, reqPointsInTree: 0, col: 1, row: 0 },
    { id: "p2", name: "Anticipation", description: "Increases Defense skill.", icon: Eye, maxRank: 5, reqPointsInTree: 0, col: 2, row: 0 },
    { id: "p3", name: "Last Stand", description: "Temporarily gain 30% HP.", icon: Heart, maxRank: 1, reqPointsInTree: 5, prereqId: "p1", col: 1, row: 1 },
    { id: "p4", name: "Iron Will", description: "Chance to resist Stun and Charm.", icon: Anchor, maxRank: 5, reqPointsInTree: 5, col: 0, row: 1 },
    { id: "p5", name: "Shield Wall", description: "Reduce all damage taken by 75%.", icon: Shield, maxRank: 1, reqPointsInTree: 10, prereqId: "p3", col: 1, row: 2 },
    { id: "p6", name: "Concussion Blow", description: "Stun the enemy for 5 sec.", icon: HandMetal, maxRank: 1, reqPointsInTree: 15, prereqId: "p5", col: 1, row: 3 },
    { id: "p7", name: "Devastate", description: "Sunder Armor and deal damage.", icon: Axe, maxRank: 1, reqPointsInTree: 20, prereqId: "p6", col: 1, row: 4 },
  ]
};

const FURY_TREE: TreeData = {
  id: "fury",
  name: "Fury",
  icon: Flame,
  color: "text-orange-500",
  backgroundUrl: "linear-gradient(to bottom, #2a1a0a, #150a05)",
  talents: [
    { id: "f1", name: "Cruelty", description: "Increases critical strike chance.", icon: Skull, maxRank: 5, reqPointsInTree: 0, col: 1, row: 0 },
    { id: "f2", name: "Booming Voice", description: "Increases duration of shouts.", icon: Zap, maxRank: 5, reqPointsInTree: 0, col: 2, row: 0 },
    { id: "f3", name: "Piercing Howl", description: "Daze all nearby enemies.", icon: HandMetal, maxRank: 1, reqPointsInTree: 5, col: 1, row: 1 },
    { id: "f4", name: "Blood Craze", description: "Regenerate health after being crit.", icon: Heart, maxRank: 3, reqPointsInTree: 5, col: 3, row: 1 },
    { id: "f5", name: "Enrage", description: "Bonus damage after being crit.", icon: Flame, maxRank: 5, reqPointsInTree: 10, prereqId: "f1", col: 1, row: 2 },
    { id: "f6", name: "Death Wish", description: "Increase damage by 20% but take 20% more.", icon: Skull, maxRank: 1, reqPointsInTree: 10, col: 2, row: 2 },
    { id: "f7", name: "Bloodthirst", description: "Attack that restores health.", icon: Heart, maxRank: 1, reqPointsInTree: 20, prereqId: "f6", col: 2, row: 4 },
  ]
};

// --- Components ---

interface SkillTreeTabProps {
  hero: Hero;
}

export const SkillTreeTab: React.FC<SkillTreeTabProps> = ({ hero }) => {
  // State for points spent (In a real app, this would be in the store)
  const [spentPoints, setSpentPoints] = useState<Record<string, number>>({});
  const totalAvailablePoints = hero.availableSkillPoints || 0;
  
  // Calculate total spent
  const totalSpent = Object.values(spentPoints).reduce((a, b) => a + b, 0);
  const remainingPoints = totalAvailablePoints - totalSpent;

  // Calculate points per tree
  const getPointsInTree = (treeId: string) => {
    let points = 0;
    const tree = [ARMS_TREE, PROTECTION_TREE, FURY_TREE].find(t => t.id === treeId);
    if (!tree) return 0;
    tree.talents.forEach(t => {
      points += (spentPoints[t.id] || 0);
    });
    return points;
  };

  const handleLearn = (talent: Talent, treeId: string) => {
    if (remainingPoints <= 0) return;
    
    const currentRank = spentPoints[talent.id] || 0;
    if (currentRank >= talent.maxRank) return;

    // Check tree requirements
    const pointsInTree = getPointsInTree(treeId);
    if (pointsInTree < talent.reqPointsInTree) return;

    // Check prereqs
    if (talent.prereqId) {
      const prereqRank = spentPoints[talent.prereqId] || 0;
      const prereqTalent = [ARMS_TREE, PROTECTION_TREE, FURY_TREE]
        .flatMap(t => t.talents)
        .find(t => t.id === talent.prereqId);
        
      if (prereqTalent && prereqRank < prereqTalent.maxRank) return;
    }

    setSpentPoints(prev => ({
      ...prev,
      [talent.id]: currentRank + 1
    }));
  };

  const handleUnlearn = (talentId: string) => {
      // Simplification: Allow unlearning freely for this UI demo
      // Real WoW requires unlearning from top down
      const current = spentPoints[talentId];
      if (current && current > 0) {
          setSpentPoints(prev => ({
              ...prev,
              [talentId]: current - 1
          }));
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] gap-4">
      {/* Header */}
      <Card className="flex justify-between items-center py-3 px-6 bg-black/80 border-accent-gold/50">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-accent-gold">{remainingPoints}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">Talent Points</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2" />
             <div className="text-sm text-text-secondary">
                <span className="text-red-400 font-bold">{getPointsInTree("arms")}</span> Arms / 
                <span className="text-blue-400 font-bold mx-1">{getPointsInTree("protection")}</span> Prot / 
                <span className="text-orange-400 font-bold">{getPointsInTree("fury")}</span> Fury
            </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSpentPoints({})}>Reset All</Button>
            <Button variant="primary" size="sm" className="bg-accent-gold text-black hover:bg-white">Apply Changes</Button>
        </div>
      </Card>

      {/* Trees Container */}
      <div className="flex-1 grid grid-cols-3 gap-1 overflow-hidden rounded-lg border border-white/10 bg-black">
         <TalentPanel 
            tree={ARMS_TREE} 
            spentPoints={spentPoints} 
            pointsInTree={getPointsInTree("arms")} 
            onLearn={handleLearn}
            onUnlearn={handleUnlearn}
         />
         <TalentPanel 
            tree={PROTECTION_TREE} 
            spentPoints={spentPoints} 
            pointsInTree={getPointsInTree("protection")}
            onLearn={handleLearn}
            onUnlearn={handleUnlearn}
         />
         <TalentPanel 
            tree={FURY_TREE} 
            spentPoints={spentPoints} 
            pointsInTree={getPointsInTree("fury")}
            onLearn={handleLearn}
            onUnlearn={handleUnlearn}
         />
      </div>
    </div>
  );
};

// --- Subcomponents ---

const TalentPanel = ({ tree, spentPoints, pointsInTree, onLearn, onUnlearn }: any) => {
    return (
        <div 
            className="relative h-full border-r border-white/10 last:border-r-0 flex flex-col"
            style={{ background: tree.backgroundUrl }}
        >
            {/* Tree Header */}
            <div className="p-3 flex items-center gap-3 border-b border-white/10 bg-black/40 backdrop-blur-sm">
                <div className={cn("p-2 rounded-full bg-black/50 border border-white/10", tree.color)}>
                    <tree.icon size={20} />
                </div>
                <div>
                    <h3 className={cn("font-bold text-sm", tree.color)}>{tree.name}</h3>
                    <span className="text-xs text-text-muted">{pointsInTree} points spent</span>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 p-4 relative overflow-y-auto custom-scrollbar">
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1724835939713-3c1a81bb5a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMG1ldGFsJTIwdGV4dHVyZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwNjE1NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080')] opacity-20 mix-blend-overlay pointer-events-none" />

                <div className="grid grid-cols-4 grid-rows-7 gap-x-2 gap-y-8 relative z-10 mx-auto max-w-[320px]">
                    {tree.talents.map((talent: Talent) => {
                        const rank = spentPoints[talent.id] || 0;
                        const isMaxed = rank >= talent.maxRank;
                        
                        // Check availability
                        const reqTreeMet = pointsInTree >= talent.reqPointsInTree;
                        
                        let prereqMet = true;
                        if (talent.prereqId) {
                            const pRank = spentPoints[talent.prereqId] || 0;
                            // Need to find max rank of prereq. Ideally this is passed in or looked up.
                            // For this simplified version, assuming max rank is 1, 3, or 5 depending on commonality, 
                            // but correct way is to look it up.
                            const prereqTalent = tree.talents.find((t: Talent) => t.id === talent.prereqId);
                            if (prereqTalent && pRank < prereqTalent.maxRank) prereqMet = false;
                        }
                        
                        const isUnlocked = reqTreeMet && prereqMet;
                        const isAvailable = isUnlocked; // Can put points in

                        return (
                            <div 
                                key={talent.id} 
                                style={{ gridColumn: talent.col + 1, gridRow: talent.row + 1 }}
                                className="relative flex justify-center"
                            >
                                {/* Arrow Drawing */}
                                {talent.prereqId && (
                                    <ArrowConnector 
                                        talent={talent} 
                                        prereq={tree.talents.find((t: any) => t.id === talent.prereqId)} 
                                        isActive={isAvailable}
                                    />
                                )}

                                <TalentButton 
                                    talent={talent} 
                                    rank={rank} 
                                    available={isAvailable} 
                                    maxed={isMaxed}
                                    onLearn={() => onLearn(talent, tree.id)}
                                    onUnlearn={() => onUnlearn(talent.id)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

const TalentButton = ({ talent, rank, available, maxed, onLearn, onUnlearn }: any) => {
    // Colors
    let borderColor = "border-zinc-700"; // Default / Locked
    if (available && rank === 0) borderColor = "border-green-500/50"; // Available
    if (rank > 0 && !maxed) borderColor = "border-green-500"; // Partial
    if (maxed) borderColor = "border-amber-400"; // Maxed

    let iconOpacity = "opacity-40 grayscale";
    if (available) iconOpacity = "opacity-80 grayscale-[0.5]";
    if (rank > 0) iconOpacity = "opacity-100 grayscale-0";
    
    return (
        <div className="group relative">
            {/* The Button */}
            <div 
                className={cn(
                    "w-12 h-12 rounded bg-black border-2 cursor-pointer transition-all duration-150 relative overflow-hidden shadow-lg hover:scale-105 active:scale-95",
                    borderColor,
                    maxed && "shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                )}
                onClick={(e) => {
                    e.preventDefault();
                    onLearn();
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onUnlearn();
                }}
            >
                <div className={cn("w-full h-full flex items-center justify-center p-2", iconOpacity)}>
                    <talent.icon size={24} className={maxed ? "text-amber-100" : "text-white"} />
                </div>
                
                {/* Rank Counter */}
                <div className={cn(
                    "absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded-sm border leading-tight",
                    maxed ? "bg-amber-500 text-black border-amber-400" : 
                    rank > 0 ? "bg-green-900 text-green-100 border-green-700" :
                    "bg-black/80 text-zinc-500 border-zinc-700"
                )}>
                    {rank}/{talent.maxRank}
                </div>
            </div>

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-zinc-900/95 border border-white/20 rounded p-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
                <h4 className="font-bold text-white text-sm mb-1">{talent.name}</h4>
                <div className="text-xs text-accent-gold mb-1">Rank {rank}/{talent.maxRank}</div>
                <p className="text-xs text-text-secondary leading-tight">{talent.description}</p>
                {!available && <div className="mt-2 text-xs text-red-400 italic">Requires points in tree</div>}
                {available && rank < talent.maxRank && <div className="mt-2 text-xs text-green-400">Click to Learn</div>}
            </div>
        </div>
    )
}

const ArrowConnector = ({ talent, prereq, isActive }: any) => {
    if (!prereq) return null;
    
    // Calculate simple direction (assuming vertical mostly)
    // In WoW, arrows go Down.
    // We are using grid, so we can use absolute positioning to draw the arrow.
    // A simple approach is to know that the arrow comes from the Prereq (above) to the Talent (below).
    // The arrow should be drawn "behind" the buttons. 
    // Since we are inside the Talent's grid cell, we draw UP to the parent.

    // Gap is calculated by (Row Diff * Row Height) + (Gap Y)
    // Assuming uniform grid.
    // Row height ~ 48px (h-12) + gap-y-8 (32px) = 80px per row.
    // This is a rough estimation. CSS Grid handles layout, SVG needs absolute dimensions or relative.
    
    // BETTER APPROACH: Just draw a small vertical arrow pointing down into this cell from the top.
    // This assumes the prereq is directly above. 
    // If prereq is in different column, it's harder.
    // Looking at data, arrows are mostly vertical.
    
    const isVertical = talent.col === prereq.col;
    
    if (!isVertical) return null; // Simplified: only draw vertical arrows for now

    const distance = talent.row - prereq.row;
    const height = distance * 80; // Approximate
    
    return (
        <div 
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end pb-1 pointer-events-none"
            style={{ height: "40px", width: "10px" }} 
        >
            <div className={cn("w-1 h-full", isActive ? "bg-amber-500/50" : "bg-zinc-700/50")} />
            <div className={cn(
                "w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]",
                 isActive ? "border-t-amber-500/50" : "border-t-zinc-700/50"
            )} />
        </div>
    )
}
