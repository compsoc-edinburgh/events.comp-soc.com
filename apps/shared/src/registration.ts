import type { JsonValue } from "./event";
import type { Nullable } from "./utility";

/**
 * Registration status for event registrations
 */
export const RegistrationStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Waitlist: "waitlist",
  Rejected: "rejected",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

/**
 * Core Registration entity - matches API response
 */
export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: Nullable<RegistrationStatus>;
  formData: Nullable<JsonValue>;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
}

/**
 * Input for creating a new registration
 */
export interface CreateRegistrationInput {
  userId: string;
  eventId: string;
  status?: RegistrationStatus;
  formData?: Nullable<JsonValue>;
}

/**
 * Input for updating a registration
 */
export interface UpdateRegistrationInput {
  status?: RegistrationStatus;
  formData?: Nullable<JsonValue>;
}
