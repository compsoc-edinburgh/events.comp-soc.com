/**
 * User roles in the system
 */
export const UserRole = {
  User: "user",
  Committee: "committee",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
