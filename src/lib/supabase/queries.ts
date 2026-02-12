// Supabase data access layer — queries & mutations

import { getSupabase } from './client';
import type { Character, Ability, Monster, Campaign, InventoryItem, CharacterSeals, Stats, SkillTreeSkill, SkillTreeClass, SkillBranch, SkillType, CharacterSkillAllocation, ActionBarSlot, CatalogItem, CraftingProfession, Material, CharacterMaterial, Profession, MonsterCategory, DamageType, ItemType, CharacterEquipmentItem, EquipmentSlot, EquipmentRarity, SpecialEffect } from '@/types/game';
import type { GameConfig } from '@/types/config';
import { maxHp } from '@/lib/game/stats';

// ─── Helpers ──────────────────────────────────────────────────────────────

/** DB rows from Supabase before mapping to app types */
type DbRow = Record<string, unknown>;

/** Log a query/mutation error consistently */
function logQueryError(fn: string, error: unknown): void {
  console.warn(`[queries] ${fn}:`, error);
}

// ─── Row → App type mappers ────────────────────────────────────────────

function rowToCharacter(row: DbRow): Character {
  return {
    id: row.id as string,
    campaignId: row.campaign_id as string,
    heroName: (row.hero_name as string) ?? null,
    playerName: (row.player_name as string) ?? null,
    playerAge: (row.player_age as number) ?? null,
    profession: (row.profession as Profession) ?? null,
    level: row.level as number,
    rank: row.rank as string,
    xp: row.xp as number,
    gold: row.gold as number,
    stats: { str: row.stat_str as number, spd: row.stat_spd as number, tgh: row.stat_tgh as number, smt: row.stat_smt as number },
    gearBonus: { str: row.gear_bonus_str as number, spd: row.gear_bonus_spd as number, tgh: row.gear_bonus_tgh as number, smt: row.gear_bonus_smt as number },
    unspentStatPoints: row.unspent_stat_points as number,
    currentHp: (row.current_hp as number) ?? null,
    spellSlotsUsed: (row.spell_slots_used as number) ?? 0,
    mov: (row.mov as number) ?? 3,
    avatarUrl: (row.avatar_url as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToMonster(row: DbRow): Monster {
  return {
    id: row.id as string,
    name: row.name as string,
    level: row.level as number,
    isBoss: row.is_boss as boolean,
    category: (row.category as MonsterCategory) ?? null,
    stats: { str: row.stat_str as number, spd: row.stat_spd as number, tgh: row.stat_tgh as number, smt: row.stat_smt as number },
    hp: row.hp as number,
    damage: row.damage as number,
    damageType: row.damage_type as DamageType,
    mov: (row.mov as number) ?? 3,
    attackRange: (row.attack_range as string) ?? 'Melee',
    specialAbilities: (row.special_abilities as Record<string, unknown>[]) ?? null,
    description: (row.description as string) ?? null,
    avatarUrl: (row.avatar_url as string) ?? null,
    xpReward: (row.xp_reward as number) ?? 0,
  };
}

function rowToAbility(row: DbRow): Ability {
  return {
    id: row.id as string,
    name: row.name as string,
    profession: row.profession as string,
    tier: row.tier as number,
    slotCost: (row.slot_cost as number) ?? 0,
    unlockLevel: row.unlock_level as number,
    description: row.description as string,
    range: (row.range as string) ?? 'Self',
    aoe: (row.aoe as string) ?? 'Single',
    effectJson: (row.effect_json as Record<string, unknown>) ?? null,
  };
}

function rowToConfig(row: DbRow): GameConfig {
  return {
    id: row.id as string,
    statCount: row.stat_count as number,
    statNames: row.stat_names as string[],
    statBaseValue: row.stat_base_value as number,
    statCap: row.stat_cap as number,
    statBonusFormula: row.stat_bonus_formula as string,
    statPointsPerLevel: row.stat_points_per_level as number[],
    hpFormula: row.hp_formula as string,
    spellSlotProgression: row.spell_slot_progression as number[],
    movByProfession: row.mov_by_profession as GameConfig['movByProfession'],
    meleeDefenseFormula: row.melee_defense_formula as string,
    rangedDefenseFormula: row.ranged_defense_formula as string,
    defendBonus: row.defend_bonus as number,
    helpFriendBonus: row.help_friend_bonus as number,
    flankingBonus: row.flanking_bonus as number,
    surroundingBonus: row.surrounding_bonus as number,
    critOnNat20: row.crit_on_nat20 as boolean,
    difficultyTargets: row.difficulty_targets as GameConfig['difficultyTargets'],
    shortRestSlotsRestore: row.short_rest_slots_restore as string,
    lootTables: row.loot_tables as Record<string, Record<string, string>>,
    xpAwards: row.xp_awards as Record<string, number | number[]>,
    xpThresholds: row.xp_thresholds as number[],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Campaigns ──────────────────────────────────────────────────────────

export async function fetchCampaign(): Promise<Campaign | null> {
  const { data, error } = await getSupabase()
    .from('campaigns')
    .select('*')
    .limit(1)
    .single();
  if (error) { logQueryError('fetchCampaign', error); return null; }
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    currentQuest: data.current_quest,
    partyLevel: data.party_level,
    worldThreat: data.world_threat,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// ─── Characters ─────────────────────────────────────────────────────────

export async function fetchCharacters(campaignId: string): Promise<Character[]> {
  const { data, error } = await getSupabase()
    .from('characters')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at');
  if (error) { logQueryError('fetchCharacters', error); return []; }
  if (!data) return [];
  return data.map(rowToCharacter);
}

export async function fetchCharacter(id: string): Promise<Character | null> {
  const { data, error } = await getSupabase()
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { logQueryError('fetchCharacter', error); return null; }
  if (!data) return null;
  return rowToCharacter(data);
}

export async function createCharacter(
  campaignId: string,
  heroName: string,
  playerName: string,
  profession: string,
  playerAge?: number
): Promise<Character | null> {
  const movMap: Record<string, number> = {
    knight: 3, ranger: 5, wizard: 3, healer: 4, rogue: 5, inventor: 3,
  };
  const { data, error } = await getSupabase()
    .from('characters')
    .insert({
      campaign_id: campaignId,
      hero_name: heroName,
      player_name: playerName,
      player_age: playerAge ?? null,
      profession,
      mov: movMap[profession] ?? 3,
      current_hp: maxHp(3), // v1.1: TGH 3 * 3 + 5 = 14
    })
    .select()
    .single();
  if (error) { logQueryError('createCharacter', error); return null; }
  if (!data) return null;

  // Create seals record
  const { error: sealsError } = await getSupabase().from('character_seals').insert({ character_id: data.id });
  if (sealsError) logQueryError('createCharacter.seals', sealsError);

  return rowToCharacter(data);
}

export async function updateCharacter(
  id: string,
  updates: Partial<{
    heroName: string;
    playerName: string;
    playerAge: number;
    profession: string;
    level: number;
    rank: string;
    xp: number;
    gold: number;
    stats: Stats;
    gearBonus: Stats;
    unspentStatPoints: number;
    currentHp: number;
    spellSlotsUsed: number;
    mov: number;
    avatarUrl: string;
  }>
): Promise<Character | null> {
  const row: Record<string, unknown> = {};
  if (updates.heroName !== undefined) row.hero_name = updates.heroName;
  if (updates.playerName !== undefined) row.player_name = updates.playerName;
  if (updates.playerAge !== undefined) row.player_age = updates.playerAge;
  if (updates.profession !== undefined) row.profession = updates.profession;
  if (updates.level !== undefined) row.level = updates.level;
  if (updates.rank !== undefined) row.rank = updates.rank;
  if (updates.xp !== undefined) row.xp = updates.xp;
  if (updates.gold !== undefined) row.gold = updates.gold;
  if (updates.unspentStatPoints !== undefined) row.unspent_stat_points = updates.unspentStatPoints;
  if (updates.currentHp !== undefined) row.current_hp = updates.currentHp;
  if (updates.spellSlotsUsed !== undefined) row.spell_slots_used = updates.spellSlotsUsed;
  if (updates.mov !== undefined) row.mov = updates.mov;
  if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
  if (updates.stats) {
    row.stat_str = updates.stats.str;
    row.stat_spd = updates.stats.spd;
    row.stat_tgh = updates.stats.tgh;
    row.stat_smt = updates.stats.smt;
  }
  if (updates.gearBonus) {
    row.gear_bonus_str = updates.gearBonus.str;
    row.gear_bonus_spd = updates.gearBonus.spd;
    row.gear_bonus_tgh = updates.gearBonus.tgh;
    row.gear_bonus_smt = updates.gearBonus.smt;
  }

  const { data, error } = await getSupabase()
    .from('characters')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) { logQueryError('updateCharacter', error); return null; }
  if (!data) return null;
  return rowToCharacter(data);
}

export async function deleteCharacter(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('characters').delete().eq('id', id);
  if (error) { logQueryError('deleteCharacter', error); return false; }
  return true;
}

// ─── Character Seals ────────────────────────────────────────────────────

export async function fetchSeals(characterId: string): Promise<CharacterSeals | null> {
  const { data, error } = await getSupabase()
    .from('character_seals')
    .select('*')
    .eq('character_id', characterId)
    .single();
  if (error) { logQueryError('fetchSeals', error); return null; }
  if (!data) return null;
  return {
    id: data.id,
    characterId: data.character_id,
    common: data.common,
    uncommon: data.uncommon,
    rare: data.rare,
    epic: data.epic,
    legendary: data.legendary,
  };
}

// ─── Character Abilities ────────────────────────────────────────────────

export async function fetchCharacterAbilities(characterId: string): Promise<(Ability & { learnedAtLevel: number })[]> {
  const { data, error } = await getSupabase()
    .from('character_abilities')
    .select('*, abilities(*)')
    .eq('character_id', characterId);
  if (error) { logQueryError('fetchCharacterAbilities', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    ...rowToAbility(row.abilities as DbRow),
    learnedAtLevel: row.learned_at_level as number,
  }));
}

export async function learnAbility(characterId: string, abilityId: string, level: number): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_abilities')
    .insert({ character_id: characterId, ability_id: abilityId, learned_at_level: level });
  if (error) { logQueryError('learnAbility', error); return false; }
  return true;
}

// ─── Character Inventory ────────────────────────────────────────────────

export async function fetchInventory(characterId: string): Promise<InventoryItem[]> {
  const { data, error } = await getSupabase()
    .from('character_inventory')
    .select('*')
    .eq('character_id', characterId)
    .order('created_at');
  if (error) { logQueryError('fetchInventory', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    id: row.id as string,
    characterId: row.character_id as string,
    itemName: row.item_name as string,
    itemType: row.item_type as ItemType,
    quantity: row.quantity as number,
    effectJson: (row.effect_json as Record<string, unknown>) ?? null,
    equipped: row.equipped as boolean,
  }));
}

// ─── Abilities (Reference Library) ──────────────────────────────────────

export async function fetchAbilitiesByProfession(profession: string): Promise<Ability[]> {
  const { data, error } = await getSupabase()
    .from('abilities')
    .select('*')
    .eq('profession', profession)
    .order('tier')
    .order('unlock_level');
  if (error) { logQueryError('fetchAbilitiesByProfession', error); return []; }
  if (!data) return [];
  return data.map(rowToAbility);
}

// ─── Monsters ───────────────────────────────────────────────────────────

export async function fetchMonsters(filters?: { level?: number; isBoss?: boolean }): Promise<Monster[]> {
  let query = getSupabase().from('monsters').select('*').order('level').order('name');
  if (filters?.level !== undefined) query = query.eq('level', filters.level);
  if (filters?.isBoss !== undefined) query = query.eq('is_boss', filters.isBoss);
  const { data, error } = await query;
  if (error) { logQueryError('fetchMonsters', error); return []; }
  if (!data) return [];
  return data.map(rowToMonster);
}

export async function fetchMonster(id: string): Promise<Monster | null> {
  const { data, error } = await getSupabase().from('monsters').select('*').eq('id', id).single();
  if (error) { logQueryError('fetchMonster', error); return null; }
  if (!data) return null;
  return rowToMonster(data);
}

// ─── Game Config ────────────────────────────────────────────────────────

export async function fetchGameConfig(): Promise<GameConfig | null> {
  const { data, error } = await getSupabase()
    .from('game_config')
    .select('*')
    .limit(1)
    .single();
  if (error) { logQueryError('fetchGameConfig', error); return null; }
  if (!data) return null;
  return rowToConfig(data);
}

export async function saveGameConfig(config: GameConfig): Promise<GameConfig | null> {
  const { data, error } = await getSupabase()
    .from('game_config')
    .update({
      stat_count: config.statCount,
      stat_names: config.statNames,
      stat_base_value: config.statBaseValue,
      stat_cap: config.statCap,
      stat_bonus_formula: config.statBonusFormula,
      stat_points_per_level: config.statPointsPerLevel,
      hp_formula: config.hpFormula,
      spell_slot_progression: config.spellSlotProgression,
      mov_by_profession: config.movByProfession,
      melee_defense_formula: config.meleeDefenseFormula,
      ranged_defense_formula: config.rangedDefenseFormula,
      defend_bonus: config.defendBonus,
      help_friend_bonus: config.helpFriendBonus,
      flanking_bonus: config.flankingBonus,
      surrounding_bonus: config.surroundingBonus,
      crit_on_nat20: config.critOnNat20,
      difficulty_targets: config.difficultyTargets,
      short_rest_slots_restore: config.shortRestSlotsRestore,
      loot_tables: config.lootTables,
      xp_awards: config.xpAwards,
      xp_thresholds: config.xpThresholds,
    })
    .eq('id', config.id)
    .select()
    .single();
  if (error) { logQueryError('saveGameConfig', error); return null; }
  if (!data) return null;
  return rowToConfig(data);
}

// ─── Combat Logs (persist to DB) ────────────────────────────────────────

export async function saveCombatLog(
  combatId: string,
  sessionId: string | null,
  campaignId: string,
  encounterName: string,
  status: string
): Promise<string | null> {
  const { data, error } = await getSupabase()
    .from('combats')
    .insert({
      id: combatId,
      session_id: sessionId,
      campaign_id: campaignId,
      name: encounterName,
      status,
    })
    .select('id')
    .single();
  if (error) { logQueryError('saveCombatLog', error); return null; }
  if (!data) return null;
  return data.id;
}

// ─── Skill Tree ────────────────────────────────────────────────────────

function rowToSkillTreeSkill(row: DbRow): SkillTreeSkill {
  return {
    id: row.id as string,
    skillCode: row.skill_code as string,
    name: row.name as string,
    class: row.class as SkillTreeClass,
    branch: row.branch as SkillBranch,
    tier: row.tier as number,
    skillType: row.skill_type as SkillType,
    maxRank: row.max_rank as number,
    description: row.description as string,
    rankEffects: (row.rank_effects as Record<string, unknown>[]) ?? null,
    legoTip: (row.lego_tip as string) ?? null,
    effectJson: (row.effect_json as Record<string, unknown>) ?? null,
    sortOrder: row.sort_order as number,
  };
}

export async function fetchSkillTreeSkills(skillClass: SkillTreeClass): Promise<SkillTreeSkill[]> {
  const { data, error } = await getSupabase()
    .from('skill_tree_skills')
    .select('*')
    .eq('class', skillClass)
    .order('branch')
    .order('tier')
    .order('sort_order');
  if (error) { logQueryError('fetchSkillTreeSkills', error); return []; }
  if (!data) return [];
  return data.map(rowToSkillTreeSkill);
}

export async function fetchSkillAllocations(characterId: string): Promise<CharacterSkillAllocation[]> {
  const { data, error } = await getSupabase()
    .from('character_skill_allocations')
    .select('*')
    .eq('character_id', characterId);
  if (error) { logQueryError('fetchSkillAllocations', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    id: row.id as string,
    characterId: row.character_id as string,
    skillId: row.skill_id as string,
    currentRank: row.current_rank as number,
    learnedAtLevel: row.learned_at_level as number,
  }));
}

export async function fetchActionBar(characterId: string): Promise<ActionBarSlot[]> {
  const { data, error } = await getSupabase()
    .from('character_action_bar')
    .select('*')
    .eq('character_id', characterId)
    .order('slot_number');
  if (error) { logQueryError('fetchActionBar', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    id: row.id as string,
    characterId: row.character_id as string,
    slotNumber: row.slot_number as number,
    skillId: row.skill_id as string | null,
    abilityId: row.ability_id as string | null,
  }));
}

