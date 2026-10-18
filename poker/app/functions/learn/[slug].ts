import { serveContentPage } from '../_shared'

// The written guides only. /learn itself is the interactive tour — app, not
// content — so it has no Markdown mirror and deliberately gets no function.

export const onRequestGet = serveContentPage
export const onRequestHead = serveContentPage
