# How often do you flop a set?

**About 11.8% of the time.** You are dealt a pocket pair, the flop comes down, and roughly one flop in 8.5 contains one of the two remaining cards of your rank.

That is the answer, and it is the one every poker site gives. It is also counting the wrong thing, by a small and quite interesting amount.

## All 19,600 flops, graded

Your two cards are gone, so 50 are unseen and there are exactly 19,600 flops you can meet. That is a small enough number to look at all of them, which is what the table below is: every flop, graded by the same code that decides who wins a hand on Pip.

| You have | Which is | Flops | Share |
| --- | --- | --- | --- |
| Four of a Kind | Both of the remaining cards of your rank arrive at once. | 48 | 0.24% |
| Full House | Your set with the board paired beside it, or the board comes three of a kind and your pair fills it. | 192 | 0.98% |
| Three of a Kind | A set. The one you were waiting for. | 2,112 | 10.78% |
| Two Pair | The board pairs. Your pair is still just your pair, with company. | 3,168 | 16.16% |
| Pair | The flop did not touch you at all. | 14,080 | 71.84% |

The counts add to 19,600, which is the only check worth having on a table like this one. Five percentages are five separate chances to be wrong and nothing can catch any of them. Five counts have to add up.

## The famous number counts cards, not hands

11.8% is the chance that at least one of the two remaining cards of your rank turns up in the flop: **2,304** flops of 19,600. That is the right way to count if the question is whether you hit.

Grade the hands instead and the answer is **2,352** flops where you hold three of a kind or better, which is 12.00% exactly. Not rounded to it.

The gap is 48 flops, and they are the ones where the board comes three of a kind on its own. K-K-K in front of your pocket sevens is a full house, and there is not a seven in it. You did not hit anything and you are holding the [fourth best hand in poker](https://amethystani.github.io/amethystani/learn/hand-rankings/).

At the table this is a rounding error. It is on the page because it is the clean small version of a thing that is generally true, and expensive when it is not: **“did my card come” and “what have I got” are different questions**, and only the second one wins the pot.

## What it means while you are holding one

The other side of 12.00% is **88.00%**, also exact: 17,248 flops leave you with the pair you were dealt and nothing more. Seven times in eight, the flop is a disappointment.

Which is the whole reason the advice about pocket pairs is always about the price rather than the pair. You are paying, before the flop, for something that arrives one time in 8.3. What makes that worth paying is how much you stand to win on the times it does arrive, which is the implied half of [pot odds](https://amethystani.github.io/amethystani/learn/pot-odds/). The number on this page is the input to that decision, not the decision.

And it is the same number for every pocket pair. Deuces flop sets exactly as often as aces do. What changes is what happens on the 88.00%, which is what the [starting hand chart](https://amethystani.github.io/amethystani/learn/starting-hands/) is really about.

## Where these numbers come from

They are not quoted from anywhere. [A test in the repo](https://github.com/playpip/pip-web/blob/main/tests/flopSet.test.ts) deals every one of the 19,600 flops from the same 52-card deck the game deals from, hands each one to the same evaluator that settles a real pot on Pip, and checks the five counts above. It does it for all thirteen ranks, because “the same for every pair” is a claim too, and it is the one a reader is most likely to doubt.

The counts are typed out by hand in the source rather than computed, which looks like the wrong way round and is not. **A number worked out by the evaluator cannot disagree with the evaluator.** Written down first, it can be wrong, and the build says so.

Pocket pairs are exactly one deal in seventeen, so waiting for 19,600 of them is not a plan. Deal yourself some instead.

Free, and nothing to install.

A free account keeps your Roll on every device, and you never need one to play.

[Play a hand](https://amethystani.github.io/amethystani/game/)

## Keep going

-   [How to calculate pot odds](https://amethystani.github.io/amethystani/learn/pot-odds/)
-   [Which starting hands to play](https://amethystani.github.io/amethystani/learn/starting-hands/)
-   [Poker hand rankings](https://amethystani.github.io/amethystani/learn/hand-rankings/)
