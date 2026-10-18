// The messages between a browser and the room server, and the checks on them.
//
// **Everything a client sends is read through `parseClientMessage` before the
// server looks at it.** The socket is open to anybody with the URL, so a
// message is untrusted text until it has been shown to be one of the shapes
// below, with every field the right type and a sensible size. Anything else is
// dropped, never half-read.

import type { AvatarSpec } from '@/lib/avatar'
import type { Action, ActionType } from '@/lib/poker/engine'
import type { RoomSettings } from './room'
import type { RoomView } from './view'

/** Who you are, sent first on every socket. The token is your Supabase session. */
export interface Hello {
  t: 'hello'
  token: string
  name: string
  avatar: AvatarSpec
  ring: string | null
}

export const REPORT_REASONS = ['abuse', 'camera', 'cheating', 'other'] as const
export type ReportReason = (typeof REPORT_REASONS)[number]

/** Whether your camera and microphone are on, as the table should draw you. */
export interface MediaState {
  camera: boolean
  mic: boolean
}

export type ClientMessage =
  | Hello
  | { t: 'act'; action: Action }
  | { t: 'start' }
  | { t: 'bots'; count: number }
  | { t: 'unbot'; id: string }
  /** The host changes the table's rules, before the deal. */
  | { t: 'configure'; settings: Partial<RoomSettings> }
  /** The host removes a person from the room. */
  | { t: 'kick'; id: string }
  /** Report a person at the table. */
  | { t: 'report'; id: string; reason: ReportReason }
  /** Block a person: no camera or voice between you, now or in your rooms. */
  | { t: 'block'; id: string }
  | { t: 'leave' }
  | { t: 'media'; media: MediaState }
  /** A WebRTC offer, answer or candidate for one other seat. Passed on untouched. */
  | { t: 'signal'; to: string; data: unknown }
  | { t: 'ping' }

export type ServerError =
  | 'auth'
  | 'members-only'
  | 'no-room'
  | 'full'
  | 'started'
  | 'not-invited'
  | 'not-host'
  | 'not-your-turn'
  | 'illegal'
  | 'too-few'
  | 'not-seated'
  | 'closed'
  | 'bad-message'
  | 'slow-down'
  | 'kicked'
  | 'bad-settings'

export type ServerMessage =
  /** `now` is the server's clock, so a turn timer can be drawn without trusting the device's. */
  | { t: 'room'; view: RoomView; now: number }
  | { t: 'error'; error: ServerError }
  | { t: 'media'; media: Record<string, MediaState> }
  | { t: 'signal'; from: string; data: unknown }
  | { t: 'ice'; iceServers: RTCIceServerLike[] }
  /** A report was received. */
  | { t: 'reported' }
  | { t: 'pong' }

/** The shape `RTCPeerConnection` takes, without needing the DOM's types on the server. */
export interface RTCIceServerLike {
  urls: string | string[]
  username?: string
  credential?: string
}

/** Quick match: the queue's own socket. */
export type QueueClientMessage = Hello | { t: 'leave' } | { t: 'ping' }

export type QueueServerMessage =
  /** How many are waiting at this stake, and when the cast fills the rest. */
  | { t: 'queued'; waiting: number; seats: number; fillAt: number | null; now: number }
  | { t: 'matched'; code: string }
  | { t: 'error'; error: ServerError }
  | { t: 'pong' }

// --- validation --------------------------------------------------------------

const ACTIONS: readonly ActionType[] = ['fold', 'check', 'call', 'bet', 'raise', 'draw']
const MAX_NAME = 24
const MAX_TOKEN = 4096
/** A signalling payload is an SDP or a candidate. Generous, but bounded. */
const MAX_SIGNAL = 16_000

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isStr = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= max

/** A name to show at the table: trimmed, bounded, and never empty. */
export function cleanName(v: unknown): string {
  const name = typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME) : ''
  return name || 'Player'
}

function parseAvatar(v: unknown): AvatarSpec | null {
  if (!isObj(v)) return null
  if (!isStr(v.seed, 64)) return null
  if (typeof v.backgroundColor !== 'string' || !/^[0-9a-f]{6}$/i.test(v.backgroundColor)) {
    return null
  }
  return { seed: v.seed, backgroundColor: v.backgroundColor }
}

