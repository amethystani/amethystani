# Your cards stay on the server

12 October 2026

## Two kinds of table

A single-player game of Pip runs in your browser. The deck is in the tab with you, and so are the bots’ cards. Anybody who opens the developer tools can read them. That has never mattered, because the only person you can cheat there is you.

On 11 October Pip got multiplayer: private rooms you open for your friends, and quick match at the ladder’s stakes. Once there is another person at the table, a card in your browser is a card somebody can read.

## Face down is only a picture

A card drawn face down is a drawing. If the browser was sent the card, the drawing is all that hides it. So a room is not dealt in anybody’s browser. Our server deals it, and keeps the deck and every hole card.

Each player is sent their own copy of the table, made by [`src/lib/multiplayer/view.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/multiplayer/view.ts). The deck is emptied. Everybody else’s cards are taken out, and only how many each player holds is left, so the backs can still be drawn. Cards come back only for the players a showdown turns over. A pot won when everybody else folds shows nothing to anyone.

Account ids stay on the server too. Nobody at a table needs one, and a list of them is the first thing anyone collecting accounts would want.

## Every step, not one hand

A test that checks one hand picked to pass tells you about that hand. [`tests/multiplayerView.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/multiplayerView.test.ts) plays twelve seeded games instead, and at every step checks the copy each person at the table would be sent, and the copy someone watching would get. None may carry the deck, and none may carry a card its reader is not entitled to see.

## The AI players

The server does hand its bots the whole table, every card included, which is a fair thing to be suspicious of. The bots’ decisions read their own cards, the board and how everybody has bet. They guess at your hand from your betting, the same way a person would.

We wanted that pinned rather than promised, so [`tests/multiplayerBotsSeeOwnCards.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/multiplayerBotsSeeOwnCards.test.ts) makes every bot decision twice in a seeded game: once from the whole table, once from the copy a person in that seat would be sent, with the same dice. The two must match. To check the test could fail, we made a bot look at one opponent’s cards. It failed.

In quick match, AI players take any seat that has not filled after about thirty seconds. Each one has an AI tag on its name plate.

## What this does not do

You cannot check a room’s shuffle. The server shuffles, and nothing yet lets you verify it afterwards. The Daily Deal is still the only thing on Pip you can deal again yourself.

The members’ view of the rest of a game after you bust, every hand face up, stays at the single-player tables. At a room the server has nothing to send it.

And none of this makes a room tamper-proof. It means one thing: your cards are not in anybody else’s browser until you show them.

## Dealing your friends in

A member opens a room and sends the code. Friends join free with a Pip account, camera and voice if they want them. Multiplayer is part of the [membership](https://amethystani.github.io/amethystani/membership/?for=multiplayer&from=blog). The ladder, the Rail, the Daily and the freeroll stay free.
