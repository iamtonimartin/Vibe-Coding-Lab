// Check pages at real phone widths.
//
//   node scripts/mobile-check.mjs http://localhost:3001/join /tmp/out 320 360 390
//
// Why this exists: `chrome --headless --window-size=360,800` does NOT give you
// a 360px viewport. Chrome clamps the window to 500px wide and simply crops the
// screenshot, so the page renders at 500px and every phone-width check is a
// lie: desktop breakpoints apply, and elements look cut off when they are only
// cropped. CDP's Emulation.setDeviceMetricsOverride sets the real viewport.
//
// Reports, per width: the nav logo's box and whether its aspect ratio has been
// distorted, whether the document scrolls horizontally, whether the nav CTA
// fits, and which elements extend past the viewport. Writes m-<width>.png too.
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [, , url, outDir, ...widths] = process.argv;

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--remote-debugging-port=9333',
  '--user-data-dir=' + outDir + '/cdp-profile', '--no-first-run', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch('http://127.0.0.1:9333/json/version');
      return (await r.json()).webSocketDebuggerUrl;
    } catch { await sleep(200); }
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await endpoint());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);

const results = [];
for (const w of widths.map(Number)) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: w, height: 860, deviceScaleFactor: 2, mobile: true,
  }, sessionId);
  await send('Page.navigate', { url }, sessionId);
  await sleep(2600);

  const { result } = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const logo = document.querySelector('.aisb .brand .logo');
      const cta  = document.querySelector('.aisb .topnav .joinbtn');
      const r = logo && logo.getBoundingClientRect();
      const c = cta && cta.getBoundingClientRect();
      const widest = [...document.querySelectorAll('body *')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
        .map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : ''));
      return {
        inner: window.innerWidth,
        scrollW: document.documentElement.scrollWidth,
        logo: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null,
        ctaRight: c ? +c.right.toFixed(1) : null,
        overflowing: [...new Set(widest)].slice(0, 6),
      };
    })()`,
  }, sessionId);
  results.push({ w, ...result.value });

  const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
  writeFileSync(`${outDir}/m-${w}.png`, Buffer.from(shot.data, 'base64'));
}

const RATIO = 1938 / 263;
console.log(`\n  ${url}\n`);
for (const r of results) {
  const a = r.logo ? r.logo.w / r.logo.h : 0;
  const drift = r.logo ? (a / RATIO - 1) * 100 : 0;
  const shape = !r.logo ? 'no logo' : Math.abs(drift) < 3 ? 'shape ok' : `SQUASHED ${drift.toFixed(0)}%`;
  const over = r.scrollW > r.inner + 1 ? `OVERFLOW +${r.scrollW - r.inner}px` : 'no overflow';
  const cta = r.ctaRight === null ? 'no cta' : r.ctaRight <= r.inner + 1 ? 'cta fits' : `CTA OFF-SCREEN by ${(r.ctaRight - r.inner).toFixed(0)}px`;
  console.log(`  ${String(r.w).padStart(3)}px  logo ${r.logo ? `${r.logo.w}x${r.logo.h}` : '-'}  ${shape.padEnd(14)} ${over.padEnd(18)} ${cta}`);
  if (r.overflowing.length) console.log(`         overflowing: ${r.overflowing.join(', ')}`);
}
chrome.kill();
process.exit(0);
