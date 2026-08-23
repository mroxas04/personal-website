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
- The primary content routes are `/work`, `/about`, `/elsewhere`, `/contact`, `/support`, `/feedback`, `/writing`, and the Paper, Article, and Blog sub-pages under `/writing/*`. Preserve the Writing dropdown and real-page navigation architecture.
- Internal navigation intentionally uses normal `<a>` elements because the current Vinext beta’s `next/link` client interceptor breaks ordinary clicks. Do not reintroduce `next/link` without verifying normal left-click navigation in the deployed runtime.
- Store user-selected media in `public/media/` and reference it through a named `MEDIA.*` slot. The deployed site currently uses a GitHub-backed jsDelivr media base URL; preserve that indirection unless Sites gains reliable binary-source support or media moves to a dedicated first-party CDN/object store.
- Title-page placeholders use `MEDIA.workHero`, `MEDIA.aboutHero`, `MEDIA.elsewhereHero`, `MEDIA.writingHero`, `MEDIA.papersHero`, `MEDIA.articlesHero`, and `MEDIA.blogHero`. Keep placeholders visibly labeled until Matthew supplies media, and never emit a placeholder as a real image in structured data.

## Data and privacy

- Contact requests contain personal information. Do not log, seed, publish, or expose request contents outside the private dashboard.
- The portfolio is public and Sign in with ChatGPT is optional. Preserve dispatch-owned SIWC routes and the generated-style helpers in `app/chatgpt-auth.ts`.
- `/dashboard` must call `requireChatGPTUser()` and pass the server-only `DASHBOARD_OWNER_EMAIL` allowlist before any D1 read. Dashboard APIs must call `getChatGPTUser()` and pass the same owner check before reads or mutations. Fail closed when the owner setting is absent.
- Request workflow statuses are defined centrally in `app/contact-request-status.ts`. Search and status mutations belong behind the protected dashboard API; repeat-contact history is keyed by normalized email and must remain owner-only.
- Preserve first-touch UTM, query-free referrer, landing-page, and optional self-reported discovery attribution. Do not place personal information in UTM values.
- Feedback and support records contain personal, financial, and testimonial-permission data. Keep all raw responses, amounts, notes, rankings, and identities owner-only; never auto-publish a testimonial or leaderboard entry.
- Testimonial consent is per submission and must remain one of private, anonymous, or named. A dashboard approval status is an internal review step, not a substitute for the submitter’s permission.
- Public payment details belong only in `SUPPORT_PAYMENT` in `content/site.ts`. Use a Venmo business profile or verified business-ready destination, never a personal handle by default; do not expose a Zelle phone number or private email. Payments are optional support for services, not charitable donations.
- SIWC exposes a site-scoped user ID, email, and optional full name. Never imply that it exposes ChatGPT files, memories, chats, or interests.
- `robots` directives are discovery preferences, not authentication.
- Keep one SQL statement per D1 `prepare()` call. Update `db/schema.ts`, generate a Drizzle migration, inspect it, and verify runtime initialization for schema changes.

## SEO, accessibility, and performance

- Structured data must describe visible, truthful content. Do not mark forthcoming work as published.
- Keep `/dashboard` out of the sitemap and marked `noindex`.
- Use semantic headings, descriptive link text, useful alt text, captions for video where available, and keyboard-visible focus states.
- Maintain `/llms.txt` as an accurate, privacy-safe summary, while treating crawlable original prose, internal links, accurate metadata, structured data, and the sitemap as the primary discovery surfaces.
- Compress large media; avoid autoplay video and layout-shifting embeds.

## Hosting

- Intended Sites slug: `portfolio`.
- Intended fallback URL: `https://portfolio.mroxas.chatgpt.site`.
- Custom-domain changes require confirmed domain/DNS details from Matthew.
