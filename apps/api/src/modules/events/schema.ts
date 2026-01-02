import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { eventsTable } from "../../db/schema.js";
import { EventState, ALL_SIG_IDS } from "@events.comp-soc.com/shared";

const SigIdSchema = z.enum(ALL_SIG_IDS);

const BaseEventSchema = createInsertSchema(eventsTable, {
  title: (schema) => schema.min(1, "Title is required"),
  organizer: SigIdSchema,
  date: z.coerce.date(),
  capacity: z.number().positive().optional(),
  form: z.record(z.string(), z.unknown()).optional(),
});

export const CreateEventSchema = BaseEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema.partial().omit({
  organizer: true,
});

export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;

export const EventIdSchema = z.object({
  id: z.string().min(1),
});

export type EventIdParams = z.infer<typeof EventIdSchema>;

export const GetEventsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  state: z.enum([EventState.Draft, EventState.Published]).optional(),
});

export type GetEventsQuery = z.infer<typeof GetEventsQuerySchema>;
