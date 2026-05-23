import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { eventsTable } from "../../db/schema.js";
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

export type EventId = z.infer<typeof EventIdSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
