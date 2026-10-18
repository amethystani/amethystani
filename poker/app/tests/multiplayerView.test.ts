import test from 'ava'
import { VENUES } from '@/config/venues'
import { cardToString, mulberry32 } from '@/lib/poker/cards'
import {
  addBots,
  createRoom,
  join,
  start,
  tick,
  type Result,
  type RoomState,
} from '@/lib/multiplayer/room'
import { viewFor } from '@/lib/multiplayer/view'

const pub = VENUES[1]
const must = (r: Result): RoomState => {
  if (!r.ok) throw new Error(r.error)
  return r.state
}
const person = (n: number) => ({
  userId: `user-${n}`,
  name: `P${n}`,
  avatar: { seed: `s${n}`, backgroundColor: 'b6e3f4' },
  ring: null,
})

/**
 * The rule the whole of multiplayer rests on: a view carries the deck never,
 * the viewer's own cards, and anybody else's only once a showdown turned them
 * over. Checked on every state of thousands of hands, for every seat and for a
 * spectator, rather than on a hand picked to pass.
 */
test('no view ever carries the deck or a card the viewer may not see', (t) => {
  let states = 0
  for (let seed = 1; seed <= 12; seed++) {
    const rng = mulberry32(seed)
    let s = must(
      join(
        createRoom({ code: 'AAAAAA', kind: 'private', venue: pub, host: person(0), now: 0 }),
        person(1),
        0,
      ),
    )
    s = must(addBots(s, 'user-0', 2, rng))
    s = must(start(s, 'user-0', 0, rng))
    let now = 0
    for (let i = 0; i < 3_000 && s.phase === 'playing'; i++) {
      const hand = s.hand!
      const shown = new Set(
        hand.result?.showdown
          ? hand.players.filter((p) => p.status !== 'folded' && p.status !== 'out').map((p) => p.id)
          : [],
      )
      for (const viewer of [null, 'user-0', 'user-1']) {
        const v = viewFor(s, viewer)
        t.is(v.hand!.deck.length, 0)
        for (const p of v.hand!.players) {
          if (p.id === v.you || shown.has(p.id)) {
            const real = hand.players.find((h) => h.id === p.id)!
            t.deepEqual(p.hole.map(cardToString), real.hole.map(cardToString))
          } else {
            t.is(p.hole.length, 0, `seed ${seed}: ${p.id} leaked to ${viewer}`)
          }
        }
        // The count of cards held is public; what they are is not.
        for (const p of hand.players) if (p.status !== 'out') t.is(v.held[p.id], p.hole.length)
      }
      states++
      now = Math.max(now, s.dueAt ?? now)
      s = tick(s, now, rng)
    }
  }
  t.true(states > 300)
})

test('a view never carries an account id', (t) => {
  const s = must(
    join(
      createRoom({ code: 'AAAAAA', kind: 'private', venue: pub, host: person(0), now: 0 }),
      person(1),
      0,
    ),
  )
  const text = JSON.stringify(viewFor(s, 'user-1'))
  t.false(text.includes('user-0'))
  t.false(text.includes('user-1'))
})

test('the viewer is told their seat and whether they are the host', (t) => {
  const s = must(
    join(
      createRoom({ code: 'AAAAAA', kind: 'private', venue: pub, host: person(0), now: 0 }),
      person(1),
      0,
    ),
  )
  const host = viewFor(s, 'user-0')
  const guest = viewFor(s, 'user-1')
  t.is(host.you, 'p0')
  t.true(host.isHost)
  t.is(guest.you, 'p1')
  t.false(guest.isHost)
  t.true(guest.players.find((p) => p.id === 'p0')!.host)
  t.is(viewFor(s, 'user-9').you, null)
})
