# The Daily Deal

One free tournament a day. 5 seats, and everyone who plays gets the same cards. A new deal starts at midnight UTC.

[Play today’s deal](https://amethystani.github.io/amethystani/game/)

The Daily is the tile in the lobby with today’s number on it.

## The rules

| Thing | How it works |
| --- | --- |
| New deal | Every day at midnight UTC. Deal #1 was 16 July 2026. |
| Entry | Free. You never pay from your Roll, and everyone starts with 500 chips. |
| Seats | 5. You and four regulars, the same four for everyone. |
| Tier | Set by your rank. The higher your rank, the harder the regulars play and the more the Daily pays. Everyone at your tier plays the identical game. |
| Blinds | 5/10 to start, going up every 6 hands. |
| Prizes | For 1st, by tier: Amateur 500, Regular 2,000, Shark 10,000, Pro 75,000, Legend 400,000. 2nd gets a quarter of that. Paid onto your Roll. |
| Plays per day | One. Sitting down counts, whether you finish or not. |
| Result | Tap the Daily tile in the lobby after you play to copy a line with your finish. |

## Common questions

### Does it cost anything?

No. Entry is free and there is no real money anywhere in Pip. The chips are play money and are not for sale.

### Do I need an account?

No. A free account keeps your Roll on every device, and you never need one to play.

### Does the Daily count for my streak?

Your streak counts the UTC days in a row you have played a hand anywhere in Pip, and the Daily counts. It is the flame at the top of the lobby. With an account, two devices share one streak, and you can turn on an email for the evenings it is about to end.

### What happens if I close the tab halfway through?

The table is saved. Come back the same day and you pick up on the hand you were on. If you leave the table, today’s Daily is used up.

### Do the opponents play the same way for everyone?

The same four regulars sit down for everyone, and they start from the same seed as the cards. How hard they play is set by your tier, so everyone at your rank faces the same opponents. What they do after that depends on what you do, so two players can finish the same deal very differently.

### Can I look at today’s deck before I play?

Yes. The method is published and the date is the only input. You get the deck in dealt order. Which cards reach which seat depends on the seating and the button, which the deck alone does not tell you.

## Checking the deal

The deck comes from the UTC date and nothing else. The date is hashed into a seed (FNV-1a), each hand mixes in its own number, and a seeded generator (mulberry32) drives one Fisher-Yates shuffle. That is why a refresh re-deals the same hand. Only the Daily is dealt this way; every other table shuffles in your browser.

A snippet you can run and a worked example: [how to verify today’s deal](https://amethystani.github.io/amethystani/blog/verify-todays-deal/).

Free to play, same cards for everyone, one go a day.

[Play today’s deal](https://amethystani.github.io/amethystani/game/)
