# How accurate is a poker equity calculator? We checked ours against an answer we could count

14 September 2026

## The promise nobody checks

Ask any poker calculator what your hand is worth and it will answer to a decimal place. Almost all of them are sampling: dealing the rest of the hand out a few thousand times and counting. That answer is a random variable, and it moves if you ask again.

[Ours](/poker-odds-calculator) is a sampler too. The difference is that it prints what the sample earned: `±0.7 points, from 20,000 hands dealt`, and it drops the tenths digit because a tenth of a point is noise at that width. That is a promise about how often the printed range contains the real answer. It is also a promise we had never tested, which is a strange thing to notice about the page whose entire argument is that we are the honest one.

This is the test.

## You need an answer you can count

Checking a sampler needs something to check it against, and a bigger sample is not it: two estimates that disagree tell you nothing about which one is closer. You need a spot where the true answer can be counted outright.

Texas hold’em has one such shape, and only one a browser can do while you wait. Heads-up with all five community cards out, the only unknown left is the opponent’s two cards, and there are C(45,2) = 990 of them. Deal every one, score every one, and that is not an estimate.

Everything else is out of reach. Heads-up on the turn is 45,540 showdowns. The smallest three-handed enumeration, on the river, is 893,970. Our calculator counts when the count is 5,000 or fewer and samples otherwise, which admits exactly this shape.

`8h 8d on Ac Kd 2s 9h 4c`

`580 wins · 1 tie · 409 losses`  
`equity → 58.6364% over 990 counted showdowns`

Pocket eights on an ace-high board, which nobody would call a strong spot and is worth rather more than it looks. It was picked for being near 58% rather than for being interesting: a proportion’s variance is largest in the middle, so that is where a sampler has the hardest time and an error bar has the most work to do.

## Two questions, and only one of them is the obvious one

The obvious question is whether the band contains the true answer. A 95% band should manage it about 95 times in 100.

The question underneath it is whether the band is the right _width_. A band four times wider than it should be passes the first test every single time, and quietly tells every reader the calculator is a quarter as good as it is. Containment cannot catch that, because being too cautious never looks like a failure.

We measured both. They come out differently, and the second one is the useful one.

## Question one: does the band contain the answer?

100 seeded runs at each sample size, each run asked whether its own band contained the counted answer above.

`100 runs per size, against 58.6364%`

`1,500 hands → 92/100 contained · worst miss 1.22pts`  
`5,000 hands → 94/100 contained · worst miss 0.38pts`  
`20,000 hands → 99/100 contained · worst miss 0.29pts`  

That reads like a trend and it is not one. 100 runs put roughly ±4.3 points on a coverage rate, so 92 and 99 are the same measurement said twice. All three rows say about 95 in 100, and nothing in them says a bigger sample is better covered. Run the sweep on a different spot and the rows move around inside that width, which is what made us stop reading the ordering.

The worst miss is the column worth keeping. When a run did land outside its band, it landed just outside: at 20,000 hands the furthest of 100 was 0.29 points past an interval half a point wide. The failures are near misses rather than a different answer.

## Question two: is the band the right width?

The band is 1.96 standard errors of a proportion, so it is asserting a specific number: that the same spot, run again under a different seed, spreads by band over 1.96. That is directly measurable. Run it 60 times, take the standard deviation, and compare.

`60 seeds per size · measured spread vs the band's claim`

`500 hands → spread 2.26pts vs claimed 2.20pts = 1.03x · bias -0.12pts`  
`1,500 hands → spread 1.41pts vs claimed 1.27pts = 1.11x · bias +0.11pts`  
`5,000 hands → spread 0.73pts vs claimed 0.70pts = 1.05x · bias -0.05pts`  
`20,000 hands → spread 0.32pts vs claimed 0.35pts = 0.92x · bias +0.02pts`  

A perfect band reads 1.00, and four sample sizes spanning forty-fold come out between 0.92 and 1.11. The band is the width it says it is.

It is worth saying what that tolerance is, because it is easy to quote the flattering half. 60 runs pin a standard deviation to about 9%, and that is one standard error rather than an interval. A 95% interval on these ratios is roughly 0.82 to 1.18. Every row sits inside it. The furthest, 1.11 at 1,500 hands, is outside 9% and about 1.1 standard errors out, which is an ordinary result and not a clean one.

The last column is the estimator rather than the band: how far the average of 60 runs sat from the counted answer. It never exceeded 0.13 points in either direction, including at 500 hands, where the printed band is ±4.3 points and therefore 33 times as wide. The sampler is not shading the answer; it is just imprecise, and it says so.

If anything the band is slightly generous, and on purpose. A tie is worth half a pot rather than a whole one, which can only reduce the spread, and we compute the band as though every showdown were won or lost outright. Overstating your own error is the right direction to be wrong in.

## What this does not show

-   **One spot.** Everything above is pocket eights on one board. It is the shape where the answer is countable, which is exactly the shape we do not need a sampler for. The multi-way spots, where sampling is the only option, cannot be checked this way by anyone.
-   **Nothing about speed.** Whether 20,000 hands finish before you lose interest is a different measurement, and it depends on your phone.
-   **Nothing about the evaluator.** This checks the error bar around the answer. If the hand-ranking underneath were wrong, both the count and the sample would be wrong together and this would report a beautifully calibrated band around the wrong number. That is covered elsewhere, and it is why we wrote up [what the library underneath actually does](/blog/pokersolver-undocumented).

## Run it yourself

The sweep is [`scripts/odds-band-coverage.ts`](https://github.com/playpip/pip-web/blob/main/scripts/odds-band-coverage.ts), over the sampler in [`src/lib/poker/equity.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/poker/equity.ts), and the figures above are what `pnpm odds-band-coverage` printed on 14 September 2026. The seeds are fixed, so it prints the same rows on your machine or it has found something.

Re-dealing 2.65M showdowns on every commit is not a sensible thing to put in a test suite, so the published numbers here are a dated measurement rather than a continuously checked one. What does run on every commit is the part that would have to break first: the count above, all 990 showdowns of it, which is instant, and the arithmetic every band in the table is derived from, in [`tests/equitySampling.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/equitySampling.test.ts). If the ground truth moves, this post fails the build before it misleads anyone.

None of this makes our calculator more accurate than anyone else’s. The arithmetic is ordinary and the estimator is the one everybody uses. It means the range on the screen is a measurement rather than a decoration, and now there is a number behind that.
