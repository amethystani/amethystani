// The AI players who fill a quick-match table's empty seats.
//
// Not the cast: the cast are characters with histories and lines, and a
// quick-match table should look like a table of strangers. So each fill seat
// gets an ordinary name and a random face, plays the stake's own AI profile
// with a small nudge so no two play quite alike, and wears an "AI" tag on its
// name plate (Will, 2026-10-11). The tag is the line: they look like anybody,
// and they never claim to be somebody.
//
// Pure and seeded, so a test can deal the same table twice.

import type { AvatarSpec } from '@/lib/avatar'
import type { Rng } from '@/lib/poker/cards'
import type { AiProfile } from '@/lib/poker/ai/policy'

/**
 * The avatar backgrounds, written out rather than imported: `lib/avatar`
 * pulls in the avatar renderer, which the room server has no use for.
 * `tests/multiplayerPlayers.test.ts` checks they match `AVATAR_BG_SWATCHES`.
 */
export const FILL_SWATCHES = ['b6e3f4', 'c0aede', 'd1f4d0', 'ffd5dc', 'ffdfbf', 'f4e7b6'] as const

const FIRST = [
  'Sam',
  'Priya',
  'Nate',
  'Jules',
  'Marco',
  'Aisha',
  'Tom',
  'Lena',
  'Kofi',
  'Rosa',
  'Dev',
  'Hannah',
  'Leo',
  'Mei',
  'Owen',
  'Zara',
  'Felix',
  'Nina',
  'Ravi',
  'Chloe',
  'Ben',
  'Ines',
  'Theo',
  'Yuki',
  'Omar',
  'Grace',
  'Luca',
  'Ada',
  'Max',
  'Sofia',
  'Jack',
  'Amara',
  'Finn',
  'Elena',
  'Hugo',
  'Isla',
  'Kai',
  'Maya',
  'Ezra',
  'Noor',
] as const

const INITIALS = 'ABCDFGHJKLMNPRSTW'

/** One of three ways people name themselves: "Sam", "Priya K", "nate_92". */
function fillName(rng: Rng): string {
  const first = FIRST[Math.floor(rng() * FIRST.length)]
  const style = rng()
  if (style < 0.45) return first
  if (style < 0.75) return `${first} ${INITIALS[Math.floor(rng() * INITIALS.length)]}`
  const sep = rng() < 0.5 ? '_' : ''
  return `${first.toLowerCase()}${sep}${10 + Math.floor(rng() * 89)}`
}

export interface FillPlayer {
  name: string
  avatar: AvatarSpec
  ai: AiProfile
}

/**
 * `count` fill players for a table, none sharing a name with each other or
 * with anybody in `taken`.
 */
export function fillPlayers(
  count: number,
  base: AiProfile,
  taken: readonly string[],
  rng: Rng,
): FillPlayer[] {
  const used = new Set(taken.map((n) => n.toLowerCase()))
  const out: FillPlayer[] = []
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
  const nudge = () => (rng() - 0.5) * 0.12
  for (let tries = 0; out.length < count && tries < count * 20; tries++) {
    const name = fillName(rng)
    if (used.has(name.toLowerCase())) continue
    used.add(name.toLowerCase())
    out.push({
      name,
      avatar: {
        seed: `fill-${Math.floor(rng() * 1e9).toString(36)}`,
        backgroundColor: FILL_SWATCHES[Math.floor(rng() * FILL_SWATCHES.length)],
      },
      // The stake's own profile, never harder or softer than its price, with
      // a little character either way so the table is not five copies.
      ai: {
        ...base,
        tightness: clamp01(base.tightness + nudge()),
        aggression: clamp01(base.aggression + nudge()),
        bluff: clamp01(base.bluff + nudge() / 3),
      },
    })
  }
  return out
}

/**
 * How long a bot takes over a decision: about two-thirds of a second to two
 * seconds, longer facing a bet and later in the hand, the way a person slows
 * down when it costs something. Around the ladder's own pace (about a second),
 * so a room does not feel slower than the game people already know. Derived
 * from the hand rather than drawn, so the reducer stays a function of its
 * inputs.
 */
export function botThinkMs(seed: number, facingBet: boolean, street: number): number {
  const jitter = ((Math.imul(seed ^ 0x9e3779b9, 2654435761) >>> 0) % 1000) / 1000
  return Math.round(600 + jitter * 700 + (facingBet ? 300 : 0) + street * 100)
}

/** Once no person is left in the hand, the bots play it out at the ladder's folded pace. */
export const BOT_ALONE_MS = 450
