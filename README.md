# Events • CompSoc

Easily view, register, and manage events across CompSoc and its SIGs.
This platform powers all event listings for CompSoc, helping members discover upcoming activities, workshops, socials, gaming nights, hackathons, and more.

## Key Features

* Public event listings with details, tags, location, and schedule
* Event registration to reserve your spot
* Personal dashboard showing your upcoming events
* Committee and SIG leader tools for posting and managing events

## Architecture

Simple monorepo:

```
apps/
  web   → frontend (Vite + React)
  api   → backend (Fastify + Prisma)

packages/
  types → shared schemas & models
```

Shared types ensure consistent communication between API and frontend.

## Deployment

Hosted under:

**[https://events.comp-soc.com](https://events.comp-soc.com)**

## Contributing

More developer documentation lives inside the respective `web/` and `api/` folders.
