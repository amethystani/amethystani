'use client'

// Quick match from the browser: one socket to the stake's queue, held open
// until the server says which table you are at.

import { create } from 'zustand'
import { sessionToken, socketUrl } from '@/lib/multiplayer/client'
import type {
  QueueClientMessage,
  QueueServerMessage,
  ServerError,
} from '@/lib/multiplayer/protocol'
import { useProfile } from './profile'

export type QueueState = 'idle' | 'joining' | 'waiting' | 'matched' | 'failed'

interface QueueStore {
  venueId: string | null
  state: QueueState
  waiting: number
  seats: number
  /** When the cast fills the table, by this device's clock. */
  fillAt: number | null
  matchedCode: string | null
  error: ServerError | null
  join: (venueId: string) => void
  leave: () => void
}

let socket: WebSocket | null = null

export const useQueue = create<QueueStore>((set, get) => ({
  venueId: null,
  state: 'idle',
  waiting: 0,
  seats: 0,
  fillAt: null,
  matchedCode: null,
  error: null,

  join: (venueId) => {
    get().leave()
    set({ venueId, state: 'joining', error: null, matchedCode: null, fillAt: null, waiting: 0 })
    void (async () => {
      const token = await sessionToken()
      if (get().venueId !== venueId) return
      if (!token) {
        set({ state: 'failed', error: 'auth' })
        return
      }
      const ws = new WebSocket(socketUrl(`/queue/${venueId}/ws`))
      socket = ws
      ws.onopen = () => {
        const { name, avatar, avatarRing } = useProfile.getState()
        ws.send(
          JSON.stringify({
            t: 'hello',
            token,
            name,
            avatar: avatar ?? { seed: name || 'pip', backgroundColor: 'b6e3f4' },
            ring: avatarRing,
          } satisfies QueueClientMessage),
        )
      }
      ws.onmessage = (e) => {
        let msg: QueueServerMessage
        try {
          msg = JSON.parse(String(e.data)) as QueueServerMessage
        } catch {
          return
        }
        if (msg.t === 'queued') {
          set({
            state: 'waiting',
            waiting: msg.waiting,
            seats: msg.seats,
            // Into this device's clock, so the countdown is right however far
            // the phone's clock has drifted.
            fillAt: msg.fillAt === null ? null : msg.fillAt - msg.now + Date.now(),
          })
        } else if (msg.t === 'matched') {
          set({ state: 'matched', matchedCode: msg.code })
        } else if (msg.t === 'error') {
          set({ state: 'failed', error: msg.error })
        }
      }
      ws.onclose = () => {
        if (socket === ws) socket = null
        if (get().state === 'waiting' || get().state === 'joining') {
          set({ state: 'failed', error: get().error ?? 'closed' })
        }
      }
    })()
  },

  leave: () => {
    if (socket) {
      socket.onclose = null
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ t: 'leave' } satisfies QueueClientMessage))
      }
      socket.close()
    }
    socket = null
    set({ venueId: null, state: 'idle', fillAt: null, waiting: 0, matchedCode: null })
  },
}))
