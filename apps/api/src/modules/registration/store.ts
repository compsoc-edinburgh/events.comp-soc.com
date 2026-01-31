import { eq, and, count, inArray, asc, sql } from "drizzle-orm";
import {
  AnalyticsEntry,
  CreateRegistration,
  FormAnalyticsEntry,
  RegistrationParams,
  RegistrationsQueryFilter,
  RegistrationStoreSelection,
  UpdateBatchRegistration,
  UpdateRegistration,
} from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import { EventId } from "../events/schema.js";
import { CustomField } from "@events.comp-soc.com/shared";

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

  async getCandidatesOrderedByDate({
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
      .where(
        and(
          eq(registrationsTable.eventId, eventId),
          inArray(registrationsTable.status, ["pending", "waitlist"])
        )
      )
      .orderBy(
        sql`CASE 
        WHEN ${registrationsTable.status} = 'pending' THEN 0 
        WHEN ${registrationsTable.status} = 'waitlist' THEN 1
      END`,
        asc(registrationsTable.createdAt)
      )
      .limit(limit);
  },

  async updateStatusBatch({ db, data }: { db: SqlContext; data: UpdateBatchRegistration }) {
    const { eventId, userIds, status } = data;

    return db
      .update(registrationsTable)
      .set({ status, updatedAt: new Date() })
      .where(
        and(eq(registrationsTable.eventId, eventId), inArray(registrationsTable.userId, userIds))
      )
      .returning();
  },

  async getByUserAndEvent({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    const { userId, eventId } = data;

    const [registration] = await db
      .select(RegistrationStoreSelection)
      .from(registrationsTable)
      .innerJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .innerJoin(usersTable, eq(registrationsTable.userId, usersTable.id))
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
    const { id, status, userId } = filters;

    return db
      .select(RegistrationStoreSelection)
      .from(registrationsTable)
      .innerJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .innerJoin(usersTable, eq(registrationsTable.userId, usersTable.id))
      .where(
        and(
          eq(registrationsTable.eventId, id),
          userId ? eq(registrationsTable.userId, userId) : undefined,
          status ? eq(registrationsTable.status, status) : undefined
        )
      )
      .orderBy(registrationsTable.createdAt);
  },

  async countByStatus({ db, eventId }: { db: SqlContext; eventId: string }) {
    const results = await db
      .select({
        status: registrationsTable.status,
        value: count(),
      })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, eventId))
      .groupBy(registrationsTable.status);

    return results.reduce((acc, result) => {
      acc[result.status] = result.value;

      return acc;
    }, {} as AnalyticsEntry);
  },

  async countByDate({ db, eventId }: { db: SqlContext; eventId: string }) {
    const dateSql = sql<string>`to_char(${registrationsTable.createdAt}, 'YYYY-MM-DD')`;

    const results = await db
      .select({
        date: dateSql,
        value: count(),
      })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, eventId))
      .groupBy(dateSql)
      .orderBy(dateSql);

    return results.reduce((acc, result) => {
      acc[result.date] = result.value;

      return acc;
    }, {} as AnalyticsEntry);
  },

  async countByAnswers({
    db,
    eventId,
    selectFields,
  }: {
    db: SqlContext;
    eventId: string;
    selectFields: CustomField[];
  }) {
    const output: FormAnalyticsEntry = {};

    selectFields.forEach((field) => {
      output[field.id] = {
        label: field.label,
        data: (field.options || []).map((option) => ({ option, count: 0 })),
      };
    });

    const results = await db
      .select({ answers: registrationsTable.answers })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, eventId));

    for (const row of results) {
      const answers = row.answers as Record<string, string>;
      if (!answers) continue;

      selectFields.forEach((field) => {
        const userAnswer = answers[field.id];
        if (userAnswer) {
          const bucket = output[field.id].data.find((d) => d.option === userAnswer);
          if (bucket) {
            bucket.count++;
          }
        }
      });
    }

    return output;
  },

  async delete({ db, data }: { db: SqlContext; data: RegistrationParams }) {
    const { userId, eventId } = data;

    const [deleted] = await db
      .delete(registrationsTable)
      .where(and(eq(registrationsTable.userId, userId), eq(registrationsTable.eventId, eventId)))
      .returning();

    return deleted;
  },
};
