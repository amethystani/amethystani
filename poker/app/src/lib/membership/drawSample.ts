import { decideDiscard } from '@/lib/poker/ai/draw'
import { type Card, cardFromString } from '@/lib/poker/cards'
import { determineWinners, handPhrase } from '@/lib/poker/handEval'

/**
 * The hand `/membership?for=draw` deals, the Five-Card Draw twin of
 * `omahaSample`.
 *
 * The blurb says the only thing anybody learns all hand is how many cards you
 * asked for. This is one hand through the draw: both sides' five, what each
 * threw, what came, and the showdown.
 *
 * **The cards are typed; nothing else is.** What each side throws is
 * `decideDiscard`, the discard the tables' own players make, and who wins and
 * with what comes from the evaluator that settles a pot at The Parlour, so the
 * page cannot show a draw the table would not make. `tests/drawSample.test.ts`
 * holds it.
 */
const HERO = ['Jh', 'Js', '8c', '4d', '2s']
const HERO_DRAWS = ['Jd', '5c', 'Kc']
const THEM = ['Ah', 'Qh', '9h', '6h', '3c']
const THEM_DRAWS = ['Td']

/** Only reached on a hand where a pair sits beside four to an open straight. */
const NEVER_A_COIN_FLIP = () => 0.99

interface DrawnHolding {
  /** The five dealt, before the draw. */
  dealt: Card[]
  /** The ones held through the draw. */
  kept: Card[]
  /** The five shown down: the kept cards, then the new ones. */
  cards: Card[]
  drew: number
  /** The hand in words, ready to sit in a sentence: "three of a kind". */
  phrase: string
}

interface DrawHand {
  hero: DrawnHolding
  them: DrawnHolding
  winner: 'hero' | 'them' | 'split'
}

function throughTheDraw(dealt: Card[], draws: Card[]) {
  const discard = decideDiscard(dealt, NEVER_A_COIN_FLIP)
  if (discard.length !== draws.length) {
    throw new Error(`the sample threw ${discard.length} and typed ${draws.length} replacements`)
  }
  const kept = dealt.filter((_, i) => !discard.includes(i))
  return { dealt, kept, cards: [...kept, ...draws], drew: draws.length }
}

export function drawSample(): DrawHand {
  const hero = throughTheDraw(HERO.map(cardFromString), HERO_DRAWS.map(cardFromString))
  const them = throughTheDraw(THEM.map(cardFromString), THEM_DRAWS.map(cardFromString))
  const { winners, evaluations } = determineWinners(
    [
      { id: 'hero' as const, hole: hero.cards },
      { id: 'them' as const, hole: them.cards },
    ],
    [],
    'draw',
  )
  const phrase = (id: 'hero' | 'them') => {
    const hand = evaluations.get(id)!
    return handPhrase(hand) ?? hand.name.toLowerCase()
  }
  return {
    hero: { ...hero, phrase: phrase('hero') },
    them: { ...them, phrase: phrase('them') },
    winner: winners.length > 1 ? 'split' : winners[0],
  }
}
