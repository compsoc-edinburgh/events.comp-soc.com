import { eq, and, count, inArray } from "drizzle-orm";
import { CreateRegistration, RegistrationParams, UpdateRegistration } from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { registrationsTable } from "../../db/schema.js";
import { EventId } from "../events/schema.js";

export const registrationStore = {
  async create({ db, data }: { db: SqlContext; data: CreateRegistration }) {
    const [newRegistration] = await db.insert(registrationsTable).values(data).returning();

    return newRegistration;
  },

  async update({ db, data }: { db: SqlContext; data: UpdateRegistration }) {
    const { eventId, userId, ...payload } = data;
    const [updatedRegistration] = await db
      .update(registrationsTable)
      .set(payload)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)))
      .returning();

    return updatedRegistration;
  },

  async countActiveByEventId({ db, data }: { db: SqlContext; data: EventId }) {
    const { id } = data;
    const [result] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.eventId, id),
          inArray(registrationsTable.status, ["pending", "accepted"])
        )
      );

    return result?.count ?? 0;
  },

  async getByUserAndEvent({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    const { userId, eventId } = data;
    const [registration] = await db
      .select()
      .from(registrationsTable)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)));

    return registration;
  },

  async delete({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    const { userId, eventId } = data;
    const [deletedRegistration] = await db
      .delete(registrationsTable)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)))
      .returning();

    return deletedRegistration;
  },
};
