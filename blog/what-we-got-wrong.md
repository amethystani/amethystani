# Everything we have published that was wrong

24 August 2026

## The short version

Pip has been public since 25 July 2026. In that time we have published 9 claims that turned out to be false, and this is all of them: what it said, when it went live, when the fix went live, how we found it, and the test that now fails if it comes back. The longest one served for 20 days and the shortest for a day.

The reason to publish this is not modesty. It is that a page nobody checks has the same errors and no list of them. The figures on [our guides](https://playpip.io/learn) are computed rather than typed, and pinned by tests that run the same engine that deals the cards, and the way you can tell we mean it is that it keeps catching us.

**One of them is still wrong as you read this.** It is first in the list, because burying it would be the joke writing itself.

## /blog/what-we-got-wrong

**It said:** One of them is still wrong as this goes up.

**It was wrong because:** It was not. This post was written on the morning of 24 August, when the row below it was open. The site was republished with its database configuration at 17:44 that afternoon and the post did not go live until 01:03 the next morning, so the page listing our false claims opened with one, seven hours stale. The sentence was typed rather than read off this list, which is the only way it could have been.

**How we caught it:** Checking the live site against the row below, the next morning. The post was the thing doing the checking and it turned out to be the thing that was wrong.

Live from 25 August 2026. **Still live.**

## /blog/august-what-shipped

**It said:** The roadmap says plainly that nothing which ships free gets metered afterwards, and this is the first thing that rule has had to hold.

**It was wrong because:** The first thing that rule had to hold was the seven side tables, and it did not hold them. They shipped free and went behind the membership on 27 September, and the roadmap now promises the core game rather than everything that ships free. The drills the sentence was about are still free.

**How we caught it:** Reading the post against the branch that moved the side tables, before it merged.

Live 27 September 2026 to 2 October 2026. 5 days. The test that fails if it comes back is `tests/corrections.test.ts`.

## /privacy

**It said:** Sync is "off unless you turn it on, in Settings, under Account".

**It was wrong because:** The site was serving a build made without its database configuration, so the app decided at load time that accounts were unavailable and removed every account surface from itself. There was no Account section in Settings to turn anything on with, and nobody could sign in.

This row said 3 August when it went up, on the reasoning that we could not see from outside which earlier builds carried the configuration. We could, and we should have looked before writing a date down: every deployment this repository has ever published keeps a permanent address, and the ones from 9, 14 and 15 August all carry it. What actually happened is narrower, and it now has a name. Two different things were publishing this site: our own deploy, which runs the test suite first and supplies the configuration, and a hosting-side integration nobody had accounted for, which builds every push by itself and does neither. On 23 August our deploy stopped at its security-audit step at 16:51:03, the other one finished at 16:51:57, and its build is the one that served playpip.io for the next day.

**How we caught it:** A check that downloads the JavaScript playpip.io actually serves and reads the configuration out of it. Every test passed and every build was green throughout, and both were telling the truth: the build this repository makes was correct and it was not the one being served.

Live 23 August 2026 to 24 August 2026. One day. **Nothing stops this one coming back.** None. The check that reads the configuration out of a bundle is scripts/assert-sync-config.mjs, and it can only inspect a build made by the deploy it is attached to, which is not the deploy that went wrong. The fix that would actually hold is for one thing to publish this site rather than two, and that is a setting in the hosting account rather than a line in this repository.

## /, /terms, /play-poker-free-no-signup

**It said:** Fully local. Install it, pull the plug, keep playing - your profile never leaves your device.

**It was wrong because:** Optional accounts shipped on 3 August. From that morning the sentence was true only of somebody who had never switched sync on, and it was written in the absolute on the same page that offers to back your progress up to every device, four sections further down.

**How we caught it:** Reading the landing page from top to bottom against the product.

Live 3 August 2026 to 23 August 2026. 20 days. The test that fails if it comes back is `tests/dataClaims.test.ts`.

## /blog/pip-is-live, /blog/launch-week

**It said:** Both posts said Pip has no accounts and nothing behind them.

**It was wrong because:** True on 25 July and false from 3 August. A blog post is a dated record, so these were not rewritten: each now carries a correction note under the title saying what changed and when.

**How we caught it:** Sweeping the blog for the same fact after the three pages above were found. The sweep that found those had only looked at the pages, not the posts.

Live 3 August 2026 to 23 August 2026. 20 days. The test that fails if it comes back is `tests/blogClaims.test.ts`.

## /blog/agent-readable

**It said:** Six content pages serve a plain-text version, and the learn guides are among those that do not.

**It was wrong because:** Six was right on 26 July and wrong from 5 August, when the learn guides got mirrors of their own. By the time anyone read it the count was ten and the guides were the largest set of mirrors on the site, which is the opposite of what the sentence said.

**How we caught it:** The same blog sweep. Counted the directory rather than trusting the sentence.

Live 5 August 2026 to 23 August 2026. 18 days. The test that fails if it comes back is `tests/blogClaims.test.ts`.

## /learn/bet-sizing

**It said:** The two columns move in opposite directions and that is the whole trade.

**It was wrong because:** They climb together. Bet bigger and the price your opponent is getting gets worse and the equity they need goes up: both numbers rise. The trade is real, but it is about who each column costs, not about them pulling apart.

**How we caught it:** Reading the sentence against the table directly beneath it. Every number in that table was correct, and had been all along.

Live 11 August 2026 to 14 August 2026. 3 days. The test that fails if it comes back is `tests/guideClaims.test.ts`.

## /learn/hand-rankings

**It said:** Every hand beats the one below it because it is rarer than the one below it, and that holds exactly, all the way down the list.

**It was wrong because:** It holds on five cards. Deal seven and it breaks in exactly one place, at the bottom: across seven cards, missing every pair is harder than hitting one, so high card is rarer than one pair. The page had a table of seven-card frequencies showing exactly that, immediately below the sentence.

**How we caught it:** Reading the sentence against the table directly beneath it.

Live 5 August 2026 to 14 August 2026. 9 days. The test that fails if it comes back is `tests/guideClaims.test.ts`.

## /learn/starting-hands

**It said:** Being suited is enough to move a hand one band on the chart, which is exactly what it does: KTs is playable from anywhere and KTo waits for the button.

**It was wrong because:** The example moved two bands, not one. On our own chart KTs opens from any seat and KTo is a late-position hand, with the middle band in between. ATs and ATo are the pair that move exactly one, and suitedness is usually rather than always worth a band.

**How we caught it:** Checking the example against the chart on the same page.

Live 9 August 2026 to 10 August 2026. One day. The test that fails if it comes back is `tests/guideClaims.test.ts`.

## Three of these are the same mistake

The bet-sizing row, the rankings row and the suitedness row are one error wearing three hats. In each of them, every number was right. The table under the sentence was correct, the figures in it were computed rather than typed, and the tests covering them all passed. What was wrong was the sentence describing the shape of the table, sitting directly above it.

That is the failure mode we did not design for, and it is worth naming because it is not obvious. A repository can check a number against the thing that produces it. It cannot check a claim about a table, because nothing in the repository disagrees with a claim about a table. Somebody has to read the sentence and then look down.

The fix in each case was to make the shape itself a computed thing: the rankings page now derives the one place the rarity rule breaks rather than asserting it does not, and the bet-sizing page has a test that both columns climb rather than a sentence saying they diverge.

## No test has ever found one of these

Worth being precise about, since the tests are the reassuring part. Not one of the errors above was found by a test. They were found by:

-   reading a sentence against the table printed underneath it, three times
-   reading the landing page top to bottom against what the product now does
-   sweeping the blog for a fact after finding it wrong somewhere else
-   downloading the JavaScript the live site actually serves and reading the configuration out of it
-   reading this post against the live site the morning after publishing it

The tests come after. Their job is that a fixed thing stays fixed, which they are good at and which nothing else does. But a green build tells you the code is right. It does not tell you that what shipped is right, and the account row is the expensive version of that distinction: every test passed, every build was green, every one of those builds had the configuration in it, and the site was serving a different build entirely.

## What this page is promising

That every future one lands here too. The list is generated from a registry the test suite reads, so a row cannot be quietly dropped and a corrected sentence cannot creep back into the site without the build failing. Where a row has no guard behind it, it has to say so in as many words, which is why one of them does.

It is not promising there will not be more. There will be. The interesting number is not 9, it is how long each one lived, and that is the number we are trying to push down.
