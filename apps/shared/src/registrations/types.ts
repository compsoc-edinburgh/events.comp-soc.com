import { z } from "zod";
import {
  RegistrationContractSchema,
  RegistrationResponseSchema,
  RegistrationAnswerSchema,
  RegistrationUpdateContractSchema,
} from "./schemas";

export type CreateRegistrationRequestSchema = z.infer<typeof RegistrationContractSchema>;
export type UpdateRegistrationRequest = z.infer<typeof RegistrationUpdateContractSchema>;
export type Registration = z.infer<typeof RegistrationResponseSchema>;

export type RegistrationFormAnswer = z.infer<typeof RegistrationAnswerSchema>;
