# Repository guidance for coding agents

## Product intent

This is Matthew Roxas’s personal editorial portfolio. Preserve its visual language: warm paper, black editorial rules, blue signal color, acid accents, serif display type, and compact monospace metadata. Favor clear, human prose over generic portfolio language.

## Required workflow

- This repository contains `.openai/hosting.json`; use the Sites building and hosting skills for site and deployment work.
- Keep the working experience coherent before publishing and run `npm run lint` plus `npm run build` after relevant changes.
- Preserve unrelated user changes and never replace the Sites project ID or D1 binding casually.
- Use `apply_patch` for hand-authored edits.

## Content architecture

- Reusable site/media/social settings live in `content/site.ts`.
- All writing entries live in `content/writing.ts`; do not duplicate page-local writing data.
- Store user-selected media in `public/media/` and reference it through a named `MEDIA.*` slot.
- Placeholder media must remain visibly labeled in private previews and must not be emitted as a real image in structured data.

## Data and privacy

- Contact requests contain personal information. Do not log, seed, publish, or expose request contents outside the private dashboard.
- `/dashboard` currently depends on the whole Sites deployment being owner-only. Do not make the site public until server-side route authorization is implemented and verified.
- `robots` directives are discovery preferences, not authentication.
- Keep one SQL statement per D1 `prepare()` call. Update `db/schema.ts`, generate a Drizzle migration, inspect it, and verify runtime initialization for schema changes.

## SEO, accessibility, and performance

- Structured data must describe visible, truthful content. Do not mark forthcoming work as published.
- Keep `/dashboard` out of the sitemap and marked `noindex`.
- Use semantic headings, descriptive link text, useful alt text, captions for video where available, and keyboard-visible focus states.
- Do not add speculative “AI SEO” files or hidden text. Prefer crawlable original prose, internal links, accurate metadata, structured data, and a sitemap.
- Compress large media; avoid autoplay video and layout-shifting embeds.

## Hosting

- Intended Sites slug: `portfolio`.
- Intended fallback URL: `https://portfolio.mroxas.chatgpt.site`.
- Custom-domain changes require confirmed domain/DNS details from Matthew.
