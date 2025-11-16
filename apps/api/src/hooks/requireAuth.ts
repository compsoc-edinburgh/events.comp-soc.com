import type { FastifyReply, FastifyRequest } from "fastify";

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.auth?.userId) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
};

export default requireAuth;
