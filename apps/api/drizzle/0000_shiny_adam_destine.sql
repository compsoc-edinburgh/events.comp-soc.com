CREATE TYPE "public"."eventPriority" AS ENUM('default', 'pinned');--> statement-breakpoint
CREATE TYPE "public"."eventState" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."registrationStatus" AS ENUM('pending', 'accepted', 'waitlist', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('member', 'committee');--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"organiser" text NOT NULL,
	"state" "eventState" DEFAULT 'draft' NOT NULL,
	"priority" "eventPriority" DEFAULT 'default' NOT NULL,
	"capacity" integer,
	"date" timestamp NOT NULL,
	"about_markdown" text,
	"location" text,
	"location_url" text,
	"form" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registrations" (
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
	"role" "roles" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "state_idx" ON "events" USING btree ("state");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_event" ON "registrations" USING btree ("user_id","event_id");