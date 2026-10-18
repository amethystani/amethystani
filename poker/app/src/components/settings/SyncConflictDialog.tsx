'use client'

// The one moment sync is allowed to interrupt: both devices played offline and
// they now disagree about the Roll. Adding them invents chips, taking the max
// rewards keeping a losing session unsynced, and taking the latest write
// silently destroys a good night. So we ask, plainly, and only here.
//
// Everything additive (awards, purchases, peak Roll, venue and cast records)
// has already merged in the player's favour by the time this renders, whichever
// button they press. See lib/sync/merge.

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSync } from '@/store/sync'
import { useMoney } from '@/lib/useMoney'
import { sound } from '@/lib/sound'

export function SyncConflictDialog() {
  const conflict = useSync((s) => s.conflict)
  const resolveConflict = useSync((s) => s.resolveConflict)
  const money = useMoney()

  return (
    <Dialog open={Boolean(conflict)}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Two devices, two Rolls</DialogTitle>
          <DialogDescription>
            You played on another device since this one last synced. Pick which Roll to keep.
            Awards, purchases and records from both are kept either way.
          </DialogDescription>
        </DialogHeader>

        {conflict && (
          <div className="flex flex-col gap-2 pt-1">
            {/* The side with more hands behind it goes first. The first button
                is the one a hurried thumb finds, and a profile reset while
                signed out used to put "Keep this device's" 0 hands there, over
                the account's real Roll. */}
            {(conflict.remote.handsPlayed >= conflict.local.handsPlayed
              ? (['remote', 'local'] as const)
              : (['local', 'remote'] as const)
            ).map((side) => (
              <Choice
                key={side}
                label={side === 'local' ? "Keep this device's" : "Use the account's"}
                roll={money(conflict[side].roll)}
                hands={conflict[side].handsPlayed}
                onPick={() => {
                  sound.play('call')
                  void resolveConflict(side)
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Choice({
  label,
  roll,
  hands,
  onPick,
}: {
  label: string
  roll: string
  hands: number
  onPick: () => void
}) {
  return (
    <button
      onClick={onPick}
      className="flex items-center justify-between gap-3 rounded-xl bg-foreground/[0.06] px-4 py-3 text-left transition hover:bg-foreground/[0.12]"
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-right">
        <span className="block text-base font-semibold tabular-nums">{roll}</span>
        <span className="block text-xs tabular-nums text-muted-foreground">
          {hands.toLocaleString()} hands
        </span>
      </span>
    </button>
  )
}
