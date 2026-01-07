import { SqlContext } from "../../db/db.js";
import { CreateUser, UserId, UpdateUser } from "./schema.js";
import { NotFoundError, UnauthorizedError } from "../../lib/errors.js";
import { userStore } from "./store.js";
import { Nullable, UserRole } from "@events.comp-soc.com/shared";

export const userService = {
  async getUserById({
    db,
    data,
    role,
    requesterId,
  }: {
    db: SqlContext;
    data: UserId;
    role: Nullable<UserRole>;
    requesterId: Nullable<string>;
  }) {
    const { id } = data;
    const user = await userStore.getById({ db, data: data });

    if (!user) {
      throw new NotFoundError(`User with ${id} not found`);
    }

    if (role === UserRole.Committee || user.id === requesterId) {
      return user;
    }

    const { email: _, ...publicUserData } = user;
    return publicUserData;
  },

  async createUser({ db, data }: { db: SqlContext; data: CreateUser }) {
    return userStore.create({ db, data });
  },

  async getUserRegistrations({ db, data }: { db: SqlContext; data: UserId }) {
    return userStore.getRegistrationsById({ db, data });
  },

  async updateUser({
    db,
    data,
    role,
    requesterId,
  }: {
    db: SqlContext;
    data: UpdateUser;
    role: Nullable<UserRole>;
    requesterId: Nullable<string>;
  }) {
    const { id } = data;

    const isCommittee = role === UserRole.Committee;
    const isSelf = id === requesterId;

    if (!isCommittee && !isSelf) {
      throw new UnauthorizedError("You can only update your own profile");
    }

    const updated = await userStore.update({ db, data });
    if (!updated) {
      throw new NotFoundError(`User with ${id} not found`);
    }

    return updated;
  },

  async deleteUser({
    db,
    data,
    role,
    requesterId,
  }: {
    db: SqlContext;
    data: UserId;
    role: Nullable<UserRole>;
    requesterId: Nullable<string>;
  }) {
    const { id } = data;

    const isCommittee = role === UserRole.Committee;
    const isSelf = id === requesterId;

    if (!isCommittee && !isSelf) {
      throw new UnauthorizedError("You can only delete your own profile");
    }

    const deleted = await userStore.delete({ db, data });
    if (!deleted) {
      throw new NotFoundError(`User with ${id} not found`);
    }

    return deleted;
  },
};
