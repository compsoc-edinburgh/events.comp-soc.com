import { z } from "zod";
import { RegistrationStatus } from "./constants.js";

export const RegistrationAnswerSchema = z.record(z.string(), z.string());

export const RegistrationContractSchema = z.object({
  answers: RegistrationAnswerSchema.optional(),
});

export const RegistrationUpdateContractSchema = z.object({
  status: z.enum(RegistrationStatus),
});

export const RegistrationStatusBatchUpdateSchema = z.object({
  userIds: z.array(z.string()),
  status: z.enum(RegistrationStatus),
});

export const RegistrationResponseSchema = RegistrationContractSchema.extend({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  eventId: z.string(),
  eventTitle: z.string().optional(),
  eventDate: z.iso.datetime(),
  eventLocation: z.string().nullable(),
  status: z.enum(RegistrationStatus),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const RegistrationBatchAcceptResponseSchema = z.object({
  acceptedCount: z.number(),
});

export const RegistrationBatchUpdateResponseSchema = z.object({
  updatedCount: z.number(),
});

export const RegistrationAnalyticsResponseSchema = z.object({
  totalCount: z.number(),
  countByStatus: z.record(z.string(), z.number()),
  countByDate: z.record(z.string(), z.number()),
  countByAnswers: z.record(
    z.string(),
    z.object({
      label: z.string(),
      data: z.array(
        z.object({
          option: z.string(),
          count: z.number(),
        })
      ),
    })
  ),
});
