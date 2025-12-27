import { createInsertSchema } from "drizzle-zod";
import { registrationsTable, registrationStatus } from "@/db/schema";
import { z } from "zod";

export const BaseRegistrationSchema = createInsertSchema(registrationsTable).omit({
  id: true,
});

export const CreateRegistrationInputSchema = BaseRegistrationSchema;

export type CreateRegistrationInput = z.infer<typeof CreateRegistrationInputSchema>;

export const UpdateRegistrationInputSchema = BaseRegistrationSchema.omit({
  userId: true,
  eventId: true,
  createdAt: true,
}).partial();

export type UpdateRegistrationInput = z.infer<typeof UpdateRegistrationInputSchema>;

export const RegistrationIdSchema = z.object({
  id: z.coerce.string(),
});

export type RegistrationIdParams = z.infer<typeof RegistrationIdSchema>;
export type RegistrationStatus = (typeof registrationStatus.enumValues)[number];
