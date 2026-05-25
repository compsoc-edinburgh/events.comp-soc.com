import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { IdSchema } from "@events.comp-soc.com/shared";
import { usersTable } from "../../db/schema.js";

export const BaseUserSchema = createInsertSchema(usersTable);

export const UserIdSchema = z.object({
  id: IdSchema,
});

export const CreateUserSchema = BaseUserSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = BaseUserSchema.omit({
  role: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .extend({
    id: IdSchema,
  });

export type UserId = z.infer<typeof UserIdSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
