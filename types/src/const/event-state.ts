/**
 * Possible states for an event's lifecycle.
 */
export const EventState = {
  Draft: "DRAFT",
  Uploaded: "UPLOADED"
} as const;

export type EventState = (typeof EventState)[keyof typeof EventState];

