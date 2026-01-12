import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";
import { clerkPlugin } from "@clerk/fastify";
import { loggerConfig } from "./lib/logger.js";
import { userRoutes } from "./modules/users/route.js";
import { eventRoutes } from "./modules/events/route.js";
import { registrationRoutes } from "./modules/registration/route.js";
import { healthCheck } from "./modules/health.js";
import { errorHandler } from "./lib/./error-handler.js";

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
