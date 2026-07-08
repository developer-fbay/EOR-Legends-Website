# Deploying legendseor.com to DigitalOcean

## Build & run

```bash
npm ci
npm run build          # outputs .output/
node .output/server/index.mjs   # serves on PORT (default 3000)
```

On **DO App Platform**: create a Web Service from this repo, build command `npm run build`, run command `node .output/server/index.mjs`. App Platform sets `PORT` automatically.

On a **Droplet**: run the same command under a process manager (`pm2 start .output/server/index.mjs --name legends`), put Nginx or the DO load balancer in front for TLS.

## Required environment variables

Set these in the DO dashboard (App Platform → Settings → Environment Variables, mark secrets encrypted). The app fails soft without them (forms return 503, leads only log), so double-check after the first deploy:

| Variable | Purpose |
|---|---|
| `GF_BASE_URL` | `https://legendseor.com` — WordPress base for Gravity Forms |
| `GF_CONSUMER_KEY` / `GF_CONSUMER_SECRET` | Gravity Forms REST credentials |
| `SUPABASE_URL` / `SUPABASE_KEY` | Supabase project (lead backup + admin) |
| `SUPABASE_SERVICE_KEY` | Server-side lead inserts |
| `NUXT_PUBLIC_SITE_URL` | Optional; defaults to `https://legendseor.com` (used by sitemap) |

## Security — what's built into the app

- **Rate limiting** (`server/middleware/rate-limit.ts`): per-IP, per-minute — 10 writes and 120 reads on `/api/*`. Excess requests get HTTP 429. In-memory, correct for a single instance; move to Redis if you ever scale horizontally.
- **Bot protection**: hidden honeypot field on every public form — bots that fill it get a fake success and the submission is silently dropped (never reaches Gravity Forms, Zapier, or Close).
- **Input caps**: form endpoints reject oversized/malformed payloads before any downstream call.
- **Security headers** on every response: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Form allowlists**: the API only accepts the known Gravity Form IDs (24, 28, 29, 30, 31).
- `/admin`, `/api/`, and `/lead-input-form` are disallowed in robots.txt; the lead form page is `noindex`.

## Security — what to set up in front of the app (DDoS)

Application code cannot absorb a volumetric DDoS; that layer must sit in front:

1. **Cloudflare (recommended, free tier is enough)**: point the domain's DNS at Cloudflare, proxy (orange-cloud) the records. This gives DDoS absorption, bot fight mode, and TLS. Enable **"Under Attack" mode** if an attack ever starts.
2. **DigitalOcean Cloud Firewall** (Droplet) or App Platform's built-in edge: allow only 80/443 inbound; if using Cloudflare, restrict inbound to [Cloudflare's IP ranges](https://www.cloudflare.com/ips/) so attackers can't bypass it by hitting the droplet IP directly.
3. Keep WordPress (the form/content backend) behind its own protections — the Nuxt app is the only thing that should talk to it with the GF credentials.

## Go-live checklist

- [ ] DNS A/CNAME → DO app (via Cloudflare proxy)
- [ ] All env vars set (submit a test form, check GF entries)
- [ ] `https://legendseor.com/sitemap.xml` loads → submit to Google Search Console + Bing Webmaster Tools
- [ ] `https://legendseor.com/robots.txt` loads
- [ ] 301 redirects from any old WP URLs that changed (e.g. `/true-cost-of-an-employee-uk/` → `/staffing-insights/true-cost-of-an-employee-in-the-uk`) — configure at Cloudflare (Bulk Redirects) or in WP once it's demoted to headless-only
- [ ] Rename the WP case study slug `test-case-study` → `effer-ventures`, and `thinklocum` → `thinkworkforce` (then remove the aliases in `app/pages/case-studies/[slug].vue`)