export async function allocateSkillPoint(characterId: string, skillId: string): Promise<number | null> {
  const { data, error } = await getSupabase()
    .rpc('allocate_skill_point', { p_character_id: characterId, p_skill_id: skillId });
  if (error) { logQueryError('allocateSkillPoint', error); return null; }
  return data;
}

export async function respecCharacter(characterId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('respec_character', { p_character_id: characterId });
  if (error) { logQueryError('respecCharacter', error); return false; }
  return true;
}

export async function setActionBarSlot(
  characterId: string,
  slotNumber: number,
  skillId: string | null,
  abilityId: string | null
): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_action_bar')
    .upsert({
      character_id: characterId,
      slot_number: slotNumber,
      skill_id: skillId,
      ability_id: abilityId,
    }, { onConflict: 'character_id,slot_number' });
  if (error) { logQueryError('setActionBarSlot', error); return false; }
  return true;
}

export async function clearActionBarSlot(characterId: string, slotNumber: number): Promise<boolean> {
  return setActionBarSlot(characterId, slotNumber, null, null);
}

// ─── Rewards System ──────────────────────────────────────────────────────

export async function fetchMonstersByIds(ids: string[]): Promise<Monster[]> {
  if (ids.length === 0) return [];
  const { data, error } = await getSupabase()
    .from('monsters')
    .select('*')
    .in('id', ids);
  if (error) { logQueryError('fetchMonstersByIds', error); return []; }
  if (!data) return [];
  return data.map(rowToMonster);
}

