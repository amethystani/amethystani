// Quick match: one queue per stake, as a pure value.
//
// A table starts the moment it is full. Until then it waits, and once the
// first person in line has waited `FILL_AFTER_MS` it starts with whoever is
// there and the cast in every other chair. That is the whole answer to an empty
// lobby: nobody waits longer than that for a game, however quiet it is, and a
// busy evening fills tables with people before the cast is ever needed.

import type { Joiner } from './room'

export const FILL_AFTER_MS = 30_000

export interface Waiting extends Joiner {
  joinedAt: number
}

export interface Queue {
  venueId: string
  /** Seats at this stake's table. */
  seats: number
  waiting: Waiting[]
}

export function emptyQueue(venueId: string, seats: number): Queue {
  return { venueId, seats, waiting: [] }
}

/** Get in line. Joining twice keeps your place. */
export function enqueue(q: Queue, j: Joiner, now: number): Queue {
  if (q.waiting.some((w) => w.userId === j.userId)) return q
  return { ...q, waiting: [...q.waiting, { ...j, joinedAt: now }] }
}

export function dequeue(q: Queue, userId: string): Queue {
  return { ...q, waiting: q.waiting.filter((w) => w.userId !== userId) }
}

/** When the cast fills the table for whoever is first in line, or null with nobody waiting. */
export function fillAt(q: Queue): number | null {
  const first = q.waiting[0]
  return first ? first.joinedAt + FILL_AFTER_MS : null
}

/**
 * Take the next table out of the queue, if one is ready: a full one, or
 * whoever is waiting once the first of them has waited long enough.
 *
 * The rest stay in line in the order they joined, and their clock is their own
 * arrival, not the table that just left.
 */
export function takeTable(q: Queue, now: number): { queue: Queue; table: Waiting[] | null } {
  if (q.waiting.length === 0) return { queue: q, table: null }
  const due = fillAt(q)
  if (q.waiting.length >= q.seats || (due !== null && now >= due)) {
    const table = q.waiting.slice(0, q.seats)
    return { queue: { ...q, waiting: q.waiting.slice(q.seats) }, table }
  }
  return { queue: q, table: null }
}
