import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";
import { UserIdSchema } from "../users/schema.js";

export const BaseRegistrationSchema = createInsertSchema(registrationsTable);

export const RegistrationStoreSelection = {
  userId: registrationsTable.userId,
  firstName: usersTable.firstName,
  lastName: usersTable.lastName,
  email: usersTable.email,
  eventId: registrationsTable.eventId,
  status: registrationsTable.status,
  answers: registrationsTable.answers,
  createdAt: registrationsTable.createdAt,
  updatedAt: registrationsTable.updatedAt,
  eventTitle: eventsTable.title,
  eventDate: eventsTable.date,
  eventLocation: eventsTable.location,
};

export const CreateRegistrationSchema = BaseRegistrationSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateRegistrationSchema = z.object({
  userId: BaseRegistrationSchema.shape.userId,
  eventId: BaseRegistrationSchema.shape.eventId,
  status: BaseRegistrationSchema.shape.status,
});

export const UpdateBatchStatusRegistrationSchema = z.object({
  eventId: BaseRegistrationSchema.shape.eventId,
  userIds: z.array(BaseRegistrationSchema.shape.userId),
  status: BaseRegistrationSchema.shape.status,
});

export const RegistrationsQueryFilterSchema = z.object({
  userId: UserIdSchema.shape.id.optional(),
  status: BaseRegistrationSchema.shape.status.optional(),
});

export const RegistrationParamsSchema = z.object({
  userId: BaseRegistrationSchema.shape.userId,
  eventId: BaseRegistrationSchema.shape.eventId,
});

export const RegistrationEventIdSchema = z.object({
  eventId: BaseRegistrationSchema.shape.eventId,
});

export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>;
export type UpdateRegistration = z.infer<typeof UpdateRegistrationSchema>;
export type RegistrationParams = z.infer<typeof RegistrationParamsSchema>;
export type RegistrationsQueryFilter = z.infer<typeof RegistrationsQueryFilterSchema>;
export type RegistrationEventId = z.infer<typeof RegistrationEventIdSchema>;
export type UpdateBatchRegistration = z.infer<typeof UpdateBatchStatusRegistrationSchema>;

export type AnalyticsEntry = Record<string, number>;
export type FormAnalyticsEntry = Record<
  string,
  { label: string; data: { option: string; count: number }[] }
>;
