import { SqlContext } from "../../db/db.js";
import {
  CreateRegistration,
  RegistrationEventId,
  RegistrationParams,
  RegistrationsQueryFilter,
  UpdateBatchRegistration,
  UpdateRegistration,
} from "./schema.js";
import { eventStore } from "../events/store.js";
import { UserRole } from "@events.comp-soc.com/shared";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../lib/errors.js";
import { registrationStore } from "./store.js";
import { EventId } from "../events/schema.js";

export const registrationService = {
  async createRegistration({ db, data }: { db: SqlContext; data: CreateRegistration }) {
    return await db.transaction(async (tx) => {
      const event = await eventStore.findById({
        db: tx,
        data: { id: data.eventId },
      });

      if (event.state === "draft") {
        throw new NotFoundError(`Event with ${data.eventId} not found`);
      }

      const existing = await registrationStore.getByUserAndEvent({
        db: tx,
        data: { userId: data.userId, eventId: data.eventId },
      });

      if (existing) {
        throw new ConflictError("Already registered");
      }

      return await registrationStore.create({
        db: tx,
        data: { ...data, status: "pending" },
      });
    });
  },

  async getRegistrationByUser({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    return await registrationStore.getByUserAndEvent({
      db,
      data,
    });
  },

  async getRegistrations({
    db,
    filters,
  }: {
    db: SqlContext;
    filters: RegistrationsQueryFilter & Pick<EventId, "id">;
  }) {
    return registrationStore.get({ db, filters });
  },

  async updateRegistration({ db, data }: { db: SqlContext; data: UpdateRegistration }) {
    return await db.transaction(async (tx) => {
      const registration = await registrationStore.getByUserAndEvent({
        db: tx,
        data,
      });

      if (!registration) {
        throw new NotFoundError("Registration not found");
      }

      const isTransitioningToAccepted =
        data.status === "accepted" && registration.status !== "accepted";

      if (isTransitioningToAccepted) {
        const event = await eventStore.findByIdForUpdate({
          tx,
          data: { id: data.eventId },
        });

        if (!event) {
          throw new NotFoundError(`Event with ${data.eventId} not found`);
        }

        if (event.capacity !== null) {
          const activeCount = await registrationStore.countActiveByEventId({
            db: tx,
            data: { id: event.id },
          });

          if (activeCount >= event.capacity) {
            throw new ConflictError("Cannot accept: Event capacity has been reached");
          }
        }
      }

      return await registrationStore.update({
        db: tx,
        data,
      });
    });
  },

  async batchAcceptRegistration({ db, data }: { db: SqlContext; data: RegistrationEventId }) {
    return await db.transaction(async (tx) => {
      const event = await eventStore.findByIdForUpdate({
        tx,
        data: { id: data.eventId },
      });

      const activeCount = await registrationStore.countActiveByEventId({
        db: tx,
        data: { id: data.eventId },
      });

      const spotsLeft = event.capacity ? event.capacity - activeCount : Infinity;
      if (spotsLeft <= 0) {
        throw new ConflictError("Event is already at or over capacity");
      }

      const toAccept = await registrationStore.getCandidatesOrderedByDate({
        db: tx,
        data: { eventId: data.eventId, limit: spotsLeft },
      });

      if (toAccept.length === 0) {
        return { acceptedCount: 0 };
      }

      const userIds = toAccept.map((r) => r.userId);
      await registrationStore.updateStatusBatch({
        db: tx,
        data: { eventId: data.eventId, userIds, status: "accepted" },
      });

      return { acceptedCount: userIds.length };
    });
  },

  async batchUpdateStatus({ db, data }: { db: SqlContext; data: UpdateBatchRegistration }) {
    return await db.transaction(async (tx) => {
      const event = await eventStore.findById({
        db: tx,
        data: { id: data.eventId },
      });

      if (!event) {
        throw new NotFoundError(`Event with ${data.eventId} not found`);
      }

      await registrationStore.updateStatusBatch({
        db: tx,
        data: {
          eventId: data.eventId,
          userIds: data.userIds,
          status: data.status,
        },
      });

      return { updatedCount: data.userIds.length };
    });
  },

  async deleteRegistration({
    db,
    data,
    userId,
    role,
  }: {
    db: SqlContext;
    data: RegistrationParams;
    userId: string;
    role: UserRole;
  }) {
    const registration = await registrationStore.getByUserAndEvent({ db, data });
    if (!registration) {
      throw new NotFoundError("Registration not found");
    }

    const isOwner = data.userId === userId;
    const isCommittee = role === "committee";

    if (!isOwner && !isCommittee) {
      throw new UnauthorizedError("You do not have permission to delete this registration");
    }

    return await registrationStore.delete({ db, data });
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
