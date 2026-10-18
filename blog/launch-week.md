# Launch week: what shipped

25 July 2026

## Since this was written (corrected 19 August 2026)

Below, this post says “there is still no account behind any of it”. That held for nine days. An account arrived on 3 August: optional, free, off by default, and good for exactly one thing, which is carrying a profile to a second device. The QR code described below still works and still needs no account, as promised.

The reasoning, and what gets stored, is in [Two devices, two chip counts](https://amethystani.github.io/amethystani/blog/two-devices-two-chip-counts/).

## The short version

Pip launched on the 23rd. The plan for week one was to fix whatever broke. What actually happened is that strangers turned up with pull requests, so the week shipped more than the plan did: a new card back, four more hand nicknames, a quicker freeroll, and the blog you’re reading now. Posts like this one will appear whenever enough has shipped to be worth saying out loud.

## What day one already had

For anyone arriving via this post rather than the launch: the first version was not a skeleton. Pip shipped with a ladder of venues, from Friends’ Garage up to The Main Event, and a cast of named opponents with their own personalities and long memories of how you play. Every hand gets a permalink that replays it step by step, the Daily Deal gives everyone in the world the same shuffle once a day, and an avatar creator and Chip Shop handle the cosmetics — none of which ever touch gameplay. The whole thing installs as an app and works offline, and there is still no account behind any of it: your profile lives in your browser and moves to another device by QR code when you want it to.

## Three strangers, four pull requests

Awanthi Malawanage added the Lilac card back to the Chip Shop. Mochammad Fadhlan Al-Ghiffari stocked the deck with four established starting-hand nicknames — the Oldsmobile, the Big Lick, Antony and Cleopatra, and Katie — each of which pays a bonus chip when you win with it. Peter Z added test coverage on launch day, then came back two days later and added more.

All three names now ship on the [credits page](https://amethystani.github.io/amethystani/credits/), which is the deal: contribute, and the site remembers. If you’d like your name there too, the shelf of [good first issues](https://github.com/playpip/pip-web/labels/good%20first%20issue) is kept stocked.

## House changes

Friends’ Garage — the table you can always afford — now seats three instead of four, with the prize trimmed to 300 chips to match. Fewer opponents means a shorter tournament, which matters most at the venue you visit when you’re broke. Two first-visit glitches are gone as well: the landing video no longer replays itself, and the reload button now, in fact, reloads.

## Under the hood

The site gained a sitemap and a robots.txt, which it had somehow launched without. Every content page now also mirrors itself as plain markdown — add `.md` to the end of the address — with an index at `/llms.txt`, for readers who prefer their web without the styling. And every pull request now runs the full test gate before merge: the same one we use, because contributors’ code is our code once it lands.

## What's next

The most-requested feature of launch week is coaching: Pip watching how you play and telling you what it noticed. Two different people asked for it on day one, in nearly the same words, so it’s now [issue #18](https://github.com/playpip/pip-web/issues/18) and the conversation about what it should look like is happening there — join in if you have opinions. The rest of the direction lives in the [roadmap](https://github.com/playpip/pip-web/blob/main/ROADMAP.md), in the open, as usual.
