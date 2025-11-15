import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
};

export const formatDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return { main: "Today", weekday: null };
  } else if (date.getTime() === tomorrow.getTime()) {
    return { main: "Tomorrow", weekday: null };
  }

  const mainDate = date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric"
  });

  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "long"
  });

  return { main: mainDate, weekday };
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours && hours >= 12 ? "PM" : "AM";
  const displayHours = (hours && hours % 12) || 12;
  return `${displayHours?.toString().padStart(2, "0")}:${minutes
    ?.toString()
    .padStart(2, "0")} ${period}`;
};
