import { z } from "zod";
import { UserContractSchema, UserResponseSchema } from "./schemas.js";

/** POST body for creating a user. */
export type CreateUserRequest = z.infer<typeof UserContractSchema>;
/** PATCH body — any subset of `CreateUserRequest`. */
export type UpdateUserRequest = Partial<CreateUserRequest>;
/** User as returned by the API (contract + id/timestamps; email may be null). */
export type User = z.infer<typeof UserResponseSchema>;
