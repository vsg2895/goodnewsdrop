import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Inside this edition", from sites/goodnewsdrop.html (`.index` / `.ix`): a
 * CONTENTS PAGE. Two columns of rows, each with the type's icon, its name in
 * the serif, DOTTED LEADERS running across whatever gap is left, and the
 * offer count in narrow caps at the right margin.
 *
 * THE LEADERS ARE A DOTTED BORDER ON A FLEXIBLE SPACER, not a run of full
 * stops. A row of typed periods wraps when the row narrows, gets read out
 * character by character by a screen reader, and cannot be told to fill
 * exactly the space left between two items of unknown width. A flex spacer
 * with `border-bottom: 2px dotted` does all three correctly, costs nothing,
 * and is `aria-hidden` so it is never announced. It is dropped entirely below
 * 420px, where there is no gap left to lead across — the mockup's own rule.
 *
 * The baseline alignment is what makes it read as a contents page: the name,
 * the leaders and the count sit on one line with the dots slightly below it
 * (`translateY(-5px)` on the spacer, in globals.css), which is where a
 * typesetter puts them.
 *
 * A sibling — viglinksi, "the audit desk" — also uses dotted leaders for this
 * block. The two are deliberately different: that one is a single-column
 * dossier index in a grotesque, this one is two columns of serif names in a
 * newspaper's contents page with an icon on each row. The device is old
 * enough to belong to neither of them, but the difference is worth keeping.
 *
 * This component renders NO HEADING. The section's head — its title and
 * kicker — is drawn by the page's own `SectionHead`, and a second <h2>
 * carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each row opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <ul className="grid grid-cols-1 gap-x-14 min-[56.25rem]:grid-cols-2" role="list">
      {types.map((section) => (
        <li key={section.id} className="min-w-0">
          <Link href={`/bonuses/${section.slug}`} className="ix flex items-baseline gap-3 py-[18px]">
            {/* The type's own icon, as in the Bonus menu. A plain <img>:
                next/image refuses SVG. alt="" because the label names it.
                `self-center`, not baseline: an icon has no baseline and would
                otherwise hang below the line it belongs to. */}
            {section.icon_path && (
              <img src={resolveImageUrl(section.icon_path)!} alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0 self-center" />
            )}
            <b className="font-display min-w-0 truncate text-[20px] font-bold sm:text-[24px]">{section.name}</b>
            <span aria-hidden className="ix-dots hidden min-[26.25rem]:block" />
            <span className="ix-count lbl ml-auto shrink-0 text-[14px] tracking-[0.1em] text-muted transition-colors min-[26.25rem]:ml-0">
              {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
