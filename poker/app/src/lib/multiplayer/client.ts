'use client'

// The browser's side of the room server: where it is, who you are to it, and
// the two plain requests (open a room, look a code up). The sockets live in
// `store/room.ts` and `store/queue.ts`.

import { getSupabase } from '@/lib/sync/client'
import type { AvatarSpec } from '@/lib/avatar'
import type { RoomSettings } from './room'

const ROOMS_URL = process.env.NEXT_PUBLIC_ROOMS_URL?.replace(/\/$/, '')

/** Is there a room server in this build? Multiplayer hides itself when not. */
export function roomsConfigured(): boolean {
  return Boolean(ROOMS_URL)
}

export function socketUrl(path: string): string {
  return `${ROOMS_URL!.replace(/^http/, 'ws')}${path}`
}

const DEV_TOKEN_KEY = 'pip.roomsDevToken'

/**
 * Local development only: a `dev:<name>:member` token stands in for a Supabase
 * session, so two browsers can sit at one table against `pnpm rooms:dev` with
 * no accounts. The room server accepts it only when its own DEV_AUTH is on,
 * which production never sets.
 */
function devToken(): string | null {
  if (process.env.NODE_ENV !== 'development') return null
  try {
    return localStorage.getItem(DEV_TOKEN_KEY)
  } catch {
    return null
  }
}

/** Whether a dev token is set, and whether it says member, so the screens can be tried locally. */
export function devSignedIn(): boolean {
  return devToken() !== null
}

export function devMember(): boolean {
  return devToken()?.endsWith(':member') ?? false
}

/** Your session, as the room server reads it. Null when signed out. */
export async function sessionToken(): Promise<string | null> {
  const dev = devToken()
  if (dev) return dev
  const sb = await getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session?.access_token ?? null
}

export interface Seat {
  name: string
  avatar: AvatarSpec
  ring: string | null
}

export type CreateResult = { code: string } | { error: string }

/** Open a private room at a ladder stake, with you in the first seat and your rules set. */
export async function createRoom(
  venueId: string,
  seat: Seat,
  settings?: Partial<RoomSettings>,
): Promise<CreateResult> {
  const token = await sessionToken()
  if (!token) return { error: 'auth' }
  try {
    const res = await fetch(`${ROOMS_URL}/rooms`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId, ...seat, settings }),
    })
    const body = (await res.json()) as { code?: string; error?: string }
    return body.code ? { code: body.code } : { error: body.error ?? 'busy' }
  } catch {
    return { error: 'offline' }
  }
}

/** What a code opens, before you sit down: shown on the join screen. */
export interface RoomPeek {
  code: string
  kind: 'private' | 'quick'
  phase: 'lobby' | 'playing' | 'finished' | 'closed'
  venueId: string
  buyIn: number
  seated: number
  maxSeats: number
  host: string | null
  /** False for a game for fun: no buy-in, no prize. */
  forRoll?: boolean
}

export async function peekRoom(code: string): Promise<RoomPeek | null> {
  try {
    const res = await fetch(`${ROOMS_URL}/rooms/${code}`)
    return res.ok ? ((await res.json()) as RoomPeek) : null
  } catch {
    return null
  }
}

/** The link a host shares. Opens the room on any device, the app included. */
export function inviteLink(code: string): string {
  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/game/room/?code=${code}`
}
