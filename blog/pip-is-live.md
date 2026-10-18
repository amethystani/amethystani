# Pip is live, and it’s open source

25 July 2026

## Since this was written (corrected 19 August 2026)

This post says “no accounts”. Pip has one now: optional, free, added on 3 August, and there to carry your progress to a second device. It is off unless you turn it on and nothing in the game asks for it, so _no account needed_ still describes the way in. “No accounts” stopped being true after nine days. The sentence below is left as it shipped, because the date on this post is part of what it says.

What we store, and what we do not, is in [Two devices, two chip counts](https://amethystani.github.io/amethystani/blog/two-devices-two-chip-counts/).

## The short version

Pip is single-player Texas Hold’em in the browser: real poker, against AI opponents with faces and personalities, at a table that doesn’t want anything from you. No accounts, no ads, no real money. It’s live at [playpip.io](https://amethystani.github.io/amethystani/), and the whole codebase is open source.

## Why it exists

Every free poker app we tried felt like a casino with the money filed off. Chip packs on a timer, spinning wheels, a shop between you and the table. The poker itself was an afterthought. We wanted the opposite: a calm table, the real rules, opponents worth reading, and nothing that’s trying to pull your wallet out of your pocket. That app didn’t seem to exist, so we built it.

The house style is play money only, cosmetics that never touch gameplay, and no dark patterns of any kind. If that sounds like marketing, the nice thing about open source is you can check.

## Open, on purpose

The code is MIT-licensed on [GitHub](https://github.com/playpip/pip-web). The poker engine is a pure, deterministic TypeScript module: give it the same seed and it deals the same hand, every time. That is what makes the Daily Deal checkable, since its seed comes from the date and everyone in the world plays the identical shuffle. An ordinary hand uses your browser’s own randomness, with no server in the loop to tilt it either way. Both cases come down to the same thing — you can read exactly how the cards come out.

It’s already more than one person’s project: three contributors landed merged pull requests in the first days, and their names ship on the [credits page](https://amethystani.github.io/amethystani/credits/). If you’d like yours there too, the repo keeps a shelf of [good first issues](https://github.com/playpip/pip-web/labels/good%20first%20issue) stocked.

## What's next

The direction lives in the open in the [roadmap](https://github.com/playpip/pip-web/blob/main/ROADMAP.md): more table life, a stronger path for new players, and deeper AI play. If something feels off, or a hand plays out strangely, [open an issue](https://github.com/playpip/pip-web/issues) — every hand in Pip has a shareable permalink that replays it step by step, which makes a bug report unusually easy to believe.
