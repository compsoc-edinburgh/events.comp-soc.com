import { eq, sql } from "drizzle-orm";
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

      await db.insert(eventsTable).values([
        {
          id: "published-event",
          title: "Published Event",
          state: "published",
          aboutMarkdown: "markdown",
          organiser: "projectShare",
          date: new Date(),
          capacity: null,
        },
        {
          id: "draft-event",
          title: "Draft Event",
          state: "draft",
          aboutMarkdown: "markdown",
          organiser: "projectShare",
          date: new Date(),
          capacity: null,
        },
        {
          id: "limited-event",
          title: "Limited Event",
          state: "published",
          aboutMarkdown: "markdown",
          organiser: "projectShare",
          date: new Date(),
          capacity: 2,
        },
      ]);
    });

    it("should register user with pending status regardless of capacity", async () => {
      await db.insert(usersTable).values([
        { id: "user-1", email: "user1@example.com", firstName: "U", lastName: "1" },
        { id: "user-2", email: "user2@example.com", firstName: "U", lastName: "2" },
      ]);

      await db.insert(registrationsTable).values([
        { userId: "user-1", eventId: "limited-event", status: "accepted" },
        { userId: "user-2", eventId: "limited-event", status: "accepted" },
      ]);

      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/limited-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(201);
      const data = response.json();

      expect(data.status).toBe("pending");
      expect(data.userId).toBe("test-user");
    });

    it("should return 409 if user is already registered", async () => {
      await db.insert(registrationsTable).values({
        userId: "test-user",
        eventId: "published-event",
        status: "pending",
      });

      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/published-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(409);
    });

    it("should return 404 if regular user tries to register to draft event", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/draft-event/registrations",
        payload: {},
      });

      expect(response.statusCode).toBe(404);
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
        organiser: "projectShare",
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
        sessionClaims: { metadata: { role: "member" } },
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

  describe("GET /v1/events/:eventId/registrations", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values([
        { id: "user-1", email: "u1@ex.com", firstName: "U", lastName: "1" },
        { id: "user-2", email: "u2@ex.com", firstName: "U", lastName: "2" },
      ]);

      await db.insert(eventsTable).values({
        id: "test-event",
        title: "Test Event",
        state: "published",
        aboutMarkdown: "markdown",
        organiser: "projectShare",
        date: new Date(),
      });

      await db.insert(registrationsTable).values([
        { userId: "user-1", eventId: "test-event", status: "accepted" },
        { userId: "user-2", eventId: "test-event", status: "pending" },
      ]);
    });

    it("should filter registrations by status query param", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/test-event/registrations",
        query: { status: "accepted" },
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(1);
      expect(data[0].userId).toBe("user-1");
      expect(data[0].status).toBe("accepted");
    });

    it("should filter registrations by userId query param", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/test-event/registrations",
        query: { userId: "user-2" },
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(1);
      expect(data[0].userId).toBe("user-2");
    });

    it("should return empty array if event has no registrations", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      await db.insert(eventsTable).values({
        id: "empty-event",
        title: "Empty Event",
        state: "published",
        aboutMarkdown: "md",
        organiser: "projectShare",
        date: new Date(),
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/empty-event/registrations",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
    });
  });

  describe("GET /v1/events/:eventId/registrations/me", () => {
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
        organiser: "projectShare",
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
        method: "GET",
        url: "/v1/events/test-event/registrations/me",
      });

      expect(response.statusCode).toBe(401);
    });

    it("should allow a user to fetch their own registration", async () => {
      setMockAuth({
        userId: "test-user",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/test-event/registrations/me",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data.userId).toBe("test-user");
      expect(data.eventId).toBe("test-event");
    });
  });

  describe("POST /v1/events/:eventId/registrations/batch-accept", () => {
    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: "batch-event",
        title: "Batch Event",
        state: "published",
        capacity: 2,
        aboutMarkdown: "md",
        organiser: "projectShare",
        date: new Date(),
      });

      await db.insert(usersTable).values([
        { id: "p1", email: "p1@ex.com", firstName: "P1", lastName: "U" },
        { id: "p2", email: "p2@ex.com", firstName: "P2", lastName: "U" },
        { id: "p3", email: "p3@ex.com", firstName: "P3", lastName: "U" },
      ]);

      await db.insert(registrationsTable).values([
        {
          userId: "p1",
          eventId: "batch-event",
          status: "pending",
          createdAt: new Date(Date.now() - 3000),
        },
        {
          userId: "p2",
          eventId: "batch-event",
          status: "pending",
          createdAt: new Date(Date.now() - 2000),
        },
        {
          userId: "p3",
          eventId: "batch-event",
          status: "pending",
          createdAt: new Date(Date.now() - 1000),
        },
      ]);
    });

    it("should allow committee to auto-fill to capacity", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/batch-event/registrations/batch-accept",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ acceptedCount: 2 });

      const accepted = await db
        .select()
        .from(registrationsTable)
        .where(eq(registrationsTable.status, "accepted"));
      expect(accepted).toHaveLength(2);
      const acceptedIds = accepted.map((a) => a.userId);
      expect(acceptedIds).toContain("p1");
      expect(acceptedIds).toContain("p2");
      expect(acceptedIds).not.toContain("p3");
    });

    it("should return 401/403 for non-committee users", async () => {
      setMockAuth({
        userId: "p1",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/events/batch-event/registrations/batch-accept",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /v1/events/:eventId/registrations/analytics", () => {
    const analyticsEventId = "analytics-event";

    beforeEach(async () => {
      await db.insert(eventsTable).values({
        id: analyticsEventId,
        title: "Analytics Test Event",
        state: "published",
        date: new Date(),
        organiser: "projectShare",
        aboutMarkdown: "md",
        form: [
          {
            id: "size-field",
            type: "select",
            label: "T-Shirt Size",
            required: true,
            options: ["Small", "Medium", "Large"],
          },
          {
            id: "diet-field",
            type: "select",
            label: "Dietary",
            required: true,
            options: ["None", "Vegan"],
          },
          {
            id: "input-field",
            type: "input",
            label: "Name",
            required: true,
          },
        ],
      });

      await db.insert(usersTable).values([
        { id: "u1", email: "u1@test.com", firstName: "A", lastName: "A" },
        { id: "u2", email: "u2@test.com", firstName: "B", lastName: "B" },
        { id: "u3", email: "u3@test.com", firstName: "C", lastName: "C" },
      ]);

      const today = new Date();
      const yesterday = new Date(Date.now() - 86400000);

      await db.insert(registrationsTable).values([
        {
          userId: "u1",
          eventId: analyticsEventId,
          status: "accepted",
          createdAt: today,
          answers: { "size-field": "Medium", "diet-field": "Vegan" },
        },
        {
          userId: "u2",
          eventId: analyticsEventId,
          status: "accepted",
          createdAt: today,
          answers: { "size-field": "Medium", "diet-field": "None" },
        },
        {
          userId: "u3",
          eventId: analyticsEventId,
          status: "pending",
          createdAt: yesterday,
          answers: { "size-field": "Small", "diet-field": "None" },
        },
      ]);
    });

    it("should return correct aggregated data for committee members", async () => {
      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: `/v1/events/${analyticsEventId}/registrations/analytics`,
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();

      expect(data.totalCount).toBe(3);
      expect(data.countByStatus).toEqual({
        accepted: 2,
        pending: 1,
      });

      const dateKeys = Object.keys(data.countByDate);
      expect(dateKeys.length).toBeGreaterThanOrEqual(2);

      const sizeAnalytics = data.countByAnswers["size-field"];
      expect(sizeAnalytics.label).toBe("T-Shirt Size");

      type DataOption = {
        option: string;
        count: number;
      };

      const mediumCount = sizeAnalytics.data.find((d: DataOption) => d.option === "Medium").count;
      const smallCount = sizeAnalytics.data.find((d: DataOption) => d.option === "Small").count;
      const largeCount = sizeAnalytics.data.find((d: DataOption) => d.option === "Large").count;

      expect(mediumCount).toBe(2);
      expect(smallCount).toBe(1);
      expect(largeCount).toBe(0);

      const dietAnalytics = data.countByAnswers["diet-field"];
      expect(dietAnalytics.data.find((d: DataOption) => d.option === "Vegan").count).toBe(1);
      expect(dietAnalytics.data.find((d: DataOption) => d.option === "None").count).toBe(2);
    });

    it("should initialize zero-counts for events with no registrations", async () => {
      await db.insert(eventsTable).values({
        id: "empty-event",
        title: "Empty",
        state: "published",
        date: new Date(),
        organiser: "p",
        aboutMarkdown: "",
        form: [{ id: "sel", type: "select", label: "Sel", options: ["A", "B"], required: false }],
      });

      setMockAuth({
        userId: "committee-user",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/events/empty-event/registrations/analytics",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();

      expect(data.totalCount).toBe(0);
      expect(data.countByStatus).toEqual({});
      // Ensure the chart data structure is still built from the schema
      expect(data.countByAnswers["sel"].data[0].count).toBe(0);
    });

    it("should return 401 for non-committee members", async () => {
      setMockAuth({
        userId: "u1", // Regular user
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: `/v1/events/${analyticsEventId}/registrations/analytics`,
      });

      expect(response.statusCode).toBe(401);
    });

    it("should return 401 for unauthenticated users", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "GET",
        url: `/v1/events/${analyticsEventId}/registrations/analytics`,
      });

      expect(response.statusCode).toBe(401);
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
        organiser: "projectShare",
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
        sessionClaims: { metadata: { role: "member" } },
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
        sessionClaims: { metadata: { role: "member" } },
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
        organiser: "projectShare",
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
        sessionClaims: { metadata: { role: "member" } },
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
