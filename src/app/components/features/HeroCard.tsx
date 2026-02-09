import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Card } from "../shared/Card";
import { ProgressBar } from "../shared/ProgressBar";
import { Button } from "../shared/Button";
import { Hero } from "../../types/game";
import { cn } from "../../../lib/utils";

interface HeroCardProps {
  hero: Hero;
  onDelete?: (id: string) => void;
  className?: string;
}

const professionIcons: Record<string, string> = {
  Knight: "🛡️",
  Wizard: "🪄",
  Ranger: "🏹",
  Healer: "✨",
  Rogue: "🗡️",
  Inventor: "🔧",
};

export const HeroCard: React.FC<HeroCardProps> = ({ hero, onDelete, className }) => {
  const hpPercent = (hero.hp.current / hero.hp.max) * 100;
  let hpColor = "bg-hp-high";
  if (hpPercent < 25) hpColor = "bg-hp-low";
  else if (hpPercent < 50) hpColor = "bg-hp-mid";

  return (
    <Card className={cn("p-5 flex flex-col gap-4", className)}>
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-md bg-bg-input flex items-center justify-center text-3xl shrink-0">
          {hero.avatarUrl || professionIcons[hero.profession] || "👤"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{hero.name}</h3>
          <p className="text-sm text-text-secondary truncate">
            {hero.profession} • Level {hero.level}
            {hero.playerName && <span className="text-text-muted"> ({hero.playerName})</span>}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar
          value={hero.hp.current}
          max={hero.hp.max}
          label="HP"
          color={hpColor}
          height="md"
        />
        <ProgressBar
          value={hero.xp.current}
          max={hero.xp.max}
          label="XP"
          color="bg-xp-bar"
          height="md"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Link to={`/character/${hero.id}`} className="flex-1">
          <Button variant="secondary" className="w-full hover:bg-accent-red hover:text-white">
            View Sheet
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="secondary"
            size="icon"
            className="text-red-400 hover:bg-red-900/30 w-10 shrink-0"
            onClick={() => onDelete(hero.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
