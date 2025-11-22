/**
 * User roles in the system
 */
export const UserRole = {
  User: "USER",
  Committee: "COMMITTEE",
  SigsLeader: "SIGS_LEADER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
