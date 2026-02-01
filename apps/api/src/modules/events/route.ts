import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateEventSchema,
  EventIdSchema,
  EventsQueryFilterSchema,
  UpdateEventSchema,
} from "./schema.js";
import { eventService } from "./service.js";
import {
  EventContractSchema,
  UpdateEventContractSchema,
  Sigs,
  canManageSig,
} from "@events.comp-soc.com/shared";
import { nanoid } from "nanoid";
import { requireEventManager } from "../../lib/auth-guard.js";
import { ForbiddenError } from "../../lib/errors.js";

export const eventRoutes = async (server: FastifyInstance) => {
  server.get("/", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;
    const sigs = sessionClaims?.metadata?.sigs;

    const filters = EventsQueryFilterSchema.parse(request.query);
    const events = await eventService.getEvents({
      db: server.db,
      filters,
      role: role ?? null,
      sigs,
    });

    return reply.status(200).send(events);
  });

  server.get("/:id", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;
    const sigs = sessionClaims?.metadata?.sigs;

    const data = EventIdSchema.parse(request.params);
    const events = await eventService.getEventById({
      db: server.db,
      data,
      role: role ?? null,
      sigs,
    });

    return reply.status(200).send(events);
  });

  server.post("/", { preHandler: [requireEventManager] }, async (request, reply) => {
    const dto = EventContractSchema.parse(request.body);
    const { role, sigs } = request.user;

    if (!canManageSig(role, sigs, dto.organiser as Sigs)) {
      throw new ForbiddenError("You cannot create events for this SIG");
    }

    const generatedId = nanoid();

    const data = CreateEventSchema.parse({
      id: generatedId,
      ...dto,
      date: new Date(dto.date),
    });

    const newEvent = await eventService.createEvent({
      db: server.db,
      data,
    });

    return reply.status(201).send(newEvent);
  });

  server.put("/:id", { preHandler: [requireEventManager] }, async (request, reply) => {
    const { id } = EventIdSchema.parse(request.params);
    const dto = UpdateEventContractSchema.parse(request.body);
    const { role, sigs } = request.user;

    const existingEvent = await eventService.getEventForAuth({
      db: server.db,
      data: { id },
    });

    if (!existingEvent) {
      throw new ForbiddenError("Event not found");
    }

    if (!canManageSig(role, sigs, existingEvent.organiser as Sigs)) {
      throw new ForbiddenError("You cannot edit events for this SIG");
    }

    if (dto.organiser && !canManageSig(role, sigs, dto.organiser as Sigs)) {
      throw new ForbiddenError("You cannot transfer events to this SIG");
    }

    const data = UpdateEventSchema.parse({
      ...dto,
      id,
      ...(dto.date && { date: new Date(dto.date) }),
    });

    const updatedEvent = await eventService.updateEvent({
      db: server.db,
      data,
    });

    return reply.status(200).send(updatedEvent);
  });

  server.delete("/:id", { preHandler: [requireEventManager] }, async (request, reply) => {
    const data = EventIdSchema.parse(request.params);
    const { role, sigs } = request.user;

    const existingEvent = await eventService.getEventForAuth({
      db: server.db,
      data,
    });

    if (!existingEvent) {
      throw new ForbiddenError("Event not found");
    }

    if (!canManageSig(role, sigs, existingEvent.organiser as Sigs)) {
      throw new ForbiddenError("You cannot delete events for this SIG");
    }

    const deletedEvent = await eventService.deleteEvent({
      db: server.db,
      data,
    });

    return reply.status(200).send(deletedEvent);
  });
};
