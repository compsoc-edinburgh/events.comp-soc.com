import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, ServerCrash } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import EventCard from '@/components/event-card.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions())
  },
  component: App,
  errorComponent: ({ error, reset }) => (
    <Window activeTab="/">
      <Sheet>
        <div className="flex items-center justify-center h-[70vh]">
          <StatusCard
            title="Oops.. Something happened with events"
            message={
              error.message ||
              'The events API decided to take an unscheduled coffee break.'
            }
            icon={<ServerCrash className="w-10 h-10" strokeWidth={1.5} />}
            action={{
              label: 'Retry',
              onClick: reset,
            }}
          />
        </div>
      </Sheet>
    </Window>
  ),
  pendingComponent: () => (
    <Window activeTab="/">
      <Sheet>
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-800 rounded mb-4" />
          <div className="h-4 w-32 bg-neutral-900 rounded mb-8" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full bg-neutral-900/50 border border-neutral-800 rounded"
              />
            ))}
          </div>
        </div>
      </Sheet>
    </Window>
  ),
  pendingMs: 0,
})

function App() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions())

  return (
    <Window activeTab="/">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          Search Events
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <CalendarIcon className="w-4 h-4" strokeWidth={1.5} /> 5 Upcoming
            Events
          </div>
        </div>

        <div className="h-px bg-neutral-800 my-5" />

        <div className="bg-neutral-900/50 p-3 sm:p-4 rounded border-neutral-800 border text-neutral-400 text-xs sm:text-sm leading-relaxed">
          <span className="text-neutral-200 font-medium">
            Welcome to the Compsoc Events Hub.
          </span>{' '}
          This is your central destination for all activities organised by the
          Society and our Special Interest Groups (SIGs).
        </div>

        {events.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                This Week
              </h2>
            </div>
            <div className="grid gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                Next Events
              </h2>
            </div>
            <div className="grid gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </Sheet>
    </Window>
  )
}
