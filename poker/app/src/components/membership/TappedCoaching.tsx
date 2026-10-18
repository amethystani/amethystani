'use client'

// A report, under the answer to a tap on the coaching padlock. The blurb above
// says what the report counts; this is one, read by `deepRead` from a made-up
// player's counts (`coachingSample`), drawn with the report's own pieces: the
// cost, the streets, and the leak with its band.
//
// Loaded on its own (`next/dynamic` in TappedFor), so the report's code
// reaches the browser only for somebody who tapped this padlock.

import { BandMeter } from '@/components/profile/BandMeter'
import { StreetCosts } from '@/components/profile/StreetCosts'
import { coachingSample } from '@/lib/membership/coachingSample'

// Fixed, so the page is the same report for everybody and a reviewer can check it.
const read = coachingSample()
const drawn = read.leaks.find((l) => l.metric)

export function TappedCoaching() {
  return (
    <figure className="mt-5 rounded-xl border border-foreground/10 bg-background/60 px-4 py-4">
      <figcaption className="text-sm text-muted-foreground">
        A report {read.hands} hands in, as its owner reads it. Yours is drawn from your own.
      </figcaption>
      {read.cost && (
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {read.cost.bbPer100.toFixed(1)}
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">
            big blinds per 100 hands, at the calls and folds the pot priced
          </span>
        </p>
      )}
      {read.streets.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">
            The most goes on the <span className="text-suit-red">{read.streets[0].street}</span>.
          </p>
          <StreetCosts streets={read.streets} />
        </div>
      )}
      {drawn && (
        <div className="mt-5 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
          <p className="font-semibold">{drawn.title}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{drawn.finding}</p>
          {drawn.metric && <BandMeter className="mt-4" metric={drawn.metric} />}
          <p className="mt-3 text-sm">{drawn.advice}</p>
        </div>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        The counts are made up. Every line drawn from them is the report's own.
      </p>
    </figure>
  )
}
