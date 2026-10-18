'use client'

// What is on the cloth between the seats: the board, the bets in front of each
// player, the pot, and the pot sliding to whoever took it.
//
// Shared by the single-player table and the multiplayer room so the two felts
// move identically. Like everything in this folder it reads no store: the hand
// and where each seat sits are handed in.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CountUp } from '@/components/CountUp'
import type { CardBackDesign } from '@/config/cardBacks'
import { potSize, type HandState } from '@/lib/poker/engine'
import type { FeltGeometry, SeatPoint } from '@/lib/tableSeats'
import { useMoney } from '@/lib/useMoney'
import { cn } from '@/lib/utils'
import { BoardCard, BoardSlot, ChipStack } from './surface'

export function FeltStage({
  hand,
  handIndex,
  geometry: g,
  seatPoint,
  betPoint,
  back,
  compact,
  potWinners,
}: {
  hand: HandState
  /** Keys the animations, so a new hand never inherits the last one's chips. */
  handIndex: number
  geometry: FeltGeometry
  seatPoint: (id: string) => SeatPoint
  betPoint: (id: string) => SeatPoint
  back: CardBackDesign
  compact: boolean
  /** Who the pot slides to, once the hand is settled. */
  potWinners: string[]
}) {
  const money = useMoney()
  const calm = useReducedMotion() === true
  const pot = potSize(hand)
  // Chips are counted in small blinds, so a stack reads the same at any stake.
  const unit = hand.smallBlind
  const inFront = hand.players.reduce((sum, p) => sum + p.committedThisStreet, 0)
  // What has already gone into the middle. The rest is still in front of seats.
  const collected = pot - inFront
  const settled = hand.result !== null
  const spring = calm ? { duration: 0 } : ({ type: 'spring', stiffness: 260, damping: 28 } as const)

  return (
    <>
      {/* **Five-Card Draw has no board, so it gets no board places.** At a draw
          table nothing is ever coming, and drawing places for it promised a
          flop that never arrives. Every other game gets five outlined places on
          the cloth, which fill as the cards are dealt. */}
      {hand.variant !== 'draw' && (
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.25vw] sm:gap-2 lg:gap-2.5"
          style={g.board}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const card = hand.community[i]
            return card ? (
              <BoardCard key={`${card.rank}${card.suit}`} index={i} card={card} back={back} />
            ) : (
              <BoardSlot key={`slot-${i}`} />
            )
          })}
        </div>
      )}

      {/* The pot: the chips already in the middle, and the number. At the end
          of a hand the stack goes to whoever took it (below), so it leaves. */}
      <div
        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
        style={g.pot}
      >
        <div className="flex w-[22px] justify-center">
          <AnimatePresence>
            {collected > 0 && !settled && (
              <motion.div
                key={`pot-${handIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: calm ? 0 : 0.4 } }}
              >
                <ChipStack amount={collected} unit={unit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-baseline gap-2 rounded-full bg-table-shade/45 px-3 py-0.5">
          <span className="text-2xs uppercase tracking-[0.2em] text-muted-foreground">Pot</span>
          <CountUp
            value={pot}
            format={money}
            className={cn('font-semibold tabular-nums', compact ? 'text-lg' : 'text-2xl')}
          />
        </div>
        {/* Balances the stack on the left, so the number sits on the centre line. */}
        <div className="w-[22px]" aria-hidden />
      </div>

      {/* Bets in front of each seat. Keyed by the street, so when the street
          moves on each stack leaves for the middle rather than lingering. */}
      <AnimatePresence>
        {!settled &&
          hand.players
            .filter((p) => p.committedThisStreet > 0)
            .map((p) => {
              const from = seatPoint(p.id)
              const at = betPoint(p.id)
              return (
                <motion.div
                  key={`${handIndex}-${hand.street}-${p.id}`}
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  initial={{ left: from.left, top: from.top, opacity: 0 }}
                  animate={{ left: at.left, top: at.top, opacity: 1 }}
                  exit={{
                    left: g.pot.left,
                    top: g.pot.top,
                    opacity: 0,
                    transition: calm
                      ? { duration: 0 }
                      : {
                          duration: 0.42,
                          ease: [0.4, 0, 0.2, 1],
                          opacity: { duration: 0.12, delay: 0.32 },
                        },
                  }}
                  transition={spring}
                >
                  <ChipStack
                    amount={p.committedThisStreet}
                    unit={unit}
                    label={money(p.committedThisStreet)}
                  />
                </motion.div>
              )
            })}
      </AnimatePresence>

      {/* Showdown: the pot slides to the winner (or splits between them). */}
      {settled &&
        potWinners.map((id) => {
          const to = seatPoint(id)
          return (
            <motion.div
              key={`win-${handIndex}-${id}`}
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
              initial={{ left: g.pot.left, top: g.pot.top, opacity: 0 }}
              animate={{ left: to.left, top: to.top, opacity: [0, 1, 1, 0] }}
              transition={
                calm
                  ? { duration: 0 }
                  : {
                      left: { duration: 0.75, delay: 0.5, ease: [0.3, 0, 0.2, 1] },
                      top: { duration: 0.75, delay: 0.5, ease: [0.3, 0, 0.2, 1] },
                      opacity: { duration: 1.4, delay: 0.35, times: [0, 0.1, 0.8, 1] },
                    }
              }
            >
              <ChipStack amount={hand.result?.payouts[id] ?? pot} unit={unit} />
            </motion.div>
          )
        })}
    </>
  )
}
