import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from "vitest";
import { FastifyInstance } from "fastify";
import { activeMockAuthState, setMockAuth } from "../../../tests/mock-auth.js";
import { buildServer } from "../../server.js";
import { db } from "../../db/db.js";
import { sql, eq } from "drizzle-orm";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

describe("User", () => {
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

  describe("GET /v1/users/:id", () => {
    const targetUser = {
      id: "target_user_123",
      firstName: "Target",
      lastName: "User",
      email: "private@email.com",
    };

    beforeEach(async () => {
      await db.insert(usersTable).values(targetUser);
    });

    it("should return 404 if user does not exist", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/non_existent_id",
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        message: "User with non_existent_id not found",
        statusCode: 404,
      });
    });

    it("should allow a user to see their own full profile (including email)", async () => {
      setMockAuth({
        userId: targetUser.id,
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: `/v1/users/${targetUser.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        expect.objectContaining({
          id: targetUser.id,
          firstName: targetUser.firstName,
          email: targetUser.email, // Email should be visible
        })
      );
    });

    it("should allow committee members to see any user's full profile", async () => {
      setMockAuth({
        userId: "committee_admin",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: `/v1/users/${targetUser.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().email).toBe(targetUser.email);
    });

    it("should return public profile (redacted email) when viewing another user", async () => {
      setMockAuth({
        userId: "random_stranger",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "GET",
        url: `/v1/users/${targetUser.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body.firstName).toBe(targetUser.firstName);
      expect(body.email).toBeUndefined(); // Crucial check
      expect(body).not.toHaveProperty("email");
    });
  });

  describe("POST /v1/users", () => {
    const newUserPayload = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    };

    it("should create a new user and persist to DB", async () => {
      const authId = "auth_user_123";
      setMockAuth({
        userId: authId,
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: newUserPayload,
      });

      expect(response.statusCode).toBe(201);
      const responseBody = response.json();
      expect(responseBody.id).toBe(authId);

      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, authId));
      expect(dbUser).toBeDefined();
      expect(dbUser.email).toBe(newUserPayload.email);
      expect(dbUser.role).toBe("member");
    });

    it("should reject invalid email formats with 400", async () => {
      setMockAuth({ userId: "user_x", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { ...newUserPayload, email: "not-an-email" },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject missing required fields (lastName)", async () => {
      setMockAuth({ userId: "user_y", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { firstName: "John", email: "john@test.com" },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should ignore attempts to set protected fields (like role) via payload", async () => {
      const authId = "hacker_1";
      setMockAuth({ userId: authId, sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: {
          ...newUserPayload,
          role: "committee",
        },
      });

      expect(response.statusCode).toBe(201);

      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, authId));
      expect(dbUser.role).toBe("member");
    });
  });

  describe("PUT /v1/users/:id", () => {
    const existingUser = {
      id: "user_update_test",
      firstName: "Original",
      lastName: "Name",
      email: "original@test.com",
    };

    beforeEach(async () => {
      await db.insert(usersTable).values(existingUser);
    });

    it("should allow user to update their own profile", async () => {
      setMockAuth({ userId: existingUser.id, sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "PUT",
        url: `/v1/users/${existingUser.id}`,
        payload: { firstName: "Updated" },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().firstName).toBe("Updated");

      // Verify DB change
      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, existingUser.id));
      expect(dbUser.firstName).toBe("Updated");
      expect(dbUser.lastName).toBe("Name"); // Should remain unchanged
    });

    it("should forbid regular users from updating others (403)", async () => {
      setMockAuth({ userId: "other_user", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "PUT",
        url: `/v1/users/${existingUser.id}`,
        payload: { firstName: "Hacked" },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should allow committee to update any user", async () => {
      setMockAuth({ userId: "admin_user", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "PUT",
        url: `/v1/users/${existingUser.id}`,
        payload: { lastName: "AdminEdited" },
      });

      expect(response.statusCode).toBe(200);

      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, existingUser.id));
      expect(dbUser.lastName).toBe("AdminEdited");
    });

    it("should return 404 when updating non-existent user", async () => {
      setMockAuth({ userId: "admin_user", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/users/ghost_user",
        payload: { firstName: "Casper" },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /v1/users/:id", () => {
    const userToDelete = {
      id: "delete_target",
      firstName: "Temp",
      lastName: "User",
      email: "temp@test.com",
    };

    beforeEach(async () => {
      await db.insert(usersTable).values(userToDelete);
    });

    it("should allow user to delete their own account", async () => {
      setMockAuth({ userId: userToDelete.id, sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "DELETE",
        url: `/v1/users/${userToDelete.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe(userToDelete.id);

      // Verify DB deletion
      const users = await db.select().from(usersTable).where(eq(usersTable.id, userToDelete.id));
      expect(users).toHaveLength(0);
    });

    it("should forbid regular user from deleting others", async () => {
      setMockAuth({ userId: "other_guy", sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "DELETE",
        url: `/v1/users/${userToDelete.id}`,
      });

      expect(response.statusCode).toBe(403);

      // Verify NOT deleted
      const users = await db.select().from(usersTable).where(eq(usersTable.id, userToDelete.id));
      expect(users).toHaveLength(1);
    });

    it("should allow committee to force delete a user", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "DELETE",
        url: `/v1/users/${userToDelete.id}`,
      });

      expect(response.statusCode).toBe(200);

      const users = await db.select().from(usersTable).where(eq(usersTable.id, userToDelete.id));
      expect(users).toHaveLength(0);
    });

    it("should return 404 if deleting non-existent user", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      const response = await app.inject({
        method: "DELETE",
        url: "/v1/users/already_gone",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /v1/users/registrations", () => {
    const activeUserId = "active_user_1";

    beforeEach(async () => {
      await db.insert(usersTable).values({
        id: activeUserId,
        firstName: "Active",
        lastName: "User",
        email: "active@example.com",
      });

      await db.insert(eventsTable).values([
        {
          id: "ev_1",
          title: "Hackathon 2024",
          state: "published",
          aboutMarkdown: "md",
          organiser: "soc",
          date: new Date(),
        },
      ]);
    });

    it("should return 204 No Content if user has no registrations", async () => {
      setMockAuth({ userId: activeUserId, sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/registrations",
      });

      expect(response.statusCode).toBe(204);
      expect(response.body).toBe("");
    });

    it("should return list of registrations with joined event details", async () => {
      // Create a registration
      await db.insert(registrationsTable).values({
        userId: activeUserId,
        eventId: "ev_1",
        status: "accepted",
      });

      setMockAuth({ userId: activeUserId, sessionClaims: { metadata: { role: "member" } } });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/registrations",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();

      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        userId: activeUserId,
        eventId: "ev_1",
        status: "accepted",
        eventTitle: "Hackathon 2024",
      });
    });

    it("should fail with 401 if unauthenticated", async () => {
      setMockAuth({ userId: null, sessionClaims: null });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/registrations",
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
