import SearchEventCard from "../../modules/search-event-card";
import { filterEvents, formatDateHeader, groupEvents } from "../../lib/utils";
import useGetEvents from "../../data/queries/use-get-events.ts";
import { useState } from "react";
import { LoadingState } from "../../modules/states/loading.tsx";
import { ErrorState } from "../../modules/states/error.tsx";
import { EmptyState } from "../../modules/states/empty.tsx";
import { SearchBar } from "../../components/search-bar.tsx";
import { TimelineRail } from "../../components/timeline-rail.tsx";

function Search() {
  const { isLoading, isError, data, refetch } = useGetEvents();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState title="Events" description="Failed to fetch events" refetch={refetch} />;
  }

  if (!data?.length) {
    return <EmptyState title="Events" description="No events found" />;
  }

  const filtered = filterEvents(data, searchTerm);
  const grouped = groupEvents(filtered);

  return (
    <div className="relative min-h-[68vh] text-white bg-neutral-900">
      <main className="flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <header className="sticky top-0 z-20 py-4 mb-6 bg-neutral-900/50 backdrop-blur-md flex justify-between items-center">
            <h1 className="font-bold text-3xl">Events</h1>
            <div>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </header>

          <div className="relative pl-6 sm:pl-8">
            <TimelineRail />

            {Object.entries(grouped).map(([date, items]) => {
              const formatted = formatDateHeader(date);

              return (
                <section key={date} className="relative mb-10 sm:mb-12">
                  <h2 className="text-lg font-semibold mb-3">
                    {formatted.main}
                    <span className="text-neutral-500 ml-2">{formatted.weekday}</span>
                  </h2>

                  <div className="space-y-4">
                    {items.map((ev) => (
                      <SearchEventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Search;
