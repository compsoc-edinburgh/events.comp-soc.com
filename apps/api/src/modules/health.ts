import { FastifyInstance } from "fastify";

export const healthCheck = async (server: FastifyInstance) => {
  server.get("/health", async () => {
    return { status: "ok" };
  });
};
