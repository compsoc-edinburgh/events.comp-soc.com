import { getAuth } from "@clerk/fastify";
import { FastifyRequest } from "fastify";
import { isEventManager } from "@events.comp-soc.com/shared";
import { UnauthorizedError } from "./errors.js";

const requireAuth = async (request: FastifyRequest) => {
  const { userId, sessionClaims } = getAuth(request);
  const role = sessionClaims?.metadata?.role;
  const sigs = sessionClaims?.metadata?.sigs;

  if (!userId || !role) {
    throw new UnauthorizedError();
  }

  request.user = { userId, role, sigs };
};

const requireEventManager = async (request: FastifyRequest) => {
  await requireAuth(request);

  if (!isEventManager(request.user.role)) {
    throw new UnauthorizedError();
  }
};

export { requireAuth, requireEventManager };
