import { SqlContext } from "../../db/db.js";
import {
  CreateRegistration,
  RegistrationEventId,
  RegistrationParams,
  UpdateBatchRegistration,
  UpdateRegistration,
} from "./schema.js";
import { eventStore } from "../events/store.js";
import { EventState, Sigs, UserRole, canManageSig } from "@events.comp-soc.com/shared";
import { BadRequestError, ConflictError, NotFoundError, ForbiddenError } from "../../lib/errors.js";
import { registrationStore } from "./store.js";
import { EventId } from "../events/schema.js";
import { validateRegistrationAnswers } from "./utils.js";
import { withRegistrationSpan } from "../../telemetry/spans/registration-span.js";

export const registrationService = {
  async createRegistration({ db, data }: { db: SqlContext; data: CreateRegistration }) {
    return withRegistrationSpan(
      "registration.create",
      {
        "compsoc.registration.event_id": data.eventId,
        "compsoc.registration.user_id": data.userId,
      },
      async ({ span, setOutcome }) => {
        return await db.transaction(async (tx) => {
          const event = await eventStore.findById({
            db: tx,
            data: { id: data.eventId },
          });

          if (!event || event.state === EventState.Draft) {
            setOutcome("event_not_found");
            throw new NotFoundError(`Event with ${data.eventId} not found`);
          }

          if (event.date.getTime() < Date.now()) {
            setOutcome("closed");
            throw new ConflictError("Registration is closed for this event");
          }

          let answers: CreateRegistration["answers"];
          try {
            answers = validateRegistrationAnswers({
              form: event.form,
              answers: data.answers,
            });
          } catch (error) {
            if (error instanceof BadRequestError) {
              setOutcome("invalid_answers");
            }
            throw error;
          }

          const existing = await registrationStore.getByUserAndEvent({
            db: tx,
            data: { userId: data.userId, eventId: data.eventId },
          });

          if (existing) {
            setOutcome("duplicate");
            throw new ConflictError("Already registered");
          }

          const registration = await registrationStore.create({
            db: tx,
            data: { ...data, answers, status: "pending" },
          });

          span.setAttribute("compsoc.registration.status", "pending");
          setOutcome("created");

          return registration;
        });
      }
    );
  },

  async getRegistrationByUser({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    return await registrationStore.getByUserAndEvent({
      db,
      data,
    });
  },

  async getRegistrations({ db, data }: { db: SqlContext; data: Pick<EventId, "id"> }) {
    return registrationStore.get({ db, data });
  },

  async updateRegistration({ db, data }: { db: SqlContext; data: UpdateRegistration }) {
    return withRegistrationSpan(
      "registration.update",
      {
        "compsoc.registration.event_id": data.eventId,
        "compsoc.registration.user_id": data.userId,
        "compsoc.registration.target_status": data.status,
      },
      async ({ span, setOutcome }) => {
        return await db.transaction(async (tx) => {
          const registration = await registrationStore.getByUserAndEvent({
            db: tx,
            data,
          });

          if (!registration) {
            setOutcome("not_found");
            throw new NotFoundError("Registration not found");
          }

          span.setAttribute("compsoc.registration.previous_status", registration.status);

          const isTransitioningToAccepted =
            data.status === "accepted" && registration.status !== "accepted";

          if (isTransitioningToAccepted) {
            const event = await eventStore.findByIdForUpdate({
              tx,
              data: { id: data.eventId },
            });

            if (!event) {
              setOutcome("event_not_found");
              throw new NotFoundError(`Event with ${data.eventId} not found`);
            }

            if (event.capacity !== null) {
              const activeCount = await registrationStore.countActiveByEventId({
                db: tx,
                data: { id: event.id },
              });

              span.setAttributes({
                "compsoc.registration.active_count": activeCount,
                "compsoc.registration.event_capacity": event.capacity,
              });

              if (activeCount >= event.capacity) {
                setOutcome("capacity_reached");
                throw new ConflictError("Cannot accept: Event capacity has been reached");
              }
            }
          }

          const updatedRegistration = await registrationStore.update({
            db: tx,
            data,
          });

          setOutcome("updated");

          return updatedRegistration;
        });
      }
    );
  },

  async batchAcceptRegistration({ db, data }: { db: SqlContext; data: RegistrationEventId }) {
    return withRegistrationSpan(
      "registration.batch.accept",
      { "compsoc.registration.event_id": data.eventId },
      async ({ span, setOutcome }) => {
        return await db.transaction(async (tx) => {
          const event = await eventStore.findByIdForUpdate({
            tx,
            data: { id: data.eventId },
          });

          if (!event) {
            setOutcome("event_not_found");
            throw new NotFoundError(`Event with ${data.eventId} not found`);
          }

          const activeCount = await registrationStore.countActiveByEventId({
            db: tx,
            data: { id: data.eventId },
          });

          const spotsLeft = event.capacity ? event.capacity - activeCount : Infinity;
          span.setAttributes({
            "compsoc.registration.active_count": activeCount,
            "compsoc.registration.event_capacity": event.capacity ?? "unlimited",
          });

          if (spotsLeft <= 0) {
            setOutcome("capacity_reached");
            throw new ConflictError("Event is already at or over capacity");
          }

          const toAccept = await registrationStore.getCandidatesOrderedByDate({
            db: tx,
            data: { eventId: data.eventId, limit: spotsLeft },
          });

          if (toAccept.length === 0) {
            span.setAttribute("compsoc.registration.accepted_count", 0);
            setOutcome("no_candidates");
            return { acceptedCount: 0 };
          }

          const userIds = toAccept.map((registration) => registration.userId);
          await registrationStore.updateStatusBatch({
            db: tx,
            data: { eventId: data.eventId, userIds, status: "accepted" },
          });

          span.setAttribute("compsoc.registration.accepted_count", userIds.length);
          setOutcome("accepted");

          return { acceptedCount: userIds.length };
        });
      }
    );
  },

  async batchUpdateStatus({ db, data }: { db: SqlContext; data: UpdateBatchRegistration }) {
    return withRegistrationSpan(
      "registration.batch.update_status",
      {
        "compsoc.registration.event_id": data.eventId,
        "compsoc.registration.target_status": data.status,
        "compsoc.registration.requested_count": data.userIds.length,
      },
      async ({ span, setOutcome }) => {
        return await db.transaction(async (tx) => {
          const event = await eventStore.findById({
            db: tx,
            data: { id: data.eventId },
          });

          if (!event) {
            setOutcome("event_not_found");
            throw new NotFoundError(`Event with ${data.eventId} not found`);
          }

          const updated = await registrationStore.updateStatusBatch({
            db: tx,
            data: {
              eventId: data.eventId,
              userIds: data.userIds,
              status: data.status,
            },
          });

          span.setAttribute("compsoc.registration.updated_count", updated.length);
          setOutcome(updated.length === 0 ? "no_matches" : "updated");

          return { updatedCount: data.userIds.length };
        });
      }
    );
  },

  async deleteRegistration({
    db,
    data,
    userId,
    role,
    sigs,
  }: {
    db: SqlContext;
    data: RegistrationParams;
    userId: string;
    role: UserRole;
    sigs?: Sigs[];
  }) {
    return withRegistrationSpan(
      "registration.delete",
      {
        "compsoc.registration.event_id": data.eventId,
        "compsoc.registration.user_id": data.userId,
        "compsoc.registration.deleted_by_owner": data.userId === userId,
      },
      async ({ setOutcome }) => {
        const registration = await registrationStore.getByUserAndEvent({ db, data });
        if (!registration) {
          setOutcome("not_found");
          throw new NotFoundError("Registration not found");
        }

        const isOwner = data.userId === userId;

        if (!isOwner) {
          const event = await eventStore.findById({
            db,
            data: { id: data.eventId },
          });

          if (!event || !canManageSig(role, sigs, event.organiser)) {
            setOutcome("forbidden");
            throw new ForbiddenError("You do not have permission to delete this registration");
          }
        }

        const deletedRegistration = await registrationStore.delete({ db, data });
        setOutcome("deleted");

        return deletedRegistration;
      }
    );
  },

  async getRegistrationAnalytics({ db, eventId }: { db: SqlContext; eventId: string }) {
    const event = await eventStore.findById({
      db,
      data: { id: eventId },
    });

    if (!event) {
      throw new NotFoundError(`Event with ${eventId} not found`);
    }

    const formSchema = event.form || [];
    const selectFields = formSchema.filter((f) => f.type === "select" && f.options);

    const [countByStatus, countByDate, countByAnswers] = await Promise.all([
      registrationStore.countByStatus({ db, eventId }),
      registrationStore.countByDate({ db, eventId }),
      registrationStore.countByAnswers({ db, eventId, selectFields }),
    ]);

    const totalCount = Object.values(countByStatus).reduce((a, b) => a + b, 0);

    return { totalCount, countByStatus, countByDate, countByAnswers };
  },
};
