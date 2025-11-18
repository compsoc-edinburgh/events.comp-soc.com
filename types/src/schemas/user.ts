import { z } from "zod";
import { UserRole } from "../const";

export const UserUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(UserRole).optional()
});

export const UserCreateSchema = UserUpdateSchema.extend({
  role: z.enum(UserRole).default(UserRole.User)
});

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
