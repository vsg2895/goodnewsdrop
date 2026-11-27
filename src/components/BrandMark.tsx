/**
 * The Good News Drop mark — a falling drop with a face in it.
 *
 * SAME ARTWORK AS THE FAVICON, inlined rather than loaded from
 * `/public/icon.svg` as an <img>. Three reasons, in order of how much they
 * matter here:
 *
 * 1. It inherits `currentColor` for nothing — except it deliberately does not:
 *    the mark is two fixed brand colours and a paper cut-out, and a header
 *    that recoloured it would stop matching the tab icon beside it.
 * 2. No second request, and no flash of nothing while it arrives. At 26px in
 *    a sticky header that flash is the whole render.
 * 3. The cut-outs have to be the PAPER colour, not white — see icon.svg. An
 *    <img> would carry its own background assumption; inline, the shape is
 *    just the shape.
 *
 * `aria-hidden`: the link it sits in already says "GoodNewsDrop" in text, so
 * announcing the mark as well would read the brand twice.
 */
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* No background plate here, unlike icon.svg: that rect exists so iOS
          composites the apple-icon onto newsprint. In the header the mark is
          already standing on the page's own cream. */}
      <path d="M21 4C21 4 6.5 20 6.5 29.4a14.5 14.5 0 0029 0C35.5 20 21 4 21 4z" fill="#0e8f4f" />
      <path d="M15.5 29.4a6.5 6.5 0 0011 0" fill="none" stroke="#f3efe6" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="17.3" cy="23.6" r="1.8" fill="#f3efe6" />
      <circle cx="24.7" cy="23.6" r="1.8" fill="#f3efe6" />
      <path d="M12.6 16.6l-4-2.6M29.4 16.6l4-2.6" stroke="#ffe45c" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
