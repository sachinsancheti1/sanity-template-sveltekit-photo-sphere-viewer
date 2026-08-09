---
name: run-app
description: Launch the SvelteKit virtual-tour app and Sanity Studio dev servers and smoke-test them with headless Edge via Playwright — use when asked to run the app, verify a change works in the browser, or screenshot the viewer
---

# Running the virtual tour app + studio

## Start the dev servers

From the repo root (each in the background):

```bash
cd app && npm run dev      # → http://localhost:5173
cd studio && npm run dev   # → http://localhost:3333
```

Env requirements: `app/.env` needs `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`; `studio/.env` needs `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`. Both already exist on this machine.

Poll — don't sleep:

```bash
timeout 60 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'
timeout 90 bash -c 'until curl -sf http://localhost:3333 >/dev/null; do sleep 1; done'
```

Stop (Windows Git Bash — `lsof` is unavailable, and killing the npm wrapper doesn't free the port):

```bash
netstat -ano | grep -E ":(5173|3333) .*LISTENING" | awk '{print $5}' | sort -u \
  | while read pid; do taskkill //PID $pid //F; done
```

## Drive headlessly

`chromium-cli` is not installed on this machine. Use Playwright with the system Edge browser (no browser download needed): one-time `npm init -y && npm install playwright` in a scratch dir, then a script like:

```js
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.psv-canvas', { timeout: 60000 });
await page.waitForTimeout(4000); // panorama texture streams from Sanity CDN
await page.screenshot({ path: 'viewer.png' });
console.log(errors);
await browser.close();
```

**Look at the screenshot** — a rendered panorama with the compass (bottom right) and a hotspot arrow is the pass signal. Then check the console-error list is empty.

## What to verify per surface

- **Tour page** (`/`): `.psv-canvas` present, panorama rendered, zero console errors. Open the gallery with `page.locator('.psv-gallery-button').click()` to check thumbnails.
- **Health dashboard** (`/health`): renders node counts and "All nodes look healthy" (or a findings list).
- **Studio** (`:3333`): only the login shell is verifiable headlessly (Sanity uses OAuth) — a rendered "Choose login provider" card with zero console errors is the pass signal. For deeper studio verification use `npm run build` in `studio/` instead.

## Gotchas

- Navigation hotspots are canvas-rendered (three.js) — they have no DOM selectors; don't try to click them.
- First paint takes seconds: panoramas stream from the Sanity CDN. Wait for `.psv-canvas`, then give it ~4s before screenshotting.
- Autorotate is on by default, so two screenshots of the same node will differ — that's expected (and proves autorotate works).
