import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";
import { clerkPlugin } from "@clerk/fastify";
import { eventRoutes } from "@/modules/events/route";

export function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(dbPlugin);
  server.register(clerkPlugin);

  server.register(eventRoutes);

  server.get("/health", async () => {
    return { status: "ok" };
  });

  return server;
}
