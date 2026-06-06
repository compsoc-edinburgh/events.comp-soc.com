import { z } from "zod";
import { Sigs } from "../core/constants.js";
import { IdSchema } from "../core/schemas.js";
import { EventPriority, EventState, FieldType } from "./constants.js";

/**
 * One user-defined field on an event's registration form.
 * `options` is required when `type === "select"` (enforced by `.refine`).
 */
export const CustomFieldSchema = z
  .object({
    id: z.string(),
    type: z.enum(FieldType),
    label: z.string(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      return !(data.type === "select" && (!data.options || data.options.length === 0));
    },
    {
      message: "Select fields must have at least one option",
      path: ["options"],
    }
  );

/** Client-side payload for creating an event (server-managed fields like `id` are added on response). */
export const EventContractSchema = z.object({
  title: z.string().min(1, "Invalid title"),
  organiser: z.enum(Sigs),
  state: z.enum(EventState),
  priority: z.enum(EventPriority),
  capacity: z.number().min(1).nullable(),
  date: z.iso.datetime(),
  aboutMarkdown: z.string().min(1).nullable(),
  location: z.string().min(1, "Location is required"),
  locationUrl: z.url().min(1).nullable(),
  form: z.array(CustomFieldSchema).nullable(),
});
/** PATCH variant — any subset of create-fields. */
export const UpdateEventContractSchema = EventContractSchema.partial();

/** Event as returned by the API — contract fields plus server-assigned identity/timestamps. */
export const EventResponseSchema = EventContractSchema.extend({
  id: IdSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
