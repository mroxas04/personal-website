# Matthew Roxas — Personal Website

An editorial portfolio about systems, AI, philosophy, and the work between them. The site includes optional Sign in with ChatGPT, a personalized welcome, separate Work, About, Elsewhere, Contact, Support, Feedback, and Writing pages, replaceable personal media, D1-backed forms, and an owner-only operating dashboard.

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
cp .env.example .env.local
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

Put media in `public/media/`, commit it to GitHub `main`, then update the named slot in `content/site.ts`. The deployed portfolio currently reads media through jsDelivr’s GitHub-backed CDN because the Sites source repository does not accept these binary assets reliably.

Named slots currently include:

- `MEDIA.workHero`
- `MEDIA.aboutHero`
- `MEDIA.elsewhereHero`
- `MEDIA.writingHero`
- `MEDIA.papersHero`
- `MEDIA.articlesHero`
- `MEDIA.blogHero`
- `MEDIA.heroPortrait`
- `MEDIA.studioMoment`
- `MEDIA.livedMoment`
- `MEDIA.fieldNote`
- `MEDIA.motionStudy` (video; accepts an optional poster)

Until a source is set, the site shows a labeled layout placeholder. Use descriptive `alt` text and compressed WebP/AVIF images where practical; keep video short, browser-compatible, and provide a poster image. Replacing a file at an existing GitHub path can update after CDN caches expire; changing a filename or slot still requires a Sites deployment.

### Writing

Edit `WRITING` in `content/writing.ts`. Items are grouped as Paper, Article, or Blog and appear on `/writing` plus `/writing/papers`, `/writing/articles`, or `/writing/blog`. The site header exposes those category pages through the Writing dropdown. Set `href` to the canonical public URL when a piece is published; leave it `null` while it is forthcoming or in progress.

### Analytics

Set `ANALYTICS_DASHBOARD_URL` in `content/site.ts` after GA4, Plausible, or another provider is configured. The private `/dashboard` page will then expose a direct link.

## Contact requests and dashboard

`POST /api/contact` validates and stores requests in the D1 `contact_requests` table. `/dashboard` reads up to 100 matching requests and basic totals. The owner can search names, emails, organizations, messages, and reasons; filter by status; and mark requests as New, Contacted, Follow up, Closed, or Ignore. Repeat-email flags link to a history view containing that address’s previous requests.

The site also captures first-touch attribution for the current browser session. Tagged links may use `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`; the contact form sends those values, the original landing path, and a query-free referrer to the private dashboard. Use fixed campaign labels rather than names, email addresses, or other personal information in UTM values.

Example tagged URL:

```text
https://portfolio.mroxas.chatgpt.site/?utm_source=linkedin&utm_medium=social&utm_campaign=profile
```

The portfolio is public and Sign in with ChatGPT is optional. The hosting dispatcher owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, and `/callback`; do not create application routes for them. Signed-in identity is read on the server through `app/chatgpt-auth.ts`.

`/dashboard` and its search/status API require ChatGPT sign-in and compare the authenticated email against the server-only `DASHBOARD_OWNER_EMAIL` allowlist before reading or changing D1. Keep that environment value configured in Sites. `robots: noindex` remains defense-in-depth, not access control. The canonical workflow statuses live in `app/contact-request-status.ts`.

The D1 binding is declared as `DB` in `.openai/hosting.json`. Schema changes belong in `db/schema.ts`; generate and inspect a migration before deployment.

## Support, feedback, and testimonials

`/support` presents a pay-what-you-can model without treating payment as required or charitable. Public Venmo and Zelle details are configured through `SUPPORT_PAYMENT` in `content/site.ts`. The current personal identifiers were published at Matthew’s explicit request; do not add, replace, or expose any other personal payment identifier without renewed authorization. Personal-profile Venmo payments connected to a session or service must retain the purchase-option guidance shown on the page.

`/feedback` collects private post-conversation feedback, rating, referral intent, follow-up permission, and an optional testimonial. Testimonial permission is explicit and separate: private only, anonymous quotation, or named quotation. Nothing is published automatically, and `/feedback` remains `noindex` and outside the sitemap.

The owner-only dashboard contains a manual support ledger, an internal leaderboard, and testimonial review statuses. Monetary support is stored in cents; non-monetary support uses a private 1–5 impact judgment. Do not present those points as an objective public ranking or combine them with payment amounts in public-facing claims.

## SEO and AI discovery

The site provides:

- canonical metadata, Open Graph, and social preview data
- `WebSite`, `ProfilePage`, `Person`, `CollectionPage`, and `ItemList` structured data
- `/robots.txt` and `/sitemap.xml`
- `/llms.txt`, an optional plain-text summary for assistants and curious humans
- unique writing-page metadata and semantic headings
- a noindex dashboard excluded from the sitemap

`llms.txt` is maintained as a clear summary, not as a replacement for crawlable content or structured data.

## Deployment

The site is managed by OpenAI Sites through `.openai/hosting.json`. Preserve that file and use the Sites build/deploy workflow. The current intended Sites URL is `https://portfolio.mroxas.chatgpt.site`.

`origin` is the GitHub source repository; `sites` is the Sites source remote.
