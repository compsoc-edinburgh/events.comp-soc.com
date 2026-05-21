# `@events.comp-soc.com/web`

Frontend application for the CompSoc Events Platform. Members browse and register for events; committee members and Sig executives create, draft and manage them.

## Stack

- **React 19** + **TanStack Start** (full-stack React framework on Vite)
- **TanStack Router** for routing, **TanStack Query** for server state, **TanStack Form** for forms
- **Tailwind CSS v4** for styling, **Radix UI** primitives + `shadcn`-style components
- **Clerk** for authentication
- **Zod** for runtime validation (shared with the API via `@events.comp-soc.com/shared`)
- **react-day-picker**, **recharts**, **sonner**, **lucide-react**, **date-fns**, **redaxios**

## Environment

Create `apps/web/.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_API_URL=http://localhost:8080
```

## Scripts

```bash
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run Vitest
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm check        # Format + lint --fix
```

## Project layout

```
src/
├── components/       UI primitives, layout, and feature components
├── config/           Sigs, navigation, page metadata
├── integrations/     Clerk + TanStack Query providers
├── lib/              data fetching (server fns), hooks, auth, utils
├── routes/           File-based TanStack Router routes
└── styles.css        Tailwind theme tokens (background / surface / navigation)
```

## Deployment

Configured for Vercel via `vercel.json`. Build runs `vite build`.
