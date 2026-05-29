import type { Sigs } from "@events.comp-soc.com/shared";

export const isHistoricalEvent = (date: Date | string, now = new Date()): boolean => {
  return new Date(date).getTime() < now.getTime();
};

export const scopeSigs = (
  managedSigs: Sigs[] | undefined,
  requestedSigs: Sigs[] | undefined
): Sigs[] => {
  if (!managedSigs || managedSigs.length === 0) return [];
  if (!requestedSigs || requestedSigs.length === 0) return managedSigs;

  const requested = new Set(requestedSigs);
  return managedSigs.filter((sig) => requested.has(sig));
};

export const mergeEventsByDate = <Event extends { id: string; date: Date | string }>(
  ...eventGroups: Event[][]
): Event[] => {
  const eventsById = new Map<string, Event>();

  eventGroups.flat().forEach((event) => {
    eventsById.set(event.id, event);
  });

  return [...eventsById.values()].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
