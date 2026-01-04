import { desc, eq } from "drizzle-orm";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, EventsQueryFilter, UpdateEvent } from "./schema.js";
import { eventsTable } from "../../db/schema.js";

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
    const result = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();

    return result[0];
  },

  async get({ db, filters }: { db: SqlContext; filters: EventsQueryFilter }) {
    const { page, limit, state } = filters;
    const offset = (page - 1) * limit;

    return db
      .select()
      .from(eventsTable)
      .where(state ? eq(eventsTable.state, state) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(eventsTable.date));
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
