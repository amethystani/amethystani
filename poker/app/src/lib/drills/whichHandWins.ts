import { RANKS, type Card, type Rank, mulberry32, rankName, shuffledDeck } from '@/lib/poker/cards'
import { type EvaluatedHand, bestFive, determineWinners, handPhrase } from '@/lib/poker/handEval'
import { type SettledBy, spotDifficulty } from './rating'
import { type DrillChoice, type Generated, accept, reject } from './types'

// The free kind: two holdings, one board, who takes it.
//
// Graded by `determineWinners`, which is exact showdown resolution rather than
// a simulation, so this drill cannot mark a correct answer wrong. That is the
// reason it is the kind that is free forever (technology#38) and the reason to
// keep it that way: whatever else the practice layer becomes, the one a
// stranger meets first is settled by counting, not by sampling.

const SPLIT = 'split'

/** Two hands and a finished board, dealt from one seeded deck. */
function deal(seed: number): { a: Card[]; b: Card[]; board: Card[] } {
  const deck = shuffledDeck(mulberry32(seed))
  return { a: deck.slice(0, 2), b: deck.slice(2, 4), board: deck.slice(4, 9) }
}

/** Rank order as a number, 0 (deuce) to 12 (ace). */
const rankValue = (rank: Rank): number => RANKS.indexOf(rank)

/**
 * The first card two same-category hands differ on, walking the solver's own
 * ordering. That is the card that settled the hand (the second pair, the
 * kicker, the higher trips), and naming it is the difference between a grade
 * and an assertion.
 *
 * Returns null when the two hands are equal (a split) or when the walk
 * disagrees with the evaluator, which would mean the sentence and the grade
 * came from different readings of the same hand. The generator throws that spot
 * away rather than shipping the sentence; the tests watch for it happening.
 */
function decidingRanks(
  winner: readonly Card[],
  loser: readonly Card[],
): { won: Rank; lost: Rank; index: number } | null {
  for (let i = 0; i < winner.length; i++) {
    const won = winner[i].rank
    const lost = loser[i].rank
    if (won === lost) continue
    return rankValue(won) > rankValue(lost) ? { won, lost, index: i } : null
  }
  return null
}

/**
 * How many of the five cards make the hand rather than ride along as kickers.
 * The solver puts the made cards first, so a hand settled at or after this
 * index was settled by a kicker, and that is a different sentence: "outkicks"
 * where the hands are the same and "outranks" where the hands differ.
 *
 * High card is 0 on purpose. Nothing is made, so every card is a kicker.
 */
const MADE_CARDS: Record<string, number> = {
  'High Card': 0,
  Pair: 2,
  'Two Pair': 4,
  'Three of a Kind': 3,
  Straight: 5,
  Flush: 5,
  'Full House': 5,
  'Four of a Kind': 4,
  'Straight Flush': 5,
}

/** For a label or the start of a sentence: "a flush" -> "A flush". */
const capitalise = (phrase: string): string => phrase[0].toUpperCase() + phrase.slice(1)

/**
 * Generate the spot at `seed`, or say why it was thrown away.
 *
 * Two rejections, both exact. A spot more than one hand category apart is not a
 * question, and a spot whose answer we cannot put in a sentence is not a drill.
 */
export function generateWhichHandWins(seed: number): Generated {
  const { a, b, board } = deal(seed)
  const { winners, evaluations } = determineWinners(
    [
      { id: 'a', hole: a },
      { id: 'b', hole: b },
    ],
    board,
  )
  const evalA = evaluations.get('a')
  const evalB = evaluations.get('b')
  if (!evalA || !evalB) return reject('unexplainable')

  if (Math.abs(evalA.categoryRank - evalB.categoryRank) > 1) return reject('one-sided')

  const split = winners.length > 1
  const answer = split ? SPLIT : winners[0]
  const read = explain(answer, evalA, evalB)
  if (!read) return reject('unexplainable')

  // On a split both hands are winners and the split button is the answer, so
  // all three are marked: the reveal shows what happened, not what was typed.
  const choices: DrillChoice[] = [
    hand('a', 'Hand A', a, evalA, split || answer === 'a'),
    hand('b', 'Hand B', b, evalB, split || answer === 'b'),
    { id: SPLIT, label: 'They split it', cards: [], winning: split },
  ]

  return accept({
    kind: 'which-hand-wins',
    seed,
    board,
    choices,
    answer,
    settledBy: read.settledBy,
    difficulty: spotDifficulty(read.settledBy, decoys(answer, a, b)),
    explanation: read.explanation,
  })
}

