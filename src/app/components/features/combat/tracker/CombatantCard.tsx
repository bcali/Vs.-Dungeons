import React from "react";
import { Card } from "../../../shared/Card";
import { ProgressBar } from "../../../shared/ProgressBar";
import { Badge } from "../../../shared/Badge";
import { Combatant } from "../../../../types/game";
import { cn } from "../../../../../lib/utils";
import { Footprints, Zap } from "lucide-react";

interface CombatantCardProps {
  combatant: Combatant;
  isCurrentTurn: boolean;
}

export const CombatantCard: React.FC<CombatantCardProps> = ({ combatant, isCurrentTurn }) => {
  const isHero = combatant.type === "hero";
  const borderColor = isCurrentTurn 
    ? (isHero ? "border-green-500 ring-1 ring-green-500" : "border-red-500 ring-1 ring-red-500")
    : "border-border-card";

  const hpPercent = (combatant.hp.current / combatant.hp.max) * 100;
  let hpColor = "bg-hp-high";
  if (hpPercent < 25) hpColor = "bg-hp-low";
  else if (hpPercent < 50) hpColor = "bg-hp-mid";

  if (combatant.isKO) {
    return (
        <Card className="p-3 bg-bg-card/50 border-zinc-700 opacity-60">
            <div className="flex justify-between items-start">
                <span className="font-semibold line-through text-text-muted">{combatant.name}</span>
                <span className="text-xs text-red-500 font-bold">KO</span>
            </div>
        </Card>
    );
  }

  return (
    <Card className={cn("p-3 transition-all duration-300 relative overflow-hidden", borderColor, isCurrentTurn && "bg-bg-card shadow-lg scale-[1.02]")}>
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate max-w-[120px]">{combatant.name}</span>
                {combatant.isBoss && <span className="text-[10px] text-accent-gold font-bold">BOSS</span>}
            </div>
            
            {/* Movement Stat */}
            <div className="flex items-center gap-1 text-[10px] text-text-secondary bg-zinc-900/50 px-1.5 py-0.5 rounded">
                <Footprints className="w-3 h-3" />
                <span>{combatant.movement} tiles</span>
            </div>
        </div>
        
        {/* Bars */}
        <div className="space-y-1.5">
            <ProgressBar 
                value={combatant.hp.current} 
                max={combatant.hp.max} 
                color={hpColor}
                height="md"
                showLabels={false}
            />
            <div className="flex justify-between text-[10px] text-text-secondary">
                <span>HP</span>
                <span>{combatant.hp.current}/{combatant.hp.max}</span>
            </div>

            {combatant.resource && (
                <>
                    <ProgressBar 
                        value={combatant.resource.current} 
                        max={combatant.resource.max} 
                        color={combatant.resource.type === 'rage' ? 'bg-resource-rage' : combatant.resource.type === 'mana' ? 'bg-resource-mana' : 'bg-resource-energy'}
                        height="sm"
                        showLabels={false}
                    />
                     <div className="flex justify-between text-[10px] text-text-secondary">
                        <span className="capitalize">{combatant.resource.type}</span>
                        <span>{combatant.resource.current}/{combatant.resource.max}</span>
                    </div>
                </>
            )}
        </div>

        {/* Abilities List */}
        {combatant.abilities && combatant.abilities.length > 0 && (
            <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> Abilities
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                    {combatant.abilities.map((ability) => {
                        const onCooldown = ability.currentCooldown > 0;
                        const hasResource = combatant.resource ? combatant.resource.current >= ability.cost : true;
                        
                        // Active state logic:
                        // Usable = Not on Cooldown AND Has Resource
                        const isUsable = !onCooldown && hasResource;
                        
                        return (
                            <div 
                                key={ability.id} 
                                className={cn(
                                    "flex justify-between items-center px-2 py-1.5 rounded text-xs border transition-colors",
                                    isUsable 
                                        ? "bg-zinc-800/50 border-zinc-700 text-zinc-200" 
                                        : "bg-zinc-900/50 border-zinc-800/50 text-zinc-600"
                                )}
                            >
                                <span className={cn("truncate", !isUsable && "line-through opacity-50")}>
                                    {ability.name}
                                </span>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                    {onCooldown ? (
                                        <div className="flex items-center gap-1 text-red-400 bg-red-950/30 px-1 rounded">
                                            <span className="font-bold text-[10px]">{ability.currentCooldown}t</span>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "text-[10px] font-mono",
                                            hasResource ? "text-blue-400" : "text-red-500 font-bold"
                                        )}>
                                            {ability.cost > 0 ? (
                                                <span>{ability.cost} {combatant.resource?.type.slice(0,2).toUpperCase()}</span>
                                            ) : (
                                                <span className="text-zinc-500">-</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Status Effects */}
        {combatant.statusEffects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-zinc-800">
                {combatant.statusEffects.map(effect => (
                    <Badge key={effect.id} variant={effect.category} className="text-[9px] px-1 py-0 h-4">
                        {effect.name} ({effect.remainingTurns}t)
                    </Badge>
                ))}
            </div>
        )}
    </Card>
  );
};
