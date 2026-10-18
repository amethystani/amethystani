import { readFileSync } from 'node:fs'
import test from 'ava'
import { rosterFor } from '@/config/cast'
import { DRAW_TABLES, membershipForVenue } from '@/config/venues'
import { drawSample } from '@/lib/membership/drawSample'
import { type Card, cardToString } from '@/lib/poker/cards'

// The Five-Card Draw hand on `/membership?for=draw`. The cards are typed, so
// this holds what the page says about them to the code the tables run: each
// side throws what `decideDiscard` throws, and the evaluator picks the winner.
//
// What this cannot cover: how five cards a side sit on a phone, and whether the
// rings read. That needs somebody to open the page.

const strings = (cards: readonly Card[]) => cards.map(cardToString)

test('the hand: a pair draws three and makes trips, a four-flush draws one and misses', (t) => {
  const s = drawSample()
  t.is(s.hero.drew, 3)
  t.is(s.them.drew, 1)
  t.is(s.hero.phrase, 'three of a kind')
  t.is(s.them.phrase, 'high card')
  t.is(s.winner, 'hero')
})

test('each side keeps what it was dealt and shows down five', (t) => {
  const s = drawSample()
  for (const side of [s.hero, s.them]) {
    t.is(side.cards.length, 5)
    t.is(side.kept.length + side.drew, 5)
    const dealt = new Set(strings(side.dealt))
    t.true(side.kept.every((c) => dealt.has(cardToString(c))))
    t.deepEqual(strings(side.cards.slice(0, side.kept.length)), strings(side.kept))
  }
})

test('no card is dealt twice, the draws included', (t) => {
  const s = drawSample()
  const all = [...s.hero.dealt, ...s.them.dealt, ...s.hero.cards, ...s.them.cards]
  const kept = [...s.hero.kept, ...s.them.kept]
  t.is(new Set(strings(all)).size, all.length - kept.length)
})

test('the opponent is a regular at The Parlour', (t) => {
  t.truthy(rosterFor(DRAW_TABLES[0])[0]?.name)
})

test('every Parlour padlock asks for this hand', (t) => {
  for (const room of DRAW_TABLES) t.regex(membershipForVenue(room) ?? '', /for=draw\b/)
})

test('only a tap on Five-Card Draw loads the hand, and only on the client', (t) => {
  const source = readFileSync(
    new URL('../src/components/membership/TappedFor.tsx', import.meta.url),
    'utf-8',
  )
  t.regex(source, /feature\.id === 'draw' && <TappedDraw \/>/)
  t.regex(source, /import\('\.\/TappedDraw'\)[\s\S]*?ssr: false/)
})
