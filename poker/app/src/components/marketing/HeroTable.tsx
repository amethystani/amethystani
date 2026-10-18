'use client'

import { useHydrated } from '@/lib/useHydrated'

/**
 * The hero's stagger, in CSS (`.rise-in` in globals.css). Everything above the
 * fold uses this rather than Framer: a Framer `initial` is baked into the static
 * HTML as `opacity:0` and waits for hydration, which left the headline and the
 * Play button invisible for seconds on a slow load.
 */
export const riseDelay = (i: number) => ({ '--rise-delay': `${0.05 * i}s` }) as React.CSSProperties

/** Respect the user's reduced-motion setting — hydration-gated so SSR/client agree. */
function usePrefersReducedMotion() {
  const hydrated = useHydrated()
  if (!hydrated || typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/**
 * The hero showpiece: a real recorded hand at the Garage — flop the nut straight,
 * call down against a king-high straight, win at showdown. Answers a cold visitor's #1 question
 * ("what's it actually like to play?") with the game itself, not a mock-up.
 *
 * The capture is cropped to the felt (1200×1100, from a 1350×1080 window
 * recorded at 2× pixel density, app bar left out): the oval, the seats on the
 * rail and the action bar, nothing else, so the cards stay readable at hero size.
 * WebM first, MP4 for Safari, and the poster is the final frame, so it is also
 * the LCP image and the still a reduced-motion visitor gets.
 */
export function HeroTable() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <div style={riseDelay(2)} className="rise-in relative flex items-center justify-center">
      {/* soft focus glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-[36rem] max-w-full rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-pip)_20%,transparent),transparent_70%)] blur-3xl"
      />
      <figure className="relative w-full overflow-hidden rounded-3xl border border-foreground/10 bg-black shadow-2xl shadow-black/60 ring-1 ring-white/5">
        {/* a quiet title bar, so the frame reads as the app rather than a clip */}
        <figcaption className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Friends’ Garage</span>
          <span className="tabular-nums">A real hand, recorded</span>
        </figcaption>
        <div className="relative aspect-[12/11] w-full">
          {reducedMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/amethystani/hero-poster.jpg"
              alt="A hand at the Garage: an ace-high straight wins 78 at showdown"
              width={1200}
              height={1100}
              fetchPriority="high"
              className="size-full object-cover"
            />
          ) : (
            <video
              className="size-full object-cover"
              poster="/amethystani/hero-poster.jpg"
              width={1200}
              height={1100}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Gameplay: an ace-high straight wins at showdown at the Garage"
            >
              <source src="/amethystani/hero.webm" type="video/webm" />
              <source src="/amethystani/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </figure>
    </div>
  )
}
