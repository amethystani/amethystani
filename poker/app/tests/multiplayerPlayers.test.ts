import test from 'ava'
import { VENUES } from '@/config/venues'
import { AVATAR_BG_SWATCHES } from '@/lib/avatar'
import { FILL_SWATCHES, botThinkMs, fillPlayers } from '@/lib/multiplayer/players'
import { mulberry32 } from '@/lib/poker/cards'

test('the fill swatches are the avatar swatches', (t) => {
  t.deepEqual([...FILL_SWATCHES], [...AVATAR_BG_SWATCHES])
})

test('fill players are unique, never take a seated name, and play near the stake', (t) => {
  const base = VENUES[1].ai
  for (let seed = 1; seed <= 200; seed++) {
    const taken = ['Sam', 'Will']
    const fill = fillPlayers(5, base, taken, mulberry32(seed))
    t.is(fill.length, 5)
    const names = fill.map((f) => f.name.toLowerCase())
    t.is(new Set(names).size, 5)
    t.false(names.some((n) => taken.map((x) => x.toLowerCase()).includes(n)))
    for (const f of fill) {
      t.true(Math.abs(f.ai.tightness - base.tightness) <= 0.06 + 1e-9)
      t.true(Math.abs(f.ai.aggression - base.aggression) <= 0.06 + 1e-9)
      t.is(f.ai.iterations, base.iterations)
      t.is(f.ai.skill, base.skill)
      t.true(FILL_SWATCHES.includes(f.avatar.backgroundColor as (typeof FILL_SWATCHES)[number]))
    }
  }
})

test('the same seed seats the same strangers', (t) => {
  const base = VENUES[0].ai
  t.deepEqual(fillPlayers(3, base, [], mulberry32(7)), fillPlayers(3, base, [], mulberry32(7)))
})

test('a bot thinks for under a second to two, longer facing a bet', (t) => {
  for (let seed = 0; seed < 500; seed++) {
    const calm = botThinkMs(seed, false, 0)
    t.true(calm >= 600 && calm <= 1_300)
    t.true(botThinkMs(seed, true, 3) > calm)
    t.true(botThinkMs(seed, true, 3) <= 1_900)
  }
})
