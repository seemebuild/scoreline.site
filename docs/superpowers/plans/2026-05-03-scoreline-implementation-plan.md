# Scoreline Implementation Plan

Date: 2026-05-03
Source spec: `docs/superpowers/specs/2026-05-03-scoreline-design.md`
Target launch: before 2026-06-11
Last updated: 2026-05-03

## Current Status

- Milestone 0 is complete and merged in PR #1: `feat: add Scoreline app baseline`.
- Milestone 1 is complete and merged:
  - Prisma now includes the first normalized sports and operations schema.
  - Sports route helpers cover canonical slugs, sport paths, competition paths, and event paths.
  - Event lifecycle helpers cover internal statuses, public status groups, and API-Football status mapping.
  - Launch seed catalog now covers target sports and must-have soccer competitions.
  - Initial Prisma migration SQL is generated.
  - Neon migration, seed, and constraint verification now pass via `pnpm db:verify`.
- Milestone 2 is complete and merged:
  - Job queue claiming, retries, typed handlers, execution logs, and admin log inspection are in place.
  - Protected tick endpoint and Cloudflare Worker Cron caller are wired up.
- Milestone 3 is complete and merged:
  - Provider contract types and registry are in place.
  - API-Football soccer client helpers cover leagues, fixtures, standings, and results.
  - Soccer sync now persists competitions, fixtures, standings, results, and provider snapshots to Neon.
  - Capability-aware job planning is available for launch sports.
