import express from 'express';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHmac, timingSafeEqual } from 'crypto';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const KIT_API_KEY = process.env.KIT_API_KEY || '';
const KIT_FORM_ID = process.env.KIT_FORM_ID || '';
const KIT_IDEAS_FORM_ID = process.env.KIT_IDEAS_FORM_ID || '';
const KIT_APP_IDEA_FORM_ID = process.env.KIT_APP_IDEA_FORM_ID || '';
const KIT_PLAYBOOK_FORM_ID = process.env.KIT_PLAYBOOK_FORM_ID || '';
const KIT_SECURE_FORM_ID = process.env.KIT_SECURE_FORM_ID || '';

/* ---------------------------------------------------------------------------
 * POST /api/stripe-webhook — delivers a purchased product via Kit
 *
 * Why this exists rather than Kit's own Stripe app: Kit only listens to
 * charge.succeeded, and a Stripe Charge carries no line items, so Kit cannot
 * tell which product sold. Every sale arrives as the generic "Stripe Payment",
 * which means any Stripe charge at all (an invoice, a consulting payment)
 * would fire the product's delivery email.
 *
 * checkout.session.completed does identify the product, via `payment_link`.
 * That is the whole reason for this endpoint.
 *
 * Note it is mounted ABOVE app.use(express.json()) and takes a raw body.
 * Signature verification hashes the exact bytes Stripe sent, so a parsed and
 * re-serialised body will never verify. Do not move this below the JSON
 * parser.
 *
 * Env:
 *   STRIPE_WEBHOOK_SECRET          whsec_... from the Stripe endpoint screen
 *   STRIPE_PLINK_BUILD_STANDARDS   plink_... id of the AI Build Standards link
 *   KIT_STANDARDS_FORM_ID          Kit form that delivers the guide
 * ------------------------------------------------------------------------ */

/** Stripe signs `${timestamp}.${rawBody}`. Reject anything older than this. */
const STRIPE_TOLERANCE_SECONDS = 300;

