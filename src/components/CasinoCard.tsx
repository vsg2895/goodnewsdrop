import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many regions a caption names before collapsing the rest into a count. */
const REGIONS_SHOWN = 2

/**
 * Exported so the edition column shows the same stars as a column does.
 *
 * The TEXT green #0A6E3C, not the mockup's bright #0E8F4F. The bright one is
 * 3.94:1 on a card and does clear the 3:1 a graphic is allowed — but a star
 * rating is the one place this design asks a colour to carry a VALUE rather
 * than to mark a thing, and the deep green reads it at 6.03. The exact figure
 * is printed beside the stars everywhere they appear, so the colour is never
 * the only carrier either way.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 15px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-green' : 'text-gold'
  const off = onDark ? 'text-night-line' : 'text-line'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the columns sit in — the mockup's `.list`: THREE across on a wide
 * screen, two on a tablet, one on a phone, with NO GAP AT ALL. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 *
 * The absence of a gap is the whole point and it is what makes this a page of
 * newsprint rather than a grid of cards: the columns touch, and the hairline
 * between them is a RULE shared by both, exactly as a newspaper sets its
 * columns. Every other site in this network puts space between its cards.
 *
 * `casino-list` draws the heavy rule across the top of the whole block and
 * decides which cells carry a right-hand rule — a `:nth-child` sum per column
 * count in globals.css, because the count changes at two breakpoints and the
 * container cannot know which cells are last in their row.
 */
export const CASINO_LIST = 'casino-list grid grid-cols-1 min-[45rem]:grid-cols-2 min-[68.75rem]:grid-cols-3'

