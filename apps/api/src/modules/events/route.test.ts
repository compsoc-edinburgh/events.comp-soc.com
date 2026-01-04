import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { activeMockAuthState, setMockAuth } from "../../lib/mock-auth.js";
import { FastifyInstance } from "fastify";
import { buildServer } from "../../server.js";
import { db } from "../../db/db.js";
import { sql } from "drizzle-orm";
import { eventsTable } from "../../db/schema.js";
import type { CreateEventRequest } from "@events.comp-soc.com/shared";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

describe("Event route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.execute(sql`TRUNCATE TABLE ${eventsTable} CASCADE`);
  });

  describe("GET /v1/events", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: "draft-event",
        title: "Draft event",
        state: "draft",
        aboutMarkdown: "markdown",
        organiser: "projectShare",
        date: new Date(),
      });

      await db.insert(eventsTable).values({
        id: "published-event",
        title: "Published event",
        state: "published",
        aboutMarkdown: "markdown",
        organiser: "projectShare",
        date: new Date(),
      });
    });

    it("Committee member can see all events", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: {
          metadata: { role: "committee" },
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      const data = response.json();
      expect(response.statusCode).toBe(200);

      expect(data).toHaveLength(2);
    });

    it("Regular user can only see published events", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
      });

      const data = response.json();
      expect(response.statusCode).toBe(200);

      expect(data).toHaveLength(1);
      expect(data[0].state).toBe("published");
    });

    it("should return 404 for draft event if accessed by regular user", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/draft-event",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("Event list pagination", () => {
    beforeEach(async () => {
      const events = Array.from({ length: 5 }).map((_, i) => ({
        id: `event-${i + 1}`,
        title: `Event ${i + 1}`,
        state: "published" as const,
        aboutMarkdown: "markdown",
        organiser: "projectShare",
        date: new Date(2025, 0, i + 1),
      }));

      await db.insert(eventsTable).values(events);
    });

    it("should return the first page with correct limit", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
        query: { page: "1", limit: "2" },
      });

      const data = response.json();
      expect(response.statusCode).toBe(200);
      expect(data).toHaveLength(2);

      expect(data[0].id).toBe("event-5");
      expect(data[1].id).toBe("event-4");
    });

    it("should return the second page correctly", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
        query: { page: "2", limit: "2" },
      });

      const data = response.json();
      expect(response.statusCode).toBe(200);
      expect(data).toHaveLength(2);

      expect(data[0].id).toBe("event-3");
      expect(data[1].id).toBe("event-2");
    });

    it("should return an empty array if page is out of bounds", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/v1/events",
        query: { page: "10", limit: "2" },
      });

      const data = response.json();
      expect(data).toHaveLength(0);
    });
  });

  describe("POST /v1/events", () => {
    const validEventData: CreateEventRequest = {
      title: "New Event",
      organiser: "evp",
      state: "published",
      priority: "default",
      capacity: 100,
      date: new Date().toISOString(),
      aboutMarkdown: "Event description",
      location: "Main Hall",
      locationURL: null,
      form: [],
    };

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validEventData,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should return 403 if user is not a committee member", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validEventData,
      });

      expect(response.statusCode).toBe(403);
    });

    it("should create event when user is committee member", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: validEventData,
      });

      expect(response.statusCode).toBe(201);

      const data = response.json();
      expect(data.title).toBe(validEventData.title);
      expect(data.organiser).toBe(validEventData.organiser);
      expect(data.id).toBeDefined();
    });

    it("should return 400 for invalid parameters", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: {
          title: "",
          organiser: "projectShare",
          date: "not-a-date",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 400 when required fields are missing", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: {
          title: "Event without organizer",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: "existing-event",
        title: "Existing Event",
        state: "draft",
        aboutMarkdown: "Original description",
        organiser: "projectShare",
        date: new Date(),
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/existing-event",
        payload: { title: "Updated Title" },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should return 403 if user is not a committee member", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/existing-event",
        payload: { title: "Updated Title" },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should update event when user is committee member", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/existing-event",
        payload: {
          title: "Updated Event Title",
          aboutMarkdown: "Updated description",
        },
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.title).toBe("Updated Event Title");
      expect(data.aboutMarkdown).toBe("Updated description");
      expect(data.id).toBe("existing-event");
    });

    it("should return 404 when updating non-existing event", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/non-existing-event",
        payload: { title: "Updated Title" },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /v1/events/:id", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: "event-to-delete",
        title: "Event To Delete",
        state: "draft",
        aboutMarkdown: "Will be deleted",
        organiser: "projectShare",
        date: new Date(),
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/event-to-delete",
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should return 403 if user is not a committee member", async () => {
      setMockAuth({
        userId: "regular-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/event-to-delete",
      });

      expect(response.statusCode).toBe(403);
    });

    it("should delete event when user is committee member", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/event-to-delete",
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.id).toBe("event-to-delete");

      const checkResponse = await app.inject({
        method: "GET",
        url: "/v1/events/event-to-delete",
      });
      expect(checkResponse.statusCode).toBe(404);
    });

    it("should return 404 when deleting non-existing event", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/non-existing-event",
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
