# Matthew Roxas — Operating System

> Status: Active  
> Owner: Matthew Roxas  
> Applies to: `mroxas04/personal-website` and the services represented by it  
> Review cadence: Weekly for priorities; quarterly for positioning and offers

## 1. Purpose

This business helps people and organizations think clearly about artificial intelligence and turn useful opportunities into practical systems. The work joins three lenses:

- **Technical:** what the technology can actually do.
- **Operational:** how people, processes, data, and decisions must fit together.
- **Human:** what the system changes for the people who use or live with it.

The guiding principle is:

> Build systems that support judgment without quietly replacing the person whose judgment matters.

## 2. Current business model

### Primary audience

- Individuals thinking seriously about AI in their work, organization, or life.
- Teams with a concrete AI opportunity but an unclear implementation path.
- Readers and collaborators interested in systems, AI, embodied cognition, and philosophy of technology.

### Current offers

| Offer | Purpose | Format | Price model | Primary outcome |
| --- | --- | --- | --- | --- |
| Talk Through an AI Question | Explore a problem, workflow, idea, or concern | 45-minute conversation | Free | Clearer framing and next step |
| Implementation Roadmap Deep Dive | Turn an organizational AI opportunity into a practical roadmap | 30-minute working session | Current public price in `content/site.ts` | Prioritized implementation direction |
| Writing and public resources | Develop and share ideas about AI, systems, and human judgment | Papers, articles, and blog notes | Free | Trust, learning, and qualified conversations |
| Optional support | Let someone support useful conversations and independent work | Financial support, referral, or feedback | Pay what fits | Sustainability and evidence of value |

Prices, durations, booking URLs, and public contact channels are configured in `content/site.ts`. That file is the source of truth for what the website currently promises.

## 3. Near-term operating priorities

Maintain no more than three active priorities at a time.

1. **Learn from conversations.** Identify recurring AI questions, operational constraints, and valuable outcomes.
2. **Make the paid offer repeatable.** Define a consistent intake, session structure, and roadmap deliverable for the Implementation Roadmap Deep Dive.
3. **Publish evidence.** Turn recurring insights into writing, case examples, and consented testimonials without exposing private information.

Record concrete work as GitHub Issues. This section should describe outcomes, not duplicate the task list.

## 4. Customer and conversation lifecycle

### Stage 1 — Discover

A visitor arrives through search, social media, a referral, a tagged campaign, or direct navigation. Public pages and writing should help the visitor understand Matthew's perspective before asking them to act.

### Stage 2 — Engage

A visitor may:

- book a conversation through Calendly;
- call or text the published business number;
- submit the contact form;
- read or share published work; or
- book the paid Implementation Roadmap Deep Dive.

UTM values must use stable campaign labels and must never contain names, email addresses, or other personal information.

### Stage 3 — Triage

New contact requests enter the private dashboard with status `new`. Matthew reviews each request and assigns one of the canonical statuses defined in `app/contact-request-status.ts`:

- `new`
- `contacted`
- `follow_up`
- `closed`
- `ignore`

The dashboard is a lightweight conversation inbox. It is not the authoritative system for accounting, contracts, or sensitive customer records.

### Stage 4 — Deliver

Before a scheduled conversation:

- review the visitor's submitted context;
- identify the decision or tension behind the stated question;
- prepare only what will materially improve the conversation.

During the conversation:

- clarify the desired outcome and current constraints;
- separate technical possibility from operational readiness;
- identify human judgment that should remain explicit;
- finish with a practical next step.

For a paid roadmap session, capture a concise deliverable covering:

- opportunity and desired outcome;
- users and decision owners;
- current workflow and data inputs;
- risks, dependencies, and unresolved questions;
- smallest useful pilot; and
- success criteria and next decision.

### Stage 5 — Follow up and learn

- Move the request to `follow_up`, `closed`, or `ignore` as appropriate.
- Invite private feedback after a meaningful interaction.
- Treat testimonial permission as separate, explicit consent.
- Publish no quote automatically; review every approved excerpt before use.
- Capture reusable, anonymized learning in an issue, playbook, or draft article.

## 5. Weekly operating review

Run this review once each week. Keep it brief enough to sustain.

### Inbox

- Review all `new` and `follow_up` requests.
- Confirm every promised follow-up has an owner and date.
- Close or ignore requests that no longer require attention.

### Pipeline

- Count new qualified conversations.
- Review booking sources and first-touch attribution.
- Note which questions, audiences, and referrals are recurring.
- Decide whether any recurring free conversation should become a resource or clearer offer.

### Delivery quality

- Review feedback, referral intent, and follow-up permission.
- Identify one thing to keep, one thing to improve, and one open question.
- Review testimonial permissions separately from private feedback.

### Publishing

- Advance one writing item or public proof point.
- Verify that any named person, organization, payment identifier, image, or quotation has explicit publication approval.
- Update `content/writing.ts` only when status or canonical URLs change.

### Product and reliability

- Review open GitHub Issues and pull requests.
- Review failed validation runs and production incidents.
- Select the next three active priorities; move everything else out of active work.

