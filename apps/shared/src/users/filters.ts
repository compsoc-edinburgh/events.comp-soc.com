import { z } from "zod";

/**
 * Query filter for `GET /v1/users/registrations`.
 *
 * Both `dateFrom` and `dateTo` are ISO datetime strings (UTC). Use them to
 * bound the event date range — e.g. `dateFrom = startOfToday()` for
 * upcoming-only, `dateTo = startOfToday()` for archive.
 */
export const UserRegistrationsQueryFilterSchema = z.object({
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
});

export type UserRegistrationsQueryFilter = z.infer<typeof UserRegistrationsQueryFilterSchema>;
