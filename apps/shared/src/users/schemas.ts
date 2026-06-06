import { z } from "zod";
import { IdSchema } from "../core/schemas.js";

/** Client-supplied user profile fields (excludes id/timestamps and role). */
export const UserContractSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
/** PATCH variant — any subset of contract fields. */
export const UpdateUserContractSchema = UserContractSchema.partial();

/**
 * User as returned by the API. `email` is nullable here since is returned
 * only for the user itself or the committee to not overshare data.
 */
export const UserResponseSchema = UserContractSchema.extend({
  id: IdSchema,
  email: z.email().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
