import type { Event as PrismaEvent } from "../../generated/prisma/client";
import type {
  Event as EventModel,
  SearchEvent as SearchEventModel
} from "@monorepo/types/models";
import type {
  EventCreateInput,
  EventUpdateInput
} from "@monorepo/types/schemas";
import type {Sigs} from "@monorepo/types";

type EventInput = EventCreateInput | EventUpdateInput;

export const EventMapper = {
  toDB,
  toModel,
  toSearch
};

export function toDB(
  input: EventInput
): Omit<PrismaEvent, "id" | "createdAt" | "updatedAt"> {
  return {
    organizerSig: input.organizerSig!,
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
    form: input.form || null
  };
}

export function toModel(dbEvent: PrismaEvent): EventModel {
  const time = dbEvent.time as { start: string; end?: string };
  const form = dbEvent.form as EventModel["form"];

  return {
    id: dbEvent.id,
    organizerSig: dbEvent.organizerSig as Sigs,
    hero: {
      title: dbEvent.heroTitle,
      tags: dbEvent.heroTagsCsv
        ? dbEvent.heroTagsCsv.split(",").filter(Boolean)
        : undefined
    },
    registration:
      dbEvent.regEnabled ||
      dbEvent.regTitle ||
      dbEvent.regDescription ||
      dbEvent.regButtonText
        ? {
            enabled: dbEvent.regEnabled,
            title: dbEvent.regTitle,
            description: dbEvent.regDescription || undefined,
            buttonText: dbEvent.regButtonText
          }
        : undefined,
    aboutMarkdown: dbEvent.aboutMarkdown,
    location: {
      name: dbEvent.locationName,
      description: dbEvent.locationDesc || undefined,
      mapUrl: dbEvent.mapEmbedUrl || undefined,
      mapTitle: dbEvent.mapTitle || undefined
    },
    form: form || undefined,
    date: dbEvent.date,
    time: time,
    createdAt: dbEvent.createdAt.toISOString(),
    updatedAt: dbEvent.updatedAt.toISOString()
  };
}

export function toSearch(dbEvent: PrismaEvent): SearchEventModel {
  const time = dbEvent.time as { start: string; end?: string };

  return {
    id: dbEvent.id,
    organizerSig: dbEvent.organizerSig as Sigs,
    heroTitle: dbEvent.heroTitle,
    date: dbEvent.date,
    time: time,
    locationName: dbEvent.locationName
  };
}
