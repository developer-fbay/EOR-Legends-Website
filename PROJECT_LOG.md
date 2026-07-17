# Legends EOR Website — Project Log

Living context file. Claude updates this at the end of every request; team members
should add their own entries under **Team changes** when they change anything
outside this repo (WordPress, Zapier, Close, DNS, design assets).

---

## Project snapshot

- **Stack:** Nuxt 3 (Vue 3), Nitro server, headless WordPress backend at legendseor.com (content APIs + Gravity Forms)
- **Live:** https://legends-eor-2g8hb.ondigitalocean.app (DigitalOcean App Platform, web service, autodeploys from `main`)
- **Repo:** github.com/developer-fbay/EOR-Legends-Website (push only when Codi says "push" — pushes deploy)
- **Target viewports:** marketing manager uses 1280×587 (14" @150%) and 1536×~660-700 (1920 @125% with taskbar+browser chrome). Every full-screen section must fit these.
- **Deploy rules:** Node pinned 24.x (never add `engines.npm`), lockfile must be regenerated with `npx -y npm@10 install --package-lock-only` after any dependency change, never add sharp/native-optional packages. Verify deploys by polling the live site for a marker string.
- **Forms:** site forms proxy to Gravity Forms REST (header 29, footer 28, popup 31, guide 30, lead-input 24). GF creds in `.env` / DO env vars. Form 24 + 28/29/31 have Zapier "Website Inbound"/"New Lead Input" feeds → Codi's automations → Close CRM.
- **Pillar/cluster content:** WP source pages were deleted (2026-07-13); extracted bodies are snapshotted in `server/data/pillars/*.json` and served as fallback. Any future WP-scraped content must be snapshotted the same way.

## What needs to be done (open items)

- [ ] **WP team:** fix problem-2-cluster-1 page title/H1 in WP (still "Problem 2 cluster 1" + copied pillar-1 H1; site pins the correct title server-side meanwhile)
- [ ] **WP team:** decide whether to restore the deleted pillar/cluster WP pages (site works from snapshots either way)
- [ ] **WP team (optional):** fill the case-study excerpt fields in WP (site uses hardcoded fallbacks from the 2026 design)
- [ ] **WP team:** remaining em dashes inside WP-served article content need editing in WP
- [ ] **Codi:** check the "Website Inbound" Zap field mapping after a test submission from the new forms (labels differ slightly from the old form); remap in Zapier if fields come through blank — or ask Claude to rename GF field labels to match
- [ ] **Codi:** decide if the guide download form (GF 30) should also fire a Zapier feed
- [ ] **Content:** 3 unlinked Educational Resources cards on the homepage need pillar pages/URLs (employee turnover, disadvantages of outsourcing, Employment Rights Act 2025)
- [ ] **Content:** Pillar 2 has one cluster; more clusters when written
- [ ] **Later:** domain flip to legendseor.com (WP moves to subdomain, set WP_BASE_URL, DNS via Cloudflare — see DEPLOYMENT.md)

## Team changes (non-Claude)

> Add entries here when anyone changes WordPress, Zapier, Close, design assets, or edits code outside a Claude session (e.g. Cursor).

- **2026-07-13 — WP team:** enabled Gravity Wiz Advanced Phone Field + made company/message required on GF forms 28/29/31; added lead owner "Christopher Perumal" to GF 24. (Broke site form forwarding silently; fixed same day, see log.)
- **~2026-07-12/13 — WP team:** deleted WP pages: /true-cost-of-an-employee-uk/, /permanent-establishment/, /cost-of-employing-someone-uk/, /problem-2-cluster-1/, /2026-home/ and other 2026 design pages. (Emptied the site's pillar/cluster pages as caches expired; rescued via repo snapshots.)
- **2026-07-13 — Designer:** delivered vectorized favicon (Favicon-L-EOR.svg) and new IT-support cover image.
- **2026-07-13 — Content team:** delivered service hero add-on copy (Services hero section add on.md) and form CTA copy (form-ctas.md).
- **2026-07-11 — Codi (Cursor):** content edits committed alongside favicon work.

## Done log (newest first)

### 2026-07-17 (later) — CEO copy pass + polish (committed, NOT yet pushed)
- Home: all 7 section subheadings replaced with CEO copy (md file).
- HR service page: new hero subtext; section-copy fields per service (defaults unchanged elsewhere); HIW section replaced with "What makes our HR support different?" + 3 new steps; timeline arrow tips removed (desktop+mobile), lines and dots kept. NOTE: the md's HIW subtext ("From learning your culture...") was superseded by the inline full-replacement copy.
- CMS: empty Services tab removed; A/B dashboard buttons unified green; tooltips explaining every CTA section; popup opener vs popup submit clearly split.

### 2026-07-17 — A/B CTA Testing round 3 + CMS restructure (committed, NOT yet pushed)
- Renamed to "A/B CTA Testing". Click tracking per section added (new cta_events type + surface + breakdown view, applied to prod Supabase).
- Tests run a configurable length (default 10 days); finish (auto/manual) locks each section to ITS winner (forms by conversions, buttons by clicks, overall fallback) written as deletable overrides; verified with distinct per-section winners on real data.
- Dashboard rebuilt with modals (start test, navbar CTA, page CTAs via page picker incl. All pages), Active custom CTAs list with per-item delete/revert, per-section leader chips; Per-Section Texts panel + 80/10/10 promote removed.
- CMS: Tools + Guides types removed; 6 content types consolidated under a Resources tab; Services keeps its tab; dashboard is lead-centric (all-time count with Today/Week/Month filters + recent leads).

### 2026-07-17 — CTA feature round 2 (committed, NOT yet pushed)
- New homepage FAQ set from the content team (7 questions, numbers removed; structured data follows).
- "Stop & revert to default texts" button on /admin/cta (+ auth-guarded stop endpoint); Codi's test experiment cleared.
- Per-Section Texts panel: 11 sections individually lockable to custom texts from the dashboard (blank = follow experiment/default); resolution override > variant > fallback, verified with mixed experiment + override.
- Page-Specific Rules (marketing team lead): change one button on one page only via a rule builder (section + path + text); page rule > section rule > variant > default. Verified on /services/payroll vs /services/hr.

### 2026-07-16 — CTA A/B rotation feature (built, committed, NOT yet pushed)
- Monthly CTA text rotation across every contact-intent button (form submits, header/footer Contact Us, consultation band, Speak to an Expert, Lets get started, mobile hero popup CTA): 3 texts at 33/33/33, winner promoted to 80/10/10 (manual button or auto on the 1st, Europe/London), winner carries at 100% if no new set.
- Supabase tables created in production via the Management API (cta_experiments/variants/events/settings + stats view, RLS locked to service key + authenticated admin); schema documented in supabase/schema.sql.
- Server: /api/cta/config (60s cache + lazy monthly lifecycle, never 500s), /api/cta/impression (one per session, JS-only so bots don't count), conversion hook in /api/lead (every GF-validated submission counts, idempotent on GF entry id), auth-guarded admin API (start/promote/settings/overview).
- Client: useCtaVariant composable — cookie assignment during SSR (variant text in first HTML, no flash), shared config fetch in the default layout, impressions excluded on /admin and /lead-input-form.
- /admin/cta dashboard: live variant table + CVR chart, promote with min-sample guard + force, manual/auto toggle, start-next-set form with 60-char previews, changelog of archived sets.
- Verified end-to-end: 33/33/33 and 80/10/10 serving distributions, same text across all surfaces per visitor, impression dedup across nav/reload, conversion attributed with GF entry id + duplicate blocked, admin 401s, full fallback to hardcoded texts without Supabase. Test data cleaned from Supabase + GF.
- NOTE for Codi: dashboard UI needs your eyes — log into /admin/cta locally and start the first real set when happy.

### 2026-07-15 (later) — homepage refinements
- Mobile hero fills the first screen again (full-screen fold restored on phones): content vertically centered, logos at the fold bottom, salary section hidden until scroll (Codi's iPhone test).
- iPhone 15-17 fix: fold sized with lvh so the green section can't peek through Safari's bottom-bar zone; logo marquee images load eagerly (iOS lazy-loading left the moving strip blank mid-scroll). *(live)*
- How It Works: new 4-step copy (Plan the hire / Conduct the final interview / We employ and onboard them / You lead them. We handle the rest.), step 4 label now ONGOING. *(live)*
- Mobile hero spacing polish (Codi's iPhone 17): h1 +40px / subtitle +30px bottom space, CTA optically centered between USPs and carousel (height-responsive margin), logos sit lower so the strip balances around Safari's URL bar; fine-tuned by Codi's manual tweaks (58px strip clearance, CTA -15px). *(live)*
- Reviews carousel: 6 new reviews from marketing; kept the 4 existing reviewer names, added Oliver Hartley and Charlotte Bennett. *(live)*
- Section headings (h1/h2, the animated set) render Title Case sitewide via CSS `text-transform: capitalize`; article/content headings keep written casing.
- Mobile hero: Google Reviews pill hidden too — headline/subtitle/stats/CTA with equal spacing top and bottom, logo carousel directly beneath.
- "Got questions" section: FAQ card first and Educational Resources below, both full width; resources trimmed to the 2 published pillar pages.
- Mobile hero: inline form hidden on phones; centered "Speak to our team" button opens the popup contact form; logo carousel sits right under the Google Reviews pill (fold no longer stretched on phones).
- Hiring-speed FAQ answer aligned with the comparison table (CVs in 7 days, first hire in 2–4 weeks).

### 2026-07-15 — CEO snag list (EOR Alex)
- Hero subtitle: "IT, HR, Payroll, Benefits, Office, Equipment - One Stop Shop."
- iPhone hero gap removed: the marketing-manager margin above the salary section is now desktop-only (≥993px); mobile section padding trimmed.
- Salary tool reversed per CEO: South Africa is always the benchmark; the form asks "What country is your main business in?" which drives the comparison country and auto-sets the currency (GB→GBP, US→USD, EU→EUR...). Same-country picks dedupe silently instead of erroring.
- iPhone: after Search the results/compare card scrolls into view (waits for the form-collapse transition), so the transition reads as functional.
- "Frequently Asked Questions" Title Case across all 7 FAQ headings.
- **Parked**: monthly CTA rotation + A/B tracking feature — full plan approved-in-principle, saved in the Claude plan file; revisit when Codi says go.

### 2026-07-14
- **PROJECT_LOG.md + CLAUDE.md created**: living context file (done/pending/team changes) that Claude reads each session and updates after every request. *(pushed)*

### 2026-07-13 (evening)
- **Educational Resources card** (homepage): heading renamed, intro + question lines removed, statements get orange arrow-in-circle icons matching the FAQ style. *(live)*
- **Case-study parallax** now uses the archive's green client logo blocks instead of team photos. *(live)*
- **Zapier feeds created** on GF 29/28/31 ("Website Inbound - Header/Footer/Popup"), cloned from the old site's feed — same webhook, so Codi's automation now runs for new-site enquiries. *(live on WP side immediately)*
- **Forms audit:** guide form (30) 1:1 with GF; lead-input form (24) matched except new lead owner (added).
- **1:1 form validation** (header/footer/popup + guide): libphonenumber phone validation with visible inline errors, radio/company/message required matching GF, GF server-side rejections relayed under the exact field, no silent drops. Replaced the brief "Not provided" fallback approach. New dep: libphonenumber-js (lockfile regenerated npm@10). *(live)*
- **Root-caused broken lead forwarding:** WP-side GF changes (see Team changes) made GF silently reject submissions while visitors saw success.
- **Salary tool section:** background image only, no color fill (reverted the phone beige treatment). *(live)*
- **Mobile step timelines:** node dot per step on the connector line (HIW, service pages, salary tool). *(live)*

### 2026-07-13 (day) — marketing feedback batch
- **PILLAR CONTENT RESCUE:** WP source pages deleted → last good extractions committed to `server/data/pillars/*.json`, `fetchPillarBody()` falls back to them. This was the "no content on iPhone" bug (WebKit reproduced via Playwright).
- New vectorized **favicon** (SVG + ICO + apple-touch).
- **Service hero lists** ("All in one invoice:" / benefit-led labels for EOR Migration + IT Equipment) on all 10 services.
- Phones (≤767px) skip scroll fade-ins; tablets/desktop keep them.
- Stacked timelines: one continuous connector + single end arrow, text padded clear.
- Salary tool mobile buttons full-width aligned; blog/news mobile hero image matches card width with ToC gap; HR glossary card full width on mobile; contact popup close-button overlap fixed; more air between logo carousel and salary arch at 1536px; pillar/cluster + blog/news ToC centered at form/card width on tablet.
- All deployed and verified live.

### 2026-07-12 → 13 — content batch
- Real WP FAQs for all 10 service pages (scraped before WP cleanup; no em dashes).
- Form heroes stay side-by-side until 850px then stack centered.
- Case-study stacked layout: image/content equal widths.
- Dynamic form CTAs per marketing md (per-service headings, "Speak to our team" buttons, generic "Ready to build your South African team?").
- Service footer forms match hero form headings.
- Problem 2 cluster ("What is an Employer of Record?") added from WP + on pillar page.
- New IT-support card image; about-page cards use learn covers; guides archive uses blog cover pool; white guide-download form card.
- Real guide-page content + FAQs written from the actual PDF; salary tool FAQs; case-study archive excerpt fallbacks.

### Earlier (context)
- Full site build (home, services ×10, case studies, blog/news/glossary/pillars/tools/guides/about/contact), GSAP parallax sections, salary calculator port, Lenis smooth scroll, laptop-height compression tiers, security headers + rate limiting, prewarm cache, sitemap/SEO/robots, honeypot anti-bot (`xf_2`), DO deploy pipeline stabilized (npm10 lockfile, no engines.npm, no sharp), form pipeline verified into GF/Zapier/Close, deterministic blog cover randomization, em-dash sweep, favicon iterations, loader, mobile timelines, marketing viewport fits at 1280×587 / 1536×~700.
