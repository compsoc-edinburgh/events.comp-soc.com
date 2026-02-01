export const UserRole = {
  Member: "member",
  SigExecutive: "sig_executive",
  Committee: "committee",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
