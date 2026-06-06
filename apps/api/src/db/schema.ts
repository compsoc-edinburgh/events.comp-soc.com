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
  RegistrationAnswer,
  RegistrationStatus,
  UserRole,
  Sigs,
} from "@events.comp-soc.com/shared";

const enumValues = <T extends string>(obj: Record<string, T>): [T, ...T[]] =>
  Object.values(obj) as [T, ...T[]];

export const usersRole = pgEnum("roles", enumValues(UserRole));
export const eventState = pgEnum("eventState", enumValues(EventState));
export const eventPriority = pgEnum("eventPriority", enumValues(EventPriority));
export const registrationStatus = pgEnum("registrationStatus", enumValues(RegistrationStatus));
export const organiserSig = pgEnum("organiserSig", enumValues(Sigs));

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: usersRole("role").default(UserRole.Member).notNull(),
  sigs: json("sigs").$type<Sigs[]>(),
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
    organiser: organiserSig("organiser").notNull(),
    state: eventState("state").default(EventState.Draft).notNull(),
    priority: eventPriority("priority").default(EventPriority.Default).notNull(),
    capacity: integer("capacity"),
    date: timestamp("date").notNull(),
    aboutMarkdown: text("about_markdown"),
    location: text("location"),
    locationUrl: text("location_url"),
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
    status: registrationStatus("status").notNull().default(RegistrationStatus.Pending),
    answers: json("form_data").$type<RegistrationAnswer>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.eventId] }),
    uniqueIndex("unique_user_event").on(table.userId, table.eventId),
  ]
);
