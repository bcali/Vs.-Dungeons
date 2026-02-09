"use client";

import { useState, useEffect, useCallback } from "react";
import { useCombatStore } from "@/stores/combat-store";
import {
  fetchCharacter,
  fetchMonstersByIds,
  fetchItemCatalog,
  incrementXp,
  addInventoryItem,
  updateCharacter,
  saveCombatRewards,
} from "@/lib/supabase/queries";
import { calculateBattleRewards, checkLevelUp } from "@/lib/game/rewards";
import { xpForLevel, rankForLevel } from "@/lib/game/stats";
import { LevelUpCelebration } from "./level-up-celebration";
import type { Character, CatalogItem } from "@/types/game";
import type { BattleRewardsSummary, RewardItem } from "@/types/rewards";

interface HeroRewardState {
  characterId: string;
  heroName: string;
  currentXp: number;
  currentLevel: number;
  currentGold: number;
  xpEarned: number;
  goldToAdd: number;
  items: RewardItem[];
}

interface LevelUpInfo {
  name: string;
  previousLevel: number;
  newLevel: number;
}

export function RewardsScreen() {
  const { participants, encounterName, combatId, endCombat } = useCombatStore();

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [summary, setSummary] = useState<BattleRewardsSummary | null>(null);
  const [heroStates, setHeroStates] = useState<HeroRewardState[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogFilter, setCatalogFilter] = useState<string>("all");
  const [customItemName, setCustomItemName] = useState("");
  const [customItemType, setCustomItemType] = useState<string>("misc");
  const [activeHeroId, setActiveHeroId] = useState<string | null>(null);
  const [levelUpHeroes, setLevelUpHeroes] = useState<LevelUpInfo[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    const heroes = participants.filter((p) => p.team === "hero" && p.characterId);
    const enemies = participants.filter((p) => p.team === "enemy" && p.monsterId);

    // Get unique monster IDs to fetch XP values
    const uniqueMonsterIds = [...new Set(enemies.map((e) => e.monsterId!))];

    // Fetch monster XP values, hero characters, and item catalog in parallel
    const [monsters, catalogItems, ...heroChars] = await Promise.all([
      fetchMonstersByIds(uniqueMonsterIds),
      fetchItemCatalog(),
      ...heroes.map((h) => fetchCharacter(h.characterId!)),
    ]);

    // Build XP lookup map
    const monsterXpMap = new Map<string, number>();
    for (const m of monsters) {
      monsterXpMap.set(m.id, m.xpReward);
    }

    // Calculate rewards
    const rewardSummary = calculateBattleRewards(participants, monsterXpMap, encounterName);
    setSummary(rewardSummary);
    setCatalog(catalogItems);

    // Build hero states with current character data
    const states: HeroRewardState[] = heroes.map((h, i) => {
      const char = heroChars[i] as Character | null;
      return {
        characterId: h.characterId!,
        heroName: h.displayName,
        currentXp: char?.xp ?? 0,
        currentLevel: char?.level ?? 1,
        currentGold: char?.gold ?? 0,
        xpEarned: rewardSummary.xpPerHero,
        goldToAdd: 0,
        items: [],
      };
    });
    setHeroStates(states);
    if (states.length > 0) setActiveHeroId(states[0].characterId);
    setLoading(false);
  }, [participants, encounterName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateHeroGold = (characterId: string, gold: number) => {
    setHeroStates((prev) =>
      prev.map((h) => (h.characterId === characterId ? { ...h, goldToAdd: gold } : h))
    );
  };

  const addItemToHero = (characterId: string, item: RewardItem) => {
    setHeroStates((prev) =>
      prev.map((h) =>
        h.characterId === characterId ? { ...h, items: [...h.items, item] } : h
      )
    );
  };

  const removeItemFromHero = (characterId: string, index: number) => {
    setHeroStates((prev) =>
      prev.map((h) =>
        h.characterId === characterId
          ? { ...h, items: h.items.filter((_, i) => i !== index) }
          : h
      )
    );
  };

  const handleAddCatalogItem = (characterId: string, catalogItem: CatalogItem) => {
    addItemToHero(characterId, {
      itemName: catalogItem.name,
      itemType: catalogItem.itemType,
      quantity: 1,
      effectJson: catalogItem.effectJson,
    });
  };

  const handleAddCustomItem = (characterId: string) => {
    if (!customItemName.trim()) return;
    addItemToHero(characterId, {
      itemName: customItemName.trim(),
      itemType: customItemType as RewardItem["itemType"],
      quantity: 1,
    });
    setCustomItemName("");
  };

  const handleApplyRewards = async () => {
    if (applying || applied) return;
    setApplying(true);

    const leveled: LevelUpInfo[] = [];

    for (const hero of heroStates) {
      // 1. Add XP
      if (hero.xpEarned > 0) {
        await incrementXp(hero.characterId, hero.xpEarned);
      }

      // 2. Check level up
      const { newLevel, levelsGained } = checkLevelUp(
        hero.currentXp,
        hero.currentLevel,
        hero.xpEarned
      );
      if (levelsGained > 0) {
        leveled.push({
          name: hero.heroName,
          previousLevel: hero.currentLevel,
          newLevel,
        });
        await updateCharacter(hero.characterId, {
          level: newLevel,
          rank: rankForLevel(newLevel),
          unspentStatPoints:
            levelsGained + (hero.currentLevel === 1 ? 1 : 0), // Include any existing unspent
        });
      }

      // 3. Add gold
      if (hero.goldToAdd > 0) {
        await updateCharacter(hero.characterId, {
          gold: hero.currentGold + hero.goldToAdd,
        });
      }

      // 4. Add items
      for (const item of hero.items) {
        await addInventoryItem(
          hero.characterId,
          item.itemName,
          item.itemType,
          item.quantity,
          item.effectJson
        );
      }
    }

    // 5. Save rewards history
    if (combatId && summary) {
      await saveCombatRewards(combatId, {
        ...summary,
        allocations: heroStates.map((h) => ({
          characterId: h.characterId,
          heroName: h.heroName,
          xpEarned: h.xpEarned,
          goldEarned: h.goldToAdd,
          items: h.items,
          leveledUp: leveled.some((l) => l.name === h.heroName),
          previousLevel: h.currentLevel,
          newLevel:
            leveled.find((l) => l.name === h.heroName)?.newLevel ?? h.currentLevel,
        })),
      });
    }

    setApplied(true);
    setApplying(false);

    // 6. Show level-up celebration or end
    if (leveled.length > 0) {
      setLevelUpHeroes(leveled);
      setShowCelebration(true);
    } else {
      endCombat();
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    endCombat();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <span className="text-zinc-500 animate-pulse">Calculating rewards...</span>
      </div>
    );
  }

  if (!summary) return null;

  const heroesAlive = participants.filter((p) => p.team === "hero" && p.isActive).length;

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      !catalogSearch ||
      item.name.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesType = catalogFilter === "all" || item.itemType === catalogFilter;
    return matchesSearch && matchesType;
  });

  const rarityColor: Record<string, string> = {
    common: "text-green-400",
    uncommon: "text-blue-400",
    rare: "text-yellow-400",
    epic: "text-purple-400",
    legendary: "text-red-400",
  };

  return (
    <>
      {showCelebration && (
        <LevelUpCelebration
          heroes={levelUpHeroes}
          onComplete={handleCelebrationComplete}
        />
      )}

      <div className="min-h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-[#e5a91a]">
                {heroesAlive > 0 ? "VICTORY" : "DEFEAT"}
              </span>
              <span className="text-zinc-400 ml-2">&mdash; {encounterName}</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Assign rewards before finishing the encounter
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Left: XP Summary */}
          <div className="col-span-4 space-y-4 overflow-y-auto">
            <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-4">
              <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">
                Enemies Defeated
              </h2>
              {summary.enemiesDefeated.length === 0 ? (
                <p className="text-zinc-500 text-sm italic">
                  No enemies were defeated
                </p>
              ) : (
                <div className="space-y-1">
                  {summary.enemiesDefeated.map((e, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm rounded-lg bg-[#0f3460]/50 px-3 py-2"
                    >
                      <span>
                        {e.name}
                        {e.isBoss && (
                          <span className="text-[#e5a91a] text-xs ml-1">
                            BOSS
                          </span>
                        )}
                      </span>
                      <span className="text-[#e5a91a]">{e.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              )}

              {summary.enemiesSurvived.length > 0 && (
                <>
                  <h3 className="text-xs text-zinc-500 mt-3 mb-1 uppercase">
                    Survived (0 XP)
                  </h3>
                  {summary.enemiesSurvived.map((e, i) => (
                    <div
                      key={i}
                      className="text-sm text-zinc-600 px-3 py-1"
                    >
                      {e.name}
                    </div>
                  ))}
                </>
              )}

              <div className="mt-4 pt-3 border-t border-[#0f3460] space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total XP</span>
                  <span className="text-[#e5a91a] font-bold">
                    {summary.totalXp} XP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Per hero ({summary.heroCount})
                  </span>
                  <span className="text-[#e5a91a] font-bold">
                    {summary.xpPerHero} XP each
                  </span>
                </div>
              </div>
            </div>

            {/* Item Catalog */}
            <div className="rounded-xl bg-[#16213e] border border-[#0f3460] p-4">
              <h2 className="text-sm font-semibold text-[#e5a91a] mb-3 uppercase tracking-wider">
                Item Catalog
              </h2>
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full rounded-lg bg-[#0f3460] px-3 py-2 text-sm text-white placeholder-zinc-500 mb-2"
              />
              <div className="flex gap-1 mb-2 flex-wrap">
                {["all", "weapon", "armor", "consumable", "misc"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setCatalogFilter(type)}
                      className={`text-xs px-2 py-1 rounded ${
                        catalogFilter === type
                          ? "bg-[#e5a91a]/20 text-[#e5a91a]"
                          : "bg-[#0f3460] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {type === "all" ? "All" : type}
                    </button>
                  )
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredCatalog.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      activeHeroId && handleAddCatalogItem(activeHeroId, item)
                    }
                    disabled={!activeHeroId || applied}
                    className="w-full text-left rounded-lg bg-[#0f3460]/50 px-3 py-2 text-sm hover:bg-[#0f3460] transition-colors disabled:opacity-40"
                  >
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                      <span
                        className={`text-xs ${
                          rarityColor[item.rarity] ?? "text-zinc-400"
                        }`}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </button>
                ))}
                {filteredCatalog.length === 0 && (
                  <p className="text-xs text-zinc-600 italic">No items found</p>
                )}
              </div>

              {/* Custom item */}
              <div className="mt-3 pt-3 border-t border-[#0f3460]">
                <p className="text-xs text-zinc-400 mb-1">Custom Item</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Item name"
                    className="flex-1 rounded-lg bg-[#0f3460] px-2 py-1.5 text-xs text-white placeholder-zinc-500"
                    disabled={applied}
                  />
                  <select
                    value={customItemType}
                    onChange={(e) => setCustomItemType(e.target.value)}
                    className="rounded-lg bg-[#0f3460] px-2 py-1.5 text-xs text-white"
                    disabled={applied}
                  >
                    <option value="weapon">Weapon</option>
                    <option value="armor">Armor</option>
                    <option value="consumable">Consumable</option>
                    <option value="quest">Quest</option>
                    <option value="misc">Misc</option>
                  </select>
                  <button
                    onClick={() =>
                      activeHeroId && handleAddCustomItem(activeHeroId)
                    }
                    disabled={!activeHeroId || !customItemName.trim() || applied}
                    className="rounded-lg bg-[#e5a91a] px-3 py-1.5 text-xs font-bold text-[#1a1a2e] hover:bg-[#e5a91a]/80 disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hero Cards */}
          <div className="col-span-8 space-y-4 overflow-y-auto">
            {heroStates.map((hero) => {
              const nextLevelXp = xpForLevel(hero.currentLevel);
              const newXp = hero.currentXp + hero.xpEarned;
              const { newLevel, levelsGained } = checkLevelUp(
                hero.currentXp,
                hero.currentLevel,
                hero.xpEarned
              );
              const xpBarBefore =
                nextLevelXp === Infinity
                  ? 100
                  : Math.round((hero.currentXp / nextLevelXp) * 100);
              const xpBarAfter =
                nextLevelXp === Infinity
                  ? 100
                  : Math.min(100, Math.round((newXp / nextLevelXp) * 100));
              const isActive = activeHeroId === hero.characterId;

              return (
                <div
                  key={hero.characterId}
                  onClick={() => !applied && setActiveHeroId(hero.characterId)}
                  className={`rounded-xl bg-[#16213e] border p-4 cursor-pointer transition-colors ${
                    isActive
                      ? "border-[#e5a91a]"
                      : "border-[#0f3460] hover:border-zinc-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{hero.heroName}</h3>
                      <p className="text-xs text-zinc-400">
                        Level {hero.currentLevel}
                        {levelsGained > 0 && (
                          <span className="text-[#e5a91a] font-bold ml-2 animate-pulse">
                            → Level {newLevel}!
                          </span>
                        )}
                      </p>
                    </div>
                    {levelsGained > 0 && (
                      <span className="bg-[#e5a91a]/20 text-[#e5a91a] text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        LEVEL UP!
                      </span>
                    )}
                  </div>

                  {/* XP Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>
                        XP: {hero.currentXp} + {hero.xpEarned} = {newXp}
                      </span>
                      <span>
                        {nextLevelXp === Infinity
                          ? "MAX"
                          : `Next: ${nextLevelXp}`}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#0f3460] rounded-full relative overflow-hidden">
                      <div
                        className="absolute h-full bg-[#e5a91a]/30 rounded-full"
                        style={{ width: `${xpBarAfter}%` }}
                      />
                      <div
                        className="absolute h-full bg-[#e5a91a] rounded-full"
                        style={{ width: `${xpBarBefore}%` }}
                      />
                    </div>
                  </div>

                  {/* Gold */}
                  <div className="flex items-center gap-3 mb-3">
                    <label className="text-xs text-zinc-400 shrink-0">
                      Gold ({hero.currentGold} current):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={hero.goldToAdd || ""}
                      onChange={(e) =>
                        updateHeroGold(
                          hero.characterId,
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="w-20 rounded-lg bg-[#0f3460] px-2 py-1 text-sm text-[#e5a91a] text-center"
                      disabled={applied}
                    />
                    {hero.goldToAdd > 0 && (
                      <span className="text-xs text-zinc-500">
                        → {hero.currentGold + hero.goldToAdd} total
                      </span>
                    )}
                  </div>

                  {/* Assigned Items */}
                  {hero.items.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Items to receive:</p>
                      <div className="flex flex-wrap gap-1">
                        {hero.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-[#0f3460] rounded-lg px-2 py-1 text-xs"
                          >
                            {item.itemName}
                            {!applied && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItemFromHero(hero.characterId, idx);
                                }}
                                className="text-zinc-500 hover:text-red-400 ml-1"
                              >
                                x
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Apply Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplyRewards}
                disabled={applying || applied}
                className={`rounded-xl px-8 py-3 text-lg font-bold transition-colors ${
                  applied
                    ? "bg-green-600 text-white cursor-default"
                    : applying
                    ? "bg-zinc-700 text-zinc-400"
                    : "bg-[#e5a91a] text-[#1a1a2e] hover:bg-[#e5a91a]/80"
                }`}
              >
                {applied
                  ? "Rewards Applied!"
                  : applying
                  ? "Applying..."
                  : "Apply Rewards"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
