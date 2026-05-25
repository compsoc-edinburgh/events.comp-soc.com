import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";
import { clerkPlugin } from "@clerk/fastify";
import { loggerConfig } from "./lib/logger.js";
import { userRoutes } from "./modules/users/route.js";
import { eventRoutes } from "./modules/events/route.js";
import { registrationRoutes } from "./modules/registration/route.js";
import { clerkWebhookRoutes } from "./modules/webhooks/clerk.js";
import { healthCheck } from "./modules/health.js";
import { errorHandler } from "./lib/error-handler.js";

export function buildServer() {
  const server = Fastify({
    logger: loggerConfig,
  });

  server.register(dbPlugin);

  // Handles connection between clerk and backend (will be removed when migration from clerk starts)
  server.register(clerkPlugin);
  server.register(clerkWebhookRoutes, { prefix: "/webhooks" });

  // Handles all business logic
  server.register(userRoutes, { prefix: "/v1/users" });
  server.register(eventRoutes, { prefix: "/v1/events" });
  server.register(registrationRoutes, { prefix: "/v1/events/:eventId/registrations" });

  server.register(healthCheck);
  server.setErrorHandler(errorHandler);

  return server;
}
