'use client'

// One Five-Card Draw hand, under the answer to a tap on The Parlour's padlock.
// The blurb above says the only thing anybody learns all hand is how many
// cards you asked for; this is a hand through the draw and the showdown, with
// the cards each side kept ringed. Read-only, like the Omaha showdown beside
// it: a look at the game, not a hand of it.
//
// Loaded on its own (`next/dynamic` in TappedFor), so the evaluator and the
// cast reach the browser only for somebody who tapped this padlock.

import { Felt, Holding, TalkLine, cardKey } from '@/components/drills/felt'
import { rosterFor } from '@/config/cast'
import { DRAW_TABLES } from '@/config/venues'
import { drawSample } from '@/lib/membership/drawSample'
import type { Card } from '@/lib/poker/cards'

// Fixed, so the page is the same hand for everybody and a reviewer can check
// it. First of the cheaper room's regulars, in cast order.
const hand = drawSample()
const opponent = rosterFor(DRAW_TABLES[0])[0]

const COUNT = ['none', 'one', 'two', 'three', 'four', 'five']

const ringed = (kept: readonly Card[]) => {
  const keys = new Set(kept.map(cardKey))
  return (card: Card) => keys.has(cardKey(card))
}

export function TappedDraw() {
  const { hero, them, winner } = hand
  const asked =
    them.drew === 0
      ? `${opponent.name} stood pat.`
      : `${opponent.name} asked for ${them.drew === 1 ? 'one card' : COUNT[them.drew]}.`
  const outcome =
    winner === 'split'
      ? 'You split it.'
      : winner === 'hero'
        ? `You take it with ${hero.phrase}.`
        : `${opponent.name} takes it with ${them.phrase}.`

  return (
    <figure className="mt-5 rounded-xl border border-foreground/10 bg-background/60 py-4">
      <figcaption className="px-4 text-sm text-muted-foreground">
        One hand at The Parlour.
      </figcaption>
      <div className="mt-3 flex flex-col">
        <Felt
          across={
            <Holding
              label={opponent.name}
              avatar={opponent.avatar}
              detail={them.phrase}
              cards={them.cards}
              glow={ringed(them.kept)}
            />
          }
          board={
            <TalkLine>
              {`${asked} That was all you knew until the cards went over. You kept ${COUNT[hero.kept.length]} and drew ${COUNT[hero.drew]}. ${outcome}`}
            </TalkLine>
          }
          hero={
            <Holding
              label="You"
              detail={hero.phrase}
              cards={hero.cards}
              layout="below"
              glow={ringed(hero.kept)}
            />
          }
        />
      </div>
      <p className="mt-3 px-4 text-sm text-muted-foreground">
        Ringed: the cards each of you kept. The rest came on the draw.
      </p>
    </figure>
  )
}