export async function fetchItemCatalog(filters?: { itemType?: string; rarity?: string }): Promise<CatalogItem[]> {
  let query = getSupabase()
    .from('item_catalog')
    .select('*')
    .order('rarity')
    .order('name');
  if (filters?.itemType) query = query.eq('item_type', filters.itemType);
  if (filters?.rarity) query = query.eq('rarity', filters.rarity);
  const { data, error } = await query;
  if (error) { logQueryError('fetchItemCatalog', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    id: row.id as string,
    name: row.name as string,
    itemType: row.item_type as ItemType,
    rarity: row.rarity as CatalogItem['rarity'],
    description: (row.description as string) ?? null,
    effectJson: (row.effect_json as Record<string, unknown>) ?? null,
  }));
}

export async function addInventoryItem(
  characterId: string,
  itemName: string,
  itemType: string = 'misc',
  quantity: number = 1,
  effectJson?: Record<string, unknown> | null
): Promise<string | null> {
  const { data, error } = await getSupabase()
    .rpc('add_inventory_item', {
      p_character_id: characterId,
      p_item_name: itemName,
      p_item_type: itemType,
      p_quantity: quantity,
      p_effect_json: effectJson ?? null,
    });
  if (error) { logQueryError('addInventoryItem', error); return null; }
  return data;
}

