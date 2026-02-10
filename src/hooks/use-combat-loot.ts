// ============================================================
// Phase 4: useCombatLoot Hook
//
// Orchestrates the full post-combat flow:
//   1. Detect combat victory
//   2. Calculate XP
//   3. Roll loot for each enemy
//   4. Manage split mode
//   5. Persist everything to Supabase
//   6. Update character sheets
// ============================================================

import { useCallback, useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useLootStore } from '@/stores/loot-store';
import type { XpAward } from '@/stores/loot-store';
import {
  preloadLootEngine,
  rollEncounterLoot,
  autoSplitLoot,
  giveAllLoot,
  applyLootToCharacters,
  grantManualLoot,
} from '@/lib/loot/loot-engine';
import type {
  DefeatedEnemy,
  LootAssignment,
  EncounterLootResult,
  EnemyLootRoll,
} from '@/types/game';

// ============================================================
// XP Calculation (from game_config)
// ============================================================

interface XpConfig {
  monster_at_level: [number, number];  // [3, 5] range
  monster_below_level: number;
  boss: [number, number];
  session_bonus: number;
}

function calculateXpForEnemy(enemy: DefeatedEnemy, heroLevel: number, config: XpConfig): number {
  if (enemy.isBoss) {
    const [min, max] = config.boss;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  if (enemy.level >= heroLevel) {
    const [min, max] = config.monster_at_level;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return config.monster_below_level;
}

function calculateEncounterXp(
  enemies: DefeatedEnemy[],
  heroLevel: number,
  config: XpConfig
): number {
  return enemies.reduce((sum, enemy) => sum + calculateXpForEnemy(enemy, heroLevel, config), 0);
}

function checkLevelUp(
  currentXp: number,
  xpEarned: number,
  currentLevel: number,
  thresholds: number[]
): { leveledUp: boolean; newLevel: number; xpNeeded: number } {
  const totalXp = currentXp + xpEarned;
  let newLevel = currentLevel;

  // Walk up levels
  for (let lvl = currentLevel; lvl < thresholds.length; lvl++) {
    if (totalXp >= thresholds[lvl]) {
      newLevel = lvl + 1;
    } else {
      break;
    }
  }

  const nextThreshold = newLevel < thresholds.length ? thresholds[newLevel] : thresholds[thresholds.length - 1];

  return {
    leveledUp: newLevel > currentLevel,
    newLevel,
    xpNeeded: nextThreshold,
  };
}

// ============================================================
// Main Hook
// ============================================================

interface UseCombatLootParams {
  /** From combat store — all participants */
  participants: {
    id: string;
    displayName: string;
    team: 'hero' | 'enemy';
    characterId?: string;
    currentHp: number;
    stats: { con: number; str: number; agi: number; mna: number; int: number; lck: number };
    level?: number;
    isBoss?: boolean;
  }[];
  /** From combat store */
  encounterName: string;
  roundNumber: number;
  /** Combat status — we watch for 'completed' */
  combatStatus: string;
}

export function useCombatLoot({ participants, encounterName, roundNumber, combatStatus }: UseCombatLootParams) {
  const supabase = getSupabase();
  const store = useLootStore();
  const hasTriggered = useRef(false);

  // ----- PRELOAD: Cache materials + loot tables at combat start -----
  useEffect(() => {
    if (combatStatus === 'active' && store.materials.length === 0) {
      preloadLootEngine(supabase).then((cache) => {
        store.preloadCache(cache.materials, cache.lootTables);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatStatus]);

  // ----- TRIGGER: Start loot flow when combat ends -----
  useEffect(() => {
    if (combatStatus !== 'completed' || hasTriggered.current) return;
    hasTriggered.current = true;

    const heroes = participants.filter((p) => p.team === 'hero' && p.characterId);
    const enemies = participants.filter((p) => p.team === 'enemy' && p.currentHp <= 0);

    const defeatedEnemies: DefeatedEnemy[] = enemies.map((e) => ({
      name: e.displayName,
      level: e.level || 1,
      isBoss: e.isBoss || false,
    }));

    store.startLootFlow({
      encounterName,
      turnsTaken: roundNumber,
      defeatedEnemies,
      heroCharacterIds: heroes.map((h) => h.characterId!),
    });

    // Calculate XP + roll loot
    triggerLootAndXp(heroes, defeatedEnemies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatStatus]);

  // ----- Core: Calculate XP and roll loot -----
  const triggerLootAndXp = useCallback(
    async (
      heroes: UseCombatLootParams['participants'],
      defeatedEnemies: DefeatedEnemy[]
    ) => {
      try {
        // Fetch game config for XP calc
        const { data: configData } = await supabase
          .from('game_config')
          .select('xp_awards, xp_thresholds')
          .limit(1)
          .single();

        const xpConfig: XpConfig = configData?.xp_awards || {
          monster_at_level: [3, 5],
          monster_below_level: 1,
          boss: [10, 15],
          session_bonus: 5,
        };
        const xpThresholds: number[] = configData?.xp_thresholds || [
          0, 10, 25, 45, 70, 100, 140, 190, 250, 320,
          400, 500, 620, 760, 920, 1100, 1300, 1520, 1760, 2020,
        ];

        // Fetch current character XP/level from DB
        const heroIds = heroes.map((h) => h.characterId!);
        const { data: charData } = await supabase
          .from('characters')
          .select('id, hero_name, level, xp')
          .in('id', heroIds);

        // Calculate XP awards
        const xpAwards: XpAward[] = (charData || []).map((char: Record<string, unknown>) => {
          const charLevel = (char.level as number) || 1;
          const charXp = (char.xp as number) || 0;
          const xpEarned = calculateEncounterXp(defeatedEnemies, charLevel, xpConfig);
          const { leveledUp, newLevel, xpNeeded } = checkLevelUp(
            charXp,
            xpEarned,
            charLevel,
            xpThresholds
          );

          return {
            characterId: char.id as string,
            heroName: (char.hero_name as string) || 'Unknown',
            xpBefore: charXp,
            xpEarned,
            xpNeeded,
            leveledUp,
            newLevel: leveledUp ? newLevel : undefined,
          };
        });

        store.setXpAwards(xpAwards);

        // Roll loot using preloaded cache
        const { materials, lootTables } = useLootStore.getState();

        if (materials.length === 0 || lootTables.length === 0) {
          // Cache wasn't ready — load now
          const cache = await preloadLootEngine(supabase);
          store.preloadCache(cache.materials, cache.lootTables);
          const result = rollEncounterLoot(
            encounterName,
            defeatedEnemies,
            cache.materials,
            cache.lootTables
          );
          store.setEnemyRolls(
            result.rolls as (EnemyLootRoll & { gold: number })[],
            result.totalDrops,
            result.goldEarned
          );
        } else {
          const result = rollEncounterLoot(
            encounterName,
            defeatedEnemies,
            materials,
            lootTables
          );
          store.setEnemyRolls(
            result.rolls as (EnemyLootRoll & { gold: number })[],
            result.totalDrops,
            result.goldEarned
          );
        }

        // Auto-generate initial split
        recalcSplit();
      } catch (err) {
        console.error('Loot flow error:', err);
        store.setError(err instanceof Error ? err.message : 'Failed to calculate loot');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.materials, store.lootTables]
  );

  // ----- Recalculate split when mode changes -----
  const recalcSplit = useCallback(() => {
    const { splitMode, totalDrops, totalGold, giveAllTargetId, xpAwards, encounterName: encName, enemyRolls } = useLootStore.getState();
    const characterIds = xpAwards.map((a) => a.characterId);

    if (characterIds.length === 0) return;

    const encounterResult: EncounterLootResult = {
      encounterName: encName,
      rolls: enemyRolls,
      totalDrops,
      goldEarned: totalGold,
    };

    let assignments: LootAssignment[];

    switch (splitMode) {
      case 'auto':
        assignments = autoSplitLoot(encounterResult, characterIds);
        break;
      case 'give-all': {
        const targetId = giveAllTargetId || characterIds[0];
        assignments = giveAllLoot(encounterResult, targetId);
        // Ensure other characters have empty assignments
        characterIds.forEach((id) => {
          if (!assignments.find((a) => a.characterId === id)) {
            assignments.push({ characterId: id, materials: [], gold: 0 });
          }
        });
        break;
      }
      case 'manual':
        // Keep current assignments (user is dragging items)
        return;
      default:
        assignments = autoSplitLoot(encounterResult, characterIds);
    }

    store.setAssignments(assignments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Persist everything to Supabase -----
  const saveLoot = useCallback(async () => {
    store.confirmAndSave();

    try {
      const { assignments, xpAwards: awards, manualGrants, encounterName: encName } = useLootStore.getState();

      // 1. Save loot assignments
      const lootResult = await applyLootToCharacters(
        supabase,
        assignments,
        encName,
        'combat'
      );

      if (!lootResult.success) {
        throw new Error(lootResult.error || 'Failed to save loot');
      }

      // 2. Save manual grants
      for (const grant of manualGrants) {
        if (grant.materials.length > 0 || grant.gold > 0) {
          await grantManualLoot(
            supabase,
            grant.characterId,
            grant.materials.map((m) => ({
              materialId: m.materialId,
              quantity: m.quantity,
            })),
            grant.gold,
            'manual',
            encName
          );
        }
      }

      // 3. Apply XP and level-ups
      for (const award of awards) {
        const newXp = award.xpBefore + award.xpEarned;
        const updates: Record<string, unknown> = { xp: newXp };

        if (award.leveledUp && award.newLevel) {
          updates.level = award.newLevel;
        }

        await supabase
          .from('characters')
          .update(updates)
          .eq('id', award.characterId);
      }

      store.setComplete();
    } catch (err) {
      console.error('Save loot failed:', err);
      store.setError(err instanceof Error ? err.message : 'Failed to save');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Change split mode -----
  const changeSplitMode = useCallback((mode: 'auto' | 'manual' | 'give-all') => {
    store.setSplitMode(mode);
    if (mode !== 'manual') {
      recalcSplit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Return to characters page -----
  const finishAndReturn = useCallback(() => {
    store.reset();
    hasTriggered.current = false;
    // Router navigation handled by the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State (read from store)
    phase: store.phase,
    error: store.error,
    encounterName: store.encounterName,
    turnsTaken: store.turnsTaken,
    xpAwards: store.xpAwards,
    enemyRolls: store.enemyRolls,
    revealedRolls: store.revealedRolls,
    totalDrops: store.totalDrops,
    totalGold: store.totalGold,
    splitMode: store.splitMode,
    assignments: store.assignments,
    manualGrants: store.manualGrants,
    materials: store.materials,

    // Actions
    revealRoll: store.revealRoll,
    revealAllRolls: store.revealAllRolls,
    changeSplitMode,
    setGiveAllTarget: store.setGiveAllTarget,
    updateAssignment: store.updateAssignment,
    addManualGrant: store.addManualGrant,
    addManualGold: store.addManualGold,
    removeManualGrant: store.removeManualGrant,
    saveLoot,
    finishAndReturn,
    recalcSplit,
  };
}
