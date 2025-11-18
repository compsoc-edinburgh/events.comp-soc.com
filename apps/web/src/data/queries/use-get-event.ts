import { useQuery } from "@tanstack/react-query";
import { event } from "../api/event";

export const EVENT_QUERY_KEY = (eventId: string) => ["event-details", eventId];

export const useGetEvent = (eventId?: string) => {
  return useQuery({
    queryKey: EVENT_QUERY_KEY(eventId ?? ""),
    queryFn: () => event.getEvent(eventId ?? ""),
    enabled: Boolean(eventId),
    meta: {
      errorMessage: "Failed to fetch event details"
    }
  });
};

export default useGetEvent;
