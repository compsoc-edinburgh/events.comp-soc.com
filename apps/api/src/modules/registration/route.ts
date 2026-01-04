import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateRegistrationSchema,
  RegistrationEventIdSchema,
  RegistrationParamsSchema,
  UpdateRegistrationSchema,
} from "./schema.js";
import { registrationService } from "./service.js";
import {
  RegistrationContractSchema,
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
