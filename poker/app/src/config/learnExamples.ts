import { cardFromString, type Card } from '@/lib/poker/cards'

// Worked examples for the written guides. Pure data, deliberately kept out of
// the components: every one of these is a claim about who wins a hand, and
// tests/learnExamples.test.ts settles each of them against the real evaluator
// rather than against the author's arithmetic.
//
// They are illustrations of what a guide already says in prose, not practice.
// Nothing here is generated, scored or remembered — see the Learn section's
// dividing line in ../../cmo/strategy/monetisation.md ("words are free,
// feedback is paid").

export type Outcome = 'a' | 'b' | 'split'

export interface WhoWinsExample {
  id: string
  /** The five community cards, as "Ah"/"Td" strings. */
  board: string[]
  /** The two players' hole cards. */
  a: string[]
  b: string[]
  /** Who takes it. Verified against determineWinners() in the tests. */
  answer: Outcome
  /** One line, said once the answer is showing. The guide's own explanation. */
  why: string
}

export const WHO_WINS: WhoWinsExample[] = [
  {
    id: 'kickers',
    board: ['Ac', '8d', '5s', '3h', '2d'],
    a: ['As', 'Kd'],
    b: ['Ah', 'Qc'],
    answer: 'a',
    why: 'Both make a pair of aces, so the next card decides. The king outkicks the queen. This is where most beginner pots are quietly lost.',
  },
  {
    id: 'board-plays',
    board: ['As', 'Ks', 'Qd', 'Jc', 'Th'],
    a: ['7d', '2c'],
    b: ['9s', '4h'],
    answer: 'split',
    why: 'The best five cards are all on the table, and neither hand improves on them. Everyone still in has the same straight, so the pot splits.',
  },
  {
    id: 'flush-over-straight',
    board: ['9d', '7d', '5c', '2d', 'Ks'],
    a: ['Ad', '3d'],
    b: ['8s', '6h'],
    answer: 'a',
    why: 'A flush beats a straight because it is harder to make, and that holds all the way down the list.',
  },
]

export interface BestFiveExample {
  id: string
  /** Your two private cards. */
  hole: string[]
  /** The five community cards. */
  board: string[]
  /**
   * The five cards that actually make the hand, in the order the widget shows
   * them. tests/learnExamples.test.ts settles this against the evaluator.
   */
  best: string[]
  /** The evaluator's own name for the hand, so the test can pin it. */
  engineName: string
  /** How the page says it, in words. */
  hand: string
  why: string
}

/**
 * Which five of the seven cards play. That your hand need not include your own
 * cards is the mechanic the whole game rests on, and the one prose keeps
 * failing to land: "best five of seven" reads as obvious and then people fold
 * a split pot. Three spots, in the order the misunderstanding gets harder:
 * both cards play, one plays, neither does.
 */
export const BEST_FIVE: BestFiveExample[] = [
  {
    id: 'both-play',
    hole: ['Ks', 'Qs'],
    board: ['Kd', 'Qh', '8s', '3h', '5c'],
    best: ['Ks', 'Kd', 'Qs', 'Qh', '8s'],
    engineName: 'Two Pair',
    hand: 'Two pair, kings and queens',
    why: 'Both of your cards play, and the eight on the table comes along as the fifth card.',
  },
  {
    id: 'one-plays',
    hole: ['Ac', '2d'],
    board: ['Ah', 'Ks', 'Qd', '9c', '4s'],
    best: ['Ac', 'Ah', 'Ks', 'Qd', '9c'],
    engineName: 'Pair',
    hand: 'A pair of aces',
    why: 'Your ace plays and your two does not. Four cards on the table are better than it, so it never makes the hand.',
  },
  {
    id: 'neither-plays',
    hole: ['7c', '2d'],
    board: ['Ah', 'Ad', 'Ac', 'Ks', 'Kh'],
    best: ['Ah', 'Ad', 'Ac', 'Ks', 'Kh'],
    engineName: 'Full House',
    hand: 'A full house, aces full of kings',
    why: 'The five cards on the table are already the best five, so your cards are irrelevant. Everyone still in the hand has this exact hand and the pot splits.',
  },
]

export interface CanYouCheckExample {
  id: string
  situation: string
  canCheck: boolean
  verdict: string
}

/**
 * When checking is available. The most common first-night mistake, and the
 * answer is one rule: you can only check when there is nothing to call.
 *
 * No cards in it, so there is nothing for the evaluator to settle. It is a
 * claim about the rules rather than about a hand, and prose review is the
 * right gate for it (the CMO's spec says so too).
 */
export const CAN_YOU_CHECK: CanYouCheckExample[] = [
  {
    id: 'flop-no-bet',
    situation: 'The flop is out. Nobody has bet yet, and the action is on you.',
    canCheck: true,
    verdict: 'Yes. There is nothing to call, so checking is free and passes the action along.',
  },
  {
    id: 'facing-a-bet',
    situation: 'The flop is out and the player before you bet 40.',
    canCheck: false,
    verdict:
      'No. There is a bet in front of you, so your options are call 40, raise to at least 80, or fold.',
  },
  {
    id: 'big-blind-limped',
    situation:
      'Preflop. You are in the big blind, three players have called 20, and nobody raised.',
    canCheck: true,
    verdict:
      'Yes. Your blind already covers the bet, so there is nothing to call. This is the one time preflop that checking is available.',
  },
]

export interface AceRunExample {
  id: string
  label: string
  /** Five cards, deliberately mixed suits so only the sequence is in question. */
  cards: string[]
  /** Whether these five make a straight. Checked against the evaluator. */
  isStraight: boolean
  verdict: string
}

/**
 * The ace runs high and it runs low, and it never turns the corner. Three
 * sequences, one of which is not a straight at all, which is the single rule on
 * the rankings page that people most reliably get wrong.
 */
export const ACE_RUNS: AceRunExample[] = [
  {
    id: 'broadway',
    label: 'A-K-Q-J-10',
    cards: ['Ah', 'Ks', 'Qd', 'Jc', 'Th'],
    isStraight: true,
    verdict: 'A straight, and the highest one there is. Here the ace is playing high.',
  },
  {
    id: 'wheel',
    label: 'A-2-3-4-5',
    cards: ['Ah', '2s', '3d', '4c', '5h'],
    isStraight: true,
    verdict:
      'Also a straight, and the lowest one there is. This is the only place the ace counts as a one.',
  },
  {
    id: 'round-the-corner',
    label: 'Q-K-A-2-3',
    cards: ['Qh', 'Ks', 'Ad', '2c', '3h'],
    isStraight: false,
    verdict: 'Not a straight at all. Nothing wraps: the ace is an end, never a middle.',
  },
]

/** Parse an example's strings into cards for rendering. */
export function toCards(codes: readonly string[]): Card[] {
  return codes.map(cardFromString)
}
