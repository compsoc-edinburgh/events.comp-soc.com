import type { FastifyReply, FastifyRequest } from "fastify";
import { UserRole } from "@monorepo/types/const";
import { getAuth } from "@clerk/fastify";

const requireRole = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId } = getAuth(request);

  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const user = await request.server.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    return reply.code(404).send({ error: "User not found" });
  }

  if (user.role === UserRole.User) {
    return reply.code(403).send({ error: "Permission denied" });
  }
};

export default requireRole;
