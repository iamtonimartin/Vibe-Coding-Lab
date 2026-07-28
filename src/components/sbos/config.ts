// Central config for the Service Business OS founding launch.
//
// The sales page (/sbos) and the success page (/sbos-success) both quote the
// price, the seat count and the rollout dates. They live here so the two can
// never drift apart.

/* ------------------------------------------------------------------ *
 * The offer
 * ------------------------------------------------------------------ */

/** One off founding price. Not a subscription. */
export const FOUNDING_PRICE = 497;

/** What everyone pays once founding access closes. */
export const MONTHLY = 97;

/** Founding cohort size. */
export const SEATS_TOTAL = 40;

/**
 * Founding access closes at the deadline OR when the seats are gone,
 * whichever lands first. Change all three of these together.
 */
export const DEADLINE_ISO = '2026-08-04T23:59:00+01:00';
export const DEADLINE_LONG = '11:59pm Tuesday 4 August';
export const DEADLINE_SHORT = 'Tue 4 Aug';

/**
 * Manual kill switch. Flip to true to close founding access immediately,
 * ahead of the deadline, without waiting on a seat counter.
 */
export const SOLD_OUT = false;

/**
 * Live seat counter. Deliberately OFF.
 *
 * Empty means the pages quote SEATS_TOTAL as a flat "Only 40 founding seats"
 * claim and never fetch anything. No Redis, no webhook, no admin token.
 *
 * The machinery still exists if it is ever wanted: set this to
 * '/api/seats-remaining', add the Upstash and THRIVECART_SECRET env vars, and
 * point a ThriveCart webhook at /api/thrivecart-webhook. Nothing else changes,
 * and the count only ever displays when the endpoint reports live:true.
 *
 * With this off, the offer closes on the deadline or the SOLD_OUT switch
 * above. It cannot close itself when the 40th seat sells.
 */
export const SEATS_ENDPOINT = '';

/**
 * Money-back guarantee.
 *
 * Clause 4 of the terms requires any guarantee to be stated at the point of
 * purchase, which is why the join section spells out the conditions in full
 * rather than just the headline. Set `days` to 0 to remove the guarantee from
 * the page entirely, including the FAQ answer.
 */
export const GUARANTEE = {
  days: 14,
  conditions: [
    'Email us within 14 days of purchase and we refund you in full.',
    'Your access to the suite is revoked once the refund is processed.',
    'One refund per customer.',
  ],
};

/** Payment options. ThriveCart presents all three inside one checkout. */
export const PLANS = [
  { label: 'Best value', value: '£497', sub: 'once, paid in full', best: true },
  { label: 'Spread it', value: '3 × £175', sub: 'over three months', best: false },
  { label: 'Spread it', value: '10 × £55', sub: 'over ten months', best: false },
];

/* ------------------------------------------------------------------ *
 * Checkout
 * ------------------------------------------------------------------ */

export const THRIVECART_ACCOUNT = 'tonimartin';

/**
 * The single founding checkout, carrying all three payment options.
 *
 * It lives on its own page (/sbos-join) rather than inside the sales page,
 * because the embed renders at a fixed shape that fights a narrow column.
 *
 * Product 173 was previously shared with The Stack. That funnel has been
 * retired and folded into this one, so 173 is now solely this offer and the
 * seat counter in server.ts tracks it unambiguously.
 */
export const THRIVECART = {
  productId: '173',
  embedId: 'tc-tonimartin-173-A45JY2',
};

/** Where the sales page sends people to buy. */
export const JOIN_PATH = '/sbos-join';

/**
 * Where the monthly CTA points once founding access has closed.
 *
 * Currently the same Skool page as COMMUNITY_URL: from 4 August the price is
 * configured there, so joining becomes a paid action. Written out in full
 * rather than aliased to COMMUNITY_URL, because the two serve different jobs
 * and either could move without the other.
 */
export const MONTHLY_URL = 'https://www.skool.com/service-business-os-6193/about';

/* ------------------------------------------------------------------ *
 * Delivery
 * ------------------------------------------------------------------ */

/**
 * Skool community for founding members.
 *
 * Access is request-based, not automatic. Skool asks joining questions and the
 * buyer has to answer with the email address they paid with before they are let
 * in, so the success page has to say that plainly or people get rejected and
 * email support instead.
 */
export const COMMUNITY_URL = 'https://www.skool.com/service-business-os-6193/about';

/**
 * Share card for /sbos, used for Open Graph and Twitter.
 *
 * Also referenced by routeMeta in server.ts so crawlers that do not run JS get
 * the same image. Keep the two in step.
 */
export const OG_IMAGE = '/sbos-og.jpg';

export const SUPPORT_EMAIL = 'clientsupport@ascendz.co';

/**
 * Tool rollout. `status` is the sales-page phrasing, `short` is the compact
 * label used on the tool rows and the success-page roadmap.
 */
export const ROLLOUT = [
  { name: 'Relavo', status: 'Live now', short: 'Live', live: true },
  { name: 'Kestry', status: 'Live now', short: 'Live', live: true },
  { name: 'Zenitro', status: 'Available 10 August', short: '10 Aug', live: false },
  { name: 'Draftd', status: 'Available 14 September', short: '14 Sep', live: false },
  { name: 'Vysbl', status: 'Available October', short: 'Oct', live: false },
] as const;

/** Lookup so the sales page can quote a status without repeating the date. */
export const STATUS = Object.fromEntries(
  ROLLOUT.map((t) => [t.name, t.status]),
) as Record<(typeof ROLLOUT)[number]['name'], string>;
