import test from 'ava'
import { CODE_ALPHABET, newRoomCode, normaliseRoomCode } from '@/lib/multiplayer/code'
import {
  emptyQueue,
  enqueue,
  dequeue,
  fillAt,
  takeTable,
  FILL_AFTER_MS,
} from '@/lib/multiplayer/matchmaking'
import { cleanName, parseClientMessage, parseQueueMessage } from '@/lib/multiplayer/protocol'
import { mulberry32 } from '@/lib/poker/cards'

const avatar = { seed: 'abc', backgroundColor: 'b6e3f4' }
const send = (m: unknown) => parseClientMessage(JSON.stringify(m))

test('a hello is read with its name cleaned and its avatar checked', (t) => {
  const m = send({ t: 'hello', token: 'tok', name: '  Will   L ', avatar, ring: null })
  t.deepEqual(m, { t: 'hello', token: 'tok', name: 'Will L', avatar, ring: null })
  t.is(
    send({ t: 'hello', token: 'tok', name: 'x', avatar: { seed: 'a', backgroundColor: 'red' } }),
    null,
  )
  t.is(send({ t: 'hello', name: 'x', avatar }), null)
})

test('names are bounded and never empty', (t) => {
  t.is(cleanName('   '), 'Player')
  t.is(cleanName(42), 'Player')
  t.is(cleanName('a'.repeat(80)).length, 24)
})

test('actions are read only in a shape the engine takes', (t) => {
  t.deepEqual(send({ t: 'act', action: { type: 'raise', amount: 40 } }), {
    t: 'act',
    action: { type: 'raise', amount: 40 },
  })
  t.is(send({ t: 'act', action: { type: 'steal' } }), null)
  t.is(send({ t: 'act', action: { type: 'bet', amount: -5 } }), null)
  t.is(send({ t: 'act', action: { type: 'bet', amount: 1.5 } }), null)
  t.is(send({ t: 'act', action: { type: 'draw', discard: [0, 1, 2, 3, 4, 5] } }), null)
})

test('anything that is not one of the messages is dropped', (t) => {
  t.is(parseClientMessage('not json'), null)
  t.is(parseClientMessage(JSON.stringify([1, 2])), null)
  t.is(send({ t: 'admin' }), null)
  t.is(send({ t: 'bots', count: 100 }), null)
  t.is(send({ t: 'signal', to: 'p1', data: 'x'.repeat(20_000) }), null)
  t.is(parseClientMessage(42), null)
})

test('media and signalling messages are passed on in shape', (t) => {
  t.deepEqual(send({ t: 'media', media: { camera: true, mic: false } }), {
    t: 'media',
    media: { camera: true, mic: false },
  })
  t.is(send({ t: 'media', media: { camera: 'yes', mic: false } }), null)
  t.deepEqual(send({ t: 'signal', to: 'p2', data: { sdp: 'v=0' } }), {
    t: 'signal',
    to: 'p2',
    data: { sdp: 'v=0' },
  })
})

test('the queue reads only hello, leave and ping', (t) => {
  t.deepEqual(parseQueueMessage(JSON.stringify({ t: 'leave' })), { t: 'leave' })
  t.is(parseQueueMessage(JSON.stringify({ t: 'act', action: { type: 'fold' } })), null)
})

test('room codes are six characters from the readable set', (t) => {
  const rng = mulberry32(1)
  for (let i = 0; i < 200; i++) {
    const code = newRoomCode((n) => Math.floor(rng() * n))
    t.is(code.length, 6)
    t.true([...code].every((c) => CODE_ALPHABET.includes(c)))
    t.is(normaliseRoomCode(code), code)
  }
  t.false(/[01OIL]/.test(CODE_ALPHABET))
})

test('a typed code forgives case and spacing, and nothing else', (t) => {
  t.is(normaliseRoomCode('abc def'), 'ABCDEF')
  t.is(normaliseRoomCode('ab-cd-ef'), 'ABCDEF')
  t.is(normaliseRoomCode('ABCDE'), null)
  t.is(normaliseRoomCode('ABCDEO'), null)
})

const j = (n: number) => ({ userId: `u${n}`, name: `P${n}`, avatar, ring: null })

test('a full queue becomes a table at once', (t) => {
  let q = emptyQueue('pub', 3)
  for (let n = 0; n < 4; n++) q = enqueue(q, j(n), n)
  const { queue, table } = takeTable(q, 10)
  t.deepEqual(
    table!.map((w) => w.userId),
    ['u0', 'u1', 'u2'],
  )
  t.deepEqual(
    queue.waiting.map((w) => w.userId),
    ['u3'],
  )
  t.is(fillAt(queue), 3 + FILL_AFTER_MS)
})

test('a short queue waits, then goes with whoever is there', (t) => {
  let q = enqueue(emptyQueue('pub', 5), j(0), 1_000)
  q = enqueue(q, j(1), 5_000)
  t.is(takeTable(q, 1_000 + FILL_AFTER_MS - 1).table, null)
  const { queue, table } = takeTable(q, 1_000 + FILL_AFTER_MS)
  t.is(table!.length, 2)
  t.is(queue.waiting.length, 0)
  t.is(fillAt(queue), null)
})

test('joining twice keeps your place, and leaving takes you out', (t) => {
  let q = enqueue(emptyQueue('pub', 5), j(0), 0)
  q = enqueue(q, j(1), 1)
  q = enqueue(q, j(0), 2)
  t.is(q.waiting.length, 2)
  t.is(q.waiting[0].joinedAt, 0)
  q = dequeue(q, 'u0')
  t.deepEqual(
    q.waiting.map((w) => w.userId),
    ['u1'],
  )
})

test('reports carry one of the reasons, and blocks a seat', (t) => {
  t.deepEqual(send({ t: 'report', id: 'p2', reason: 'abuse' }), {
    t: 'report',
    id: 'p2',
    reason: 'abuse',
  })
  t.is(send({ t: 'report', id: 'p2', reason: 'rude' }), null)
  t.is(send({ t: 'report', id: 'p2' }), null)
  t.deepEqual(send({ t: 'block', id: 'p2' }), { t: 'block', id: 'p2' })
})
