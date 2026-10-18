import test from 'ava'
import { VENUES } from '@/config/venues'
import { cuesFor } from '@/lib/multiplayer/cues'
import {
  act,
  createRoom,
  join,
  leave,
  start,
  tick,
  type Result,
  type RoomState,
} from '@/lib/multiplayer/room'
import { viewFor } from '@/lib/multiplayer/view'
import { mulberry32 } from '@/lib/poker/cards'

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
const table = (seed: number) => {
  const s = must(
    join(
      createRoom({ code: 'AAAAAA', kind: 'private', venue: pub, host: person(0), now: 0 }),
      person(1),
      0,
    ),
  )
  return must(start(s, 'user-0', 0, mulberry32(seed)))
}
const toActUser = (s: RoomState) =>
  s.players.find((p) => p.id === s.hand!.players[s.hand!.toActIndex].id)!.userId!

test('the first view of a table makes no sound', (t) => {
  t.deepEqual(cuesFor(null, viewFor(table(1), 'user-0')), [])
})

test("another player's move sounds for you, and your own does not sound twice", (t) => {
  const s = table(2)
  const mover = toActUser(s)
  const other = mover === 'user-0' ? 'user-1' : 'user-0'
  const next = must(act(s, mover, { type: 'call' }, 0))
  t.deepEqual(cuesFor(viewFor(s, other), viewFor(next, other)).slice(0, 1), ['call'])
  t.false(cuesFor(viewFor(s, mover), viewFor(next, mover)).includes('call'))
})

test('it becomes your turn: a turn cue', (t) => {
  const s = table(3)
  const mover = toActUser(s)
  const other = mover === 'user-0' ? 'user-1' : 'user-0'
  const next = must(act(s, mover, { type: 'call' }, 0))
  t.true(cuesFor(viewFor(s, other), viewFor(next, other)).includes('turn'))
})

test('a fold that ends the hand: win for the winner, the quiet tap for the folder', (t) => {
  const s = table(4)
  const mover = toActUser(s)
  const other = mover === 'user-0' ? 'user-1' : 'user-0'
  const next = must(act(s, mover, { type: 'fold' }, 0))
  t.true(cuesFor(viewFor(s, other), viewFor(next, other)).includes('win'))
  const mine = cuesFor(viewFor(s, mover), viewFor(next, mover))
  t.true(mine.includes('tap'))
  t.false(mine.includes('fold'))
})

test('a new hand deals', (t) => {
  const s = must(act(table(5), toActUser(table(5)), { type: 'fold' }, 0))
  const next = tick(s, s.dueAt!, mulberry32(5))
  t.true(cuesFor(viewFor(s, 'user-0'), viewFor(next, 'user-0')).includes('deal'))
})

test('the end of your game buzzes: finish for the winner, bust for the rest', (t) => {
  const s = table(6)
  const next = leave({ ...s, settings: { ...s.settings, leaving: 'out' } }, 'user-1', 0)
  let after = next
  let now = 0
  while (after.phase === 'playing') {
    now = Math.max(now, after.dueAt ?? now)
    after = tick(after, now, mulberry32(6))
  }
  t.true(cuesFor(viewFor(next, 'user-0'), viewFor(after, 'user-0')).includes('finish'))
  t.true(cuesFor(viewFor(next, 'user-1'), viewFor(after, 'user-1')).includes('bust'))
})
