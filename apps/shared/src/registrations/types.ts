import { z } from "zod";
import {
  RegistrationContractSchema,
  RegistrationResponseSchema,
  RegistrationAnswerSchema,
  RegistrationUpdateContractSchema,
  RegistrationStatusBatchUpdateSchema,
  RegistrationBatchAcceptResponseSchema,
  RegistrationBatchUpdateResponseSchema,
  RegistrationAnalyticsResponseSchema,
} from "./schemas.js";

export type CreateRegistrationRequest = z.infer<typeof RegistrationContractSchema>;
export type UpdateRegistrationRequest = z.infer<typeof RegistrationUpdateContractSchema>;
export type RegistrationUpdateStatusBatch = z.infer<typeof RegistrationStatusBatchUpdateSchema>;
export type Registration = z.infer<typeof RegistrationResponseSchema>;
export type RegistrationFormAnswer = z.infer<typeof RegistrationAnswerSchema>;
export type RegistrationBatchAcceptResponse = z.infer<typeof RegistrationBatchAcceptResponseSchema>;
export type RegistrationBatchUpdateResponse = z.infer<typeof RegistrationBatchUpdateResponseSchema>;
export type RegistrationAnalyticsResponse = z.infer<typeof RegistrationAnalyticsResponseSchema>;
