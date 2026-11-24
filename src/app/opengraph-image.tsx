import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * A FRONT PAGE at card size.
 *
 * The composition is the masthead and the top of the lead story, which is
 * exactly what a newspaper puts above the fold and exactly what a share card
 * has room for: a rule, the wordmark, a rule, a kicker and a headline.
 *
 * Satori renders a subset of CSS, so nothing here leans on anything clever —
 * these are solid blocks and borders, which is all a printed page is anyway.
 * Every element with more than one child carries an EXPLICIT `display`, which
 * Satori requires and a browser would have defaulted for us.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#f3efe6',
          color: '#1a1a17',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* The green ticker, as it sits at the top of the page itself. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 56,
            background: '#0a6e3c',
            color: '#ffffff',
            padding: '0 56px',
            fontSize: 21,
            letterSpacing: 2,
            fontFamily: 'Helvetica, Arial, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          Good News · Casino reviews · Terms re-read weekly
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '44px 56px 0' }}>
          {/* THE MASTHEAD. Two coloured spans, so this one says flex. */}
          <div style={{ display: 'flex', fontSize: 86, fontWeight: 800, letterSpacing: '-0.03em' }}>
            <span>GoodNews</span>
            <span style={{ color: '#0a6e3c', fontStyle: 'italic' }}>Drop</span>
          </div>

          {/* The double rule under the masthead — two borders with a gap, the
              one line on the site that is drawn twice. Satori has no
              `border-style: double`, so it is two divs, which is what a double
              rule is. */}
          <div style={{ display: 'flex', height: 3, background: '#1a1a17', marginTop: 26 }} />
          <div style={{ display: 'flex', height: 1, background: '#1a1a17', marginTop: 3 }} />

          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#0a6e3c',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
            }}
          >
            Front page · This week&apos;s report
          </div>

          {/* The lead headline, with its last two words in the serif italic
              green — the page's own treatment. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 18, fontSize: 72, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.04 }}>
            <span>Finally, casino news that&apos;s&nbsp;</span>
            <span style={{ color: '#0a6e3c', fontStyle: 'italic' }}>actually good.</span>
          </div>
        </div>

        {/* The footer's green rule, closing the card the way it closes the
            page. */}
        <div style={{ display: 'flex', position: 'absolute', left: 0, bottom: 0, width: 1200, height: 10, background: '#0e8f4f' }} />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 56,
            bottom: 34,
            fontSize: 21,
            color: '#67634f',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
