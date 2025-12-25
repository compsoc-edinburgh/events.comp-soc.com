export const SOCIETY_NAME = "CompSoc";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
