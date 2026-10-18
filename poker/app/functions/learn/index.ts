import { serveContentPage } from '../_shared'

// The Learn hub. It became a prose index on 2026-08-05, when the interactive
// tour moved to /tutorial — which stays app, not content, and has no function.

export const onRequestGet = serveContentPage
export const onRequestHead = serveContentPage
