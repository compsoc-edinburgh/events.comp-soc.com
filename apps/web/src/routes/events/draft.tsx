import { createFileRoute } from '@tanstack/react-router'
import { FileTextIcon } from 'lucide-react'
import type { Event } from '@/components/module/event-card.tsx'
import Window from '@/components/module/layout/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'
import { SearchToolbarContent } from '@/components/module/layout/toolbar-content.tsx'
import EventCard from '@/components/module/event-card.tsx'

const draftEvents: Array<Event> = [
  {
    id: 101,
    title: 'Machine Learning Workshop (Draft)',
    date: 'TBD',
    time: 'TBD',
    location: 'TBD',
    description:
      'An introduction to ML fundamentals. Still working on speaker confirmation.',
    type: 'Workshop',
  },
  {
    id: 102,
    title: 'Networking Event (Draft)',
    date: 'Nov 2025',
    time: 'Evening',
    location: 'Teviot',
    description: 'Industry networking event - awaiting sponsor confirmation.',
    type: 'Social',
  },
]

export const Route = createFileRoute('/events/draft')({
  component: DraftRoute,
})

function DraftRoute() {
  return (
    <Window activeTab="/events/draft" toolbarContent={<SearchToolbarContent />}>
      <Sheet>
        <div className="text-2xl font-bold gap-2 items-center flex text-white">
          Draft Events
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <FileTextIcon className="w-4 h-4" strokeWidth={1.5} />{' '}
            {draftEvents.length} Drafts
          </div>
        </div>

        <div className="h-px bg-neutral-800 my-5" />

        <div className="bg-neutral-900/50 p-4 rounded border-neutral-800 border text-neutral-400 text-sm leading-relaxed">
          <span className="text-neutral-200 font-medium">
            Your draft events.
          </span>{' '}
          These events are not yet published and are only visible to you and
          other organisers.
        </div>

        <div className="mt-8 grid gap-4">
          {draftEvents.length > 0 ? (
            draftEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-neutral-500 text-center py-8">
              No draft events. Create a new event to get started.
            </div>
          )}
        </div>
      </Sheet>
    </Window>
  )
}
