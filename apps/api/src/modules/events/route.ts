import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateEventSchema,
  EventIdSchema,
  EventsQueryFilterSchema,
  UpdateEventSchema,
} from "./schema.js";
import { eventService } from "./service.js";
import { EventContractSchema, UpdateEventContractSchema } from "@events.comp-soc.com/shared";
import { nanoid } from "nanoid";

export const eventRoutes = async (server: FastifyInstance) => {
  server.get("/", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const filters = EventsQueryFilterSchema.parse(request.query);
    const events = await eventService.getEvents({
      db: server.db,
      filters,
      role: role ?? null,
    });

    return reply.status(200).send(events);
  });

  server.get("/:id", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const data = EventIdSchema.parse(request.params);
    const events = await eventService.getEventById({
      db: server.db,
      data,
      role: role ?? null,
    });

    return reply.status(200).send(events);
  });

  server.post("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const dto = EventContractSchema.parse(request.body);
    const generatedId = nanoid();

    const data = CreateEventSchema.parse({
      id: generatedId,
      ...dto,
      date: new Date(dto.date),
    });

    const newEvent = await eventService.createEvent({
      db: server.db,
      data,
      role,
    });

    return reply.status(201).send(newEvent);
  });

  server.post("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const { id } = EventIdSchema.parse(request.params);
    const dto = UpdateEventContractSchema.parse(request.body);

    const data = UpdateEventSchema.parse({
      ...dto,
      id,
      ...(dto.date && { date: new Date(dto.date) }),
    });

    const updatedEvent = await eventService.updateEvent({
      db: server.db,
      data,
      role,
    });

    return reply.status(200).send(updatedEvent);
  });

  server.delete("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const data = EventIdSchema.parse(request.params);
    const deletedEvent = await eventService.deleteEvent({
      db: server.db,
      data,
      role,
    });

    return reply.status(200).send(deletedEvent);
  });
};
