'use client'

// Where the password-reset email lands. Supabase puts a recovery token in the
// URL fragment and the client swaps it for a session automatically
// (detectSessionInUrl), so by the time this renders the user is briefly signed
// in and allowed to set a new password.
//
// Static export means this is a plain client page with no server involved. If
// someone opens it without a valid link there is no session, and it says so
// rather than pretending to work.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/sync/client'
import { useSync } from '@/store/sync'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState<'checking' | 'ok' | 'no-session'>('checking')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const { busy, error, updatePassword } = useSync()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    void getSupabase().then((sb) => {
      if (cancelled) return
      if (!sb) {
        setReady('no-session')
        return
      }
      // The fragment is consumed asynchronously, so wait for the auth event
      // rather than reading the session immediately.
      const { data } = sb.auth.onAuthStateChange((_event, session) => {
        setReady(session ? 'ok' : 'no-session')
      })
      unsubscribe = () => data.subscription.unsubscribe()

      void sb.auth.getSession().then(({ data: s }) => {
        if (cancelled) return
        if (s.session) setReady('ok')
        else setTimeout(() => setReady((r) => (r === 'checking' ? 'no-session' : r)), 2_000)
      })
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Set a new password</h1>

      {ready === 'checking' && <p className="text-sm text-muted-foreground">One moment…</p>}

      {ready === 'no-session' && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          This link has expired or was already used. Ask for a new one from Settings, under Account.
          Your progress on this device is untouched either way.
        </p>
      )}

      {ready === 'ok' && !done && (
        <>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            aria-label="New password"
            className="w-full rounded-xl bg-foreground/[0.04] px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
          />
          <button
            onClick={async () => setDone(await updatePassword(password))}
            disabled={busy || password.length < 8}
            className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
          >
            Save it
          </button>
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          {error && <p className="text-xs text-suit-red">{error}</p>}
        </>
      )}

      {done && (
        <>
          <p className="text-sm text-muted-foreground">Done. You’re signed in.</p>
          <button
            onClick={() => router.push('/game')}
            className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Back to the lobby
          </button>
        </>
      )}
    </main>
  )
}
