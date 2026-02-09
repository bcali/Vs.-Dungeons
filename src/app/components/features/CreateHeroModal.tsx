import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../shared/Modal";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Profession } from "../../types/game";
import { cn } from "../../../lib/utils";

interface CreateHeroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; playerName?: string; profession: Profession; age?: number }) => void;
}

const professions: { id: Profession; role: string; stats: string; icon: string }[] = [
  { id: "Knight", role: "Tank / Frontline", stats: "STR + CON", icon: "🛡️" },
  { id: "Ranger", role: "Ranged / Scout", stats: "AGI + INT", icon: "🏹" },
  { id: "Wizard", role: "Damage Caster", stats: "MNA + INT", icon: "🪄" },
  { id: "Healer", role: "Support", stats: "MNA + CON", icon: "✨" },
  { id: "Rogue", role: "Stealth / Burst", stats: "AGI + LCK", icon: "🗡️" },
  { id: "Inventor", role: "Gadgets", stats: "INT + AGI", icon: "🔧" },
];

export const CreateHeroModal: React.FC<CreateHeroModalProps> = ({ open, onOpenChange, onCreate }) => {
  const [name, setName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [profession, setProfession] = useState<Profession>("Knight");
  const [age, setAge] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate({
      name,
      playerName: playerName || undefined,
      profession,
      age: age ? parseInt(age) : undefined,
    });
    
    // Reset
    setName("");
    setPlayerName("");
    setProfession("Knight");
    setAge("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[448px] bg-bg-card border-border-card">
        <DialogHeader>
          <DialogTitle>Create New Hero</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Hero Name <span className="text-red-400">*</span></label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Sir Bricksalot" 
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Player Name (Optional)</label>
            <Input 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)} 
              placeholder="Player Name" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-text-secondary">Profession</label>
            <div className="grid grid-cols-3 gap-2">
              {professions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProfession(p.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-md border transition-all h-20",
                    profession === p.id
                      ? "bg-accent-gold text-bg-page border-accent-gold"
                      : "bg-bg-input text-text-secondary border-transparent hover:text-white hover:bg-bg-input/80"
                  )}
                >
                  <span className="text-xl mb-1">{p.icon}</span>
                  <span className="text-xs font-semibold">{p.id}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted text-center">
              {professions.find(p => p.id === profession)?.role} — {professions.find(p => p.id === profession)?.stats}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Player Age (Optional)</label>
            <Input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              placeholder="7" 
            />
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!name.trim()}>
              Create Hero
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
