import { eq } from "drizzle-orm";
import { SqlContext } from "../../db/db.js";
import { CreateUserInput, UpdateUserInput, UserIdParams } from "./schema.js";
import { usersTable } from "../../db/schema.js";

export const userStore = {
  async create(db: SqlContext, data: CreateUserInput) {
    const [newUser] = await db.insert(usersTable).values(data).returning();

    return newUser;
  },

  async update(db: SqlContext, data: UpdateUserInput & UserIdParams) {
    const { id, ...updatedData } = data;

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...updatedData,
      })
      .where(eq(usersTable.id, id))
      .returning();

    return updatedUser;
  },

  async getById(db: SqlContext, data: UserIdParams) {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, data.id));

    return result[0];
  },

  async delete(db: SqlContext, params: UserIdParams) {
    const [deletedUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, params.id))
      .returning();

    return deletedUser;
  },
};