/**
 * A casino as a COLUMN OF NEWSPRINT — `.cc` in sites/goodnewsdrop.html.
 *
 * NOT A CARD: no fill, no radius, no shadow, no border box. The paper shows
 * through and hairlines part it from its neighbours. Inside, the order is the
 * order a newspaper uses for a story — kicker, picture, caption, headline,
 * rating, pull quote, facts, actions.
 *
 * THE LEAD STORY is a different article, not a bigger card. When `rank === 1`
 * the column spans the whole width and splits into two of its own: picture and
 * caption at the left, everything else at the right, with the headline set up
 * to 60px and a red "Top story" flag on the kicker. A newspaper does not rank
 * by numbering — it ranks by column inches — which is also why NO RANK NUMERAL
 * appears anywhere, here or on any site in this network.
 *
 * `rank === 1` rather than `:first-child`, so page 2 of /casinos does not
 * promote its own first row to the front page.
 *
 * There is no hover state on the column. A printed column does not light up;
 * the HEADLINE underlines, which is what a headline in a list does, and that
 * is the whole affordance (`.cc:hover .cc-name` in globals.css).
 *
 * The mockup's `.facts` pair — MIN. DEPOSIT and PAYOUT — is NOT shipped: no
 * column in the API holds either, and a payout time is the one figure this
 * site has promised not to invent. The caption carries the regions instead,
 * which are real.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLead = rank === 1
  const section = casino.categories?.[0]?.name ?? ''

  /* The picture well: a halftone SCREEN over the deeper stock with the logo
     plate floating on it, and the caption in serif italic beneath — which is
     how a photograph is set on a page. The plate is white because operator
     artwork carries its own white ground baked into the file. */
  const picture = (
    <div className="flex flex-col gap-2.5">
      <div className="screen grid aspect-[16/9] place-items-center">
        <span className="clogo grid max-w-[84%] place-items-center overflow-hidden px-4 py-2.5 text-center">
          {image ? (
            <Image
              src={image}
              alt={`${casino.name} logo`}
              width={360}
              height={180}
              sizes={isLead ? '(min-width: 68.75rem) 560px, 92vw' : '(min-width: 68.75rem) 360px, 92vw'}
              className="max-h-[70px] w-full object-contain"
            />
          ) : (
            <span className="font-display text-[clamp(20px,2.2vw,30px)] font-extrabold leading-[1.05] text-ink [overflow-wrap:anywhere]">
              {casino.name}
            </span>
          )}
        </span>
      </div>
      <p className="serif text-[12.5px] italic text-muted">
        Pictured: {casino.name}
        {shownRegions.length > 0 && (
          <> · Available {shownRegions.map((c) => c.name).join(', ')}{extraRegions > 0 && ` +${extraRegions} more`}</>
        )}
      </p>
    </div>
  )

  /* Everything that is words: the headline, the rating, the pull quote and
     the actions. Shared by both layouts so the lead story and an ordinary
     column can never drift apart. */
  const story = (
    <>
      <div className="flex flex-col gap-2.5">
        <h3 className={`cc-name font-display text-ink [overflow-wrap:anywhere] ${isLead ? 'text-[clamp(34px,4.6vw,60px)]' : 'text-[28px] sm:text-[32px]'}`}>
          {/* `inline-flex min-h-11`: the headline IS the way into a review on
              this site, and at 28px its link box was 28px tall — under the
              44px tap target. A floor, not a fixed height, so a two-line
              operator name still grows the box instead of clipping it, and it
              changes nothing on the lead story, whose 60px line is already
              over. No negative margin: there is a 10px flex gap under this
              heading, so the extra height has nothing to overlap. */}
          <Link href={`/casinos/${casino.slug}`} className="inline-flex min-h-11 items-center">
            {casino.name}
          </Link>
        </h3>
        <p className="flex items-center gap-2.5">
          <Stars rating={casino.rating} />
          <span aria-hidden className="text-[14px] font-bold text-ink tabular-nums">{casino.rating.toFixed(1)} / 5</span>
        </p>
      </div>

      {/* THE PULL QUOTE — the welcome bonus, set in the serif between two full
          ink rules, which is the device a paper uses to lift a sentence out of
          a column. The rules are ink, not hairline: a pull quote parted by the
          same line as the column around it does not read as lifted.
          Dropped entirely when the operator has none. */}
      {casino.bonuses && (
        <div className={`pull serif py-3 font-semibold leading-[1.25] text-ink [overflow-wrap:anywhere] ${isLead ? 'text-[clamp(22px,2.6vw,32px)]' : 'text-[22px]'}`}>
          <small className="lbl mb-1 block text-[12px] text-muted">Welcome bonus</small>
          “{casino.bonuses}”
        </div>
      )}

      {/* `mt-auto` ONLY in an ordinary column, where it lands every card in a
          row of three on the same baseline. In the LEAD it would push the
          actions to the foot of a 330px picture and leave ~190px of blank
          paper between the pull quote and the buttons — the mockup fills that
          with its min. deposit / payout pair, which this site does not ship,
          so the column simply stacks from the top instead. */}
      <div className={`flex flex-wrap items-center gap-4 pt-1 ${isLead ? '' : 'mt-auto'}`}>
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] px-5 text-[15px]"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="lbl inline-flex min-h-11 items-center text-[14px] tracking-[0.08em] text-brand transition-colors hover:text-ink">
          {COPY.casinos.readReview} <span aria-hidden className="ml-1.5">→</span>
        </Link>
      </div>
    </>
  )

  const kicker = (
    <div className="lbl flex items-center gap-2.5 text-[12.5px] text-brand">
      {isLead && <span className="flag px-2 py-[3px]">{COPY.casinos.topPick}</span>}
      {section && <span className="min-w-0 truncate">{section}</span>}
    </div>
  )

  return (
    /* `cc-lead` IS ON THE <li>, because the <li> is the grid item and
       `grid-column` means nothing anywhere else — see globals.css. */
    <li className={isLead ? 'cc-lead flex' : 'flex'}>
      {isLead ? (
        /* THE LEAD STORY. Two columns of its own from 56.25rem, stacked
           below it — the mockup's own breakpoint. `items-start` so the
           picture does not stretch to the height of the text beside it. */
        <article className="cc grid w-full grid-cols-1 items-start gap-x-11 gap-y-5 py-[30px] min-[56.25rem]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3.5">
            {kicker}
            {picture}
          </div>
          <div className="flex flex-col gap-4">{story}</div>
        </article>
      ) : (
        <article className="cc flex w-full flex-col gap-3.5 px-0 py-[26px] min-[45rem]:px-7">
          {kicker}
          {picture}
          {story}
        </article>
      )}
    </li>
  )
}
