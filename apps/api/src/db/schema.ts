import { integer, json, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const usersRole = pgEnum("roles", ["user", "committee"]);

export const eventState = pgEnum("eventState", ["draft", "published"]);

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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizer: text("organizer").notNull(),
  state: eventState("state").default("draft"),
  title: text("title").notNull(),
  capacity: integer(),
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
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    eventId: integer("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    formData: json("form_data"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    unq: uniqueIndex("unique_user_event").on(t.userId, t.eventId),
  })
);
