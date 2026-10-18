import { type DeepCoachInput, type DeepRead, deepRead } from '@/lib/deepCoach'

/**
 * The report `/membership?for=coaching` shows: somebody else's, 400 hands in.
 *
 * Every other tap on the page deals a spot from the thing it sells. The report
 * is the one paid surface a non-member could not see at all, because it is
 * drawn from your own hands, and the blurb ("what it is costing you in big
 * blinds, which street the money leaves by") was asking to be believed.
 *
 * **The counts are typed; nothing else is.** The cost, the streets, the
 * findings and the meter all come from `deepRead`, the same function your own
 * report calls, so this page cannot say something the report would not.
 * `tests/coachingSample.test.ts` holds the counts to the shapes the game
 * store keeps (the streets add up to the calls and folds) and the story to the
 * read: a player whose money leaves on the river, by calling.
 */
export const COACHING_SAMPLE: DeepCoachInput = {
  tendencies: {
    handsDealt: 400,
    vpipHands: 184,
    raises: 90,
    calls: 160,
    betsFaced: 180,
    foldsToBet: 63,
    showdowns: 60,
  },
  stats: {
    handsPlayed: 400,
    handsWon: 82,
    biggestPot: 0,
    showdownsWon: 21,
    tournamentsEntered: 0,
    tournamentsWon: 0,
  },
  venueRecords: {},
  rollHistory: [],
  reviewStats: {
    hands: 400,
    byStreet: {
      preflop: { priced: 60, right: 52, bbLost: 3.2, close: 4 },
      flop: { priced: 70, right: 58, bbLost: 4, close: 6 },
      turn: { priced: 48, right: 37, bbLost: 4.8, close: 5 },
      river: { priced: 52, right: 33, bbLost: 12.4, close: 4 },
    },
    calls: { priced: 140, right: 101, bbLost: 19.6, close: 11 },
    folds: { priced: 90, right: 79, bbLost: 4.8, close: 8 },
    evidence: {},
  },
}

export function coachingSample(): DeepRead {
  return deepRead(COACHING_SAMPLE)
}
