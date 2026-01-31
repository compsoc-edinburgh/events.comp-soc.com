import Fastify, { FastifyRequest } from "fastify";
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

  server.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (req: FastifyRequest, body: string, done: (err: Error | null, data: unknown) => void) => {
      try {
        const json = JSON.parse(body);
        // Store raw body for webhook verification
        req.rawBody = body;
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  server.register(dbPlugin);
  server.register(clerkPlugin);

  server.register(clerkWebhookRoutes, { prefix: "/webhooks" });

  server.register(userRoutes, { prefix: "/v1/users" });
  server.register(eventRoutes, { prefix: "/v1/events" });
  server.register(registrationRoutes, { prefix: "/v1/events/:eventId/registrations" });

  server.register(healthCheck);
  server.setErrorHandler(errorHandler);

  return server;
}
