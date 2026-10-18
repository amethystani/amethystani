import { readdirSync } from 'node:fs'
import test from 'ava'
import { BLOG_POSTS, formatPostDate } from '@/config/blog'

test('every post has a valid slug, ISO date, and non-empty copy', (t) => {
  for (const post of BLOG_POSTS) {
    t.regex(post.slug, /^[a-z0-9-]+$/, `slug: ${post.slug}`)
    t.regex(post.date, /^\d{4}-\d{2}-\d{2}$/, `date: ${post.date}`)
    t.true(post.title.length > 0)
    t.true(post.description.length > 0)
  }
})

test('slugs are unique and the registry is newest-first', (t) => {
  const slugs = BLOG_POSTS.map((p) => p.slug)
  t.is(new Set(slugs).size, slugs.length)
  const dates = BLOG_POSTS.map((p) => p.date)
  const sorted = [...dates].sort().reverse()
  t.deepEqual(dates, sorted)
})

test('every registry entry has a matching page folder, and vice versa', (t) => {
  const folders = readdirSync(new URL('../src/app/blog', import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  const slugs = BLOG_POSTS.map((p) => p.slug).sort()
  t.deepEqual(folders, slugs)
})

test('formatPostDate renders a fixed, human date', (t) => {
  t.is(formatPostDate('2026-07-25'), '25 July 2026')
  t.is(formatPostDate('2026-01-01'), '1 January 2026')
  t.is(formatPostDate('2027-12-31'), '31 December 2027')
})
