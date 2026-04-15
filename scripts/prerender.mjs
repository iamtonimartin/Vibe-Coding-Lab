/**
 * Prerender script — runs after `vite build`.
 * Spins up `vite preview`, visits each public route with Puppeteer,
 * and saves the rendered HTML as a static index.html for that route.
 *
 * To add a new route: add it to the ROUTES array below.
 */

import puppeteer from 'puppeteer';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4999;
const BASE_URL = `http://localhost:${PORT}`;
const RENDER_DELAY_MS = 1500;

const ROUTES = [
  '/',
  '/freetraining',
  '/ideas',
  '/app-idea',
  '/vibeplaybook',
  '/playbook',
];

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let ready = false;
    const onData = (data) => {
      if (!ready && data.toString().includes(String(PORT))) {
        ready = true;
        resolve(server);
      }
    };

    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('error', reject);

    // Fallback: assume ready after 3s
    setTimeout(() => {
      if (!ready) { ready = true; resolve(server); }
    }, 3000);
  });
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, RENDER_DELAY_MS));

  const html = await page.content();
  await page.close();

  const outDir = route === '/'
    ? DIST
    : path.join(DIST, ...route.split('/').filter(Boolean));

  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
  console.log(`  ✓ ${route}`);
}

async function main() {
  console.log('\nPrerendering routes...');

  const server = await startPreviewServer();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  try {
    for (const route of ROUTES) {
      await renderRoute(browser, route);
    }
    console.log('\nPrerender complete.\n');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
