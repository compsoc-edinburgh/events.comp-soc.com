import { registrationStatus } from "#db/schema";
import { z } from "zod";

const FormDataSchema = z.record(z.string(), z.unknown()).nullable().optional();

export const CreateRegistrationInputSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1),
  formData: FormDataSchema,
  status: z.enum(registrationStatus.enumValues).optional(),
});

export type CreateRegistrationInput = z.infer<typeof CreateRegistrationInputSchema>;

export const CreateRegistrationBodySchema = z.object({
  formData: FormDataSchema,
});

export const UpdateRegistrationInputSchema = z
  .object({
    status: z.enum(registrationStatus.enumValues),
    formData: FormDataSchema,
  })
  .partial();

export type UpdateRegistrationInput = z.infer<typeof UpdateRegistrationInputSchema>;

export const EventIdParamsSchema = z.object({
  eventId: z.string().min(1),
});

export const TargetUserParamsSchema = z.object({
  eventId: z.string().min(1),
  targetUserId: z.string().min(1),
});

export const RegistrationParamsSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1),
});

export type RegistrationParams = z.infer<typeof RegistrationParamsSchema>;

export type RegistrationStatus = (typeof registrationStatus.enumValues)[number];
