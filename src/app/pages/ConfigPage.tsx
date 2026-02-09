import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "../components/shared/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/shared/Tabs";
import { Card } from "../components/shared/Card";
import { Input } from "../components/shared/Input";

export const ConfigPage: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-bg-page flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft size={20} /> Home
          </Link>
          <h1 className="text-2xl font-bold text-accent-gold">GAME CONFIGURATION</h1>
        </div>
        <div className="flex gap-4">
            <Button variant="secondary">Reset Defaults</Button>
            <Button variant="secondary" disabled>Saved</Button>
        </div>
      </div>

      <Card>
          <Tabs defaultValue="stats">
              <TabsList className="mb-6">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="combat">Combat</TabsTrigger>
                  <TabsTrigger value="leveling">Leveling</TabsTrigger>
                  <TabsTrigger value="loot">Loot</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <NumberField label="Base Stat Value" value={3} />
                          <NumberField label="Stat Cap" value={15} />
                          <NumberField label="Base Movement" value={6} />
                      </div>
                      <div className="space-y-4">
                          <h3 className="font-semibold text-white">Stat Points Per Level</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <NumberField label="Level 1-4" value={1} />
                              <NumberField label="Level 5-9" value={2} />
                              <NumberField label="Level 10+" value={3} />
                          </div>
                      </div>
                  </div>
              </TabsContent>

              <TabsContent value="combat" className="space-y-6">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <NumberField label="Defend Bonus" value={4} />
                          <NumberField label="Help Friend Bonus" value={2} />
                          <NumberField label="Base Crit Value" value={20} />
                      </div>
                      <div className="space-y-4">
                          <h3 className="font-semibold text-white">Difficulty Targets</h3>
                          <NumberField label="Easy" value={8} />
                          <NumberField label="Medium" value={12} />
                          <NumberField label="Hard" value={16} />
                          <NumberField label="Epic" value={20} />
                      </div>
                  </div>
              </TabsContent>
              
               <TabsContent value="resources" className="text-text-muted italic">
                  Resource configuration coming soon...
              </TabsContent>
               <TabsContent value="leveling" className="text-text-muted italic">
                  Leveling tables configuration coming soon...
              </TabsContent>
              <TabsContent value="loot" className="text-text-muted italic">
                  Loot tables configuration coming soon...
              </TabsContent>
          </Tabs>
      </Card>
    </div>
  );
};

const NumberField = ({ label, value }: { label: string, value: number }) => (
    <div className="flex justify-between items-center bg-bg-input/30 p-2 rounded">
        <span className="text-sm text-text-secondary">{label}</span>
        <div className="flex items-center gap-3">
            <Button variant="secondary" size="icon" className="w-6 h-6">-</Button>
            <span className="font-bold text-white w-6 text-center">{value}</span>
            <Button variant="secondary" size="icon" className="w-6 h-6">+</Button>
        </div>
    </div>
)
