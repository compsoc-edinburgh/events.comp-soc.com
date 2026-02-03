import { eq, gte, and } from "drizzle-orm";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, EventsQueryFilter, UpdateEvent } from "./schema.js";
import { eventsTable, registrationsTable } from "../../db/schema.js";

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
    const { page, limit, state, includePast } = filters;
    const offset = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const conditions = [];

    if (state) {
      conditions.push(eq(eventsTable.state, state));
    }

    if (!includePast) {
      conditions.push(gte(eventsTable.date, today));
    }

    return db
      .select()
      .from(eventsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
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
