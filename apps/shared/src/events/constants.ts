export const EventState = {
  Draft: "draft",
  Published: "published",
} as const;

export type EventState = (typeof EventState)[keyof typeof EventState];

export const EventPriority = {
  Default: "default",
  Pinned: "pinned",
} as const;

export type EventPriority = (typeof EventPriority)[keyof typeof EventPriority];
