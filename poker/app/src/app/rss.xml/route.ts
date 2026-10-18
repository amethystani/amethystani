import { BLOG_POSTS, buildRssXml } from '@/config/blog'

// Generated at build time into out/rss.xml (the app is a static export).

// Required for the static export — rendered once at build into out/rss.xml.
export const dynamic = 'force-static'

// This Content-Type only applies under `next dev`. The export bakes the body
// to a file and drops the header, so production gets it from public/_headers.
export function GET(): Response {
  return new Response(buildRssXml(BLOG_POSTS), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
