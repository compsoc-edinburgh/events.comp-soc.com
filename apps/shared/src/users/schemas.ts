import { z } from "zod";
import { IdSchema } from "../core/schemas.js";

export const UserContractSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
export const UpdateUserContractSchema = UserContractSchema.partial();

export const UserResponseSchema = UserContractSchema.extend({
  id: IdSchema,
  email: z.email().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
