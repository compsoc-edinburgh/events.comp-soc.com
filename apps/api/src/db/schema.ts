import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import {
  CustomField,
  EventPriority,
  EventState,
  RegistrationFormAnswer,
  RegistrationStatus,
  UserRole,
} from "@events.comp-soc.com/shared";

export const usersRole = pgEnum("roles", [UserRole.Member, UserRole.Committee]);

export const eventState = pgEnum("eventState", [EventState.Draft, EventState.Published]);
export const eventPriority = pgEnum("eventPriority", [EventPriority.Default, EventPriority.Pinned]);

export const registrationStatus = pgEnum("registrationStatus", [
  RegistrationStatus.Pending,
  RegistrationStatus.Accepted,
  RegistrationStatus.Waitlist,
  RegistrationStatus.Rejected,
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: usersRole("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const eventsTable = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    organiser: text("organiser").notNull(),
    state: eventState("state").default("draft").notNull(),
    priority: eventPriority("priority").default("default").notNull(),
    capacity: integer("capacity"),
    date: timestamp("date").notNull(),
    aboutMarkdown: text("about_markdown"),
    location: text("location"),
    locationURL: text("location_url"),
    form: json("form").$type<Array<CustomField>>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("state_idx").on(table.state)]
);

export const registrationsTable = pgTable(
  "registrations",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    status: registrationStatus("status").default("pending"),
    answers: json("form_data").$type<RegistrationFormAnswer>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.eventId] }),
    uniqueIndex("unique_user_event").on(table.userId, table.eventId),
  ]
);
