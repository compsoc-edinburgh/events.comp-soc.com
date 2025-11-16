import type { FastifyInstance } from "fastify";
import requireAuth from "../hooks/requireAuth";
import { z } from "zod";

const UserUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required")
});

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/users/me",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const user = await app.prisma.user.findUnique({
        where: { id: request.auth.userId }
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      reply.code(200).send(user);
    }
  );

  app.post("/users", { preHandler: [requireAuth] }, async (request, reply) => {
    const userId = request.auth.userId;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const parseResult = UserUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        error: "Invalid body",
        issues: z.treeifyError(parseResult.error)
      });
    }

    const { email, firstName, lastName } = parseResult.data;

    const user = await app.prisma.user.upsert({
      where: { id: userId },
      update: {
        email,
        firstName,
        lastName
      },
      create: {
        id: userId,
        email,
        firstName,
        lastName
      }
    });

    return reply.code(201).send(user);
  });
}
