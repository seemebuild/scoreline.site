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

## Database

Prisma 7 reads the connection URL from `prisma.config.ts`. Set
`DATABASE_URL` in `.env.local` or use the documented local default:

```bash
postgresql://postgres:postgres@localhost:5432/scoreline
```

Generate the Prisma client:

```bash
pnpm db:generate
```

Create and apply a local migration:

```bash
pnpm exec prisma migrate dev --name init
```

Apply migrations in CI or production:

```bash
pnpm exec prisma migrate deploy
```

Seed launch sports and soccer competitions:

```bash
pnpm db:seed
```

## Milestone 0

This baseline includes the Next.js App Router scaffold, TypeScript, linting,
Vitest, Playwright, Prisma configuration, CI, environment validation, and the
first Scoreline app shell.
