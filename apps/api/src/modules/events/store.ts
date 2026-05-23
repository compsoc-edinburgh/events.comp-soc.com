import { eq, gte, lt, and, ilike, inArray, SQL } from "drizzle-orm";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, UpdateEvent } from "./schema.js";
import { eventsTable, registrationsTable } from "../../db/schema.js";
import type { EventsQueryFilter, Nullable } from "@events.comp-soc.com/shared";

export const eventStore = {
  async create({ db, data }: { db: SqlContext; data: CreateEvent }) {
    const [newEvent] = await db.insert(eventsTable).values(data).returning();

    return newEvent;
  },

  async update({ db, data }: { db: SqlContext; data: UpdateEvent }) {
    const { id, ...updateData } = data;

    const [updatedEvent] = await db
      .update(eventsTable)
      .set({
        ...updateData,
      })
      .where(eq(eventsTable.id, id))
      .returning();

    return updatedEvent;
  },

  async delete({ db, data }: { db: SqlContext; data: EventId }) {
    const { id } = data;
    return await db.transaction(async (tx) => {
      await tx.delete(registrationsTable).where(eq(registrationsTable.eventId, id));

      const result = await tx.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
      return result[0];
    });
  },

  async get({ db, filters }: { db: SqlContext; filters: EventsQueryFilter }) {
    const { state, includePast, search, sigs, date, dateFrom, dateTo } = filters;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const toUtcDayStart = (value: string) => new Date(`${value}T00:00:00.000Z`);
    const toExclusiveUtcDayEnd = (value: string) => {
      const dayEnd = toUtcDayStart(value);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
      return dayEnd;
    };

    let rangeStart: Nullable<Date> = null;
    let rangeEnd: Nullable<Date> = null;

    if (date) {
      rangeStart = toUtcDayStart(date);
      rangeEnd = toExclusiveUtcDayEnd(date);
    } else {
      rangeStart = dateFrom ? toUtcDayStart(dateFrom) : null;
      rangeEnd = dateTo ? toExclusiveUtcDayEnd(dateTo) : null;
    }

    const conditions = [
      state ? eq(eventsTable.state, state) : null,
      !includePast && !date && !dateFrom && !dateTo ? gte(eventsTable.date, today) : null,
      search ? ilike(eventsTable.title, `%${search}%`) : null,
      sigs && sigs.length > 0 ? inArray(eventsTable.organiser, sigs) : null,
      rangeStart ? gte(eventsTable.date, rangeStart) : null,
      rangeEnd ? lt(eventsTable.date, rangeEnd) : null,
    ].filter((condition): condition is SQL => condition !== null);

    return db
      .select()
      .from(eventsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(eventsTable.date);
  },

  async findById({ db, data }: { db: SqlContext; data: EventId }) {
    const { id } = data;
    const result = await db.select().from(eventsTable).where(eq(eventsTable.id, id));

    return result[0];
  },

  async findByIdForUpdate({ tx, data }: { tx: SqlContext; data: EventId }) {
    const [event] = await tx
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, data.id))
      .for("update");

    return event;
  },
};
