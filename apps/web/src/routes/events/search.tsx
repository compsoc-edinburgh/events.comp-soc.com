import { formatDateHeader } from "../../lib/utils";
import SearchEventCard from "../../modules/search-event-card";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import useGetEvents from "../../data/queries/use-get-events.ts";
import type { SearchEvent } from "@monorepo/types";
import { useMemo } from "react";
import { Spinner } from "../../components/spinner";

function Search() {
  const { isLoading, isError, data, refetch } = useGetEvents();

  const events = useMemo(() => data || [], [data]);

  const groupedEvents = useMemo(() => {
    if (!events.length) return {};

    return events.reduce(
      (groups, event) => {
        const date = event.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(event);
        return groups;
      },
      {} as Record<string, SearchEvent[]>
    );
  }, [events]);

  if (isLoading) {
    return (
      <div className="relative min-h-[68vh] text-white bg-neutral-900">
        <main className="flex flex-col items-center justify-center py-20">
          <Spinner className="size-8 text-neutral-400" />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative min-h-[68vh] text-white bg-neutral-900">
        <main className="flex flex-col items-center justify-center py-20">
          <h1 className="font-bold text-3xl mb-6">Events</h1>
          <p className="text-neutral-400 text-lg mb-4">Failed to load events</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium hover:cursor-pointer">
            Try again
          </button>
        </main>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="relative min-h-[68vh] text-white bg-neutral-900">
        <main className="flex flex-col items-center py-20">
          <h1 className="font-bold text-3xl mb-6">Events</h1>
          <p className="text-neutral-400 text-lg">No events available</p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-[68vh] text-white bg-neutral-900">
      <main className="flex flex-col items-center relative">
        <div className="max-w-4xl w-full">
          <div
            className="sticky top-0 z-20 flex justify-between items-center
              py-4 mb-6 backdrop-blur-md bg-neutral-900/50 mask-gradient">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">Events</h1>

            <div className="flex items-center gap-2">
              <button className="flex items-center text-sm sm:text-xs md:text-sm font-medium bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors px-2 gap-2 py-2">
                <PlusIcon className="w-5 h-5" /> Create Event
              </button>

              <button className="flex items-center text-sm sm:text-xs md:text-sm font-medium bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors px-2 gap-2 py-2">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-[3px] top-0 bottom-0 w-px">
              <div
                className="h-full w-full bg-linear-to-b from-neutral-700 to-transparent"
                style={{
                  maskImage:
                    "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 10px)",
                  WebkitMaskImage:
                    "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 10px)"
                }}
              />
            </div>

            {Object.entries(groupedEvents).map(([date, items]) => {
              const formatted = formatDateHeader(date);

              return (
                <div key={date} className="relative mb-10 sm:mb-12">
                  <div className="absolute -left-6 sm:-left-8 top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>

                  <h2 className="mb-3 sm:mb-4">
                    <span className="text-sm sm:text-base md:text-lg font-semibold">
                      {formatted.main}
                    </span>
                    {formatted.weekday && (
                      <span className="text-sm sm:text-base md:text-lg text-neutral-500 ml-2">
                        {formatted.weekday}
                      </span>
                    )}
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    {items.map((ev) => (
                      <SearchEventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Search;
