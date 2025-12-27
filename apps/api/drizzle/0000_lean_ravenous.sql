CREATE TYPE "public"."eventState" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."registrationStatus" AS ENUM('pending', 'accepted', 'waitlist', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'committee');--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"organizer" text NOT NULL,
	"state" "eventState" DEFAULT 'draft',
	"title" text NOT NULL,
	"capacity" integer,
	"date" timestamp NOT NULL,
	"about_markdown" text,
	"location_name" text,
	"location_map_url" text,
	"form" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"status" "registrationStatus" DEFAULT 'pending',
	"form_data" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" "roles" DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_event" ON "registrations" USING btree ("user_id","event_id");