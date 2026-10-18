# Three pair in Texas Hold’em

**You can hold three pairs. You cannot play them.** A poker hand is five cards, and three pairs are six, so the two highest pairs play and the third one is left outside with a fifth card to find.

That much every site will tell you. What none of them says is what the third pair is worth on the way out, which is one card, one time in four, and nothing at all the rest of the time.

## Three pairs and a spare, once every 54 hands

By the river you can see seven cards, and there are 133,784,560 of those. Split them by how the ranks fall and three pairs is the rarest shape of the five:

| Your seven cards | Holdings | Share |
| --- | --- | --- |
| One pair, and five ranks that appear once | 63,258,624 | 47.28% |
| Two pairs, and three ranks that appear once | 29,652,480 | 22.16% |
| Seven different ranks, no pair anywhere | 28,114,944 | 21.02% |
| Some rank three or four times over | 10,287,472 | 7.69% |
| Three pairs, and one spare card | 2,471,040 | 1.85% |

The counts add to 133,784,560, which is the only check worth having on a table like this one. Three separate pairs is **2,471,040** of them, or one holding in 54. Some rank turning up three or four times over is 10,287,472, which is more than four times as often. Three pairs is the rarer shape and the weaker hand.

Rank is all this table sees. A straight or a flush is a claim about sequence and suit, so those sit inside the rows rather than beside them, and the [hand rankings](https://amethystani.github.io/amethystani/learn/hand-rankings/) are the place to read them off. The three-pair row is the one row where it cannot happen: four different ranks are one short of a straight, and three pairs and a spare cannot put five cards in one suit.

## The third pair is worth one card, one time in four

Ignore suits and there are 2,860 ways to be dealt three paired ranks and a spare. Every one of them grades as two pair. The only thing left to decide is the fifth card, and it is the higher of your third pair and the spare.

Your third pair wins that in **715** of the 2,860, which is one in four on the nose. It has to be lower than two other pairs and still higher than the loose card, and with four ranks in play each of them is the low one equally often. The other card of that pair never plays at all, whatever falls.

## From the seat holding the pocket pair

The version people actually meet is narrower: you were dealt a pair, the board came with two more on it, and now you are counting to three. There are 8,580 ways for that to happen, and your own two cards end up in one of three places.

| What happens to your pair | Cards of yours that play | Share |
| --- | --- | --- |
| Your pair is one of the two that play | 2 | 66.7% |
| One of your cards is the kicker | 1 | 8.3% |
| Neither card plays: you are playing the board | 0 | 25.0% |

Two times in three the pair does its job. One time in twelve it is demoted to the kicker, which is still enough:

You 8♠ 8♦ · Board A♣ A♥ K♣ K♥ 5♠ · Them 7♣ 2♦

You both have aces and kings. Your eight is the fifth card and theirs is a seven, so one pip decides it, and the second eight in your hand did nothing. That is the good outcome.

One time in four your pair is lower than everything else on the table, and then it does not matter that you were dealt it:

You 3♠ 3♦ · Board A♣ A♥ 9♣ 9♥ K♠ · Them 7♣ 2♦

Aces, nines and a king, which is the board, which is also **their** hand. The threes are not in it. Split pot, and the player holding 7♣ 2♦ did as well as you did.

None of which means a small pocket pair is a bad hand. It means the thing worth counting is your best five cards rather than how many pairs are on the table, and the two come apart most often when the board pairs up. Same distinction as [flopping a set](https://amethystani.github.io/amethystani/learn/how-often-do-you-flop-a-set/): did my card come and what have I got are different questions.

## Where these numbers come from

They are not quoted from anywhere. [A test in the repo](https://github.com/playpip/pip-web/blob/main/tests/threePair.test.ts) deals all 2,860 rank shapes and all 864 ways to suit one of them, hands each to the same evaluator that settles a real pot on Pip, and checks every count above. Both spots on this page go through it too, winner included.

2,471,040 holdings is more than a test should sit through, so it walks the two dimensions separately rather than their product. That is exhaustive because suits cannot change the grade here, and the test pins that as well rather than taking it as read.

One thing the table does not say. These are combinations, not hands you would play: a hand that folds on the flop never reaches seven cards, so the shares are how often the shape exists rather than how often you meet it.

Three pair looks like a lot of poker and grades as one line. The quickest way to believe that is to be shown your best five cards by something that has no reason to flatter you.

Free, and nothing to install.

A free account keeps your Roll on every device, and you never need one to play.

[Play a hand](https://amethystani.github.io/amethystani/game/)

## Keep going

-   [Poker hand rankings](https://amethystani.github.io/amethystani/learn/hand-rankings/)
-   [How often do you flop a set?](https://amethystani.github.io/amethystani/learn/how-often-do-you-flop-a-set/)
-   [How to play Texas Hold’em](https://amethystani.github.io/amethystani/learn/how-to-play-texas-holdem/)
