# How to calculate pot odds

![Two hole cards, the eight and seven of spades, beside a flop of the nine of spades, the four of spades and the two of hearts: four spades, so a flush draw.](https://amethystani.github.io/amethystani/learn/pot-odds-hero.png)

Divide what you have to call by the size the pot will be once you have called. If there is 120 in the pot and someone bets 60, you are paying 60 to win 240, so you need to win the hand more than 25% of the time for the call to make money.

That is the whole calculation. The hard part is the second number, which is how often you actually win, and most of this page is about that.

## The price every bet size sets

You do not need to do the division at the table. The answer only depends on the bet as a fraction of the pot, so there are about six numbers and they never change.

| The bet, into a pot of 100 | You call | Final pot | You need to win |
| --- | --- | --- | --- |
| Quarter pot, 25 | 25 | 150 | 16.7% |
| Third pot, 33 | 33 | 166 | 20% |
| Half pot, 50 | 50 | 200 | 25% |
| Two-thirds pot, 67 | 67 | 234 | 28.6% |
| Three-quarters pot, 75 | 75 | 250 | 30% |
| Pot, 100 | 100 | 300 | 33.3% |
| Twice the pot, 200 | 200 | 500 | 40% |

Read the whole table as one sentence: the bigger the bet, the more often you have to be right. A half-pot bet asks you to win a quarter of the time. Nobody can bet you off a hand for free, and the price they set is the only thing their bet actually tells you for certain.

**The common mistake is dividing by the pot as it stands rather than the pot after your call.** It makes every price look better than it is, which is a direction of error that costs money.

## The other half: counting outs

An out is a card that gives you the best hand. After the flop there are 47 cards you have not seen, and the count of outs among them is your estimate of how often you get there.

A flush draw is nine outs. There are thirteen cards in a suit, you can see four of them, and nine are left. Everything else is counted the same way, by working out which cards change the answer.

| Your draw | Outs | Next card | By the river, both cards |
| --- | --- | --- | --- |
| Gutshot straight | 4 | 8.5% | 16.5% |
| Two overcards | 6 | 12.8% | 24.1% |
| Open-ended straight | 8 | 17% | 31.5% |
| Flush | 9 | 19.1% | 35% |
| Flush and open-ended straight | 15 | 31.9% | 54.1% |

The shortcut is the rule of 4 and 2: multiply your outs by 4 for both cards, or by 2 for one card. It is close enough at small numbers and it drifts as the count grows. At nine outs it says 36 where the true figure is 35. At fifteen it says 60 where the truth is 54.1, and fifteen outs is exactly the situation where people talk themselves into stacking off.

**The two halves are wrong in opposite directions, and that part does not get printed.** Multiplying by 2 is the exact answer for a deck of 50 unseen cards, and the flop leaves 47. The outs cancel, so the rule of 2 sits 6% under the next-card column at every count there is, without exception. Nine outs is 19.1% and it says 18. Fifteen is 31.9% and it says 30.

The rule of 4 is that same shortfall doubled, so it starts under the column too, and doubling also counts the runouts where both cards are outs twice over. Two errors pulling opposite ways. Up to 6 outs the missing cards win and the shortcut reads low; from 7 the double-count wins and it reads high, by more with every out you add. Which puts the flattering half of the shortcut on exactly the draws people are already looking for a reason to call with.

## The mistake nearly every pot-odds page makes

**The “by the river” number is only yours if you are going to see both cards.**

You are on the flop, you have a flush draw, and someone bets. You will not necessarily see the turn and the river. You will see the turn, and then they get to bet again. Unless one of you is already all-in, or the bet has been checked through, the card you are buying is one card, not two.

So the number to compare against the price is **19.1%, not 35%.**

Facing a half-pot bet on the flop you need 25%. A bare flush draw does not have it. That is not an opinion about aggression, it is subtraction, and it is the single most useful thing on this page because the popular version of this advice has it backwards.

There is a real defence of that call, and it is not the 35%. It is implied odds, below.

## Outs are an estimate, and here is how wrong they get

Counting outs assumes your card wins and nothing else does. Both halves of that are approximations. Below are five real spots, each one worked out by playing every single one of the 990 possible turn-and-river runouts and counting the results.

| The spot | Outs you would count | What it is really worth by the river |
| --- | --- | --- |
| 8♠7♠ on 9♠4♠2♥ against A♥A♦ | 9, a flush draw | 39.3% |
| 8♠7♠ on Q♠6♠2♥ against Q♥Q♦ | 9, a flush draw | 27.4% |
| A♠K♠ on 9♠4♠2♥ against Q♥Q♦ | 15, flush and overcards | 55.0% |
| J♥T♥ on 9♠8♣2♦ against A♣A♦ | 8, open-ended | 34.2% |
| J♥T♥ on 9♠7♣2♦ against A♣A♦ | 4, a gutshot | 20.3% |

**The same nine outs are worth 39.3% in one row and 27.4% in the next.** In the first, the extra value is all the things the count ignores: running straights, running pairs, cards that back into a hand you never planned. In the second, the opponent has flopped three queens, so every card that pairs the board makes them a full house and your flush arrives second. Nine outs, and a third of their value gone.

Two lessons, and take the second one more seriously than the first.

**Outs undercount when nothing is wrong.** On a dry board against one pair, your real equity is a few points above the count, because backdoor cards are worth something.

**Outs overcount when something is wrong.** A paired board, a board of one suit, an opponent who has been raising every street. Those are the moments the count flatters you, and they are the moments you are being bet at hardest.

If you take one habit from this section: when the board pairs, stop counting and start subtracting.

## Implied odds, in short

Pot odds only price the money on the table now. Implied odds are the money you expect to win later on the streets where you hit.

This is the honest argument for calling a flop bet with a draw that immediate odds say to fold. You are not claiming 19.1% beats 25%. You are claiming the times you hit are worth more than the pot you are currently being offered, because they will pay you on the river.

Three conditions, and all three have to hold.

**The money has to exist.** Implied odds against a short stack are imaginary. There has to be enough behind to win.

**They have to pay.** A flush that arrives on an obvious board gets checked back all day. The value is in the hands that cannot fold, not the ones that cannot call.

**It has to be a hand you will get paid on and not one you get stacked with.** The other half of this is reverse implied odds, which is what happens when you hit and lose anyway: the small flush against the big one, the straight on a paired board, the ace-high flush draw’s little brother. Draws to the second-best hand are how the price stops mattering at all.

Implied odds are real and they are also the standard excuse for a call somebody wanted to make anyway. If you are appealing to them on every street, you are not using them, you are decorating.

## How this actually works at the table

You have about four seconds, so you are not doing long division.

**One. What does it cost me, as a fraction of the pot?** Half pot, two-thirds, that is enough precision.

**Two. So how often do I need to be right?** Half is a quarter. Two-thirds is roughly 29%. Pot is a third.

**Three. Am I better than that?** One card, not two, unless the money is already in.

Then fold most of the time, because the answer is usually no. Pot odds tell you when a call is not losing money. They do not tell you it is the best thing you could do with the hand, and they say nothing at all about the times raising is better than either. The hands worth being in these spots with are the ones on the [starting-hand chart](https://amethystani.github.io/amethystani/learn/starting-hands/), and the seat you are in decides how often you get to make the decision at all, which is [the position guide](https://amethystani.github.io/amethystani/learn/position/). From the other side of the table, the same arithmetic is [how much to bet](https://amethystani.github.io/amethystani/learn/bet-sizing/).

One more caution. Everything above is a one-on-one calculation. With three players still in, the price on offer is better and your chance of winning is worse, and the second effect is usually the bigger one.

[Do it with WebbPot odds, at the tableThe price of a call as a share of the pot, your chance as a share of the deck, and calling when the chance is bigger.](https://amethystani.github.io/amethystani/game/lessons/pot-odds/)

The arithmetic takes a minute to learn and a few hundred hands to apply without thinking, and only the first part can be read.

You can play Texas Hold’em on Pip right now, in the browser, against opponents that price their own decisions the same way. Nothing to install, free to play, and the chips are never for sale. The table shows your win chance while the hand is live, so you can make your estimate first and then check it.

A free account keeps your Roll on every device, and you never need one to play.

[Play a hand](https://amethystani.github.io/amethystani/game/)

## Keep going

-   [Poker hand rankings](https://amethystani.github.io/amethystani/learn/hand-rankings/)
-   [Which starting hands to play](https://amethystani.github.io/amethystani/learn/starting-hands/)
-   [Position in poker](https://amethystani.github.io/amethystani/learn/position/)
-   [How much to bet](https://amethystani.github.io/amethystani/learn/bet-sizing/)
