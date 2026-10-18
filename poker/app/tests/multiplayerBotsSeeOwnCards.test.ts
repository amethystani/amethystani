import test from 'ava'
import { VENUES } from '@/config/venues'
import { mulberry32 } from '@/lib/poker/cards'
import {
  addBots,
  createRoom,
  join,
  roomVenue,
  start,
  tick,
  type Result,
  type RoomState,
} from '@/lib/multiplayer/room'
import { redactHand } from '@/lib/multiplayer/view'
import { decideAction } from '@/lib/poker/ai/policy'

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
 * The room server hands a bot the whole hand, every hole card and the deck
 * included. `/blog/your-cards-stay-on-the-server` says the AI players decide
 * from what a person in their seat could see, so this pins it: at every bot
 * decision, the move made from the whole hand is the move made from that
 * seat's redacted view, with the same dice.
 */
test('a bot at a room decides from its own seat’s view, never the others’ cards or the deck', (t) => {
  let decisions = 0
  for (let seed = 1; seed <= 1; seed++) {
    const rng = mulberry32(seed)
    let s = must(
      join(
        createRoom({ code: 'AAAAAA', kind: 'private', venue: pub, host: person(0), now: 0 }),
        person(1),
        0,
      ),
    )
    s = must(addBots(s, 'user-0', 4, rng))
    s = must(start(s, 'user-0', 0, rng))
    let now = 0
    for (let i = 0; i < 300 && s.phase === 'playing'; i++) {
      const hand = s.hand
      if (s.dueKind === 'bot' && hand) {
        const bot = s.players.find((p) => p.id === hand.players[hand.toActIndex]?.id)
        if (bot?.bot) {
          const ai = bot.ai ?? roomVenue(s.venueId)!.ai
          const full = decideAction(
            hand,
            ai,
            mulberry32(seed * 1_000 + i),
            structuredClone(s.memory),
          )
          const seen = decideAction(
            redactHand(hand, bot.id),
            ai,
            mulberry32(seed * 1_000 + i),
            structuredClone(s.memory),
          )
          t.deepEqual(seen, full, `seed ${seed}, step ${i}`)
          decisions++
        }
      }
      now = Math.max(now, s.dueAt ?? now)
      s = tick(s, now, rng)
    }
  }
  t.true(decisions > 100)
})
