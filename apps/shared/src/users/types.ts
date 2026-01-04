import { z } from "zod";
import { UserContractSchema, UserResponseSchema } from "./schemas";

export type CreateUserRequest = z.infer<typeof UserContractSchema>;
export type UpdateUserRequest = Partial<CreateUserRequest>;
export type User = z.infer<typeof UserResponseSchema>;
