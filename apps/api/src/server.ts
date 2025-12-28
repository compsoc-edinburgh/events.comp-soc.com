import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";
import { clerkPlugin } from "@clerk/fastify";
import { eventRoutes } from "#modules/events/route";
import { userRoutes } from "#modules/users/route";
import { registrationRoutes } from "#modules/registration/route";
import { errorHandler } from "#lib/errorHandler";
import { healthCheck } from "#modules/health";
import { loggerConfig } from "#lib/logger";

export function buildServer() {
  const server = Fastify({
    logger: loggerConfig,
  });

  server.register(dbPlugin);
  server.register(clerkPlugin);

  server.register(userRoutes, { prefix: "/v1/users" });
  server.register(eventRoutes, { prefix: "/v1/events" });
  server.register(registrationRoutes, { prefix: "/v1/events/:eventId/registrations" });

  server.register(healthCheck);
  server.setErrorHandler(errorHandler);

  return server;
}
