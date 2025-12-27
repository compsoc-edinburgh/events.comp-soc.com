import { eq, and, count, inArray } from "drizzle-orm";
import {
  CreateRegistrationInput,
  RegistrationIdParams,
  UpdateRegistrationInput,
} from "@/modules/registration/schema";
import { SqlContext } from "@/db/db";
import { registrationsTable } from "@/db/schema";

export const registrationStore = {
  async create(db: SqlContext, data: CreateRegistrationInput) {
    const [newRegistration] = await db.insert(registrationsTable).values(data).returning();

    return newRegistration;
  },

  async update(db: SqlContext, data: UpdateRegistrationInput & RegistrationIdParams) {
    const { id, ...updatedData } = data;

    const [updatedRegistration] = await db
      .update(registrationsTable)
      .set({
        ...updatedData,
      })
      .where(eq(registrationsTable.id, id))
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

  async getByUserAndEvent(db: SqlContext, userId: string, eventId: string) {
    const result = await db
      .select()
      .from(registrationsTable)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)));

    return result[0];
  },

  async delete(db: SqlContext, params: RegistrationIdParams) {
    const [deletedRegistration] = await db
      .delete(registrationsTable)
      .where(eq(registrationsTable.id, params.id))
      .returning();

    return deletedRegistration;
  },
};
