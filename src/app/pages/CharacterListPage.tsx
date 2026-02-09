import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, ChevronLeft, Plus, Swords } from "lucide-react";
import { Button } from "../components/shared/Button";
import { HeroCard } from "../components/features/HeroCard";
import { CreateHeroModal } from "../components/features/CreateHeroModal";
import { useGameStore } from "../store/gameStore";
import { Hero, Stats } from "../types/game";

export const CharacterListPage: React.FC = () => {
  const navigate = useNavigate();
  const { heroes, addHero, deleteHero } = useGameStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateHero = (data: any) => {
    // Default stats based on profession (simplified)
    const baseStats: Stats = { CON: 3, STR: 3, AGI: 3, MNA: 3, INT: 3, LCK: 3 };
    
    // Customize slightly based on profession
    if (data.profession === 'Knight') { baseStats.STR = 5; baseStats.CON = 5; }
    if (data.profession === 'Wizard') { baseStats.MNA = 5; baseStats.INT = 5; }
    if (data.profession === 'Rogue') { baseStats.AGI = 5; baseStats.LCK = 5; }
    // ... others

    const newHero: Hero = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      playerName: data.playerName,
      profession: data.profession,
      level: 1,
      stats: baseStats,
      hp: { current: baseStats.CON * 3, max: baseStats.CON * 3 },
      xp: { current: 0, max: 10 }, // Starting XP max
      gold: 0,
      resource: { 
        type: data.profession === 'Knight' ? 'rage' : data.profession === 'Rogue' ? 'energy' : 'mana',
        current: data.profession === 'Knight' ? 0 : 100, // Rage starts at 0
        max: 100 
      }
    };

    addHero(newHero);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft size={20} /> Home
          </Link>
          <h1 className="text-2xl font-bold text-accent-gold">VS. DUNGEONS — Heroes</h1>
        </div>
        <Link to="/config" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
          <Settings size={20} /> Config
        </Link>
      </div>

      {/* Grid */}
      <div className="flex-1">
        {heroes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <p className="text-xl mb-4">No heroes yet. Create your first character!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {heroes.map((hero) => (
              <HeroCard 
                key={hero.id} 
                hero={hero} 
                onDelete={deleteHero} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex justify-center gap-4 sticky bottom-8 z-10">
        <Button 
          variant="secondary" 
          size="lg" 
          className="border-2 border-border-active-gold/50 shadow-lg bg-bg-card hover:bg-bg-input"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 w-5 h-5" /> Create Character
        </Button>
        <Link to="/combat">
          <Button variant="action" size="lg" className="shadow-lg">
            <Swords className="mr-2 w-5 h-5" /> Start Combat
          </Button>
        </Link>
      </div>

      <CreateHeroModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onCreate={handleCreateHero} 
      />
    </div>
  );
};