function verifyStripeSignature(raw: Buffer, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(',').map((kv) => kv.split('=', 2) as [string, string])
  );
  const timestamp = parts['t'];
  if (!timestamp) return false;

  // Replay window. Without this a captured request stays valid forever.
  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(age) || Math.abs(age) > STRIPE_TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${raw.toString('utf8')}`)
    .digest('hex');

  // Stripe may send several v1 signatures during a secret rotation.
  return header
    .split(',')
    .filter((kv) => kv.startsWith('v1='))
    .map((kv) => kv.slice(3))
    .some((sig) => {
      const a = Buffer.from(sig, 'utf8');
      const b = Buffer.from(expected, 'utf8');
      return a.length === b.length && timingSafeEqual(a, b);
    });
}

/** Which Kit form delivers which payment link. Add a line per new product. */
function kitFormForPaymentLink(paymentLink: string | null): string | undefined {
  const map: Record<string, string | undefined> = {
    [process.env.STRIPE_PLINK_BUILD_STANDARDS ?? '']: process.env.KIT_STANDARDS_FORM_ID,
  };
  return paymentLink ? map[paymentLink] : undefined;
}

app.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers['stripe-signature'];

    if (!secret) {
      console.error('stripe-webhook: STRIPE_WEBHOOK_SECRET is not set');
      return res.status(500).json({ ok: false });
    }
    if (typeof signature !== 'string' || !verifyStripeSignature(req.body as Buffer, signature, secret)) {
      // Unverified means it did not come from Stripe. Say nothing useful.
      return res.status(400).json({ ok: false });
    }

    let event: any;
    try {
      event = JSON.parse((req.body as Buffer).toString('utf8'));
    } catch {
      return res.status(400).json({ ok: false });
    }

    // Everything below answers 200 even when it does nothing. A non-2xx makes
    // Stripe retry for days, and none of these cases get better on a retry.
    if (event.type !== 'checkout.session.completed') return res.json({ ok: true, ignored: event.type });

    const session = event.data?.object ?? {};
    if (session.payment_status !== 'paid') {
      return res.json({ ok: true, ignored: 'unpaid' });
    }

    const email: string | undefined = session.customer_details?.email ?? session.customer_email;
    const name: string | undefined = session.customer_details?.name ?? undefined;
    const paymentLink: string | null = session.payment_link ?? null;
    const formId = kitFormForPaymentLink(paymentLink);

    if (!formId) {
      // The usual cause is a new product whose plink is not mapped yet. Logging
      // the id is how you find it: buy once, read this line, add the mapping.
      console.warn(`stripe-webhook: no Kit form mapped for payment_link ${paymentLink}. Nothing sent.`);
      return res.json({ ok: true, ignored: 'unmapped-product' });
    }
    if (!email || !KIT_API_KEY) {
      console.error('stripe-webhook: missing buyer email or KIT_API_KEY');
      return res.json({ ok: true, ignored: 'missing-email-or-key' });
    }

    try {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email,
          // Stripe gives a full name; Kit wants a first name.
          first_name: name ? name.split(' ')[0] : undefined,
        }),
      });
      const kitBody = await response.json().catch(() => null);
      if (!response.ok || kitBody?.error) {
        console.error('stripe-webhook: Kit rejected the subscribe', response.status, JSON.stringify(kitBody));
      } else {
        console.log(`stripe-webhook: subscribed ${email} to Kit form ${formId}`);
      }
    } catch (err) {
      console.error('stripe-webhook: Kit call failed', (err as Error).message);
    }

    return res.json({ ok: true });
  }
);

app.use(express.json());

// Rebrand: Vibe Coding Lab became AI for Service Businesses and the site
// moved to aiforservicebusinesses.co. The old domain stays registered and
// pointed at this same Railway service, so every request arriving on it is
// 301'd to the matching path on the new one. Preserves link equity and keeps
// old emails, ThriveCart receipts and social bios working.
//
// The legacy redirect is OFF until LEGACY_REDIRECT=true is set in the Railway
// variables. That ordering matters: deploying it while the new domain is
// still unattached or mid-DNS-propagation would 301 every live visitor to a
// domain that does not resolve yet, taking the site down. Deploy first,
// attach and verify the new domain, then flip this on.
const CANONICAL_HOST = 'aiforservicebusinesses.co';
const LEGACY_HOSTS = new Set([
  'thevibecodinglab.co',
  'www.thevibecodinglab.co',
]);
const LEGACY_REDIRECT = process.env.LEGACY_REDIRECT === 'true';

app.use((req, res, next) => {
  // Railway terminates TLS at the edge, so req.protocol is always http here.
  // The forwarded host is what the visitor actually typed.
  const host = (req.headers['x-forwarded-host'] as string | undefined) || req.headers.host || '';
  const hostname = host.split(':')[0].toLowerCase();

  if (LEGACY_REDIRECT && LEGACY_HOSTS.has(hostname)) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }

  // Consolidate www on the new domain, so there is a single canonical host.
  // Safe to run always: it only fires once the www record points here.
  if (hostname === `www.${CANONICAL_HOST}`) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }

  next();
});

// Permanent redirect: the offer page moved from /bumpsale to /bundle.
// Keeps old links, emails and shares working.
app.get('/bumpsale', (_req, res) => res.redirect(301, '/bundle'));

// The terms page is linked from the ThriveCart checkouts. Catch the long form
// of the URL server-side so a mistyped or legacy link never lands on a 404.
app.get('/terms-and-conditions', (_req, res) => res.redirect(301, '/terms'));

// POST /api/generate-idea
// Proxies streaming OpenAI request server-side to keep API key secret
app.post('/api/generate-idea', async (req, res) => {
  const { messages } = req.body;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server.' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        stream: true,
        temperature: 0,
      }),
    });

    if (!upstream.ok) {
      const error = await upstream.text();
      console.error('OpenAI error:', error);
      return res.status(upstream.status).json({ error: 'OpenAI request failed.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Failed to generate idea.' });
  }
});

// POST /api/subscribe-ideas
// Subscribes a user to the 70 Ideas Kit.com form
app.post('/api/subscribe-ideas', async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'firstName and email are required.' });
  }

  if (!KIT_API_KEY || !KIT_IDEAS_FORM_ID) {
    return res.status(500).json({ error: 'Kit.com credentials not configured on server.' });
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_IDEAS_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        first_name: firstName,
        email: email,
      }),
    });

    const kitBody = await response.json().catch(() => null);
    console.log('Kit.com ideas response:', response.status, JSON.stringify(kitBody));

    if (!response.ok || kitBody?.error) {
      const msg = kitBody?.error || kitBody?.message || 'Kit.com request failed';
      console.error(`Kit.com ideas error ${response.status}:`, msg);
      return res.status(response.ok ? 400 : response.status).json({ error: `Kit.com: ${msg}` });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error calling Kit.com ideas:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /api/subscribe-app-idea
// Subscribes a user to the app idea generator Kit.com form.
// Separate from subscribe-ideas on purpose: the generator and the 70-ideas list are
// different magnets, and sharing one form puts people in the wrong sequence.
app.post('/api/subscribe-app-idea', async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'firstName and email are required.' });
  }

  if (!KIT_API_KEY || !KIT_APP_IDEA_FORM_ID) {
    return res.status(500).json({ error: 'Kit.com credentials not configured on server.' });
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_APP_IDEA_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        first_name: firstName,
        email: email,
      }),
    });

    const kitBody = await response.json().catch(() => null);
    console.log('Kit.com app idea response:', response.status, JSON.stringify(kitBody));

    if (!response.ok || kitBody?.error) {
      const msg = kitBody?.error || kitBody?.message || 'Kit.com request failed';
      console.error(`Kit.com app idea error ${response.status}:`, msg);
      return res.status(response.ok ? 400 : response.status).json({ error: `Kit.com: ${msg}` });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error calling Kit.com app idea:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /api/subscribe
// Subscribes a user to a Kit.com (ConvertKit) form
app.post('/api/subscribe', async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'firstName and email are required.' });
  }

  if (!KIT_API_KEY || !KIT_FORM_ID) {
    return res.status(500).json({ error: 'Kit.com credentials not configured on server.' });
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        first_name: firstName,
        email: email,
      }),
    });

    const kitBody = await response.json().catch(() => null);
    console.log('Kit.com response:', response.status, JSON.stringify(kitBody));

    if (!response.ok || kitBody?.error) {
      const msg = kitBody?.error || kitBody?.message || 'Kit.com request failed';
      console.error(`Kit.com error ${response.status}:`, msg);
      return res.status(response.ok ? 400 : response.status).json({ error: `Kit.com: ${msg}` });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error calling Kit.com:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /api/subscribe-playbook
// Subscribes a user to the Vibe Playbook Kit.com form
app.post('/api/subscribe-playbook', async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'firstName and email are required.' });
  }

  if (!KIT_API_KEY || !KIT_PLAYBOOK_FORM_ID) {
    return res.status(500).json({ error: 'Kit.com credentials not configured on server.' });
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_PLAYBOOK_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        first_name: firstName,
        email: email,
      }),
    });

    const kitBody = await response.json().catch(() => null);
    console.log('Kit.com playbook response:', response.status, JSON.stringify(kitBody));

    if (!response.ok || kitBody?.error) {
      const msg = kitBody?.error || kitBody?.message || 'Kit.com request failed';
      console.error(`Kit.com error ${response.status}:`, msg);
      return res.status(response.ok ? 400 : response.status).json({ error: `Kit.com: ${msg}` });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error calling Kit.com:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /api/subscribe-secure
// Subscribes a user to the Secure Build Checklist Kit.com form
app.post('/api/subscribe-secure', async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'firstName and email are required.' });
  }

  if (!KIT_API_KEY || !KIT_SECURE_FORM_ID) {
    return res.status(500).json({ error: 'Kit.com credentials not configured on server.' });
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_SECURE_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        first_name: firstName,
        email: email,
      }),
    });

    const kitBody = await response.json().catch(() => null);
    console.log('Kit.com secure response:', response.status, JSON.stringify(kitBody));

    if (!response.ok || kitBody?.error) {
      const msg = kitBody?.error || kitBody?.message || 'Kit.com request failed';
      console.error(`Kit.com secure error ${response.status}:`, msg);
      return res.status(response.ok ? 400 : response.status).json({ error: `Kit.com: ${msg}` });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error calling Kit.com secure:', error);
    return res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /api/referral
// Captures a buyer crediting their referrer on the /complete page. Logs to stdout
// (visible in Railway logs) and forwards to REFERRAL_WEBHOOK_URL if configured
// (e.g. a Zapier/Make/Slack webhook).
app.post('/api/referral', async (req, res) => {
  const { buyerName, referrerName } = req.body ?? {};

  if (!buyerName || typeof buyerName !== 'string' || !buyerName.trim()) {
    return res.status(400).json({ error: 'buyerName is required.' });
  }
  if (!referrerName || typeof referrerName !== 'string' || !referrerName.trim()) {
    return res.status(400).json({ error: 'referrerName is required.' });
  }

  const payload = {
    buyerName: buyerName.trim(),
    referrerName: referrerName.trim(),
    receivedAt: new Date().toISOString(),
    userAgent: req.headers['user-agent'] ?? null,
  };

  console.log('REFERRAL_CREDIT', JSON.stringify(payload));

  const webhook = process.env.REFERRAL_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Referral webhook failed:', (err as Error).message);
      // Still return success to the buyer since we have the log.
    }
  }

  return res.json({ success: true });
});

// ---------------------------------------------------------------------------
// The AI Build Standards: the gated guide
//
// The guide lives in private/, NOT public/, so it is never served statically
// and the URL on its own fetches nothing. Access is checked server-side on
// every request, which is the part a shared link cannot carry.
//
// Kit is already the purchaser list: the Stripe webhook subscribes every buyer
// to KIT_STANDARDS_FORM_ID, so membership of that form IS proof of purchase.
// That means no database and no new source of truth to keep in sync.
//
// This is a deterrent, not DRM. Someone can pass on their own email address,
// and anyone who opens the guide can read its source. For a £9 product that is
// the right trade: it stops casual link sharing dead without punishing buyers.
// ---------------------------------------------------------------------------
const KIT_API_SECRET = process.env.KIT_API_SECRET || '';
// Falls back to the Stripe webhook secret so this works without another
// variable. Rotating that secret just signs everyone out, and they re-enter
// their email once.
const STANDARDS_SECRET = process.env.STANDARDS_ACCESS_SECRET || process.env.STRIPE_WEBHOOK_SECRET || '';
const GUIDE_FILE = join(__dirname, 'private/the-ai-build-standards.html');
const ACCESS_COOKIE = 'aisb_standards';
const ACCESS_MAX_AGE = 60 * 60 * 24 * 365;
const SUPPORT_EMAIL_ADDR = 'clientsupport@ascendz.co';

function normaliseEmail(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

function signEmail(email: string): string {
  return createHmac('sha256', STANDARDS_SECRET).update(normaliseEmail(email)).digest('hex').slice(0, 32);
}

function readAccessCookie(req: express.Request): string | null {
  if (!STANDARDS_SECRET) return null;
  const jar = req.headers.cookie || '';
  const hit = jar
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(ACCESS_COOKIE + '='));
  if (!hit) return null;
  const [encoded, signature] = decodeURIComponent(hit.slice(ACCESS_COOKIE.length + 1)).split('.');
  if (!encoded || !signature) return null;
  let email: string;
  try {
    email = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = signEmail(email);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return email;
}

// Cached so a burst of page loads does not page through Kit every time.
let purchaserCache: { at: number; emails: Set<string> } | null = null;
const PURCHASER_TTL_MS = 5 * 60 * 1000;

// true = bought it, false = did not, null = we could not tell. The caller must
// treat null as "try again later" rather than as a refusal, so a Kit outage
// never looks to a paying customer like their purchase was rejected.
async function hasBoughtStandards(email: string): Promise<boolean | null> {
  const standardsFormId = process.env.KIT_STANDARDS_FORM_ID || '';
  if (!KIT_API_SECRET || !standardsFormId) {
    console.error('standards-access: KIT_API_SECRET or KIT_STANDARDS_FORM_ID not set, cannot verify buyers');
    return null;
  }
  const now = Date.now();
  if (!purchaserCache || now - purchaserCache.at > PURCHASER_TTL_MS) {
    const emails = new Set<string>();
    try {
      for (let page = 1; page <= 40; page++) {
        const url =
          `https://api.convertkit.com/v3/forms/${standardsFormId}/subscriptions` +
          `?api_secret=${encodeURIComponent(KIT_API_SECRET)}&subscriber_state=active&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`standards-access: Kit lookup failed ${response.status}`);
          return null;
        }
        const body: any = await response.json();
        const subs: any[] = body?.subscriptions ?? [];
        for (const sub of subs) {
          const found = sub?.subscriber?.email_address;
          if (found) emails.add(normaliseEmail(found));
        }
        if (subs.length === 0 || page >= (body?.total_pages ?? 1)) break;
      }
    } catch (error) {
      console.error('standards-access: Kit lookup threw:', error);
      return null;
    }
    purchaserCache = { at: now, emails };
  }
  return purchaserCache.emails.has(normaliseEmail(email));
}

// Guessing buyer email addresses should be slow and boring.
const accessAttempts = new Map<string, { count: number; first: number }>();
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const ATTEMPT_LIMIT = 12;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const record = accessAttempts.get(ip);
  if (!record || now - record.first > ATTEMPT_WINDOW_MS) {
    accessAttempts.set(ip, { count: 1, first: now });
    return false;
  }
  record.count += 1;
  return record.count > ATTEMPT_LIMIT;
}

app.post('/api/standards-access', async (req, res) => {
  const email = normaliseEmail(req.body?.email);
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter the email address you used at checkout.' });
  }
  if (rateLimited(req.ip || 'unknown')) {
    return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes, then try again.' });
  }
  if (!STANDARDS_SECRET) {
    console.error('standards-access: no STANDARDS_ACCESS_SECRET or STRIPE_WEBHOOK_SECRET, cannot sign access');
    return res.status(500).json({ error: `Access is not set up correctly. Please email ${SUPPORT_EMAIL_ADDR}.` });
  }

  const bought = await hasBoughtStandards(email);
  if (bought === null) {
    return res.status(503).json({
      error: `We could not check your access just now. Please try again shortly, or email ${SUPPORT_EMAIL_ADDR}.`,
    });
  }
  if (!bought) {
    return res.status(403).json({
      error: `We cannot find a purchase for that address. Use the email you paid with, or email ${SUPPORT_EMAIL_ADDR}.`,
    });
  }

  const value = Buffer.from(email, 'utf8').toString('base64url') + '.' + signEmail(email);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${ACCESS_COOKIE}=${encodeURIComponent(value)}; Max-Age=${ACCESS_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax${secure}`
  );
  console.log(`standards-access: granted to ${email}`);
  return res.json({ ok: true });
});

function standardsGatePage(): string {
  return `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>The AI Build Standards</title>
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:#f7f3ec;color:#464646;line-height:1.65;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column}
.top{padding:24px 32px;border-bottom:1px solid rgba(14,30,23,.12)}
.top img{height:34px;display:block}
main{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 24px}
.box{width:100%;max-width:520px;text-align:center}
.kick{display:inline-block;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#c25e44;background:#ece3d3;padding:7px 15px;border-radius:30px;margin-bottom:22px}
h1{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(29px,5vw,42px);line-height:1.1;letter-spacing:-.02em;color:#163024;margin-bottom:16px}
h1 em{color:#c25e44;font-style:italic}
p.lead{font-size:17px;margin-bottom:30px;text-wrap:pretty}
form{display:flex;flex-direction:column;gap:12px;text-align:left}
label{font-size:13px;font-weight:600;color:#163024}
input{width:100%;padding:15px 17px;border:1px solid rgba(14,30,23,.2);border-radius:11px;background:#fffdf8;font-family:'Outfit',sans-serif;font-size:16px;color:#163024}
input:focus{outline:2px solid #c25e44;outline-offset:1px;border-color:#c25e44}
button{width:100%;padding:16px 22px;border:0;border-radius:30px;background:#c25e44;color:#fff;font-family:'Outfit',sans-serif;font-weight:600;font-size:16px;cursor:pointer;transition:background .2s}
button:hover{background:#cf5a2f}
button:disabled{opacity:.6;cursor:default}
.err{display:none;background:#fbeae5;border:1px solid #e3b5a6;color:#8d3a24;padding:13px 16px;border-radius:11px;font-size:14.5px;text-wrap:pretty}
.err.show{display:block}
.fine{font-size:13.5px;color:#6d6a5f;margin-top:22px;text-wrap:pretty}
.fine a{color:#c25e44}
</style></head><body>
<header class="top"><img src="/aisb-logo-lightbg.png" alt="AI for Service Businesses"></header>
<main><div class="box">
  <div class="kick">Members only</div>
  <h1>The AI Build <em>Standards.</em></h1>
  <p class="lead">Enter the email address you used at checkout and I will open the guide for you. You only need to do this once on this device.</p>
  <form id="f" novalidate>
    <div class="err" id="e"></div>
    <label for="email">Your purchase email</label>
    <input id="email" name="email" type="email" autocomplete="email" placeholder="you@yourbusiness.co.uk" required>
    <button type="submit" id="b">Open the guide</button>
  </form>
  <p class="fine">Not bought it yet? <a href="/build-standards">Have a look at what is inside.</a><br>Trouble getting in? Email <a href="mailto:${SUPPORT_EMAIL_ADDR}">${SUPPORT_EMAIL_ADDR}</a>.</p>
</div></main>
<script>
var f=document.getElementById('f'),b=document.getElementById('b'),e=document.getElementById('e');
f.addEventListener('submit',async function(ev){
  ev.preventDefault();
  e.classList.remove('show');
  b.disabled=true;b.textContent='Checking...';
  try{
    var r=await fetch('/api/standards-access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value})});
    var d=await r.json().catch(function(){return {};});
    if(r.ok&&d.ok){location.reload();return;}
    e.textContent=d.error||'Something went wrong. Please try again.';
    e.classList.add('show');
  }catch(err){
    e.textContent='Could not reach the server. Please check your connection and try again.';
    e.classList.add('show');
  }
  b.disabled=false;b.textContent='Open the guide';
});
</script>
</body></html>`;
}

app.get('/standards', (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'private, no-store');

  const email = readAccessCookie(req);
  if (!email) {
    return res.status(401).type('html').send(standardsGatePage());
  }

  let html: string;
  try {
    html = readFileSync(GUIDE_FILE, 'utf8');
  } catch (error) {
    console.error('standards: could not read the guide file:', error);
    return res
      .status(500)
      .type('html')
      .send(`<p>The guide could not be loaded. Please email ${SUPPORT_EMAIL_ADDR} and I will sort it out.</p>`);
  }

  // Naming the licence holder costs nothing and makes passing the file around
  // feel less anonymous than it otherwise would.
  const licence =
    `<div style="max-width:900px;margin:0 auto;padding:26px 32px 40px;font-family:'Outfit',sans-serif;` +
    `font-size:12.5px;color:#6d6a5f;border-top:1px solid rgba(14,30,23,.12)">` +
    `The AI Build Standards. Licensed to ${escapeHtml(email)} for their own use. ` +
    `Please do not share or republish it.</div>`;
  html = html.replace('</body>', licence + '</body>');

  return res.type('html').send(html);
});


// ---------------------------------------------------------------------------
// SERVICE BUSINESS OS — founding-seat counter (/sbos)
//
// Originally built for The Stack, which became Service Business OS. The offer
// is the same shape (same ThriveCart product, same 40-seat cap) so the counter
// carried over intact. The `stack:` Redis key prefix is kept deliberately:
// renaming it would orphan the current count and every in-flight idempotency
// marker.
//
// Founding access is capped at SEATS_TOTAL. The count is stored in Upstash
// Redis and decremented by ThriveCart's webhook on each sale, so the number on
// the page is live. Everything is idempotent on the order id, so ThriveCart's
// webhook retries never double-count.
//
// Env: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_*)
//      THRIVECART_SECRET  — the webhook "secret word"
//      STACK_ADMIN_TOKEN  — enables the admin correction endpoint
// ---------------------------------------------------------------------------
const SEATS_TOTAL = 40;
// ThriveCart product ids that consume a founding seat.
const SEATS_CONSUMING_PRODUCT_IDS = ['173'];
const SEATS_SOLD_KEY = 'stack:seats:sold';

let redisClient: import('@upstash/redis').Redis | null = null;
let redisResolved = false;

async function getRedis() {
  if (redisResolved) return redisClient;
  redisResolved = true;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null; // not configured — endpoints degrade gracefully
  const { Redis } = await import('@upstash/redis');
  redisClient = new Redis({ url, token });
  return redisClient;
}

async function getSeatsSold(): Promise<number> {
  const redis = await getRedis();
  if (!redis) return 0;
  const sold = await redis.get<number>(SEATS_SOLD_KEY);
  return typeof sold === 'number' ? sold : Number(sold ?? 0);
}

async function getSeatsRemaining(): Promise<number> {
  const sold = await getSeatsSold();
  return Math.max(0, Math.min(SEATS_TOTAL, SEATS_TOTAL - sold));
}

// GET /api/seats-remaining — read by the /sbos price card and /sbos-join
app.get('/api/seats-remaining', async (_req, res) => {
  const redis = await getRedis();
  if (!redis) {
    return res.json({
      remaining: SEATS_TOTAL,
      total: SEATS_TOTAL,
      sold: 0,
      live: false,
    });
  }
  try {
    const sold = await getSeatsSold();
    return res.json({
      remaining: Math.max(0, Math.min(SEATS_TOTAL, SEATS_TOTAL - sold)),
      total: SEATS_TOTAL,
      sold,
      live: true,
    });
  } catch (err) {
    console.error('seats-remaining failed:', (err as Error).message);
    return res.json({ remaining: SEATS_TOTAL, total: SEATS_TOTAL, sold: 0, live: false });
  }
});

