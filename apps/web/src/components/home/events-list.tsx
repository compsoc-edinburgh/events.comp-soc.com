import { EventPriority } from '@events.comp-soc.com/shared'
import type { Event } from '@events.comp-soc.com/shared'
import EventCard from '@/components/event-card.tsx'
import EmptyState from '@/components/layout/empty-state.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

interface EventsListProps {
  events: ReadonlyArray<Event>
  isLoading: boolean
}

function EventsList({ events, isLoading }: EventsListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32.5 w-full" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        image="/page-images/no-events.webp"
        imageAlt="No events"
        title="No events in the queue (yet)"
      />
    )
  }

  const pinnedEvents = events.filter(
    (event) => event.priority === EventPriority.Pinned,
  )
  const defaultEvents = events.filter(
    (event) => event.priority === EventPriority.Default,
  )

  return (
    <div className="grid gap-4">
      {pinnedEvents.map((event) => (
        <EventCard key={event.id} event={event} pinned />
      ))}
      {defaultEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventsList
