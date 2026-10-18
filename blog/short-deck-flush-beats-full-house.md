# Why a flush beats a full house in Short Deck

6 October 2026

## The rule

Short Deck is Hold’em with the deuces, threes, fours and fives taken out. Thirty-six cards are left, and two rules come with them: a flush beats a full house, and the ace can play low under the six, so A-6-7-8-9 is a straight.

The first one sounds like a house rule somebody lost an argument over. It is arithmetic. Poker ranks hands by how hard they are to make, and on a short deck the flush is the harder one.

## Counting them

A full deck deals 2,598,960 different five-card hands. The standard counts are 5,108 flushes and 3,744 full houses, so the flush is the more common hand and ranks below.

A short deck deals 376,992. Of those, 480 are flushes and 1,728 are full houses. Same question, other answer.

We did not look these up. [`tests/shortDeckCounts.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/shortDeckCounts.test.ts) deals every one of the 376,992 through the evaluator that settles Pip’s Short Deck pots, and fails if a count moves. It also checks that on five cards, from a pair upwards, every hand in the order is rarer than the one below it.

## Why the deck does it

A flush needs five cards of one suit. A suit used to have thirteen cards and now has nine, so the ways to pick five from it fall from 1,287 to 126. A full house needs ranks, and every rank left in the deck still has all four of its cards. Stripping the deck costs the full house some company. It costs the flush most of its options.

## Seven cards say the same

In Hold’em you play the best five of seven, so we counted those too: all 8,347,680 seven-card hands on a short deck. 633,024 end as a full house and 175,560 as a flush. The flush is still the rarer hand.

The same count found 233,100 that end as nothing at all. On a short deck, seven cards make a full house more often than they make high card. Two pair turns up more often than one pair. It is not a game for anybody who enjoys folding.

That run takes minutes rather than a second, too long for the test suite, so the seven-card counts are not pinned by a test the way the five-card ones are.

## Where rarity stops

The order does not follow rarity all the way. It stops at the bottom: on five short-deck cards, nothing at all (122,400 hands) is rarer than a pair (193,536), and nobody has proposed ranking nothing above a pair.

It wobbles in the middle too. On five cards a straight is rarer than three of a kind, 6,120 to 16,128. On seven it is not: 1,169,940 straights against 607,200 sets of trips. In Pip the straight still wins.

Some rooms swap the two for exactly that reason. Pip plays the Triton rules, which is what most players mean by Short Deck: flush over full house, the ace low under the six, and everything else in the usual order. [`src/lib/poker/shortDeck.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/poker/shortDeck.ts) says which rule set it picked, because choosing quietly between two real rule sets is how a showdown ships wrong.

## The ace plays low

With the deuce through five gone, the lowest straight is A-6-7-8-9, the ace standing in below the six. It is a nine-high straight, not an ace-high one, and the difference is a pot: scored as ace high it would beat the ten-high straight it loses to.

The hand library we use for Hold’em reads A-6-7-8-9 as ace high and nothing else, and puts a full house over a flush, without mentioning either. It is the same library we have [written about before](https://amethystani.github.io/amethystani/blog/pokersolver-undocumented/). So Short Deck has its own evaluator, and [`tests/shortDeck.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/shortDeck.test.ts) holds both rules, including a check that a short-deck hand is never handed to the library.

## Where it is

Short Deck is one of the side tables in the [membership](https://amethystani.github.io/amethystani/membership/?for=shortdeck&from=blog), at three stakes. The ladder, the Rail, the Daily and the freeroll stay free. So did the arithmetic.