// Flatten any payload shape (form-encoded or nested JSON) to a string map.
function flattenPayload(
  obj: unknown,
  prefix = '',
  out: Record<string, string> = {}
) {
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== 'object') {
    out[prefix] = String(obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') flattenPayload(v, key, out);
    else out[key] = String(v);
  }
  return out;
}

// Collect every plausible product id from the payload.
function collectProductIds(fields: Record<string, string>): string[] {
  const ids = new Set<string>();
  for (const [key, value] of Object.entries(fields)) {
    const k = key.toLowerCase();
    const looksLikeProductId =
      k === 'base_product' ||
      k.endsWith('product_id') ||
      k.endsWith('product') ||
      (k.includes('product') && k.endsWith('id'));
    if (looksLikeProductId && /^\d+$/.test(value)) ids.add(value);
  }
  return [...ids];
}

const STACK_PURCHASE_EVENTS = new Set([
  'order.success',
  'order.success.bump',
  'purchase',
  'order_success',
]);
const STACK_REFUND_EVENTS = new Set([
  'order.refund',
  'order.refunded',
  'refund',
  'order.cancelled',
]);

// POST /api/thrivecart-webhook — decrements a seat per membership sale
app.post(
  '/api/thrivecart-webhook',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const fields = flattenPayload(req.body ?? {});

    const expected = process.env.THRIVECART_SECRET;
    if (expected) {
      const provided =
        fields['thrivecart_secret'] ?? fields['secret'] ?? fields['secretword'];
      if (provided !== expected) {
        return res.status(401).json({ ok: false, error: 'bad secret' });
      }
    }

    const event = (fields['event'] || '').toLowerCase();
    const orderId =
      fields['order_id'] ||
      fields['invoice_id'] ||
      fields['order.id'] ||
      fields['order.invoice_id'] ||
      fields['transaction_id'] ||
      '';

    const productIds = collectProductIds(fields);
    const consumesSeat = productIds.some((id) =>
      SEATS_CONSUMING_PRODUCT_IDS.includes(id)
    );

    if (!consumesSeat || !orderId) {
      return res.json({ ok: true, counted: false, event, productIds });
    }

    const redis = await getRedis();
    if (!redis) {
      // Acknowledge so ThriveCart doesn't keep retrying.
      return res.json({ ok: true, counted: false, reason: 'store not configured' });
    }

    try {
      if (STACK_PURCHASE_EVENTS.has(event)) {
        // SET NX returns null when the key already exists → already processed.
        const marker = await redis.set(`stack:seats:order:${orderId}`, Date.now(), {
          nx: true,
        });
        if (marker !== null) await redis.incr(SEATS_SOLD_KEY);
        return res.json({
          ok: true,
          action: 'consumed',
          orderId,
          remaining: await getSeatsRemaining(),
        });
      }

      if (STACK_REFUND_EVENTS.has(event)) {
        const consumed = await redis.get(`stack:seats:order:${orderId}`);
        if (consumed !== null && consumed !== undefined) {
          const released = await redis.set(
            `stack:seats:refund:${orderId}`,
            Date.now(),
            { nx: true }
          );
          if (released !== null && (await getSeatsSold()) > 0) {
            await redis.decr(SEATS_SOLD_KEY);
          }
        }
        return res.json({
          ok: true,
          action: 'released',
          orderId,
          remaining: await getSeatsRemaining(),
        });
      }

      return res.json({ ok: true, action: 'ignored', event, orderId });
    } catch (err) {
      console.error('thrivecart-webhook failed:', (err as Error).message);
      return res.status(500).json({ ok: false, error: 'counter update failed' });
    }
  }
);

