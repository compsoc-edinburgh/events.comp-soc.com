ALTER TYPE "public"."roles" ADD VALUE 'sig_executive' BEFORE 'committee';--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sigs" json;