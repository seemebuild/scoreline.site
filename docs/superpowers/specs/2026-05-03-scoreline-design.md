# Scoreline Design Spec

Date: 2026-05-03
Domain: scoreline.site
Status: Approved draft for implementation planning

## Purpose

Scoreline is a global English sports updates and live scores website built for SEO, AdSense readiness, and repeat sports-fan usage. The site will be public and account-free for readers. It will cover soccer, NBA, American football, baseball, MMA, tennis, and golf at launch, with a strong pre-World Cup launch focus before June 11, 2026.

The product direction is CMS-first hybrid with full-strength scores. Editorial content is the main SEO engine, but fixtures, live scores, results, standings, search, team pages, and event pages are first-class product surfaces rather than lightweight widgets.

## Launch Goals

- Launch a responsive web application at `scoreline.site`.
- Cover all target sports at launch.
- Make World Cup coverage strong before June 11, 2026.
- Provide crawlable, useful editorial and programmatic sports pages.
- Use AdSense-friendly policies: no betting, no scraped highlights, no comments, no public accounts.
- Keep infrastructure lean while allowing paid upgrades where live data quality matters.
- Treat automated testing as a top-priority launch requirement.

## Audience And Positioning

Scoreline targets a global English-speaking sports audience, with emphasis on Europe and North America and additional relevance for African audiences. The launch region signals for trends are United States, United Kingdom, Canada, Germany, Spain, Italy, France, and Ghana/Nigeria or broader Africa where available.

The UI should feel like a clean modern sports newsroom combined with an efficient live-data dashboard. It should be fast, credible, scannable, and useful on mobile and desktop.

## Product Scope

### Public Surfaces

- Homepage with trend-led top module.
- Sport landing pages for soccer, NBA, American football, baseball, MMA, tennis, and golf.
- Competition and tournament pages.
- Live scores page.
- Fixtures and results pages.
- Match/event detail pages.
- Team pages for major teams, clubs, and franchises.
- Standings pages where supported by the sport or competition.
- Limited notable athlete pages where provider data is reliable.
- Article pages.
- Author pages.
- Search page.
- Trust and policy pages.
- Contact and feedback form.

### Soccer Launch Competitions

Soccer launch coverage must include:

- FIFA World Cup and World Cup qualifiers.
- UEFA Champions League.
- Premier League.
- La Liga.
- Serie A.
- Bundesliga.
- Ligue 1.
- MLS.
- AFCON and major African national-team competitions.

### Explicitly Out Of Scope For Launch

- Public user login or signup.
- Comments or community features.
- Betting odds, bookmaker links, or gambling CTAs.
- Core video/highlight product.
- Newsletter or push notification product.
- PWA installation/offline scope.
- Paid news/trend APIs such as NewsAPI or GNews.
- PostHog analytics.
- Dedicated staging environment.

## Architecture

Scoreline will be a Next.js App Router application deployed to Vercel. It will use server components, static generation, ISR, cached route handlers, and selective client components for interactive scoreboards, search, personalization, theme, and timezone controls.

Postgres will be the operational source of truth for sports data, provider mappings, job state, feedback, analytics events, trend scores, and cache metadata. Prisma will manage database schema and queries.

Sanity will own editorial content and editorial workflow. Sanity content includes articles, authors, categories, draft states, policy pages, image metadata, pinned homepage items, and manual trend boosts.

Algolia will power search and autocomplete. Postgres and Sanity remain sources of truth; Algolia is a derived index.

Cloudflare Worker Cron will provide scheduling. It will call a protected Scoreline endpoint that runs a custom Postgres-backed job queue. This avoids paid Vercel Cron frequency requirements while keeping the main app on Vercel.

## Data Providers

The primary launch provider is API-SPORTS/API-Football. The system must use provider adapters and normalized internal models so individual sports can be upgraded later without changing public page contracts.

Upgrade paths:

- Sportmonks for premium soccer or World Cup coverage if needed.
- SportsDataIO for stronger North American sports, tennis, golf, or MMA coverage if needed.

Provider responses should be stored as raw snapshots for debugging and auditability before normalization.

## Data Model Areas

The internal domain model will include:

- Sports.
- Competitions and tournaments.
- Seasons.
- Teams, clubs, and franchises.
- Notable athletes where reliable.
- Fixtures/events.
- Live scores and status.
- Results.
- Standings.
- Venues.
- Provider IDs and provider snapshots.
- Editorial content references.
- Trend scores.
- Anonymous analytics events.
- Feedback submissions.
- Background jobs.

