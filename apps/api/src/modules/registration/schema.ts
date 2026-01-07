import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { registrationsTable } from "../../db/schema.js";
import { RegistrationStatus } from "@events.comp-soc.com/shared";
import { UserIdSchema } from "../users/schema.js";

export const BaseRegistrationSchema = createInsertSchema(registrationsTable);

export const CreateRegistrationSchema = BaseRegistrationSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateRegistrationSchema = BaseRegistrationSchema.pick({
  userId: true,
  eventId: true,
})
  .partial()
  .extend({
    eventId: BaseRegistrationSchema.shape.eventId,
    userId: BaseRegistrationSchema.shape.userId,
    status: z.enum(RegistrationStatus).default("pending"),
  });

export const RegistrationsQueryFilterSchema = z.object({
  userId: UserIdSchema.shape.id.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(RegistrationStatus).optional(),
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
