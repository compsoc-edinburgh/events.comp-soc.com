import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { IdSchema } from "@events.comp-soc.com/shared";
import { eventsTable } from "../../db/schema.js";

const BaseEventSchema = createInsertSchema(eventsTable);

export const EventIdSchema = z.object({
  id: IdSchema,
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
    id: IdSchema,
  });

export type EventId = z.infer<typeof EventIdSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
