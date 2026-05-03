# Milestone 5 Editorial Surface Design

Date: 2026-05-03
Domain: scoreline.site
Status: Draft for implementation planning

## Purpose

Milestone 5 turns the public site into a credible editorial product. The first slice is intentionally narrow: ship trust and editorial entry pages now, then connect them to Sanity once the public shape is stable.

This slice should give the site:

- crawlable trust pages that support SEO and AdSense readiness
- a public editorial shell for future article content
- a clear route structure for Sanity-backed content later

## Scope

### In scope

- Public trust pages:
  - `/about`
  - `/contact`
  - `/policy`
  - policy subpages for editorial standards, privacy, and terms
- A lightweight editorial shell:
  - `/news`
  - article listing placeholder state
  - article detail placeholder state
- Shared metadata for these routes.
- Basic sitemap-friendly routing and canonical URLs for the new pages.
- A minimal content model boundary for future Sanity integration.

### Out of scope for this slice

- Full Sanity project setup.
- Author profiles and author archive pages.
- Article CMS editing UI.
- AI draft generation.
- Publish webhooks.
- Algolia indexing.
- Newsletter or comments.

## Design

The implementation should use the existing Next.js App Router patterns already in the codebase.

The public shell should stay visually aligned with the current sports surface:

- shared site shell
- simple dense page layouts
- calm, text-first presentation
- no marketing landing-page treatment

Trust and policy pages should be real public routes with meaningful body content, even if the content is intentionally concise at first. The editorial shell should be ready to host Sanity content, but it does not need to render from Sanity yet.

## Data And Content

The first pass may use local route content and typed content descriptors rather than CMS-backed data.

Required page behavior:

- trust pages render cleanly without CMS dependencies
- editorial shell renders a usable list/detail structure
- missing editorial content shows a graceful empty state instead of a broken page
- all new routes expose canonical metadata

## Testing

The test gate for this slice should cover:

- public routing for the new trust pages
- metadata/canonical coverage for the new editorial routes
- fallback rendering when editorial content is absent
- smoke coverage for the `/news` shell

## Success Criteria

- The site has public trust pages that are crawlable and useful.
- The site has a visible editorial entry point.
- The new routes fit the current app style and do not feel bolted on.
- The implementation creates a clean seam for Sanity to plug into next.
