// What a multiplayer table should sound and feel like, worked out from what
// changed between two views of it.
//
// The ladder's store plays a sound as each thing happens, because it is the
// one making it happen. A room only learns what happened when the server sends
// the next view, so the same sounds come from comparing that view with the one
// before: every move anybody made, each deal, your turn, how each hand ended
// for you, and the buzz for busting or winning the table. Haptics follow the
// sounds on their own (AppBoot joins the two); `bust` and `finish` are buzzes
// with no sound, as on the ladder.
//
// Pure, so it is tested (tests/multiplayerCues.test.ts) rather than listened for.

import type { Buzz } from '@/lib/haptics'
import type { ActionRecord, HandState } from '@/lib/poker/engine'
import type { Cue } from '@/lib/sound'
import type { RoomView } from './view'

/** A reconnect can deliver a whole street at once; a burst of clicks is noise. */
const MAX_ACTION_SOUNDS = 2

/** The sound for one move, as the ladder plays it (`playActionSound` in store/game). */
export function moveCue(record: ActionRecord, hand: HandState): Cue {
  if (record.type === 'draw') return 'draw'
  if (record.type === 'bet' || record.type === 'raise') {
    const player = hand.players.find((p) => p.id === record.playerId)
    // Their last move put them all-in: the bet that emptied the stack.
    const last = [...hand.actions].reverse().find((a) => a.playerId === record.playerId)
    if (player?.status === 'allin' && last === record) return 'allin'
    return record.type
  }
  return record.type
}

export function cuesFor(prev: RoomView | null, next: RoomView): Buzz[] {
  // The first view of a table (a join or a reconnect) is the table as it is,
  // not something that just happened.
  if (!prev || prev.code !== next.code || !next.hand) return []
  const cues: Buzz[] = []
  const hand = next.hand
  const newHand = prev.handIndex !== next.handIndex
  if (newHand) cues.push('deal')

  // Every move since the last view, except your own: that one sounded the
  // moment you pressed the button.
  const seen = newHand ? 0 : (prev.hand?.actions.length ?? 0)
  const moves = hand.actions.slice(seen).filter((a) => a.playerId !== next.you)
  for (const move of moves.slice(-MAX_ACTION_SOUNDS)) cues.push(moveCue(move, hand))

  // How the hand ended for you, once, as it ends.
  const ended = hand.result !== null && (newHand || prev.hand?.result === null)
  const dealtIn = hand.players.some((p) => p.id === next.you)
  if (ended && dealtIn && hand.result) {
    const won = (hand.result.payouts[next.you ?? ''] ?? 0) > 0
    cues.push(won ? 'win' : hand.result.showdown ? 'lose' : 'tap')
  }

  const before = prev.hand ? prev.hand.players[prev.hand.toActIndex]?.id : undefined
  const now = hand.result ? undefined : hand.players[hand.toActIndex]?.id
  if (now && now === next.you && (newHand || before !== next.you)) cues.push('turn')

  // Your game ending: knocked out, or the table won.
  const placedBefore = prev.players.find((p) => p.id === prev.you)?.place ?? null
  const placed = next.players.find((p) => p.id === next.you)?.place ?? null
  if (placedBefore === null && placed !== null) cues.push(placed === 1 ? 'finish' : 'bust')
  return cues
}
