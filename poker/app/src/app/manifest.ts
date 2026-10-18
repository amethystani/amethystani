import type { MetadataRoute } from 'next'

// Metadata routes must opt in to static generation under `output: 'export'`.
export const dynamic = 'force-static'
const BASE_PATH = '/amethystani'

// The PWA manifest — served at /manifest.webmanifest and linked automatically.
// Installing Pip matters beyond convenience: installed web apps are exempt from
// Safari's 7-day script-storage eviction, which protects the local profile.
// Chrome shows at most five screenshots on Android and eight on desktop, in
// order, and since Chrome 109 it shows only `wide` on desktop and ignores
// `wide` entirely on Android — so the two sets are separate files, not one set
// resized. Every screenshot of a form factor must share an aspect ratio or the
// odd one out is dropped. Both sets are 16:9, which also clears Play's 2x
// long-side limit. They must be served from playpip.io: an off-domain URL fails
// the pwa.directory check and may not render in the install dialog either.
// `label` is what a screen reader announces there.
const SCREENSHOTS: MetadataRoute.Manifest['screenshots'] = [
  {
    src: `${BASE_PATH}/screenshots/phone-1-table.png`,
    sizes: '1080x1920',
    type: 'image/png',
    form_factor: 'narrow',
    label:
      "A hand in progress at The Pub: four community cards face up, the player's two hole cards at 92% to win, and Fold, Check and Bet buttons.",
  },
  {
    src: `${BASE_PATH}/screenshots/phone-2-opponent.png`,
    sizes: '1080x1920',
    type: 'image/png',
    form_factor: 'narrow',
    label:
      "An opponent's profile: Elaine, loose and aggressive, with her chips, her bankroll, three read bars and a note that you have played fourteen hands together.",
  },
  {
    src: `${BASE_PATH}/screenshots/phone-3-venues.png`,
    sizes: '1080x1920',
    type: 'image/png',
    form_factor: 'narrow',
    label:
      'The venue ladder: rooms as illustrated cards, each showing its buy-in and what it pays to win.',
  },
  {
    src: `${BASE_PATH}/screenshots/phone-4-home.png`,
    sizes: '1080x1920',
    type: 'image/png',
    form_factor: 'narrow',
    label:
      'The home screen: a Roll of 18,420 chips, the next venue on the ladder, a cash table, and progress up the ladder.',
  },
  {
    src: `${BASE_PATH}/screenshots/phone-5-cash.png`,
    sizes: '1080x1920',
    type: 'image/png',
    form_factor: 'narrow',
    label:
      'The Rail: cash tables by stake, from 1/2 up, each showing table size, stack depth and the chips to sit down.',
  },
  {
    src: `${BASE_PATH}/screenshots/desktop-1-table.png`,
    sizes: '1920x1080',
    type: 'image/png',
    form_factor: 'wide',
    label:
      'A hand in progress at The Card Room: four community cards face up, a pot of 4,781 chips, an opponent all in, and Fold, Call and Raise buttons.',
  },
  {
    src: `${BASE_PATH}/screenshots/desktop-2-opponent.png`,
    sizes: '1920x1080',
    type: 'image/png',
    form_factor: 'wide',
    label:
      "An opponent's profile: Rosa, loose and passive, with her chips, her bankroll, three read bars and a note that you have played fourteen hands together.",
  },
  {
    src: `${BASE_PATH}/screenshots/desktop-3-venues.png`,
    sizes: '1920x1080',
    type: 'image/png',
    form_factor: 'wide',
    label:
      "The venue ladder on a wide screen: eight of the ten rooms as illustrated cards, from Friends' Garage to Monte Carlo.",
  },
]

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Long Game',
    short_name: 'The Long Game',
    description: 'Texas Hold’em against distinct AI opponents. Play chips, no account needed.',
    // Installed app launches straight into the lobby, not the marketing page.
    id: `${BASE_PATH}/`,
    start_url: `${BASE_PATH}/`,
    display: 'standalone',
    categories: ['games'],
    orientation: 'portrait',
    background_color: '#0a0a0b',
    theme_color: '#0a0a0b',
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
      {
        src: `${BASE_PATH}/icons/icon-512-maskable.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: SCREENSHOTS,
  }
}
