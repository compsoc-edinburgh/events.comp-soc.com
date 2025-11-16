import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import type { FastifyInstance } from "fastify";
import { App } from "../tests/setup";

import { Sigs, UserRole } from "@monorepo/types/const";
import { EventMapper } from "../mappers/event.mapper";

let app: FastifyInstance;

const baseEventData = {
  organizerSig: Sigs.TypeSig,
  hero: {
    title: "vite-test: Test-Event",
    tags: ["Math", "Lean"]
  },
  registration: {
    enabled: true,
    title: "Join us",
    description: "desc",
    buttonText: "Register"
  },
  aboutMarkdown: "## About Event",
  location: {
    name: "Forum",
    description: "Main hall",
    mapUrl: "https://maps.test",
    mapTitle: "Event Location"
  },
  date: "2025-11-20",
  time: { start: "18:00", end: "20:00" }
};

describe("Events API", () => {
  beforeAll(async () => {
    app = await App();
  });

  afterAll(async () => {
    await app.prisma.user.deleteMany({ where: { id: "test-user" } });
    await app.prisma.event.deleteMany({
      where: { heroTitle: "vite-test: Test-Event" }
    });
    await app.prisma.event.deleteMany({
      where: { heroTitle: "vite-test: Updated Event" }
    });

    await app.prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await app.prisma.user.deleteMany({ where: { id: "test-user" } });

    await app.prisma.user.create({
      data: {
        id: "test-user",
        email: "test@user.com",
        firstName: "Test",
        lastName: "User",
        role: UserRole.Committee
      }
    });
  });

  describe("GET /v1/events", () => {
    it("returns empty list initially", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/events"
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });
  });

  describe("POST /v1/events", () => {
    it("creates an event", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: baseEventData
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toMatchObject({
        hero: { title: baseEventData.hero.title }
      });
    });

    it("returns 400 for invalid body", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/v1/events",
        payload: {}
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /v1/events/:id", () => {
    it("gets existing event", async () => {
      const created = await app.prisma.event.create({
        data: EventMapper.toDB(baseEventData)
      });

      const res = await app.inject({
        method: "GET",
        url: `/v1/events/${created.id}`
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject({
        hero: { title: baseEventData.hero.title }
      });
    });

    it("returns 404 if not found", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/v1/events/not-found"
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH /v1/events/:id", () => {
    it("updates an event", async () => {
      const created = await app.prisma.event.create({
        data: EventMapper.toDB(baseEventData)
      });

      const res = await app.inject({
        method: "PATCH",
        url: `/v1/events/${created.id}`,
        payload: {
          ...baseEventData,
          hero: { title: "vite-test: Updated Event", tags: ["Updated"] }
        }
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().hero.title).toBe("vite-test: Updated Event");
    });

    it("returns 404 if event does not exist", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/v1/events/does-not-exist",
        payload: baseEventData
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /v1/events/:id", () => {
    it("deletes an event", async () => {
      const created = await app.prisma.event.create({
        data: EventMapper.toDB(baseEventData)
      });

      const res = await app.inject({
        method: "DELETE",
        url: `/v1/events/${created.id}`
      });

      expect(res.statusCode).toBe(204);
    });

    it("returns 404 deleting non-existing event", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/v1/events/does-not-exist"
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
