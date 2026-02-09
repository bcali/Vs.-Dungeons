import React from "react";
import { Plus, Minus } from "lucide-react";
import { Hero, Stats, StatName } from "../../../types/game";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";
import { ProgressBar } from "../../shared/ProgressBar";

interface StatsCardProps {
  hero: Hero;
  onUpdateStat: (stat: StatName, delta: number) => void;
}

const statsList: StatName[] = ["CON", "STR", "AGI", "MNA", "INT", "LCK"];

export const StatsCard: React.FC<StatsCardProps> = ({ hero, onUpdateStat }) => {
  const getBonus = (val: number) => {
    const bonus = val - 3;
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider">Stats</h3>
        {hero.availableStatPoints > 0 && (
          <Badge variant="points" animatePulse>
            {hero.availableStatPoints} pts avail
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {statsList.map((stat) => {
          const value = hero.stats[stat];
          const canDecrease = value > 3; // Min 3 (from spec)
          const canIncrease = hero.availableStatPoints > 0 && value < 15; // Max 15 (from spec)

          return (
            <div key={stat} className="flex items-center gap-2">
              <span className="w-8 text-xs font-bold text-text-secondary">{stat}</span>
              
              <Button
                variant="secondary"
                size="icon"
                className="w-7 h-7 shrink-0"
                disabled={!canDecrease}
                onClick={() => onUpdateStat(stat, -1)}
              >
                <Minus className="w-3 h-3" />
              </Button>

              <span className="w-6 text-center text-lg font-bold text-white">{value}</span>

              <Button
                variant="secondary"
                size="icon"
                className="w-7 h-7 shrink-0"
                disabled={!canIncrease}
                onClick={() => onUpdateStat(stat, 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>

              <span className="w-8 text-xs text-text-muted text-center">({getBonus(value)})</span>

              <div className="flex-1 min-w-0">
                <ProgressBar
                  value={value}
                  max={15}
                  showLabels={false}
                  height="md"
                  color="bg-stat-bar"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
