'use client'

import { Suspense } from 'react'
import { RoomScreen } from '@/components/room/RoomScreen'
import { Splash } from '@/components/Splash'
import { useHydrated } from '@/lib/useHydrated'

// `/game/room?code=…`: one multiplayer table. The code is a query parameter
// because the site is a static export (see RoomScreen).
export default function Page() {
  const hydrated = useHydrated()
  if (!hydrated) return <Splash />
  return (
    <Suspense fallback={<Splash />}>
      <RoomScreen />
    </Suspense>
  )
}
