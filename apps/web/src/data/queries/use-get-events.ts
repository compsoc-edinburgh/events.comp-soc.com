import { event } from "../api/event";
import { useQuery } from "@tanstack/react-query";

export const EVENTS_QUERY_KEY = ["events-list"];

export const useGetEvents = () => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: () => event.getEvents(),
    meta: {
      errorMessage: "Failed to fetch events"
    }
  });
};

export default useGetEvents;
