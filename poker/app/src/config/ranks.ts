// Player ranks (titles) for the "grind" progression, derived from your peak Roll.

export interface Rank {
  name: string
  /** Peak Roll required to hold this rank. */
  min: number
}

export const RANKS: readonly Rank[] = [
  { name: 'Amateur', min: 0 },
  { name: 'Regular', min: 1_000 },
  { name: 'Shark', min: 10_000 },
  { name: 'Pro', min: 100_000 },
  { name: 'Legend', min: 1_000_000 },
] as const

export function rankFor(peakRoll: number): Rank {
  let current = RANKS[0]
  for (const rank of RANKS) if (peakRoll >= rank.min) current = rank
  return current
}

/** Where this rank sits on the ladder, 0-based. */
export function rankIndex(peakRoll: number): number {
  return RANKS.indexOf(rankFor(peakRoll))
}

/** The rung above, or null once you're a Legend. */
export function nextRank(peakRoll: number): Rank | null {
  return RANKS[rankIndex(peakRoll) + 1] ?? null
}

/**
 * How far along the *whole* ladder, 0..1 — the fill on the progress track.
 * Each rung is an even step and the climb inside it is linear, so the bar
 * paces the same way the titles do. (The thresholds are 10x jumps, which is
 * why the rungs aren't drawn to scale; the numbers on the track say so.)
 */
export function rankProgress(peakRoll: number): number {
  const index = rankIndex(peakRoll)
  const next = RANKS[index + 1]
  if (!next) return 1
  const current = RANKS[index]
  const within = (peakRoll - current.min) / (next.min - current.min)
  return (index + Math.min(1, Math.max(0, within))) / (RANKS.length - 1)
}
