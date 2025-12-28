import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from "vitest";
import { FastifyInstance } from "fastify";
import { buildServer } from "#server";
import { db } from "#db/db";
import { sql } from "drizzle-orm";
import { usersTable } from "#db/schema";
import { activeMockAuthState, setMockAuth } from "#lib/mock-auth";

vi.mock("@clerk/fastify", () => {
  return {
    getAuth: vi.fn(() => activeMockAuthState),
    clerkPlugin: async () => {},
  };
});

describe("User route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await db.execute(sql`TRUNCATE TABLE ${usersTable} CASCADE`);
  });

  describe("GET /v1/users/:id", () => {
    beforeEach(async () => {
      await db.insert(usersTable).values({
        id: "target_user_123",
        firstName: "Target",
        lastName: "User",
        email: "private@email.com",
      });
    });

    it("should allow a user to see their own email", async () => {
      setMockAuth({
        userId: "target_user_123",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/target_user_123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().email).toBe("private@email.com");
    });

    it("should allow committee to see any user's email", async () => {
      setMockAuth({
        userId: "committee_admin",
        sessionClaims: { metadata: { role: "committee" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/target_user_123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().email).toBe("private@email.com");
    });

    it("should HIDE email if a regular user fetches someone else", async () => {
      setMockAuth({
        userId: "different_user",
        sessionClaims: { metadata: { role: "user" } },
      });

      const response = await app.inject({
        method: "GET",
        url: "/v1/users/target_user_123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().email).toBeUndefined();
      expect(response.json().firstName).toBe("Target");
    });
  });

  describe("POST /v1/users", () => {
    it("should get unauthorised if user is not logged in", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { firstName: "Test", lastName: "User", email: "test@example.com" },
      });
      expect(response.statusCode).toBe(401);
    });

    it("should create user if logged in and IDs match", async () => {
      setMockAuth({
        userId: "user_123",
        sessionClaims: { metadata: { role: "member" } },
      });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { id: "user_123", firstName: "John", lastName: "Doe", email: "john@example.com" },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().id).toBe("user_123");
    });

    it("should fail with 400 if email is invalid", async () => {
      setMockAuth({ userId: "user_123", sessionClaims: {} });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { id: "user_123", email: "not-an-email" },
      });
      expect(response.statusCode).toBe(400);
    });

    it("should fail with 403 if body ID doesn't match token ID", async () => {
      setMockAuth({ userId: "real_id", sessionClaims: {} });

      const response = await app.inject({
        method: "POST",
        url: "/v1/users",
        payload: { id: "fake_id", firstName: "John", lastName: "Doe", email: "j@b.com" },
      });
      expect(response.statusCode).toBe(403);
    });
  });

  describe("PUT /v1/users/:id", () => {
    it("should fail if missing role", async () => {
      setMockAuth({ userId: "user_123", sessionClaims: { metadata: { role: null } } });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/users/user_123",
        payload: { firstName: "Updated" },
      });
      expect(response.statusCode).toBe(401);
    });

    it("should fail if a regular user tries to update someone else", async () => {
      setMockAuth({ userId: "user_123", sessionClaims: { metadata: { role: "user" } } });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/users/user_999",
        payload: { firstName: "Hacked" },
      });

      expect(response.statusCode).toBe(403);
    });

    it("should allow committee to update a different user", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      await db
        .insert(usersTable)
        .values({ id: "user_1", firstName: "Old", lastName: "N", email: "e@e.com" });

      const response = await app.inject({
        method: "PUT",
        url: "/v1/users/user_1",
        payload: { firstName: "New" },
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /v1/users/:id", () => {
    it("should allow a user to delete their own account", async () => {
      const userId = "delete_me";
      setMockAuth({ userId, sessionClaims: { metadata: { role: "user" } } });

      await db
        .insert(usersTable)
        .values({ id: userId, firstName: "X", lastName: "Y", email: "x@y.com" });

      const response = await app.inject({ method: "DELETE", url: `/v1/users/${userId}` });
      expect(response.statusCode).toBe(200);

      const users = await db.select().from(usersTable);
      expect(users).toHaveLength(0);
    });

    it("should allow committee to delete any user", async () => {
      setMockAuth({ userId: "admin", sessionClaims: { metadata: { role: "committee" } } });

      await db
        .insert(usersTable)
        .values({ id: "bad_user", firstName: "B", lastName: "A", email: "b@a.com" });

      const response = await app.inject({ method: "DELETE", url: "/v1/users/bad_user" });
      expect(response.statusCode).toBe(200);
    });
  });
});
