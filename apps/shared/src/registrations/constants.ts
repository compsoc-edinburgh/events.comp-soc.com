/**
 * Lifecycle of a registration. `pending` is the initial state on signup;
 * organisers move users to `accepted` / `rejected`, or to `waitlist` when at capacity.
 */
export const RegistrationStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Waitlist: "waitlist",
  Rejected: "rejected",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
