'use client'

import { useState } from 'react'
import { COPY } from '@/constants/copy'
import { useToast } from '@/components/ToastProvider'
import { isValidEmail } from '@/lib/email'

/**
 * `compact` means NO INTRO — the field and the button alone, without the title
 * and subtitle the component otherwise prints above them.
 *
 * Both of this site's capture points are compact: the band above the footer
 * already carries an <h2> and its line, and the header has room for a field
 * and nothing else. Letting the form print its own pair on the band would
 * publish both twice, once as a heading and once as a paragraph. The
 * accessible name still carries the copy either way (`aria-label` on the form).
 *
 * It does NOT mean "small": every mode is 48px, over the 44px tap target.
 *
 * `tone` is which GROUND the form is standing on, and it exists because this
 * site has two, one DARK and one light:
 *
 *   'bar'  — the GREEN TICKER, this site's primary capture point, present at
 *            every width. The mockup's `.hsub`: ONE 1.5px white box around
 *            both controls with NO GAP between them, the field transparent so
 *            the green reads straight through it, and the key a solid white
 *            block at the end. It is a printed form on a coloured strip, and
 *            the single enclosing rule is what makes it one object rather than
 *            two floating on the green.
 *   'band' — the deeper-stock block above the footer. The same single box,
 *            drawn in INK instead of white, with the green key at the end.
 *
 * A boolean would have been enough today and wrong tomorrow: the next ground
 * this form lands on gets its own name here rather than a second flag.
 */
