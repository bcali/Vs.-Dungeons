import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, SkipForward, XOctagon } from "lucide-react";
import { useGameStore } from "../../../store/gameStore";
import { cn } from "../../../../lib/utils";
import { Button } from "../../shared/Button";
import { Badge } from "../../shared/Badge";
import { Combatant, StatusEffect } from "../../../types/game";
import { InitiativePill } from "./tracker/InitiativePill";
import { CombatantCard } from "./tracker/CombatantCard";
import { VoiceInputBar } from "./tracker/VoiceInputBar";
import { ActionLog } from "./tracker/ActionLog";

export const CombatTracker: React.FC = () => {
  const navigate = useNavigate();
  const { heroes, enemies, encounters, activeEncounterId, setActiveEncounter } = useGameStore();
  const encounter = encounters.find(e => e.id === activeEncounterId);
  
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [round, setRound] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [narration, setNarration] = useState("The enemies draw their weapons, preparing to attack!");

  useEffect(() => {
    if (!encounter) return;
    
    // Initialize combatants if empty
    if (combatants.length === 0) {
      const newCombatants: Combatant[] = [];
      
      heroes.forEach(h => {
        newCombatants.push({
          id: h.id,
          instanceId: h.id,
          type: 'hero',
          name: h.name,
          hp: { ...h.hp },
          resource: h.resource ? { ...h.resource } : undefined,
          movement: h.movement || 5, // Fallback
          abilities: (h.abilities || []).map(a => ({ ...a, currentCooldown: 0 })),
          initiative: Math.floor(Math.random() * 20) + (h.stats.AGI),
          statusEffects: [],
          isKO: false,
          profession: h.profession
        });
      });

      // Add Enemies
      encounter.enemies.forEach(item => {
        const enemyTemplate = enemies.find(e => e.id === item.enemyId);
        if (enemyTemplate) {
          for (let i = 0; i < item.count; i++) {
             newCombatants.push({
                id: enemyTemplate.id,
                instanceId: `${enemyTemplate.id}-${i}`,
                type: 'enemy',
                name: item.count > 1 ? `${enemyTemplate.name} ${i+1}` : enemyTemplate.name,
                hp: { ...enemyTemplate.hp },
                resource: enemyTemplate.resource ? { ...enemyTemplate.resource } : undefined,
                movement: enemyTemplate.movement || 4, // Fallback
                abilities: (enemyTemplate.abilities || []).map(a => ({ ...a, currentCooldown: 0 })),
                initiative: Math.floor(Math.random() * 20) + 2, // Simple logic
                statusEffects: [],
                isKO: false,
                isBoss: enemyTemplate.isBoss
             });
          }
        }
      });

      // Sort by initiative
      newCombatants.sort((a, b) => b.initiative - a.initiative);
      setCombatants(newCombatants);
    }
  }, [encounter, heroes, enemies, combatants.length]);

  if (!encounter) return null;

  const currentCombatant = combatants[turnIndex];

  const handleNextTurn = () => {
    let nextIndex = (turnIndex + 1) % combatants.length;
    if (nextIndex === 0) setRound(r => r + 1);
    
    // Skip dead
    let loopCount = 0;
    while (combatants[nextIndex].isKO && loopCount < combatants.length) {
      nextIndex = (nextIndex + 1) % combatants.length;
      if (nextIndex === 0) setRound(r => r + 1);
      loopCount++;
    }
    
    if (loopCount >= combatants.length) {
      return; 
    }

    setTurnIndex(nextIndex);
  };

  const handleVoiceAction = (text: string) => {
    if (!currentCombatant) return;

    // Simulate action result
    const newLog = {
      id: Math.random().toString(),
      round,
      actorName: currentCombatant.name,
      action: text,
      roll: `${Math.floor(Math.random() * 10) + 10} vs 12`,
      result: Math.random() > 0.3 ? "hit" : "miss"
    };
    
    setLogs(prev => [newLog, ...prev]);
    setNarration(`AI Narration: ${currentCombatant.name} attempts to ${text.toLowerCase()} and ${newLog.result === 'hit' ? 'succeeds spectacularly!' : 'fails clumsily.'}`);
    
    // Auto advance turn after action
    setTimeout(handleNextTurn, 2000);
  };

  const handleEndCombat = () => {
    setActiveEncounter(null); // Clear active
    navigate("/rewards"); // Go to rewards
  };

  const activeHeroes = combatants.filter(c => c.type === 'hero');
  const activeEnemies = combatants.filter(c => c.type === 'enemy');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-page p-4 gap-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
           <Link to="/" className="text-text-secondary hover:text-white"><ChevronLeft /></Link>
           <h1 className="text-xl font-bold">
             <span className="text-accent-red">COMBAT</span> <span className="text-text-secondary">— {encounter.name}</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-text-secondary font-mono">Round {round}</span>
           <Button variant="secondary" size="sm" onClick={handleNextTurn}><SkipForward className="w-4 h-4 mr-2" /> Skip Turn</Button>
           <Button variant="secondary" size="sm" onClick={handleEndCombat}><XOctagon className="w-4 h-4 mr-2" /> End Combat</Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Col 1: Initiative (2/12) */}
        <div className="col-span-2 flex flex-col gap-2 overflow-y-auto pr-1">
           <h3 className="text-xs text-text-muted uppercase font-semibold sticky top-0 bg-bg-page pb-2">Initiative</h3>
           {combatants.map((c, idx) => (
             <InitiativePill 
                key={c.instanceId} 
                combatant={c} 
                isCurrentTurn={idx === turnIndex} 
             />
           ))}
        </div>

        {/* Col 2: Combatants (7/12) */}
        <div className="col-span-7 flex flex-col gap-4 overflow-y-auto px-2">
            {/* Current Turn Banner */}
            {currentCombatant && (
                <div className={cn(
                    "p-4 rounded-xl border-2 shadow-lg transition-all",
                    currentCombatant.type === 'hero' ? "bg-green-950/20 border-green-500" : "bg-red-950/20 border-red-500"
                )}>
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <div className="text-xs text-text-secondary uppercase mb-1">Current Turn</div>
                         <div className="text-2xl font-bold text-white">{currentCombatant.name}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-bold text-white">{currentCombatant.hp.current}/{currentCombatant.hp.max} HP</div>
                         {currentCombatant.resource && (
                             <div className="text-xs text-text-secondary capitalize">{currentCombatant.resource.current} {currentCombatant.resource.type}</div>
                         )}
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <Badge variant="dot">Burning (2t)</Badge>
                      <Badge variant="buff">Shield Up (3t)</Badge>
                   </div>
                </div>
            )}

            {/* Combatant Grids */}
            <div className="space-y-4">
               <div>
                  <h3 className="text-xs text-text-muted uppercase font-semibold mb-2">Heroes</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {activeHeroes.map(h => (
                        <CombatantCard key={h.instanceId} combatant={h} isCurrentTurn={h === currentCombatant} />
                     ))}
                  </div>
               </div>
               
               <div>
                  <h3 className="text-xs text-text-muted uppercase font-semibold mb-2">Enemies</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {activeEnemies.map(e => (
                        <CombatantCard key={e.instanceId} combatant={e} isCurrentTurn={e === currentCombatant} />
                     ))}
                  </div>
               </div>
            </div>
        </div>

        {/* Col 3: Logs (3/12) */}
        <div className="col-span-3 flex flex-col min-h-0">
           <ActionLog logs={logs} />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="shrink-0 space-y-4">
         {/* Narration */}
         <div className="bg-bg-card border border-border-card rounded-md p-3 text-center italic text-zinc-300 text-sm">
            {narration}
         </div>

         {/* Voice Bar */}
         {currentCombatant && (
             <VoiceInputBar 
                currentTurnName={currentCombatant.name}
                onAction={handleVoiceAction}
             />
         )}
      </div>
    </div>
  );
};
