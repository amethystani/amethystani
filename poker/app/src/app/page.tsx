// The profile site opens straight into a playable table. The full game remains
// available from the table controls; no marketing page or lobby interrupts the
// first hand.
import type { Metadata } from 'next'
import { PlayClient } from './play/[venue]/PlayClient'
import { contentAlternates } from '@/config/site'

export const metadata: Metadata = {
  alternates: contentAlternates(''),
}

export default function Page() {
  return <PlayClient />
}
