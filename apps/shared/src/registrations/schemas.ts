import { z } from "zod";
import { RegistrationStatus } from "./constants.js";

export const RegistrationAnswerSchema = z.record(z.string(), z.string());

export const RegistrationContractSchema = z.object({
  answers: RegistrationAnswerSchema.optional().default({}),
});

export const RegistrationUpdateContractSchema = z.object({
  status: z.enum(RegistrationStatus),
});

export const RegistrationResponseSchema = RegistrationContractSchema.extend({
  eventId: z.string(),
  eventTitle: z.string().optional(),
  eventDate: z.iso.datetime(),
  eventLocation: z.string().nullable(),
  status: z.enum(RegistrationStatus),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
