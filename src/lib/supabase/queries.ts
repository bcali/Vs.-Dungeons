// Supabase data access layer — queries & mutations

import { getSupabase } from './client';
import type { Character, Ability, Monster, Campaign, InventoryItem, CharacterSeals, Stats, SkillTreeSkill, SkillTreeClass, CharacterSkillAllocation, ActionBarSlot, CatalogItem, CraftingProfession, Material, CharacterMaterial } from '@/types/game';
import type { GameConfig } from '@/types/config';

// ─── Row → App type mappers ────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCharacter(row: any): Character {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    heroName: row.hero_name,
    playerName: row.player_name,
    playerAge: row.player_age,
    profession: row.profession,
    level: row.level,
    rank: row.rank,
    xp: row.xp,
    gold: row.gold,
    resourceType: row.resource_type,
    stats: { con: row.stat_con, str: row.stat_str, agi: row.stat_agi, mna: row.stat_mna, int: row.stat_int, lck: row.stat_lck },
    gearBonus: { con: row.gear_bonus_con, str: row.gear_bonus_str, agi: row.gear_bonus_agi, mna: row.gear_bonus_mna, int: row.gear_bonus_int, lck: row.gear_bonus_lck },
    unspentStatPoints: row.unspent_stat_points,
    currentHp: row.current_hp,
    currentResource: row.current_resource,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMonster(row: any): Monster {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    isBoss: row.is_boss,
    category: row.category,
    stats: { con: row.stat_con, str: row.stat_str, agi: row.stat_agi, mna: row.stat_mna, int: row.stat_int, lck: row.stat_lck },
    hp: row.hp,
    damage: row.damage,
    damageType: row.damage_type,
    specialAbilities: row.special_abilities,
    description: row.description,
    avatarUrl: row.avatar_url,
    xpReward: row.xp_reward ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAbility(row: any): Ability {
  return {
    id: row.id,
    name: row.name,
    profession: row.profession,
    tier: row.tier,
    resourceCost: row.resource_cost,
    resourceType: row.resource_type,
    unlockLevel: row.unlock_level,
    description: row.description,
    effectJson: row.effect_json,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToConfig(row: any): GameConfig {
  return {
    id: row.id,
    statCount: row.stat_count,
    statNames: row.stat_names,
    statBaseValue: row.stat_base_value,
    statCap: row.stat_cap,
    statBonusFormula: row.stat_bonus_formula,
    statPointsPerLevel: row.stat_points_per_level,
    hpFormula: row.hp_formula,
    manaPoolFormula: row.mana_pool_formula,
    energyPoolMax: row.energy_pool_max,
    ragePoolMax: row.rage_pool_max,
    movementBase: row.movement_base,
    manaRegenPerTurn: row.mana_regen_per_turn,
    energyRegenPerTurn: row.energy_regen_per_turn,
    rageOnHitTaken: row.rage_on_hit_taken,
    rageOnMeleeHit: row.rage_on_melee_hit,
    rageOnCritTaken: row.rage_on_crit_taken,
    rageOnAllyKo: row.rage_on_ally_ko,
    meleeDefenseFormula: row.melee_defense_formula,
    rangedDefenseFormula: row.ranged_defense_formula,
    defendBonus: row.defend_bonus,
    helpFriendBonus: row.help_friend_bonus,
    baseCritValue: row.base_crit_value,
    luckCritThresholds: row.luck_crit_thresholds,
    luckySavesPerSession: row.lucky_saves_per_session,
    difficultyTargets: row.difficulty_targets,
    abilityCosts: row.ability_costs,
    shortRestResourceRestore: row.short_rest_resource_restore,
    lootTables: row.loot_tables,
    xpAwards: row.xp_awards,
    xpThresholds: row.xp_thresholds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Campaigns ──────────────────────────────────────────────────────────

export async function fetchCampaign(): Promise<Campaign | null> {
  const { data, error } = await getSupabase()
    .from('campaigns')
    .select('*')
    .limit(1)
    .single();
  if (error || !data) return null;
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
  if (error || !data) return [];
  return data.map(rowToCharacter);
}

export async function fetchCharacter(id: string): Promise<Character | null> {
  const { data, error } = await getSupabase()
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return rowToCharacter(data);
}

export async function createCharacter(
  campaignId: string,
  heroName: string,
  playerName: string,
  profession: string,
  playerAge?: number
): Promise<Character | null> {
  const resourceMap: Record<string, string> = {
    knight: 'rage', ranger: 'mana', wizard: 'mana',
    healer: 'mana', rogue: 'energy', inventor: 'mana',
  };
  const { data, error } = await getSupabase()
    .from('characters')
    .insert({
      campaign_id: campaignId,
      hero_name: heroName,
      player_name: playerName,
      player_age: playerAge ?? null,
      profession,
      resource_type: resourceMap[profession] ?? 'mana',
      current_hp: 9, // CON 3 * 3
    })
    .select()
    .single();
  if (error || !data) return null;

  // Create seals record
  await getSupabase().from('character_seals').insert({ character_id: data.id });

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
    resourceType: string;
    stats: Stats;
    gearBonus: Stats;
    unspentStatPoints: number;
    currentHp: number;
    currentResource: number;
    avatarUrl: string;
  }>
): Promise<Character | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (updates.heroName !== undefined) row.hero_name = updates.heroName;
  if (updates.playerName !== undefined) row.player_name = updates.playerName;
  if (updates.playerAge !== undefined) row.player_age = updates.playerAge;
  if (updates.profession !== undefined) row.profession = updates.profession;
  if (updates.level !== undefined) row.level = updates.level;
  if (updates.rank !== undefined) row.rank = updates.rank;
  if (updates.xp !== undefined) row.xp = updates.xp;
  if (updates.gold !== undefined) row.gold = updates.gold;
  if (updates.resourceType !== undefined) row.resource_type = updates.resourceType;
  if (updates.unspentStatPoints !== undefined) row.unspent_stat_points = updates.unspentStatPoints;
  if (updates.currentHp !== undefined) row.current_hp = updates.currentHp;
  if (updates.currentResource !== undefined) row.current_resource = updates.currentResource;
  if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
  if (updates.stats) {
    row.stat_con = updates.stats.con;
    row.stat_str = updates.stats.str;
    row.stat_agi = updates.stats.agi;
    row.stat_mna = updates.stats.mna;
    row.stat_int = updates.stats.int;
    row.stat_lck = updates.stats.lck;
  }
  if (updates.gearBonus) {
    row.gear_bonus_con = updates.gearBonus.con;
    row.gear_bonus_str = updates.gearBonus.str;
    row.gear_bonus_agi = updates.gearBonus.agi;
    row.gear_bonus_mna = updates.gearBonus.mna;
    row.gear_bonus_int = updates.gearBonus.int;
    row.gear_bonus_lck = updates.gearBonus.lck;
  }

  const { data, error } = await getSupabase()
    .from('characters')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) return null;
  return rowToCharacter(data);
}

export async function deleteCharacter(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('characters').delete().eq('id', id);
  return !error;
}

// ─── Character Seals ────────────────────────────────────────────────────

export async function fetchSeals(characterId: string): Promise<CharacterSeals | null> {
  const { data, error } = await getSupabase()
    .from('character_seals')
    .select('*')
    .eq('character_id', characterId)
    .single();
  if (error || !data) return null;
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
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    ...rowToAbility(row.abilities),
    learnedAtLevel: row.learned_at_level,
  }));
}

