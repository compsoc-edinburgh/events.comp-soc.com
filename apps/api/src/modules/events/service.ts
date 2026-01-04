import { eventStore } from "./store.js";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, EventsQueryFilter, UpdateEvent } from "./schema.js";
import { NotFoundError, UnauthorizedError } from "../../lib/errors.js";
import {
  UserRole as UserRoleConst,
  EventState,
  Nullable,
  UserRole,
} from "@events.comp-soc.com/shared";

export const eventService = {
  async getEvents({
    db,
    filters,
    role,
  }: {
    db: SqlContext;
    filters: EventsQueryFilter;
    role: Nullable<UserRole>;
  }) {
    const isCommittee = role === UserRoleConst.Committee;

    const authorisedFilters = {
      ...filters,
      state: isCommittee ? filters.state : EventState.Published,
    };

    return eventStore.get({ db, filters: authorisedFilters });
  },

  async getEventById({
    db,
    data,
    role,
  }: {
    db: SqlContext;
    data: EventId;
    role: Nullable<UserRole>;
  }) {
    const { id } = data;
    const event = await eventStore.findById({ db, data });
    const isCommittee = role === UserRoleConst.Committee;

    if (!event || (!isCommittee && event.state === EventState.Draft)) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return event;
  },

  async createEvent({ db, data, role }: { db: SqlContext; data: CreateEvent; role: UserRole }) {
    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee can create an event");
    }

    return eventStore.create({ db, data });
  },

  async updateEvent({ db, data, role }: { db: SqlContext; data: UpdateEvent; role: UserRole }) {
    const { id } = data;

    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee members can update events");
    }

    const updated = await eventStore.update({ db, data });
    if (!updated) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return updated;
  },

  async deleteEvent({ db, data, role }: { db: SqlContext; data: EventId; role: UserRole }) {
    const { id } = data;

    if (role !== UserRoleConst.Committee) {
      throw new UnauthorizedError("Only committee can delete an event");
    }

    const deleted = await eventStore.delete({ db, data });
    if (!deleted) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return deleted;
  },
};
