# Omaha’s exactly-two rule, in five hands

5 October 2026

## The rule

In Pot-Limit Omaha you are dealt four cards instead of two. At showdown your hand is exactly two of those four and exactly three of the five on the board. Not one of yours and four of the board. Not three and two. Two and three, every time.

That is the whole difference at showdown, and it is enough to make most Hold’em instincts wrong. Below are five hands, each read twice: once the Hold’em way, best five of seven, and once the Omaha way. Every answer here came out of the evaluator that settles Pip’s Omaha pots, not out of our heads.

## Four hearts is not a flush

You hold the ace, king, queen and jack of hearts. The board is 2♥ 7♣ 8♦ 9♠ 10♠.

In Hold’em that is an ace-high flush. In Omaha it is a queen-high straight. Only two of your hearts may play, and a flush needs three more from the board, which has one. The straight is your queen and jack with the 10, 9 and 8.

## Neither is one

The other way round. The board is A♥ 9♥ 6♥ 3♥ K♣ and you hold Q♥ 7♠ 4♦ 2♣.

In Hold’em the queen of hearts makes a flush. In Omaha you have ace high and nothing else, because you must use two of your cards and only one of them is a heart. Four to a flush on the board plus one in your hand is the most expensive nothing in the game.

## The board is not your hand

The board is 9♣ 9♦ 9♥ 2♣ 2♦: a full house all by itself. You hold A♠ K♦ Q♥ J♠.

In Hold’em everybody plays the board and splits it. In Omaha you have three nines with an ace and a king, since only three board cards play and two of yours must. Anybody with a pair among their four has at least the full house you do not, and the last nine makes four of a kind.

## Sometimes the rule gives

The board is 9♣ 9♦ 9♥ 5♣ 2♦ and you hold A♠ A♦ 7♣ 8♦. Nines full of aces, both ways. A pair in your hand is exactly how you use a board with trips on it, and the rule takes nothing off you here.

## Two pair is one pair

You hold K♣ K♦ 5♠ 5♥. The board is 6♣ 7♦ 8♥ 9♠ Q♣.

In Hold’em one of your fives finishes a straight. In Omaha that straight would be one of your cards and four of the board’s, which is not allowed. You play the kings with the queen, nine and eight: a pair of kings, on a board where anybody holding a ten and a jack has a straight.

## Sixty hands at every showdown

Two of four cards can be chosen six ways. Three of five can be chosen ten ways. So every Omaha player at a showdown has sixty legal hands, and [`src/lib/poker/handEval.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/poker/handEval.ts) builds all sixty and keeps the best. It does not reason about which two cards ought to play, because that reasoning is where Omaha evaluators go wrong, and sixty five-card hands is not much work.

We could have left the reading to the hand library we use. We have [written before](https://amethystani.github.io/amethystani/blog/pokersolver-undocumented/) about what that library does without telling you, so the rule is ours, where a test can hold it. [`tests/omaha.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/omaha.test.ts) deals sixty random hands and checks that each best five is two from the hand and three from the board.

## Pot limit

The other half of the name. The most you can raise is the size of the pot after you call. At The Big Pot the blinds start at 25 and 50 and everyone sits with 10,000. First to act before the flop, there are 75 chips in the middle. Calling 50 makes it 125, so you may raise by 125 more: 175 in all. At a no-limit Hold’em table the same seat could put in all 10,000.

The sum is in [`src/lib/poker/engine.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/poker/engine.ts), written out, because the usual mistake is to raise by the pot before your call and come up short.

## Where it is

Pot-Limit Omaha is The Big Pot, one of the side tables in the [membership](https://amethystani.github.io/amethystani/membership/?for=omaha&from=blog). The ladder, the Rail, the Daily and the freeroll stay free. The rule was always free to read, and now you have.
