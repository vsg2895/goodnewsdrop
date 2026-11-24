import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Good News Drop section tabs, from sites/goodnewsdrop.html (`.filters` /
 * `.tab`): a strip of narrow caps parted by hairlines, with each tab's casino
 * count set in a serif ITALIC beside it. The current one is marked by a 3px
 * GREEN UNDERLINE and by nothing else — no fill, no box, no border.
 *
 * That underline is the one job the mockup's bright green does well: it is a
 * graphic at 3.62:1 on the paper, it carries no text, and it is the same
 * gesture a newspaper uses to mark the section you are reading.
 *
 * THIS ROW SCROLLS SIDEWAYS, where the siblings' chips wrap. It is the one
 * place this design departs from the network's chip rule, and the mockup is
 * right about it: these tabs are a single continuous rule-divided strip, and a
 * strip that wraps onto three lines stops being a strip. `.no-scrollbar`
 * hides the bar itself; the hairlines running off the right edge are what say
 * there is more.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. Removing it also returns the strip to the full width of the
 * row, which is most of why seven tabs fit without scrolling on a laptop.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-7">
      <ul className="no-scrollbar flex flex-nowrap overflow-x-auto border-l border-line min-[56.25rem]:border-l-0" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="flex flex-none">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab lbl flex min-h-[46px] items-center gap-[7px] whitespace-nowrap px-[13px] text-[13.5px] tracking-[0.04em] sm:text-[14px] ${
                  active ? 'tab-on' : ''
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab .n`: a serif ITALIC figure, not a chip
                     or a disc — there is no chip anywhere on this site. Its
                     face and both its colours live in globals.css beside
                     `.tab-on`, for the same layering reason the active tab
                     does. */
                  <span className="tab-count text-[15px] tabular-nums">{c.casinos_count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
