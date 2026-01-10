import { eq, and, count, inArray, asc, sql } from "drizzle-orm";
import {
  CreateRegistration,
  RegistrationParams,
  RegistrationsQueryFilter,
  UpdateBatchRegistration,
  UpdateRegistration,
} from "./schema.js";
import { SqlContext } from "../../db/db.js";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import { EventId } from "../events/schema.js";
import { CustomField } from "@events.comp-soc.com/shared";

export const registrationSelection = {
  userId: registrationsTable.userId,
  firstName: usersTable.firstName,
  lastName: usersTable.lastName,
  email: usersTable.email,
  eventId: registrationsTable.eventId,
  status: registrationsTable.status,
  answers: registrationsTable.answers,
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

    if (userIds.length === 0) return [];

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
      .select(registrationSelection)
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
      .select(registrationSelection)
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

  async getAnalytics({ db, eventId }: { db: SqlContext; eventId: string }) {
    const [eventData] = await db
      .select({ form: eventsTable.form })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));

    const registrations = await db
      .select({
        status: registrationsTable.status,
        createdAt: registrationsTable.createdAt,
        answers: registrationsTable.answers,
      })
      .from(registrationsTable)
      .where(eq(registrationsTable.eventId, eventId));

    const totalCount = registrations.length;
    const countByStatus: Record<string, number> = {};
    const countByDate: Record<string, number> = {};
    const countByAnswers: Record<
      string,
      { label: string; data: { option: string; count: number }[] }
    > = {};

    const formSchema = (eventData?.form as CustomField[]) || [];
    const selectFields = formSchema.filter((f) => f.type === "select" && f.options);

    selectFields.forEach((field) => {
      countByAnswers[field.id] = {
        label: field.label,
        data: (field.options || []).map((opt) => ({ option: opt, count: 0 })),
      };
    });

    for (const reg of registrations) {
      const status = reg.status || "unknown";
      countByStatus[status] = (countByStatus[status] || 0) + 1;

      const dateKey = reg.createdAt!.toISOString().split("T")[0];
      countByDate[dateKey] = (countByDate[dateKey] || 0) + 1;

      const answers = reg.answers as Record<string, string>;
      if (answers) {
        selectFields.forEach((field) => {
          const userAnswer = answers[field.id];

          if (userAnswer) {
            const bucket = countByAnswers[field.id].data.find((d) => d.option === userAnswer);
            if (bucket) {
              bucket.count++;
            }
          }
        });
      }
    }

    const sortedCountByDate = Object.fromEntries(
      Object.entries(countByDate).sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    );

    return {
      totalCount,
      countByStatus,
      countByDate: sortedCountByDate,
      countByAnswers,
    };
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
