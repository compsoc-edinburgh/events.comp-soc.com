import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/fastify";
import { userService } from "../users/service.js";
import { Nullable, Sigs, UserRole } from "@events.comp-soc.com/shared";
import { NotFoundError } from "../../lib/errors.js";
import { SpanStatusCode, trace, type Span } from "@opentelemetry/api";

const tracer = trace.getTracer("compsoc.webhooks.clerk");

// Span error handling
const recordSpanError = (span: Span, error: unknown) => {
  const exception = error instanceof Error ? error : new Error(String(error));

  span.setAttribute("compsoc.user.sync.outcome", "failed");
  span.recordException(exception);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: exception.message,
  });
};

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
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      request.log.error("CLERK_WEBHOOK_SECRET is not set");
      return reply.status(500).send({ error: "Webhook secret not configured" });
    }

    const svixId = request.headers["svix-id"] as string;
    const svixTimestamp = request.headers["svix-timestamp"] as string;
    const svixSignature = request.headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      request.log.warn("clerk webhook missing svix headers");
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

          await tracer.startActiveSpan("user.sync.create", async (span) => {
            try {
              span.setAttributes({
                "compsoc.user.id": userData.id,
                "compsoc.webhook.provider": "clerk",
                "compsoc.webhook.delivery_id": svixId,
                "compsoc.webhook.event_type": type,
              });

              const existingRole = userData.public_metadata?.role;
              const existingSigs = userData.public_metadata?.sigs;

              if (!existingRole) {
                span.addEvent("clerk.metadata.role_defaulted");

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

              span.setAttribute("compsoc.user.sync.outcome", "created");
              span.setAttribute("compsoc.user.role", existingRole || UserRole.Member);
              log.info(
                {
                  clerkUserId: userData.id,
                  role: existingRole || UserRole.Member,
                },
                "user created"
              );
            } catch (error) {
              recordSpanError(span, error);
              throw error;
            } finally {
              span.end();
            }
          });
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

          await tracer.startActiveSpan("user.sync.update", async (span) => {
            span.setAttributes({
              "compsoc.user.id": userData.id,
              "compsoc.webhook.provider": "clerk",
              "compsoc.webhook.delivery_id": svixId,
              "compsoc.webhook.event_type": type,
            });

            try {
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

              span.setAttribute("compsoc.user.sync.outcome", "updated");
              log.info({ clerkUserId: userData.id }, "user updated");
            } catch (error) {
              recordSpanError(span, error);
              throw error;
            } finally {
              span.end();
            }
          });
          break;
        }

        case "user.deleted": {
          const deletedData = data as ClerkDeletedUserEventData;
          if (!deletedData.id) {
            log.warn("user.deleted event missing id, skipping");
            break;
          }

          const deletedUserId = deletedData.id;

          await tracer.startActiveSpan("user.sync.delete", async (span) => {
            span.setAttributes({
              "compsoc.user.id": deletedUserId,
              "compsoc.webhook.provider": "clerk",
              "compsoc.webhook.delivery_id": svixId,
              "compsoc.webhook.event_type": type,
            });

            try {
              try {
                await userService.deleteUser({
                  db: server.db,
                  data: { id: deletedUserId },
                  role: "committee",
                  requesterId: `clerk_webhook_${deletedUserId}`,
                });

                span.setAttribute("compsoc.user.sync.outcome", "deleted");
                log.info({ clerkUserId: deletedUserId }, "user deleted");
              } catch (error) {
                if (!(error instanceof NotFoundError)) {
                  throw error;
                }

                span.setAttribute("compsoc.user.sync.outcome", "not_found");
                span.addEvent("user.sync.delete.skipped", { reason: "not_found" });
                log.info({ clerkUserId: deletedUserId }, "user not in database, skipping deletion");
              }
            } catch (error) {
              recordSpanError(span, error);
              throw error;
            } finally {
              span.end();
            }
          });

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
