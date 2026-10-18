# Verify today’s deal yourself

20 August 2026

## The short version

Everyone who plays the Daily on a given day gets the same shuffle, in the same order, on the same cards. That is not a promise about our integrity. It is a fact about a function, and you can check it without asking us and without reading our code.

Below is the whole chain from the date to the deck, in six steps, then a snippet that runs anywhere JavaScript runs. Then the answer for 20 August 2026, so there is something to compare against when you run it.

## From the date to the deck

-   The day key is the UTC date written as `2026-08-20`.
-   The day’s seed is [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) over that string, kept as a 32-bit unsigned integer.
-   Hand number N gets its own seed: `(daySeed XOR imul(N, 0x9e3779b9)) >>> 0`, counting the first hand as 1. That is why refreshing the page mid-tournament re-deals the hand you were on rather than a new one.
-   The generator is [mulberry32](https://github.com/bryc/code/blob/master/jshash/PRNGs.md) over that seed. Small, ordinary, not ours.
-   The deck starts in order: ranks 2 through A, and within each rank the suits go clubs, diamonds, hearts, spades. So `2c 2d 2h 2s 3c` and on.
-   The shuffle is one pass of Fisher-Yates from the top down: for i from 51 to 1, swap position i with `floor(rng() * (i + 1))`.

None of those steps is clever, and that is the point. There is nothing in there for a house edge to hide in, because there is no house and nowhere to hide it.

## The snippet

Paste this into a browser console, or into `node`, or into anything else that runs JavaScript. It imports nothing and it does not talk to us.

```
const dateKey = '2026-08-20' // any UTC date, including today's

const fnv1a = (s) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// The day's seed, then the first hand's.
const daySeed = fnv1a(dateKey)
const handSeed = (daySeed ^ Math.imul(1, 0x9e3779b9)) >>> 0

// A fresh deck in rank order, then one pass of Fisher-Yates down from the top.
const rng = mulberry32(handSeed)
const deck = []
for (const rank of '23456789TJQKA') for (const suit of 'cdhs') deck.push(rank + suit)
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1))
  ;[deck[i], deck[j]] = [deck[j], deck[i]]
}

console.log(deck.join(' '))
```

## What it should print

For 20 August 2026, which was Daily #36, the day seed is `3506893447`, the first hand’s seed is `1328646974`, and the first 9 cards off the top are:

`8c 7d 9c Tc 5d 6s Ah 6h 5s`

All 52, in dealt order:

```
8c 7d 9c Tc 5d 6s Ah 6h 5s 9s Kc Ks 8d Qh 5c 3d 9h 2c Ts 9d Qs As Kd 7s 2d 2h Td Kh 6d 4d 3c 4h Ad Jc 4s 4c Jh 2s 3h Qd 5h Ac Th 8h Js Qc 7c 6c 7h Jd 3s 8s
```

Change the date at the top of the snippet and you get any other day, including the one you are reading this on. The date is the only input.

## What this proves, and what it does not

-   It proves the deck was fixed before anyone sat down. The date decides it, so we could not have dealt you a worse one for playing well, and we could not have dealt ourselves a better one either.
-   It gives you the deck, not your hand. Which cards reach which seat depends on the seat order and where the button is, and the snippet models neither. Claim the deck; do not claim the hole cards.
-   Only the Daily works this way. An ordinary hand at any other table uses your browser’s own randomness, with no seed, no server and nothing of ours involved. There is nothing to reproduce there, and we have said the opposite by accident before, so: not every hand, just the Daily.
-   It says nothing about whether the opponents play well. That is a separate argument and the code for it is [also public](https://github.com/playpip/pip-web/tree/main/src/lib/poker).

## Why we wrote it down

Every crypto casino has a page headed Provably Fair, and most of them are a badge with a paragraph under it about commitment to trust. We would rather hand over the arithmetic and let you go and check. It takes about a minute and it does not require believing us about anything.

The code was already public, in [`src/lib/daily.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/daily.ts), one small file, and the numbers on this page are re-derived from it on every build by [`tests/dailyProof.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/dailyProof.test.ts), so this post is less a disclosure than a shortcut past reading it. Today’s deal is at [playpip.io](https://playpip.io/game), and it is the same one everybody else got.
