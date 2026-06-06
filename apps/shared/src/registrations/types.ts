import { z } from "zod";
import {
  RegistrationContractSchema,
  RegistrationResponseSchema,
  RegistrationAnswerSchema,
  UpdateRegistrationContractSchema,
  UpdateRegistrationStatusBatchSchema,
  RegistrationBatchAcceptResponseSchema,
  RegistrationBatchUpdateResponseSchema,
  RegistrationAnalyticsResponseSchema,
} from "./schemas.js";

/** POST body for signing up to an event. */
export type CreateRegistrationRequest = z.infer<typeof RegistrationContractSchema>;
/** PATCH body for transitioning a single registration's status. */
export type UpdateRegistrationRequest = z.infer<typeof UpdateRegistrationContractSchema>;
/** PATCH body for transitioning many registrations to the same status at once. */
export type UpdateRegistrationStatusBatch = z.infer<typeof UpdateRegistrationStatusBatchSchema>;
/** Registration as returned by the API, denormalised with user + event metadata. */
export type Registration = z.infer<typeof RegistrationResponseSchema>;
/** Custom-field `id` → user's answer string. */
export type RegistrationAnswer = z.infer<typeof RegistrationAnswerSchema>;
/** Result of the "accept all pending" bulk action. */
export type RegistrationBatchAcceptResponse = z.infer<typeof RegistrationBatchAcceptResponseSchema>;
/** Result of a generic bulk status transition. */
export type RegistrationBatchUpdateResponse = z.infer<typeof RegistrationBatchUpdateResponseSchema>;
/** Per-event registration analytics — totals, status mix, by-day, and per-field answer counts. */
export type RegistrationAnalyticsResponse = z.infer<typeof RegistrationAnalyticsResponseSchema>;
