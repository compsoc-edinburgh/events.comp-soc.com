import { eventStore } from "./store.js";
import { SqlContext } from "../../db/db.js";
import { CreateEventInput, EventIdParams, GetEventsQuery, UpdateEventInput } from "./schema.js";
import { NotFoundError, UnauthorizedError } from "../../lib/errors.js";
import {
  UserRole as UserRoleConst,
  EventState,
  Nullable,
  UserRole,
} from "@events.comp-soc.com/shared";

export const eventService = {
  async getEvents(db: SqlContext, query: GetEventsQuery, role: Nullable<UserRole>) {
    const isCommittee = role === UserRoleConst.Committee;

    const safeQuery = {
      ...query,
      state: isCommittee ? query.state : EventState.Published,
    };

    return eventStore.get(db, safeQuery);
  },

  async getEventById(db: SqlContext, params: EventIdParams, role: Nullable<UserRole>) {
    const event = await eventStore.findById(db, params);
    const isCommittee = role === UserRoleConst.Committee;

    if (!event || (!isCommittee && event.state === EventState.Draft)) {
      throw new NotFoundError(`Event with ${params.id} not found`);
    }

    return event;
  },

  async createEvent(db: SqlContext, data: CreateEventInput, role: UserRole) {
    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee can create an event");
    }

    return eventStore.create(db, data);
  },

  async updateEvent(db: SqlContext, data: UpdateEventInput & EventIdParams, role: UserRole) {
    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee members can update events");
    }

    const updated = await eventStore.update(db, data);

    if (!updated) {
      throw new NotFoundError(`Event with ${data.id} not found`);
    }

    return updated;
  },

  async deleteEvent(db: SqlContext, params: EventIdParams, role: UserRole) {
    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee can delete an event");
    }

    const deleted = await eventStore.delete(db, params);

    if (!deleted) {
      throw new NotFoundError(`Event with ${params.id} not found`);
    }

    return deleted;
  },
};
