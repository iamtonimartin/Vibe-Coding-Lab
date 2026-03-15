import express from 'express';
import dotenv from 'dotenv';
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
    const response = await fetch(`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_KEY,
      },
      body: JSON.stringify({
        first_name: firstName,
        email_address: email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Kit.com error:', error);
      return res.status(response.status).json({ error: 'Subscription failed.' });
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
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
