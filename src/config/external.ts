/**
 * Every off-site destination the AISB pages point at, in one place.
 *
 * These are live URLs. Changing one here changes it everywhere, which is the
 * point: the Skool URL in particular will change the moment the community is
 * renamed, and hunting it down across a dozen files is how links rot.
 */

/**
 * Where people actually join. Skool handles the payment, so this is the
 * checkout for the community offer, not just a marketing link.
 *
 * NOTE: this slug still carries the old community name. Renaming the community
 * on Skool changes it, and this constant must be updated in the same sitting or
 * every join button 404s.
 */
export const SKOOL_URL = 'https://www.skool.com/the-vibe-coding-lab-7172/about';

/** The Vibed, the blog. */
export const BLOG_URL = 'https://thevibed.co';

/**
 * Stripe payment link for the £9 AI Build Standards.
 *
 * The "After payment" redirect on this link must point at
 * /build-standards/thank-you, otherwise buyers land on Stripe's own generic
 * confirmation and never find out the guide arrives by email.
 */
export const STRIPE_BUILD_STANDARDS_URL = 'https://buy.stripe.com/eVq5kDgy99416oubbV8so0h';

export const hasStripeLink = STRIPE_BUILD_STANDARDS_URL.length > 0;

/**
 * Community pricing.
 *
 * Skool bills in US dollars and gives no choice about it. The site leads with
 * sterling because the audience is UK-leaning and mixing £ and $ in one
 * pricing table reads badly, but the amount actually charged is the dollar
 * one, so PRICE_CHARGED_NOTE must appear wherever PRICE_DISPLAY does. Showing
 * a sterling figure without saying what leaves the account is not on.
 *
 * PRICE_DISPLAY drifts with the exchange rate. Sense-check it when the rate
 * moves; it is indicative, not a quote.
 */
export const PRICE_DISPLAY = '\u00a337';
export const PRICE_USD = '$47';
export const PRICE_CHARGED_NOTE = 'charged as $47 by Skool';
