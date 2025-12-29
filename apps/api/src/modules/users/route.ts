import { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";
import { CreateUserSchema, UpdateUserSchema, UserIdSchema } from "./schema.js";
import { userService } from "./service.js";

export const userRoutes = async (server: FastifyInstance) => {
  server.get("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    const params = UserIdSchema.parse(request.params);
    const user = await userService.getUserById(server.db, params, userId ?? undefined, role);

    return reply.status(200).send(user);
  });

  server.post("/", async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const body = CreateUserSchema.parse(request.body);

    if (userId !== body.id) {
      return reply.status(403).send({ message: "Forbidden: User ID mismatch" });
    }
    const newUser = await userService.createUser(server.db, { ...body });

    return reply.status(201).send(newUser);
  });

  server.put("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const updateBody = UpdateUserSchema.parse(request.body);
    const params = UserIdSchema.parse(request.params);

    const body = { ...params, ...updateBody };
    const updatedUser = await userService.updateUser(server.db, body, userId, role);

    return reply.status(200).send(updatedUser);
  });

  server.delete("/:id", async (request, reply) => {
    const { userId, sessionClaims } = getAuth(request);
    const role = sessionClaims?.metadata?.role;

    if (!userId || !role) {
      return reply.status(401).send({ message: "Unauthorised" });
    }

    const params = UserIdSchema.parse(request.params);
    const deletedUser = await userService.deleteUser(server.db, params, userId, role);

    return reply.status(200).send(deletedUser);
  });
};
