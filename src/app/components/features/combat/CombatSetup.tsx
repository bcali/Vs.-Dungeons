import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Plus, Minus, Search } from "lucide-react";
import { useGameStore } from "../../../store/gameStore";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { Badge } from "../../shared/Badge";
import { Encounter } from "../../../types/game";
import { cn } from "../../../../lib/utils";

export const CombatSetup: React.FC = () => {
  const { heroes, enemies, addEncounter, setActiveEncounter } = useGameStore();
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>(heroes.map(h => h.id));
  const [selectedEnemies, setSelectedEnemies] = useState<{ enemyId: string; count: number }[]>([]);
  const [encounterName, setEncounterName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleHero = (id: string) => {
    setSelectedHeroes(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const addEnemy = (id: string) => {
    setSelectedEnemies(prev => {
      const existing = prev.find(e => e.enemyId === id);
      if (existing) {
        return prev.map(e => e.enemyId === id ? { ...e, count: e.count + 1 } : e);
      }
      return [...prev, { enemyId: id, count: 1 }];
    });
  };

  const removeEnemy = (id: string) => {
    setSelectedEnemies(prev => {
      const existing = prev.find(e => e.enemyId === id);
      if (existing && existing.count > 1) {
        return prev.map(e => e.enemyId === id ? { ...e, count: e.count - 1 } : e);
      }
      return prev.filter(e => e.enemyId !== id);
    });
  };

  const handleStart = () => {
    if (selectedHeroes.length === 0 || selectedEnemies.length === 0) return;
    
    const encounterId = Math.random().toString(36).substr(2, 9);
    const encounter: Encounter = {
      id: encounterId,
      name: encounterName || "New Encounter",
      enemies: selectedEnemies,
      status: 'active'
    };
    
    addEncounter(encounter);
    setActiveEncounter(encounterId);
  };

  const filteredEnemies = enemies.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft size={20} /> Back
          </Link>
          <h1 className="text-2xl font-bold text-accent-red">NEW ENCOUNTER</h1>
        </div>
        <Button 
          variant="action" 
          onClick={handleStart}
          disabled={selectedHeroes.length === 0 || selectedEnemies.length === 0}
        >
          Start Combat →
        </Button>
      </div>

      <div className="space-y-8">
        {/* Heroes Section */}
        <section>
          <h2 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">Heroes ({selectedHeroes.length})</h2>
          {heroes.length === 0 ? (
            <div className="text-text-muted">No heroes. <Link to="/character" className="underline">Create some.</Link></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroes.map(hero => {
                const isSelected = selectedHeroes.includes(hero.id);
                return (
                  <div 
                    key={hero.id}
                    onClick={() => toggleHero(hero.id)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3",
                      isSelected 
                        ? "bg-green-950/20 border-green-500/50" 
                        : "bg-bg-card border-border-card opacity-60 hover:opacity-80"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border",
                      isSelected ? "bg-green-500 border-green-500 text-white" : "border-text-secondary"
                    )}>
                      {isSelected && <Check size={14} />}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{hero.name}</div>
                      <div className="text-xs text-text-secondary">Level {hero.level} {hero.profession}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Monster Library */}
        <section>
           <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">ENEMIES — Monster Library</h2>
           <Card className="p-4">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                  <Input 
                    placeholder="Search monsters..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="h-64 overflow-y-auto space-y-2 pr-2">
                {filteredEnemies.map(enemy => (
                  <div key={enemy.id} className="bg-bg-input/50 rounded-md p-3 flex justify-between items-center group hover:bg-bg-input transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="font-medium">{enemy.name}</span>
                       <span className="text-xs text-text-muted">(Lv{enemy.level})</span>
                       {enemy.isBoss && <Badge variant="points" className="text-[10px] py-0">BOSS</Badge>}
                       <span className="text-xs text-text-dim">HP: {enemy.hp.max}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-accent-red hover:bg-accent-red/20 h-7"
                      onClick={() => addEnemy(enemy.id)}
                    >
                      + Add
                    </Button>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* Encounter Section */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Encounter ({selectedEnemies.reduce((a, b) => a + b.count, 0)} enemies)</h2>
          <Card className="p-4 space-y-2 min-h-[100px]">
            {selectedEnemies.length === 0 ? (
              <div className="text-center text-text-muted italic py-8">Add enemies from the library above</div>
            ) : (
              selectedEnemies.map(item => {
                const enemy = enemies.find(e => e.id === item.enemyId);
                if (!enemy) return null;
                return (
                  <div key={item.enemyId} className="flex justify-between items-center p-2 bg-bg-input/20 rounded-md">
                     <span className="font-medium">{enemy.name}</span>
                     <div className="flex items-center gap-3">
                        <Button size="icon" variant="secondary" onClick={() => removeEnemy(item.enemyId)}><Minus size={14} /></Button>
                        <span className="font-bold w-4 text-center">{item.count}</span>
                        <Button size="icon" variant="secondary" onClick={() => addEnemy(item.enemyId)}><Plus size={14} /></Button>
                     </div>
                  </div>
                );
              })
            )}
          </Card>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-6 border-t border-border-card sticky bottom-0 bg-bg-page py-6 z-10">
        <div className="flex gap-4">
          <Input 
            placeholder="Encounter name (e.g., Forest Path Ambush)" 
            className="flex-1 h-12 text-lg"
            value={encounterName}
            onChange={e => setEncounterName(e.target.value)}
          />
          <Button 
            variant="action" 
            size="lg" 
            className="px-8 radius-xl"
            onClick={handleStart}
            disabled={selectedHeroes.length === 0 || selectedEnemies.length === 0}
          >
            Roll Initiative & Start Combat
          </Button>
        </div>
      </div>
    </div>
  );
};
