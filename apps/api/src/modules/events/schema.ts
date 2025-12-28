import { z } from "zod";
import { eventState } from "@/db/schema";

const FormSchema = z.record(z.string(), z.unknown()).nullable().optional();

export const CreateEventSchema = z.object({
  organizer: z.string().min(1, "Organizer is required"),
  title: z.string().min(1, "Title is required"),
  date: z.coerce.date(),
  state: z.enum(eventState.enumValues).optional(),
  capacity: z.number().int().positive().nullable().optional(),
  aboutMarkdown: z.string().nullable().optional(),
  locationName: z.string().nullable().optional(),
  locationMapUrl: z.string().nullable().optional(),
  form: FormSchema,
});
export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema.partial();
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;

export const EventIdSchema = z.object({
  id: z.string().min(1),
});

export type EventIdParams = z.infer<typeof EventIdSchema>;

export const GetEventsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  state: z.enum(eventState.enumValues).optional(),
});

export type GetEventsQuery = z.infer<typeof GetEventsQuerySchema>;
