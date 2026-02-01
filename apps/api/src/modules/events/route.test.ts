import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeMockAuthState,
  setMockAuth,
  setSigExecutiveAuth,
  setMemberAuth,
} from "../../../tests/mock-auth.js";
import { FastifyInstance } from "fastify";
import { buildServer } from "../../server.js";
import { db } from "../../db/db.js";
import { sql, eq } from "drizzle-orm";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import type { CreateEventRequest, UpdateEventRequest } from "@events.comp-soc.com/shared";
import { Sigs } from "@events.comp-soc.com/shared";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

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
    await db.execute(sql`TRUNCATE TABLE ${usersTable} CASCADE`);
  });

  describe("GET /v1/events", () => {
    beforeEach(async () => {
      const baseEvent = {
        aboutMarkdown: "md",
        organiser: "projectShare",
        date: new Date(),
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

    it("should return ONLY published events for regular members", async () => {
      setMockAuth({ userId: "mem_1", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      expect(response.statusCode).toBe(200);
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

    it("should support pagination (limit/page)", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      // Page 1, Limit 2
      const res1 = await app.inject({
        method: "GET",
        url: "/v1/events?page=1&limit=2",
      });
      expect(res1.json()).toHaveLength(2);

      // Page 3, Limit 2 (Should have 1 item left: 5 total)
      const res2 = await app.inject({
        method: "GET",
        url: "/v1/events?page=3&limit=2",
      });
      expect(res2.json()).toHaveLength(1);
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
          date: new Date(),
        },
        {
          id: "public-event",
          title: "Public",
          state: "published",
          aboutMarkdown: "md",
          organiser: "soc",
          date: new Date(),
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

    it("should return 404 if event does not exist", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/non-existent",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /v1/events", () => {
    const validPayload: CreateEventRequest = {
      title: "Hackathon 2025",
      organiser: "projectShare",
      state: "draft",
      priority: "default",
      capacity: 150,
      date: new Date().toISOString(),
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

    it("should fail (400) if date is invalid", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: { ...validPayload, date: "invalid-date-string" },
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
        date: new Date(),
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

    it("should return 404 if updating non-existent event", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/ghost-event",
        payload: { title: "Ghost" },
      });

      expect(response.statusCode).toBe(403);
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
        date: new Date(),
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

    it("should CASCADE delete: deleting event must delete associated registrations", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });
      await db
        .insert(usersTable)
        .values({ id: "u2", firstName: "A", lastName: "B", email: "u2@gmail.com" });

      await db.insert(registrationsTable).values({
        userId: "u2",
        eventId: eventId,
        status: "accepted",
      });

      const response = await app.inject({
        method: "DELETE",
        url: `/v1/events/${eventId}`,
      });

      expect(response.statusCode).toBe(200);

      const regs = await db
        .select()
        .from(registrationsTable)
        .where(eq(registrationsTable.eventId, eventId));
      expect(regs).toHaveLength(0);
    });
  });

  describe("SIG Executive - GET /v1/events", () => {
    beforeEach(async () => {
      const baseEvent = {
        aboutMarkdown: "md",
        date: new Date(),
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

    it("should return draft events for multiple assigned SIGs", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI, Sigs.QuantSig]);

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();

      // Should see: all published (3) + AI draft (1) + Quant draft (1) = 5
      expect(data).toHaveLength(5);

      const ids = data.map((e: { id: string }) => e.id);
      expect(ids).toContain("ai-draft");
      expect(ids).toContain("quant-draft");
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
          date: new Date(),
        },
        {
          id: "quant-draft-event",
          title: "Quant Draft",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: new Date(),
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
      date: new Date().toISOString(),
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

    it("should forbid sig_executive from creating CompSoc events", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI, Sigs.QuantSig]);

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: { ...validPayload, organiser: Sigs.Compsoc },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should allow sig_executive with multiple SIGs to create events for any of them", async () => {
      setSigExecutiveAuth("sig-exec", [Sigs.EdinburghAI, Sigs.QuantSig]);

      const response1 = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: { ...validPayload, organiser: Sigs.EdinburghAI },
      });
      expect(response1.statusCode).toBe(201);

      const response2 = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: { ...validPayload, organiser: Sigs.QuantSig },
      });
      expect(response2.statusCode).toBe(201);
    });

    it("should forbid regular members from creating events", async () => {
      setMemberAuth("member");

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validPayload,
      });

      expect(response.statusCode).toBe(401);
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
          date: new Date(),
        },
        {
          id: "quant-event",
          title: "Quant Event",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: new Date(),
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
          date: new Date(),
        },
        {
          id: "quant-delete",
          title: "Quant Delete",
          state: "draft",
          aboutMarkdown: "md",
          organiser: Sigs.QuantSig,
          date: new Date(),
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
