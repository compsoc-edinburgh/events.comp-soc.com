import { z } from "zod";
import { FormSchema } from "./form";
import { Sigs } from "../const";

const TimeSchema = z.object({
  start: z.string().min(1, "Start time is required"),
  end: z.string().optional()
});

const HeroSchema = z.object({
  title: z.string().min(1, "Hero title is required"),
  tags: z.array(z.string()).optional()
});

const RegistrationSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional()
});

const LocationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  description: z.string().optional(),
  mapUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  mapTitle: z.string().optional()
});

export const EventCreateSchema = z.object({
  organizerSig: z.nativeEnum(Sigs),
  hero: HeroSchema,
  registration: RegistrationSchema.optional(),
  aboutMarkdown: z.string().min(1, "About markdown is required"),
  location: LocationSchema,
  form: FormSchema.optional(),
  date: z.string().min(1, "Date is required"),
  time: TimeSchema
});

export const EventUpdateSchema = EventCreateSchema.partial();

export type EventCreateInput = z.infer<typeof EventCreateSchema>;
export type EventUpdateInput = z.infer<typeof EventUpdateSchema>;
