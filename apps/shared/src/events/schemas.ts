import { z } from "zod";
import { Sigs } from "../core/constants.js";
import { EventPriority, EventState } from "./constants.js";

export const CustomFieldSchema = z
  .object({
    id: z.string(),
    type: z.enum(["input", "textarea", "select"]),
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

export const EventContractSchema = z.object({
  title: z.string().min(1, "Invalid title"),
  organiser: z.enum(Sigs),
  state: z.enum(EventState),
  priority: z.enum(EventPriority),
  capacity: z.number().min(1).nullable(),
  date: z.iso.datetime(),
  aboutMarkdown: z.string().min(1).nullable(),
  location: z.string().min(1, "Location is required"),
  locationURL: z.url().min(1).nullable(),
  form: z.array(CustomFieldSchema).nullable(),
});
export const UpdateEventContractSchema = EventContractSchema.partial();

export const EventResponseSchema = EventContractSchema.extend({
  id: z.string().min(1, "ID is required"),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
