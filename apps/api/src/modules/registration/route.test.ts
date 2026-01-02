import { sql } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "../../db/db.js";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import { buildServer } from "../../server.js";
import { activeMockAuthState, setMockAuth } from "../../lib/mock-auth.js";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

describe("Registration route", () => {
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

  describe("POST /v1/events/:eventId/registrations", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values({
        id: "test-user",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });

      await db.insert(eventsTable).values({
        id: "published-event",
        title: "Published Event",
        state: "published",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
        capacity: null,
      });

      await db.insert(eventsTable).values({
        id: "draft-event",
        title: "Draft Event",
        state: "draft",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
        capacity: null,
      });

      await db.insert(eventsTable).values({
        id: "limited-event",
        title: "Limited Event",
        state: "published",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
        capacity: 2,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/published-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should return 404 if event does not exist", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/non-existing-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 404 if regular user tries to register to draft event", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/draft-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(404);
    });

    it("should register user with pending status when capacity is null", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/published-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(201);

      const data = response.json();
      expect(data.userId).toBe("test-user");
      expect(data.eventId).toBe("published-event");
      expect(data.status).toBe("pending");
    });

    it("should register user with pending status when capacity allows", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/limited-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(201);

      const data = response.json();
      expect(data.status).toBe("pending");
    });

    it("should register user with waitlist status when capacity is full", async () => {
      await db.insert(usersTable).values([
        { id: "user-1", email: "user1@example.com", firstName: "User", lastName: "One" },
        { id: "user-2", email: "user2@example.com", firstName: "User", lastName: "Two" },
      ]);

      await db.insert(registrationsTable).values([
        { userId: "user-1", eventId: "limited-event", status: "pending" },
        { userId: "user-2", eventId: "limited-event", status: "pending" },
      ]);

      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/limited-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(201);

      const data = response.json();
      expect(data.status).toBe("waitlist");
    });
  });

  describe("PUT /v1/events/:eventId/registrations/:targetUserId", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values([
        { id: "test-user", email: "test@example.com", firstName: "Test", lastName: "User" },
        { id: "other-user", email: "other@example.com", firstName: "Other", lastName: "User" },
      ]);

      await db.insert(eventsTable).values({
        id: "test-event",
        title: "Test Event",
        state: "published",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
        capacity: 2,
      });

      await db.insert(registrationsTable).values({
        userId: "test-user",
        eventId: "test-event",
        status: "pending",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/test-event/registrations/test-user",
        payload: { status: "accepted" },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should return 403 if non-committee tries to update registration", async () => {
      setMockAuth({
        userId: "other-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/test-event/registrations/test-user",
        payload: { status: "accepted" },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should allow committee to update registration status to accepted", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/test-event/registrations/test-user",
        payload: { status: "accepted" },
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.status).toBe("accepted");
    });

    it("should return 409 if accepting registration would exceed capacity", async () => {
      await db.insert(usersTable).values([
        { id: "user-1", email: "user1@example.com", firstName: "User", lastName: "One" },
        { id: "user-2", email: "user2@example.com", firstName: "User", lastName: "Two" },
      ]);

      await db.insert(registrationsTable).values([
        { userId: "user-1", eventId: "test-event", status: "accepted" },
        { userId: "user-2", eventId: "test-event", status: "accepted" },
      ]);

      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/test-event/registrations/test-user",
        payload: { status: "accepted" },
      });

      expect(response.statusCode).toBe(409);
    });

    it("should return 404 if registration does not exist", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/events/test-event/registrations/non-existing-user",
        payload: { status: "accepted" },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /v1/events/:eventId/registrations/:targetUserId", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values([
        { id: "test-user", email: "test@example.com", firstName: "Test", lastName: "User" },
        { id: "other-user", email: "other@example.com", firstName: "Other", lastName: "User" },
      ]);

      await db.insert(eventsTable).values({
        id: "test-event",
        title: "Test Event",
        state: "published",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
      });

      await db.insert(registrationsTable).values({
        userId: "test-user",
        eventId: "test-event",
        status: "pending",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations/test-user",
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: "Unauthorised" });
    });

    it("should allow committee to delete any registration", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations/test-user",
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.userId).toBe("test-user");
      expect(data.eventId).toBe("test-event");
    });

    it("should allow user to delete their own registration", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations/test-user",
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.userId).toBe("test-user");
    });

    it("should return 403 if user tries to delete another user's registration", async () => {
      setMockAuth({
        userId: "other-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations/test-user",
      });

      expect(response.statusCode).toBe(403);
    });

    it("should return 404 if registration does not exist", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations/non-existing-user",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /v1/events/:eventId/registrations (self)", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values({
        id: "test-user",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });

      await db.insert(eventsTable).values({
        id: "test-event",
        title: "Test Event",
        state: "published",
        aboutMarkdown: "markdown",
        organizer: "projectShare",
        date: new Date(),
      });

      await db.insert(registrationsTable).values({
        userId: "test-user",
        eventId: "test-event",
        status: "pending",
      });
    });

    it("should allow user to delete their own registration via self endpoint", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/events/test-event/registrations",
      });

      expect(response.statusCode).toBe(200);

      const data = response.json();
      expect(data.userId).toBe("test-user");
      expect(data.eventId).toBe("test-event");
    });
  });
});