## 6. Core metrics

Track a small set consistently before adding more.

| Area | Metric | Why it matters |
| --- | --- | --- |
| Attention | Qualified visits by source | Shows where relevant people discover the work |
| Engagement | Contact or booking conversion rate | Tests whether the site creates useful next steps |
| Responsiveness | Median time to first response | Protects trust and follow-through |
| Delivery | Conversations and paid sessions completed | Measures actual service activity |
| Value | Positive feedback and referral intent | Provides early evidence of usefulness |
| Commercial | Paid-session revenue and optional support, tracked separately | Distinguishes service revenue from voluntary support |
| Learning | Repeated questions converted into reusable assets | Measures compounding insight |
| Reliability | Successful production releases and unresolved incidents | Protects the operating surface |

Do not combine private qualitative impact scores with payment amounts in public claims or rankings.

## 7. Source-of-truth map

| Information | Source of truth |
| --- | --- |
| Public positioning, offers, booking links, contact channels, and approved media | `content/site.ts` and public page code |
| Writing inventory and publication status | `content/writing.ts` |
| Contact requests and their workflow status | D1-backed private dashboard |
| Support ledger and testimonial review | D1-backed private dashboard |
| Product and operational work | GitHub Issues and pull requests |
| Application code and database schema | This repository |
| Production project binding | `.openai/hosting.json` |
| Runtime configuration and secrets | Sites environment settings |
| Analytics detail | Configured analytics provider |
| Scheduling and paid booking records | Calendly |
| Payment and accounting records | Private accounting system or payment-provider records |

Never use a public repository file, GitHub Issue, pull request, commit message, test fixture, screenshot, or task description as storage for secrets or private customer data.

## 8. GitHub workflow

### Branch roles

- `dev`: integration and review branch.
- `main`: production release-candidate branch.

If actual branch protections differ, update this document to match them.

### Change flow

1. Create or link a GitHub Issue describing the desired outcome and acceptance criteria.
2. Make the smallest coherent change on a dedicated branch.
3. Open a pull request into `dev` for review and validation.
4. Run lint, tests relevant to the change, and a production build.
5. Promote reviewed changes to `main`.
6. Confirm the exact `main` commit passed the `Validate site` workflow.
7. Deploy that exact commit through the Sites release process.
8. Verify the affected public route and any critical form or webhook behavior.

### Definition of done

A change is done when:

- acceptance criteria are met;
- relevant tests pass;
- lint and build pass;
- privacy, accessibility, and mobile behavior have been considered;
- documentation and configuration references are current;
- the production deployment is verified when release was in scope; and
- the related Issue or pull request records the outcome.

## 9. Security and privacy rules

- Never commit authentication tokens, private phone destinations, environment values, customer exports, or payment-account credentials.
- Keep `DASHBOARD_OWNER_EMAIL`, Twilio secrets, and other protected values in Sites runtime settings.
- Keep the owner dashboard server-authorized; `noindex` is defense in depth, not access control.
- Validate Twilio webhook signatures against the exact configured public URL.
- Do not log inbound SMS content or introduce call recording without a separately reviewed business and consent decision.
- Preserve explicit consent boundaries for private feedback, anonymous quotations, and named quotations.
- Collect only the information needed to complete the stated workflow.
- If sensitive data appears in Git history, treat it as exposed: rotate the credential first, then remediate repository history if appropriate.

## 10. Publishing and brand rules

- Preserve the site's three-lens positioning: technical, operational, and philosophical.
- Prefer concrete examples and real constraints over generic AI claims.
- Distinguish clearly between exploratory conversation, coaching, and business consulting.
- Do not promise outcomes that the current service cannot consistently deliver.
- Use descriptive alternative text for media.
- Obtain renewed authorization before publishing or replacing personal identifiers.
- Keep `llms.txt`, structured data, page metadata, and canonical URLs aligned with public content.

## 11. Decision log

Record decisions that change positioning, pricing, audience, data handling, delivery, or production architecture.

| Date | Decision | Reason | Owner | Revisit when |
| --- | --- | --- | --- | --- |
| YYYY-MM-DD | Example: standardize the roadmap deliverable | Make paid sessions consistent and easier to improve | Matthew | After five completed sessions |

## 12. Next operating-system improvements

The following playbooks establish the initial repeatable process:

- `docs/playbooks/lead-response.md`
- `docs/playbooks/ai-question-conversation.md`
- `docs/playbooks/implementation-roadmap.md`
- `docs/playbooks/publishing.md`
- `docs/playbooks/incident-response.md`

Add more process only after a repeated need is visible. The operating system should stay lighter than the work it supports.

Structured Issue templates and the pull-request checklist live in `.github/`.

The next likely addition is:

- A private accounting source of truth for revenue, expenses, and tax records

## 13. Quarterly review questions

- Which audience received the most value?
- Which questions appeared repeatedly?
- Which offer created a concrete outcome people would seek again?
- What work should be standardized, automated, delegated, or stopped?
- What claims now have evidence behind them?
- Which data are being collected without a clear operational need?
- Does the website still represent the business Matthew is actually building?
