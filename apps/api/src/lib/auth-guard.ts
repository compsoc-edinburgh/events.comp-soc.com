import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId, sessionClaims } = getAuth(request);
  const role = sessionClaims?.metadata?.role;

  if (!userId || !role) {
    return reply.status(401).send({ message: "Unauthorised" });
  }

  request.user = { userId, role };
};

const requireCommittee = async (request: FastifyRequest, reply: FastifyReply) => {
  await requireAuth(request, reply);

  if (request.user.role !== "committee") {
    return reply.status(401).send({ message: "Unauthorised" });
  }
};

export { requireAuth, requireCommittee };
