# The mock-ups on your landing page are untested claims

17 September 2026

## Four cards, and a comment at the top of the file

Our home page has four feature cards. Each one carries a small picture of something the game produces: the line you copy after playing the Daily, a shared hand’s link, the win percentage that sits at the table, an avatar with a fan of card backs. They are not images. They are components, laid out in the same design system as the real thing and rendered live on the page, which is why they look right.

The file they live in opens with a comment saying that nothing on the page is a mock-up: what you see here is what you get at the table. That sentence was written when it was true. It stayed in the file for four months, during which three of the four cards drifted away from the product, and the test suite was green every day of it.

The one that did not drift is the difference. It maps over the same config the game reads, so there was nothing in it to get wrong. The other three were typed out by hand next to the code that produces the real version.

## One: the share line with the share missing

The Daily card sells the loop. Everyone plays the identical shuffle, so the result line is worth pasting somewhere, and the app appends `playpip.io/daily` to it so whoever reads it can go and play the same deal.

The card drew that line by hand, from before the address existed. So the card whose entire argument is the share loop displayed the version of the line with the loop cut off, for the month after we shipped it. Not a wrong number. The missing part was the part that made it a mechanism.

The fix is one line: call `dailyShareText`, the function the app shares with, with fixed arguments. The card now cannot show a line the app would not produce, because it is not drawing a line, it is asking for one.

## Two: a link that looked like somebody else's database

The second card says a shared hand needs no server and no account, because the whole hand is folded into the URL fragment. It illustrated that with `playpip.io/hand#kQyJ3v…`.

Six characters and an ellipsis. That is a perfectly normal-looking link, which is the problem: it is what a link looks like when it points at a row in somebody’s database. Short opaque token, server on the other end, gone when the company folds. The picture contradicted the claim it was there to support, and it did it in the visual grammar everyone already reads fluently.

A real one is not like that. We encode the hand as JSON and base64url it, so the length is the hand: every action, every board card, every name, every reveal. The hand now on the card is a six-handed pot that reaches showdown, and it is 566 characters of URL.

`the card, at build time`

`playpip.io/hand#eyJ2IjoxLCJuIjo0MiwiYiI6… (566 characters)`

566 characters is not elegant and we are not going to pretend otherwise. It is also the entire point. You can read the hand out of the link with a base64 decoder and no permission from us, and nothing we do later takes a hand away from someone who has the URL. Both numbers in this paragraph are the length of the string in the block above it, because the page computes them at build time. Anything else would be a fourth hand-typed claim in a post about hand-typed claims.

## Three: a phrase the game has never said

The third card shows the ambient equity read: how often you win this hand from here, sitting quietly at the edge of the table. The hand-typed version said `Top pair, good kicker` over `72%`, with `ahead of 4 in 5 hands` underneath.

Three problems, and only the first is the kind you would call a bug.

-   **The game has never emitted that label.** The readout calls `evaluateHand(hole, community).name` and prints whatever comes back, which for ace-king on an ace-high flop is the word `Pair`. Flat, and a bit deflating, and what the product says. Our evaluator also calls a royal flush a [Straight Flush](/blog/pokersolver-undocumented), so this is not the first time its naming has surprised us.
-   **72% and four in five are two answers to one question.** Four in five is 80%. Whichever was right, the box printed a number and then restated it as a different number, eight points away, in the next line.
-   **Neither figure came from a hand.** There was no spot behind the card, so there was nothing either number could be checked against. A percentage nobody can reproduce is decoration in the shape of evidence.

The card now names its spot: ace-king on ace-nine-four, three opponents still in. The label is what `evaluateHand` returns for it. The percentage is 70%, which is where the equity lands (70.20% over 20 runs of 20,000 hands, standard deviation 0.39). The sentence restating it in words is gone, because that sentence was a second claim with nothing under it.

## Why the suite stayed green

We have a lot of tests about claims. One walks every page looking for absolutes about money that a paid tier would falsify, because we shipped two of those and served them for sixteen days. One fails if the list of paid drills drifts from the code. We are, if anything, fussy about this.

Two of them walk this exact file. They read every line of the landing page on every run, and they did it while all three cards were wrong, because what they are looking for is a phrase. A banned form of words about money. A sentence that contradicts the roadmap. Miss the phrase and you catch the claim.

A mock is not a phrase. Nobody was ever going to add `Top pair, good kicker` to a list of sentences we must not write, because until you go and read `evaluateHand` it is not a false sentence, it is a plausible label. The same goes for a short URL: no string in it is wrong. What is wrong is the relationship between it and a function somewhere else, and grep cannot see a relationship.

That is the generalisable bit, and we do not think it is specific to us. If your marketing page draws your product’s output rather than screenshotting it, you have written claims that no amount of looking for bad sentences will find, in a file that survives every rename and refactor because nothing imports it.

## The rule we ended up with

Two ways to draw your own output, and one of them has to be true by construction.

-   **Call the function.** If something real produces the string, the card asks it for the string with fixed arguments. The Daily line and the hand link both do this now. This is the better option and it is usually available.
-   **Or make a test recompute it.** Sometimes calling the function is a bad trade: the equity read would drag the hand evaluator and a Monte-Carlo run into the bundle for one card. So the inputs and the expected numbers sit in a config file, the page renders the constants, and a test runs the real thing against them and fails on a gap of more than a point.

The tests are in `tests/landingMocks.test.ts`. One of them greps the landing page for a typed-out hand link and fails if it finds one, which caught its own author within a minute: we had quoted the old six-character link in a code comment explaining why it was wrong.

There is a fourth card we have not mentioned. It draws a face and three card backs by mapping over the cast and the deck config, which is the same config the game maps over. It has been correct since the day it was written, and nobody has ever had to think about it. That is the whole argument.
