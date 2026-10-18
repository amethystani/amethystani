'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { sound } from '@/lib/sound'
import { useHydrated } from '@/lib/useHydrated'
import { useMoney } from '@/lib/useMoney'
import { cn } from '@/lib/utils'
import { useProfile } from '@/store/profile'

/**
 * The primary CTA. Reads the local profile (hydration-gated) so returning
 * players see “Continue” with their Roll, while newcomers see “Play free.”
 */
export function PlayButton({ size = 'lg', className }: { size?: 'sm' | 'lg'; className?: string }) {
  const hydrated = useHydrated()
  const created = useProfile((s) => s.created)
  const roll = useProfile((s) => s.roll)
  const money = useMoney()

  const returning = hydrated && created
  const label = returning ? 'Continue' : 'Play free'

  if (size === 'sm') {
    return (
      <Link
        href="/game"
        onClick={() => sound.play('tap')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.97]',
          className,
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href="/game"
      onClick={() => sound.play('call')}
      className={cn(
        'group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]',
        className,
      )}
    >
      {label}
      {returning && (
        <span className="tabular-nums text-primary-foreground/60">· {money(roll)} chips</span>
      )}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </Link>
  )
}
