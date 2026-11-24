import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses — the mockup's `.subh` + `.offers` pairs: a NARROW
 * CAPS subhead per bonus type with a hairline running off it to the right
 * margin, over a grid of that type's coupons.
 *
 * The rule-off-the-label is the device, and it is the same one the footer's
 * column heads and the section heads use at a different weight: on this site a
 * label is always announced by a line. It is drawn as a flex spacer with a
 * border rather than as a border on the heading, so it fills exactly the space
 * the words leave and nothing else.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since they all serve the same catalogue and a reader comparing
 * them should not meet the same block four times. The siblings wrap each type
 * in a card with a coloured head band; here there is no card and no colour at
 * all, just a label, a rule and the coupons beneath it.
 *
 * The count sits in the subhead and the link is pushed to the right edge.
 * Each subhead carries the type's name, this site's own `offers_count` for it,
 * and a link to the type's page. The count is resolved server-side over the
 * unlimited set, so it is the number of offers of this kind on the whole site
 * rather than the number of coupons under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the section index rows land on.
 *
 * Each grid is its own `offer-grid`, so the chip cycle RESTARTS per type: the
 * highlighter falls on the second coupon of each group rather than wandering
 * across group boundaries for no reason a reader could name.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-[52px]">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="lbl flex min-w-0 flex-1 items-center gap-3.5 text-[14px] text-ink">
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
              <span aria-hidden className="shrink-0 text-[13px] text-muted tabular-nums">{section.offers_count}</span>
              {/* The mockup's `.subh::after`: the rule that runs off the label
                  to the right margin. A spacer, not a border on the heading —
                  it has to start where the words end. */}
              <span aria-hidden className="h-px min-w-5 flex-1 bg-line" />
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="lbl inline-flex min-h-11 flex-none items-center text-[14px] tracking-[0.1em] text-brand transition-colors hover:text-ink"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1.5">→</span>
            </Link>
          </div>
          {section.description && <p className="serif mb-[18px] max-w-[640px] text-[16px] text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
