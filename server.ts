import express from 'express';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const KIT_API_KEY = process.env.KIT_API_KEY || '';
const KIT_FORM_ID = process.env.KIT_FORM_ID || '';
const KIT_IDEAS_FORM_ID = process.env.KIT_IDEAS_FORM_ID || '';
const KIT_PLAYBOOK_FORM_ID = process.env.KIT_PLAYBOOK_FORM_ID || '';
const KIT_SECURE_FORM_ID = process.env.KIT_SECURE_FORM_ID || '';

app.use(express.json());

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

  const BASE_URL = 'https://thevibecodinglab.co';

  // Per-route meta overrides injected server-side so crawlers get correct tags without executing JS
  const routeMeta: Record<string, { title: string; description: string; canonical: string; image: string }> = {
    '/': {
      title: 'Vibe Coding Lab: Build AI-Powered Apps Without Code',
      description: 'Learn to build your own AI-powered app without writing code. Join the Vibe Coding Lab. Live sprints, community and tools, with a 7-day free trial.',
      canonical: `${BASE_URL}/`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/freetraining': {
      title: 'Free Training: How to Build AI Apps Without Code | Vibe Coding Lab',
      description: 'Watch the free video series and discover how to build your first AI-powered app in a week using no-code AI tools. No technical experience needed.',
      canonical: `${BASE_URL}/freetraining`,
      image: `${BASE_URL}/og-video-series.jpg`,
    },
    '/ideas': {
      title: 'Discover Your AI App Idea | Vibe Coding Lab',
      description: 'Not sure what to build? Get a personalised AI app idea based on your skills and goals. Free from Vibe Coding Lab.',
      canonical: `${BASE_URL}/ideas`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/app-idea': {
      title: 'AI App Idea Generator | Vibe Coding Lab',
      description: 'Answer 6 quick questions and get a personalised AI-powered app idea built around your skills, interests and goals.',
      canonical: `${BASE_URL}/app-idea`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/vibeplaybook': {
      title: 'The Vibe Coding Playbook: Tools, Models & Reference | Vibe Coding Lab',
      description: 'A comprehensive reference guide to the tools, AI models and concepts behind vibe coding. Your go-to resource for building with no-code AI.',
      canonical: `${BASE_URL}/vibeplaybook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/playbook': {
      title: 'Get the Vibe Playbook | Vibe Coding Lab',
      description: 'Access the Vibe Playbook, a free resource packed with tools, frameworks and reference guides for building AI-powered apps without code.',
      canonical: `${BASE_URL}/playbook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/bundle': {
      title: 'The ultimate AI build bundle for non-technical founders | Vibe Coding Lab',
      description: 'Worth £1,962. Lifetime access for a one-off £197, or split into 2 × £99 or 3 × £66. Closes 11:30am Tuesday 9 June.',
      canonical: `${BASE_URL}/bundle`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/resources': {
      title: 'Free Resources for Building AI Apps Without Code | Vibe Coding Lab',
      description: 'Free tools, guides and training to help you build and ship your first AI-powered app without code. The video series, app idea generator and the Vibe Coding Playbook.',
      canonical: `${BASE_URL}/resources`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/artoftheaudit': {
      title: 'The Art of the Audit | Vibe Coding Lab',
      description: 'How to run a paid business audit start to finish: the five-step process, exactly what goes in the report and the prompts and templates you keep.',
      canonical: `${BASE_URL}/artoftheaudit`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/sampleauditreport': {
      title: 'Sample Audit Report: Maple and Moss | Vibe Coding Lab',
      description: 'A complete worked example of a systems audit report, in ten chapters. Fictional client, real findings. Keep the shape, swap in your client and write it in your own voice.',
      canonical: `${BASE_URL}/sampleauditreport`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/auditprompts': {
      title: 'The Three Audit Prompts | Vibe Coding Lab',
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
      title: 'Archived: the June 2026 bundle campaign | Vibe Coding Lab',
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
