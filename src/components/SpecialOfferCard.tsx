import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid the coupons sit in — the mockup's `.offers`:
 * `minmax(min(100%,320px),1fr)` with a 26px gutter.
 *
 * A GAP here, where the casino columns have none, and the difference is
 * deliberate: those are columns of one page and these are separate things
 * lying on it. A coupon has been cut out, so it has air around it.
 *
 * `auto-fit` rather than `auto-fill` so a row holding one coupon gives it the
 * whole row instead of parking it beside two empty tracks.
 *
 * `offer-grid` drives the `:nth-child` cycle on the type chip — the mockup's
 * own, which turns every second coupon's chip to the HIGHLIGHTER. A CSS cycle
 * is right HERE and wrong on the bonus types: the colour is rhythm and carries
 * no meaning, so repainting it when the set changes costs nothing.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-[26px] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/goodnewsdrop.html:
 * a CLIP-OUT COUPON. A 2px DASHED box on the brighter stock, with a pair of
 * SCISSORS notched into its top rule.
 *
 * THE NOTCH IS A REAL GAP IN THE DASHES, and that is the whole trick. The
 * scissors sit ON the border line (`top: -13px`) carrying the PAGE's own
 * background — `--color-cream`, not the coupon's own fill — so the dashed
 * rule stops either side of the mark instead of running underneath it. Give
 * the mark the coupon's fill and it reads as a sticker lying on top of an
 * unbroken line, which is the one detail that gives the whole thing away.
 * That is also why the coupon's hover goes to pure white while the notch
 * stays cream: the notch belongs to the page, not to the coupon.
 *
 * `logo` is ACCEPTED AND UNUSED, on purpose. A casino page passes its own logo
 * down because the offers it lists arrive without their casino attached, and
 * every sibling's card paints that mark somewhere. This one does not: a
 * printed coupon names its issuer in words, and the space goes to the amount.
 * The prop stays in the signature so a caller written against any site in the
 * network still compiles.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  const kind = offer.bonus_category_name ?? 'Bonus'
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="offer flex flex-col gap-2.5 px-6 pb-[22px] pt-[26px]">
      {/* The scissors. `aria-hidden`: it is the cut line, not information. */}
      <span aria-hidden className="offer-scissors">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.7">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
        </svg>
      </span>

      <div className="flex items-center justify-between gap-2.5">
        <span className="lbl min-w-0 truncate text-[14px] tracking-[0.1em] text-ink">
          {casinoName || kind}
        </span>
        {/* The type chip. The mint tint with the deep green on it (5.17:1);
            every second coupon takes the HIGHLIGHTER instead — the mockup's
            own cycle, and rhythm rather than meaning. Both fills live in
            globals.css beside the cycle that drives them. */}
        <span className="o-kind lbl flex-none px-2.5 py-1 text-[12px] tracking-[0.1em]">
          {kind}
        </span>
      </div>

      {/* THE AMOUNT, which is what you are clipping the coupon for. */}
      <h3 className="font-display py-1.5 text-[31px] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink [overflow-wrap:anywhere]">
        <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {offer.bonuses || offer.title}
        </Link>
      </h3>

      {/* When the headline above is the AMOUNT, the offer's own name still has
          to appear somewhere — otherwise two different offers of the same size
          are indistinguishable in a grid. */}
      {offer.bonuses && (
        <p className="serif text-[15.5px] text-ink-soft [overflow-wrap:anywhere]">{offer.title}</p>
      )}

      {/* The coupon's foot — the mockup's `.o-foot`: the small print at the
          left and the way in at the right, over a hairline.

          `relative z-10` lifts it over the heading's stretched link, or the
          card-wide hit area would swallow the control inside it. */}
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
        <small className="text-[12.5px] text-muted">T&amp;Cs apply · 18+</small>
        {/*
          * Claim belongs to the Special Offers bonus type and to nothing else.
          *
          *   Special Offers + link   ->  Claim -> the casino
          *   Special Offers, NO link ->  Claim, leading to the offer's own page,
          *                               where the terms and the operator are.
          *   any other bonus type    ->  "Redeem", the plain way in.
          */}
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat min-h-11 whitespace-nowrap px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat min-h-11 whitespace-nowrap px-4 text-sm">Claim</Link>
          )
        ) : (
          <Link href={`/special-offers/${offer.slug}`} className="lbl inline-flex min-h-11 items-center whitespace-nowrap text-[14px] tracking-[0.08em] text-brand transition-colors hover:text-ink">
            Redeem <span aria-hidden className="ml-1.5">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the deeper cream on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the circle. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-none border border-ink bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="lbl text-[12px] text-brand">{kicker}</p>}
        <Heading className="font-display text-[17px] font-bold leading-[1.25] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="font-display text-[15px] font-semibold text-ink [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="lbl text-[13px] tracking-[0.08em] text-brand">Details →</span>
        )}
      </div>
    </li>
  )
}
