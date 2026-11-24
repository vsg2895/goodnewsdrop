/**
 * Frequently asked questions for this site — the mockup's LETTERS TO THE
 * EDITOR, which is what a newspaper calls its FAQ.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data
 * from this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * THE "A." PREFIX IS NOT IN THESE STRINGS. The design prints one before every
 * answer, and it does it with a CSS `::before` on the rendered paragraph
 * (`.fq-answer` in globals.css) precisely so it stays out of the data: written
 * into the copy, every answer in this site's structured data would be
 * published to Google beginning "A. ".
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that a casino review is only worth anything if it is dated
 * and re-read, because the terms it describes are rewritten without notice and
 * a snapshot goes stale. Its siblings answer the neighbouring questions
 * (affliliate: what an offer is worth in money; slottering: the slot rules;
 * bettingbetway: which casino to trust; bonanzasmile: the catch in a bonus;
 * gladjackpot: how the money gets out; luckycatsmile: that luck is the wrong
 * word; spinsunny: when you get to read the small print; starspinly: one scale
 * for every operator; rollofjoy: what an offer costs you in evenings;
 * bigbrightday: whether the terms can be read in one go) and none of them may
 * be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's FAQ opens
 * with "we open real accounts, deposit, claim the bonus and request a
 * withdrawal" and closes with "we publish the times we observed". Neither
 * ships, in any wording: nothing in this project records a funded account or a
 * timed payment. The second question is asked precisely so the answer can say
 * so outright, and the payout question is answered honestly, by naming whose
 * commitment the figure actually is.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'On the terms each operator publishes, read in the same order every week: the promotion page, the bonus terms, the general terms, the cashier page and the regulator’s register. We record the wagering multiplier and what it applies to, the maximum stake while clearing, the expiry, the withdrawal caps, the processing window and when verification is demanded — then we set this week’s reading beside the last one. An operator whose terms hold steady and read plainly ranks above one with a louder banner, and one that quietly tightens them slides down.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not read somewhere you can read it too. Everything here comes from pages the operator publishes, quoted so it can be checked against the source. That is the approach rather than a limitation of it: a site claiming its own deposits and withdrawals is asking to be believed about the one thing nobody else can verify, where a published term is a matter of record that anyone can go and look at.',
  },
  {
    question: 'Why does it matter what the terms used to say?',
    answer:
      'Because they change, and nobody announces it. A welcome offer can keep the same headline figure for a year while the wagering behind it goes from 25x on the bonus to 40x on deposit plus bonus — the banner does not move, so nothing looks different until you try to withdraw. A review with no date on it quietly stops being true about a month after it is written. Dating each reading, and saying which way a figure moved since the last one, is the whole reason this site is laid out as a newspaper rather than as a directory.',
  },
  {
    question: 'Are the bonuses really worth it?',
    answer:
      'Sometimes, and the only way to tell is to read the figure that decides it before you claim anything: the multiplier and what it applies to, the maximum stake allowed while clearing, the cap on what you can withdraw from it, and how long you have. We print those next to the offer, quoted from where the operator published them. If an operator makes them hard to find, treat the difficulty itself as information about the offer.',
  },
  {
    question: 'How quickly can I withdraw a win?',
    answer:
      'That depends on your method and your verification status, and we publish no timings of our own because we have measured none. What we do publish is the window the operator commits to in writing on its own cashier page, and whether that window still says what it said last time we looked. A processing time that changed without any announcement is worth more to you than any average we could quote.',
  },
  {
    question: 'Which casinos are licensed?',
    answer:
      'Every casino on this page holds a gaming licence, and each review names the regulator so the claim can be checked on that authority’s own register rather than taken on trust. The licence matters most for the thing this site is about: licensed operators are required to publish their terms and to apply them as written, which is what makes a change to those terms a fact you can point at rather than an impression.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when someone signs up through a link on this site, and that is how it is funded. It does not buy a position or soften a story: every operator is read the same way on the same schedule, and a casino that rewrites its terms in its own favour is reported that way whether or not it pays us.',
  },
] as const
