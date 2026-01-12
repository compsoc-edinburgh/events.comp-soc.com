import { eventStore } from "./store.js";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, EventsQueryFilter, UpdateEvent } from "./schema.js";
import { NotFoundError } from "../../lib/errors.js";
import { UserRole, EventState, Nullable } from "@events.comp-soc.com/shared";

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
    const isCommittee = role === UserRole.Committee;

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
    const isCommittee = role === UserRole.Committee;

    if (!event || (!isCommittee && event.state === EventState.Draft)) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return event;
  },

  async createEvent({ db, data }: { db: SqlContext; data: CreateEvent }) {
    return eventStore.create({ db, data });
  },

  async updateEvent({ db, data }: { db: SqlContext; data: UpdateEvent }) {
    const { id } = data;

    const updated = await eventStore.update({ db, data });
    if (!updated) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return updated;
  },

  async deleteEvent({ db, data }: { db: SqlContext; data: EventId }) {
    const { id } = data;

    const deleted = await eventStore.delete({ db, data });
    if (!deleted) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return deleted;
  },
};
