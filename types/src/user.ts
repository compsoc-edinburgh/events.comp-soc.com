export type UserRole = "USER" | "COMMITTEE" | "SIGS_LEADER";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;

  createdAt: string;
  updatedAt: string;
};
