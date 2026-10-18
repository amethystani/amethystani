# Privacy

Last updated October 2026

## The short version

Pip is built to need as little of your data as possible — which turns out to be almost none. No account needed, no personal data, no cross-site tracking, no cookies. We do count anonymous, cookieless usage so we can see what’s working — nothing that identifies you. Here’s the whole story, plainly.

## What we store

Your profile — name, avatar, your Roll, stats, card backs, all of it — lives in your browser’s local storage, on your device. Nothing leaves your device unless you ask it to. Clear your browser data and it’s gone; we keep no copy, because we never had one.

## If you add an account

Pip has an optional account. It carries your progress to another device, and it is what a [membership](/membership) belongs to if you take one. It is off unless you turn it on, in Settings, under Account. Until then Pip makes no request to us at all, holds no identity for you, and there is no row anywhere with your name on it.

Turn it on and we store two things: **your email address**, so you can sign back in, and **a copy of the same profile** that was already on your device. Nothing else, unless you take a membership or turn on email (both below). No hand histories beyond what your profile already holds, no IP-based profiling, and no email you did not ask for. The data sits with [Supabase](https://supabase.com) on our behalf, and email goes out through [Resend](https://resend.com).

If you sign in with Google or Apple instead of a password, they send us your email address and an id for your account with them. Google also sends the name and picture on your Google account, and Apple sends your name the first time. Supabase keeps those with the account record. Pip never shows or uses them, and deleting the account deletes them. With Apple you can choose to hide your email, and then we only ever see a relay address Apple gives us.

You can delete it from the same place you made it. “Delete my account and synced data” in Settings removes the account and the stored profile together, and it is genuinely gone rather than flagged. Your profile on the device stays exactly as it is, and Pip keeps working the way it did before.

If you ever take out a [membership](/membership) on the website, the payment is handled by [Stripe](https://stripe.com). In the iPhone or Android app, Apple or Google handles it, and [RevenueCat](https://www.revenuecat.com) tells us it exists, which means RevenueCat holds your account’s id. **We never see or store your card number** — it goes straight to Stripe and never touches our servers. What we keep is a record that your account has a live membership and when it renews, which is what the app checks to unlock what you paid for. Nothing about a membership is linked to how you play.

Deleting your account cancels a membership bought on the website on the spot. One bought in the app can only be cancelled in your App Store or Google Play settings, so cancel there first. The one thing that outlives it is Stripe’s record of what you paid — the invoices and the email address they went to — because tax law requires a business to keep them. None of it is linked to a Pip profile any more.

You can also just ask. Email [hello@playpip.io](mailto:hello@playpip.io) from the address on the account and we’ll delete it for you within 7 working days, whether or not you can still get into the app. Once it’s gone we keep nothing: no archive, no copy set aside, nothing to come back later and find.

## Email

Pip only emails you about your play if you ask it to. With an account you can turn on two kinds, in Settings → Manage account or with the box when you create the account. Both are off until you do.

-   **A Daily reminder.** At 18:00 UTC, on a day you have not played the Daily, if you played it the day before.
-   **A weekly summary.** On Mondays: your Roll, the hands and tournaments you played since the last one, and your streak.
-   **One email when you turn them on.** It says what you will get. Never more than one email a day in all.

They are made from your email address and the profile your account already syncs: your Roll, your lifetime hand and tournament counts, the date you last played and your streak. To say what changed in a week we keep those few numbers as they were at the last summary. We also keep which emails you turned on, when each was last sent, and a random code for the unsubscribe link. We do not track whether you open an email or click anything in it.

Every email has an unsubscribe link at the foot, and your mail app’s own Unsubscribe button works too. Either one turns off both kinds, with no sign-in. You can also turn them off in Settings → Manage account, and deleting your account deletes all of this with it. Password-reset email, when you ask for one, is separate and always sent.

## What we don't do

-   **No account needed.** You can play everything without one. There’s an optional account for moving your progress between devices (above), and that’s the only thing it does.
-   **No personal data.** The counts we keep (below) are anonymous and aggregate — never your name, avatar, Roll, or anything that points back to you. You can check: it’s all in the open repo.
-   **No tracking cookies.** None. So there’s no cookie banner to click away, either — and no way to follow you around the web.
-   **No selling your data.** We don’t have any to sell, and wouldn’t if we did.

## What we count

To know whether Pip is any good, whether people find it, start playing and come back, we keep a handful of anonymous, aggregate counts through [Umami](https://umami.is), a privacy-first, cookieless analytics tool. It records page views and a few milestones: someone made a profile, someone played their first hand, someone created an account, two devices disagreed about a Roll, someone tried to sign in, and whether a sign-in reached our servers at all. Those last two are there because a sign-in that fails on a bad network looks exactly like nobody wanting an account, and we would rather know the difference. We count the tries so we know whether the failures are rare. For the membership we count four steps: someone opened the membership page, someone went to pay, someone came back from paying, and a membership started. Paying needs an account, so we also count whether they were signed out when they opened it, and whether they tapped to create an account from it. That tells us where people stop, not who they are. No cookies, no fingerprinting, no personal data, and never anything you typed or any message we got back. We can’t tie any of it to a person, including you. It exists so we can improve the game, and for nothing else. It’s never sold or shared.

The counts are held by Umami on our behalf and roll off after about six months. We don’t keep our own copy beyond that.

## Server logs

The site is served as plain files by Cloudflare. Like any web host, Cloudflare keeps standard access logs — things like IP addresses and which files were requested — to deliver the page and keep it standing up. That’s Cloudflare’s doing, under their own privacy terms; we don’t add to it and we don’t go digging through it.

## Sharing a hand or a result

When you copy a hand link or a Daily result, the data rides inside the link itself — nothing is uploaded. It only goes anywhere if you paste it somewhere. Following a link out to GitHub takes you to GitHub, under their rules, not ours.

## Children

Pip is play money, but it’s still card play. It’s meant for people 13 and over.

## Changes

If this ever changes — say we add something you can pay for — we’ll update this page and the date at the top. The honest version: right now there’s very little to say, and we’d like to keep it that way.

## Don't take our word for it

Pip is open source. The whole app lives at [github.com/playpip/pip-web](https://github.com/playpip/pip-web) — you can read exactly what it does and doesn’t collect. Questions? Open an issue there.
