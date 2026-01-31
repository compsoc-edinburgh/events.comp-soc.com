<img width="1512" height="368" alt="Screenshot 2026-01-31 at 13 21 43" src="https://github.com/user-attachments/assets/4554058b-dbde-4cb8-a83d-ea0cdaa6514b" />

# CompSoc Events Platform

A full-stack event management platform for the University of Edinburgh's Computing Society (CompSoc). Members can browse and register for events organized by the society and its Special Interest Groups (SIGs).

## Architecture

This is a **pnpm monorepo** with three packages:

| Package       | Description            | Tech Stack                                              |
| ------------- | ---------------------- | ------------------------------------------------------- |
| `apps/api`    | REST API server        | Fastify, Drizzle ORM, PostgreSQL                        |
| `apps/web`    | Frontend application   | React 19, TanStack Router, TanStack Query, Tailwind CSS |
| `apps/shared` | Shared types & schemas | Zod, TypeScript                                         |

## Features

- **Event Management** - Create, edit, publish, and delete events
- **Event Registration** - Members can register for events with custom form fields
- **Registration Management** - Committee members can accept, reject, or waitlist registrations
- **Analytics** - View registration statistics and charts
- **Role-based Access** - Member and Committee roles with different permissions
- **Authentication** - Clerk authentication with webhook sync

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

**API** (`apps/api/.env`):

```env
# Database
DATABASE_URL="postgresql://user:password@your-host.neon.tech/neondb?sslmode=require"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Clerk Webhooks (for user sync)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Web** (`apps/web/.env.local`):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_API_URL=http://localhost:8080
```

### 3. Database Setup

Generate and run migrations:

```bash
cd apps/api
pnpm db:migrate
```

### 4. Build Shared Package

```bash
pnpm --filter @events.comp-soc.com/shared build
```

### 5. Start Development Servers

```bash
# Run both API and Web
pnpm dev

# Or run individually
pnpm dev:api  # API on http://localhost:8080
pnpm dev:web  # Web on http://localhost:3000
```

## Clerk Webhook Setup

To sync users from Clerk to your database:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Create a new endpoint with URL: `https://your-api-domain.com/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** to `CLERK_WEBHOOK_SECRET` in your API `.env`

For local development, use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 8080
# Use the ngrok URL + /webhooks/clerk as your endpoint
```

## API Endpoints

| Method   | Endpoint                                    | Description                |
| -------- | ------------------------------------------- | -------------------------- |
| `GET`    | `/health`                                   | Health check               |
| `GET`    | `/v1/events`                                | List events                |
| `POST`   | `/v1/events`                                | Create event               |
| `GET`    | `/v1/events/:id`                            | Get event                  |
| `PUT`    | `/v1/events/:id`                            | Update event               |
| `DELETE` | `/v1/events/:id`                            | Delete event               |
| `GET`    | `/v1/events/:eventId/registrations`         | List registrations         |
| `POST`   | `/v1/events/:eventId/registrations`         | Create registration        |
| `PATCH`  | `/v1/events/:eventId/registrations/:userId` | Update registration status |
| `GET`    | `/v1/users/:id`                             | Get user                   |
| `GET`    | `/v1/users/registrations`                   | Get user's registrations   |
| `POST`   | `/webhooks/clerk`                           | Clerk webhook endpoint     |

## Scripts

### Root

```bash
pnpm dev          # Run all apps in development
pnpm build        # Build all packages
pnpm lint         # Lint all apps
pnpm format       # Format code with Prettier
pnpm typecheck    # Type check all packages
```

### API (`apps/api`)

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
pnpm test         # Run tests
```

### Web (`apps/web`)

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
```

## Docker

Build and run the API with Docker:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8080`.

## Deployment

### API

The API is containerized and pushed to GitHub Container Registry on merge to `main`:

```
ghcr.io/compsoc-edinburgh/events-api:latest
```

### Web

The web app can be deployed to Vercel. The `vercel.json` is already configured.

## Testing

API tests run against a PostgreSQL container:

```bash
cd apps/api
pnpm test:local  # Spins up test DB, runs tests, tears down
```

## License

MIT
