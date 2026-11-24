import Link from 'next/link'

/**
 * Good News Drop brand mark, from sites/goodnewsdrop.html: a DROP with a face
 * in it. A green teardrop, two eyes and a smile cut out of it in the paper
 * colour, and two yellow speed lines trailing off the shoulders — a drop
 * falling, which is the name, and smiling, which is the rest of it.
 *
 * The cut-outs are the paper colour rather than white: this mark sits on
 * newsprint, and a white smile on a green drop on a cream page reads as a
 * third colour rather than as a hole punched through.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * THE WORDMARK IS A MASTHEAD, which is why it is set so much larger than any
 * sibling's: 44px on the centred masthead against the ~25px the others use.
 * `GoodNews` upright, `Drop` in a real ITALIC at a lighter weight — Newsreader
 * ships a true italic, so this is a drawn italic and not a slant.
 *
 * The tail is `--color-brand` #0A6E3C and not the mockup's bright #0E8F4F,
 * which is 3.62:1 on this paper. On the INK footer the relationship inverts
 * and the bright green would be 1.1:1, so `onDark` takes the mockup's own
 * #5FD497 (9.43:1) rather than lightening the deep one.
 *
 * NO TAGLINE. Every sibling's logo carries one; this one must not, because
 * the masthead already sets a strapline in its right-hand slot and the two
 * would say the same thing twice, six inches apart. `taglineClassName` stays
 * in the signature so a caller written against any site still compiles.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  /* ACCEPTED AND NEVER READ. Every sibling's Logo hides its tagline with this
     where the header runs out of room; this one has no tagline to hide (the
     masthead's own strapline says it instead), but the prop stays in the type
     so a caller written against any site in the network still compiles. It is
     deliberately NOT destructured — binding it only to ignore it is an unused
     variable, and naming it `_taglineClassName` does not satisfy the lint rule
     this project runs. */
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg
        viewBox="0 0 50 58"
        className={onDark ? 'h-[46px] w-10 shrink-0' : 'h-[50px] w-[43px] shrink-0 sm:h-[58px] sm:w-[50px]'}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M25 2C25 2 5 24 5 37a20 20 0 0040 0C45 24 25 2 25 2z" fill="#0e8f4f" />
        <path d="M16 37a9 9 0 0018 0" fill="none" stroke="#fbf9f4" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="19" cy="29" r="2.4" fill="#fbf9f4" />
        <circle cx="31" cy="29" r="2.4" fill="#fbf9f4" />
        {/* The speed lines, which are what make it FALL rather than hang. */}
        <path d="M12 20l-6-4M38 20l6-4" stroke="#ffe45c" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[32px] tracking-[-0.03em] sm:text-[44px] ${
            onDark ? 'text-paper' : 'text-ink'
          } ${onDark ? 'sm:text-[32px]' : ''}`.trim()}
        >
          GoodNews
          <i className={`font-semibold italic ${onDark ? 'text-night-green' : 'text-brand'}`}>Drop</i>
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
