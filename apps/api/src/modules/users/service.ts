import { SqlContext } from "../../db/db";
import { CreateUserInput, UpdateUserInput, UserIdParams, UserRole } from "./schema";
import { NotFoundError, UnauthorizedError } from "../../lib/errors";
import { userStore } from "./store";

export const userService = {
  async getUserById(db: SqlContext, params: UserIdParams, requesterId?: string, role?: UserRole) {
    const user = await userStore.getById(db, params);

    if (!user) {
      throw new NotFoundError(`User with ${params.id} not found`);
    }

    const isCommittee = role === "committee";
    const isSelf = user.id === requesterId;

    if (isCommittee || isSelf) {
      return user;
    }

    const { email: _, ...publicUserData } = user;
    return publicUserData;
  },

  async createUser(db: SqlContext, body: CreateUserInput) {
    return userStore.create(db, body);
  },

  async updateUser(
    db: SqlContext,
    data: UpdateUserInput & UserIdParams,
    requesterId: string,
    role: UserRole
  ) {
    const isCommittee = role === "committee";
    const isSelf = data.id === requesterId;

    if (!isCommittee && !isSelf) {
      throw new UnauthorizedError("You can only update your own profile");
    }

    const updated = await userStore.update(db, data);

    if (!updated) {
      throw new NotFoundError(`User with ${data.id} not found`);
    }

    return updated;
  },

  async deleteUser(db: SqlContext, params: UserIdParams, requesterId: string, role: UserRole) {
    const isCommittee = role === "committee";
    const isSelf = params.id === requesterId;

    if (!isCommittee && !isSelf) {
      throw new UnauthorizedError("You can only delete your own profile");
    }

    const deleted = await userStore.delete(db, params);

    if (!deleted) {
      throw new NotFoundError(`User with ${params.id} not found`);
    }

    return deleted;
  },
};
