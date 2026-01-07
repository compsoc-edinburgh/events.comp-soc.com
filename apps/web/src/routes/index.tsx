import { createFileRoute } from '@tanstack/react-router'
import { ServerCrash } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EventPriority } from '@events.comp-soc.com/shared'
import EventCard from '@/components/event-card.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { Separator } from '@/components/ui/separator.tsx'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions('published'))
  },
  component: App,
  errorComponent: ({ error }) => (
    <Window activeTab="/">
      <EmptySheet>
        <StatusCard
          title="Oops.. Something happened with events"
          message={
            error.message ||
            'The events API decided to take an unscheduled coffee break.'
          }
          icon={<ServerCrash className="w-10 h-10" strokeWidth={1.5} />}
        />
      </EmptySheet>
    </Window>
  ),
  pendingMs: 200,
})

function App() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions('published'))

  const pinnedEvents = events.filter(
    (event) => event.priority === EventPriority.Pinned,
  )

  const defaultEvents = events.filter(
    (event) => event.priority === EventPriority.Default,
  )

  return (
    <Window activeTab="/">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          Search Events
        </div>

        <Separator className="mt-2 mb-5" />

        <div className="bg-neutral-900/50 p-3 sm:p-4 rounded border-neutral-800 border text-neutral-400 text-xs sm:text-sm leading-relaxed">
          <span className="text-neutral-200 font-medium">
            Welcome to the Compsoc Events Hub.
          </span>{' '}
          This is your central destination for all activities organised by the
          Society and our Special Interest Groups (SIGs).
        </div>

        {events.length === 0 && (
          <div className="h-[58vh] md:h-[55vh] flex items-center justify-center">
            <div className="text-xl font-bold text-neutral-700 pb-32">
              Nothing Found
            </div>
          </div>
        )}

        {pinnedEvents.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                Pinned Events
              </h2>
            </div>
            <div className="grid gap-4">
              {pinnedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {defaultEvents.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                Next Events
              </h2>
            </div>
            <div className="grid gap-4">
              {defaultEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </Sheet>
    </Window>
  )
}
