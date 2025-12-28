import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersRole, usersTable } from "../../db/schema";

export const BaseUserSchema = createInsertSchema(usersTable, {
  id: z.string().min(1, "User ID is required"),
  email: z.email().min(1, "Email is required"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const CreateUserSchema = BaseUserSchema;

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = BaseUserSchema.omit({
  id: true,
  role: true,
}).partial();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UserIdSchema = z.object({
  id: z.coerce.string(),
});

export type UserIdParams = z.infer<typeof UserIdSchema>;
export type UserRole = (typeof usersRole.enumValues)[number];
