// ============================================================
// Phase 2: Loot Rolling Engine
//
// Pure logic + Supabase integration for post-combat loot.
// No UI — just the engine that rolls, resolves, and persists.
// ============================================================

import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Material,
  MaterialTier,
  LootDrop,
  LootTableRow,
  EnemyLootRoll,
  ResolvedDrop,
  EncounterLootResult,
  LootSource,
  DefeatedEnemy,
  LootAssignment,
  LootEngineCache,
} from '@/types/game';

// ============================================================
// 1. DICE ROLLING
// ============================================================

/** Roll a d20 (1-20). Uses crypto.getRandomValues when available. */
export function rollD20(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return (arr[0] % 20) + 1;
  }
  return Math.floor(Math.random() * 20) + 1;
}

// ============================================================
// 2. LOOT TABLE LOOKUP
// ============================================================

/** Fetch the matching loot table row from Supabase */
export async function fetchLootDrops(
  supabase: SupabaseClient,
  enemyLevel: number,
  isBoss: boolean,
  roll: number
): Promise<LootDrop[]> {
  const { data, error } = await supabase
    .from('loot_tables')
    .select('drops')
    .lte('level_min', enemyLevel)
    .gte('level_max', enemyLevel)
    .eq('is_boss', isBoss)
    .lte('roll_min', roll)
    .gte('roll_max', roll)
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Loot table lookup failed:', error);
    // Fallback: 1 gold so kids always get something
    return [{ tier: 'gold', qty: 1 }];
  }

  return data.drops as LootDrop[];
}

/**
 * In-memory loot table lookup (no DB call).
 * Use this if you preload all loot_tables at combat start.
 */
export function lookupLootDrops(
  tables: LootTableRow[],
  enemyLevel: number,
  isBoss: boolean,
  roll: number
): LootDrop[] {
  const match = tables.find(
    (t) =>
      enemyLevel >= t.levelMin &&
      enemyLevel <= t.levelMax &&
      t.isBoss === isBoss &&
      roll >= t.rollMin &&
      roll <= t.rollMax
  );

  if (!match) {
    return [{ tier: 'gold', qty: 1 }];
  }

  return match.drops;
}

// ============================================================
// 3. MATERIAL RESOLUTION
// ============================================================

/**
 * Preload all materials from DB (small table, ~30 rows).
 * Cache this at app start or combat start.
 */
export async function fetchAllMaterials(
  supabase: SupabaseClient
): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('tier')
    .order('category');

  if (error) {
    console.error('Failed to fetch materials:', error);
    return [];
  }

  // Map snake_case DB columns to camelCase
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    category: row.category as Material['category'],
    tier: row.tier as Material['tier'],
    icon: row.icon as string | null,
    legoToken: row.lego_token as string | null,
    dropLevelMin: row.drop_level_min as number,
    description: row.description as string | null,
  }));
}

/**
 * Given a LootDrop spec, pick a random concrete material.
 *
 * Rules:
 * - If category is "seal", pick the seal of that tier
 * - If category is "any", pick randomly from metal/herb/monster_part/arcane
 * - If category is specific, pick that one
 * - Respects dropLevelMin (won't drop Mithril Ore at level 1)
 */
export function resolveDrop(
  drop: LootDrop,
  allMaterials: Material[],
  enemyLevel: number
): ResolvedDrop | null {
  // Gold is not a material — handled separately
  if (drop.tier === 'gold') return null;

  const tier = drop.tier as MaterialTier;
  const category = drop.category || 'any';

  // Filter eligible materials
  let candidates = allMaterials.filter(
    (m) => m.tier === tier && m.dropLevelMin <= enemyLevel
  );

  if (category === 'seal') {
    candidates = candidates.filter((m) => m.category === 'seal');
  } else if (category === 'any') {
    // Exclude seals from "any" rolls — seals only come from explicit seal drops
    candidates = candidates.filter((m) => m.category !== 'seal');
  } else {
    candidates = candidates.filter((m) => m.category === category);
  }

  if (candidates.length === 0) {
    // Fallback: try any material of that tier (ignore level restriction)
    candidates = allMaterials.filter(
      (m) => m.tier === tier && m.category !== 'seal'
    );
  }

  if (candidates.length === 0) return null;

  // Pick random
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    material: picked,
    quantity: drop.qty,
  };
}