/**
 * Does the hand that loses hold the higher card?
 *
 * The one thing about a spot that can be called hard from the cards rather than
 * asserted about it: an ace sitting in the hand that does not win is what makes
 * a reader answer before they have read the board. Compared on the hole cards
 * alone, which is what a player looks at first.
 *
 * False on a split, where there is no losing hand to be misled by.
 */
function decoys(answer: string, a: Card[], b: Card[]): boolean {
  if (answer === SPLIT) return false
  const [winner, loser] = answer === 'a' ? [a, b] : [b, a]
  const high = (cards: Card[]) => Math.max(...cards.map((card) => rankValue(card.rank)))
  return high(loser) > high(winner)
}

function hand(
  id: string,
  label: string,
  cards: Card[],
  evaluated: EvaluatedHand,
  winning: boolean,
): DrillChoice {
  // A label rather than a clause, so the article the phrase carries for prose
  // ("a flush") comes off: it reads as "Flush" under the cards.
  const phrase = handPhrase(evaluated)?.replace(/^an? /, '')
  return {
    id,
    label,
    cards,
    winning,
    ...(phrase ? { detail: capitalise(phrase) } : {}),
    plays: bestFive(evaluated),
  }
}

/**
 * The one sentence, and what settled it. Three shapes, and every one of them is
 * a fact about this spot rather than a template with the answer dropped in:
 *
 * - a split: the two hands come to the same thing;
 * - different hands: the category that beats the other one;
 * - the same hand twice: the card that settles it.
 *
 * Never scolds and never says "correct". The reader gets the arithmetic.
 *
 * `settledBy` comes back with the sentence rather than being worked out again
 * later, because the two would then be free to disagree: the difficulty on the
 * spot has to describe the same reading of the hand the reader is shown.
 */
function explain(
  answer: string,
  evalA: EvaluatedHand,
  evalB: EvaluatedHand,
): { explanation: string; settledBy: SettledBy } | null {
  const phraseA = handPhrase(evalA)
  const phraseB = handPhrase(evalB)
  if (!phraseA || !phraseB) return null

  if (answer === SPLIT) {
    if (phraseA !== phraseB) return null
    return {
      explanation: `${capitalise(shared(phraseA))}, and neither is higher, so the pot is split.`,
      settledBy: 'split',
    }
  }

  const won = answer === 'a'
  const label = won ? 'Hand A' : 'Hand B'
  const [winner, loser] = won ? [evalA, evalB] : [evalB, evalA]
  const [winnerPhrase, loserPhrase] = won ? [phraseA, phraseB] : [phraseB, phraseA]
  if (winnerPhrase !== loserPhrase) {
    return {
      explanation: `${label} takes it: ${winnerPhrase} beats ${loserPhrase}.`,
      settledBy: 'category',
    }
  }

  const decided = decidingRanks(bestFive(winner), bestFive(loser))
  if (!decided) return null
  // Past the made cards, the two hands are the same hand and a kicker settles
  // it. Before them, the hands themselves differ.
  const kicker = decided.index >= (MADE_CARDS[winner.name] ?? 5)
  const verb = kicker ? 'outkicks' : 'outranks'
  return {
    explanation: `${label} takes it: ${shared(winnerPhrase)}, and the ${rankName(decided.won)} ${verb} the ${rankName(decided.lost)}.`,
    settledBy: kicker ? 'kicker' : 'rank',
  }
}

/** "both make a flush", or the readable form of both making nothing. */
function shared(phrase: string): string {
  return phrase === 'high card' ? 'neither hand makes a pair' : `both make ${phrase}`
}
