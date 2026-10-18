import test from 'ava'
import { BANDS } from '@/lib/deepCoach'
import { COACHING_SAMPLE, coachingSample } from '@/lib/membership/coachingSample'

// The report on `/membership?for=coaching`. The counts are typed, so this holds
// them to two things: that they are a profile the game store could have kept,
// and that `deepRead` tells the story the page is there to show. If the report
// ever changes its mind about this player, the build fails rather than the
// page showing a read nobody checked.
//
// What this cannot cover: how the card sits under the blurb on a phone. That
// needs somebody to open the page.

test('the streets add up to the calls and folds, the way the game store counts them', (t) => {
  const review = COACHING_SAMPLE.reviewStats!
  const streets = Object.values(review.byStreet)
  for (const field of ['priced', 'right', 'close'] as const) {
    const byStreet = streets.reduce((sum, s) => sum + (s[field] ?? 0), 0)
    t.is(byStreet, (review.calls[field] ?? 0) + (review.folds[field] ?? 0), field)
  }
  const lost = streets.reduce((sum, s) => sum + s.bbLost, 0)
  t.is(Math.round(lost * 10), Math.round((review.calls.bbLost + review.folds.bbLost) * 10))
  for (const s of [...streets, review.calls, review.folds]) {
    t.true(s.right + (s.close ?? 0) <= s.priced)
  }
})

test('the hand counts agree with each other', (t) => {
  const { tendencies, stats, reviewStats } = COACHING_SAMPLE
  t.is(tendencies.handsDealt, stats.handsPlayed)
  t.is(reviewStats!.hands, tendencies.handsDealt)
  t.true(stats.showdownsWon <= tendencies.showdowns)
  t.true(tendencies.foldsToBet <= tendencies.betsFaced)
  t.true(tendencies.vpipHands <= tendencies.handsDealt)
})

test('the report opens, with a cost and every street over its minimum', (t) => {
  const read = coachingSample()
  t.is(read.waitingFor, null)
  t.truthy(read.cost)
  t.is(read.streets.length, 4)
})

test('the money leaves on the river, by calling', (t) => {
  const read = coachingSample()
  t.is(read.streets[0].street, 'river')
  const ids = read.leaks.map((l) => l.id)
  t.true(ids.includes('leaky-river'))
  t.true(ids.includes('costly-calls'))
  t.true(ids.includes('paying-off'))
})

test('the leak the page draws sits outside its band, and the other three are strengths', (t) => {
  const read = coachingSample()
  const drawn = read.leaks.find((l) => l.metric)
  t.is(drawn?.id, 'paying-off')
  t.true(drawn!.metric!.value < BANDS.showdown.band[0])
  t.deepEqual(read.strengths.map((s) => s.id).sort(), ['aggression', 'discipline', 'selection'])
})
