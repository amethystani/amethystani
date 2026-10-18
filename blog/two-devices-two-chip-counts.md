# Two devices, two chip counts

4 August 2026

## The short version

Pip now has an account. It is optional, it is off unless you turn it on, and it does one thing: carries your progress to another device. You can still play everything without one, exactly as before.

It is free, and it stays free. Sync shipped free, so paywalling it later would be a promise broken rather than a price introduced.

If you never turn it on, Pip makes no request to us at all. No client loads, no identity exists, and there is no row anywhere with your name on it. That is not a policy we are asking you to believe. It is what the code does, and the code is [all there](https://github.com/playpip/pip-web).

## The easy half

Email and password, a reset link, and a delete button. That part is a solved problem and we did not solve it again: it runs on [Supabase](https://supabase.com), with reset email through [Resend](https://resend.com). There is nothing to say about it and that is the point.

## The hard half

You play a session on your phone and finish on 4,200. You play a session on your laptop that went less well and finish on 900. Both were offline. Now they meet.

There is no correct answer to that. There is only a chosen one, and the only real requirement is that a player can predict it. Adding the two together invents chips you never won. Taking the larger rewards anyone who keeps a losing session unsynced, which is a rule that teaches people to game it. Taking the most recent write quietly eats a good night, which is the worst of the three because you find out afterwards.

All three are worse than asking. So Pip asks.

## The rule

It is [`src/lib/sync/merge.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/sync/merge.ts), one rule per field, and [`tests/syncMerge.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/syncMerge.test.ts) has a case for each of the ones below. Everything that can only grow merges in your favour, whichever device you pick, because gaining it can never cost you anything:

-   **Awards** are the union of both devices, keeping the earlier time earned. You earned it when you earned it. The other device had not heard yet.
-   **Peak Roll** is the higher of the two. **Cosmetics you own** are the union. **Venue and cast records** take the better of each.
-   **Today’s Daily** keeps the record that says you played it. Syncing should not hand you a second attempt.

Two things cannot merge, and they are the two that matter: your **Roll** and your **lifetime stats**. Those follow one side, and you pick which. Stats follow the Roll rather than being merged separately, because a profile with one device’s chips and the other device’s hand count is a profile that disagrees with itself.

## When you actually get asked

Rarely, by design. The prompt needs the other device to have written something new, this device to have unsent changes of its own, and the two to disagree about the Roll or about hands played.

Change your card back on the bus and nothing happens. Play a real session on each of two devices and you get one dialog, showing both sides, and you choose. If only one device moved there is nothing to lose, so the merge is silent.

## What we store now, which is more than nothing

Pip used to collect nothing. That was true, and it is not true any more, so we are saying so plainly rather than letting an old line stand.

Turn the account on and we hold two things: your email address, so you can sign back in, and a copy of the same profile that was already on your device. Not a new profile assembled about you. The same one, moved. No hand histories beyond what it already holds, no IP profiling, and no marketing email, ever.

Delete it from the same place you made it and it is genuinely gone, account and stored profile together, rather than flagged and kept. Your profile on the device stays exactly where it is and Pip carries on working. The whole story is on the [privacy page](https://playpip.io/privacy).

## What we did not build

Doing this properly means a three-way merge, which needs each device to remember the last state both sides agreed on. That is a much larger build for a single-player game where one device is almost always the active one. We chose the rule you can explain in a sentence instead. If it turns out to annoy people, it is a known upgrade path rather than a corner we painted into.

There is also no banner. Signed out is a permanent, first-class state, not a funnel step, so you will not find a prompt asking you to sync your progress or a badge suggesting your account is incomplete. There is one quiet section in Settings, under Account, and it will wait there indefinitely.

Transfer codes and the QR still work too, and they always will. Moving a profile between devices never required an account and still doesn’t. The account is only there if you would rather not think about it.