/**
 * Resolve all drops from a loot roll into concrete materials.
 * Returns resolved materials + gold amount separately.
 */
export function resolveAllDrops(
  drops: LootDrop[],
  allMaterials: Material[],
  enemyLevel: number
): { materials: ResolvedDrop[]; gold: number } {
  let gold = 0;
  const materials: ResolvedDrop[] = [];

  for (const drop of drops) {
    if (drop.tier === 'gold') {
      gold += drop.qty;
      continue;
    }

    const resolved = resolveDrop(drop, allMaterials, enemyLevel);
    if (resolved) {
      // Merge if same material already in list
      const existing = materials.find(
        (m) => m.material.id === resolved.material.id
      );
      if (existing) {
        existing.quantity += resolved.quantity;
      } else {
        materials.push(resolved);
      }
    }
  }

  return { materials, gold };
}

// ============================================================
// 4. PER-ENEMY LOOT ROLLER
// ============================================================

/**
 * Roll loot for a single defeated enemy.
 * Returns the roll result with resolved materials.
 */
export function rollEnemyLoot(
  enemy: DefeatedEnemy,
  allMaterials: Material[],
  lootTables: LootTableRow[],
  overrideRoll?: number // for testing or GM override
): EnemyLootRoll & { gold: number } {
  const d20Roll = overrideRoll ?? rollD20();
  const dropSpec = lookupLootDrops(lootTables, enemy.level, enemy.isBoss, d20Roll);
  const { materials, gold } = resolveAllDrops(dropSpec, allMaterials, enemy.level);

  return {
    enemyName: enemy.name,
    enemyLevel: enemy.level,
    isBoss: enemy.isBoss,
    d20Roll,
    drops: [...materials],
    gold,
  };
}

/**
 * Roll loot for ALL defeated enemies in an encounter.
 * Aggregates totals across all rolls.
 */
export function rollEncounterLoot(
  encounterName: string,
  enemies: DefeatedEnemy[],
  allMaterials: Material[],
  lootTables: LootTableRow[]
): EncounterLootResult {
  const rolls: EnemyLootRoll[] = [];
  let totalGold = 0;
  const totalDropsMap = new Map<string, ResolvedDrop>();

  for (const enemy of enemies) {
    const roll = rollEnemyLoot(enemy, allMaterials, lootTables);
    rolls.push(roll);

    totalGold += roll.gold || 0;

    for (const drop of roll.drops) {
      const key = drop.material.id;
      const existing = totalDropsMap.get(key);
      if (existing) {
        existing.quantity += drop.quantity;
      } else {
        totalDropsMap.set(key, { ...drop });
      }
    }
  }

  return {
    encounterName,
    rolls,
    totalDrops: Array.from(totalDropsMap.values()),
    goldEarned: totalGold,
  };
}

// ============================================================
// 5. APPLY LOOT TO CHARACTERS (Supabase writes)
// ============================================================

/**
 * Write loot assignments to Supabase.
 * - Upserts character_materials (inventory)
 * - Inserts encounter_loot rows (history log)
 * - Updates character gold
 */
