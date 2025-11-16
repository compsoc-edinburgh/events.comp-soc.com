import type { FastifyInstance } from "fastify";
import requireAuth from "../hooks/requireAuth";
import { EventUpdateSchema } from "@monorepo/types/schemas";
import z from "zod";
import requireCommitteeOrSigLeader from "../hooks/requireCommitteeOrSigLeader";

export default async function eventsRoutes(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    const events = await app.prisma.event.findMany({
      orderBy: {
        date: "desc"
      }
    });

    return reply.code(200).send(events);
  });

  app.get("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const event = await app.prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return reply.code(404).send({ error: "Event not found" });
    }

    return reply.code(200).send(event);
  });

  app.post(
    "/",
    { preHandler: [requireAuth, requireCommitteeOrSigLeader] },
    async (request, reply) => {
      const parseResult = EventUpdateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({
          error: "Invalid body",
          issues: z.treeifyError(parseResult.error)
        });
      }

      const {
        organizerSig,
        hero,
        registration,
        aboutMarkdown,
        location,
        date,
        time,
        form
      } = parseResult.data;

      const event = await app.prisma.event.create({
        data: {
          organizerSig,
          heroTitle: hero.title,
          heroTagsCsv: hero.tags ? hero.tags.join(",") : "",
          regEnabled: registration?.enabled ?? true,
          regTitle: registration?.title || "",
          regDescription: registration?.description || "",
          regButtonText: registration?.buttonText || "",
          aboutMarkdown,
          locationName: location.name,
          locationDesc: location.description || "",
          mapEmbedUrl: location.mapUrl || "",
          mapTitle: location.mapTitle || "",
          date,
          time: JSON.stringify(time),
          form: form ? JSON.stringify(form) : null
        }
      });

      return reply.code(201).send(event);
    }
  );

  app.patch(
    "/:id",
    { preHandler: [requireAuth, requireCommitteeOrSigLeader] },
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

      const {
        organizerSig,
        hero,
        registration,
        aboutMarkdown,
        location,
        date,
        time,
        form
      } = parseResult.data;

      const event = await app.prisma.event.update({
        where: { id },
        data: {
          organizerSig,
          heroTitle: hero.title,
          heroTagsCsv: hero.tags ? hero.tags.join(",") : "",
          regEnabled: registration?.enabled ?? true,
          regTitle: registration?.title || "",
          regDescription: registration?.description || "",
          regButtonText: registration?.buttonText || "",
          aboutMarkdown,
          locationName: location.name,
          locationDesc: location.description || "",
          mapEmbedUrl: location.mapUrl || "",
          mapTitle: location.mapTitle || "",
          date,
          time: time,
          form: form ? form : existingEvent.form ? existingEvent.form : null
        }
      });

      return reply.code(200).send(event);
    }
  );

  app.delete(
    "/:id",
    { preHandler: [requireAuth, requireCommitteeOrSigLeader] },
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
