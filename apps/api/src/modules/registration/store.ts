import { eq, and, count, inArray } from "drizzle-orm";
import {
  CreateRegistration,
  RegistrationParams,
  RegistrationsQueryFilter,
  UpdateRegistration,
} from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { eventsTable, registrationsTable } from "../../db/schema.js";
import { EventId } from "../events/schema.js";

export const registrationSelection = {
  userId: registrationsTable.userId,
  eventId: registrationsTable.eventId,
  status: registrationsTable.status,
  createdAt: registrationsTable.createdAt,
  updatedAt: registrationsTable.updatedAt,
  eventTitle: eventsTable.title,
  eventDate: eventsTable.date,
  eventLocation: eventsTable.location,
};

export const registrationStore = {
  async create({ db, data }: { db: SqlContext; data: CreateRegistration }) {
    await db.insert(registrationsTable).values(data).returning();

    return this.getByUserAndEvent({
      db,
      data: { userId: data.userId, eventId: data.eventId },
    });
  },

  async update({ db, data }: { db: SqlContext; data: UpdateRegistration }) {
    const { eventId, userId, ...payload } = data;

    await db
      .update(registrationsTable)
      .set(payload)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)))
      .returning();

    return this.getByUserAndEvent({ db, data: { userId, eventId } });
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
      .select(registrationSelection)
      .from(registrationsTable)
      .innerJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)));

    return registration;
  },

  async get({
    db,
    filters,
  }: {
    db: SqlContext;
    filters: RegistrationsQueryFilter & Pick<EventId, "id">;
  }) {
    const { id, page, limit, status, userId } = filters;
    const offset = (page - 1) * limit;

    return db
      .select(registrationSelection)
      .from(registrationsTable)
      .innerJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .where(
        and(
          eq(registrationsTable.eventId, id),
          userId ? eq(registrationsTable.userId, userId) : undefined,
          status ? eq(registrationsTable.status, status) : undefined
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(registrationsTable.createdAt);
  },

  async delete({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    const { userId, eventId } = data;
    const recordToDelete = await this.getByUserAndEvent({ db, data });

    await db
      .delete(registrationsTable)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)));

    return recordToDelete;
  },
};