export async function incrementXp(characterId: string, amount: number): Promise<number | null> {
  const { data, error } = await getSupabase()
    .rpc('increment_xp', {
      character_uuid: characterId,
      amount,
    });
  if (error) { logQueryError('incrementXp', error); return null; }
  return data;
}

export async function saveCombatRewards(combatId: string, rewardsJson: unknown): Promise<boolean> {
  const { error } = await getSupabase()
    .from('combats')
    .update({ rewards_json: rewardsJson })
    .eq('id', combatId);
  if (error) { logQueryError('saveCombatRewards', error); return false; }
  return true;
}

// ─── Crafting Professions ──────────────────────────────────────────────

export async function fetchCharacterCraftingProfessions(characterId: string): Promise<CraftingProfession[]> {
  const { data, error } = await getSupabase()
    .from('character_crafting_professions')
    .select('profession')
    .eq('character_id', characterId)
    .order('created_at');
  if (error) { logQueryError('fetchCharacterCraftingProfessions', error); return []; }
  if (!data) return [];
  return data.map((row: { profession: string }) => row.profession as CraftingProfession);
}

export async function addCharacterCraftingProfession(characterId: string, profession: CraftingProfession): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_crafting_professions')
    .insert({ character_id: characterId, profession });
  if (error) { logQueryError('addCharacterCraftingProfession', error); return false; }
  return true;
}

