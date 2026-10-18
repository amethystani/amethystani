import test from 'ava'
import { RANKS, nextRank, rankFor, rankIndex, rankProgress } from '@/config/ranks'

test('a rank is held from its threshold up to the next one', (t) => {
  t.is(rankFor(0).name, 'Amateur')
  t.is(rankFor(999).name, 'Amateur')
  t.is(rankFor(1_000).name, 'Regular')
  t.is(rankFor(9_999).name, 'Regular')
  t.is(rankFor(10_000).name, 'Shark')
  t.is(rankFor(100_000).name, 'Pro')
  t.is(rankFor(1_000_000).name, 'Legend')
  t.is(rankFor(50_000_000).name, 'Legend')
})

test('the ladder runs out at the top', (t) => {
  t.is(nextRank(0)?.name, 'Regular')
  t.is(nextRank(1_000)?.name, 'Shark')
  t.is(nextRank(100_000)?.name, 'Legend')
  t.is(nextRank(1_000_000), null)
  t.is(rankIndex(0), 0)
  t.is(rankIndex(1_000_000), RANKS.length - 1)
})

test('progress fills evenly per rung and clamps at both ends', (t) => {
  const step = 1 / (RANKS.length - 1)
  t.is(rankProgress(0), 0)
  t.is(rankProgress(1_000), step)
  t.is(rankProgress(10_000), step * 2)
  t.is(rankProgress(1_000_000), 1)
  t.is(rankProgress(9_000_000), 1)
  // Halfway between Regular (1k) and Shark (10k) is halfway along that rung.
  t.is(rankProgress(5_500), step * 1.5)
})

test('progress never leaves 0..1, even on nonsense input', (t) => {
  for (const peak of [-1, -1_000_000, 0, 1, 12_345, Number.MAX_SAFE_INTEGER]) {
    const p = rankProgress(peak)
    t.true(p >= 0 && p <= 1, `progress for ${peak} was ${p}`)
  }
})
