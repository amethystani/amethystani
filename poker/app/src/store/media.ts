'use client'

// Camera and microphone at a private table.
//
// **Off until you tap it, and only ever between people who invited each
// other.** Nothing here asks for a camera on its own: `toggleCamera` and
// `toggleMic` are called from a button, which is also what lets iOS and
// Android play the other seats' audio (autoplay with sound needs a tap).
//
// Every other player gets a direct connection to you (a mesh: fine at six
// small seats, about 150 kbps a stream). The room's socket carries the
// set-up messages (`signal`), and Cloudflare's TURN relay, when the server has
// one configured, carries the media for the networks where a direct connection
// fails. Negotiation follows the "perfect negotiation" pattern, with the
// higher seat id as the polite side, so two people turning their cameras on at
// the same moment cannot deadlock.
//
// Each connection is set up once with an audio and a video slot, and turning
// a camera on or off swaps the track in that slot (`replaceTrack`) rather than
// renegotiating. Turning the camera off stops the track, so the light goes off.

import { create } from 'zustand'
import { onSignal, useRoom } from './room'

export type MediaProblem = 'denied' | 'unsupported' | 'unavailable'

interface Peer {
  pc: RTCPeerConnection
  polite: boolean
  makingOffer: boolean
  ignoreOffer: boolean
}

interface MediaStore {
  camera: boolean
  mic: boolean
  /** Your own camera, for your seat. */
  local: MediaStream | null
  /** Your own mic, for the ring round your seat. */
  localVoice: MediaStream | null
  /** Everybody else's, by seat id. */
  remote: Record<string, MediaStream>
  problem: MediaProblem | null
  /** Seats you have muted, for you only. Nothing is sent: their voice stops playing here. */
  muted: Record<string, boolean>
  /** Seats whose camera you have hidden, for you only: their avatar shows instead. */
  hidden: Record<string, boolean>
  toggleMute: (id: string) => void
  toggleHidden: (id: string) => void
  toggleCamera: () => Promise<void>
  toggleMic: () => Promise<void>
  /** Keep a connection open to exactly these seats. */
  connect: (me: string, peers: readonly string[]) => void
  /** Leaving the table: every connection closed and every track stopped. */
  stop: () => void
}

/** Small and steady: drawn at 46–64px, so anything bigger is bandwidth for nothing. */
const VIDEO: MediaTrackConstraints = {
  width: { ideal: 320 },
  height: { ideal: 240 },
  frameRate: { ideal: 15, max: 20 },
  facingMode: 'user',
}
const AUDIO: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
}

const peers = new Map<string, Peer>()
let videoTrack: MediaStreamTrack | null = null
let audioTrack: MediaStreamTrack | null = null
let unsubscribe: (() => void) | null = null

/** Whether the mic has been on since the table opened, so its leftovers get cleared up. */
let micUsed = false

/**
 * iOS sends a page's sound to the earpiece, as on a phone call, once its mic
 * is on, and WebKit leaves it there after the mic goes off: every cue after
 * that plays quietly by your ear. WebKit's audio session (Safari 16.4+, and
 * the app's web view) says what the page is doing instead, which moves the
 * sound back. Absent elsewhere, where there is nothing to fix.
 */
function audioSession(type: 'auto' | 'ambient' | 'playback'): void {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
  if (!session) return
  try {
    session.type = type
  } catch {
    // An older WebKit that knows the object but not the type.
  }
}

export function mediaSupported(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia)
}

function seatOrder(id: string): number {
  return Number.parseInt(id.replace(/\D/g, ''), 10) || 0
}

