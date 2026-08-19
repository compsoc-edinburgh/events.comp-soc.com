import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { isEventManager } from "@events.comp-soc.com/shared";

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId, sessionClaims } = getAuth(request);
  const role = sessionClaims?.metadata?.role;
  const sigs = sessionClaims?.metadata?.sigs;

  if (!userId || !role) {
    return reply.status(401).send({ message: "Unauthorised" });
  }

  request.user = { userId, role, sigs };
};

const requireEventManager = async (request: FastifyRequest, reply: FastifyReply) => {
  await requireAuth(request, reply);

  if (!request.user) {
    return;
  }

  if (!isEventManager(request.user.role)) {
    return reply.status(401).send({ message: "Unauthorised" });
  }
};

export { requireAuth, requireEventManager };
