// Loot table roller

import { statBonus } from './stats';
import type { GameConfig } from '@/types/config';
import { DEFAULT_GAME_CONFIG } from '@/types/config';

export interface LootResult {
  roll: number;
  lckBonus: number;
  totalRoll: number;
  reward: string;
  isBoss: boolean;
}

/** Roll for loot: d20 + LCK bonus, lookup on level-appropriate table */
export function rollLoot(
  partyLevel: number,
  totalLck: number,
  isBoss: boolean = false,
  config?: Pick<GameConfig, 'lootTables' | 'statBaseValue'>
): LootResult {
  const roll = Math.floor(Math.random() * 20) + 1;
  const lckBonus = statBonus(totalLck, config);
  const totalRoll = roll + lckBonus;

  const tables = config?.lootTables ?? DEFAULT_GAME_CONFIG.lootTables;
  const tableKey = isBoss
    ? 'boss'
    : partyLevel >= 10
    ? '10+'
    : partyLevel >= 5
    ? '5-9'
    : '1-4';

  const table = tables[tableKey] ?? {};
  let reward = '1 gold';

  if (totalRoll >= 20) reward = table['20'] ?? '1 Epic + bonus';
  else if (totalRoll >= 19) reward = table['19'] ?? '1 Epic';
  else if (totalRoll >= 15) reward = table['15-18'] ?? '2 Common';
  else if (totalRoll >= 9) reward = table['9-14'] ?? '1 Common';
  else reward = table['1-8'] ?? '1 gold';

  return { roll, lckBonus, totalRoll, reward, isBoss };
}
