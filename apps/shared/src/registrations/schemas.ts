import { z } from "zod";
import { RegistrationStatus } from "./constants";

export const RegistrationAnswerSchema = z.record(
  z.string(),
  z.string().or(z.array(z.string())).optional()
);

export const RegistrationContractSchema = z.object({
  answers: RegistrationAnswerSchema.optional().default({}),
});

export const RegistrationUpdateContractSchema = z.object({
  status: z.enum(RegistrationStatus),
});

export const RegistrationResponseSchema = RegistrationContractSchema.extend({
  id: z.string(),
  status: z.enum(RegistrationStatus),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
