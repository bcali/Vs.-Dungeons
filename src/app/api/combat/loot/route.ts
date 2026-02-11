// ============================================================
// Phase 4: API Route — POST /api/combat/loot
//
// Server-side endpoint for persisting loot + XP.
// Called by useCombatLoot hook after GM confirms.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { rankForLevel } from '@/lib/game/stats';

interface LootPayload {
  encounterName: string;
  sessionId?: string;

  // Loot assignments per character
  assignments: {
    characterId: string;
    materials: { materialId: string; quantity: number }[];
    gold: number;
  }[];

  // Manual GM grants
  manualGrants: {
    characterId: string;
    materials: { materialId: string; quantity: number }[];
    gold: number;
  }[];

  // XP awards
  xpAwards: {
    characterId: string;
    xpEarned: number;
    newTotalXp: number;
    leveledUp: boolean;
    newLevel?: number;
  }[];

  // Combat summary (for encounter_loot log)
  enemyRolls: {
    enemyName: string;
    d20Roll: number;
    isBoss: boolean;
    drops: { materialId: string; quantity: number }[];
    gold: number;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body: LootPayload = await req.json();

    // Validate payload
    if (!body.encounterName) {
      return NextResponse.json({ success: false, message: 'Missing encounterName' }, { status: 400 });
    }
    if (!Array.isArray(body.assignments) || !Array.isArray(body.xpAwards)) {
      return NextResponse.json({ success: false, message: 'Invalid payload structure' }, { status: 400 });
    }
    for (const a of body.assignments) {
      if (!a.characterId) {
        return NextResponse.json({ success: false, message: 'Assignment missing characterId' }, { status: 400 });
      }
    }
    for (const award of body.xpAwards) {
      if (!award.characterId || typeof award.xpEarned !== 'number') {
        return NextResponse.json({ success: false, message: 'XP award missing required fields' }, { status: 400 });
      }
    }

    const errors: string[] = [];

    // ---- 1. Apply material assignments ----
    for (const assignment of body.assignments) {
      for (const mat of assignment.materials) {
        const { error } = await supabase.rpc('add_character_material', {
          p_character_id: assignment.characterId,
          p_material_id: mat.materialId,
          p_quantity: mat.quantity,
        });
        if (error) errors.push(`Material add failed: ${error.message}`);
      }

      // Add gold
      if (assignment.gold > 0) {
        const { data: char } = await supabase
          .from('characters')
          .select('gold')
          .eq('id', assignment.characterId)
          .single();

        if (char) {
          const { error } = await supabase
            .from('characters')
            .update({ gold: ((char as { gold: number }).gold || 0) + assignment.gold })
            .eq('id', assignment.characterId);
          if (error) errors.push(`Gold update failed: ${error.message}`);
        }
      }
    }

    // ---- 2. Apply manual grants ----
    for (const grant of body.manualGrants) {
      for (const mat of grant.materials) {
        const { error } = await supabase.rpc('add_character_material', {
          p_character_id: grant.characterId,
          p_material_id: mat.materialId,
          p_quantity: mat.quantity,
        });
        if (error) errors.push(`Manual grant failed: ${error.message}`);
      }

      if (grant.gold > 0) {
        const { data: char } = await supabase
          .from('characters')
          .select('gold')
          .eq('id', grant.characterId)
          .single();

        if (char) {
          await supabase
            .from('characters')
            .update({ gold: ((char as { gold: number }).gold || 0) + grant.gold })
            .eq('id', grant.characterId);
        }
      }
    }

    // ---- 3. Apply XP and level-ups ----
    for (const award of body.xpAwards) {
      const updates: Record<string, unknown> = { xp: award.newTotalXp };

      if (award.leveledUp && award.newLevel) {
        updates.level = award.newLevel;
        updates.rank = rankForLevel(award.newLevel);
      }

      const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', award.characterId);

      if (error) errors.push(`XP update failed: ${error.message}`);
    }

    // ---- 4. Log encounter loot history ----
    const lootLogRows = body.enemyRolls.flatMap((roll) =>
      roll.drops.map((drop) => ({
        session_id: body.sessionId || null,
        encounter_name: body.encounterName,
        character_id: null, // Logged at encounter level, not per-character
        material_id: drop.materialId,
        quantity: drop.quantity,
        roll_value: roll.d20Roll,
        source: roll.isBoss ? 'boss' : 'combat',
      }))
    );

    if (lootLogRows.length > 0) {
      const { error } = await supabase.from('encounter_loot').insert(lootLogRows);
      if (error) errors.push(`Loot log failed: ${error.message}`);
    }

    // ---- Response ----
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors, message: 'Some operations failed' },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/combat/loot error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
