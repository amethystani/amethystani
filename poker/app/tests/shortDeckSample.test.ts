import { readFileSync } from 'node:fs'
import test from 'ava'
import { rosterFor } from '@/config/cast'
import { SHORT_DECK_TABLES, membershipForVenue } from '@/config/venues'
import { shortDeckSample } from '@/lib/membership/shortDeckSample'
import { type Card, cardToString } from '@/lib/poker/cards'

// The Short Deck showdown on `/membership?for=shortdeck`. The cards are typed,
// so this holds what the page says about them to the evaluator: the lesson is
// "a full house wins this in Hold'em, a flush wins it here", and if the rules
// or the evaluator ever disagreed, the page would be teaching the wrong game.
//
// What this cannot cover: how the felt sits on a phone, and whether the rings
// read. That needs somebody to open the page.

const keys = (cards: readonly Card[]) => new Set(cards.map(cardToString))

test('the hand teaches the flush rule: the full house wins in Hold’em, the flush here', (t) => {
  const s = shortDeckSample()
  t.is(s.hero.phrase, 'a flush')
  t.is(s.them.phrase, 'a full house')
  t.is(s.holdemWinner, 'them')
  t.is(s.winner, 'hero')
})

test('every card is one a short deck holds, and none is dealt twice', (t) => {
  const s = shortDeckSample()
  const all = [...s.board, ...s.hero.cards, ...s.them.cards]
  t.is(new Set(all.map(cardToString)).size, 9)
  for (const card of all) t.false(['2', '3', '4', '5'].includes(card.rank), cardToString(card))
})

test('the five that play come from each side’s seven', (t) => {
  const s = shortDeckSample()
  for (const side of [s.hero, s.them]) {
    t.is(side.plays.length, 5)
    const seven = keys([...side.cards, ...s.board])
    t.true(side.plays.every((c) => seven.has(cardToString(c))))
  }
})

test('the opponent is a regular at Short Deck', (t) => {
  t.truthy(rosterFor(SHORT_DECK_TABLES[0])[0]?.name)
})

test('every Short Deck padlock asks for this showdown', (t) => {
  for (const room of SHORT_DECK_TABLES) t.regex(membershipForVenue(room) ?? '', /for=shortdeck\b/)
})

test('only a tap on Short Deck loads the showdown, and only on the client', (t) => {
  const source = readFileSync(
    new URL('../src/components/membership/TappedFor.tsx', import.meta.url),
    'utf-8',
  )
  t.regex(source, /feature\.id === 'shortdeck' && <TappedShortDeck \/>/)
  t.regex(source, /import\('\.\/TappedShortDeck'\)[\s\S]*?ssr: false/)
})
