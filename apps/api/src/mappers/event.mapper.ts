import type { Sigs } from "@monorepo/types";
import { EventState } from "@monorepo/types/const";
import type {
  Event as EventModel,
  SearchEvent as SearchEventModel,
} from "@monorepo/types/models";
import type {
  EventCreateInput,
  EventUpdateInput,
} from "@monorepo/types/schemas";
import type { Event as PrismaEvent } from "../../generated/prisma/client";

type EventInput = EventCreateInput | EventUpdateInput;

export const EventMapper = {
  toDB,
  toModel,
  toSearch,
};

export function toDB(
  input: EventInput
): Omit<PrismaEvent, "id" | "createdAt" | "updatedAt"> {
  return {
    organizerSig: input.organizerSig!,
    state: input.state || EventState.Draft,
    heroTitle: input.hero!.title,
    heroTagsCsv: input.hero?.tags?.join(",") || "",
    regEnabled: input.registration?.enabled ?? true,
    regTitle: input.registration?.title || "",
    regDescription: input.registration?.description || "",
    regButtonText: input.registration?.buttonText || "",
    aboutMarkdown: input.aboutMarkdown!,
    locationName: input.location!.name,
    locationDesc: input.location?.description || "",
    mapEmbedUrl: input.location?.mapUrl || "",
    mapTitle: input.location?.mapTitle || "",
    date: input.date!,
    time: input.time!,
    form: input.form || null,
  };
}

export function toModel(dbEvent: PrismaEvent): EventModel {
  const time = dbEvent.time as { start: string; end?: string };
  const form = dbEvent.form as EventModel["form"];

  return {
    id: dbEvent.id,
    organizerSig: dbEvent.organizerSig as Sigs,
    state: dbEvent.state as EventModel["state"],
    hero: {
      title: dbEvent.heroTitle,
      tags: dbEvent.heroTagsCsv
        ? dbEvent.heroTagsCsv.split(",").filter(Boolean)
        : [],
    },
    registration:
      dbEvent.regEnabled ||
      dbEvent.regTitle ||
      dbEvent.regDescription ||
      dbEvent.regButtonText
        ? {
            enabled: dbEvent.regEnabled,
            title: dbEvent.regTitle,
            description: dbEvent.regDescription || null,
            buttonText: dbEvent.regButtonText,
          }
        : null,
    aboutMarkdown: dbEvent.aboutMarkdown,
    location: {
      name: dbEvent.locationName,
      description: dbEvent.locationDesc || null,
      mapUrl: dbEvent.mapEmbedUrl || null,
      mapTitle: dbEvent.mapTitle || null,
    },
    form: form || null,
    date: dbEvent.date,
    time: {
      start: time.start,
      end: time.end || null,
    },
    createdAt: dbEvent.createdAt.toISOString(),
    updatedAt: dbEvent.updatedAt.toISOString(),
  };
}

export function toSearch(dbEvent: PrismaEvent): SearchEventModel {
  const time = dbEvent.time as { start: string; end?: string };

  return {
    id: dbEvent.id,
    organizerSig: dbEvent.organizerSig as Sigs,
    state: dbEvent.state as SearchEventModel["state"],
    heroTitle: dbEvent.heroTitle,
    date: dbEvent.date,
    time: {
      start: time.start,
      end: time.end || null,
    },
    locationName: dbEvent.locationName,
  };
}
