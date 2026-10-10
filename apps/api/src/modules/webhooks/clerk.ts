import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/fastify";
import { userService } from "../users/service.js";
import { Nullable, Sigs, UserRole } from "@events.comp-soc.com/shared";
import { NotFoundError } from "../../lib/errors.js";
import { env } from "../../env.js";
import z from "zod";

// Clerk metadata when any user registers. (Useful for updating or custom registration)
interface ClerkPublicMetadata {
  role?: UserRole;
  sigs?: Sigs[];
}

// User data, which recieved from clerk on registration
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
  type: "user.created" | "user.updated" | "user.deleted";
  data: ClerkUserEventData | ClerkDeletedUserEventData;
}

export const clerkWebhookRoutes = async (server: FastifyInstance) => {
  // Custom parses for the body so webhook can correctly check body for the verification
  server.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (req: FastifyRequest, body: string, done: (err: Nullable<Error>, data: unknown) => void) => {
      try {
        const json = JSON.parse(body);
        // Store raw body for webhook verification
        req.rawBody = body;
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  server.post("/clerk", async (request: FastifyRequest, reply: FastifyReply) => {
    const webhookSecret = env.CLERK_WEBHOOK_SECRET;
    const headersResult = SvixHeadersSchema.safeParse(request.headers);

    if (!headersResult.success) {
      const invalidHeaders = headersResult.error.issues.map((issue) => String(issue.path[0]));

      request.log.warn({ invalidHeaders }, "clerk webhook missing or invalid svix headers");
      return reply.status(400).send({
        error: "Missing or invalid svix headers",
      });
    }

    const {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    } = headersResult.data;

    const wh = new Webhook(webhookSecret);
    let event: ClerkWebhookEvent;

    const rawBody = request.rawBody;
    if (typeof rawBody !== "string") {
      request.log.warn({ svixId }, "clerk webhook missing raw body");
      return reply.status(400).send({ error: "Missing webhook body" });
    }

    try {
      event = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      request.log.warn({ err, svixId }, "clerk webhook signature verification failed");
      return reply.status(400).send({ error: "Invalid webhook signature" });
    }

    const { type, data } = event;
    const log = request.log.child({ svixId, webhookType: type });

    log.info("clerk webhook verified");

    try {
      switch (type) {
        case "user.created": {
          const userData = data as ClerkUserEventData;
          const primaryEmail = userData.email_addresses.find(
            (email) => email.id === userData.primary_email_address_id
          );

          if (!primaryEmail) {
            log.warn({ clerkUserId: userData.id }, "clerk webhook has no primary email");
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

          log.info(
            {
              clerkUserId: userData.id,
              role: existingRole || UserRole.Member,
            },
            "user created"
          );
          break;
        }

        case "user.updated": {
          const userData = data as ClerkUserEventData;
          const primaryEmail = userData.email_addresses.find(
            (email) => email.id === userData.primary_email_address_id
          );

          if (!primaryEmail) {
            log.warn({ clerkUserId: userData.id }, "clerk webhook has no primary email");
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

          log.info({ clerkUserId: userData.id }, "user updated");
          break;
        }

        case "user.deleted": {
          const deletedData = data as ClerkDeletedUserEventData;
          if (!deletedData.id) {
            log.warn("user.deleted event missing id, skipping");
            break;
          }

          try {
            await userService.deleteUser({
              db: server.db,
              data: { id: deletedData.id },
              role: "committee",
              requesterId: `clerk_webhook_${deletedData.id}`,
            });

            log.info({ clerkUserId: deletedData.id }, "user deleted");
          } catch (error) {
            if (!(error instanceof NotFoundError)) {
              throw error;
            }

            log.info({ clerkUserId: deletedData.id }, "user not in database, skipping deletion");
          }

          break;
        }

        default:
          log.info("unhandled clerk webhook type");
      }
    } catch (err) {
      log.error({ err }, "clerk webhook processing failed");
      return reply.status(500).send({ error: "Error processing webhook" });
    }

    return reply.status(200).send({ received: true });
  });
};

const SvixHeadersSchema = z.object({
  "svix-id": z.string().min(1),
  "svix-timestamp": z.string().min(1),
  "svix-signature": z.string().min(1),
});
