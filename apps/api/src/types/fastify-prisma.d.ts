import "@prisma/client";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: import("@prisma/client").PrismaClient;
  }
}
