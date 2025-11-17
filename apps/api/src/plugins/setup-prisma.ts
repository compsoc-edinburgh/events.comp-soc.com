import "dotenv/config";
import type { FastifyInstance } from "fastify";

import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

export async function setupPrisma(fastify: FastifyInstance) {
  await prisma.$connect();
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