## Background Jobs

The custom job system will use Postgres tables for queued work. Jobs will support:

- `pending`, `running`, `completed`, `failed`, and retry states.
- Row-level claiming to avoid duplicate processing.
- Idempotency keys.
- Max attempts.
- Backoff.
- Last error tracking.
- Job history for ops visibility.

Job types include:

- Fixture sync.
- Live score sync.
- Result finalization.
- Standings sync.
- Provider snapshot cleanup or retention tasks.
- AI draft candidate generation.
- Sanity draft creation.
- Algolia indexing.
- Trend score refresh.
- Feedback email notification.
- Cache and revalidation tasks.

Cloudflare Cron calls the job tick endpoint on a frequent schedule. The endpoint claims a small batch of due jobs and processes them within serverless limits.

## Caching And Freshness

Public pages read normalized data from Postgres, not provider APIs directly. Provider access is controlled by jobs and cache policy.

Freshness targets:

- Priority live events: refresh every 15-60 seconds where feasible.
- Normal live events: refresh every 2-5 minutes.
- Upcoming fixtures: cache 6-24 hours, with shorter windows as kickoff approaches.
- Final results: long cache after verification.
- Standings: refresh after relevant matches and on scheduled intervals.
- Articles: ISR or cached rendering revalidated by Sanity publish webhooks.
- Search index: update on content publish and meaningful sports-data changes.
- Trending: recalculate regularly from internal events, sports-data signals, editor boosts, and free external signals.

Cache behavior must protect API budget and keep public pages fast.

## Editorial Workflow

Sanity is the editorial control plane. It manages:

- Original articles.
- AI-generated drafts.
- Preview and recap workflows.
- Author profiles.
- Image metadata.
- Editorial policy pages.
- Homepage pins and trend boosts.
- Publishing and scheduling.

Gemini is the first AI provider for draft generation. The codebase will use an AI provider adapter so future models can be added without rewriting the editorial workflow.

AI may generate drafts only from official, structured, or licensed sources. Safe inputs include sports data APIs, official league/team announcements, official injury reports, press releases, and other source-grounded material. AI must not rewrite publisher articles.

No AI-generated article publishes automatically. A human must approve or schedule every article in Sanity.

Initial AI draft volume should be conservative: 5-10 drafts per day across all sports, focused on major events and high-value SEO opportunities.

## SEO And GEO Strategy

The SEO strategy is editorial-first plus programmatic sports pages.

Editorial content targets:

- Breaking updates from official/structured sources.
- Match and event previews.
- Recaps.
- Standings implications.
- Injury and availability updates where sourced.
- Schedule and tournament guides.
- World Cup explainers and updates.
- Useful "where to watch" style content where legally safe and regionally appropriate.

Programmatic pages cover:

- Sports.
- Competitions.
- Teams.
- Fixtures.
- Results.
- Standings.
- Match/event details.

Programmatic pages must include enough unique value to be indexed. Useful elements include kickoff time in user timezone, venue/local time, live status, form, standings context, related articles, recent results, internal links, and event-specific metadata. Thin pages should be enriched or marked `noindex`.

SEO implementation requirements:

- Dynamic titles and descriptions.
- Canonical URLs.
- XML sitemap indexes by content type and sport.
- Robots.txt that supports search crawling and appropriate AI crawler access.
- Structured data for `Article`, `NewsArticle`, `SportsEvent`, `Organization`, `BreadcrumbList`, `WebSite`, `SearchAction`, and selected `FAQPage`.
- Author pages.
- Strong internal linking.
- Open Graph and social metadata.
- Fast Core Web Vitals.
- Localization-ready architecture, English-only launch.

## AdSense And Trust Requirements

Launch must include:

- About Scoreline.
- Contact.
- Editorial Policy.
- AI Assistance Policy.
- Privacy Policy.
- Terms of Use.
- Cookie Policy and consent handling where needed.

The site must avoid scraped content, copied publisher wording, misleading AI images, betting CTAs, unmanaged user-generated content, and unlicensed video/highlight uploads.

## Trending System

The homepage is trend-led rather than permanently World Cup-first.

Trend inputs:

- Internal page views and click events.
- Favorite actions.
- Search clicks.
- Live event status.
- Kickoff proximity.
- Competition importance.
- Article recency.
- Editor pins and boosts from Sanity.
- Free external signals where feasible, such as Google Trends RSS/export and official RSS feeds.

