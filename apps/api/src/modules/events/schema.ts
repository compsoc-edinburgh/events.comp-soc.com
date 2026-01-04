import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { eventsTable } from "../../db/schema.js";
import { EventState } from "@events.comp-soc.com/shared";
import { BaseUserSchema } from "../users/schema.js";

const BaseEventSchema = createInsertSchema(eventsTable);

export const EventIdSchema = BaseEventSchema.pick({
  id: true,
});

export const CreateEventSchema = BaseEventSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateEventSchema = BaseEventSchema.omit({
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    id: BaseUserSchema.shape.id,
  });

export const EventsQueryFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  state: z.enum([EventState.Draft, EventState.Published]).optional(),
});

export type EventId = z.infer<typeof EventIdSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
export type EventsQueryFilter = z.infer<typeof EventsQueryFilterSchema>;
