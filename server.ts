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

// Serve Vite build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, 'dist');
  app.use(express.static(distPath));

  const BASE_URL = 'https://vibecodinglab.co';

  // Per-route OG tag overrides (crawlers read the initial HTML, not JS)
  const routeMeta: Record<string, { title: string; description: string; image: string }> = {
    '/freetraining': {
      title: 'Free Video Series — Vibe Coding Lab',
      description: 'Watch the free series: how I built my first AI app in a week using no-code AI tools. Get instant access plus a personalised app idea in 60 seconds.',
      image: `${BASE_URL}/og-video-series.jpg`,
    },
  };

  app.get('*', (req, res) => {
    const meta = routeMeta[req.path];
    if (!meta) {
      return res.sendFile(join(distPath, 'index.html'));
    }
    const pageUrl = `${BASE_URL}${req.path}`;
    let html = readFileSync(join(distPath, 'index.html'), 'utf-8');
    html = html
      .replace(/(<meta property="og:url" content=")[^"]*(")/g, `$1${pageUrl}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/g, `$1${meta.title}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/g, `$1${meta.description}$2`)
      .replace(/(<meta property="og:image" content=")[^"]*(")/g, `$1${meta.image}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/g, `$1${meta.title}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/g, `$1${meta.description}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/g, `$1${meta.image}$2`)
      .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    res.send(html);
  });
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
