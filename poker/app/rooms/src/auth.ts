// Who is on the other end of a socket, and whether they are a member.
//
// **The membership is read here, on the server, from the table no client can
// write.** In the browser `useEntitlement()` is a UX affordance: the worst a
// forged one gets you is a screen you did not pay for. A table costs us money
// to run and seats other people, so the gate that counts is this one. It reads
// the same `memberships` row with the service role and decides it with the
// same pure function the client uses (`readEntitlement`).

import { readEntitlement, type MembershipRow } from '@/lib/membership/entitlement'
import type { Env } from './env'

/**
 * The account id behind a Supabase access token, or null.
 *
 * Asked of Supabase itself (`/auth/v1/user`), the same check the Edge
 * Functions make, so an expired or revoked session is refused. Once per
 * socket, never per message.
 */
export async function identify(token: string, env: Env): Promise<string | null> {
  if (env.DEV_AUTH === '1' && token.startsWith('dev:')) {
    const id = token.split(':')[1]
    return id && /^[\w-]{1,40}$/.test(id) ? `dev-${id}` : null
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const user = (await res.json()) as { id?: unknown }
  return typeof user.id === 'string' ? user.id : null
}

export async function isMember(userId: string, token: string, env: Env): Promise<boolean> {
  if (env.DEV_AUTH === '1' && userId.startsWith('dev-')) return token.endsWith(':member')
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return false
  const url = `${env.SUPABASE_URL}/rest/v1/memberships?user_id=eq.${encodeURIComponent(userId)}&select=user_id,status,current_period_end,cancel_at_period_end,source`
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  // Either kind of Supabase key works. The legacy service_role key is a JWT and
  // goes in both headers; a newer `sb_secret_…` key is not a JWT, goes in
  // `apikey` alone, and is refused as a Bearer token.
  const res = await fetch(url, {
    headers: key.startsWith('eyJ')
      ? { apikey: key, Authorization: `Bearer ${key}` }
      : { apikey: key },
  })
  if (!res.ok) return false
  const rows = (await res.json()) as MembershipRow[]
  // Read as the client reads a row fresh from the server: the webhook keeps it
  // current, so the status decides.
  return readEntitlement(rows[0] ?? null, { now: Date.now(), trusted: true }).member
}
