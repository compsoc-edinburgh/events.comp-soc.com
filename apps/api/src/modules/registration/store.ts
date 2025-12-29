import { eq, and, count, inArray } from "drizzle-orm";
import { CreateRegistrationInput, RegistrationParams, UpdateRegistrationInput } from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { registrationsTable } from "../../db/schema.js";

export const registrationStore = {
  async create(db: SqlContext, data: CreateRegistrationInput) {
    const [newRegistration] = await db.insert(registrationsTable).values(data).returning();

    return newRegistration;
  },

  async update(db: SqlContext, params: RegistrationParams, data: UpdateRegistrationInput) {
    const [updatedRegistration] = await db
      .update(registrationsTable)
      .set(data)
      .where(
        and(
          eq(registrationsTable.userId, params.userId),
          eq(registrationsTable.eventId, params.eventId)
        )
      )
      .returning();

    return updatedRegistration;
  },

  async countActiveByEventId(db: SqlContext, eventId: string) {
    const [result] = await db
      .select({ count: count() })
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.eventId, eventId),
          inArray(registrationsTable.status, ["pending", "accepted"])
        )
      );

    return result?.count ?? 0;
  },

  async getByUserAndEvent(db: SqlContext, params: RegistrationParams) {
    const [registration] = await db
      .select()
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, params.userId),
          eq(registrationsTable.eventId, params.eventId)
        )
      );

    return registration;
  },

  async delete(db: SqlContext, params: RegistrationParams) {
    const [deletedRegistration] = await db
      .delete(registrationsTable)
      .where(
        and(
          eq(registrationsTable.userId, params.userId),
          eq(registrationsTable.eventId, params.eventId)
        )
      )
      .returning();

    return deletedRegistration;
  },
};
