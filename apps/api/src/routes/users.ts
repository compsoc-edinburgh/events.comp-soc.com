import type { FastifyInstance } from "fastify";
import requireAuth from "../hooks/requireAuth";
import { z } from "zod";
import { UserUpdateSchema } from "@monorepo/types/schemas";
import { getAuth } from "@clerk/fastify";

export default async function usersRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const { userId } = getAuth(request);

    const user = await app.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.send(user);
  });

  app.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = getAuth(request);

    const parseResult = UserUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        error: "Invalid body",
        issues: z.treeifyError(parseResult.error)
      });
    }

    const existing = await app.prisma.user.findUnique({
      where: { id: userId }
    });

    if (existing) {
      return reply.code(409).send({
        error: "User already exists"
      });
    }

    const { email, firstName, lastName } = parseResult.data;

    const newUser = await app.prisma.user.create({
      data: {
        id: userId,
        email,
        firstName,
        lastName
      }
    });

    return reply.code(201).send(newUser);
  });

  app.patch("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = getAuth(request);

    const parseResult = UserUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        error: "Invalid body",
        issues: z.treeifyError(parseResult.error)
      });
    }

    const { email, firstName, lastName } = parseResult.data;

    try {
      const updatedUser = await app.prisma.user.update({
        where: { id: userId },
        data: { email, firstName, lastName }
      });

      return reply.code(200).send(updatedUser);
    } catch {
      return reply.code(404).send({ error: "User not found" });
    }
  });

  app.delete("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { userId } = getAuth(request);

    try {
      await app.prisma.user.delete({
        where: { id: userId }
      });
      return reply.code(204).send();
    } catch {
      return reply.code(404).send({ error: "User not found" });
    }
  });
}
