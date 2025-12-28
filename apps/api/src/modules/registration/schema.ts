import { createInsertSchema } from "drizzle-zod";
import { registrationsTable, registrationStatus } from "@/db/schema";
import { z } from "zod";

const BaseRegistrationSchema = createInsertSchema(registrationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateRegistrationInputSchema = BaseRegistrationSchema;
export type CreateRegistrationInput = z.infer<typeof CreateRegistrationInputSchema>;

export const CreateRegistrationBodySchema = z.object({
  formData: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateRegistrationInputSchema = z.object({
  status: z.enum(registrationStatus.enumValues).optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
});
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
