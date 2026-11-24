import type { Metadata, Viewport } from 'next'
import { Newsreader, Archivo, Archivo_Narrow } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The THREE faces of sites/goodnewsdrop.html, which is one more than any
// sibling uses — and a newspaper is exactly the thing that needs three.
//
// NEWSREADER carries every headline and every article paragraph. It is loaded
// with its OPTICAL SIZE axis (`opsz`, 6..72), and on this site that axis is
// doing more work than anywhere else in the network: the page sets type from
// a 12px caption to a 92px front-page headline, and a face with a real opsz
// axis draws those with different letterforms — thinner strokes and tighter
// spacing as it grows — rather than scaling one outline across a 7x range.
// That is precisely what a newspaper's own type does between its body and its
// masthead. Omitting the axis pins every size to the 14pt default and throws
// it away.
//
// ARCHIVO carries everything that is not an article: facts, buttons,
// navigation, form fields.
//
// ARCHIVO NARROW carries the all-caps labels — kickers, standfirsts, section
// heads, the footer's column heads. It is a separate family rather than a
// width axis on Archivo, and it has to be: at the 0.14em tracking these
// labels are set with, a normal-width grotesque runs a three-word kicker past
// the column it belongs to.
const newsreader = Newsreader({ variable: '--font-newsreader', subsets: ['latin'], axes: ['opsz'] })
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'] })
const archivoNarrow = Archivo_Narrow({ variable: '--font-archivo-narrow', subsets: ['latin'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Good News Drop'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a6e3c',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A nav link — the mockup's `.hdr .nav a`: ALL-CAPS NARROW, tracked out,
 *  parted from its neighbours by a hairline, with no fill and no box at all.
 *  It only changes colour on hover. The hairlines are what make this strip
 *  read as a newspaper's section bar rather than as a row of buttons, and
 *  they are drawn on the LEFT of each link so the strip opens on a word
 *  rather than on a rule — `first:border-l-0` does that without the list
 *  having to know which child is first. */
const NAV_LINK = 'lbl flex min-h-11 items-center whitespace-nowrap border-l border-line px-[22px] py-2 text-[14.5px] text-ink transition-colors first:border-l-0 hover:text-brand'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[15px] font-medium text-night-muted transition-colors hover:text-night-ink'

/** A footer column head — the mockup's `.ftr h4`: narrow caps in WHITE over
 *  its own hairline, which is the same rule-under-a-label that every section
 *  head at the top of the page uses. Not the serif: this is a label, and on
 *  this site labels are Archivo Narrow without exception. */
const FOOTER_HEAD = 'lbl block border-b border-night-line pb-2.5 text-[13px] text-night-ink'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. */
const NAV_PANEL = {
  // SQUARE, with a full ink rule and a flat drop. Nothing on this page is
  // rounded and nothing on it is blurred: a panel over a printed page is a
  // slip of paper laid on it, so it gets an edge and a hard shadow rather
  // than a radius and a glow.
  panelClassName: 'bg-paper border border-ink rounded-none shadow-[4px_4px_0_rgba(26,26,23,0.14)]',
  itemClassName: 'text-ink-soft hover:bg-green-light hover:text-brand',
  allItemClassName: 'text-ink hover:bg-green-light hover:text-brand',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `lg`), in this site's own palette — the mockup's
 *  `.burger` and `.mnav`: a SQUARE button under a 1.5px INK rule (the mockup's
 *  own weight, and ink is 15.20:1 on the paper, so nothing needs raising
 *  here), over rows parted by the column hairline. */
const NAV_MOBILE = {
  triggerClassName: 'rounded-none border-[1.5px] border-ink bg-transparent text-ink hover:bg-ink hover:text-cream',
  panelClassName: 'bg-cream border-line border-t',
  rowClassName: 'text-ink hover:bg-green-light hover:text-brand',
  rowExpandedClassName: 'bg-green-light text-brand',
  allClassName: 'text-ink hover:bg-green-light hover:text-brand',
  childClassName: 'text-ink-soft hover:bg-green-light hover:text-brand',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${archivoNarrow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* THE TICKER — the mockup's `.ticker`, and this site's primary
            subscribe point: the press green, the strapline at the left and the
            field at the right, above everything else on the page.

            It is OUTSIDE the sticky nav, deliberately. Inside it would stick
            to the top of every screen forever and cost ~56px of every phone
            viewport on top of the nav's own. Out here it scrolls away after it
            has been seen once, which is all a subscribe row needs to do.

            The DEEP green, not the mockup's bright one: white on #0E8F4F is
            4.15:1, and this strip carries a 15px sentence. On #0A6E3C it is
            6.35. The white "GOOD NEWS" key beside it reads the other way —
            the deep green on white, also 6.35 — which is the mockup's own
            inversion and the reason the strip has a focal point at all.

            The strapline is the first thing to go when the row narrows (the
            mockup hides it at 1100px); the field it explains carries its own
            label, so nothing is lost. */}
        {SUBSCRIBE_ENABLED && (
          <div className="bg-brand text-white">
            <div className="mx-auto flex min-h-[56px] max-w-[1240px] flex-wrap items-center justify-between gap-x-[18px] gap-y-3 px-4 py-2 sm:px-6">
              <p className="hidden min-w-0 flex-1 items-center gap-3.5 text-[15px] md:flex">
                <span className="lbl flex-none bg-white px-2.5 py-1 text-[12px] text-brand">
                  {COPY.newsletter.barLead}
                </span>
                <span className="min-w-0 truncate">{COPY.newsletter.barTail}</span>
              </p>
              {/* `compact` = no intro: the strapline beside it is the intro. */}
              <NewsletterForm compact tone="bar" className="w-full md:w-auto md:flex-[0_1_400px]" />
            </div>
          </div>
        )}

        {/* THE MASTHEAD — the mockup's `.mast`: the date at the left, the
            full wordmark CENTRED, and the strapline at the right, over a
            hairline. It is the one centred thing on the site.

            It is NOT sticky and it is hidden below `sm`, both of which are the
            mockup's own choices and both of which are right: a masthead is
            what you see when the paper is closed, and the nav below carries a
            small wordmark of its own for every screen that has scrolled past
            this one.

            The left-hand slot says "Weekly edition" and NOT today's date. The
            mockup fills it from `new Date()` in the browser; these pages are
            statically generated and revalidated on an hour's ISR, so a date
            printed here would be the date of the last BUILD, not of the visit
            — and a newspaper that prints the wrong date on its own masthead
            is worse than one that prints no date at all. */}
        <div className="hidden border-b border-line sm:block">
          <div className="mx-auto grid max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center gap-5 px-4 pb-[18px] pt-[22px] sm:px-6">
            <span className="lbl text-[14px] tracking-[0.04em] text-ink-soft">{COPY.site.editionLabel}</span>
            <Logo />
            <span className="lbl text-right text-[14px] tracking-[0.04em] text-ink-soft">{COPY.site.mastheadStrapline}</span>
          </div>
        </div>

        {/* THE SECTION BAR — the mockup's `.hdr`: sticky, OPAQUE, closed by a
            3px DOUBLE RULE, with the section links centred inside it.

            Opaque and unblurred on purpose. A frosted bar belongs to a design
            made of light; this one is made of ink on paper, and a translucent
            strip over a column of type is the one thing on the page that could
            not have been printed. The double rule is the heaviest line on the
            site and it is spent here, under the masthead, because that is the
            one place a newspaper uses it.

            The small wordmark at the left appears only below `lg` — above it
            the masthead above is doing that job, and the mockup hides it the
            same way. Below `sm` the masthead is gone entirely and this is the
            only mark on the page, which is why it is not hidden with the nav. */}
        <header className="rule-double sticky top-0 z-40 bg-cream">
          <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:justify-center">
            {/* `min-h-11` and `inline-flex`: below `lg` this is the only link
                in the bar and the only mark on the page, and a 22px-tall
                wordmark is half the 44px tap target. */}
            <Link href="/" className="font-display inline-flex min-h-11 shrink-0 items-center text-[22px] tracking-[-0.02em] text-ink lg:hidden">
              {COPY.site.wordmarkHead}<i className="font-semibold not-italic italic text-brand">{COPY.site.wordmarkTail}</i>
            </Link>
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href} className="flex">
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* NO FORM HERE. The top bar above carries it at every width —
                see the comment there — so the header is the mark and the nav
                and nothing else, which is how the mockup draws it. */}

            {/* Below lg the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              hideFrom="lg"
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Subscribe, a SECOND time, directly above the footer — the
            back-page coupon.

            The mockup has only the green ticker, and the ticker scrolls away:
            on a page this long, someone who reads to the end has no way in
            without going back up. So the band stays — on the deeper stock,
            between two full ink rules, which is the one band treatment this
            design has. Not a second green strip: the footer below opens on a
            6px green rule of its own, and two greens with 90px of page between
            them read as a mistake rather than as a pair. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-[110px] border-y border-ink bg-surface" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
              <div className="min-w-[260px] flex-[1_1_340px]">
                <span className="lbl block text-[13px] text-brand">{COPY.newsletter.bandKicker}</span>
                <h2 className="font-display mt-2.5 text-[clamp(30px,4vw,48px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="serif mt-3 max-w-[440px] text-[17.5px] font-medium italic text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the band carries the heading itself. */}
              <NewsletterForm compact className="min-w-[260px] flex-[1_1_380px] lg:max-w-[440px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: the INK ground, opened by a 6px
            GREEN RULE, carrying the brand and its line, Explore / Legal /
            Policies, and the legal bar.

            The green rule is the one place on the site where the mockup's
            BRIGHT green is correct at full strength: it carries no text, it
            sits on ink rather than on paper, and a 6px band is a graphic. It
            is also the page's last rule, which is how a printed page ends. */}
        <footer className="relative border-t-[6px] border-green bg-navy text-night-muted">
          <div className="relative mx-auto max-w-[1240px] px-4 pb-7 pt-16 sm:px-6">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="serif mt-4 text-[16.5px] text-night-muted">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-3`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                The mockup's `.age`: a 36px SQUARE drawn as an OUTLINE in the
                highlighter, not a fill. On the ink ground the yellow is
                13.71:1 either way, and the outline is the right one: a filled
                chip here would be the only solid block of colour in a footer
                made entirely of rules. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-[22px] text-[14px] text-night-muted">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center border-[1.5px] border-night-accent text-[12px] font-bold text-night-accent">18+</span>
                <span>
                  <b className="font-semibold text-night-ink">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px] text-night-faint">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
