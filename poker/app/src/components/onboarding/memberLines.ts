// What the welcome flow's Membership step says the membership adds.
//
// Short lines, because the step fits one screen, but each one is tied to the
// features it summarises and shows only if every one of them is for sale. The
// list was hand-typed until 2026-10-12 and missed multiplayer the day after it
// shipped: a new player choosing a plan was not told about the headline.

import { sellableFeatures } from '@/config/membership'

/** One line on the step, and the feature ids it stands for. */
interface MemberLine {
  text: string
  ids: readonly string[]
}

export const MEMBER_LINES: readonly MemberLine[] = [
  { text: 'Private rooms with your friends, who join free', ids: ['multiplayer'] },
  {
    text: 'Omaha, Short Deck, Hi-Lo and Five-Card Draw',
    ids: ['omaha', 'shortdeck', 'hilo', 'draw'],
  },
  { text: 'Every side table', ids: ['side-tables', 'rooms'] },
  { text: 'All of Webb’s lessons and drills', ids: ['lessons', 'drills'] },
  { text: 'Session review and a report on your own play', ids: ['review', 'coaching'] },
]

/** The lines this build may show: every feature behind a line is sellable. */
export function memberLines(): string[] {
  const sellable = new Set(sellableFeatures().map((f) => f.id))
  return MEMBER_LINES.filter((line) => line.ids.every((id) => sellable.has(id))).map((l) => l.text)
}
