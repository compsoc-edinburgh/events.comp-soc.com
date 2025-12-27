import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";
import { clerkPlugin } from "@clerk/fastify";
import { eventRoutes } from "@/modules/events/route";
import { userRoutes } from "@/modules/users/route";
import { registrationRoutes } from "./modules/registration/route.js";

export function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(dbPlugin);
  server.register(clerkPlugin);

  server.register(userRoutes, { prefix: "/v1/users" });
  server.register(eventRoutes, { prefix: "/v1/events" });
  server.register(registrationRoutes, { prefix: "/v1/events/:eventId/registrations" });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  return server;
}
