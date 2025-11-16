export const UserRole = {
  User: "USER",
  Committee: "COMMITTEE",
  SigsLeader: "SIGS_LEADER"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;

  createdAt: string;
  updatedAt: string;
};
