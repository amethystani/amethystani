import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { FeltBackdrop } from '@/components/FeltBackdrop'
import { TEXT_SCALE_BOOT_SCRIPT, TextScaleProvider } from '@/components/text-scale-provider'
import { AppBoot } from '@/components/AppBoot'
import { SyncConflictDialog } from '@/components/settings/SyncConflictDialog'
import { UpdatePrompt } from '@/components/UpdatePrompt'
import { RSS_URL, SITE_URL } from '@/config/site'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Anonymous, cookieless analytics (Umami). Baked in at build time and loaded
// only in production when the website id is configured — dev/test/preview stay
// clean, and there's no tag at all until the id is set in the Pages env.
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC ?? 'https://cloud.umami.is/script.js'

export const metadata: Metadata = {
  // Required so static-export OG/Twitter image URLs resolve to absolute links.
  metadataBase: new URL(`${SITE_URL}/`),
  // Feed discovery for readers — emitted as a <link rel="alternate"> on every page.
  alternates: {
    types: { 'application/rss+xml': RSS_URL },
  },
  title: 'The Long Game — Animesh Mishra',
  description: "Texas Hold'em against distinct AI opponents. Play chips, no account, full table.",
  appleWebApp: {
    capable: true,
    title: 'The Long Game',
    statusBarStyle: 'black-translucent',
  },
  // The og/twitter image comes from `app/opengraph-image.tsx` — Next wires it
  // into `openGraph.images` + `twitter.images` automatically.
  openGraph: {
    type: 'website',
    siteName: 'The Long Game',
    url: SITE_URL,
    title: 'Texas Hold’em, the long way.',
    description:
      "Real Texas Hold'em vs AI. Play chips, no account needed, powered by open-source poker.",
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Texas Hold’em, the long way.',
    description: "Real Texas Hold'em vs AI. Play chips, no account needed.",
  },
}

export const viewport: Viewport = {
  themeColor: '#10110e',
  // Native-app feel: no pinch-zoom, and no auto-zoom when focusing an input.
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Lets the page draw behind the notch and the home bar and makes iOS report
  // env(safe-area-inset-*), which the store app pads by (globals.css). It has
  // to be in the tag Next renders: added to the tag from script after load, it
  // didn't stick, the insets read zero and the app's header sat under the
  // clock (checked in the simulator, 2026-10-07). On the website
  // nothing pads by the top inset outside the app, and the bottom inset only
  // feeds the action bars, which were written to clear the home bar anyway.
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="text-foreground min-h-full">
        {/* Same trick for the text size setting: root font size before first
            paint, or every rem in the app reflows after hydration. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, self-authored boot script */}
        <script dangerouslySetInnerHTML={{ __html: TEXT_SCALE_BOOT_SCRIPT }} />
        <FeltBackdrop />
        <TextScaleProvider>{children}</TextScaleProvider>
        <AppBoot />
        <SyncConflictDialog />
        <UpdatePrompt />
        {/* Umami's standard cookieless tag. Cross-origin, so the offline SW
            ignores it; fire-and-forget, so a blocked/failed load is harmless.

            data-exclude-hash is not housekeeping. Supabase returns an auth
            session in the URL fragment (see lib/sync/client.ts), so without it
            a confirm or password-reset landing records the player's access
            token (which carries their email address) as a page path. The
            attribute makes Umami blank the fragment on the page URL, the
            referrer, and SPA navigations alike, before anything is sent.

            Search params are deliberately NOT excluded: campaign attribution
            reads utm_* from the query, and nothing secret arrives there today.
            If sync ever moves to the PKCE flow the code lands in the query
            instead, and this decision has to be revisited (technology#30). */}
        {process.env.NODE_ENV === 'production' && UMAMI_ID && (
          <script defer src={UMAMI_SRC} data-website-id={UMAMI_ID} data-exclude-hash="true" />
        )}
      </body>
    </html>
  )
}
