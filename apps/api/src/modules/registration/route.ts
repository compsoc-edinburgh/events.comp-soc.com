import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateRegistrationSchema,
  RegistrationEventIdSchema,
  RegistrationParamsSchema,
  RegistrationsQueryFilterSchema,
  UpdateBatchStatusRegistrationSchema,
  UpdateRegistrationSchema,
} from "./schema.js";
import { registrationService } from "./service.js";
import {
  RegistrationContractSchema,
  RegistrationStatusBatchUpdateSchema,
  RegistrationUpdateContractSchema,
} from "@events.comp-soc.com/shared";

export const registrationRoutes = async (server: FastifyInstance) => {
  server.post("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const dto = RegistrationContractSchema.parse(request.body);
    const params = RegistrationEventIdSchema.parse(request.params);

    const data = CreateRegistrationSchema.parse({
      ...dto,
      userId,
      eventId: params.eventId,
    });

    const registration = await registrationService.createRegistration({
      db: server.db,
      data,
      role,
    });

    return reply.status(201).send(registration);
  });

  server.post("/batch-accept", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || role !== "committee") {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const { eventId } = RegistrationEventIdSchema.parse(request.params);
    const result = await registrationService.batchAcceptRegistration({
      db: server.db,
      data: { eventId },
      role,
    });

    return reply.status(200).send(result);
  });

  server.post("/promote-from-waitlist", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || role !== "committee") {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const { eventId } = RegistrationEventIdSchema.parse(request.params);
    const result = await registrationService.promoteNextFromWaitlist({
      db: server.db,
      data: { eventId },
      role,
    });

    return reply.status(200).send(result);
  });

  server.post("/batch-update-status", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || role !== "committee") {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const { eventId } = RegistrationEventIdSchema.parse(request.params);
    const dto = RegistrationStatusBatchUpdateSchema.parse(request.body);

    const data = UpdateBatchStatusRegistrationSchema.parse({
      eventId,
      ...dto,
    });

    const result = await registrationService.batchUpdateStatus({
      db: server.db,
      data,
      role,
    });

    return reply.status(200).send(result);
  });

  server.get("/", async (request, reply) => {
    const { sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const params = RegistrationEventIdSchema.parse(request.params);
    const filters = RegistrationsQueryFilterSchema.parse(request.query);

    const events = await registrationService.getRegistrations({
      db: server.db,
      filters: {
        id: params.eventId,
        ...filters,
      },
      role: role ?? null,
    });

    return reply.status(200).send(events);
  });

  server.get("/me", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const data = RegistrationEventIdSchema.parse(request.params);
    const registration = await registrationService.getRegistrationByUser({
      db: server.db,
      data: {
        ...data,
        userId,
      },
    });

    return registration ? reply.status(200).send(registration) : reply.status(204).send();
  });

  server.put("/:userId", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const dto = RegistrationUpdateContractSchema.parse(request.body);
    const params = RegistrationParamsSchema.parse(request.params);

    const data = UpdateRegistrationSchema.parse({
      ...dto,
      eventId: params.eventId,
      userId: params.userId,
    });

    const updatedRegistration = await registrationService.updateRegistration({
      db: server.db,
      data,
      role,
    });

    return reply.status(200).send(updatedRegistration);
  });

  server.delete("/:userId", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const data = RegistrationParamsSchema.parse(request.params);
    const deletedRegistration = await registrationService.deleteRegistration({
      db: server.db,
      data,
      userId,
      role,
    });

    return reply.status(200).send(deletedRegistration);
  });

  server.delete("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const { eventId } = RegistrationEventIdSchema.parse(request.params);
    const deletedRegistration = await registrationService.deleteRegistration({
      db: server.db,
      data: { eventId, userId },
      userId,
      role,
    });

    return reply.status(200).send(deletedRegistration);
  });
};