function parseHello(m: Obj): Hello | null {
  if (!isStr(m.token, MAX_TOKEN)) return null
  const avatar = parseAvatar(m.avatar)
  if (!avatar) return null
  const ring = m.ring === null || m.ring === undefined ? null : isStr(m.ring, 40) ? m.ring : null
  return { t: 'hello', token: m.token, name: cleanName(m.name), avatar, ring }
}

function parseAction(v: unknown): Action | null {
  if (!isObj(v) || !ACTIONS.includes(v.type as ActionType)) return null
  const action: Action = { type: v.type as ActionType }
  if (v.amount !== undefined) {
    if (typeof v.amount !== 'number' || !Number.isSafeInteger(v.amount) || v.amount < 0) {
      return null
    }
    action.amount = v.amount
  }
  if (v.discard !== undefined) {
    if (!Array.isArray(v.discard) || v.discard.length > 5) return null
    if (!v.discard.every((i) => Number.isInteger(i))) return null
    action.discard = v.discard as number[]
  }
  return action
}

/**
 * Only the fields a host may set, each the right type. Whether the values are
 * in range is the reducer's call (`configure`), which refuses a bad set whole.
 */
function parseSettings(v: unknown): Partial<RoomSettings> | null {
  if (!isObj(v)) return null
  const out: Partial<RoomSettings> = {}
  if ('seats' in v) {
    if (typeof v.seats !== 'number') return null
    out.seats = v.seats
  }
  if ('depth' in v) {
    if (v.depth !== 1 && v.depth !== 2 && v.depth !== 3) return null
    out.depth = v.depth
  }
  if ('blinds' in v) {
    if (
      v.blinds !== 'slow' &&
      v.blinds !== 'normal' &&
      v.blinds !== 'turbo' &&
      v.blinds !== 'flat'
    ) {
      return null
    }
    out.blinds = v.blinds
  }
  if ('turnSeconds' in v) {
    if (v.turnSeconds !== 15 && v.turnSeconds !== 30 && v.turnSeconds !== 60) return null
    out.turnSeconds = v.turnSeconds
  }
  if ('leaving' in v) {
    if (v.leaving !== 'keep-seat' && v.leaving !== 'out') return null
    out.leaving = v.leaving
  }
  if ('forRoll' in v) {
    if (typeof v.forRoll !== 'boolean') return null
    out.forRoll = v.forRoll
  }
  return Object.keys(out).length > 0 ? out : null
}

function decode(raw: unknown): Obj | null {
  if (typeof raw !== 'string' || raw.length > MAX_SIGNAL + 1024) return null
  try {
    const m: unknown = JSON.parse(raw)
    return isObj(m) ? m : null
  } catch {
    return null
  }
}

export function parseClientMessage(raw: unknown): ClientMessage | null {
  const m = decode(raw)
  if (!m) return null
  switch (m.t) {
    case 'hello':
      return parseHello(m)
    case 'act': {
      const action = parseAction(m.action)
      return action ? { t: 'act', action } : null
    }
    case 'start':
    case 'leave':
    case 'ping':
      return { t: m.t }
    case 'bots':
      return typeof m.count === 'number' && Number.isInteger(m.count) && m.count > 0 && m.count < 8
        ? { t: 'bots', count: m.count }
        : null
    case 'unbot':
      return isStr(m.id, 12) ? { t: 'unbot', id: m.id } : null
    case 'kick':
      return isStr(m.id, 12) ? { t: 'kick', id: m.id } : null
    case 'block':
      return isStr(m.id, 12) ? { t: 'block', id: m.id } : null
    case 'report':
      return isStr(m.id, 12) && REPORT_REASONS.includes(m.reason as ReportReason)
        ? { t: 'report', id: m.id, reason: m.reason as ReportReason }
        : null
    case 'configure': {
      const settings = parseSettings(m.settings)
      return settings ? { t: 'configure', settings } : null
    }
    case 'media':
      return isObj(m.media) &&
        typeof m.media.camera === 'boolean' &&
        typeof m.media.mic === 'boolean'
        ? { t: 'media', media: { camera: m.media.camera, mic: m.media.mic } }
        : null
    case 'signal':
      return isStr(m.to, 12) && JSON.stringify(m.data ?? null).length <= MAX_SIGNAL
        ? { t: 'signal', to: m.to, data: m.data }
        : null
    default:
      return null
  }
}

export function parseQueueMessage(raw: unknown): QueueClientMessage | null {
  const m = decode(raw)
  if (!m) return null
  if (m.t === 'hello') return parseHello(m)
  if (m.t === 'leave' || m.t === 'ping') return { t: m.t }
  return null
}
