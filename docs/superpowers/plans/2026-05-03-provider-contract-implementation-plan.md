# Provider Contract Implementation Plan

Date: 2026-05-03
Source spec: `docs/superpowers/specs/2026-05-03-provider-contract-design.md`
Target launch: before 2026-06-11
Last updated: 2026-05-03

## Current Status

- Milestone 0 is complete and merged in PR #1: `feat: add Scoreline app baseline`.
- Milestone 1 is complete and merged:
  - Prisma now includes the normalized sports and operations schema.
  - Neon migration, seed, and database verification now pass via `pnpm db:verify`.
  - Database and seed tooling now run against Neon only.
- Milestone 2 is complete and merged:
  - Job queue claiming, retry handling, typed handlers, and execution logs are in place.
  - Protected job runner and admin-safe log inspection endpoints exist.
  - Cloudflare Worker Cron can call the runner endpoint.
- Latest verified gates:
  - `pnpm quality`
  - `pnpm db:verify`
- Local note: Playwright needs localhost binding permission in the Codex sandbox, but the e2e smoke test passes when allowed.

## Immediate Next Slice

Start Milestone 3 with the contract boundary first:

- Define provider-agnostic sports adapter types in the domain layer.
- Add a first API-Football soccer adapter that maps provider payloads into the shared contract.
- Add recorded-payload tests for the mapping layer.
- Keep provider-specific behavior isolated behind the adapter boundary.

## Planning Principles

- Build vertical slices that become usable quickly.
- Keep editorial and scores as equal first-class systems, with CMS-first SEO priority.
- Treat automated tests as a blocking requirement, not cleanup work.
- Put provider access behind adapters and normalized models from the start.
- Cache aggressively so public traffic does not directly multiply provider API cost.
- Keep launch infrastructure lean: Vercel app, Postgres, Sanity, Algolia, Cloudflare Worker Cron.
- Make paid provider upgrades possible without changing public routes.

## Milestone 3: Sports Provider Adapter Layer

Status: Not started.

Goal: integrate API-SPORTS/API-Football behind stable internal interfaces.

### Scope

- Define provider adapter contracts.
- Define normalized provider records for competitions, seasons, teams, venues, fixtures, standings, and live status.
- Implement an API-Football soccer adapter against the shared contract.
- Add provider fixture files for tests.
- Add a thin sync consumer stub that can use the adapter later without public route coupling.
- Preserve provider IDs and raw snapshot metadata for debugging.
- Keep the first slice soccer-focused while leaving the boundary sport-agnostic.

### Test Gate

- Adapter unit tests map recorded provider payloads into normalized models.
- Missing provider fields degrade gracefully instead of crashing callers.
- Normalized IDs, timestamps, and status values remain stable.
- The adapter contract stays independent from public routes and UI code.

### Suggested Commits

- `feat: add sports provider adapter contracts`
- `feat: integrate API-Football soccer adapter`
- `test: cover provider normalization`

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

