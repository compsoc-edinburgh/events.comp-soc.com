import { SqlContext } from "#db/db";
import {
  CreateRegistrationInput,
  RegistrationParams,
  RegistrationStatus,
  UpdateRegistrationInput,
} from "#modules/registration/schema";
import { registrationStore } from "#modules/registration/store";
import { ConflictError, NotFoundError, UnauthorizedError } from "#lib/errors";
import { eventStore } from "#modules/events/store";
import { UserRole } from "#modules/users/schema";

export const registrationService = {
  async createRegistration(db: SqlContext, data: CreateRegistrationInput, role: UserRole) {
    const event = await eventStore.findById(db, { id: data.eventId });

    if (!event || (role !== "committee" && event.state === "draft")) {
      throw new NotFoundError(`Event with ${data.eventId} not found`);
    }

    if (event.capacity === null) {
      return await registrationStore.create(db, {
        ...data,
        status: "pending",
      });
    }

    return await db.transaction(async (tx) => {
      const lockedEvent = await eventStore.findByIdForUpdate(tx, {
        id: data.eventId,
      });

      if (!lockedEvent || (role !== "committee" && lockedEvent.state === "draft")) {
        throw new NotFoundError(`Event with ${data.eventId} not found`);
      }

      const count = await registrationStore.countActiveByEventId(tx, lockedEvent.id);

      const status: RegistrationStatus = count >= lockedEvent.capacity! ? "waitlist" : "pending";

      return await registrationStore.create(tx, {
        ...data,
        status,
      });
    });
  },

  async updateRegistration(
    db: SqlContext,
    params: RegistrationParams,
    data: UpdateRegistrationInput,
    role: UserRole
  ) {
    if (role !== "committee") {
      throw new UnauthorizedError("Only committee members can update registrations");
    }

    return await db.transaction(async (tx) => {
      const registration = await registrationStore.getByUserAndEvent(tx, params);
      if (!registration) {
        throw new NotFoundError("Registration not found");
      }

      if (data.status === "accepted" && registration.status !== "accepted") {
        const event = await eventStore.findByIdForUpdate(tx, { id: params.eventId });
        if (!event) {
          throw new NotFoundError(`Event with ${params.eventId} not found`);
        }

        if (event.capacity !== null) {
          const activeCount = await registrationStore.countActiveByEventId(tx, event.id);
          if (activeCount >= event.capacity) {
            throw new ConflictError("Capacity is full for this event");
          }
        }
      }

      return await registrationStore.update(tx, params, data);
    });
  },

  async deleteRegistration(
    db: SqlContext,
    params: RegistrationParams,
    userId: string,
    role: UserRole
  ) {
    const registration = await registrationStore.getByUserAndEvent(db, params);
    if (!registration) {
      throw new NotFoundError("Registration not found");
    }

    const isOwner = params.userId === userId;
    const isCommittee = role === "committee";

    if (!isOwner && !isCommittee) {
      throw new UnauthorizedError("You do not have permission to delete this registration");
    }

    return await registrationStore.delete(db, params);
  },
};
