import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/fastify";
import { userService } from "../users/service.js";
import { Nullable } from "@events.comp-soc.com/shared";

interface ClerkUserEventData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: Nullable<string>;
  last_name: Nullable<string>;
  primary_email_address_id: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserEventData;
}

export const clerkWebhookRoutes = async (server: FastifyInstance) => {
  server.post(
    "/clerk",
    {
      config: {
        rawBody: true,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

      if (!webhookSecret) {
        server.log.error("CLERK_WEBHOOK_SECRET is not set");
        return reply.status(500).send({ error: "Webhook secret not configured" });
      }

      const svixId = request.headers["svix-id"] as string;
      const svixTimestamp = request.headers["svix-timestamp"] as string;
      const svixSignature = request.headers["svix-signature"] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return reply.status(400).send({ error: "Missing svix headers" });
      }

      const wh = new Webhook(webhookSecret);
      let event: ClerkWebhookEvent;

      try {
        event = wh.verify(request.rawBody!, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        }) as ClerkWebhookEvent;
      } catch {
        return reply.status(400).send({ error: "Invalid webhook signature" });
      }

      const { type, data } = event;

      server.log.info(`Received Clerk webhook: ${type}`);

      try {
        switch (type) {
          case "user.created": {
            const primaryEmail = data.email_addresses.find(
              (email) => email.id === data.primary_email_address_id
            );

            if (!primaryEmail) {
              return reply.status(400).send({ error: "No primary email found" });
            }

            await clerkClient.users.updateUserMetadata(data.id, {
              publicMetadata: {
                role: "member",
              },
            });

            await userService.createUser({
              db: server.db,
              data: {
                id: data.id,
                email: primaryEmail.email_address,
                firstName: data.first_name || "",
                lastName: data.last_name || "",
              },
            });

            server.log.info(`Created user: ${data.id} with role: member`);
            break;
          }

          case "user.updated": {
            const primaryEmail = data.email_addresses.find(
              (email) => email.id === data.primary_email_address_id
            );

            if (!primaryEmail) {
              return reply.status(400).send({ error: "No primary email found" });
            }

            await userService.updateUser({
              db: server.db,
              data: {
                id: data.id,
                email: primaryEmail.email_address,
                firstName: data.first_name || "",
                lastName: data.last_name || "",
              },
              role: null,
              requesterId: null,
            });

            server.log.info(`Updated user: ${data.id}`);
            break;
          }

          case "user.deleted": {
            await userService.deleteUser({
              db: server.db,
              data: { id: data.id },
              role: "committee",
              requesterId: data.id,
            });

            server.log.info(`Deleted user: ${data.id}`);
            break;
          }

          default:
            server.log.info(`Unhandled webhook type: ${type}`);
        }
      } catch {
        return reply.status(500).send({ error: "Error processing webhook" });
      }

      return reply.status(200).send({ received: true });
    }
  );
};
