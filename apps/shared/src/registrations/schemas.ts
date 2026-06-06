import { z } from "zod";
import { IdSchema } from "../core/schemas.js";
import { RegistrationStatus } from "./constants.js";

/** Map of custom-field `id` → user's string answer. Free-text and select values both serialise as strings. */
export const RegistrationAnswerSchema = z.record(z.string(), z.string());

/** Client-side payload for signing up to an event. `answers` is omitted when the event has no custom form. */
export const RegistrationContractSchema = z.object({
  answers: RegistrationAnswerSchema.optional(),
});

/** Organiser-driven status transition for a single registration. */
export const UpdateRegistrationContractSchema = z.object({
  status: z.enum(RegistrationStatus),
});

/** Bulk status transition — apply `status` to every listed user's registration. */
export const UpdateRegistrationStatusBatchSchema = z.object({
  userIds: z.array(IdSchema),
  status: z.enum(RegistrationStatus),
});

/**
 * Registration as returned by the API — denormalised with user profile and
 * event metadata so list views don't need extra joins on the client.
 */
export const RegistrationResponseSchema = RegistrationContractSchema.extend({
  userId: IdSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  eventId: IdSchema,
  eventTitle: z.string(),
  eventDate: z.iso.datetime(),
  eventLocation: z.string().nullable(),
  status: z.enum(RegistrationStatus),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** Result of an "accept everyone pending" action. */
export const RegistrationBatchAcceptResponseSchema = z.object({
  acceptedCount: z.number(),
});

/** Result of a generic batch status transition. */
export const RegistrationBatchUpdateResponseSchema = z.object({
  updatedCount: z.number(),
});

/**
 * Aggregated stats for one event's registrations: totals, status mix,
 * signup-by-day counts, and per-custom-field answer distributions.
 */
export const RegistrationAnalyticsResponseSchema = z.object({
  totalCount: z.number(),
  countByStatus: z.record(z.enum(RegistrationStatus), z.number()),
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
