# Five things pokersolver does that its README does not mention

28 August 2026

## Why this page exists

Pip does not have its own hand evaluator. Ranking the best five cards out of seven, with kickers, is a solved problem with sharp edges, so we hand it to [pokersolver](https://github.com/goldfire/pokersolver) and wrap the result. That wrapper is [`src/lib/poker/handEval.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/poker/handEval.ts), one file, and writing it meant finding out what the library does when the README stops describing it.

There are five of those. We hit all five. Four of them have been asked about on the library’s own issue tracker and left unanswered for between three and six years, so as far as we can tell there is nowhere to look them up. This is that place. Everything below was produced by running `pokersolver@2.1.4`. The inputs are [`src/config/pokersolverQuirks.ts`](https://github.com/playpip/pip-web/blob/main/src/config/pokersolverQuirks.ts), this page renders them, and [`tests/pokersolverQuirks.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/pokersolverQuirks.test.ts) re-runs every case on every build, so if the library changes this page fails before it lies.

None of this is a complaint. The library is good, it is free, it is doing the hard part, and it has not needed a release in years, which is usually a compliment.

## 1\. cards can hand you seven cards for a five-card hand

The obvious reading of `hand.cards` is that it holds the five cards that make the hand. It holds every card that qualified. Six hearts in, six hearts back.

`Hand.solve(['Ah', 'Kh', '9h', '7h', '5h', '3h', '2c'])`

`cards → Ah Kh 9h 7h 5h 3h (6)`  
`name → Flush`  
`descr → Flush, Ah High`

Seven hearts in, seven back.

`Hand.solve(['Ah', 'Kh', '9h', '7h', '5h', '3h', '2h'])`

`cards → Ah Kh 9h 7h 5h 3h 2h (7)`  
`name → Flush`  
`descr → Flush, Ah High`

This is the one place the README is not merely quiet but wrong, and it is wrong about the string rather than the array. It documents `toString()` as:

_“Returns a formatted string of all cards involved in the identified hand type (maximum of 5 cards).”_

On the seven-card flush above, `toString()` returns seven. If you are drawing a board from that string, that is two cards you did not budget for.

## 2\. A full house does it too, and it is easier to miss

A flush overflowing is at least visible in a suit. A full house does it when two different ranks both make trips, which is rare enough that a test suite written from the README will not contain one.

`Hand.solve(['As', 'Ah', 'Ad', 'Ks', 'Kh', 'Kd', '2c'])`

`cards → As Ah Ad Ks Kh Kd (6)`  
`name → Full House`  
`descr → Full House, A's over K's`

Six cards, and the description is right: aces full of kings.

The categories that can overflow are flushes and full houses. Straights and straight flushes cannot, because a sixth card in sequence makes a different, higher straight rather than joining the one you have.

`Hand.solve(['9h', '8h', '7h', '6h', '5h', '4h', '2c'])`

`cards → 9h 8h 7h 6h 5h (5)`  
`name → Straight Flush`  
`descr → Straight Flush, 9h High`

## 3\. An ace playing low comes back as a card with the value 1

In a five-high straight the ace is the bottom card, and the library represents that literally: the returned card’s value is the string `'1'`, and its rank is 0, below the deuce.

`Hand.solve(['5h', '4c', '3d', '2s', 'Ah', 'Kd', 'Qc'])`

`cards → 5h 4c 3d 2s 1h (5)`  
`name → Straight`  
`descr → Straight, 5 High`

The suit is intact. It is still the ace of hearts, still in the hand, and only the value is rewritten.

It is the right internal choice and the wrong external one, because `'1'` is not a card and any lookup keyed on rank will miss it. If you render the returned cards, you have to map it back. We do, in one line, and it took a wrong-looking table to notice.

## 4\. The overflow keeps the solver's order, so the first five are the hand

This is the behaviour that makes the other two survivable, and it is not written down anywhere, which is a shame because it is the useful one. The array is not sorted by rank. It is the cards that make the hand, in descending order, then the kickers, in descending order. So taking the first five is always correct, even when there are seven.

The case that proves it is a full house whose trips are lower than its pair, because sorting by rank would put the aces first:

`Hand.solve(['3s', '3h', '3d', 'As', 'Ah', '7c', '2d'])`

`cards → 3s 3h 3d As Ah (5)`  
`name → Full House`  
`descr → Full House, 3's over A's`

Trips first, despite being threes against aces.

Our whole handling of the overflow is `cards.slice(0, 5)` on the strength of that. It has been right in every case we have run, and it is the sort of thing that would break quietly in a minor version, so it now has a test rather than a comment.

## 5\. A royal flush is named “Straight Flush”

`name` is the category, and a royal flush is not a separate category, so it comes back as a straight flush. Only `descr` says the words.

`Hand.solve(['Ah', 'Kh', 'Qh', 'Jh', 'Th', '9h', '2c'])`

`cards → Ah Kh Qh Jh 10h (5)`  
`name → Straight Flush`  
`descr → Royal Flush`

If you switch on `name` to pick a celebration, the best hand in poker gets the second-best one’s. Two issues on the tracker are people finding this, in 2019 and in 2021. Both were answered by other users.

Note the ten as well: a ten goes in as `T` and comes back as `10`. Round-tripping a card through the solver does not give you the string you started with.

## One thing that is documented badly and works properly

The most-discussed question on the tracker is how to tell which player won, given `Hand.winners` returns hands rather than seats. The accepted answer, and the most-upvoted comment on the repository, is to attach an index to each hand object before passing it in and read it back off the winner.

That works, and it is not necessary. `Hand.winners` returns the same objects it was given, so a `Set` of the returned hands answers “did this player win” by identity, with nothing mutated and nothing to keep in sync:

```
const solved = new Map(players.map((p) => [p, Hand.solve(cardsFor(p))]))
const won = new Set(Hand.winners([...solved.values()]))

const winners = players.filter((p) => won.has(solved.get(p)))
```

That identity guarantee is not in the README either, which is presumably why the hack is the accepted answer. It is the one behaviour here we depend on without being able to see it, so it has a test too.

## What this page is not

-   It is not a bug report. Four of these are omissions in a README, and the fifth is one sentence about `toString()`. The code does something defensible in every case.
-   It is not a fork or a replacement. We use the library, unmodified, at the version named above.
-   It is not exhaustive. It is what a hold’em client hits. The library also deals pai gow, wild cards and five of a kind, none of which we touch, and there may well be more edges in there.

If you found this because your flush had six cards in it: yes, that is meant to happen, take the first five, and the ace in your wheel is the one labelled 1.