export const useMedia = create<MediaStore>((set, get) => {
  function publish() {
    const { camera, mic } = get()
    useRoom.getState().setMedia({ camera, mic })
  }

  function localStream(): MediaStream | null {
    const tracks = [videoTrack].filter((t): t is MediaStreamTrack => t !== null)
    return tracks.length > 0 ? new MediaStream(tracks) : null
  }

  /** Put the current tracks in every connection's slots. */
  function attachTracks() {
    for (const { pc } of peers.values()) {
      for (const t of pc.getTransceivers()) {
        const kind = t.receiver.track?.kind
        if (kind === 'video') void t.sender.replaceTrack(videoTrack)
        if (kind === 'audio') void t.sender.replaceTrack(audioTrack)
      }
    }
  }

  async function capture(kind: 'video' | 'audio'): Promise<MediaStreamTrack | null> {
    if (!mediaSupported()) {
      set({ problem: 'unsupported' })
      return null
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === 'video' ? { video: VIDEO } : { audio: AUDIO },
      )
      set({ problem: null })
      return (kind === 'video' ? stream.getVideoTracks() : stream.getAudioTracks())[0] ?? null
    } catch (e) {
      const name = (e as DOMException).name
      set({
        problem: name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unavailable',
      })
      return null
    }
  }

  function remoteTrack(id: string, track: MediaStreamTrack) {
    const current = get().remote[id]
    const stream = new MediaStream([
      ...(current?.getTracks().filter((t) => t.kind !== track.kind) ?? []),
      track,
    ])
    set({ remote: { ...get().remote, [id]: stream } })
  }

  function openPeer(me: string, id: string): Peer {
    const pc = new RTCPeerConnection({ iceServers: useRoom.getState().iceServers })
    const peer: Peer = {
      pc,
      // The higher seat yields when both offer at once.
      polite: seatOrder(me) > seatOrder(id),
      makingOffer: false,
      ignoreOffer: false,
    }
    const signal = (data: unknown) => useRoom.getState().signal(id, data)
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) signal({ candidate: candidate.toJSON() })
    }
    pc.onnegotiationneeded = async () => {
      try {
        peer.makingOffer = true
        await pc.setLocalDescription()
        signal({ description: pc.localDescription?.toJSON() })
      } catch {
        // A glare the other side will resolve.
      } finally {
        peer.makingOffer = false
      }
    }
    pc.ontrack = ({ track }) => remoteTrack(id, track)
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') pc.restartIce()
    }
    // The impolite side lays out the two slots; the polite side takes them
    // from the offer. Both laying them out would give every connection four.
    if (!peer.polite) {
      pc.addTransceiver('audio', { direction: 'sendrecv' })
      pc.addTransceiver('video', { direction: 'sendrecv' })
    }
    // In the map before the tracks go in: `attachTracks` only reaches the
    // connections it can find, and a camera already on would miss this one.
    peers.set(id, peer)
    if (!peer.polite) attachTracks()
    return peer
  }

  async function handleSignal(from: string, data: unknown) {
    const peer = peers.get(from)
    if (!peer || typeof data !== 'object' || data === null) return
    const { pc } = peer
    const msg = data as { description?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }
    try {
      if (msg.description) {
        const collision =
          msg.description.type === 'offer' && (peer.makingOffer || pc.signalingState !== 'stable')
        peer.ignoreOffer = !peer.polite && collision
        if (peer.ignoreOffer) return
        await pc.setRemoteDescription(msg.description)
        if (msg.description.type === 'offer') {
          for (const t of pc.getTransceivers()) t.direction = 'sendrecv'
          attachTracks()
          await pc.setLocalDescription()
          useRoom.getState().signal(from, { description: pc.localDescription?.toJSON() })
        }
      } else if (msg.candidate) {
        try {
          await pc.addIceCandidate(msg.candidate)
        } catch (e) {
          if (!peer.ignoreOffer) throw e
        }
      }
    } catch {
      // One bad message costs one connection a retry, not the table.
    }
  }

  /**
   * The relay arrives after the seat does: the server sends the table first
   * and only then asks Cloudflare for TURN credentials, so the first
   * connections are opened with no ICE servers at all. Without STUN or TURN
   * they can only reach each other on the same network, and never connect
   * across the internet. Hand every open connection the servers once they
   * come, and gather again with them.
   */
  function applyIceServers(iceServers: RTCIceServer[]) {
    for (const { pc } of peers.values()) {
      if (pc.signalingState === 'closed') continue
      pc.setConfiguration({ ...pc.getConfiguration(), iceServers })
      pc.restartIce()
    }
  }

  function closePeer(id: string) {
    peers.get(id)?.pc.close()
    peers.delete(id)
    const { [id]: _gone, ...rest } = get().remote
    set({ remote: rest })
  }

  return {
    camera: false,
    mic: false,
    local: null,
    localVoice: null,
    remote: {},
    problem: null,
    muted: {},
    hidden: {},

    toggleMute: (id) => set({ muted: { ...get().muted, [id]: !get().muted[id] } }),
    toggleHidden: (id) => set({ hidden: { ...get().hidden, [id]: !get().hidden[id] } }),

    toggleCamera: async () => {
      if (get().camera) {
        videoTrack?.stop()
        videoTrack = null
        attachTracks()
        set({ camera: false, local: null })
        return publish()
      }
      const track = await capture('video')
      if (!track) return
      videoTrack = track
      attachTracks()
      set({ camera: true, local: localStream() })
      publish()
    },

    toggleMic: async () => {
      if (get().mic) {
        audioTrack?.stop()
        audioTrack = null
        attachTracks()
        // Out loud again: the speaker, and the other seats' voices with it.
        audioSession('playback')
        set({ mic: false, localVoice: null })
        return publish()
      }
      // Recording needs WebKit to choose the session itself.
      micUsed = true
      audioSession('auto')
      const track = await capture('audio')
      if (!track) return
      audioTrack = track
      attachTracks()
      set({ mic: true, localVoice: new MediaStream([track]) })
      publish()
    },

    connect: (me, ids) => {
      if (!unsubscribe) {
        const offSignal = onSignal((from, data) => void handleSignal(from, data))
        const offIce = useRoom.subscribe((s, prev) => {
          if (s.iceServers !== prev.iceServers && s.iceServers.length > 0) {
            applyIceServers(s.iceServers)
          }
        })
        unsubscribe = () => {
          offSignal()
          offIce()
        }
      }
      for (const id of [...peers.keys()]) if (!ids.includes(id)) closePeer(id)
      for (const id of ids) if (id !== me && !peers.has(id)) openPeer(me, id)
    },

    stop: () => {
      for (const id of [...peers.keys()]) closePeer(id)
      videoTrack?.stop()
      audioTrack?.stop()
      videoTrack = null
      audioTrack = null
      // Away from the table, Pip's cues are background sound again: they mix
      // with your music and follow the silent switch.
      if (micUsed) audioSession('ambient')
      micUsed = false
      unsubscribe?.()
      unsubscribe = null
      set({
        camera: false,
        mic: false,
        local: null,
        localVoice: null,
        remote: {},
        problem: null,
        muted: {},
        hidden: {},
      })
    },
  }
})
