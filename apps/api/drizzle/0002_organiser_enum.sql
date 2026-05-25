CREATE TYPE "public"."organiserSig" AS ENUM('compsoc', 'projectShare', 'bitSig', 'evp', 'cloudSig', 'tardis', 'CCSig', 'typeSig', 'sigInt', 'gameDevSig', 'edinburghAI', 'neuroTechSig', 'quantSig');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "organiser" SET DATA TYPE "public"."organiserSig" USING "organiser"::"public"."organiserSig";
