import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3


/**
 * Splits a sentence around one phrase so the page can set that phrase in the
 * HIGHLIGHTER — the mockup's `<mark>` in the front-page deck.
 *
 * The phrase is named in COPY rather than marked up there, so the deck stays
 * plain text and can go straight into a <title> or a JSON-LD field with no
 * tags to strip. If the phrase ever stops matching the sentence (an edit to
 * one and not the other), this returns the sentence whole and the deck simply
 * renders unmarked — a missing highlight, not a broken paragraph.
 */
function splitOnPhrase(text: string, phrase: string): [string, string, string] {
  const at = phrase ? text.indexOf(phrase) : -1
  if (at === -1) return [text, '', '']
  return [text.slice(0, at), phrase, text.slice(at + phrase.length)]
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* THE FRONT PAGE — the mockup's `.front`: a lead story at the left
            and the edition column at the right, parted by a VERTICAL
            HAIRLINE and closed by a full rule.

            The rule between the columns is the whole device, and it is drawn
            on the LEAD STORY's right edge rather than on the container,
            because when the two stack below 56.25rem it has to become a
            HORIZONTAL rule under the lead story instead. One border that
            moves from right to bottom at a breakpoint does both jobs; a rule
            on the container could not.

            `.slab` keeps its name so the shared class vocabulary holds across
            the network; here it is the full-width rule that closes the whole
            front page. */}
        <section className="slab pb-14 pt-10" aria-labelledby="front-headline">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <div className="grid grid-cols-1 min-[56.25rem]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="border-b border-ink pb-9 min-[56.25rem]:border-b-0 min-[56.25rem]:border-r min-[56.25rem]:pb-0 min-[56.25rem]:pr-11">
                <span className="lbl block text-[13px] text-brand">{COPY.home.heroEyebrow}</span>
                <h1
                  id="front-headline"
                  className="font-display mt-4 mb-[22px] text-[clamp(42px,6.6vw,92px)] tracking-[-0.03em] text-balance text-ink"
                >
                  {COPY.home.heroHeadline}{' '}
                  {/* The mockup sets this phrase in a serif ITALIC at a
                      LIGHTER weight than the headline around it — 600 against
                      700 — which is what keeps an italic from looking like a
                      mistake at 92px. The colour is the deep press green: the
                      mockup's bright one is 3.62:1 on this paper, and while a
                      92px word is display text and would clear 3:1, the same
                      token is reused on every section head down to 36px and
                      in the FAQ's `Q.` at 24px, where it would not. One green
                      for one job. */}
                  <em className="font-semibold not-italic italic text-brand">{COPY.home.heroHighlight}</em>
                  {COPY.home.heroHeadlineTail}
                </h1>
                {/* THE DECK, in the serif, with one phrase highlighted. */}
                <p className="serif mb-7 max-w-[640px] text-[clamp(19px,2.1vw,24px)] font-medium leading-[1.4] text-ink-soft">
                  {(() => {
                    const [before, mark, after] = splitOnPhrase(COPY.home.heroSubtitle, COPY.home.heroSubtitleMark)
                    return mark ? (
                      <>
                        {before}
                        <span className="hl">{mark}</span>
                        {after}
                      </>
                    ) : (
                      COPY.home.heroSubtitle
                    )
                  })()}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/casinos" className="btn-or min-h-[54px] px-7 text-[16px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln min-h-[54px] px-7 text-[16px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
                {/* The byline. The mockup's second half claims every casino is
                    tested with real money; this one says where the figures
                    actually come from. */}
                <p className="mt-[30px] flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line pt-[18px] text-[14.5px] text-muted">
                  <span>By <b className="font-semibold text-ink">{COPY.home.heroBylineName}</b></span>
                  <span aria-hidden>·</span>
                  <span>{COPY.home.heroBylineNote}</span>
                </p>
              </div>

              {/* THE EDITION COLUMN — the mockup's `.edition`: what else is
                  inside today, listed the way a paper lists it. No cards, no
                  plates, no rank numbers: a kicker, a serif headline and a
                  line of detail, parted by hairlines. */}
              {casinos.length >= 3 && (
                <aside aria-labelledby="edition-heading" className="min-w-0 pt-7 min-[56.25rem]:pl-9 min-[56.25rem]:pt-0">
                  <h2
                    id="edition-heading"
                    className="lbl mb-1 flex items-baseline justify-between gap-3 border-b-[3px] border-ink pb-2.5 text-[13px] text-ink"
                  >
                    {COPY.home.podiumTitle} <span className="text-brand">{COPY.home.podiumBadge}</span>
                  </h2>
                  <ol className="picks">
                    {casinos.slice(0, 3).map((c) => (
                      <li key={c.id}>
                        <Link href={`/casinos/${c.slug}`} className="pick block py-[18px] text-ink">
                          {/* The kicker is the REGIONS, not the category.
                              This list is the top three OF THE SELECTED
                              category, so a category kicker is identical on
                              all three rows by construction — three lines of
                              "MOST POPULAR" stacked, which is noise dressed
                              as information. The regions differ per row and
                              are the other thing a reader is actually
                              choosing on. Falls back to the section label
                              when an operator has no regions recorded. */}
                          <span className="lbl block text-[12px] text-brand">
                            {(c.countries ?? []).length > 0
                              ? (c.countries ?? []).slice(0, 2).map((x) => x.name).join(' · ')
                              : COPY.home.rankingLabel}
                          </span>
                          {/* The headline. The operator's name and the bonus
                              it is running, which is what a listing of stories
                              inside an edition is: a name and what happened. */}
                          <b className="pick-name font-display my-1.5 block text-[22px] leading-[1.1] text-ink [overflow-wrap:anywhere] sm:text-[26px]">
                            {c.name}{c.bonuses ? `: ${c.bonuses}` : ''}
                          </b>
                          {/* The mockup's detail line prints a MIN. DEPOSIT.
                              Nothing in the API holds one, so this carries the
                              rating, which is real. */}
                          <small className="block text-[14.5px] text-ink-soft">
                            {COPY.home.podiumRatingLabel} {c.rating.toFixed(1)} / 5
                          </small>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  {/* The mockup's `.weather` box forecasts crypto withdrawals
                      clearing in under an hour. There is no payout data here
                      and there never will be, so the box carries what this
                      site DOES do on a schedule — the weekly pass — which is
                      the same shape of promise and a true one. */}
                  <p className="mt-5 flex items-start gap-3.5 bg-green-light px-5 py-[18px] text-[14.5px] text-ink-soft">
                    <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
                    </svg>
                    <span>
                      <b className="font-semibold text-ink">{COPY.home.monitorTitle}:</b>{' '}
                      {COPY.home.monitorNote}
                    </span>
                  </p>
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* 1 — the rankings. Section tabs, then the casinos as COLUMNS. */}
        <section className="pt-16 sm:pt-[84px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <SectionHead
              id="top-casinos-heading"
              eyebrow={COPY.home.rankingLabel}
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              /* The mockup's `.empty`: no box at all, just a line of serif
                 italic in the middle of the empty column — which is what a
                 paper prints when a section has nothing in it this week. */
              <p className="serif border-t border-line p-11 text-center text-[19px] italic text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-7 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-14 px-[30px] text-[16.5px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2 — the bonus types, as a SECTION INDEX with dotted leaders.
            Nothing at all without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-16 sm:pt-[84px]" aria-labelledby="bonus-types-heading">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
              <SectionHead id="bonus-types-heading" eyebrow={COPY.home.bonusTypesKicker} title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 3 — the offers, as CLIP-OUT COUPONS grouped by type. */}
        {bonusSections.length > 0 ? (
          <section className="pt-16 sm:pt-[84px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
              <SectionHead
                id="bonus-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-16 sm:pt-[84px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
              <SectionHead
                id="offers-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — how a casino earns its place. Not in the mockup, which ends at
            the FAQ; kept because it is the page's only account of where the
            ranking comes from, and an affiliate site that ranks operators
            without publishing its method is asking to be taken on trust. */}
        <section className="pt-16 sm:pt-[84px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <SectionHead id="method-heading" eyebrow={COPY.home.methodLabel} title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-x-11 gap-y-0 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step pb-7 pt-[18px]">
                  <p className="lbl flex items-baseline gap-3.5 text-[13px] text-brand">
                    {/* The step number as a big serif FIGURE, not a plate —
                        there is no plate, no disc and no chip anywhere on this
                        page. A column of newsprint numbers its points with
                        type. */}
                    <span aria-hidden className="font-display text-[28px] font-bold leading-none tracking-[-0.02em] text-ink">
                      {step.no}
                    </span>
                    {step.verb}
                  </p>
                  <h3 className="font-display mt-3.5 text-[22px] text-ink">{step.title}</h3>
                  <p className="serif mt-2.5 text-[16.5px] leading-[1.6] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-center gap-3 border-t border-ink pt-5 text-[15px] text-muted">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span className="serif italic">{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — the FAQ as LETTERS TO THE EDITOR. Every answer is in the HTML,
            open or closed, which the FAQPage schema requires. */}
        <section className="pt-16 sm:pt-[84px]" aria-labelledby="faq-heading">
          {/* NARROWER than every other section — the mockup's `.narrow`, 800px.
              An answer is a paragraph set in the serif at 17.5px, and a
              paragraph that wide runs past the ~75-character measure where a
              reader starts losing the start of the next line. A newspaper
              never sets body copy across the full page either. */}
          <div className="mx-auto max-w-[800px] px-4 sm:px-6">
            <SectionHead id="faq-heading" eyebrow={COPY.home.faqLabel} title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: a KICKER, then the heading with its last word set
 * in the serif ITALIC green, a standfirst in italic beneath it, and an
 * optional link to the full list pushed to the right edge — all sitting on a
 * 3px RULE, which is how a newspaper opens a section.
 *
 * The rule is the point. Every section on this page is announced by a heavy
 * line under its name and by nothing else: no card, no band, no background.
 * It is the same gesture as the double rule under the nav, one weight down.
 *
 * The kicker is `aria-hidden`. It is a second, shorter name for the same
 * section — "The rankings" over "Casinos, and what moved" — and announcing
 * both would read the heading twice.
 *
 * The heading splits on its LAST SPACE so the tail can take the italic. A
 * one-word heading therefore goes entirely italic, which is why the copy
 * keeps those to two words (see `COPY.home.bonus`). The split is done here
 * rather than in the copy so the strings stay plain text, readable in a
 * <title> and in JSON-LD with no markup to strip.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 */
function SectionHead({
  id,
  eyebrow,
  title,
  subtitle,
  more,
}: {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  const cut = title.lastIndexOf(' ')
  const head = cut === -1 ? '' : title.slice(0, cut)
  const tail = cut === -1 ? title : title.slice(cut + 1)

  return (
    <div className="rule-head mb-[26px] flex flex-wrap items-end justify-between gap-x-5 gap-y-3 pb-4">
      <div className="min-w-0 flex-[1_1_28rem]">
        {eyebrow && (
          <span aria-hidden className="lbl mb-2.5 block text-[13px] text-brand">
            {eyebrow}
          </span>
        )}
        <h2 id={id} className="font-display text-[34px] text-ink sm:text-[clamp(36px,4.8vw,58px)]">
          {head && <>{head} </>}
          <em className="font-semibold not-italic italic text-brand">{tail}</em>
        </h2>
        {subtitle && (
          <p className="serif mt-2 max-w-[640px] text-[17px] font-medium italic text-ink-soft">{subtitle}</p>
        )}
      </div>
      {more && (
        <Link href={more.href} className="lbl inline-flex min-h-11 flex-none items-center text-[14px] tracking-[0.1em] text-brand transition-colors hover:text-ink">
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden className="ml-1.5">→</span>
        </Link>
      )}
    </div>
  )
}
