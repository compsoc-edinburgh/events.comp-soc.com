import { type EventCreateInput, type EventUpdateInput } from "@monorepo/types/schemas";
import { type Event, type SearchEvent } from "@monorepo/types/models";
import { api } from "../client.ts";

const ROUTE_URL = "v1/events";

const createEvent = async (payload: EventCreateInput) => {
  return api.post<EventCreateInput, Event>(ROUTE_URL, payload);
};

const updateEvent = async (id: string, payload: EventUpdateInput) => {
  return api.patch<EventUpdateInput, Event>(`${ROUTE_URL}/${id}`, payload);
};

const getEvents = async () => {
  return api.get<SearchEvent[]>(ROUTE_URL);
};

const getEvent = async (id: string) => {
  return api.get<Event>(`${ROUTE_URL}/${id}`);
};

const deleteEvent = async (id: string) => {
  return api.delete<void>(`${ROUTE_URL}/${id}`);
};

export const event = {
  createEvent,
  updateEvent,
  getEvents,
  getEvent,
  deleteEvent
};
