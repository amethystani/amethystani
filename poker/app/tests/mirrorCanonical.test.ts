import test from 'ava'
import { canonicalLink, pageFor, serveContentPage } from '../functions/_shared'

// The /blog and /learn [slug] functions match the Markdown mirrors too, since
// /blog/x.md is just a slug of "x.md". They used to answer it like a page and
// advertise a /blog/x.md.md alternate, a 404 Google followed. And no mirror
// said which page it copied, so forty full-text duplicates sat in Search
// Console as "crawled, currently not indexed".

function ctx(path: string, accept = 'text/html') {
  return {
    request: new Request(`https://amethystani.github.io${path}`, {
      headers: { accept },
    }),
    env: {
      ASSETS: {
        fetch: async (input: Request | string) => {
          const url = new URL(typeof input === 'string' ? input : input.url)
          return url.pathname.endsWith('.md.md')
            ? new Response('not found', { status: 404 })
            : new Response(`body of ${url.pathname}`, { status: 200 })
        },
      },
    },
  }
}

test('a mirror maps back to the page it copies', (t) => {
  t.is(
    pageFor('/blog/pip-is-live.md'),
    'https://amethystani.github.io/amethystani/blog/pip-is-live',
  )
  t.is(pageFor('/learn/pot-odds.md'), 'https://amethystani.github.io/amethystani/learn/pot-odds')
  t.is(pageFor('/index.md'), 'https://amethystani.github.io/amethystani')
  t.is(
    canonicalLink('/credits.md'),
    '<https://amethystani.github.io/amethystani/credits>; rel="canonical"',
  )
})

test('a mirror is served as itself, canonical to its page, with no .md.md alternate', async (t) => {
  const res = await serveContentPage(ctx('/blog/pip-is-live.md'))
  const link = res.headers.get('link') ?? ''
  t.is(res.status, 200)
  t.is(await res.text(), 'body of /blog/pip-is-live.md')
  t.is(res.headers.get('content-type'), 'text/markdown; charset=utf-8')
  t.true(
    link.includes('<https://amethystani.github.io/amethystani/blog/pip-is-live>; rel="canonical"'),
  )
  t.false(link.includes('.md.md'))
})

test('the page itself still advertises its mirror and claims no canonical by header', async (t) => {
  const res = await serveContentPage(ctx('/blog/pip-is-live'))
  const link = res.headers.get('link') ?? ''
  t.true(link.includes('</blog/pip-is-live.md>; rel="alternate"'))
  t.false(link.includes('rel="canonical"'))
})

test('a canonical already set by _headers is not added twice', async (t) => {
  const page = '<https://amethystani.github.io/amethystani/blog/pip-is-live>; rel="canonical"'
  const res = await serveContentPage({
    request: new Request('https://amethystani.github.io/blog/pip-is-live.md'),
    env: { ASSETS: { fetch: async () => new Response('md', { headers: { link: page } }) } },
  })
  t.is((res.headers.get('link') ?? '').split('rel="canonical"').length - 1, 1)
})
