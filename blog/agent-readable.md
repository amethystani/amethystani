# Pip, for readers who aren’t people

26 July 2026

## Since this was written (corrected 19 August 2026)

Six is well out of date, and a number here would only go out of date again, so: **every route on this site that serves prose has a Markdown mirror**, and a test fails the build if a new one ships without. The learn guides, the odds calculator and the no-signup page were all written after this post, and each one arrived with its mirror.

Which makes the last paragraph below exactly backwards: it names the learn pages as part of the plain static half, and they are the largest set of mirrors on the site. You can read one at `/learn/hand-rankings.md`. The shared module is still 57 lines. The per-route files are still four lines each, except the two learn routes, which are seven.

## The short version

Every content page on this site now comes in two versions. Ask for one the way a browser does and you get HTML. Ask for it with an `Accept: text/markdown` header and you get the same page as plain markdown, with the navigation, styling and scripts left out. People get the site. Machines get the text.

You can try it from a terminal: `curl -H "Accept: text/markdown" https://playpip.io/`. Or, if you would rather not, put `.md` on the end of any content address and read the mirror directly.

## Why we bothered

A fair number of people now meet a website through something that read it for them. We would rather the thing doing the reading got it right. An AI tool parsing our HTML has to guess which parts are the page and which parts are the furniture; handing it the text instead removes the guessing.

It also follows from the rest of the project. Pip’s claim is that you can check it rather than take our word for it: the shuffle is seeded, the engine is a readable module, the code is all there. Being legible to machines is the same idea pointed at a different kind of reader.

## How it works

Three pieces, none of them clever. A post-build script walks the finished export, converts each content page to markdown, strips the chrome, and writes the result next to the page as `/privacy.md`, `/blog/launch-week.md` and so on. The same script emits [/llms.txt](https://playpip.io/llms.txt), an index of everything with a hand-written summary of what Pip is at the top, following the [llms.txt convention](https://llmstxt.org/). New posts are picked up from the export, so writing one requires no changes here. This post was.

In front of that sits the negotiation: a request carrying `Accept: text/markdown` is served the mirror, anything else is served the page. Browsers never send that header, so nothing changes for anyone using one. Both responses go out with `Vary: Accept`, so caches keep the two apart, and with [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) Link headers pointing at `/llms.txt` and at that page’s own markdown mirror. An agent that lands on the HTML by accident is told where the good version lives.

The module doing the work is 57 lines. Each of the six content routes that uses it is four more.

## Cloudflare ships a version of this

In March, Cloudflare announced [Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/), which does the same job at the edge and does it more thoroughly than we do. It is in beta, and it costs nothing extra, on the Pro, Business and Enterprise plans. Pip is on the free plan and intends to stay there, which ruled it out.

So the free version is the ninety-odd lines described above. If you are also on a free plan and want the same thing, the code is [`functions/_shared.ts`](https://github.com/playpip/pip-web/blob/main/functions/_shared.ts) and [`scripts/gen-llms.mjs`](https://github.com/playpip/pip-web/blob/main/scripts/gen-llms.mjs), and the three places a new route has to appear are held together by [`tests/contentRoutes.test.ts`](https://github.com/playpip/pip-web/blob/main/tests/contentRoutes.test.ts). It is MIT licensed. Take it.

## What we tell the crawlers

Our robots.txt now carries a [Content Signal](https://contentsignals.org/) line: `search=yes, ai-input=yes, ai-train=yes`. Yes to being indexed, yes to being used as source material for an answer, yes to being trained on. Plenty of sites are saying no to the last two, and the reasoning is usually sound. Ours points the other way: the whole codebase is public under a licence that already permits all of it, and a model that has read Pip and can describe it accurately is a good outcome for us.

One correction while we are here. Until Friday the site was quietly turning AI crawlers away, via a managed robots.txt setting that was on by default and that we had never consciously chosen. It is off now. We had been publishing an agent-friendly index to an audience we were blocking at the door.

## The game is still just files

Only the six content pages have any of this attached: the home page, privacy, terms, credits, the blog and its posts. Everything else, the table, your profile, the stats screen, the learn pages, is the same static export it was before and never touches a server. The poker still happens entirely in your browser, which was always the point.
