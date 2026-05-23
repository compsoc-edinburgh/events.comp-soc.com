import { z } from "zod";
import { RegistrationStatus } from "./constants.js";

/**
 * Query filter for `GET /v1/events/:eventId/registrations`.
 */
export const RegistrationsQueryFilterSchema = z.object({
  userId: z.string().min(1).optional(),
  status: z.enum(RegistrationStatus).optional(),
});

export type RegistrationsQueryFilter = z.infer<typeof RegistrationsQueryFilterSchema>;
