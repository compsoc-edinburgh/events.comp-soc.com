import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import {
  CreateRegistrationBodySchema,
  CreateRegistrationInput,
  EventIdParamsSchema,
  RegistrationParams,
  TargetUserParamsSchema,
  UpdateRegistrationInputSchema,
} from "@/modules/registration/schema";
import { registrationService } from "@/modules/registration/service";

export const registrationRoutes = async (server: FastifyInstance) => {
  server.post("/", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = EventIdParamsSchema.parse(request.params);
    const body = CreateRegistrationBodySchema.parse(request.body);

    const mergedBody: CreateRegistrationInput = {
      userId,
      eventId: params.eventId,
      formData: body.formData,
    };

    const registration = await registrationService.createRegistration(server.db, mergedBody, role);
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

    const mergedParams: RegistrationParams = {
      userId: params.targetUserId,
      eventId: params.eventId,
    };

    const updatedRegistration = await registrationService.updateRegistration(
      server.db,
      mergedParams,
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

    const mergedParams: RegistrationParams = {
      userId: params.targetUserId,
      eventId: params.eventId,
    };

    const deletedRegistration = await registrationService.deleteRegistration(
      server.db,
      mergedParams,
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

    const mergedParams: RegistrationParams = {
      userId,
      eventId: params.eventId,
    };

    const deletedRegistration = await registrationService.deleteRegistration(
      server.db,
      mergedParams,
      userId,
      role
    );

    return reply.status(200).send(deletedRegistration);
  });
};
