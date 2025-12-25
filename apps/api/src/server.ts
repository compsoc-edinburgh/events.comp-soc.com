import Fastify from "fastify";
import dbPlugin from "./plugins/db.js";

export function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(dbPlugin);

  server.get("/health", async () => {
    return { status: "ok" };
  });

  return server;
}
