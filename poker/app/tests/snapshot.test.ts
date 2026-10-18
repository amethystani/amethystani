// The refresh-resume snapshot (`pip.table` in localStorage) stores the hand in
// progress as JSON and plays it on from there. That only works because
// HandState is plain data: objects, arrays, numbers, strings. The day someone
// puts a Map, a Set, a Date or a class instance on it, JSON.stringify drops or
// mangles it, the resume silently falls back to a fresh deal, and the refresh
// exploit in #22 is back, with no test failing to say so.
//
// These tests pin that. They're engine-level on purpose: the store itself needs
// a DOM to test, but the property the store depends on is pure.

import test from 'ava'
import {
  startHand,
  applyAction,
  legalActions,
  isHandComplete,
  potSize,
  type HandState,
  type SeatConfig,
} from '@/lib/poker/engine'
import { makeDeck } from './helpers'

const seats = (): SeatConfig[] => [
  { id: 'hero', name: 'Hero', stack: 200 },
  { id: 'P1', name: 'One', stack: 200 },
  { id: 'P2', name: 'Two', stack: 200 },
]

/** What the snapshot does to a hand: through JSON and back. */
const roundTrip = (s: HandState): HandState => JSON.parse(JSON.stringify(s)) as HandState

// A board worth wanting to re-roll, which is the whole point of the issue.
const deck = () =>
  makeDeck([
    'As', // hero
    '7d',
    'Kc', // P1
    '2h',
    'Qs', // P2
    '9c',
    'Ah',
    'Ad',
    'Kh', // flop: hero flops a full house
    '3c', // turn
    '4d', // river
  ])

test('a hand survives the snapshot round trip unchanged', (t) => {
  const s0 = startHand({
    seats: seats(),
    buttonIndex: 0,
    smallBlind: 5,
    bigBlind: 10,
    deck: deck(),
  })
  const midHand = applyAction(applyAction(s0, { type: 'call' }), { type: 'call' })

  t.deepEqual(roundTrip(midHand), midHand)
  // Spelled out, because deepEqual on a Map/Set that JSON flattened to `{}`
  // would still pass against another flattened `{}` in some shapes.
  const back = roundTrip(midHand)
  t.is(back.deck.length, midHand.deck.length)
  t.is(back.players.length, midHand.players.length)
  t.deepEqual(
    back.players.map((p) => p.hole),
    midHand.players.map((p) => p.hole),
  )
  t.deepEqual(back.pots, midHand.pots)
  t.is(potSize(back), potSize(midHand))
})

test('play resumed from a round-tripped hand matches play that was never interrupted', (t) => {
  const start = () =>
    startHand({ seats: seats(), buttonIndex: 0, smallBlind: 5, bigBlind: 10, deck: deck() })

  // Same script both times: limp round, check to the river, showdown.
  const script = (s: HandState): HandState => {
    let cur = s
    for (let i = 0; i < 40 && !isHandComplete(cur); i++) {
      const legal = legalActions(cur)
      if (!legal) break
      cur = applyAction(cur, legal.canCheck ? { type: 'check' } : { type: 'call' })
    }
    return cur
  }

  const uninterrupted = script(start())
  // The refresh: snapshot after two actions, resume, finish the same way.
  const interrupted = script(
    roundTrip(applyAction(applyAction(start(), { type: 'call' }), { type: 'call' })),
  )

  t.true(isHandComplete(uninterrupted))
  t.deepEqual(interrupted, uninterrupted)
})

test('the resumed hand keeps the same board, so a refresh cannot re-roll it', (t) => {
  const s0 = startHand({
    seats: seats(),
    buttonIndex: 0,
    smallBlind: 5,
    bigBlind: 10,
    deck: deck(),
  })
  const preflop = applyAction(applyAction(s0, { type: 'call' }), { type: 'call' })

  const toFlop = (s: HandState) =>
    applyAction(applyAction(applyAction(s, { type: 'check' }), { type: 'check' }), {
      type: 'check',
    })

  const flopped = toFlop(preflop)
  const floppedAfterRefresh = toFlop(roundTrip(preflop))

  t.is(flopped.community.length, 3)
  t.deepEqual(floppedAfterRefresh.community, flopped.community)
  // And the hole cards you'd have been tempted to refresh away are still yours.
  t.deepEqual(
    floppedAfterRefresh.players.find((p) => p.id === 'hero')!.hole,
    flopped.players.find((p) => p.id === 'hero')!.hole,
  )
})

test('chips committed before the refresh are still committed after it', (t) => {
  // The exploit's payload: bet big, refresh, get the chips back. The pot and
  // the shrunken stack both have to survive.
  const s0 = startHand({
    seats: seats(),
    buttonIndex: 0,
    smallBlind: 5,
    bigBlind: 10,
    deck: deck(),
  })
  const raised = applyAction(s0, { type: 'raise', amount: 60 })
  const hero = (s: HandState) => s.players.find((p) => p.id === 'hero')!

  t.is(hero(raised).committedThisHand, 60)
  t.is(hero(raised).stack, 140)

  const resumed = roundTrip(raised)
  t.is(hero(resumed).committedThisHand, 60)
  t.is(hero(resumed).stack, 140)
  t.is(potSize(resumed), potSize(raised))
  t.is(resumed.toActIndex, raised.toActIndex)
  t.is(resumed.currentBet, raised.currentBet)
})
