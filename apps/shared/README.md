# `@events.comp-soc.com/shared`

Shared types, Zod schemas and constants consumed by both `apps/web` and `apps/api`. The single source of truth for contracts that cross the network boundary.

## Stack

- **TypeScript** (compiled to `dist/`)
- **Zod** for runtime schemas + inferred static types

## What's inside

```
src/
├── core/               Sigs enum, shared primitives (Nullable, etc.)
├── events/             Event contract & response schemas, EventState, EventPriority
├── registrations/     Registration contract & response schemas, RegistrationStatus
├── users/              User schema, UserRole, role helpers (isEventManager, canManageSig)
└── index.ts            Public exports
```

Every cross-cutting type the frontend and backend agree on lives here — when the API changes a shape, you change it once.

## Scripts

```bash
pnpm build        # tsc to dist/
```

## Consuming

Both `apps/web` and `apps/api` import via the package name and the `workspace:*` protocol in `package.json`:

```ts
import {
  EventResponseSchema,
  RegistrationStatus,
  Sigs,
  canManageSig,
} from "@events.comp-soc.com/shared";
```

Run `pnpm --filter @events.comp-soc.com/shared build` after editing schemas to refresh `dist/` for the other apps.
