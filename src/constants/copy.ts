/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * goodnewsdrop's angle: WHAT CHANGED. This site is a NEWSPAPER, and the thing
 * that makes a newspaper a newspaper rather than a directory is that it
 * reports MOVEMENT. Every sibling compares operators as they stand today;
 * none of them tracks the one fact that matters most to someone who read a
 * review three months ago — that the terms have since been rewritten. A
 * casino that halved its wagering last month and one that doubled its
 * withdrawal cap are two different stories, and neither shows up in a
 * snapshot. So this site reports CHANGES to published terms as news: what
 * moved, on whose page, and in whose favour.
 *
 * That is also the one angle in this network that the newspaper form earns
 * rather than decorates. A front page, a lead story, an edition column and a
 * section index all exist to answer "what is new", which is exactly the
 * question being asked.
 *
 * Its siblings answer the neighbouring questions — affliliate decodes an offer
 * in MONEY, slottering reads the SLOT rules, bettingbetway ranks CASINOS on
 * their terms, bonanzasmile names the CATCH, gladjackpot asks how the money
 * gets OUT, luckycatsmile argues LUCK IS THE WRONG WORD, spinsunny moves the
 * small print INTO DAYLIGHT, starspinly puts every operator on ONE SCALE,
 * rollofjoy counts what an offer costs you in EVENINGS, bigbrightday asks
 * whether the terms can be READ IN ONE GO — and none of them may be echoed.
 * Every one of those is a question about the terms AS THEY ARE. This one is
 * about the terms AS THEY MOVE, which is the only question none of them asks.
 *
 * The nearest sibling to watch is bigbrightday, and the line between them is
 * clean: bigbrightday asks whether a figure can be understood on first
 * reading, this one asks whether the figure you understood last time is still
 * the figure. Never write "read it in one go" here, and never write "nothing
 * hidden" (spinsunny's).
 *
 * ── Four lines this file does not cross ───────────────────────────────────-
 * 1. The mockup's deck says "we sign up, deposit, play and cash out at every
 *    casino we list", its byline says "every casino tested with real money",
 *    its weather box forecasts "crypto withdrawals clearing in under an hour
 *    at our top picks", and its FAQ promises "the times we observed". NONE OF
 *    IT SHIPS, in any wording: nothing in this project records a funded
 *    account, a played bonus or a timed withdrawal, and a review site
 *    inventing its own test results is the one failure that cannot be walked
 *    back. What this site CAN report is what an operator published and what
 *    it published before — the terms page, the cashier page, the promo page —
 *    which needs no account and is checkable by anyone. That is what the copy
 *    says, and it is why this angle can be honest where the mockup's cannot.
 * 2. The mockup's offers section calls them "offers we'd happily cut out and
 *    keep". That is an endorsement of specific operators' promotions, which
 *    this site does not give; the line says what is on the coupon instead.
 * 3. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 4. The mockup prints a "Min. deposit" and a "Payout" on every column, in
 *    every edition entry and in the review glance. There is no column for any
 *    of them, so no wording promises one; those slots carry the rating and the
 *    regions, which are real.
 *
 * ── And one about the date ──────────────────────────────────────────────────
 * The masthead's left slot is a LABEL, not a date. The mockup fills it from
 * `new Date()` in the browser; these pages are statically generated and
 * revalidated on an hour's ISR, so a date rendered here would be the date of
 * the last build rather than of the visit — and a newspaper printing the wrong
 * date on its own masthead is worse than one printing none.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casino Reviews Worth Reading',
    description:
      'reports on what changed in online casino terms — the wagering that moved, the cap that was raised, the window that got shorter — read from the operators\u2019 own pages, week by week.',
    keywords: [
      'casino terms changes tracked',
      'casino wagering requirement changes',
      'online casino news and reviews',
      'casino bonus terms updated',
      'licensed online casinos reviewed',
    ],
    // The masthead's two outer slots. The left one is a LABEL and not a date —
    // see the note at the top of this file.
    editionLabel: 'Weekly edition',
    mastheadStrapline: 'Casino reviews · Terms re-read weekly',
    // The small wordmark in the sticky section bar, split so the tail can take
    // the italic. The full one is the Logo component; this is the compact
    // version that appears once the masthead has scrolled away.
    wordmarkHead: 'GoodNews',
    wordmarkTail: 'Drop',
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    // TWO WORDS, deliberately. `SectionHead` sets a heading's last word in the
    // serif italic green, so a one-word heading goes entirely italic — a whole
    // 58px line of it, which reads as a mistake. The mockup's own heading here
    // is "Clip-Out Bonuses".
    bonus: 'Clip-Out Bonuses',
    // The line under the Bonuses heading. The mockup's is "offers we'd
    // happily cut out and keep", which endorses specific operators'
    // promotions. This says what is actually printed on the coupon.
    bonusesSubtitle: 'Each one with the figure that decides it, quoted from the page it was published on.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Inside this edition',
    // The front page's kicker, over the lead story.
    heroEyebrow: 'Front page · This week’s report',
    // Split in three so the JSX can set the middle phrase in the serif ITALIC
    // green the mockup uses for its `<em>`. The tail carries the full stop so
    // the italic does not have to.
    heroHeadline: 'Finally, casino news that’s',
    heroHighlight: 'actually good',
    heroHeadlineTail: '.',
    heroSubtitle:
      'Most casino pages tell you what the terms are today. We report what they were last month — the wagering that moved, the cap that was raised, the window that quietly got shorter — read straight from the operators’ own pages, so a review you read in March still means something in June.',
    // The exact phrase inside heroSubtitle that takes the HIGHLIGHTER. Kept
    // as a key rather than as markup so the string above stays plain text,
    // readable in a <title> and in JSON-LD with no tags to strip. The page
    // splits on it; if it ever stops matching, the deck simply renders
    // unmarked rather than breaking.
    heroSubtitleMark: 'what they were last month',
    // The byline under the lead story. The mockup's second half is "every
    // casino tested with real money", which this site does not do.
    heroBylineName: 'The Good News Desk',
    heroBylineNote: 'Every figure quoted from the operator’s own pages',
    // The head of the EDITION COLUMN — the mockup's "In this edition · Top 3",
    // which is how a paper lists what else is inside it.
    podiumBadge: 'Top 3',
    podiumTitle: 'In this edition',
    podiumSubtitle: 'The three highest-placed casinos in this week’s ranking.',
    // The label on an edition entry's rating. The mockup prints a min. deposit
    // there; nothing in the API holds one, so the slot carries the rating.
    podiumRatingLabel: 'Rated',
    podiumAll: 'Read the whole ranking',
    topCasinosTitle: 'Casinos, and what moved',
    topCasinosSubtitle: 'Ranked on the terms each operator publishes, and re-read on a weekly pass so a rewrite shows up as news rather than as a surprise. Filter by category.',
    featuredCasinos: 'Read the rankings',
    specialOffers: 'Clip a bonus',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Online Casino Terms, And What Changed This Week',
    faqTitle: 'Letters to the editor',
    faqSubtitle: 'What we read, what we will not claim, and how a casino earns its place on this page.',
    metaDescription:
      'What changed in online casino terms — the wagering that moved, the cap that was raised and the window that got shorter, read from each operator’s own pages on a weekly pass.',
    // ── The "How a casino earns its place" band ───────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    //
    // This is the site's METHOD, and on a site whose whole claim is "we report
    // what changed", the method has to say how a change is established. It
    // does: read, record, compare.
    methodTitle: 'How a story gets on this page',
    methodSubtitle: 'Three steps, in this order, every week.',
    methodSteps: [
      {
        no: '01',
        verb: 'Read',
        title: 'The operator’s own pages, not its banner',
        body:
          'Every figure here comes from somewhere a reader can go and check: the promotion page, the bonus terms, the general terms, the cashier page and the regulator’s own register. A banner is an advertisement and is treated as one — where it disagrees with the terms behind it, the terms are what gets recorded and the disagreement is itself worth reporting.',
      },
      {
        no: '02',
        verb: 'Record',
        title: 'What it said, and when it said it',
        body:
          'The wagering multiplier and what it applies to, the maximum stake while clearing, the expiry, the withdrawal caps, the processing window and when verification is demanded — written down with the date the page was read. A figure with no date attached cannot be compared to anything later, which is why an undated review stops being useful about a month after it is written.',
      },
      {
        no: '03',
        verb: 'Compare',
        title: 'This week’s pages against last week’s',
        body:
          'Then the only step that makes this a report rather than a directory: the new reading set beside the old one. A multiplier that went from 40x to 25x is good news and gets written up as good news. One that went the other way, or a cap that halved, or a window that grew from three days to ten, is the same story in reverse — and it is the one an operator would rather you did not notice.',
      },
    ],
    methodLabel: 'How we work',
    // Under the three steps: the cycle closes back on the first.
    methodLoop: 'And round again next week, whichever way the figures moved',
    // ── What one pass covers ──────────────────────────────────────────────
    // The same things the FAQ and the method name — no figure this site does
    // not hold. Kept in the shared key structure though this design has no
    // monitor panel; see the file header.
    monitorTitle: 'What each pass covers',
    monitorStatus: 'Weekly',
    monitorReads: [
      { label: '01 · Read', text: 'The terms, the cashier and the licence register' },
      { label: '02 · Record', text: 'Every figure, with the date it was read' },
      { label: '03 · Compare', text: 'This week’s reading against the last' },
    ],
    monitorNote: 'Lapsed bonuses come off the page. A casino moves when its own terms move.',
    // The kickers over each section head — a paper's own section labels.
    rankingLabel: 'The rankings',
    bonusTypesKicker: 'Sections',
    bonusesLabel: 'Coupons',
    faqLabel: 'Letters to the editor',
  },
  casinos: {
    pageTitle: 'The Full Ranking',
    pageDescription:
      'Every casino on the page, each with the bonus it is currently running and where it stands after this week’s reading of its own terms.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Elsewhere in this edition',
    reviewTitleTail: 'Bonus Terms, Wagering And Licence',
    reviewSignature: 'Every figure here quoted from this operator’s own terms and cashier pages.',
    reviewSummary: 'with the figures a reader would act on — the wagering and what it applies to, the withdrawal window, the caps and the regulator — quoted from the operator’s own pages rather than its banner, and re-read on a weekly pass.',
    // The FLAG on the lead story. A WORD, not a numeral: the list order
    // already is the ranking, and a "1" on every column invites reading it as
    // a score. The mockup's own "Top story", which on a newspaper front page
    // is exactly what the leader is.
    topPick: 'Top story',
    visitCasino: 'Open Casino',
    readReview: 'Full review',
    rating: 'Good News Score',
    // A paper's own way of saying a section is empty this week.
    noResults: 'No casinos match this filter yet — check back next edition.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind running in this edition, with whose offer it is and the figure that decides it, read from the page it was published on.',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'The Coupon Page',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the figure that decides it — the wagering, the cap and the expiry, wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went to press.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Section',
    pageDescription: 'The same three steps behind every list — pick the section you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ordered on the terms each operator currently publishes, re-read on a weekly pass so a rewrite shows up as a change rather than as a surprise.',
    noResults: 'Nothing in this section this edition.',
  },
  newsletter: {
    title: 'The Friday Drop.',
    subtitle: 'One email a week: which casinos moved, and whose terms moved under them.',
    placeholder: 'Your email address',
    button: 'Subscribe',
    // The two halves of the line in the GREEN TICKER — the mockup's own
    // "Good news / The Friday Drop: new casinos and fresh bonuses, straight to
    // your inbox." The lead is set as a white key with the green reading
    // through it, which is why it is split from the rest.
    barLead: 'Good news',
    barTail: 'The Friday Drop: new casinos, fresh bonuses and every term that changed this week.',
    // The band above the footer — the site's second capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandKicker: 'The back page',
    bandTitle: 'The Friday Drop, every Friday.',
    bandSubtitle: 'New reviews, the bonuses worth clipping, and every figure we found rewritten in an operator’s small print — one short email, no filler.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino reviews and rankings, reported on what each operator publishes and on what it published before. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-23, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank.
    postalAddress: '39 Hawthorn Drive, Durham, DH1 4PQ, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'Letters From Readers',
    empty: 'No letters yet — be the first to write in.',
    formTitle: 'Write To The Desk',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the terms held up',
    bodyPlaceholder: 'What did the terms say, and did the operator stick to them?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
