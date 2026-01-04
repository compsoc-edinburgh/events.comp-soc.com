export const UserRole = {
  Member: "member",
  Committee: "committee",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
