// Markdown content negotiation for the content pages — the llms.txt
// companion. Every content page ships a build-time Markdown mirror at
// `<route>.md` (scripts/gen-llms.mjs); a client that asks for markdown
// explicitly (Accept: text/markdown) gets the mirror, browsers keep getting
// HTML because they never send that Accept value. Only the content routes
// have a function (one file per route in this directory) — the game, its
// assets, and everything else stay purely static and never touch a worker.
//
// This module exports no onRequest* handlers, so it creates no route itself.

import { SITE_URL } from '../src/config/site'

interface AssetsBinding {
  fetch(input: Request | string): Promise<Response>
}

interface PageContext {
  request: Request
  env: { ASSETS: AssetsBinding }
}

/** The route's Markdown mirror path, e.g. / -> /index.md, /blog -> /blog.md. */
function mirrorFor(pathname: string): string {
  const path = pathname.replace(/\/+$/, '')
  return path === '' ? '/index.md' : `${path}.md`
}

function discoveryLinks(mirror: string): string[] {
  return ['</llms.txt>; rel="llms-txt"', `<${mirror}>; rel="alternate"; type="text/markdown"`]
}

/**
 * The page a mirror is a copy of, as the absolute URL a canonical must be:
 * /blog/x.md -> https://playpip.io/blog/x, /index.md -> https://playpip.io.
 */
export function pageFor(mirrorPath: string): string {
  const path = mirrorPath.replace(/\.md$/, '')
  return path === '/index' ? SITE_URL : `${SITE_URL}${path}`
}

/**
 * The header that folds a mirror into its page for search engines. Every
 * mirror is a full-text duplicate of an indexable page and is linked from
 * /llms.txt, so without this Google finds forty pages it has to decide
 * against. An HTTP Link canonical is how a non-HTML file says so.
 */
export function canonicalLink(mirrorPath: string): string {
  return `<${pageFor(mirrorPath)}>; rel="canonical"`
}

/**
 * Serve a content page: its Markdown mirror when the client asks for
 * markdown, the static HTML otherwise. Both carry Link headers advertising
 * /llms.txt and the mirror (RFC 8288 agent discovery), and Vary: Accept so
 * caches keep the two representations apart.
 */
export async function serveContentPage(ctx: PageContext): Promise<Response> {
  const url = new URL(ctx.request.url)

  // The [slug] routes match the mirrors too (/blog/x.md is a slug of "x.md").
  // Serve the file as it is, pointed back at its page. Running it through the
  // page path below advertised a /blog/x.md.md alternate, which 404s, and
  // Google followed it.
  if (url.pathname.endsWith('.md')) {
    const asset = await ctx.env.ASSETS.fetch(ctx.request)
    const headers = new Headers(asset.headers)
    if (asset.ok) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8')
      // gen-llms.mjs writes the canonical into _headers, which Pages applies
      // to the asset this function copies; add it only if that is missing.
      if (!(headers.get('Link') ?? '').includes('rel="canonical"')) {
        headers.append('Link', canonicalLink(url.pathname))
      }
      headers.append('Link', '</llms.txt>; rel="llms-txt"')
    }
    return new Response(asset.body, { status: asset.status, headers })
  }

  const mirror = mirrorFor(url.pathname)
  const wantsMarkdown = (ctx.request.headers.get('accept') ?? '').includes('text/markdown')

  if (wantsMarkdown) {
    const asset = await ctx.env.ASSETS.fetch(new URL(mirror, url.origin).toString())
    if (asset.ok) {
      const headers = new Headers(asset.headers)
      headers.set('Content-Type', 'text/markdown; charset=utf-8')
      headers.set('Vary', 'Accept')
      for (const link of discoveryLinks(mirror)) headers.append('Link', link)
      return new Response(asset.body, { status: asset.status, headers })
    }
  }

  const page = await ctx.env.ASSETS.fetch(ctx.request)
  const headers = new Headers(page.headers)
  headers.set('Vary', 'Accept')
  for (const link of discoveryLinks(mirror)) headers.append('Link', link)
  return new Response(page.body, { status: page.status, headers })
}
