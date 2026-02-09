import React from "react";
import { Link } from "react-router-dom";
import { Shield, Swords, Settings } from "lucide-react";
import { Card } from "../components/shared/Card";

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-accent-gold tracking-tight">VS. DUNGEONS</h1>
        <p className="text-lg text-text-secondary">Digital GM Toolkit</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link to="/character">
          <Card className="flex items-center gap-3 p-5 hover:bg-bg-input transition-colors cursor-pointer radius-xl">
            <Shield className="w-6 h-6 text-accent-gold" />
            <span className="text-lg font-semibold text-text-primary">Character Sheets</span>
          </Card>
        </Link>
        
        <Link to="/combat">
          <Card className="flex items-center gap-3 p-5 hover:bg-bg-input transition-colors cursor-pointer radius-xl">
            <Swords className="w-6 h-6 text-accent-red" />
            <span className="text-lg font-semibold text-text-primary">Combat Tracker</span>
          </Card>
        </Link>
        
        <Link to="/config">
          <Card className="flex items-center gap-3 p-5 hover:bg-bg-input transition-colors cursor-pointer radius-xl">
            <Settings className="w-6 h-6 text-text-secondary" />
            <span className="text-lg font-semibold text-text-primary">GM Config</span>
          </Card>
        </Link>
      </div>

      <div className="mt-8 text-sm text-text-dim text-center">
        <p>Built for iPad • Dark Fantasy Theme • Claude AI Powered</p>
      </div>
    </div>
  );
};
