'use client'

// What you can do about another person at a private table: see their camera
// big, mute or hide them for yourself, report them, block them, and, for the
// host, remove them.
//
// Muting and hiding are yours alone and nothing is sent. A report goes to us
// with the room and both accounts. A block stops camera and voice between the
// two of you for good, and keeps them out of rooms you host.

import { useState } from 'react'
import { Ban, Eye, EyeOff, Flag, Mic, MicOff, UserX, Video } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ReportReason } from '@/lib/multiplayer/protocol'
import type { SeatView } from '@/lib/multiplayer/view'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { useMedia } from '@/store/media'
import { useRoom } from '@/store/room'

const REASONS: { id: ReportReason; label: string }[] = [
  { id: 'abuse', label: 'Abusive or harassing' },
  { id: 'camera', label: 'Inappropriate on camera' },
  { id: 'cheating', label: 'Cheating or spam' },
  { id: 'other', label: 'Something else' },
]

type Step = 'menu' | 'report' | 'reported' | 'block' | 'blocked'

export function PlayerSheet({
  seat,
  onClose,
  isHost,
  blocked,
  cameraOn,
  micOn,
  onShowCamera,
  removeNote,
}: {
  /** Null: closed. */
  seat: SeatView | null
  onClose: () => void
  isHost: boolean
  blocked: boolean
  cameraOn: boolean
  micOn: boolean
  onShowCamera: () => void
  /** What removing means here: before the deal, or mid-game. */
  removeNote: string
}) {
  // Each time the sheet opens on somebody it starts at the menu, by keying the
  // body on the seat rather than resetting state in an effect.
  return (
    <Dialog open={seat !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        {seat && (
          <Body
            key={seat.id}
            seat={seat}
            onClose={onClose}
            isHost={isHost}
            blocked={blocked}
            cameraOn={cameraOn}
            micOn={micOn}
            onShowCamera={onShowCamera}
            removeNote={removeNote}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function Body({
  seat,
  onClose,
  isHost,
  blocked,
  cameraOn,
  micOn,
  onShowCamera,
  removeNote,
}: {
  seat: SeatView
  onClose: () => void
  isHost: boolean
  blocked: boolean
  cameraOn: boolean
  micOn: boolean
  onShowCamera: () => void
  removeNote: string
}) {
  const [step, setStep] = useState<Step>('menu')
  const muted = useMedia((s) => Boolean(s.muted[seat.id]))
  const hidden = useMedia((s) => Boolean(s.hidden[seat.id]))
  const toggleMute = useMedia((s) => s.toggleMute)
  const toggleHidden = useMedia((s) => s.toggleHidden)
  const report = useRoom((s) => s.report)
  const block = useRoom((s) => s.block)
  const kick = useRoom((s) => s.kick)

  if (step === 'report') {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Report {seat.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {REASONS.map((r) => (
            <Action
              key={r.id}
              onClick={() => {
                sound.play('tap')
                report(seat.id, r.id)
                setStep('reported')
              }}
            >
              {r.label}
            </Action>
          ))}
        </div>
      </>
    )
  }

  if (step === 'reported' || step === 'blocked') {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{step === 'reported' ? 'Thanks for telling us' : 'Blocked'}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {step === 'reported'
            ? `We’ll look at it. You can also block ${seat.name}, so their camera and voice never reach you.`
            : `${seat.name} can’t see or hear you, you can’t see or hear them, and they can’t join rooms you open.`}
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {step === 'reported' && !blocked && (
            <Action tone="danger" onClick={() => setStep('block')}>
              <Ban className="size-4" /> Block {seat.name}
            </Action>
          )}
          <Action onClick={onClose}>Done</Action>
        </div>
      </>
    )
  }

  if (step === 'block') {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Block {seat.name}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          No camera or voice between you, here or at any table again, and they can’t join rooms you
          open. They aren’t told.
        </p>
        <div className="mt-2 flex gap-2">
          <Action onClick={() => setStep('menu')}>Cancel</Action>
          <Action
            tone="danger"
            onClick={() => {
              sound.play('tap')
              block(seat.id)
              setStep('blocked')
            }}
          >
            Block
          </Action>
        </div>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{seat.name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        {cameraOn && !hidden && !blocked && (
          <Action
            onClick={() => {
              onShowCamera()
              onClose()
            }}
          >
            <Video className="size-4" /> Show camera
          </Action>
        )}
        {!blocked && (
          <>
            <Action
              onClick={() => {
                sound.play('tap')
                toggleMute(seat.id)
              }}
              disabled={!micOn && !muted}
            >
              {muted ? <Mic className="size-4" /> : <MicOff className="size-4" />}
              {muted ? 'Unmute' : 'Mute'}
            </Action>
            <Action
              onClick={() => {
                sound.play('tap')
                toggleHidden(seat.id)
              }}
              disabled={!cameraOn && !hidden}
            >
              {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              {hidden ? 'Show their camera' : 'Hide their camera'}
            </Action>
          </>
        )}
        <Action
          onClick={() => {
            sound.play('tap')
            setStep('report')
          }}
        >
          <Flag className="size-4" /> Report
        </Action>
        {blocked ? (
          <p className="py-1 text-center text-sm text-muted-foreground">You’ve blocked them.</p>
        ) : (
          <Action tone="danger" onClick={() => setStep('block')}>
            <Ban className="size-4" /> Block
          </Action>
        )}
        {isHost && (
          <>
            <Action
              tone="danger"
              onClick={() => {
                sound.play('tap')
                kick(seat.id)
                onClose()
              }}
            >
              <UserX className="size-4" /> Remove from the table
            </Action>
            <p className="text-center text-2xs text-muted-foreground">{removeNote}</p>
          </>
        )}
      </div>
    </>
  )
}

function Action({
  onClick,
  children,
  tone = 'default',
  disabled = false,
}: {
  onClick: () => void
  children: React.ReactNode
  tone?: 'default' | 'danger'
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground/[0.08] py-3 font-semibold transition hover:bg-foreground/[0.14] disabled:opacity-35',
        tone === 'danger' && 'text-suit-red',
      )}
    >
      {children}
    </button>
  )
}