export async function fetchProfessionChoices(characterId: string, profession: CraftingProfession): Promise<Record<number, number>> {
  const { data, error } = await getSupabase()
    .from('character_profession_choices')
    .select('node_number, selected_option')
    .eq('character_id', characterId)
    .eq('profession', profession);
  if (error) { logQueryError('fetchProfessionChoices', error); return {}; }
  if (!data) return {};
  const choices: Record<number, number> = {};
  for (const row of data) {
    choices[row.node_number] = row.selected_option;
  }
  return choices;
}

export async function saveProfessionChoice(
  characterId: string,
  profession: CraftingProfession,
  nodeNumber: number,
  selectedOption: number
): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_profession_choices')
    .upsert({
      character_id: characterId,
      profession,
      node_number: nodeNumber,
      selected_option: selectedOption,
    }, { onConflict: 'character_id,profession,node_number' });
  if (error) { logQueryError('saveProfessionChoice', error); return false; }
  return true;
}

// ─── Materials & Loot ──────────────────────────────────────────────────

export async function fetchMaterials(): Promise<Material[]> {
  const { data, error } = await getSupabase()
    .from('materials')
    .select('*')
    .order('tier')
    .order('category')
    .order('name');
  if (error) { logQueryError('fetchMaterials', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
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

export async function fetchCharacterMaterials(characterId: string): Promise<CharacterMaterial[]> {
  const { data, error } = await getSupabase()
    .from('character_inventory_view')
    .select('*')
    .eq('character_id', characterId);
  if (error) { logQueryError('fetchCharacterMaterials', error); return []; }
  if (!data) return [];
  return data.map((row: DbRow) => ({
    characterId: row.character_id as string,
    materialId: row.material_id as string,
    quantity: row.quantity as number,
    materialName: row.material_name as string,
    category: row.category as Material['category'],
    tier: row.tier as Material['tier'],
    icon: row.icon as string | null,
    legoToken: row.lego_token as string | null,
  }));
}

export async function addCharacterMaterial(
  characterId: string,
  materialId: string,
  quantity: number = 1
): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('add_character_material', {
      p_character_id: characterId,
      p_material_id: materialId,
      p_quantity: quantity,
    });
  if (error) { logQueryError('addCharacterMaterial', error); return false; }
  return true;
}

export async function getLootDrops(
  enemyLevel: number,
  isBoss: boolean,
  roll: number
): Promise<unknown[]> {
  const { data, error } = await getSupabase()
    .rpc('get_loot_drops', {
      p_enemy_level: enemyLevel,
      p_is_boss: isBoss,
      p_roll: roll,
    });
  if (error) { logQueryError('getLootDrops', error); return []; }
  return Array.isArray(data) ? data : (data ? [data] : []);
}

export async function logEncounterLoot(
  characterId: string,
  materialId: string,
  quantity: number,
  rollValue: number | null,
  source: string = 'combat',
  encounterName?: string,
  sessionId?: string
): Promise<boolean> {
  const { error } = await getSupabase()
    .from('encounter_loot')
    .insert({
      character_id: characterId,
      material_id: materialId,
      quantity,
      roll_value: rollValue,
      source,
      encounter_name: encounterName ?? null,
      session_id: sessionId ?? null,
    });
  if (error) { logQueryError('logEncounterLoot', error); return false; }
  return true;
}

// ─── Equipment System ──────────────────────────────────────────────────

function rowToEquipmentItem(row: DbRow): CharacterEquipmentItem {
  return {
    id: row.id as string,
    characterId: row.character_id as string,
    templateId: row.template_id as string,
    name: row.name as string,
    slot: row.slot as EquipmentSlot,
    rarity: row.rarity as EquipmentRarity,
    level: row.level as number,
    statBonuses: (row.stat_bonuses as Partial<Stats>) ?? {},
    specialEffect: (row.special_effect as SpecialEffect) ?? null,
    equippedSlot: (row.equipped_slot as EquipmentSlot) ?? null,
    createdAt: row.created_at as string,
  };
}

/** Fetch all equipment for a character (equipped + stash) */
export async function fetchCharacterEquipment(characterId: string): Promise<CharacterEquipmentItem[]> {
  const { data, error } = await getSupabase()
    .from('character_equipment')
    .select('*')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false });
  if (error) { logQueryError('fetchCharacterEquipment', error); return []; }
  if (!data) return [];
  return data.map(rowToEquipmentItem);
}

