import type { FastifyInstance } from "fastify";
import requireAuth from "../hooks/require-auth";
import { EventCreateSchema, EventUpdateSchema } from "@monorepo/types/schemas";
import z from "zod";
import requireRole from "../hooks/require-role";
import { EventMapper } from "../mappers/event.mapper";

export default async function eventsRoutes(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    const events = await app.prisma.event.findMany({
      orderBy: {
        date: "desc"
      }
    });

    const searchEvents = events.map(EventMapper.toSearch);
    return reply.code(200).send(searchEvents);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const event = await app.prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return reply.code(404).send({ error: "Event not found" });
    }

    const eventOutput = EventMapper.toModel(event);
    return reply.code(200).send(eventOutput);
  });

  app.post(
    "/",
    { preHandler: [requireAuth, requireRole] },
    async (request, reply) => {
      const parseResult = EventCreateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({
          error: "Invalid body",
          issues: z.treeifyError(parseResult.error)
        });
      }

      const dbInput = EventMapper.toDB(parseResult.data);
      const event = await app.prisma.event.create({
        data: dbInput
      });

      const eventOutput = EventMapper.toModel(event);
      return reply.code(201).send(eventOutput);
    }
  );

  app.patch(
    "/:id",
    { preHandler: [requireAuth, requireRole] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const existingEvent = await app.prisma.event.findUnique({
        where: { id }
      });

      if (!existingEvent) {
        return reply.code(404).send({ error: "Event not found" });
      }

      const parseResult = EventUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({
          error: "Invalid body",
          issues: z.treeifyError(parseResult.error)
        });
      }

      const dbInput = EventMapper.toDB(parseResult.data);
      const event = await app.prisma.event.update({
        where: { id },
        data: dbInput
      });

      const eventOutput = EventMapper.toModel(event);
      return reply.code(200).send(eventOutput);
    }
  );

  app.delete(
    "/:id",
    { preHandler: [requireAuth, requireRole] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        await app.prisma.event.delete({
          where: { id }
        });

        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: "Event not found" });
      }
    }
  );
}
