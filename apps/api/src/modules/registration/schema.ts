import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { IdSchema } from "@events.comp-soc.com/shared";
import { registrationsTable } from "../../db/schema.js";

export const BaseRegistrationSchema = createInsertSchema(registrationsTable);

export const CreateRegistrationSchema = BaseRegistrationSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateRegistrationSchema = z.object({
  userId: IdSchema,
  eventId: IdSchema,
  status: BaseRegistrationSchema.shape.status,
});

export const UpdateBatchStatusRegistrationSchema = z.object({
  eventId: IdSchema,
  userIds: z.array(IdSchema),
  status: BaseRegistrationSchema.shape.status,
});

export const RegistrationParamsSchema = z.object({
  userId: IdSchema,
  eventId: IdSchema,
});

export const RegistrationEventIdSchema = z.object({
  eventId: IdSchema,
});

export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>;
export type UpdateRegistration = z.infer<typeof UpdateRegistrationSchema>;
export type RegistrationParams = z.infer<typeof RegistrationParamsSchema>;
export type RegistrationEventId = z.infer<typeof RegistrationEventIdSchema>;
export type UpdateBatchRegistration = z.infer<typeof UpdateBatchStatusRegistrationSchema>;

export type AnalyticsEntry = Record<string, number>;
export type FormAnalyticsEntry = Record<
  string,
  { label: string; data: { option: string; count: number }[] }
>;