export async function applyLootToCharacters(
  supabase: SupabaseClient,
  assignments: LootAssignment[],
  encounterName: string,
  source: LootSource = 'combat',
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    for (const assignment of assignments) {
      // --- Add materials to inventory ---
      for (const drop of assignment.materials) {
        // Upsert via RPC function
        const { error: matError } = await supabase.rpc(
          'add_character_material',
          {
            p_character_id: assignment.characterId,
            p_material_id: drop.material.id,
            p_quantity: drop.quantity,
          }
        );

        if (matError) {
          console.error('Failed to add material:', matError);
          // Continue — don't lose other loot on a single failure
        }

        // --- Log to encounter_loot ---
        await supabase.from('encounter_loot').insert({
          session_id: sessionId || null,
          encounter_name: encounterName,
          character_id: assignment.characterId,
          material_id: drop.material.id,
          quantity: drop.quantity,
          source,
        });
      }

      // --- Add gold ---
      if (assignment.gold > 0) {
        const { data: char } = await supabase
          .from('characters')
          .select('gold')
          .eq('id', assignment.characterId)
          .single();

        if (char) {
          await supabase
            .from('characters')
            .update({ gold: ((char as { gold: number }).gold || 0) + assignment.gold })
            .eq('id', assignment.characterId);
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error('applyLootToCharacters failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================
// 6. MANUAL ITEM ADD (GM gifts)
// ============================================================

/**
 * GM manually awards materials or gold to a character.
 * Used for puzzle rewards, exploration finds, story gifts, etc.
 */
export async function grantManualLoot(
  supabase: SupabaseClient,
  characterId: string,
  materials: { materialId: string; quantity: number }[],
  gold: number,
  source: LootSource = 'manual',
  encounterName?: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    for (const mat of materials) {
      await supabase.rpc('add_character_material', {
        p_character_id: characterId,
        p_material_id: mat.materialId,
        p_quantity: mat.quantity,
      });

      await supabase.from('encounter_loot').insert({
        session_id: sessionId || null,
        encounter_name: encounterName || 'Manual Grant',
        character_id: characterId,
        material_id: mat.materialId,
        quantity: mat.quantity,
        source,
      });
    }

    if (gold > 0) {
      const { data: char } = await supabase
        .from('characters')
        .select('gold')
        .eq('id', characterId)
        .single();

      if (char) {
        await supabase
          .from('characters')
          .update({ gold: ((char as { gold: number }).gold || 0) + gold })
          .eq('id', characterId);
      }
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================
// 7. LOOT SPLITTING HELPERS
// ============================================================

/**
 * Auto-split loot evenly between characters.
 * Remainders go round-robin (first char gets extra on odd splits).
 */
export function autoSplitLoot(
  encounterResult: EncounterLootResult,
  characterIds: string[]
): LootAssignment[] {
  const n = characterIds.length;
  if (n === 0) return [];

  // Initialize assignments
  const assignments: LootAssignment[] = characterIds.map((id) => ({
    characterId: id,
    materials: [],
    gold: 0,
  }));

  // Split gold
  const goldEach = Math.floor(encounterResult.goldEarned / n);
  const goldRemainder = encounterResult.goldEarned % n;
  assignments.forEach((a, i) => {
    a.gold = goldEach + (i < goldRemainder ? 1 : 0);
  });

  // Split materials — round-robin by item
  let charIndex = 0;
  for (const drop of encounterResult.totalDrops) {
    // For qty > 1, split the quantity
    const qtyEach = Math.floor(drop.quantity / n);
    const qtyRemainder = drop.quantity % n;

    if (qtyEach > 0) {
      // Everyone gets some
      assignments.forEach((a, i) => {
        const qty = qtyEach + (i < qtyRemainder ? 1 : 0);
        if (qty > 0) {
          a.materials.push({ material: drop.material, quantity: qty });
        }
      });
    } else {
      // Only 1 of this item — give to next in rotation
      assignments[charIndex % n].materials.push({
        material: drop.material,
        quantity: drop.quantity,
      });
      charIndex++;
    }
  }

  return assignments;
}

/**
 * Give ALL loot to a single character.
 * Useful for targeted crafting or single-player sessions.
 */
export function giveAllLoot(
  encounterResult: EncounterLootResult,
  characterId: string
): LootAssignment[] {
  return [
    {
      characterId,
      materials: encounterResult.totalDrops.map((d) => ({ ...d })),
      gold: encounterResult.goldEarned,
    },
  ];
}

// ============================================================
// 8. PRELOAD HELPER (call at combat start)
// ============================================================

/**
 * Preload all materials and loot tables into memory.
 * Call once at combat start so rolls are instant with no DB calls.
 */
export async function preloadLootEngine(
  supabase: SupabaseClient
): Promise<LootEngineCache> {
  const [materialsRes, tablesRes] = await Promise.all([
    supabase.from('materials').select('*'),
    supabase.from('loot_tables').select('*'),
  ]);

  // Map snake_case DB columns to camelCase
  const materials: Material[] = (materialsRes.data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    category: row.category as Material['category'],
    tier: row.tier as Material['tier'],
    icon: row.icon as string | null,
    legoToken: row.lego_token as string | null,
    dropLevelMin: row.drop_level_min as number,
    description: row.description as string | null,
  }));

  const lootTables: LootTableRow[] = (tablesRes.data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    levelMin: row.level_min as number,
    levelMax: row.level_max as number,
    isBoss: row.is_boss as boolean,
    rollMin: row.roll_min as number,
    rollMax: row.roll_max as number,
    drops: row.drops as LootDrop[],
    description: row.description as string | null,
  }));

  return { materials, lootTables };
}
