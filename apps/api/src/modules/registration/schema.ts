import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { registrationsTable, registrationStatus } from "../../db/schema";

export const BaseRegistrationSchema = createInsertSchema(registrationsTable).omit({
  id: true,
});

export const CreateRegistrationInputSchema = BaseRegistrationSchema;

export type CreateRegistrationInput = z.infer<typeof CreateRegistrationInputSchema>;

export const CreateRegistrationBodySchema = BaseRegistrationSchema.pick({
  formData: true,
});

export const UpdateRegistrationInputSchema = BaseRegistrationSchema.omit({
  userId: true,
  eventId: true,
  createdAt: true,
}).partial();

export type UpdateRegistrationInput = z.infer<typeof UpdateRegistrationInputSchema>;

export const RegistrationParamsSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
});

export type RegistrationParams = z.infer<typeof RegistrationParamsSchema>;

export const EventIdParamsSchema = z.object({
  eventId: z.string(),
});

export const TargetUserParamsSchema = z.object({
  eventId: z.string(),
  targetUserId: z.string(),
});
export type RegistrationStatus = (typeof registrationStatus.enumValues)[number];
