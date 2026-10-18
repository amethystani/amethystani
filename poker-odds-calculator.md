# Poker odds calculator

Pick your two cards, add the board if there is one, say how many people you are against. Leave the board empty and it works the hand out preflop. That is the whole thing.

This deals the hand out and counts who wins, rather than looking the answer up. It is the same engine Pip’s game uses to work out the win percentage in the corner of the table, it runs entirely in your browser, and it is [open source](https://github.com/playpip/pip-web), so you can check it rather than trust it.

## What equity actually means

Equity is your share of the pot if the hand were played to the end from here, every time. Ace-king against one random hand is about two thirds, which sounds like a lot until you notice it means you lose a third of the time.

It is not a decision on its own. A hand that wins 30% of the time is a fold against one price and a call against another, and the thing that decides which is the size of the bet, not the size of the number here. That arithmetic is in [pot odds](https://amethystani.github.io/amethystani/learn/pot-odds/).

Two things this does not do. It assumes your opponents hold random cards, which nobody does after they have put money in, so treat the number as a floor on a big bet and a ceiling on a small one. And it says nothing about how the hand gets played. [Position](https://amethystani.github.io/amethystani/learn/position/) is usually worth more than the two or three points between [one starting hand and the next](https://amethystani.github.io/amethystani/learn/starting-hands/).

## Where the numbers come from

Pip is an open-source Texas Hold’em game. The engine here is `estimateEquity` from the same repo the game runs on, doing the same job it does when you play a hand. There is no account, no email box, and nothing to install.

Where the spot is small enough to count outright, it is counted outright and the answer says so: heads-up with the board complete is 990 possible hands your opponent could hold, and every one of them gets dealt. Everywhere else it deals a large sample and prints the margin of error that sample earns, because a number quoted to a decimal place it cannot support is a made-up number.

If you want to play a few hands rather than count them, [that is here](https://amethystani.github.io/amethystani/game/).