export async function learnAbility(characterId: string, abilityId: string, level: number): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_abilities')
    .insert({ character_id: characterId, ability_id: abilityId, learned_at_level: level });
  return !error;
}

// ─── Character Inventory ────────────────────────────────────────────────

export async function fetchInventory(characterId: string): Promise<InventoryItem[]> {
  const { data, error } = await getSupabase()
    .from('character_inventory')
    .select('*')
    .eq('character_id', characterId)
    .order('created_at');
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    characterId: row.character_id,
    itemName: row.item_name,
    itemType: row.item_type,
    quantity: row.quantity,
    effectJson: row.effect_json,
    equipped: row.equipped,
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
  if (error || !data) return [];
  return data.map(rowToAbility);
}

// ─── Monsters ───────────────────────────────────────────────────────────

export async function fetchMonsters(filters?: { level?: number; isBoss?: boolean }): Promise<Monster[]> {
  let query = getSupabase().from('monsters').select('*').order('level').order('name');
  if (filters?.level !== undefined) query = query.eq('level', filters.level);
  if (filters?.isBoss !== undefined) query = query.eq('is_boss', filters.isBoss);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(rowToMonster);
}

export async function fetchMonster(id: string): Promise<Monster | null> {
  const { data, error } = await getSupabase().from('monsters').select('*').eq('id', id).single();
  if (error || !data) return null;
  return rowToMonster(data);
}

// ─── Game Config ────────────────────────────────────────────────────────

export async function fetchGameConfig(): Promise<GameConfig | null> {
  const { data, error } = await getSupabase()
    .from('game_config')
    .select('*')
    .limit(1)
    .single();
  if (error || !data) return null;
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
      mana_pool_formula: config.manaPoolFormula,
      energy_pool_max: config.energyPoolMax,
      rage_pool_max: config.ragePoolMax,
      movement_base: config.movementBase,
      mana_regen_per_turn: config.manaRegenPerTurn,
      energy_regen_per_turn: config.energyRegenPerTurn,
      rage_on_hit_taken: config.rageOnHitTaken,
      rage_on_melee_hit: config.rageOnMeleeHit,
      rage_on_crit_taken: config.rageOnCritTaken,
      rage_on_ally_ko: config.rageOnAllyKo,
      melee_defense_formula: config.meleeDefenseFormula,
      ranged_defense_formula: config.rangedDefenseFormula,
      defend_bonus: config.defendBonus,
      help_friend_bonus: config.helpFriendBonus,
      base_crit_value: config.baseCritValue,
      luck_crit_thresholds: config.luckCritThresholds,
      lucky_saves_per_session: config.luckySavesPerSession,
      difficulty_targets: config.difficultyTargets,
      ability_costs: config.abilityCosts,
      short_rest_resource_restore: config.shortRestResourceRestore,
      loot_tables: config.lootTables,
      xp_awards: config.xpAwards,
      xp_thresholds: config.xpThresholds,
    })
    .eq('id', config.id)
    .select()
    .single();
  if (error || !data) return null;
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
  if (error || !data) return null;
  return data.id;
}

