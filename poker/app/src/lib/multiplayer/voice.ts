'use client'

// How loud somebody is speaking, from their audio track, for the ring round
// their seat.
//
// One AudioContext for the page, and an analyser per voice. Nothing is
// recorded or sent anywhere: the samples are read, reduced to one number, and
// thrown away, every frame.

let context: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  if (!context) {
    context = new AudioContext()
    // A context made without a tap starts suspended on iOS and in Chrome. The
    // next tap anywhere wakes it; until then the rings simply stay still.
    if (context.state === 'suspended') {
      const wake = () => void context?.resume()
      window.addEventListener('pointerdown', wake, { once: true })
      void context.resume().catch(() => undefined)
    }
  }
  return context
}

/**
 * A reader for one voice: call it each frame for a level in [0, 1], and call
 * `stop` when the seat goes. Null when there is no audio to read.
 */
export function voiceMeter(stream: MediaStream): { level: () => number; stop: () => void } | null {
  const ctx = audioContext()
  if (!ctx || stream.getAudioTracks().length === 0) return null
  let source: MediaStreamAudioSourceNode
  try {
    // Only the audio tracks: a source over a stream that also carries video is
    // fine, but one with no audio throws.
    source = ctx.createMediaStreamSource(new MediaStream(stream.getAudioTracks()))
  } catch {
    return null
  }
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  source.connect(analyser)
  const samples = new Float32Array(analyser.fftSize)
  return {
    level: () => {
      analyser.getFloatTimeDomainData(samples)
      let sum = 0
      for (const s of samples) sum += s * s
      const rms = Math.sqrt(sum / samples.length)
      // Below the floor is room noise; the top of the range is a raised voice.
      return Math.max(0, Math.min(1, (rms - 0.012) / 0.1))
    },
    stop: () => {
      source.disconnect()
      analyser.disconnect()
    },
  }
}
