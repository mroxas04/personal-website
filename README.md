# Matthew Roxas — Personal Website

An editorial portfolio about systems, AI, philosophy, and the work between them. The site includes a categorized writing archive, selected projects, replaceable personal media, a D1-backed contact form, and a private contact-request dashboard.

## Stack

- Next.js 16 / React 19 through Vinext
- OpenAI Sites hosting
- Cloudflare D1 (SQLite-compatible) for contact requests
- Drizzle for schema and migrations
- Plain CSS design system in `app/globals.css`

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
npm run db:generate
```

## Editing the site

### Photos and video

Put media in `public/media/`, then replace `src: null` in `content/site.ts` with a public path such as `/media/hero-portrait.jpg`.

Named slots currently include:

- `MEDIA.heroPortrait`
- `MEDIA.studioMoment`
- `MEDIA.livedMoment`
- `MEDIA.fieldNote`
- `MEDIA.motionStudy` (video; accepts an optional poster)

Until a source is set, the site shows a labeled layout placeholder. Use descriptive `alt` text and compressed WebP/AVIF images where practical; keep video short and provide a poster image.

### Writing

Edit `WRITING` in `content/writing.ts`. Items are grouped on `/writing` as Publication, Article, Essay, or Note. Set `href` to the canonical public URL when a piece is published; leave it `null` while it is forthcoming or in progress.

### Analytics

Set `ANALYTICS_DASHBOARD_URL` in `content/site.ts` after GA4, Plausible, or another provider is configured. The private `/dashboard` page will then expose a direct link.

## Contact requests and dashboard

`POST /api/contact` validates and stores requests in the D1 `contact_requests` table. `/dashboard` reads the latest 100 requests and basic totals.

The dashboard currently relies on the entire Sites deployment being owner-only. **Before the portfolio is made public, add server-side, route-level authorization to `/dashboard`; `robots: noindex` is not access control.**

The D1 binding is declared as `DB` in `.openai/hosting.json`. Schema changes belong in `db/schema.ts`; generate and inspect a migration before deployment.

## SEO and AI discovery

The site provides:

- canonical metadata, Open Graph, and social preview data
- `WebSite`, `ProfilePage`, `Person`, `CollectionPage`, and `ItemList` structured data
- `/robots.txt` and `/sitemap.xml`
- unique writing-page metadata and semantic headings
- a noindex dashboard excluded from the sitemap

Search crawlers cannot index an owner-only deployment. These controls become effective once the public portfolio or a custom domain is intentionally opened.

## Deployment

The site is managed by OpenAI Sites through `.openai/hosting.json`. Preserve that file and use the Sites build/deploy workflow. The current intended Sites URL is `https://portfolio.mroxas.chatgpt.site`.

`origin` is the GitHub source repository; `sites` is the Sites source remote.
