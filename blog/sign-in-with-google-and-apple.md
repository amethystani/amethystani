# What Google and Apple tell us when you sign in

4 October 2026

## Two new buttons

The account dialog now offers Continue with Google and Continue with Apple, above the email and password it already had. You press one, go to Google or Apple for a moment, and come back to the page you left, signed in, with your Roll syncing.

An account is still optional. This only changes how long it takes to make one if you want one, which used to be the time it takes to think of a password.

## What they hand us

A button that says Continue with Google is also a small data transfer, and the button does not mention it. So here it is, in the same words as [the privacy page](https://github.com/playpip/pip-web/blob/main/src/app/privacy/page.tsx):

-   **Both send** your email address and an id for your account with them.
-   **Google also sends** the name and picture on your Google account.
-   **Apple sends your name** the first time, and lets you hide your email, in which case we only ever see a relay address Apple makes up for us.

Supabase keeps those with the account record. Pip never shows or uses them: nothing in the app reads the name or the picture, and deleting the account deletes them. We do not need them either. They come with the sign-in.

## Two details we cared about more than you will

-   **A button only appears once it works.** A provider that is not switched on behind the scenes sends whoever presses it to a page of raw JSON on someone else’s domain. So the build lists the providers it offers, and a button is not drawn until its provider is on ([`src/lib/sync/client.ts`](https://github.com/playpip/pip-web/blob/main/src/lib/sync/client.ts)).
-   **An account made this way has no password**, so it does not offer to change one. It says Set a password instead, and setting one lets you sign in with your email as well ([`src/store/sync.ts`](https://github.com/playpip/pip-web/blob/main/src/store/sync.ts)).

Neither is interesting. Both are the sort of thing that, done the other way, ends up as a support email.