- Latest verified gates:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:e2e`
  - `pnpm exec prisma validate`
- Local note: Playwright needs localhost binding permission in the Codex sandbox, but the e2e smoke test passes when allowed.

## Immediate Next Slice

Start Milestone 4 in a small PR:

- Build the public sports navigation and the first crawlable sports surface.
- Keep the public score surfaces backed by the normalized provider data model.
- Use the provider capability matrix to avoid surfacing empty sport features.

## Planning Principles

- Build vertical slices that become usable quickly.
- Keep editorial and scores as equal first-class systems, with CMS-first SEO priority.
- Treat automated tests as a blocking requirement, not cleanup work.
- Put provider access behind adapters and normalized models from the start.
- Cache aggressively so public traffic does not directly multiply provider API cost.
- Keep launch infrastructure lean: Vercel app, Postgres, Sanity, Algolia, Cloudflare Worker Cron.
- Make paid provider upgrades possible without changing public routes.

## Milestone 0: Repository And Engineering Baseline

Status: Complete. Merged in PR #1.

Goal: create a reliable Next.js foundation before product work begins.

### Scope

- [x] Scaffold Next.js App Router app with TypeScript.
- [x] Add linting, formatting, and strict TypeScript config.
- [x] Add Tailwind or the chosen styling stack.
- [x] Add Vitest for unit/integration tests.
- [x] Add Playwright for browser smoke tests.
- [x] Add Prisma with initial Postgres configuration.
- [x] Add environment variable validation.
- [x] Add CI workflow for lint, typecheck, unit tests, and Playwright smoke tests.
- [x] Add basic app shell with light/dark theme tokens.
- [x] Add README with local setup, required services, and command reference.

### Test Gate

- [x] `lint` passes.
- [x] `typecheck` passes.
- [x] Unit test runner passes with at least one baseline test.
- [x] Playwright opens the homepage and verifies non-empty render.
- [x] CI runs the same checks.

### Suggested Commits

- Completed as `feat: add Scoreline app baseline`.

## Milestone 1: Domain Model And Database Foundation

Status: Complete. Neon migration, seed, and database verification now pass.

Goal: establish the normalized sports and operations data model.

### Scope

- [x] Create Prisma schema for:
  - [x] sports
  - [x] competitions
  - [x] seasons
  - [x] teams
  - [x] athletes
  - [x] venues
  - [x] events/fixtures
  - [x] scores/statuses
  - [x] standings
  - [x] provider mappings
  - [x] provider snapshots
  - [x] jobs
  - [x] anonymous events
  - [x] trend scores
  - [x] feedback submissions
- [x] Add seed data for target sports and must-have soccer competitions.
- [x] Add internal enum/status model for event lifecycle.
- [x] Add canonical slug and URL helper functions.
- [x] Add database indexes for route lookups, provider mappings, event status, kickoff time, and trending.
- [x] Add migration workflow documentation.

### Test Gate

- [x] Prisma migration applies cleanly against Neon.
- [x] Seed script creates required sports and soccer competitions.
- [x] Unit tests cover URL builders, slug generation, event statuses, and enum mappings.
- [x] Database constraints prevent duplicate provider mappings where expected.

### Suggested Commits

- Completed in PR #1:
  - `feat: add Scoreline app baseline`
  - `test: verify Prisma migration against Neon`
  - `test: add database-backed provider constraint coverage`

## Milestone 2: Job Queue And Scheduler Foundation

Goal: make background work reliable before provider syncs depend on it.

### Scope

- Implement Postgres-backed job queue.
- Support pending, running, completed, failed, and retry states.
- Add row-level job claiming.
- Add idempotency keys.
- Add max attempts and exponential backoff.
- Add job history/error fields.
- Add protected `/api/jobs/tick` endpoint.
- Add job type registry and typed payloads.
- Add minimal Cloudflare Worker Cron project/config to call the tick endpoint.
- Add admin-safe job execution logs.

### Test Gate

- Unit tests cover retry timing and idempotency keys.
- Integration tests prove concurrent workers do not claim the same job.
- Failed jobs retry until max attempts, then stop.
- Protected tick endpoint rejects missing/invalid secret.
- Cloudflare Worker handler test signs/calls the expected endpoint.

### Suggested Commits

- `feat: add Postgres job queue`
- `feat: add protected job runner endpoint`
- `feat: add Cloudflare cron worker`
- `test: cover job locking and retries`

## Milestone 3: Sports Provider Adapter Layer

Goal: integrate API-SPORTS/API-Football behind stable internal interfaces.

### Scope

- [x] Define provider adapter contracts.
- [x] Implement HTTP client with retries, timeout, logging, and rate-limit awareness.
- [x] Store raw provider snapshots.
- [x] Implement API-Football soccer adapter for competitions, teams, fixtures, live scores, results, and standings.
- [x] Implement adapters or adapter shells for NBA, American football, baseball, MMA, tennis, and golf using API-SPORTS endpoints where available.
- [x] Normalize provider responses into internal models.
- [x] Add provider fixture files for tests.
- [x] Add provider sync jobs:
  - [x] fixture sync
  - [x] live score sync
  - [x] result finalization
  - [x] standings sync
- [x] Add provider capability matrix and capability-aware job planning.

### Test Gate

- [x] Adapter unit tests map recorded provider payloads into normalized models.
- [x] Integration tests run sync jobs against mocked provider responses.
- [x] Sync jobs are idempotent.
- [x] Provider snapshots are stored with enough metadata for debugging.
- [x] Missing provider fields degrade gracefully instead of crashing public pages.
- [x] Capability-aware job planning filters unsupported work by sport.

### Suggested Commits

- Completed in sequential PRs:
  - `feat: add sports provider adapter contracts`
  - `feat: add api-football client and sync stub`
  - `feat: persist provider snapshots`
  - `feat: persist soccer sync data`
  - `feat: add provider shells for launch sports`
  - `feat: add provider registry dispatcher`
  - `feat: add named soccer provider helpers`
  - `feat: add soccer standings sync`
  - `feat: add soccer results sync`
  - `feat: add provider capability matrix`
  - `feat: add soccer sync job plan`

## Milestone 4: Public Score And Sports Pages

Status: complete.

Goal: ship crawlable score surfaces backed by normalized data.

### Scope

- Global app layout, navigation, and footer are in place.
- Homepage skeleton renders the launch sports and featured competition modules.
- Sport landing pages are in place.
- Live scores page is in place.
- Fixtures/results pages are in place.
- Competition pages are in place.
- Event detail pages are deferred to a later slice.
- Standings pages exist where data exists.
- Team pages for major teams are in place.
- `.ics` calendar export is deferred to a later slice.
- Empty/loading/error states are partially in place and can be expanded later.
- Local favorites for sports, teams, and competitions are deferred to a later slice.

### Test Gate

- Playwright covers homepage and the public sports shell routes.
- Unit tests cover public sports data helpers.
- Pages render useful fallback content when data is missing.
- Core pages include canonical URLs and basic metadata.

### Suggested Commits

- `feat: add public sports navigation`
- `feat: add live scores, fixtures, and results pages`
- `feat: add event and competition pages`
- `feat: add local favorites and timezone preferences`
- `test: add public sports smoke tests`

## Milestone 5: Sanity Editorial System

Status: in progress.

Goal: make editorial publishing the primary SEO workflow.

### Scope

- Configure Sanity project/schema.
- Add schemas for:
  - articles
  - authors
  - categories
  - source references
  - editorial policy pages
  - AI draft state
  - homepage pins
  - manual trend boosts
  - image metadata
- Add Sanity client and typed content queries.
- First slice: public trust pages and editorial shell routes that Sanity will later feed.
- Build article index/listing pages.
- Build article detail pages.
- Build author pages.
- Build trust/policy page rendering.
- Add Sanity publish webhook for revalidation.
- Add editorial seed content drafts for required policy pages.

### Test Gate

- Schema validation tests cover required article fields.
- Article page Playwright test renders title, author, date, body, and source links when present.
- Sanity webhook route verifies secret and triggers targeted revalidation.
- Policy pages are routable and crawlable.

### Suggested Commits

- `feat: add Sanity editorial schemas`
- `feat: render articles and authors`
- `feat: add Sanity revalidation webhook`
- `test: cover editorial rendering`

## Milestone 4: Public Score And Sports Pages

Goal: ship crawlable score surfaces backed by normalized data.

### Scope

- Build global app layout, navigation, footer, theme toggle, and timezone preference.
- Build homepage skeleton with top stories, top live events, and trending modules.
- Build sport landing pages.
- Build live scores page.
- Build fixtures/results pages.
- Build competition pages.
- Build event detail pages.
- Build standings pages where data exists.
- Build team pages for major teams.
- Add `.ics` calendar export for fixtures.
- Add empty/loading/error states.
- Add local favorites for sports, teams, and competitions.

### Test Gate

- Playwright covers homepage, sport page, live scores, fixture detail, competition page, and team page.
- Unit tests cover timezone formatting and local preference helpers.
- Pages render useful fallback content when data is missing.
- Core pages include canonical URLs and basic metadata.

### Suggested Commits

- `feat: add public sports navigation`
- `feat: add live scores and fixtures pages`
- `feat: add event and competition pages`
- `feat: add local favorites and timezone preferences`
- `test: add public sports smoke tests`

## Milestone 5: Sanity Editorial System

Goal: make editorial publishing the primary SEO workflow.

### Scope

- Configure Sanity project/schema.
- Add schemas for:
  - articles
  - authors
  - categories
  - source references
  - editorial policy pages
  - AI draft state
  - homepage pins
  - manual trend boosts
  - image metadata
- Add Sanity client and typed content queries.
- Build article index/listing pages.
- Build article detail pages.
- Build author pages.
- Build trust/policy page rendering.
- Add Sanity publish webhook for revalidation.
- Add editorial seed content drafts for required policy pages.

### Test Gate

- Schema validation tests cover required article fields.
- Article page Playwright test renders title, author, date, body, and source links when present.
- Sanity webhook route verifies secret and triggers targeted revalidation.
- Policy pages are routable and crawlable.

### Suggested Commits

- `feat: add Sanity editorial schemas`
- `feat: render articles and authors`
- `feat: add Sanity revalidation webhook`
- `test: cover editorial rendering`

## Milestone 6: SEO, Structured Data, And AdSense Readiness

Goal: make public pages search-friendly and policy-ready.

### Scope

- Implement metadata builders for sports, competitions, teams, events, articles, authors, and policy pages.
- Implement canonical URL helpers.
- Implement sitemap indexes by content type and sport.
- Implement robots.txt.
- Add structured data:
  - `Organization`
  - `WebSite`
  - `SearchAction`
  - `BreadcrumbList`
  - `Article`
  - `NewsArticle`
  - `SportsEvent`
  - selected `FAQPage`
- Add noindex rules for thin programmatic pages.
- Add Open Graph image strategy.
- Add required trust pages:
  - About
  - Contact
  - Editorial Policy
  - AI Assistance Policy
  - Privacy Policy
  - Terms of Use
  - Cookie Policy
- Add cookie/consent handling where needed.

### Test Gate

- Unit tests cover metadata builders and canonical URLs.
- Snapshot or schema tests validate JSON-LD shape.
- Sitemap tests verify included/excluded URLs.
- Robots test verifies expected crawler rules.
- Playwright verifies trust pages are accessible.

### Suggested Commits

- `feat: add SEO metadata system`
- `feat: add sitemaps and robots`
- `feat: add structured data`
- `feat: add AdSense trust pages`
- `test: cover SEO outputs`

## Milestone 7: AI Draft Generation Workflow

Goal: generate safe, source-grounded drafts for human approval.

### Scope

- Add AI provider adapter contract.
- Implement Gemini provider adapter.
- Add prompt templates for previews, recaps, explainers, and update summaries.
- Require source URLs or structured source records for every draft.
- Add validation layer for:
  - required sources
  - no unsupported claims
  - required headline/summary/body/category fields
  - no betting language
  - no publisher rewrite mode
- Add scheduled draft candidate jobs.
- Add manual draft trigger endpoint for admin use.
- Create unpublished Sanity drafts only.
- Add conservative daily draft cap: 5-10 drafts/day.

### Test Gate

- Unit tests cover prompt builders and validation.
- Mocked AI responses missing sources are rejected.
- Draft creation job is idempotent.
- Draft caps prevent floods.
- Sanity draft payload includes required review metadata.

### Suggested Commits

- `feat: add AI provider adapter`
- `feat: add source-grounded draft generation`
- `feat: create Sanity drafts from AI output`
- `test: validate AI draft safety rules`

## Milestone 8: Search With Algolia

Goal: make articles and sports entities discoverable.

### Scope

- Configure Algolia client and index naming.
- Define index records for articles, teams, competitions, key fixtures/events, and notable athletes.
- Add indexing jobs.
- Add Sanity publish indexing path.
- Add sports data indexing path.
- Build header autocomplete.
- Build full `/search` page with filters.
- Add click event tracking from search results.

### Test Gate

- Unit tests cover index record builders.
- Indexing jobs are idempotent.
- Search UI works with mocked Algolia responses.
- Playwright covers autocomplete and full search page.
- No unnecessary historical noise is indexed by default.

### Suggested Commits

- `feat: add Algolia indexing`
- `feat: add global autocomplete`
- `feat: add filtered search page`
- `test: cover search indexing and UI`

## Milestone 9: Trending And Internal Analytics

Goal: make the homepage trend-led without paid trend APIs.

### Scope

- Add anonymous internal event capture for:
  - page views
  - score interactions
  - search clicks
  - article clicks
  - favorite actions
- Add privacy-conscious session/event model.
- Add trend scoring function.
- Include signals:
  - internal events
  - live status
  - kickoff proximity
  - competition weight
  - article recency
  - editor pins/boosts
  - free external trend signals where feasible
- Add trend refresh job.
- Add homepage modules that consume trend scores.
- Add GA4 and Search Console setup hooks/config notes.

### Test Gate

- Unit tests cover trend score weighting.
- Event capture endpoint validates and rate-limits input.
- Trend refresh job produces deterministic output from test data.
- Homepage uses fallback ordering when trend data is empty.

### Suggested Commits

- `feat: add internal analytics events`
- `feat: add trend scoring`
- `feat: wire trend-led homepage`
- `test: cover trend ranking`

## Milestone 10: Feedback And Admin Ops

Goal: give the owner operational visibility and a feedback loop.

### Scope

- Build contact/feedback form.
- Store feedback in Postgres.
- Add honeypot, rate limiting, and server validation.
- Add optional email notification when credentials exist.
- Add custom admin auth:
  - one admin secret
  - login route
  - secure HttpOnly session cookie
  - logout
  - rate limiting
- Build ops dashboard:
  - job queue status
  - failed/stale syncs
  - provider error rates
  - live data freshness
  - AI draft generation status
  - Algolia indexing status
  - feedback counts
  - top trending pages/items

### Test Gate

- Feedback form rejects spam/invalid submissions.
- Admin login rejects invalid secrets and sets secure session on success.
- Protected admin routes reject anonymous requests.
- Ops dashboard renders with seeded operational data.
- Playwright covers feedback and admin login.

### Suggested Commits

- `feat: add feedback form`
- `feat: add custom admin auth`
- `feat: add operations dashboard`
- `test: cover feedback and admin flows`

## Milestone 11: Launch Hardening

Goal: prepare for real traffic and AdSense review.

### Scope

- Add production environment checklist.
- Add API budget and cache policy checklist.
- Add provider health monitoring.
- Add error boundaries and user-facing fallback states.
- Add 404 and error pages.
- Add performance pass for Core Web Vitals.
- Add accessibility pass for keyboard navigation, contrast, labels, and focus states.
- Add content QA checklist for AI-assisted articles.
- Add seed/publish minimum viable content set:
  - required trust pages
  - World Cup hub content
  - launch sport landing pages
  - initial previews/explainers
- Add deployment notes for:
  - Vercel
  - Postgres
  - Sanity
  - Algolia
  - Cloudflare Worker Cron
  - API provider keys
  - Gemini key

### Test Gate

- Full CI passes.
- Playwright smoke suite passes against production-like build.
- Lighthouse or equivalent checks do not reveal blocking performance/accessibility issues.
- Sitemap and robots are valid.
- Required trust pages are live.
- Job runner can sync sample data and show status in ops dashboard.
- No public page requires login.

### Suggested Commits

- `fix: harden launch error states`
- `docs: add production launch checklist`
- `test: add production smoke coverage`

## Execution Order

1. Milestone 0: Repository and engineering baseline.
2. Milestone 1: Domain model and database foundation.
3. Milestone 2: Job queue and scheduler foundation.
4. Milestone 3: Provider adapter layer.
5. Milestone 4: Public score and sports pages.
6. Milestone 5: Sanity editorial system.
7. Milestone 6: SEO and AdSense readiness.
8. Milestone 7: AI draft generation workflow.
9. Milestone 8: Algolia search.
10. Milestone 9: Trending and internal analytics.
11. Milestone 10: Feedback and admin ops.
12. Milestone 11: Launch hardening.

Milestones 5 and 6 may overlap after the core app shell exists. Milestones 8, 9, and 10 can also overlap once the data model and page shell are stable.

## Critical Path

The launch-critical path is:

1. App scaffold and CI.
2. Database model.
3. Job queue.
4. Provider sync for at least soccer plus adapter shells for all sports.
5. Public sports pages.
6. Sanity editorial pages.
7. SEO and trust pages.
8. Search.
9. Trending homepage.
10. Launch hardening.

AI drafts and the ops dashboard are important but can be reduced in depth if the World Cup deadline pressures the launch. They should not block basic crawlable pages, trust pages, and score coverage.

## Risk Register

### API coverage gaps

Risk: API-SPORTS may not provide enough quality for one or more sports.

Mitigation: provider adapters, sport-level capability flags, clear empty states, and upgrade paths to Sportmonks or SportsDataIO.

### API budget pressure

Risk: live score polling across all sports may exceed lean budget.

Mitigation: cache policy, priority event tiers, Postgres-normalized reads, and job rate limits.

### Thin programmatic SEO pages

Risk: generated pages without enough unique value could hurt SEO.

Mitigation: page quality thresholds, `noindex` for thin pages, related editorial links, standings context, and useful event metadata.

### AI content quality or policy issues

Risk: AI drafts may hallucinate or resemble rewritten publisher content.

Mitigation: official/structured/licensed sources only, validation tests, source requirements, conservative draft volume, and human approval in Sanity.

### Background job reliability

Risk: custom queue bugs could cause stale scores or duplicate drafts.

Mitigation: job locking tests, idempotency keys, retry tests, ops dashboard, and small batch processing.

### Deadline pressure

Risk: all-sports launch before the World Cup is ambitious.

Mitigation: all sports visible at launch, but deeper sport-specific stats can vary by provider capability. World Cup and core score/editorial surfaces remain the launch focus.

## Definition Of Launch Ready

Scoreline is launch ready when:

- Public users can browse all target sports without login.
- Homepage shows trend-led stories and live/upcoming events.
- Soccer World Cup coverage is useful and crawlable.
- Scores, fixtures, results, and standings render from normalized data.
- Sanity can publish articles and policy pages.
- AI can create source-grounded drafts that require approval.
- Algolia search works from header and `/search`.
- Required AdSense trust pages are live.
- Feedback form works.
- Admin can view job/data health.
- Core SEO metadata, schema, sitemaps, and robots are in place.
- Automated tests and CI pass.
- Provider polling is cached and rate-limited.
