import { and, eq, gte, lt, SQL } from "drizzle-orm";
import { SqlContext } from "../../db/db.js";
import { CreateUser, UpdateUser, UserId } from "./schema.js";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import { RegistrationStoreSelection } from "../registration/schema.js";
import type { UserRegistrationsQueryFilter } from "@events.comp-soc.com/shared";

export const userStore = {
  async create({ db, data }: { db: SqlContext; data: CreateUser }) {
    const [newUser] = await db.insert(usersTable).values(data).returning();

    return newUser;
  },

  async update({ db, data }: { db: SqlContext; data: UpdateUser }) {
    const { id, ...updatedData } = data;

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...updatedData,
      })
      .where(eq(usersTable.id, id))
      .returning();

    return updatedUser;
  },

  async getById({ db, data }: { db: SqlContext; data: UserId }) {
    const { id } = data;
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id));

    return result[0];
  },

  async getRegistrationsById({
    db,
    data,
    filters,
  }: {
    db: SqlContext;
    data: UserId;
    filters?: UserRegistrationsQueryFilter;
  }) {
    const { id } = data;

    const conditions = [
      eq(registrationsTable.userId, id),
      filters?.from ? gte(eventsTable.date, new Date(filters.from)) : null,
      filters?.until ? lt(eventsTable.date, new Date(filters.until)) : null,
    ].filter((c): c is SQL => c !== null);

    return db
      .select(RegistrationStoreSelection)
      .from(registrationsTable)
      .innerJoin(usersTable, eq(registrationsTable.userId, usersTable.id))
      .innerJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .where(and(...conditions))
      .orderBy(eventsTable.date);
  },

  async delete({ db, data }: { db: SqlContext; data: UserId }) {
    const { id } = data;
    const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();

    return deletedUser;
  },
};
