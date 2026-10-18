import { type Card, cardFromString } from '@/lib/poker/cards'
import { bestFive, determineWinners, handPhrase } from '@/lib/poker/handEval'

/**
 * The showdown `/membership?for=shortdeck` deals, the Short Deck twin of
 * `omahaSample`.
 *
 * The blurb says "a flush beats a full house", which reads like a typo to
 * anybody who learned Hold'em. This is a hand where that rule decides the pot:
 * your flush against a full house, which loses in Hold'em and wins here.
 *
 * **The cards are typed; nothing else is.** Who wins under each rule set, what
 * each hand is and which five cards play all come from the evaluator that
 * settles a pot at the Short Deck tables, so the page cannot say something the
 * table would not. `tests/shortDeckSample.test.ts` holds the lesson to it.
 */
const BOARD = ['Ah', '9h', '9c', '6h', 'Ks']
const HERO = ['Qh', 'Jh']
const THEM = ['9d', 'Kd']

interface ShowdownHolding {
  cards: Card[]
  /** The five that play. */
  plays: Card[]
  /** The hand in words, ready to sit in a sentence: "a flush". */
  phrase: string
}

interface ShortDeckShowdown {
  board: Card[]
  hero: ShowdownHolding
  them: ShowdownHolding
  winner: 'hero' | 'them' | 'split'
  /** Who the same nine cards go to under Hold'em's ranking. */
  holdemWinner: 'hero' | 'them' | 'split'
}

export function shortDeckSample(): ShortDeckShowdown {
  const board = BOARD.map(cardFromString)
  const hero = HERO.map(cardFromString)
  const them = THEM.map(cardFromString)
  const contenders = [
    { id: 'hero' as const, hole: hero },
    { id: 'them' as const, hole: them },
  ]
  const { winners, evaluations } = determineWinners(contenders, board, 'shortdeck')
  const holdem = determineWinners(contenders, board, 'holdem').winners
  const holding = (id: 'hero' | 'them', cards: Card[]): ShowdownHolding => {
    const hand = evaluations.get(id)!
    return { cards, plays: bestFive(hand), phrase: handPhrase(hand) ?? hand.name.toLowerCase() }
  }
  return {
    board,
    hero: holding('hero', hero),
    them: holding('them', them),
    winner: winners.length > 1 ? 'split' : winners[0],
    holdemWinner: holdem.length > 1 ? 'split' : holdem[0],
  }
}