/** Equip an item to a slot (auto-unequips existing, recalculates gear bonus) */
export async function equipItem(characterId: string, itemId: string, slot: EquipmentSlot): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('equip_item', {
      p_character_id: characterId,
      p_item_id: itemId,
      p_slot: slot,
    });
  if (error) { logQueryError('equipItem', error); return false; }
  return true;
}

/** Unequip an item from a slot (moves to stash, recalculates gear bonus) */
export async function unequipItem(characterId: string, slot: EquipmentSlot): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('unequip_item', {
      p_character_id: characterId,
      p_slot: slot,
    });
  if (error) { logQueryError('unequipItem', error); return false; }
  return true;
}

/** Craft a new equipment item (insert into character_equipment) */
export async function craftEquipment(
  characterId: string,
  templateId: string,
  name: string,
  slot: EquipmentSlot,
  rarity: EquipmentRarity,
  level: number,
  statBonuses: Partial<Stats>,
  specialEffect: SpecialEffect | null,
): Promise<string | null> {
  const { data, error } = await getSupabase()
    .rpc('craft_equipment', {
      p_character_id: characterId,
      p_template_id: templateId,
      p_name: name,
      p_slot: slot,
      p_rarity: rarity,
      p_level: level,
      p_stat_bonuses: statBonuses,
      p_special_effect: specialEffect,
    });
  if (error) { logQueryError('craftEquipment', error); return null; }
  return data as string;
}

/** Salvage (delete) an equipment item */
export async function salvageEquipment(characterId: string, itemId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('salvage_equipment', {
      p_character_id: characterId,
      p_item_id: itemId,
    });
  if (error) { logQueryError('salvageEquipment', error); return false; }
  return true;
}
