import { usersRole } from "@/db/schema";
import { z } from "zod";

export const CreateUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(usersRole.enumValues).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
}).partial();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UserIdSchema = z.object({
  id: z.string().min(1),
});

export type UserIdParams = z.infer<typeof UserIdSchema>;

export type UserRole = (typeof usersRole.enumValues)[number];
