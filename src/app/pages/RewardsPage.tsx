import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { Card } from "../components/shared/Card";
import { Button } from "../components/shared/Button";
import { Input } from "../components/shared/Input";
import { ProgressBar } from "../components/shared/ProgressBar";
import { LevelUpOverlay } from "../components/features/LevelUpOverlay";
import { Hero } from "../types/game";
import { toast } from "sonner";

export const RewardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { heroes, updateHero } = useGameStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [leveledHeroes, setLeveledHeroes] = useState<Hero[]>([]);
  const [isApplied, setIsApplied] = useState(false);

  // Mock encounter data (usually passed via state or store)
  const totalXp = 150;
  const xpPerHero = Math.floor(totalXp / heroes.length);
  const encounterName = "Forest Ambush"; // Should be from previous encounter

  const handleApplyRewards = () => {
    // Apply XP and check for level up
    const updatedHeroes: Hero[] = [];
    const justLeveled: Hero[] = [];

    heroes.forEach(hero => {
       const newCurrentXp = hero.xp.current + xpPerHero;
       let newLevel = hero.level;
       let finalXp = newCurrentXp;
       let maxXp = hero.xp.max;
       let availStats = hero.availableStatPoints;
       let availSkills = hero.availableSkillPoints;

       if (newCurrentXp >= maxXp) {
          newLevel++;
          finalXp = newCurrentXp - maxXp; // Rollover
          maxXp = newLevel * 15; // New max
          availStats++;
          availSkills++;
          
          const leveledHero = { ...hero, level: newLevel }; // Temp for overlay
          justLeveled.push(leveledHero);
       }
       
       const updated = {
         ...hero,
         level: newLevel,
         xp: { current: finalXp, max: maxXp },
         availableStatPoints: availStats,
         availableSkillPoints: availSkills,
         gold: hero.gold + 20 // Mock gold reward
       };
       
       updatedHeroes.push(updated);
       updateHero(hero.id, updated);
    });
    
    setIsApplied(true);
    
    if (justLeveled.length > 0) {
        setLeveledHeroes(justLeveled);
        setShowLevelUp(true);
    } else {
        toast.success("Rewards applied!");
        setTimeout(() => navigate("/character"), 1000);
    }
  };

  const handleCloseLevelUp = () => {
    setShowLevelUp(false);
    navigate("/character");
  };

  return (
    <div className="p-8 min-h-screen bg-bg-page flex flex-col">
       <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent-gold mb-1">VICTORY — {encounterName}</h1>
          <p className="text-text-muted">Assign rewards before finishing the encounter</p>
       </div>

       <div className="flex-1 grid grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
          {/* Left: Summary (4/12) */}
          <div className="col-span-4 space-y-6">
             <Card>
                <h2 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">Summary</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between p-2 bg-bg-input/50 rounded">
                        <span>Goblin Scavenger</span>
                        <span className="text-accent-gold">10 XP</span>
                    </div>
                     <div className="flex justify-between p-2 bg-bg-input/50 rounded">
                        <span>Orc Brute</span>
                        <span className="text-accent-gold">35 XP</span>
                    </div>
                    <div className="flex justify-between p-2 bg-bg-input/50 rounded">
                        <span>Dark Sorcerer <span className="text-accent-gold text-xs font-bold ml-1">BOSS</span></span>
                        <span className="text-accent-gold">105 XP</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-border-card text-center">
                    <div className="text-text-secondary">Total XP: <span className="text-white font-bold">{totalXp}</span></div>
                    <div className="text-accent-gold font-bold mt-1">Per hero ({heroes.length}): {xpPerHero} XP each</div>
                </div>
             </Card>

             <Card>
                <h2 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">Item Catalog</h2>
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                    <Input placeholder="Search items..." className="pl-9" />
                </div>
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    <Button size="sm" variant="secondary" className="bg-accent-gold/20 text-accent-gold whitespace-nowrap">All</Button>
                    <Button size="sm" variant="ghost" className="whitespace-nowrap">Weapon</Button>
                    <Button size="sm" variant="ghost" className="whitespace-nowrap">Consumable</Button>
                </div>
                <div className="space-y-2">
                    <div className="bg-bg-input/50 p-3 rounded-md hover:bg-bg-input cursor-pointer flex justify-between">
                        <span className="text-green-400">Health Potion</span>
                        <span className="text-xs text-text-muted">Common</span>
                    </div>
                     <div className="bg-bg-input/50 p-3 rounded-md hover:bg-bg-input cursor-pointer flex justify-between">
                        <span className="text-blue-400">Steel Shield</span>
                        <span className="text-xs text-text-muted">Uncommon</span>
                    </div>
                </div>
             </Card>
          </div>

          {/* Right: Heroes (8/12) */}
          <div className="col-span-8 grid grid-cols-1 gap-4">
              {heroes.map(hero => {
                  const newXp = hero.xp.current + xpPerHero;
                  const willLevelUp = newXp >= hero.xp.max;
                  
                  return (
                      <Card key={hero.id} className="cursor-pointer border-border-active-gold relative overflow-hidden">
                          {willLevelUp && (
                              <div className="absolute top-4 right-4 bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                  LEVEL UP!
                              </div>
                          )}
                          
                          <div className="flex justify-between items-end mb-4">
                              <div>
                                  <h3 className="text-xl font-bold text-white">{hero.name}</h3>
                                  <div className="text-sm text-text-secondary">
                                      Level {hero.level} {willLevelUp && <span className="text-accent-gold">→ Level {hero.level + 1}!</span>}
                                  </div>
                              </div>
                              <div className="text-right w-1/3">
                                  <div className="text-xs text-text-muted mb-1 flex justify-between">
                                      <span>XP: {hero.xp.current} + {xpPerHero} = {newXp}</span>
                                      <span>Next: {hero.xp.max}</span>
                                  </div>
                                  <div className="h-3 bg-bg-input rounded-full overflow-hidden relative">
                                      {/* Current XP */}
                                      <div className="absolute h-full bg-accent-gold opacity-50" style={{ width: `${Math.min(100, (newXp / hero.xp.max) * 100)}%` }} />
                                      <div className="absolute h-full bg-accent-gold" style={{ width: `${(hero.xp.current / hero.xp.max) * 100}%` }} />
                                  </div>
                              </div>
                          </div>

                          <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                  <span className="text-sm text-text-secondary">Gold ({hero.gold}):</span>
                                  <div className="flex items-center gap-2 bg-bg-input rounded p-1">
                                      <span className="text-text-muted text-xs">+</span>
                                      <input className="bg-transparent w-12 text-center text-accent-gold font-bold outline-none" defaultValue="20" />
                                  </div>
                                  <span className="text-xs text-text-muted">→ {hero.gold + 20}</span>
                              </div>

                              <div className="flex-1 flex gap-2 flex-wrap">
                                  <div className="bg-bg-input rounded-full px-3 py-1 text-sm flex items-center gap-2">
                                      Iron Sword <button className="text-red-400 hover:text-red-300"><X size={12} /></button>
                                  </div>
                              </div>
                          </div>
                      </Card>
                  );
              })}
              
              <div className="flex justify-end mt-4">
                  <Button 
                    variant={isApplied ? "primary" : "primary"} 
                    className={isApplied ? "bg-green-600 text-white" : "bg-accent-gold text-bg-page"}
                    size="lg"
                    onClick={handleApplyRewards}
                    disabled={isApplied}
                  >
                      {isApplied ? "Rewards Applied!" : "Apply Rewards"}
                  </Button>
              </div>
          </div>
       </div>

       <LevelUpOverlay heroes={leveledHeroes} open={showLevelUp} onClose={handleCloseLevelUp} />
    </div>
  );
};
