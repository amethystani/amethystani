# A route missing from your sitemap is not noindexed

15 September 2026

## The sitemap is not a fence

Our sitemap has never listed the game. The file that builds it, [`src/app/sitemap.ts`](https://github.com/playpip/pip-web/blob/main/src/app/sitemap.ts), says so in a comment: the game itself is app, not content, and nobody needs to find a poker table through a search result. That felt like a decision. It was a preference.

Google indexed `/game` anyway. It got there through the Play button on the home page, which is a link doing what a link is for, and once it arrived nothing on the page asked it to leave. Search Console had the URL listed, ranking, and taking impressions for queries meant for the home page, which it could hardly help: the route declared no title of its own, so it inherited the root layout’s and went into the index as the home page’s twin.

Open a sitemap and you can see why leaving something out achieves nothing. It is a list of `<loc>` entries with dates on them. There is no element that means _not this one_, because the file is a set of requests rather than a set of rules. A URL you left out is a URL you did not mention.

## Then we fixed the wrong thing

The fix was obvious once we had seen it: say `noindex` on the page, give the route a title of its own, and write a test so it cannot come back. We did all three, in August, and the test reads `src/app/game`.

Three weeks later the same defect was still shipping on 32 other URLs. The suite was green the whole time, because it was doing precisely what it said.

`what the /game fix did not cover`

`/play/<venue> → twenty-nine prerendered files, one per table`  
`/stats → your own numbers, out of your own browser`  
`/hand → a shared hand, which lives in the URL fragment`  
`/reset-password → where the email lands`  
`all of them: no robots meta, no canonical, the home page’s own title tag`

A guard covers what it names. Ours named a directory, so it protected a directory, and the ruling behind it (screens are not pages) was never written down anywhere a build could read. This is the fourth time on this repository that a rule has been applied to the case that got caught rather than to the rule.

## Three states, and the third one does the work

What replaced it is an inventory rather than a ban. Every route under `src/app` is in exactly one of three states, and the build fails on a route in none of them. The states are [`src/config/routeStates.ts`](https://github.com/playpip/pip-web/blob/main/src/config/routeStates.ts) and the walk that enforces them is [`tests/canonical.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/canonical.test.ts).

`src/config/routeStates.ts`

`1. in the sitemap → published, and it needs a canonical`  
`2. under a noindex subtree → app, and the layout says so out loud`  
`3. neither → allowed, and somebody has to write the reason`

The subtrees are read off the filesystem, so a screen added under one of them is covered the day it is added rather than the day someone remembers:

`7 noindex subtrees, and why each is app`

`/game → the table itself, which is the product rather than a page about it`  
`/play → one prerendered file per venue, all of them the same screen with different chips`  
`/stats → your own lifetime numbers, read out of your own browser`  
`/hand → a shared hand lives in the URL fragment, which no crawler sends, so every link indexes as the same empty shell`  
`/reset-password → a step in a flow, reachable only with a token from an email`  
`/unsubscribe → a step in a flow, reachable only with a token from an email`  
`/welcome → a new player's first screens, which only make sense in order`  

The third state is the one worth copying. Our failure was never a route in the wrong state, it was a route nobody had thought about, and a test that only checks the routes you remembered cannot catch that. So the exceptions are enumerated, with an argument each, and the list is short enough to read. Ours currently holds two:

`/membership/welcome`

`where Stripe Checkout lands a new member, and only makes sense straight after paying. It sets its own noindex rather than sitting under a noindex subtree, because /membership above it is published.`

`/tutorial`

`prose-shaped, and out of the sitemap since #116 because it renders the tour client-side and serves 51 words to a crawler. Still crawlable, which nobody has argued for either way: it is linked from /learn and the landing page and is a tour for people rather than a page we want ranked.`

Each entry is not a fix. It is an admission with a name on it, which is the difference between a gap and an oversight.

## Three things that make this easy to get wrong in Next.js

-   **Metadata merges field by field, so a child route that exports its own `robots` silently drops the layout’s.** Nothing warns you. The guard bans the word `robots` outright in any page under a noindex subtree: the subtree’s answer is the layout’s, and a page with an opinion about it is the bug.
-   **A test that imports `metadata` cannot see a `generateMetadata`.** A route under a dynamic segment usually declares metadata from the function instead, and then the module’s `metadata` export is `undefined`, the assertion passes against nothing, and the route indexes itself while the suite reports success. Read the source text as well as the module, so both forms fail.
-   **Counting route folders undercounts what you shipped.** `/play/[venue]` is one folder in the editor and twenty-nine HTML files in the export, because `generateStaticParams` enumerates the venues. Whatever is wrong in that file is wrong twenty-nine times.

## Why not robots.txt

Because the two instructions fight. `Disallow` stops the crawl, and a page that is never crawled is a page whose `noindex` is never read. Google says it plainly in [its own documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing): “If the page is blocked by a robots.txt file or the crawler can’t access the page, the crawler will never see the noindex rule, and the page can still appear in search results.”

So [`public/robots.txt`](https://github.com/playpip/pip-web/blob/main/public/robots.txt) is one `Allow: /` and a link to the sitemap. Let the crawler in, then let each page answer for itself. That also happens to be the arrangement we would want anyway, since the pages we do want read are the whole reason the site has a front end.

## What this does not show

-   **That the 32 URLs have left the index.** The `noindex` went out on 10 September 2026 and dropping a page takes a recrawl, on a schedule nobody outside Google sets. We have not read an export since. If it turns out they are still there, that is a fact about recrawl intervals rather than about the tag, and we will say so.
-   **That `noindex` fixes a title.** It does not. A person who bookmarked a table still reads whatever the tab said, so giving the route its own title was the other half of the fix and the half that was visible to anybody.
-   **Anything about sites with a server.** This is a static export, so every one of these URLs is a file sitting on disk with its answer baked in. A server gives you `X-Robots-Tag`, which is better, and one more place for the two halves to disagree.

It is also one site’s experience rather than a survey. The part we would stand behind anywhere is the smaller one: the sitemap is a list of things you asked for, and everything you did not ask for is still on the table.
