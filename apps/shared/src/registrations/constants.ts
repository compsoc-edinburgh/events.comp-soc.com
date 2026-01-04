export const RegistrationStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Waitlist: "waitlist",
  Rejected: "rejected",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
