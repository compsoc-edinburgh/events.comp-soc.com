import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateEventSchema,
  EventIdSchema,
  GetEventsQuerySchema,
  UpdateEventSchema,
} from "./schema.js";
import { eventService } from "./service.js";

export const eventRoutes = async (server: FastifyInstance) => {
  server.get("/", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const query = GetEventsQuerySchema.parse(request.query);
    const events = await eventService.getEvents(server.db, query, role);

    return reply.status(200).send(events);
  });

  server.get("/:id", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const params = EventIdSchema.parse(request.params);
    const events = await eventService.getEventById(server.db, params, role);

    return reply.status(200).send(events);
  });

  server.post("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const body = CreateEventSchema.parse(request.body);
    const newEvent = await eventService.createEvent(server.db, body, role);

    return reply.status(201).send(newEvent);
  });

  server.put("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const updateBody = UpdateEventSchema.parse(request.body);
    const params = EventIdSchema.parse(request.params);

    const body = { ...params, ...updateBody };
    const updatedEvent = await eventService.updateEvent(server.db, body, role);

    return reply.status(200).send(updatedEvent);
  });

  server.delete("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = EventIdSchema.parse(request.params);
    const deletedEvent = await eventService.deleteEvent(server.db, params, role);

    return reply.status(200).send(deletedEvent);
  });
};
