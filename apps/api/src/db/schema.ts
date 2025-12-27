import { integer, json, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const usersRole = pgEnum("roles", ["user", "committee"]);

export const eventState = pgEnum("eventState", ["draft", "published"]);

export const registrationStatus = pgEnum("registrationStatus", [
  "pending",
  "accepted",
  "waitlist",
  "rejected",
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: usersRole("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const eventsTable = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  organizer: text("organizer").notNull(),
  state: eventState("state").default("draft"),
  title: text("title").notNull(),
  capacity: integer("capacity"),
  date: timestamp("date").notNull(),
  aboutMarkdown: text("about_markdown"),
  locationName: text("location_name"),
  locationMapUrl: text("location_map_url"),
  form: json("form"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const registrationsTable = pgTable(
  "registrations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    status: registrationStatus("status").default("pending"),
    formData: json("form_data"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unq: uniqueIndex("unique_user_event").on(t.userId, t.eventId),
  })
);
