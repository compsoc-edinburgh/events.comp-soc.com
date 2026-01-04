import { SqlContext } from "../../db/db.js";
import { CreateRegistration, RegistrationParams, UpdateRegistration } from "./schema.js";
import { eventStore } from "../events/store.js";
import { RegistrationStatus, UserRole } from "@events.comp-soc.com/shared";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../lib/errors.js";
import { registrationStore } from "./store.js";

export const registrationService = {
  async createRegistration({
    db,
    data,
    role,
  }: {
    db: SqlContext;
    data: CreateRegistration;
    role: UserRole;
  }) {
    return await db.transaction(async (tx) => {
      const event = await eventStore.findByIdForUpdate({
        tx,
        data: { id: data.eventId },
      });

      if (!event || (role !== "committee" && event.state === "draft")) {
        throw new NotFoundError(`Event with ${data.eventId} not found`);
      }

      const existing = await registrationStore.getByUserAndEvent({
        db: tx,
        data: { userId: data.userId, eventId: data.eventId },
      });
      if (existing) {
        throw new ConflictError("Already registered");
      }

      let status: RegistrationStatus = "pending";

      if (event.capacity !== null) {
        const currentCount = await registrationStore.countActiveByEventId({
          db: tx,
          data: { id: event.id },
        });

        if (currentCount >= event.capacity) {
          status = "waitlist";
        }
      }

      return await registrationStore.create({
        db: tx,
        data: { ...data, status },
      });
    });
  },

  async updateRegistration({
    db,
    data,
    role,
  }: {
    db: SqlContext;
    data: UpdateRegistration;
    role: UserRole;
  }) {
    if (role !== "committee") {
      throw new UnauthorizedError("Only committee members can update registrations");
    }

    return await db.transaction(async (tx) => {
      const registration = await registrationStore.getByUserAndEvent({
        db: tx,
        data,
      });
      if (!registration) {
        throw new NotFoundError("Registration not found");
      }

      if (data.status === "accepted" && registration.status !== "accepted") {
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
};
