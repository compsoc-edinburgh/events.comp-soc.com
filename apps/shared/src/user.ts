import type { UserRole } from "./role";
import type { Nullable } from "./utility";

/**
 * Core User entity - matches API response
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Nullable<UserRole>;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}

/**
 * Public user data (without email)
 */
export type PublicUser = Omit<User, "email">;

/**
 * Input for creating a new user
 */
export interface CreateUserInput {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

/**
 * Input for updating a user
 */
export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}
