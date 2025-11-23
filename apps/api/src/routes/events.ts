import type { FastifyInstance, FastifyRequest } from "fastify";
import requireAuth from "../hooks/require-auth";
import { EventCreateSchema, EventUpdateSchema } from "@monorepo/types/schemas";
import z from "zod";
import requireRole from "../hooks/require-role";
import { EventMapper } from "../mappers/event.mapper";
import { EventState, UserRole } from "@monorepo/types/const";
import { getAuth } from "@clerk/fastify";

const privilegedRoles: UserRole[] = [UserRole.Committee, UserRole.SigsLeader];

const canViewDrafts = (role: UserRole | null) => {
  if (!role) return false;
  return privilegedRoles.includes(role);
};

async function getUserRole(request: FastifyRequest): Promise<UserRole | null> {
  const { userId } = getAuth(request);

  if (!userId) {
    return null;
  }

  const user = await request.server.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return (user?.role as UserRole) ?? null;
}

export default async function eventsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const role = await getUserRole(request);
    const includeDrafts = canViewDrafts(role);

    const events = await app.prisma.event.findMany({
      where: includeDrafts ? undefined : { state: EventState.Uploaded },
      orderBy: {
        date: "asc",
      },
    });

    const searchEvents = events.map(EventMapper.toSearch);
    return reply.code(200).send(searchEvents);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const event = await app.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return reply.code(404).send({ error: "Event not found" });
    }

    if (event.state === EventState.Draft) {
      const role = await getUserRole(request);
      if (!canViewDrafts(role)) {
        return reply.code(404).send({ error: "Event not found" });
      }
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
          issues: z.treeifyError(parseResult.error),
        });
      }

      const dbInput = EventMapper.toDB(parseResult.data);
      const event = await app.prisma.event.create({
        data: dbInput,
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
        where: { id },
      });

      if (!existingEvent) {
        return reply.code(404).send({ error: "Event not found" });
      }

      const parseResult = EventUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({
          error: "Invalid body",
          issues: z.treeifyError(parseResult.error),
        });
      }

      const dbInput = EventMapper.toDB(parseResult.data);
      const event = await app.prisma.event.update({
        where: { id },
        data: dbInput,
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
          where: { id },
        });

        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: "Event not found" });
      }
    }
  );
}
