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

app.use(express.json());

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
      console.warn('SSR bundle not found — serving SPA fallback:', (e as Error).message);
    }

  const BASE_URL = 'https://thevibecodinglab.co';

  // Per-route meta overrides injected server-side so crawlers get correct tags without executing JS
  const routeMeta: Record<string, { title: string; description: string; canonical: string; image: string }> = {
    '/': {
      title: 'Vibe Coding Lab — Build AI-Powered Apps Without Code',
      description: 'Learn to build your own AI-powered app without writing code. Join the Vibe Coding Lab — live sprints, community, tools and lifetime access.',
      canonical: `${BASE_URL}/`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/freetraining': {
      title: 'Free Training — How to Build AI Apps Without Code | Vibe Coding Lab',
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
      title: 'The Vibe Coding Playbook — Tools, Models & Reference | Vibe Coding Lab',
      description: 'A comprehensive reference guide to the tools, AI models and concepts behind vibe coding. Your go-to resource for building with no-code AI.',
      canonical: `${BASE_URL}/vibeplaybook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
    '/playbook': {
      title: 'Get the Vibe Playbook | Vibe Coding Lab',
      description: 'Access the Vibe Playbook — a free resource packed with tools, frameworks and reference guides for building AI-powered apps without code.',
      canonical: `${BASE_URL}/playbook`,
      image: `${BASE_URL}/og-image.jpg`,
    },
  };

  app.get('*', (req, res) => {
    const meta = routeMeta[req.path];
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

    res.send(html);
  });
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer();
