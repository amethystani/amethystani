import type { Metadata } from 'next'
import { MarketingFrame } from '@/components/marketing/LegalPage'
import { MemberWelcome } from '@/components/membership/MemberWelcome'

// Where Stripe Checkout lands a new member (by way of /membership?joined=1).
// Back goes to the lobby rather than the history: the entry behind this page is
// Checkout, and a member who has just paid should not be sent to pay again.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: 'Welcome · Pip',
}

export default function MemberWelcomePage() {
  return (
    <MarketingFrame backTo="/game">
      <MemberWelcome />
    </MarketingFrame>
  )
}
