/**
 * Authorisation level. `member` is the default; `sig_executive` can manage
 * their own SIG's events; `committee` can manage all SIGs. See `permissions.ts`.
 */
export const UserRole = {
  Member: "member",
  SigExecutive: "sig_executive",
  Committee: "committee",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
