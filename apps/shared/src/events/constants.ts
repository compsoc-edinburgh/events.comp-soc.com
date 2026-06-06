/** Publish lifecycle — `draft` is editor-only, `published` is visible to members. */
export const EventState = {
  Draft: "draft",
  Published: "published",
} as const;

/** Input kind for a registration form's custom field. `select` requires `options`. */
export const FieldType = {
  Input: "input",
  Textarea: "textarea",
  Select: "select",
} as const;

export type FieldType = (typeof FieldType)[keyof typeof FieldType];

export type EventState = (typeof EventState)[keyof typeof EventState];

/** Listing rank — `pinned` floats the event to the top of the home feed. */
export const EventPriority = {
  Default: "default",
  Pinned: "pinned",
} as const;

export type EventPriority = (typeof EventPriority)[keyof typeof EventPriority];
