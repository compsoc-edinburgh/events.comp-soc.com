import { eventStore } from "./store.js";
import { SqlContext } from "../../db/db.js";
import { CreateEvent, EventId, UpdateEvent } from "./schema.js";
import { ConflictError, NotFoundError } from "../../lib/errors.js";
import {
  EventState,
  EventsQueryFilter,
  Nullable,
  Sigs,
  UserRole,
} from "@events.comp-soc.com/shared";
import { isHistoricalEvent, mergeEventsByDate, scopeSigs } from "./utils.js";

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

    if (isCommittee) {
      return eventStore.get({ db, filters });
    }

    if (isSigExecutive) {
      const managedSigs = scopeSigs(sigs, filters.sigs);

      if (filters.state === EventState.Draft) {
        if (managedSigs.length === 0) return [];

        return eventStore.get({
          db,
          filters: { ...filters, state: EventState.Draft, sigs: managedSigs },
        });
      }

      const publishedEvents = await eventStore.get({
        db,
        filters: { ...filters, state: EventState.Published },
      });

      if (filters.state === EventState.Published || managedSigs.length === 0) {
        return publishedEvents;
      }

      const draftEvents = await eventStore.get({
        db,
        filters: { ...filters, state: EventState.Draft, sigs: managedSigs },
      });

      return mergeEventsByDate(publishedEvents, draftEvents);
    }

    if (filters.state === EventState.Draft) {
      return [];
    }

    return eventStore.get({
      db,
      filters: { ...filters, state: EventState.Published },
    });
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
      if (isCommittee || (isSigExecutive && sigs && sigs.includes(event.organiser))) {
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

    const existing = await eventStore.findById({ db, data: { id } });
    if (!existing) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    if (isHistoricalEvent(existing.date)) {
      throw new ConflictError("Historical events cannot be edited");
    }

    const updated = await eventStore.update({ db, data });
    if (!updated) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    return updated;
  },

  async deleteEvent({ db, data }: { db: SqlContext; data: EventId }) {
    const { id } = data;

    const existing = await eventStore.findById({ db, data });
    if (!existing) {
      throw new NotFoundError(`Event with ${id} not found`);
    }

    if (isHistoricalEvent(existing.date)) {
      throw new ConflictError("Historical events cannot be deleted");
    }

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
