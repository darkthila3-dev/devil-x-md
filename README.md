# Devil X MD — Full Bot Base

A complete WhatsApp bot base (Baileys) with a built-in animated web pairing site — one project, one process.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` — set `OWNER_NUMBER` to your own WhatsApp number (country code, no `+`).

## Run

```bash
npm start
```

Then open `http://localhost:3000` in a browser:
1. Enter your WhatsApp number (country code, digits only).
2. A pairing code appears on the ember-themed page.
3. In WhatsApp: **Linked Devices → Link with phone number** → enter the code.

Once paired, the same process keeps running as the bot — no separate step needed. Session credentials save to `/session`, so you won't need to re-pair unless that folder is deleted or you're logged out.

## Adding commands

Drop a file in `/plugins`:

```js
const { reply } = require('../lib/reply'); // auto-appends the "Devil X MD" footer

module.exports = {
  command: 'yourcommand',
  description: 'What it does',
  handler: async ({ sock, msg, from, args }) => {
    await reply(sock, from, 'Hello!', msg);
  }
};
```

Send `.reload` as the owner to hot-reload plugins without restarting.

## Included commands
- `.menu` / `.help` — sends the devil mark image with the command list as caption
- `.ping` — sends the devil mark image with response time as caption
- `.alive` — sends the devil mark image with an online-check caption
- `.uptime` / `.runtime` — how long the bot process has been running
- `.owner` / `.creator` — owner's WhatsApp contact link (`wa.me/<OWNER_NUMBER>`)
- `.about` — short bot info
- `.jid` — show the current chat's ID
- `.time` / `.date` — current date and time
- `.tagall` / `.everyone` — mention all group members (groups only)
- `.groupinfo` / `.ginfo` — group name, member count, description (groups only)
- `.tiktok` / `.tt <url>` — download a TikTok video (no watermark)
- `.fb` / `.facebook <url>` — download a Facebook video
- `.gen` / `.imagine <prompt>` — generate an AI image from a text prompt (free, via Pollinations.ai)

All commands share one footer style, built in `lib/reply.js`:

```
© Powered By Devil X MD
🍭
```

Change `FOOTER` in `.env` to rename it — every command picks it up automatically since they all send through `reply()` / `replyImage()` / `replyImageUrl()` / `replyVideoUrl()` in `lib/reply.js`.

Downloads use the `btch-downloader` package, which wraps unofficial third-party APIs. These can break without notice if the source sites change — if a download command stops working, check for a newer version of the package first (`npm update btch-downloader`).

`assets/menu.png`, `assets/ping.png`, `assets/alive.png` are the images sent with each — currently all the same drawn devil mark. Replace any of them with your own image file (same filename) to change what that command sends.

## Branding

- Bot name and footer are set in `.env` (`BOT_NAME`, `FOOTER`) and read in `config.js`.
- The pairing site's devil mark is a drawn inline SVG in `public/index.html` — replace it with your own logo image if you have one (swap the `<svg class="mark">` block for an `<img>` tag).

## Deploying to Railway

1. Push this project to a GitHub repo (or use Railway's CLI to deploy the folder directly).
2. On [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → pick the repo.
3. Railway auto-detects Node.js via `railway.json` / `Procfile` and runs `npm start`.
4. Under **Variables**, add: `BOT_NAME`, `FOOTER`, `PREFIX`, `OWNER_NUMBER` (Railway sets `PORT` for you automatically — no need to add it).
5. Under **Settings → Networking**, click **Generate Domain** to get a public URL for the pairing site.
6. Open that URL, pair your number the same way as locally.

**Important — session persistence:** Railway's default filesystem is ephemeral, so the `/session` folder (your WhatsApp login) is wiped on every redeploy or restart, forcing you to re-pair each time. To avoid that, add a **Railway Volume** (Settings → Volumes → New Volume) mounted at `/app/session`, so credentials survive restarts and redeploys.

Any other always-on Node.js host works the same way (VPS, Render, etc.) — just not serverless/edge platforms (plain Cloudflare Workers), since this keeps a persistent WebSocket connection to WhatsApp and an HTTP server running side by side.
