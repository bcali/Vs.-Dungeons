import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Save } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { Button } from "../components/shared/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/shared/Tabs";
import { IdentityCard } from "../components/features/character-sheet/IdentityCard";
import { StatsCard } from "../components/features/character-sheet/StatsCard";
import { CombatStatsCard } from "../components/features/character-sheet/CombatStatsCard";
import { AbilitiesCard } from "../components/features/character-sheet/AbilitiesCard";
import { InventoryCard } from "../components/features/character-sheet/InventoryCard";
import { SealCollectionCard } from "../components/features/character-sheet/SealCollectionCard";
import { SkillTreeTab } from "../components/features/skill-tree/SkillTreeTab";
import { StatName } from "../types/game";
import { toast } from "sonner";

export const CharacterSheetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { heroes, updateHero } = useGameStore();
  const hero = heroes.find(h => h.id === id);

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!hero) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-red-500">Hero not found</h2>
        <Button onClick={() => navigate("/character")} className="mt-4">Back to List</Button>
      </div>
    );
  }

  const handleUpdateStat = (stat: StatName, delta: number) => {
    if (delta > 0 && hero.availableStatPoints < delta) return;
    if (delta < 0 && hero.stats[stat] <= 3) return; // Min 3 check again just in case

    const newStats = { ...hero.stats, [stat]: hero.stats[stat] + delta };
    const newAvailable = hero.availableStatPoints - delta;

    updateHero(hero.id, { stats: newStats, availableStatPoints: newAvailable });
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      toast.success("Character saved successfully");
    }, 800);
  };

  const showSkillTree = ['Knight', 'Ranger', 'Rogue'].includes(hero.profession);

  return (
    <div className="p-8 min-h-screen flex flex-col max-w-[80rem] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/character" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft size={20} /> Back
          </Link>
          <h1 className="text-2xl font-bold text-text-secondary">
            <span className="text-accent-gold">{hero.name}</span> — Level {hero.level} {hero.profession}
          </h1>
        </div>
        
        <Button 
            variant={isDirty ? "primary" : "secondary"} 
            className={isDirty ? "bg-accent-gold text-bg-page" : "text-text-muted"}
            disabled={!isDirty && !isSaving}
            onClick={handleSave}
            isLoading={isSaving}
        >
            {isSaving ? "Saving..." : isDirty ? "Save" : "Saved"}
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column (2/5) */}
        <div className="lg:col-span-2 space-y-6">
            <IdentityCard hero={hero} />
            <StatsCard hero={hero} onUpdateStat={handleUpdateStat} />
            <CombatStatsCard hero={hero} />
        </div>

        {/* Right Column (3/5) */}
        <div className="lg:col-span-3">
            <Tabs defaultValue="sheet" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="sheet">Sheet</TabsTrigger>
                    {showSkillTree && <TabsTrigger value="skills">Skills</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="sheet" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <AbilitiesCard />
                    <InventoryCard hero={hero} />
                    <SealCollectionCard />
                </TabsContent>
                
                {showSkillTree && (
                    <TabsContent value="skills" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <SkillTreeTab hero={hero} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
      </div>
    </div>
  );
};
