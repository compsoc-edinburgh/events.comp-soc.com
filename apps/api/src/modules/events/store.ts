import { desc, eq } from "drizzle-orm";
import { SqlContext } from "../../db/db";
import { CreateEventInput, EventIdParams, GetEventsQuery, UpdateEventInput } from "./schema";
import { eventsTable } from "../../db/schema";

export const eventStore = {
  async create(db: SqlContext, data: CreateEventInput) {
    const [newEvent] = await db.insert(eventsTable).values(data).returning();
    return newEvent;
  },

  async update(db: SqlContext, data: UpdateEventInput & EventIdParams) {
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

  async delete(db: SqlContext, params: EventIdParams) {
    const [deletedEvent] = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, params.id))
      .returning();
    return deletedEvent;
  },

  async get(db: SqlContext, query: GetEventsQuery) {
    const { page, limit, state } = query;
    const offset = (page - 1) * limit;

    return db
      .select()
      .from(eventsTable)
      .where(state ? eq(eventsTable.state, state) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(eventsTable.date));
  },

  async findById(db: SqlContext, params: EventIdParams) {
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.id));
    return event;
  },

  async findByIdForUpdate(tx: SqlContext, params: EventIdParams) {
    const [event] = await tx
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, params.id))
      .for("update");
    return event;
  },
};
