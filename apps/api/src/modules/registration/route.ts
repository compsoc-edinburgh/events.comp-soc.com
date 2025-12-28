import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateRegistrationBodySchema,
  EventIdParamsSchema,
  TargetUserParamsSchema,
  UpdateRegistrationInputSchema,
} from "#modules/registration/schema";
import { registrationService } from "#modules/registration/service";

export const registrationRoutes = async (server: FastifyInstance) => {
  server.post("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = EventIdParamsSchema.parse(request.params);
    const body = CreateRegistrationBodySchema.parse(request.body);

    const registration = await registrationService.createRegistration(
      server.db,
      {
        userId,
        eventId: params.eventId,
        formData: body.formData,
      },
      role
    );
    return reply.status(201).send(registration);
  });

  server.put("/:targetUserId", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = TargetUserParamsSchema.parse(request.params);
    const body = UpdateRegistrationInputSchema.parse(request.body);

    const updatedRegistration = await registrationService.updateRegistration(
      server.db,
      { userId: params.targetUserId, eventId: params.eventId },
      body,
      role
    );

    return reply.status(200).send(updatedRegistration);
  });

  server.delete("/:targetUserId", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = TargetUserParamsSchema.parse(request.params);

    const deletedRegistration = await registrationService.deleteRegistration(
      server.db,
      { userId: params.targetUserId, eventId: params.eventId },
      userId,
      role
    );

    return reply.status(200).send(deletedRegistration);
  });

  server.delete("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = EventIdParamsSchema.parse(request.params);

    const deletedRegistration = await registrationService.deleteRegistration(
      server.db,
      { userId, eventId: params.eventId },
      userId,
      role
    );

    return reply.status(200).send(deletedRegistration);
  });
};