Paid news/trend APIs are not part of launch. If external signal collection fails, the homepage must still work from internal data, live sports context, and editorial controls.

## Personalization

No public accounts are required. Lightweight personalization is stored locally in the browser:

- Favorite sports.
- Favorite teams.
- Favorite competitions.
- Preferred timezone.
- Light/dark theme choice.

The site detects visitor timezone automatically, lets users override it, and stores the preference locally. Event detail pages show venue/local time when provider data includes a reliable venue timezone.

## Search

Algolia will power:

- Header autocomplete/global search.
- Full `/search` page.

Search result types:

- Articles.
- Teams.
- Competitions.
- Key fixtures/events.
- Notable athletes where supported.

Search filters:

- Sport.
- Content type.
- Competition.
- Team.
- Date.
- Event status.

Indexing should avoid unnecessary cost. Do not index every tiny historical item until there is demonstrated demand.

## Feedback

Scoreline will include a feedback form on the Contact page and a footer link to that form. Fields:

- Topic.
- Message.
- Optional email.

Submissions are stored in Postgres. The form must include basic spam controls such as honeypot, rate limiting, and server-side validation. Email notification is enabled when the production environment provides email service credentials; otherwise submissions remain visible in the ops dashboard.

Feedback is not managed in Sanity at launch.

## Admin And Operations

Sanity handles editorial admin. Scoreline also has a private ops dashboard protected by simple custom admin auth:

- One admin secret at launch.
- Admin login route.
- Secure HttpOnly session cookie.
- Rate limiting.
- No public signup.
- No Auth.js or Google login.

Ops dashboard should show:

- Job queue status.
- Failed and stale syncs.
- Provider error rates.
- Live data freshness.
- AI draft generation status.
- Algolia indexing status.
- Feedback submission counts.
- Top trending pages/items.
- Cache/revalidation events where practical.

## Images And Media

Editorial pages use a hybrid image strategy:

- Licensed or official images where usage is permitted.
- Clean sport/tournament/team graphics where appropriate.
- No image when no safe visual asset exists.
- No misleading AI-generated news photos.

Official video embeds may be considered case-by-case later. Video is not a core launch feature.

## Testing Strategy

Automated tests are a top-priority launch requirement.

Required test areas:

- Unit tests for data normalization.
- Unit tests for URL builders.
- Unit tests for cache policy.
- Unit tests for trend ranking.
- Unit tests for timezone handling.
- Integration tests for provider adapters with mocked or recorded responses.
- Job queue tests for locking, retries, idempotency, and failure states.
- SEO tests for metadata, canonical URLs, sitemaps, robots, and JSON-LD.
- AI validation tests for required sources, unsupported claims, and required Sanity fields.
- Playwright smoke tests for homepage, article pages, sport pages, fixture pages, match pages, search, feedback, and admin login.
- CI test execution before deployment.

Tests should focus first on data integrity, SEO correctness, background jobs, and critical user journeys.

## Launch Plan

Launch before June 11, 2026 with:

- All target sports visible.
- CMS-first editorial experience.
- Full-strength scores infrastructure.
- Strong World Cup hub and supporting content.
- API-SPORTS/API-Football provider integration.
- Sanity editorial workflow.
- Gemini AI draft workflow with human approval.
- Postgres/Prisma data layer.
- Cloudflare Cron and custom Postgres job queue.
- Algolia search.
- Trend-led homepage.
- Legal and trust pages.
- Feedback form.
- Admin ops dashboard.
- Automated test suite and CI.

Post-launch priorities:

- Provider upgrades where data quality or traffic justifies cost.
- Deeper stats and historical archives.
- Richer athlete pages.
- PostHog analytics.
- More external trend signals.
- Optional staging environment.
- Newsletter or notification products if traffic patterns justify them.

## Open Decisions Locked For Implementation

- Framework: Next.js App Router.
- Deployment: Vercel production at `scoreline.site`.
- CMS: Sanity.
- Database: Postgres with Prisma.
- Primary sports provider: API-SPORTS/API-Football.
- Search: Algolia.
- AI draft provider: Gemini first, behind an adapter.
- Scheduler: Cloudflare Worker Cron.
- Queue: custom Postgres job queue.
- Analytics: GA4, Search Console, and internal anonymous event table at launch.
- Later analytics: PostHog.
- Public auth: none.
- Admin auth: one custom admin secret.
- Launch platform: responsive web only.
