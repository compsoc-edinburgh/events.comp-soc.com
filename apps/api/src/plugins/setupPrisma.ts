import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";

const prisma = new PrismaClient();

export async function setupPrisma(fastify: FastifyInstance) {
  await prisma.$connect();
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
