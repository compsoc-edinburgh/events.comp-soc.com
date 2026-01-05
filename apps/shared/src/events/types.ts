import { z } from "zod";
import {
  CustomFieldSchema,
  type EventContractSchema,
  type EventResponseSchema,
} from "./schemas.js";

export type CreateEventRequest = z.infer<typeof EventContractSchema>;
export type UpdateEventRequest = Partial<CreateEventRequest>;
export type Event = z.infer<typeof EventResponseSchema>;

export type CustomField = z.infer<typeof CustomFieldSchema>;
