<p align="center">
  <img src="apps/web/public/mascot-discord.png" alt="CompSoc mascot" width="220" />
</p>

<h1 align="center">CompSoc Events Platform</h1>

<p align="center">
  Event management for the University of Edinburgh's Computing Society and its Special Interest Groups (Sigs).
</p>

---

## Features

- **Discover events** from CompSoc and every Special Interest Group in one place.
- **Analytics reports** per event for committee members — registrations over time, breakdowns by status and answer.
- **Approval flows** for committee and Sig executives to accept, reject or waitlist participants.
- **SDK** (TBD) for external CompSoc applications to consume the same API.

## Apps

This is a **pnpm monorepo**. Each app has its own README with setup, scripts and deeper details.

| Package                                              | Description                                                | Tech Stack                                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`apps/web`](./apps/web/README.md)                   | Frontend — browse events, register, manage Sigs.           | React 19, TanStack Start, TanStack Router, TanStack Query, Tailwind CSS v4, Clerk, Radix UI |
| [`apps/api`](./apps/api/README.md)                   | REST API — events, registrations, auth, webhooks.          | Fastify, Drizzle ORM, PostgreSQL, Zod, Clerk                                                |
| [`apps/shared`](./apps/shared/README.md)             | Shared Zod schemas, types and constants used by both apps. | Zod, TypeScript                                                                             |
