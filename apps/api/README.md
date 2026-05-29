# `@events.comp-soc.com/api`

REST API powering the CompSoc Events Platform. Handles events, registrations, user sync with Clerk, and committee/Sig role-based access control.

## Stack

- **Fastify** as the HTTP server
- **Drizzle ORM** + **PostgreSQL** (Neon-compatible)
- **Zod** + `drizzle-zod` for validation and schema inference
- **Clerk** (`@clerk/fastify`) for auth, **Svix** for webhook signature verification
- **Vitest** for testing, with a containerised Postgres for integration tests
- **nanoid** for ID generation

## Environment

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Scripts

```bash
pnpm dev              # Dev server with hot reload (nodemon + tsx) on :8080
pnpm build            # Compile to dist/
pnpm start            # Run compiled server
pnpm type-check       # tsc --noEmit

pnpm db:generate      # Generate Drizzle migrations from schema
pnpm db:migrate       # Apply pending migrations
pnpm db:studio        # Open Drizzle Studio

pnpm test             # Vitest run (expects test DB up)
pnpm test:local       # Spins up the test DB, runs, tears down
pnpm test:coverage    # Vitest with v8 coverage
```

## Module layout

Routes are organised by domain. Each module has `route.ts`, `service.ts`, `store.ts`, `schema.ts`:

```
src/
├── app.ts                  Server bootstrap
├── server.ts               Fastify instance + plugin registration
├── db/                     Drizzle schema + connection
├── lib/                    auth guards, error handler, logger
├── modules/
│   ├── events/             /v1/events
│   ├── registration/       /v1/events/:id/registrations
│   ├── users/              /v1/users
│   ├── webhooks/clerk.ts   Clerk → DB sync via Svix
│   ├── core/               shared API schemas
│   └── health.ts           /health
└── plugins/db.ts           Drizzle plugin
```

## Clerk webhooks

To sync users into the DB, point a Clerk webhook at `POST /webhooks/clerk`:

1. Clerk Dashboard → Webhooks → new endpoint `https://your-api/webhooks/clerk`
2. Subscribe to `user.created`, `user.updated`, `user.deleted`
3. Copy the signing secret into `CLERK_WEBHOOK_SECRET`

## Docker

```bash
docker-compose up --build
```

The API is published to GitHub Container Registry on merges to `main`:

```
ghcr.io/compsoc-edinburgh/events-api:latest
```
