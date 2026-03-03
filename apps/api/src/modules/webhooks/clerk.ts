import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/fastify";
import { userService } from "../users/service.js";
import { Nullable, Sigs, UserRole } from "@events.comp-soc.com/shared";
import { NotFoundError } from "../../lib/errors.js";

interface ClerkPublicMetadata {
  role?: UserRole;
  sigs?: Sigs[];
}

interface ClerkUserEventData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: Nullable<string>;
  last_name: Nullable<string>;
  primary_email_address_id: string;
  public_metadata?: ClerkPublicMetadata;
}

interface ClerkDeletedUserEventData {
  id?: string;
  deleted: boolean;
  object: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserEventData | ClerkDeletedUserEventData;
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
            const userData = data as ClerkUserEventData;
            const primaryEmail = userData.email_addresses.find(
              (email) => email.id === userData.primary_email_address_id
            );

            if (!primaryEmail) {
              return reply.status(400).send({ error: "No primary email found" });
            }

            const existingRole = userData.public_metadata?.role;
            const existingSigs = userData.public_metadata?.sigs;

            if (!existingRole) {
              await clerkClient.users.updateUserMetadata(userData.id, {
                publicMetadata: {
                  role: UserRole.Member,
                },
              });
            }

            await userService.createUser({
              db: server.db,
              data: {
                id: userData.id,
                email: primaryEmail.email_address,
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                sigs: existingSigs,
              },
            });

            server.log.info(
              `Created user: ${userData.id} with role: ${existingRole || UserRole.Member}`
            );
            break;
          }

          case "user.updated": {
            const userData = data as ClerkUserEventData;
            const primaryEmail = userData.email_addresses.find(
              (email) => email.id === userData.primary_email_address_id
            );

            if (!primaryEmail) {
              return reply.status(400).send({ error: "No primary email found" });
            }

            await userService.updateUser({
              db: server.db,
              data: {
                id: userData.id,
                email: primaryEmail.email_address,
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
              },
              role: "committee",
              requesterId: `clerk_webhook_${userData.id}`,
            });

            server.log.info(`Updated user: ${userData.id}`);
            break;
          }

          case "user.deleted": {
            const deletedData = data as ClerkDeletedUserEventData;
            if (!deletedData.id) {
              server.log.warn(`user.deleted event missing id, skipping`);
              break;
            }

            try {
              await userService.deleteUser({
                db: server.db,
                data: { id: deletedData.id },
                role: "committee",
                requesterId: `clerk_webhook_${deletedData.id}`,
              });

              server.log.info(`Deleted user: ${deletedData.id}`);
            } catch (error) {
              if (error instanceof NotFoundError) {
                server.log.info(`User ${deletedData.id} not found in DB, skipping deletion`);
              } else {
                server.log.info(`Unknown error`);
              }
            }

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
