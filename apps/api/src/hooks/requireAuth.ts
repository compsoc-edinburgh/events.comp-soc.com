import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = getAuth(request);

  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
};

export default requireAuth;
