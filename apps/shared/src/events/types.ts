import { z } from "zod";
import {
  CustomFieldSchema,
  type EventContractSchema,
  type EventResponseSchema,
} from "./schemas.js";

/** POST body for creating an event. */
export type CreateEventRequest = z.infer<typeof EventContractSchema>;
/** PATCH body — any subset of `CreateEventRequest`. */
export type UpdateEventRequest = Partial<CreateEventRequest>;
/** Event as returned by the API (contract + server fields). */
export type Event = z.infer<typeof EventResponseSchema>;

/** One field in an event's custom registration form. */
export type CustomField = z.infer<typeof CustomFieldSchema>;
