import { eventStore } from "./store.js";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, EventsQueryFilter, UpdateEvent } from "./schema.js";
import { NotFoundError } from "../../lib/errors.js";
import { UserRole, EventState, Nullable, Sigs } from "@events.comp-soc.com/shared";

export const eventService = {
  async getEvents({
    db,
    filters,
    role,
    sigs,
  }: {
    db: SqlContext;
    filters: EventsQueryFilter;
    role: Nullable<UserRole>;
    sigs?: Sigs[];
  }) {
    const isCommittee = role === UserRole.Committee;
    const isSigExecutive = role === UserRole.SigExecutive;

    const authorisedFilters = {
      ...filters,
      state: isCommittee ? filters.state : EventState.Published,
    };

    let events = await eventStore.get({ db, filters: authorisedFilters });

    if (isSigExecutive && sigs && sigs.length > 0 && !filters.state) {
      const draftEvents = await eventStore.get({
        db,
        filters: { ...filters, state: EventState.Draft },
      });

      const sigDraftEvents = draftEvents.filter((e) => sigs.includes(e.organiser as Sigs));
      events = [...events, ...sigDraftEvents];

      events = events
        .filter((event, index, self) => index === self.findIndex((e) => e.id === event.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return events;
  },

  async getEventById({
    db,
    data,
    role,
    sigs,
  }: {
    db: SqlContext;
    data: EventId;
    role: Nullable<UserRole>;
    sigs?: Sigs[];
  }) {
    const { id } = data;
    const event = await eventStore.findById({ db, data });
    const isCommittee = role === UserRole.Committee;
    const isSigExecutive = role === UserRole.SigExecutive;

    if (!event) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    if (event.state === EventState.Draft) {
      if (isCommittee) {
        return event;
      }
      if (isSigExecutive && sigs && sigs.includes(event.organiser as Sigs)) {
        return event;
      }
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

  async getEventForAuth({ db, data }: { db: SqlContext; data: EventId }) {
    return eventStore.findById({ db, data });
  },
};
