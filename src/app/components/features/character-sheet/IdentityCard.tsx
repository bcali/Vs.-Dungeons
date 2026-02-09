import React from "react";
import { Hero } from "../../../types/game";
import { Card } from "../../shared/Card";
import { ProgressBar } from "../../shared/ProgressBar";
import { getRankByLevel } from "../../../utils/gameUtils";

interface IdentityCardProps {
  hero: Hero;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({ hero }) => {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider">Identity</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Name</span>
          <span className="font-medium text-white">{hero.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Player</span>
          <span className="font-medium text-white">{hero.playerName || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Profession</span>
          <span className="font-medium text-white">{hero.profession}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Rank</span>
          <span className="font-medium text-white">{getRankByLevel(hero.level)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Gold</span>
          <span className="font-bold text-accent-gold">{hero.gold} (gold)</span>
        </div>
      </div>

      <div className="mt-2">
        <ProgressBar
          value={hero.xp.current}
          max={hero.xp.max}
          label="XP"
          color="bg-accent-gold"
          height="md"
        />
      </div>
    </Card>
  );
};
