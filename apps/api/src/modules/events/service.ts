import { SqlContext } from "@/db/db";
import {
  CreateEventInput,
  EventIdParams,
  GetEventsQuery,
  UpdateEventInput,
} from "@/modules/events/schema";
import { eventStore } from "./store";
import { UserRole } from "@/modules/users/schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";

export const eventService = {
  async getEvents(db: SqlContext, query: GetEventsQuery, role?: UserRole) {
    const isCommittee = role === "committee";

    const safeQuery = {
      ...query,
      state: isCommittee ? query.state : ("published" as const),
    };

    return eventStore.get(db, safeQuery);
  },

  async getEventById(db: SqlContext, params: EventIdParams, role?: UserRole) {
    const event = await eventStore.findById(db, params);
    const isCommittee = role === "committee";

    if (!event || (!isCommittee && event.state === "draft")) {
      throw new NotFoundError(`Event with ${params.id} not found`);
    }

    return event;
  },

  async createEvent(db: SqlContext, data: CreateEventInput, role: UserRole) {
    if (role !== "committee") {
      throw new UnauthorizedError("Only committee can create an event");
    }

    return eventStore.create(db, data);
  },

  async updateEvent(db: SqlContext, data: UpdateEventInput & EventIdParams, role: UserRole) {
    if (role !== "committee") {
      throw new UnauthorizedError("Only committee members can update events");
    }

    const updated = await eventStore.update(db, data);

    if (!updated) {
      throw new NotFoundError(`Event with ${data.id} not found`);
    }

    return updated;
  },

  async deleteEvent(db: SqlContext, params: EventIdParams, role: UserRole) {
    if (role !== "committee") {
      throw new UnauthorizedError("Only committee can delete an event");
    }

    const deleted = await eventStore.delete(db, params);

    if (!deleted) {
      throw new NotFoundError(`Event with ${params.id} not found`);
    }

    return deleted;
  },
};
