import { FastifyInstance } from "fastify";
import { CreateUserSchema, UserIdSchema, UpdateUserSchema } from "./schema.js";
import { userService } from "./service.js";
import { UpdateUserContractSchema, UserContractSchema } from "@events.comp-soc.com/shared";
import { requireAuth } from "../../lib/auth-guard.js";

export const userRoutes = async (server: FastifyInstance) => {
  server.get("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId: requesterId, role } = request.user;
    const { id } = UserIdSchema.parse(request.params);

    const user = await userService.getUserById({
      db: server.db,
      data: {
        id,
      },
      requesterId,
      role,
    });

    return reply.send(user);
  });

  server.get("/registrations", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = request.user;

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

  server.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = request.user;

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

  server.put("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId, role } = request.user;
    const { id } = UserIdSchema.parse(request.params);

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

  server.delete("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId, role } = request.user;

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
