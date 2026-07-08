# Legends EOR Website

Custom rebuild of [legendseor.com](https://legendseor.com/2026-home/) — Nuxt 3 (Vue) with a built-in CMS backed by Supabase. Replaces the WordPress front end; tuned for the 1280×587 effective viewport (14" laptop at 150% Windows display scaling).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

The homepage and salary calculator work with no configuration.

## Connect Supabase (enables the CMS + lead storage)

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env`, fill in `SUPABASE_URL`, `SUPABASE_KEY` (anon) and `SUPABASE_SERVICE_KEY` (service role) from **Project Settings → API**.
3. In the Supabase **SQL Editor**, run the whole of `supabase/schema.sql`.
4. Under **Authentication → Users**, add your admin user (email + password).
5. Restart the dev server and sign in at `/admin`.

The CMS at `/admin` manages blogs, news articles, case studies, services, HR glossary, problem pillars/clusters, guides and tools — each with draft/publish, featured image uploads, and an SEO panel (meta title, meta description, URL slug, noindex toggle). Leads from the site forms appear under `/admin/leads`.

## Gravity Forms forwarding (optional)

To keep leads flowing into the existing WordPress Gravity Forms as well, fill in the `GF_*` variables in `.env` (WP admin → Forms → Settings → REST API). Submissions then land in both Supabase and Gravity Forms.

## Salary calculator data

`public/data/salary-data.json` is generated from the WordPress plugin's SQL
(`../salary-benchmarking-tool/sql/`). Currency conversion uses the free
frankfurter.dev FX API at runtime.

## Structure

- `app/pages/index.vue` — homepage (all sections under `app/components/home/`)
- `app/pages/admin/**` — the CMS
- `app/pages/**` — placeholder views for About, Contact, Services, Case Studies, News, HR Glossary, Staffing Insights, Tools, Learn, Guides (to be built next)
- `supabase/schema.sql` — full database schema incl. RLS policies and storage bucket

## Build

```bash
npm run build
node .output/server/index.mjs
```
