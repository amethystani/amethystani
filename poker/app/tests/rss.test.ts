import test from 'ava'
import { BLOG_POSTS, buildRssXml } from '@/config/blog'

test('the feed is RSS 2.0 with a single channel and the blog metadata', (t) => {
  const xml = buildRssXml(BLOG_POSTS)
  t.true(
    xml.startsWith(
      '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    ),
  )
  t.true(xml.endsWith('</channel>\n</rss>\n'))
  t.is(xml.match(/<channel>/g)?.length, 1)
  t.true(xml.includes('<title>Blog · Pip</title>'))
  t.true(xml.includes('<link>https://amethystani.github.io/amethystani/blog</link>'))
  t.true(
    xml.includes(
      '<atom:link href="https://amethystani.github.io/amethystani/rss.xml" rel="self" type="application/rss+xml" />',
    ),
  )
  t.true(
    xml.includes(
      '<description>Notes from the Pip table — what shipped, what changed, and the occasional hand worth talking about.</description>',
    ),
  )
})

test('one item per registry post, in registry order, with absolute URLs', (t) => {
  const xml = buildRssXml(BLOG_POSTS)
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []
  t.is(items.length, BLOG_POSTS.length)
  items.forEach((item, i) => {
    const post = BLOG_POSTS[i]
    const url = `https://amethystani.github.io/amethystani/blog/${post.slug}`
    t.true(item.includes(`<title>${post.title}</title>`), `title: ${post.slug}`)
    t.true(item.includes(`<link>${url}</link>`), `link: ${post.slug}`)
    t.true(item.includes(`<guid>${url}</guid>`), `guid: ${post.slug}`)
    t.true(item.includes(`<description>${post.description}</description>`), `desc: ${post.slug}`)
  })
})

test('pubDate is RFC-822 GMT, pinned to literals', (t) => {
  const post = (date: string) => ({ slug: 'x', title: 't', description: 'd', date })
  t.true(
    buildRssXml([post('2026-07-25')]).includes('<pubDate>Sat, 25 Jul 2026 00:00:00 GMT</pubDate>'),
  )
  t.true(
    buildRssXml([post('2026-07-26')]).includes('<pubDate>Sun, 26 Jul 2026 00:00:00 GMT</pubDate>'),
  )
  t.true(
    buildRssXml([post('2027-01-01')]).includes('<pubDate>Fri, 01 Jan 2027 00:00:00 GMT</pubDate>'),
  )
})

test('XML entities in titles and descriptions are escaped', (t) => {
  const xml = buildRssXml([
    {
      slug: 'x',
      title: 'A & B <C> "D" \'E\'',
      description: 'fish & chips <tag>',
      date: '2026-07-25',
    },
  ])
  t.true(xml.includes('<title>A &amp; B &lt;C&gt; &quot;D&quot; &apos;E&apos;</title>'))
  t.true(xml.includes('<description>fish &amp; chips &lt;tag&gt;</description>'))
  t.false(xml.includes('A & B'))
})
