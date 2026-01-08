import { eq, and, count, inArray, asc } from "drizzle-orm";
import {
  CreateRegistration,
  RegistrationParams,
  RegistrationsQueryFilter,
  UpdateBatchRegistration,
  UpdateRegistration,
} from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { eventsTable, registrationsTable } from "../../db/schema.js";
import { EventId } from "../events/schema.js";
import { RegistrationStatus } from "@events.comp-soc.com/shared";

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
        and(eq(registrationsTable.eventId, id), inArray(registrationsTable.status, ["accepted"]))
      );

    return result?.count ?? 0;
  },

  async getPendingOrderedByDate({
    db,
    data,
  }: {
    db: SqlContext;
    data: { eventId: string; limit: number };
  }) {
    const { eventId, limit } = data;

    return db
      .select({
        userId: registrationsTable.userId,
        eventId: registrationsTable.eventId,
      })
      .from(registrationsTable)
      .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.status, "pending")))
      .orderBy(asc(registrationsTable.createdAt))
      .limit(limit);
  },

  async updateStatusBatch({ db, data }: { db: SqlContext; data: UpdateBatchRegistration }) {
    const { eventId, userIds, status } = data;

    if (userIds.length === 0) return [];

    return db
      .update(registrationsTable)
      .set({ status, updatedAt: new Date() })
      .where(
        and(eq(registrationsTable.eventId, eventId), inArray(registrationsTable.userId, userIds))
      )
      .returning();
  },

  async getOldestByStatus({
    db,
    data,
  }: {
    db: SqlContext;
    data: { eventId: string; status: RegistrationStatus };
  }) {
    const { eventId, status } = data;

    const [oldest] = await db
      .select({
        userId: registrationsTable.userId,
        eventId: registrationsTable.eventId,
      })
      .from(registrationsTable)
      .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.status, status)))
      .orderBy(asc(registrationsTable.createdAt))
      .limit(1);

    return oldest;
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
