import { describe, it, expect } from "vitest";
import { EventMapper } from "./event.mapper";
import type { Event as PrismaEvent } from "../../generated/prisma/client";
import type { z } from "zod";
import { EventUpdateSchema } from "@monorepo/types/schemas";

describe("EventMapper", () => {
  describe("toDB", () => {
    it("should map event input to database format", () => {
      const input: z.infer<typeof EventUpdateSchema> = {
        organizerSig: "edinburghAI",
        hero: {
          title: "AI Workshop",
          tags: ["AI", "Machine Learning"]
        },
        registration: {
          enabled: true,
          title: "Register Now",
          description: "Join us for an exciting workshop",
          buttonText: "Sign Up"
        },
        aboutMarkdown: "# About\nThis is a great event!",
        location: {
          name: "Room 101",
          description: "Second floor",
          mapUrl: "https://maps.example.com",
          mapTitle: "Campus Map"
        },
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        form: undefined
      };

      const result = EventMapper.toDB(input);

      expect(result).toEqual({
        organizerSig: "edinburghAI",
        heroTitle: "AI Workshop",
        heroTagsCsv: "AI,Machine Learning",
        regEnabled: true,
        regTitle: "Register Now",
        regDescription: "Join us for an exciting workshop",
        regButtonText: "Sign Up",
        aboutMarkdown: "# About\nThis is a great event!",
        locationName: "Room 101",
        locationDesc: "Second floor",
        mapEmbedUrl: "https://maps.example.com",
        mapTitle: "Campus Map",
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        form: null
      });
    });

    it("should handle optional fields with defaults", () => {
      const input: z.infer<typeof EventUpdateSchema> = {
        organizerSig: "gameDevSig",
        hero: {
          title: "Game Jam"
        },
        aboutMarkdown: "Join our game jam!",
        location: {
          name: "Lab 3"
        },
        date: "2025-12-15",
        time: { start: "10:00" }
      };

      const result = EventMapper.toDB(input);

      expect(result.heroTagsCsv).toBe("");
      expect(result.regEnabled).toBe(true);
      expect(result.regTitle).toBe("");
      expect(result.regDescription).toBe("");
      expect(result.regButtonText).toBe("");
      expect(result.locationDesc).toBe("");
      expect(result.mapEmbedUrl).toBe("");
      expect(result.mapTitle).toBe("");
    });
  });

  describe("toModel", () => {
    it("should map database event to model format", () => {
      const dbEvent: PrismaEvent = {
        id: "event-123",
        organizerSig: "edinburghAI",
        heroTitle: "AI Workshop",
        heroTagsCsv: "AI,Machine Learning",
        regEnabled: true,
        regTitle: "Register Now",
        regDescription: "Join us",
        regButtonText: "Sign Up",
        aboutMarkdown: "# About",
        locationName: "Room 101",
        locationDesc: "Second floor",
        mapEmbedUrl: "https://maps.example.com",
        mapTitle: "Campus Map",
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        form: null,
        createdAt: new Date("2025-11-01T10:00:00Z"),
        updatedAt: new Date("2025-11-02T12:00:00Z")
      };

      const result = EventMapper.toModel(dbEvent);

      expect(result).toEqual({
        id: "event-123",
        organizerSig: "edinburghAI",
        hero: {
          title: "AI Workshop",
          tags: ["AI", "Machine Learning"]
        },
        registration: {
          enabled: true,
          title: "Register Now",
          description: "Join us",
          buttonText: "Sign Up"
        },
        aboutMarkdown: "# About",
        location: {
          name: "Room 101",
          description: "Second floor",
          mapUrl: "https://maps.example.com",
          mapTitle: "Campus Map"
        },
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        form: undefined,
        createdAt: "2025-11-01T10:00:00.000Z",
        updatedAt: "2025-11-02T12:00:00.000Z"
      });
    });

    it("should handle empty tags", () => {
      const dbEvent: PrismaEvent = {
        id: "event-123",
        organizerSig: "gameDevSig",
        heroTitle: "Game Jam",
        heroTagsCsv: "",
        regEnabled: false,
        regTitle: "",
        regDescription: "",
        regButtonText: "",
        aboutMarkdown: "Content",
        locationName: "Lab 3",
        locationDesc: "",
        mapEmbedUrl: "",
        mapTitle: "",
        date: "2025-12-15",
        time: { start: "10:00" },
        form: null,
        createdAt: new Date("2025-11-01T10:00:00Z"),
        updatedAt: new Date("2025-11-01T10:00:00Z")
      };

      const result = EventMapper.toModel(dbEvent);

      expect(result.hero.tags).toBeUndefined();
      expect(result.registration).toBeUndefined();
    });
  });

  describe("toSearch", () => {
    it("should map database event to search format", () => {
      const dbEvent: PrismaEvent = {
        id: "event-123",
        organizerSig: "edinburghAI",
        heroTitle: "AI Workshop",
        heroTagsCsv: "AI,ML",
        regEnabled: true,
        regTitle: "Register",
        regDescription: "Join",
        regButtonText: "Sign Up",
        aboutMarkdown: "# About",
        locationName: "Room 101",
        locationDesc: "Second floor",
        mapEmbedUrl: "https://maps.example.com",
        mapTitle: "Map",
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        form: null,
        createdAt: new Date("2025-11-01T10:00:00Z"),
        updatedAt: new Date("2025-11-02T12:00:00Z")
      };

      const result = EventMapper.toSearch(dbEvent);

      expect(result).toEqual({
        id: "event-123",
        organizerSig: "edinburghAI",
        heroTitle: "AI Workshop",
        date: "2025-12-01",
        time: { start: "18:00", end: "20:00" },
        locationName: "Room 101"
      });
    });
  });
});
