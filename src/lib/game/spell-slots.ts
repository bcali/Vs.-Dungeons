// Spell slot helpers — replaces the old resource pool system
// Core rules: spell slots are level-based, cantrips (cost 0) are free

/** Check if a spell can be cast given current slot usage */
export function canCastSpell(slotsUsed: number, slotsMax: number, spellCost: number): boolean {
  if (spellCost === 0) return true; // cantrips are always free
  return slotsUsed + spellCost <= slotsMax;
}

/** Use spell slots, returns new slotsUsed count */
export function useSpellSlots(slotsUsed: number, cost: number): number {
  return slotsUsed + cost;
}

/** Restore all spell slots (short/long rest) — returns 0 */
export function restoreAllSlots(): number {
  return 0;
}
