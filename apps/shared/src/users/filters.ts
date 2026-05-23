import { z } from "zod";

/**
 * Query filter for `GET /v1/users/registrations`.
 *
 * Both `from` and `until` are ISO datetime strings (UTC). Use them to bound
 * the event date range — e.g. `from = startOfToday()` for upcoming-only,
 * `until = startOfToday()` for archive.
 */
export const UserRegistrationsQueryFilterSchema = z.object({
  /** Inclusive lower bound — return events with date >= from. */
  from: z.iso.datetime().optional(),
  /** Exclusive upper bound — return events with date < until. */
  until: z.iso.datetime().optional(),
});

export type UserRegistrationsQueryFilter = z.infer<typeof UserRegistrationsQueryFilterSchema>;
