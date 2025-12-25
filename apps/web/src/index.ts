// Web entry point
import { SOCIETY_NAME, formatEventDate, type Event } from "@events.comp-soc.com/shared";

console.log(`Loading ${SOCIETY_NAME} Events...`);

export function displayEvent(event: Event): string {
  return `${event.title} - ${formatEventDate(event.date)}`;
}

