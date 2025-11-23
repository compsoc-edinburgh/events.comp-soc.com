import SearchEventCard from "../../modules/search-event-card";
import { formatDateHeader, groupEvents } from "../../lib/utils";
import useGetEvents from "../../data/queries/use-get-events.ts";
import { LoadingState } from "../../modules/states/loading.tsx";
import { ErrorState } from "../../modules/states/error.tsx";
import { EmptyState } from "../../modules/states/empty.tsx";
import { TimelineRail } from "../../components/timeline-rail.tsx";
import { Link } from "react-router-dom";
import { PlusIcon } from "@radix-ui/react-icons";

function Search() {
  const { isLoading, isError, data, refetch } = useGetEvents();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState title="Events" description="Failed to fetch events" refetch={refetch} />;
  }

  if (!data?.length) {
    return <EmptyState title="Events" description="No events found" />;
  }

  const grouped = groupEvents(data);

  return (
    <div className="relative min-h-[68vh] text-white bg-neutral-900">
      <main className="flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <header className="sticky top-0 z-20 py-4 mb-6 bg-neutral-900/50 backdrop-blur-md flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-bold text-2xl">Events</h1>
            <Link
              to="/events/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-neutral-900 font-semibold py-1.5 px-3">
              <PlusIcon />
              <span>Create event</span>
            </Link>
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
