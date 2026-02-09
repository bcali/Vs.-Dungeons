import React from "react";
import { useGameStore } from "../store/gameStore";
import { CombatSetup } from "../components/features/combat/CombatSetup";
import { CombatTracker } from "../components/features/combat/CombatTracker";

export const CombatPage: React.FC = () => {
  const { activeEncounterId } = useGameStore();

  if (activeEncounterId) {
    return <CombatTracker />;
  }

  return <CombatSetup />;
};
