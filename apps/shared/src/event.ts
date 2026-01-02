import type { SigId } from "./sigs.js";
import { Nullable } from "./utility.js";

/**
 * Event publication state
 */
export const EventState = {
  Draft: "draft",
  Published: "published",
} as const;

export type EventState = (typeof EventState)[keyof typeof EventState];

/**
 * JSON value type for dynamic form data
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Core Event entity
 */
export interface Event {
  id: string;
  title: string;
  organizer: SigId;
  state: EventState;
  capacity: Nullable<number>;
  date: string;
  aboutMarkdown: Nullable<string>;
  locationName: Nullable<string>;
  locationMapUrl: Nullable<string>;
  form: Nullable<JsonValue>;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}

/**
 * Input for creating a new event
 */
export interface CreateEventInput {
  title: string;
  organizer: SigId;
  state?: EventState;
  capacity?: Nullable<number>;
  date: string | Date;
  aboutMarkdown?: Nullable<string>;
  locationName?: Nullable<string>;
  locationMapUrl?: Nullable<string>;
  form?: Nullable<JsonValue>;
}

/**
 * Input for updating an event
 */
export interface UpdateEventInput {
  title?: string;
  state?: EventState;
  capacity?: Nullable<number>;
  date?: string | Date;
  aboutMarkdown?: Nullable<string>;
  locationName?: Nullable<string>;
  locationMapUrl?: Nullable<string>;
  form?: Nullable<JsonValue>;
}

/**
 * Query parameters for listing events
 */
export interface GetEventsQuery {
  page?: number;
  limit?: number;
  state?: EventState;
}
