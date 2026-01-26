import { FastifyInstance } from "fastify";
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
import { requireAuth, requireCommittee } from "../../lib/auth-guard.js";

export const registrationRoutes = async (server: FastifyInstance) => {
  server.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = request.user;

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
    });

    return reply.status(201).send(registration);
  });

  server.post("/batch-accept", { preHandler: [requireCommittee] }, async (request, reply) => {
    const { eventId } = RegistrationEventIdSchema.parse(request.params);

    const result = await registrationService.batchAcceptRegistration({
      db: server.db,
      data: { eventId },
    });

    return reply.status(200).send(result);
  });

  server.post(
    "/batch-update-status",
    { preHandler: [requireCommittee] },
    async (request, reply) => {
      const { eventId } = RegistrationEventIdSchema.parse(request.params);
      const dto = RegistrationStatusBatchUpdateSchema.parse(request.body);

      const data = UpdateBatchStatusRegistrationSchema.parse({
        eventId,
        ...dto,
      });

      const result = await registrationService.batchUpdateStatus({
        db: server.db,
        data,
      });

      return reply.status(200).send(result);
    }
  );

  server.get("/", { preHandler: [requireCommittee] }, async (request, reply) => {
    const params = RegistrationEventIdSchema.parse(request.params);
    const filters = RegistrationsQueryFilterSchema.parse(request.query);

    const events = await registrationService.getRegistrations({
      db: server.db,
      filters: {
        id: params.eventId,
        ...filters,
      },
    });

    return reply.status(200).send(events);
  });

  server.get("/me", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = request.user;
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

  server.put("/:userId", { preHandler: [requireCommittee] }, async (request, reply) => {
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
    });

    return reply.status(200).send(updatedRegistration);
  });

  server.get("/analytics", { preHandler: [requireCommittee] }, async (request, reply) => {
    const { eventId } = RegistrationEventIdSchema.parse(request.params);

    const analytics = await registrationService.getRegistrationAnalytics({
      db: server.db,
      eventId,
    });

    return reply.status(200).send(analytics);
  });

  server.delete("/:userId", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId, role } = request.user;
    const data = RegistrationParamsSchema.parse(request.params);

    const deletedRegistration = await registrationService.deleteRegistration({
      db: server.db,
      data,
      userId,
      role,
    });

    return reply.status(200).send(deletedRegistration);
  });
};
