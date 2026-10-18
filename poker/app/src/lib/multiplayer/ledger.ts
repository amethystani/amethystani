// What a multiplayer game has taken from the Roll and what it owes back.
//
// **Rooms pay into the Roll** (Will, 2026-10-06), and the Roll lives on this
// device, so the device keeps the books: the buy-in comes out the first time it
// sees you dealt in, and the prize goes in the first time it sees you finish
// first. Keyed by the game rather than the visit, so a refresh, a reconnect or
// a second look at the end card never charges or pays twice.
//
// Nobody else can see this number or be shown it. Editing it gets you chips no
// other player will ever know about, which is the ruling's whole point: "you're
// only cheating yourself".

import type { RoomView } from './view'

export interface LedgerEntry {
  paid: number
  /** The prize has been paid, or the game ended without one. */
  settled: boolean
  /** When the entry was written, for pruning. */
  at: number
}

export type Ledger = Record<string, LedgerEntry>

/** Old games are forgotten after a week: long past any reconnect. */
const KEEP_MS = 7 * 24 * 60 * 60 * 1000

export function gameKey(view: RoomView): string | null {
  return view.startedAt === null ? null : `${view.code}:${view.startedAt}`
}

/**
 * The Roll movement this view calls for, and the books after it.
 *
 * `delta` is negative on the deal (the buy-in) and positive at the end for the
 * winner (the prize). Zero for everybody else, and on every later call.
 */
export function settle(
  ledger: Ledger,
  view: RoomView,
  now: number,
): { ledger: Ledger; delta: number; won: boolean } {
  const key = gameKey(view)
  const me = view.players.find((p) => p.id === view.you)
  // A game for fun never touches the Roll.
  if (!view.settings.forRoll) return { ledger, delta: 0, won: false }
  if (!key || !me || (view.phase !== 'playing' && view.phase !== 'finished')) {
    return { ledger, delta: 0, won: false }
  }
  const kept: Ledger = {}
  for (const [k, e] of Object.entries(ledger)) if (now - e.at < KEEP_MS) kept[k] = e
  let delta = 0
  let entry = kept[key]
  if (!entry) {
    entry = { paid: view.buyIn, settled: false, at: now }
    delta -= view.buyIn
  }
  let won = false
  if (view.phase === 'finished' && !entry.settled) {
    won = me.place === 1
    if (won) delta += view.prize
    entry = { ...entry, settled: true }
  }
  return { ledger: { ...kept, [key]: entry }, delta, won }
}
