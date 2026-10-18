# Blog

Notes from the table — what shipped, what changed, and the occasional hand worth talking about.

-   ## [Your cards stay on the server](https://amethystani.github.io/amethystani/blog/your-cards-stay-on-the-server/)
    
    12 October 2026
    
    In single-player Pip the whole deck is in your browser. At a multiplayer table that would let anyone read your cards, so our server deals and sends each player only what they may see. The test that checks every step, the one that keeps the AI players honest, and what it does not do.
    
-   ## [A beginner beat our hardest table by betting](https://amethystani.github.io/amethystani/blog/a-beginner-beat-the-main-event/)
    
    8 October 2026
    
    The Main Event folded 71% of checked flops to a two-thirds pot bet, where 40% already pays. A player two months into poker found it before we did. What the bots remember now.
    
-   ## [Why a flush beats a full house in Short Deck](https://amethystani.github.io/amethystani/blog/short-deck-flush-beats-full-house/)
    
    6 October 2026
    
    Short Deck throws out the deuces through fives, and the hand order moves to match. Every five- and seven-card hand on a thirty-six card deck, counted by the evaluator that settles Pip’s Short Deck pots.
    
-   ## [Omaha’s exactly-two rule, in five hands](https://amethystani.github.io/amethystani/blog/omaha-exactly-two/)
    
    5 October 2026
    
    In Pot-Limit Omaha you hold four cards and must play exactly two with three from the board. Five hands where that changes the answer, checked against the evaluator that settles Pip’s Omaha pots, and how big a pot-limit raise can be.
    
-   ## [What Google and Apple tell us when you sign in](https://amethystani.github.io/amethystani/blog/sign-in-with-google-and-apple/)
    
    4 October 2026
    
    Pip accounts can now be made with Google or Apple. Both send us your email and an id, Google adds your name and picture, Apple your name once. We never show or use them.
    
-   ## [Pot odds when you can’t cover the bet](https://amethystani.github.io/amethystani/blog/short-stack-pot-odds/)
    
    2 October 2026
    
    Facing a bet bigger than your stack, you pay less than the bet and play for less than the pot. Our session review got both halves wrong and called a fold that cost four big blinds a good one. The right sum, worked through one spot.
    
-   ## [Deal me in dealt you a menu](https://amethystani.github.io/amethystani/blog/deal-me-in/)
    
    30 September 2026
    
    In September, 68 of the 217 people who made a player on Pip did not play a hand within the hour. The tour was not why. The button that said Deal me in opened the lobby, and now it opens a table.
    
-   ## [Pip has a membership now](https://amethystani.github.io/amethystani/blog/pip-has-a-membership/)
    
    29 September 2026
    
    £5.99 a month or £49 a year, for the side tables and the games that are not Hold’em. The ladder, the Rail, the Daily and the freeroll stay free.
    
-   ## [The mock-ups on your landing page are untested claims](https://amethystani.github.io/amethystani/blog/landing-page-mockups/)
    
    17 September 2026
    
    Our home page draws four small pictures of what the game produces. Three were typed out by hand and all three had drifted: a share line missing the address that makes it a loop, a hand permalink six characters long on the card that says there is no server, and an equity read labelled with a phrase the game has never emitted, over a percentage its own caption contradicted. Why the suite stayed green, and the two ways to draw your own output that are true by construction.
    
-   ## [Your Cloudflare Pages site is on Google twice](https://amethystani.github.io/amethystani/blog/cloudflare-pages-dev-duplicate/)
    
    16 September 2026
    
    Cloudflare noindexes preview deployments and says nothing about the production pages.dev alias, which serves your whole site on a second host. Ours did, for five weeks, with a correct canonical tag on every page. The two-line rule that fixed it, why it is not a redirect, and the test that stops the same file deindexing the real domain.
    
-   ## [A route missing from your sitemap is not noindexed](https://amethystani.github.io/amethystani/blog/sitemap-is-not-noindex/)
    
    15 September 2026
    
    Leaving a URL out of the sitemap instructs nobody. Ours never listed the game, Google indexed it anyway under the home page’s title, and the fix we shipped covered one route and missed thirty-two. What replaced it: every route is published, noindex, or written down with a reason.
    
-   ## [How accurate is a poker equity calculator? We checked ours against an answer we could count](https://amethystani.github.io/amethystani/blog/how-accurate-is-a-poker-equity-calculator/)
    
    14 September 2026
    
    Every sampled equity number carries an error bar, and almost nobody prints one or tests it. There is exactly one spot where the true answer is countable. Here is what 100 runs against it say about the band we print.
    
-   ## [August: what shipped](https://amethystani.github.io/amethystani/blog/august-what-shipped/)
    
    2 September 2026
    
    Six written guides, a free odds calculator, a drill that marks your answer, a card at the end of a tournament, and the month we measured our own bots and published our own errors.
    
-   ## [Five things pokersolver does that its README does not mention](https://amethystani.github.io/amethystani/blog/pokersolver-undocumented/)
    
    28 August 2026
    
    Its cards array can hand you seven cards for a five-card hand, an ace playing low comes back with the value 1, and a royal flush is named “Straight Flush”. Each one with the input that produces it.
    
-   ## [Everything we have published that was wrong](https://amethystani.github.io/amethystani/blog/what-we-got-wrong/)
    
    24 August 2026
    
    Every false claim we have shipped: what each one said, how long it served, how we found it, and the test that now fails if it comes back. The newest one is a sentence in this post.
    
-   ## [Verify today’s deal yourself](https://amethystani.github.io/amethystani/blog/verify-todays-deal/)
    
    20 August 2026
    
    Everyone playing the Daily gets the same shuffle. Here are the six steps that produce it, a snippet that runs anywhere, and one day’s deck to check yourself against.
    
-   ## [Two devices, two chip counts](https://amethystani.github.io/amethystani/blog/two-devices-two-chip-counts/)
    
    4 August 2026
    
    Pip now has an optional account that carries your progress to a second device. The interesting part isn’t the sign-in, it’s what happens when both devices have been played.
    
-   ## [Pip, for readers who aren’t people](https://amethystani.github.io/amethystani/blog/agent-readable/)
    
    26 July 2026
    
    Every content page now answers Accept: text/markdown with its plain text version — a free-plan build of what Cloudflare offers as Markdown for Agents, in about ninety lines.
    
-   ## [Launch week: what shipped](https://amethystani.github.io/amethystani/blog/launch-week/)
    
    25 July 2026
    
    A new card back, four more hand nicknames, a quicker freeroll, and three strangers in the credits — everything that changed in Pip’s first days in the open.
    
-   ## [Pip is live, and it’s open source](https://amethystani.github.io/amethystani/blog/pip-is-live/)
    
    25 July 2026
    
    Single-player Texas Hold’em with no account needed, no ads, and no real money — now live at playpip.io, with the whole codebase in the open.
    

Follow along: [RSS](/rss.xml). No email, no account, no unsubscribe link to hunt for.
