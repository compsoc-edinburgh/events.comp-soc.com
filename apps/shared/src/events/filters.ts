import { z } from "zod";
import { Sigs } from "../core/constants.js";
import { EventState } from "./constants.js";

/**
 * Query filter for `GET /v1/events`.
 *
 * The wire format is HTTP query-string flat values:
 * - `sigs` is a comma-joined string (`sigs=foo,bar`) and parses to `string[]`.
 * - `includePast` is the string `"true"` / `"false"` and parses to a boolean.
 * - `dateFrom` and `dateTo` are inclusive `YYYY-MM-DD` bounds. For a single
 *   day, pass `dateFrom === dateTo`.
 *
 * Consumers (api route + web fetch helper) both rely on the transforms here.
 */
export const EventsQueryFilterSchema = z.object({
  state: z.enum(EventState).optional(),
  includePast: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  search: z.string().trim().min(1).max(200).optional(),
  sigs: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? (val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean) as Sigs[])
        : undefined
    ),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
});

export type EventsQueryFilter = z.infer<typeof EventsQueryFilterSchema>;