// ─── Skill Tree ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSkillTreeSkill(row: any): SkillTreeSkill {
  return {
    id: row.id,
    skillCode: row.skill_code,
    name: row.name,
    class: row.class,
    branch: row.branch,
    tier: row.tier,
    skillType: row.skill_type,
    maxRank: row.max_rank,
    description: row.description,
    rankEffects: row.rank_effects,
    legoTip: row.lego_tip,
    effectJson: row.effect_json,
    sortOrder: row.sort_order,
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
  if (error || !data) return [];
  return data.map(rowToSkillTreeSkill);
}

export async function fetchSkillAllocations(characterId: string): Promise<CharacterSkillAllocation[]> {
  const { data, error } = await getSupabase()
    .from('character_skill_allocations')
    .select('*')
    .eq('character_id', characterId);
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    characterId: row.character_id,
    skillId: row.skill_id,
    currentRank: row.current_rank,
    learnedAtLevel: row.learned_at_level,
  }));
}

export async function fetchActionBar(characterId: string): Promise<ActionBarSlot[]> {
  const { data, error } = await getSupabase()
    .from('character_action_bar')
    .select('*')
    .eq('character_id', characterId)
    .order('slot_number');
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    characterId: row.character_id,
    slotNumber: row.slot_number,
    skillId: row.skill_id,
    abilityId: row.ability_id,
  }));
}

export async function allocateSkillPoint(characterId: string, skillId: string): Promise<number | null> {
  const { data, error } = await getSupabase()
    .rpc('allocate_skill_point', { p_character_id: characterId, p_skill_id: skillId });
  if (error) { console.error('allocate_skill_point error:', error.message); return null; }
  return data;
}

export async function respecCharacter(characterId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .rpc('respec_character', { p_character_id: characterId });
  return !error;
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
  return !error;
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
  if (error || !data) return [];
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
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    itemType: row.item_type,
    rarity: row.rarity,
    description: row.description,
    effectJson: row.effect_json,
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
  if (error) { console.error('add_inventory_item error:', error.message); return null; }
  return data;
}

export async function incrementXp(characterId: string, amount: number): Promise<number | null> {
  const { data, error } = await getSupabase()
    .rpc('increment_xp', {
      character_uuid: characterId,
      amount,
    });
  if (error) { console.error('increment_xp error:', error.message); return null; }
  return data;
}

export async function saveCombatRewards(combatId: string, rewardsJson: unknown): Promise<boolean> {
  const { error } = await getSupabase()
    .from('combats')
    .update({ rewards_json: rewardsJson })
    .eq('id', combatId);
  return !error;
}

// ─── Crafting Professions ──────────────────────────────────────────────

export async function fetchCharacterCraftingProfessions(characterId: string): Promise<CraftingProfession[]> {
  const { data, error } = await getSupabase()
    .from('character_crafting_professions')
    .select('profession')
    .eq('character_id', characterId)
    .order('created_at');
  if (error || !data) return [];
  return data.map((row: { profession: string }) => row.profession as CraftingProfession);
}

export async function addCharacterCraftingProfession(characterId: string, profession: CraftingProfession): Promise<boolean> {
  const { error } = await getSupabase()
    .from('character_crafting_professions')
    .insert({ character_id: characterId, profession });
  return !error;
}

export async function fetchProfessionChoices(characterId: string, profession: CraftingProfession): Promise<Record<number, number>> {
  const { data, error } = await getSupabase()
    .from('character_profession_choices')
    .select('node_number, selected_option')
    .eq('character_id', characterId)
    .eq('profession', profession);
  if (error || !data) return {};
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
  return !error;
}

// ─── Materials & Loot ──────────────────────────────────────────────────

export async function fetchMaterials(): Promise<Material[]> {
  const { data, error } = await getSupabase()
    .from('materials')
    .select('*')
    .order('tier')
    .order('category')
    .order('name');
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    tier: row.tier,
    icon: row.icon,
    legoToken: row.lego_token,
    dropLevelMin: row.drop_level_min,
    description: row.description,
  }));
}

export async function fetchCharacterMaterials(characterId: string): Promise<CharacterMaterial[]> {
  const { data, error } = await getSupabase()
    .from('character_inventory_view')
    .select('*')
    .eq('character_id', characterId);
  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    characterId: row.character_id,
    materialId: row.material_id,
    quantity: row.quantity,
    materialName: row.material_name,
    category: row.category,
    tier: row.tier,
    icon: row.icon,
    legoToken: row.lego_token,
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
  if (error) { console.error('add_character_material error:', error.message); return false; }
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
  if (error) { console.error('get_loot_drops error:', error.message); return []; }
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
  return !error;
}
