/**
 * User roles in the system
 */
export const UserRole = {
  /** Regular user with basic permissions */
  User: "USER",
  /** Committee member with elevated permissions */
  Committee: "COMMITTEE",
  /** SIG leader with event management permissions */
  SigsLeader: "SIGS_LEADER"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
