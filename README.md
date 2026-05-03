# Scoreline

Scoreline is a CMS-first sports updates and live scores site for `scoreline.site`.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Copy the environment file:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
pnpm dev
```

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm quality
```

Playwright needs a browser installed locally:

```bash
pnpm exec playwright install chromium
```

## Milestone 0

This baseline includes the Next.js App Router scaffold, TypeScript, linting,
Vitest, Playwright, Prisma configuration, CI, environment validation, and the
first Scoreline app shell.
