import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import { CreateUserSchema, UserIdSchema, UpdateUserSchema } from "./schema.js";
import { userService } from "./service.js";
import { UpdateUserContractSchema, UserContractSchema } from "@events.comp-soc.com/shared";

export const userRoutes = async (server: FastifyInstance) => {
  server.get("/:id", async (request, reply) => {
    const { userId: requesterId, sessionClaims } = getAuth(request);
    const { id } = UserIdSchema.parse(request.params);

    const user = await userService.getUserById({
      db: server.db,
      data: {
        id,
      },
      requesterId,
      role: sessionClaims?.metadata.role ?? null,
    });

    return reply.send(user);
  });

  server.get("/registrations", async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const registrations = await userService.getUserRegistrations({
      db: server.db,
      data: {
        id: userId,
      },
    });

    if (registrations && registrations.length > 0) {
      return reply.status(200).send(registrations);
    }

    return reply.status(204).send();
  });

  server.post("/", async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const dto = UserContractSchema.parse(request.body);
    const data = CreateUserSchema.parse({
      ...dto,
      id: userId,
    });

    const newUser = await userService.createUser({
      db: server.db,
      data,
    });

    return reply.status(201).send(newUser);
  });

  server.put("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const { id } = UserIdSchema.parse(request.params);

    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const dto = UpdateUserContractSchema.parse(request.body);
    const data = UpdateUserSchema.parse({
      ...dto,
      id,
    });

    const updatedUser = await userService.updateUser({
      db: server.db,
      data,
      requesterId: userId,
      role,
    });

    return reply.status(200).send(updatedUser);
  });

  server.delete("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const data = UserIdSchema.parse(request.params);
    const deletedUser = await userService.deleteUser({
      db: server.db,
      data,
      requesterId: userId,
      role,
    });

    return reply.status(200).send(deletedUser);
  });
};
