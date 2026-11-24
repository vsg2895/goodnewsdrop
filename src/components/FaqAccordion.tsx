type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/goodnewsdrop.html (`.faq` / `.fq`): LETTERS TO THE
 * EDITOR. No cards and no boxes — a list parted by hairlines, each row opening
 * with an italic serif `Q.` in green, the question beside it, and a `+` at the
 * right that rotates into a cross and turns green while the answer is open.
 *
 * THE `A.` PREFIX IS DRAWN BY CSS, not written into the copy
 * (`.fq-answer::before` in globals.css). That is not a style preference: this
 * same array is emitted as FAQPage structured data, and an "A. " typed into
 * each string would be published to Google as part of every answer.
 *
 * The `Q.` is a real element rather than a second `::before`, because it has
 * to sit in its own grid column so every question starts at the same
 * x-position however the rows differ. It is `aria-hidden` — a screen reader
 * announcing "Q." before each question and "A." before each answer would be
 * reading the typography, and the <details>/<summary> pair already says which
 * is which.
 *
 * The question is set in the SERIF at 700, which on this site is the one
 * exception to "labels in Archivo Narrow, text in Archivo": a letter to the
 * editor is editorial copy, and this whole section is set as such — question
 * and answer both in Newsreader, like the articles.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only the `+` shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid grid-cols-1">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="fq group">
          <summary className="grid cursor-pointer list-none grid-cols-[28px_minmax(0,1fr)_30px] items-baseline gap-3 py-[22px] [&::-webkit-details-marker]:hidden sm:grid-cols-[34px_minmax(0,1fr)_30px]">
            <span aria-hidden className="font-display text-[22px] font-bold italic text-brand sm:text-[24px]">
              Q.
            </span>
            <h3 className="fq-q font-display text-[20px] font-bold leading-[1.2] tracking-[-0.01em] text-ink [overflow-wrap:anywhere] sm:text-[24px]">
              {item.question}
            </h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span aria-hidden className="pm lbl self-center text-right text-[24px] leading-none text-ink">
              +
            </span>
          </summary>
          {/* Indented to the question's column, so the `Q.` hangs in the
              margin of its own answer — the mockup's `padding: 0 42px 24px
              46px`. It drops to a flat 38px below `sm`, where the `Q.` column
              itself narrows. */}
          <p className="fq-answer serif pb-6 pl-[38px] pr-0 text-[17px] leading-[1.7] text-ink-soft sm:pl-[46px] sm:pr-10 sm:text-[17.5px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
