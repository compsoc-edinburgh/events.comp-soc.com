import { createFileRoute } from '@tanstack/react-router'
import { ServerCrash } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import EventCard from '@/components/event-card.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'

export const Route = createFileRoute('/events/draft')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions('draft', true))
  },
  component: DraftRoute,
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

function DraftRoute() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions('draft', true))

  return (
    <ProtectedRoute activeTab="/events/draft" requireEventManager>
      <Window activeTab="/events/draft">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Draft Events
          </div>

          <Separator className="mt-2 mb-5" />

          <div className="bg-neutral-900/50 p-3 sm:p-4 rounded border-neutral-800 border text-neutral-400 text-xs sm:text-sm leading-relaxed">
            <span className="text-neutral-200 font-medium">
              Your draft events.
            </span>{' '}
            These events are not yet published and are only visible to you and
            other organisers.
          </div>

          {events.length === 0 && (
            <div className="h-[58vh] md:h-[55vh] flex items-center justify-center">
              <div className="text-xl font-bold text-neutral-700 pb-32">
                Nothing Found
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {events.length > 0 &&
              events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