// GET/POST /api/admin/seats?token=… — inspect or correct the seat count
app.all('/api/admin/seats', async (req, res) => {
  const token = process.env.STACK_ADMIN_TOKEN;
  const provided = (req.query.token as string) || req.headers['x-admin-token'];
  if (!token || provided !== token) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const redis = await getRedis();
  if (!redis) {
    return res.status(503).json({ ok: false, error: 'store not configured' });
  }

  if (req.method === 'POST') {
    const { sold, remaining } = req.body ?? {};
    let soldValue: number | undefined;
    if (typeof sold === 'number') soldValue = sold;
    else if (typeof remaining === 'number') soldValue = SEATS_TOTAL - remaining;
    if (soldValue === undefined) {
      return res
        .status(400)
        .json({ ok: false, error: 'provide { sold } or { remaining }' });
    }
    await redis.set(SEATS_SOLD_KEY, Math.max(0, Math.floor(soldValue)));
  }

  return res.json({
    ok: true,
    sold: await getSeatsSold(),
    remaining: await getSeatsRemaining(),
    total: SEATS_TOTAL,
  });
});

// Serve Vite build in production
async function startServer() {
  let renderApp: ((url: string) => string) | null = null;

  if (process.env.NODE_ENV === 'production') {
    const distPath = join(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    // Load SSR render function from the Vite SSR bundle
    try {
      const ssrBundle = await import(join(__dirname, 'dist/server/entry-server.js'));
      renderApp = ssrBundle.render;
      console.log('SSR enabled');
    } catch (e) {
      console.warn('SSR bundle not found, serving SPA fallback:', (e as Error).message);
    }

  const BASE_URL = 'https://aiforservicebusinesses.co';

  // Per-route meta overrides injected server-side so crawlers get correct tags without executing JS
  const routeMeta: Record<string, { title: string; description: string; canonical: string; image: string }> = {
    '/': {
      title: 'AI for Service Businesses: Build What Your Business Needs, With AI',
      description: 'Learn to build the apps, sites and systems your service business needs with AI. No code, no developer. Free resources and a community for service business owners.',
      canonical: `${BASE_URL}/`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/join': {
      title: 'Join AI for Service Businesses: Build What Your Business Needs, With AI',
      description: 'Join the community where service business owners learn to build the apps, sites and systems they need with AI. One payment, everything included.',
      canonical: `${BASE_URL}/join`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/resources/ai-build-playbook': {
      title: 'The AI Build Playbook: Free Reference Guide | AI for Service Businesses',
      description: 'A free plain-English reference to the language, tools and models behind building with AI. Glossary, file types, AI models and toolkit.',
      canonical: `${BASE_URL}/resources/ai-build-playbook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/resources/find-your-app-idea': {
      title: 'Find Your App Idea: Free Idea Generator | AI for Service Businesses',
      description: 'A free generator that gives you a personalised idea for the first thing your service business should build with AI.',
      canonical: `${BASE_URL}/resources/find-your-app-idea`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/resources/build-in-a-week': {
      title: 'How I Built My First AI App in a Week: Free Video Series | AI for Service Businesses',
      description: 'A free video series showing the exact tools, stack and process behind real, deployed AI products.',
      canonical: `${BASE_URL}/resources/build-in-a-week`,
      image: `${BASE_URL}/og-video-series.jpg`,
    },
    '/build-standards': {
      title: 'The AI Build Standards: Build Websites, Apps and Tools Properly With AI',
      description: 'A copy-paste prompt library, built on the ICI framework, to build and audit websites, apps and digital products with AI, properly.',
      canonical: `${BASE_URL}/build-standards`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/freetraining': {
      title: 'Free Training: How to Build AI Apps Without Code | AI for Service Businesses',
      description: 'Watch the free video series and discover how to build your first AI-powered app in a week using no-code AI tools. No technical experience needed.',
      canonical: `${BASE_URL}/freetraining`,
      image: `${BASE_URL}/og-video-series.jpg`,
    },
    '/ideas': {
      title: 'Discover Your AI App Idea | AI for Service Businesses',
      description: 'Not sure what to build? Get a personalised AI app idea based on your skills and goals. Free from AI for Service Businesses.',
      canonical: `${BASE_URL}/ideas`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/app-idea': {
      title: 'AI App Idea Generator | AI for Service Businesses',
      description: 'Answer 6 quick questions and get a personalised AI-powered app idea built around your skills, interests and goals.',
      canonical: `${BASE_URL}/app-idea`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/vibeplaybook': {
      title: 'The AI Build Playbook: Tools, Models and Reference | AI for Service Businesses',
      description: 'A free plain-English reference to the language, tools and models behind building with AI. Glossary, file types, AI models and toolkit.',
      canonical: `${BASE_URL}/vibeplaybook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/playbook': {
      title: 'Get the Vibe Playbook | AI for Service Businesses',
      description: 'Access the Vibe Playbook, a free resource packed with tools, frameworks and reference guides for building AI-powered apps without code.',
      canonical: `${BASE_URL}/playbook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/bundle': {
      title: 'The ultimate AI build bundle for non-technical founders | AI for Service Businesses',
      description: 'Worth £1,962. Lifetime access for a one-off £197, or split into 2 × £99 or 3 × £66. Closes 11:30am Tuesday 9 June.',
      canonical: `${BASE_URL}/bundle`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/resources': {
      title: 'Free Resources for Building With AI | AI for Service Businesses',
      description: 'Free and low-cost resources to get you building with AI. Start with the idea generator, the video series or the AI Build Playbook.',
      canonical: `${BASE_URL}/resources`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/artoftheaudit': {
      title: 'The Art of the Audit | AI for Service Businesses',
      description: 'How to run a paid business audit start to finish: the five-step process, exactly what goes in the report and the prompts and templates you keep.',
      canonical: `${BASE_URL}/artoftheaudit`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/sampleauditreport': {
      title: 'Sample Audit Report: Maple and Moss | AI for Service Businesses',
      description: 'A complete worked example of a systems audit report, in ten chapters. Fictional client, real findings. Keep the shape, swap in your client and write it in your own voice.',
      canonical: `${BASE_URL}/sampleauditreport`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/auditprompts': {
      title: 'The Three Audit Prompts | AI for Service Businesses',
      description: 'The three prompts from The Art of the Audit: prepare your questions, turn your notes into a draft report and find your first client. Copy and run.',
      canonical: `${BASE_URL}/auditprompts`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/terms': {
      title: 'Terms and Conditions | Ascendz Digital Limited',
      description: 'The terms and conditions governing the use of our website and the purchase of our digital products, services and subscriptions.',
      canonical: `${BASE_URL}/terms`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/archive/bumpsale': {
      title: 'Archived: the June 2026 bundle campaign | AI for Service Businesses',
      description: 'A record of the June 2026 bundle bumpsale, kept for reference. The campaign closed on 4 June 2026 and nothing on the page is for sale.',
      canonical: `${BASE_URL}/archive/bumpsale`,
      image: `${BASE_URL}/og-image.jpg`,
    },
  };

  // Sections of the sample report are real routes rather than anchors. These are
  // listed rather than prefix-matched so an unknown slug still 404s properly.
  const REPORT_CHAPTERS = [
    'summary',
    'context',
    'what-we-looked-at',
    'findings',
    'risk',
    'cost-of-standing-still',
    'what-good-looks-like',
    'roadmap',
    'proposal',
    'appendix',
  ].map(c => `/sampleauditreport/${c}`);

  // Known SPA routes (must mirror src/App.tsx). Anything outside this set is a 404.
  const VALID_ROUTES = new Set([
    '/',
    '/join',
    '/resources/ai-build-playbook',
    '/resources/find-your-app-idea',
    '/resources/build-in-a-week',
    '/build-standards',
    '/build-standards/thank-you',
    '/website-standards',
    '/freetraining',
    '/videos',
    '/app-idea',
    '/ideas',
    '/ideas-access',
    '/vibeplaybook',
    '/playbook',
    '/unsubscribe',
    '/logo',
    '/bundle',
    '/checkout',
    '/complete',
    '/resources',
    '/artoftheaudit',
    '/sampleauditreport',
    '/auditprompts',
    '/terms',
  ]);

  // Retired campaigns, reachable for reference only. They answer 200 rather than
  // 404 so people can actually read them, but they must stay out of search. The
  // page carries a noindex in its Helmet as well, this header is the copy that
  // holds even before any JavaScript runs.
  const ARCHIVED_ROUTES = new Set(['/archive/bumpsale']);

  app.get('*', (req, res) => {
    const meta = routeMeta[req.path];
    const isKnownRoute =
      VALID_ROUTES.has(req.path) ||
      ARCHIVED_ROUTES.has(req.path) ||
      REPORT_CHAPTERS.includes(req.path);

    if (ARCHIVED_ROUTES.has(req.path)) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }
    let html = readFileSync(join(distPath, 'index.html'), 'utf-8');

    // Inject server-side meta tags
    if (meta) {
      html = html
        .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/g, `$1${meta.description}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/g, `$1${meta.canonical}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/g, `$1${meta.canonical}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/g, `$1${meta.title}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/g, `$1${meta.description}$2`)
        .replace(/(<meta property="og:image" content=")[^"]*(")/g, `$1${meta.image}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/g, `$1${meta.title}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/g, `$1${meta.description}$2`)
        .replace(/(<meta name="twitter:image" content=")[^"]*(")/g, `$1${meta.image}$2`);
    }

    // Inject server-rendered app HTML so crawlers get full page content
    if (renderApp) {
      try {
        const appHtml = renderApp(req.path);
        html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      } catch (err) {
        console.error('SSR render error for', req.path, err);
      }
    }

    res.status(isKnownRoute ? 200 : 404).send(html);
  });
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer();
