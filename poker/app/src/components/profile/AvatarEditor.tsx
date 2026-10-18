'use client'

import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import {
  AVATAR_BG_SWATCH_NAMES,
  AVATAR_BG_SWATCHES,
  freshSeed,
  type AvatarSpec,
} from '@/lib/avatar'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

/** Controlled avatar + name editor, shared by onboarding and the profile dialog. */
export function AvatarEditor({
  spec,
  name,
  onSpecChange,
  onNameChange,
  onSubmit,
  avatarSize = 132,
  compact = false,
}: {
  spec: AvatarSpec
  name: string
  onSpecChange: (spec: AvatarSpec) => void
  onNameChange: (name: string) => void
  onSubmit?: () => void
  avatarSize?: number
  /**
   * Tighter rhythm for the profile dialog, which has a viewport to fit inside
   * and three more blocks under it. Onboarding owns a whole screen and keeps
   * the roomy default. Same elements either way, only the spacing changes.
   */
  compact?: boolean
}) {
  const shuffle = () => {
    sound.play('tap')
    onSpecChange({ ...spec, seed: freshSeed() })
  }

  return (
    <div className={cn('flex flex-col items-center', compact ? 'gap-4' : 'gap-6')}>
      <motion.div
        key={spec.seed}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <PlayerAvatar spec={spec} size={avatarSize} />
      </motion.div>

      <button
        type="button"
        onClick={shuffle}
        className={cn(
          'flex items-center gap-2 rounded-full bg-foreground/5 px-4 text-sm font-medium text-foreground transition hover:bg-foreground/10 active:scale-95',
          compact ? 'py-1.5' : 'py-2',
        )}
      >
        <Shuffle className="size-4" /> Shuffle
      </button>

      <div className="flex gap-2">
        {AVATAR_BG_SWATCHES.map((swatch) => {
          const isSelected = spec.backgroundColor === swatch

          return (
            <button
              key={swatch}
              type="button"
              onClick={() => {
                sound.play('tap')
                onSpecChange({ ...spec, backgroundColor: swatch })
              }}
              aria-label={AVATAR_BG_SWATCH_NAMES[swatch]}
              aria-pressed={isSelected}
              className={cn(
                'size-7 rounded-full ring-2 ring-transparent transition',
                isSelected && 'ring-foreground/70',
              )}
              style={{ backgroundColor: `#${swatch}` }}
            />
          )
        })}
      </div>

      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value.slice(0, 16))}
        placeholder="Your name"
        className={cn(
          'w-full rounded-2xl border border-foreground/10 bg-foreground/5 px-4 text-center outline-none transition focus:border-foreground/30',
          compact ? 'py-2.5 text-base' : 'py-3 text-lg',
        )}
        onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSubmit?.()}
      />
    </div>
  )
}