export default function NewsletterForm({
  compact = false,
  tone = 'band',
  className = '',
}: {
  compact?: boolean
  tone?: 'band' | 'bar'
  className?: string
}) {
  const onBar = tone === 'bar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [website, setWebsite] = useState('')
  // A domain-typo correction from SendGrid, e.g. user@gmial.com -> gmail.com.
  // The ONLY validation detail ever shown to a visitor: it is about their own
  // address, and it turns a dead form into a corrected signup.
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null)
  const toast = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setLoading(true)
    setSuggestedEmail(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      if (!res.ok) {
        // Surface backend validation (e.g. 422 "You are already subscribed.").
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          errors?: { email?: string[] }
          suggested_email?: string | null
        }

        setSuggestedEmail(data.suggested_email ?? null)
        toast(data.errors?.email?.[0] ?? data.message ?? COPY.newsletter.error, 'error')
        return
      }
      // The API reports whether a verification email is actually going out
      // (`email_sent` mirrors the site's newsletter_emails_enabled switch).
      // Telling someone to watch their inbox — and dig through spam — for mail
      // this site is not sending would be a worse failure than not collecting
      // the address at all.
      const { email_sent: emailSent } = (await res.json().catch(() => ({}))) as { email_sent?: boolean }

      // Keep the form in place; confirm via a top-corner toast.
      toast(emailSent === false ? COPY.newsletter.successNoEmail : COPY.newsletter.success, 'success')
      setEmail('')
    } catch {
      toast(COPY.newsletter.error, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? `min-w-0 ${className}`.trim() : `flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      {/* The strip's introduction. The compact form drops it: see above. */}
      {!compact && (
        <div className="min-w-0 flex-[1_1_360px]">
          <p className="font-display text-[22px] font-bold leading-tight text-ink">{COPY.newsletter.title}</p>
          {/* 14px on a phone, 13px from `sm` up. Below `lg` this strip is the
            ONLY subscribe path on the site (the header pill drops its form),
            so the line that explains what you get has to clear the project's
            14px phone readability floor — which the globals.css rule only
            raises for `.text-xs`, not for a literal size. */}
        <p className="mt-1 text-sm text-ink-soft sm:text-[13.5px]">{COPY.newsletter.subtitle}</p>
        </div>
      )}

      <div className={compact ? 'w-full min-w-0' : 'w-full min-w-0 flex-[0_1_420px]'}>
        {/* Field and button share one row at every width, as in the mockup;
            `min-w-0` lets the field give way so the button never wraps. */}
        <form
          onSubmit={onSubmit}
          // The bar mode draws ONE pill around both controls — the mockup's
          // `.hsub` — and lights its border red while anything inside has
          // focus. The band mode keeps them as two separate shapes.
          // THE BAR FORM IS A ROW AT EVERY WIDTH, where the band's stacks on a
          // phone. The bar sits at the very top of every page, so stacking it
          // spends ~56px of the first screen on a signup nobody arrived for —
          // and it does not need the height: the field gives way (`min-w-0`
          // plus `flex-1`) and the key tightens its padding, which is exactly
          // what the mockup does at 440px rather than breaking the row. The
          // band has a whole section to itself and can stack.
          // ONE BOX AROUND BOTH CONTROLS, in both tones, and NO GAP — the
          // mockup's `.hsub{display:flex;gap:0;border:1.5px solid}`. The box
          // is the form's own border; the field and the key have none of
          // their own, which is what makes them read as two halves of one
          // printed field rather than as two controls side by side.
          //
          // A ROW AT EVERY WIDTH in both tones. The ticker sits at the very
          // top of every page, so stacking it would spend ~50px of the first
          // screen; it does not need the height, because the field gives way
          // (`min-w-0` plus `flex-1`) and the key tightens its padding, which
          // is what the mockup does at 420px rather than breaking the row.
          className={
            onBar
              ? 'relative flex flex-row border-[1.5px] border-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-accent'
              : 'relative flex flex-row border-[1.5px] border-ink focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-brand'
          }
          aria-label={`${COPY.newsletter.title} ${COPY.newsletter.subtitle}`}
        >

          {/* HONEYPOT. Never shown, never focusable, never autofilled — a human
              cannot reach it, a naive bot fills every field it finds. The server
              rejects any request that carries a value, before the site is
              touched and long before a paid validation credit could be spent.
              Positioned off-screen rather than display:none, which some bots
              skip. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            // Hidden by an INLINE STYLE, deliberately not by a Tailwind class.
            // The class was a real bug: utility CSS can load late, fail, or be
            // purged, and for as long as it is missing this renders as an
            // ordinary focusable text input sitting in the middle of the
            // subscribe form. A person who types into it gets their signup
            // rejected as a bot — an anti-bot measure silently turning away the
            // humans it exists to protect. An inline style travels inside the
            // HTML, so it cannot desync from the markup that carries it.
            //
            // Still off-screen rather than display:none or the hidden
            // attribute: a honeypot only works while a bot believes the field
            // is real, and the obvious ways of hiding it are the ways a bot
            // checks for. pointer-events:none means that even a rendering
            // accident cannot let a human click into it.
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.newsletter.placeholder}
            aria-label={COPY.newsletter.placeholder}
            autoComplete="email"
            // 48px in BOTH tones. `compact` means "no intro", not "small":
            // the sibling sites shrink the field to 42px for a header pill,
            // and 42px is under the 44px tap target.
            // `flex-1` IS BREAKPOINT-PREFIXED, and that is load-bearing.
            // The band form is `flex-col` on a phone and only becomes a row
            // further up. `flex-1` is `flex: 1 1 0%`, and flex-basis applies
            // to the MAIN axis — so in column mode it zeroed the field's
            // HEIGHT, and the `h-12` beside it lost: the subscribe field
            // shipped 22.5px tall on a phone, half its size and half the tap
            // target. In row mode it is still needed, or `w-full` takes the
            // whole line and pushes the key out. So it applies only from the
            // width the form actually becomes a row.
            //
            // TRANSPARENT and BORDERLESS in both tones: the enclosing box on
            // the <form> is the only edge, and on the ticker the green has to
            // read straight through the field for the pair to look printed on
            // the strip rather than laid over it.
            //
            // The focus ring is therefore on the FORM, not here — see above —
            // because a ring drawn around a borderless field inside a box
            // would be a second rectangle 1.5px inside the first. It takes the
            // colour that is visible on each ground: the highlighter on the
            // green (13.71:1 against the ink of its own outline, and plainly
            // visible against the green), the brand green on the paper.
            //
            // The placeholder on the ticker is the mockup's #CDEBD9, which is
            // 4.98:1 on the deep green it now sits on.
            className={
              onBar
                ? 'h-11 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3.5 text-[14.5px] text-white placeholder:text-[#cdebd9] focus:outline-none'
                : 'h-12 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 text-[15px] text-ink placeholder:text-muted focus:outline-none'
            }
          />
          <button
            type="submit"
            disabled={loading}
            // WHITE on the green ticker, reading the deep green back (6.35:1
            // either way — the mockup's own inversion), and the green itself
            // on the paper band. Both take the HIGHLIGHTER on hover.
            //
            // 44px on the ticker rather than the mockup's 38px: this strip is
            // on screen at every width including phones, and 38px is under the
            // 44px tap target. The band keeps 48px.
            className={
              onBar
                ? 'btn-on-dark h-11 shrink-0 whitespace-nowrap px-3 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 min-[27.5rem]:px-4'
                : 'btn-or h-12 shrink-0 whitespace-nowrap px-4 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 min-[27.5rem]:px-[18px]'
            }
          >
            {loading ? COPY.newsletter.checking : COPY.newsletter.button}
          </button>
        </form>

        {/* One click swaps the address in and resubmits. The corrected address
            is a DIFFERENT cache key upstream, so it gets its own validation
            call rather than reusing the typo's verdict. */}
        {suggestedEmail && (
          <p className="mt-2 text-sm text-ink-soft">
            Did you mean{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestedEmail); setSuggestedEmail(null) }}
              className="font-semibold underline underline-offset-2"
            >
              {suggestedEmail}
            </button>
            ?
          </p>
        )}
      </div>
    </div>
  )
}
