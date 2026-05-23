import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { activeMockAuthState, setMockAuth, setSigExecutiveAuth } from "../../../tests/mock-auth.js";
import { FastifyInstance } from "fastify";
import { buildServer } from "../../server.js";
import { db } from "../../db/db.js";
import { sql, eq } from "drizzle-orm";
import { eventsTable, registrationsTable } from "../../db/schema.js";
import type { CreateEventRequest, UpdateEventRequest } from "@events.comp-soc.com/shared";
import { Sigs } from "@events.comp-soc.com/shared";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

const futureDate = () => new Date(Date.now() + 60 * 60 * 1000);
const pastDate = () => new Date(Date.now() - 60 * 60 * 1000);

describe("Event", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.execute(sql`TRUNCATE TABLE ${registrationsTable} CASCADE`);
    await db.execute(sql`TRUNCATE TABLE ${eventsTable} CASCADE`);
  });

  describe("GET /v1/events", () => {
    beforeEach(async () => {
      const baseEvent = {
        aboutMarkdown: "md",
        organiser: "projectShare",
        date: futureDate(),
      };

      await db.insert(eventsTable).values([
        { ...baseEvent, id: "pub-1", title: "Public 1", state: "published" },
        { ...baseEvent, id: "pub-2", title: "Public 2", state: "published" },
        { ...baseEvent, id: "pub-3", title: "Public 3", state: "published" },
        { ...baseEvent, id: "draft-1", title: "Draft 1", state: "draft" },
        { ...baseEvent, id: "draft-2", title: "Draft 2", state: "draft" },
      ]);
    });

    it("should return ONLY published events for unauthenticated users", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(3);
    });

    it("should return ALL events (draft & published) for committee members", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(5);
    });

    it("should allow committee to filter by state explicitly", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events?state=draft",
      });

      const data = response.json();
      expect(data).toHaveLength(2);
      expect(data[0].state).toBe("draft");
    });
  });

  describe("GET /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values([
        {
          id: "draft-event",
          title: "Secret",
          state: "draft",
          aboutMarkdown: "md",
          organiser: "soc",
          date: futureDate(),
        },
        {
          id: "public-event",
          title: "Public",
          state: "published",
          aboutMarkdown: "md",
          organiser: "soc",
          date: futureDate(),
        },
      ]);
    });

    it("should return 404 for draft event if user is member", async () => {
      setMockAuth({ userId: "mem", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/draft-event",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 200 for draft event if user is committee", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/draft-event",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe("draft-event");
    });
  });

  describe("POST /v1/events", () => {
    const validPayload: CreateEventRequest = {
      title: "Hackathon 2025",
      organiser: "projectShare",
      state: "draft",
      priority: "default",
      capacity: 150,
      date: futureDate().toISOString(),
      aboutMarkdown: "# Details",
      location: "Comp Lab",
      locationURL: "https://maps.google.com",
      form: [],
    };

    it("should forbid creation by non-committee members (401)", async () => {
      setMockAuth({ userId: "mem", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validPayload,
      });

      expect(response.statusCode).toBe(401);
    });

    it("should create event successfully for committee", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();

      expect(body.id).toBeDefined();

      const [dbEvent] = await db.select().from(eventsTable).where(eq(eventsTable.id, body.id));
      expect(dbEvent).toBeDefined();
      expect(dbEvent.title).toBe(validPayload.title);
      expect(dbEvent.capacity).toBe(150);
    });

    it("should fail (400) if required fields are missing", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: {
          // Missing title, organiser, date, etc.
          aboutMarkdown: "Just desc",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT /v1/events/:id", () => {
    const eventId = "update-test-id";

    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: eventId,
        title: "Old Title",
        state: "draft",
        aboutMarkdown: "Old MD",
        organiser: "soc",
        date: futureDate(),
        capacity: 50,
      });
    });

    it("should allow partial updates", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const updatePayload: UpdateEventRequest = {
        title: "New Title",
      };

      const response = await app.inject({
        method: "PUT",
        url: `/v1/events/${eventId}`,
        payload: updatePayload,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().title).toBe("New Title");

      const [dbEvent] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
      expect(dbEvent.title).toBe("New Title");
      expect(dbEvent.capacity).toBe(50);
    });

    it("should reject editing historical events", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      await db.insert(eventsTable).values({
        id: "past-update-test-id",
        title: "Already Happened",
        state: "published",
        aboutMarkdown: "Past MD",
        organiser: "soc",
        date: pastDate(),
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/past-update-test-id",
        payload: { title: "New Title" },
      });

      expect(response.statusCode).toBe(409);
    });
  });

  describe("DELETE /v1/events/:id", () => {
    const eventId = "delete-target";

    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: eventId,
        title: "To Be Deleted",
        state: "draft",
        aboutMarkdown: "md",
        organiser: "soc",
        date: futureDate(),
      });
    });

    it("should delete event and return 200", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "DELETE",
        url: `/v1/events/${eventId}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe(eventId);

      const result = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
      expect(result).toHaveLength(0);
    });

    it("should reject deleting historical events", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      await db.insert(eventsTable).values({
        id: "past-delete-target",
        title: "Past Event",
        state: "published",
        aboutMarkdown: "md",
        organiser: "soc",
        date: pastDate(),
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/past-delete-target",
      });

      expect(response.statusCode).toBe(409);
    });
  });

  describe("SIG Executive - GET /v1/events", () => {
    beforeEach(async () => {
      const baseEvent = {
        aboutMarkdown: "md",
        date: futureDate(),
      };

      await db.insert(eventsTable).values([
        {
          ...baseEvent,
          id: "ai-pub",
          title: "AI Published",
          state: "published",
          organiser: Sigs.EdinburghAI,
        },
        {
          ...baseEvent,
          id: "ai-draft",
          title: "AI Draft",
          state: "draft",
          organiser: Sigs.EdinburghAI,
        },
        {
          ...baseEvent,
          id: "quant-pub",
          title: "Quant Published",
          state: "published",
          organiser: Sigs.QuantSig,
        },
        {
          ...baseEvent,
          id: "quant-draft",
          title: "Quant Draft",
          state: "draft",
          organiser: Sigs.QuantSig,
        },
        {
          ...baseEvent,
          id: "compsoc-pub",
          title: "CompSoc Published",
          state: "published",
          organiser: Sigs.Compsoc,
        },
        {
          ...baseEvent,
          id: "compsoc-draft",
          title: "CompSoc Draft",
          state: "draft",
          organiser: Sigs.Compsoc,
        },
      ]);
    });

    it("should return published events + draft events for assigned SIGs only", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();

      expect(data).toHaveLength(4);

      const ids = data.map((e: { id: string }) => e.id);
      expect(ids).toContain("ai-pub");
      expect(ids).toContain("ai-draft");
      expect(ids).toContain("quant-pub");
      expect(ids).toContain("compsoc-pub");
      expect(ids).not.toContain("quant-draft");
      expect(ids).not.toContain("compsoc-draft");
    });

    it("should return only assigned SIG drafts when sig_executive filters by draft state", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events?state=draft",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      const ids = data.map((e: { id: string }) => e.id);

      expect(ids).toEqual(["ai-draft"]);
    });

    it("should return all published events and no drafts when sig_executive filters by published state", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events?state=published",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      const ids = data.map((e: { id: string }) => e.id);

      expect(ids).toContain("ai-pub");
      expect(ids).toContain("quant-pub");
      expect(ids).toContain("compsoc-pub");
      expect(ids).not.toContain("ai-draft");
      expect(ids).not.toContain("quant-draft");
      expect(ids).not.toContain("compsoc-draft");
    });
  });

  describe("SIG Executive - GET /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values([
        {
          id: "ai-draft-event",
          title: "AI Draft",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.EdinburghAI,
          date: futureDate(),
        },
        {
          id: "quant-draft-event",
          title: "Quant Draft",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: futureDate(),
        },
      ]);
    });

    it("should return 200 for draft event if sig_executive manages that SIG", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/ai-draft-event",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe("ai-draft-event");
    });

    it("should return 404 for draft event if sig_executive does NOT manage that SIG", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/quant-draft-event",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("SIG Executive - POST /v1/events", () => {
    const validPayload: CreateEventRequest = {
      title: "AI Workshop",
      organiser: Sigs.EdinburghAI,
      state: "draft",
      priority: "default",
      capacity: 50,
      date: futureDate().toISOString(),
      aboutMarkdown: "# AI Event",
      location: "AI Lab",
      locationURL: "https://maps.google.com",
      form: [],
    };

    it("should allow sig_executive to create event for their assigned SIG", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validPayload,
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.organiser).toBe(Sigs.EdinburghAI);
    });

    it("should forbid sig_executive from creating event for SIG they don't manage", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: { ...validPayload, organiser: Sigs.QuantSig },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe("SIG Executive - PUT /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values([
        {
          id: "ai-event",
          title: "AI Event",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.EdinburghAI,
          date: futureDate(),
        },
        {
          id: "quant-event",
          title: "Quant Event",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: futureDate(),
        },
      ]);
    });

    it("should allow sig_executive to update event for their SIG", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/ai-event",
        payload: { title: "Updated AI Event" },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().title).toBe("Updated AI Event");
    });

    it("should forbid sig_executive from updating event for SIG they don't manage", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/quant-event",
        payload: { title: "Trying to update Quant" },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should forbid sig_executive from transferring event to SIG they don't manage", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/ai-event",
        payload: { organiser: Sigs.QuantSig },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should allow sig_executive to transfer event between SIGs they manage", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI, Sigs.QuantSig]);

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/ai-event",
        payload: { organiser: Sigs.QuantSig },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().organiser).toBe(Sigs.QuantSig);
    });
  });

  describe("SIG Executive - DELETE /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values([
        {
          id: "ai-delete",
          title: "AI Delete",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.EdinburghAI,
          date: futureDate(),
        },
        {
          id: "quant-delete",
          title: "Quant Delete",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: futureDate(),
        },
      ]);
    });

    it("should allow sig_executive to delete event for their SIG", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/ai-delete",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe("ai-delete");
    });

    it("should forbid sig_executive from deleting event for SIG they don't manage", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI]);

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/quant-delete",
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
