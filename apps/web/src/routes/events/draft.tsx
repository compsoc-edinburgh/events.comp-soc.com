import { createFileRoute } from '@tanstack/react-router'
import { FileTextIcon } from 'lucide-react'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import EventCard from '@/components/event-card.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { DRAFT_EVENTS } from '@/config/mocks.ts'

export const Route = createFileRoute('/events/draft')({
  component: DraftRoute,
})

function DraftRoute() {
  return (
    <ProtectedRoute activeTab="/events/draft">
      <Window activeTab="/events/draft">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Draft Events
          </div>
          <div>
            <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
              <FileTextIcon className="w-4 h-4" strokeWidth={1.5} />{' '}
              {DRAFT_EVENTS.length} Drafts
            </div>
          </div>

          <div className="h-px bg-neutral-800 my-5" />

          <div className="bg-neutral-900/50 p-3 sm:p-4 rounded border-neutral-800 border text-neutral-400 text-xs sm:text-sm leading-relaxed">
            <span className="text-neutral-200 font-medium">
              Your draft events.
            </span>{' '}
            These events are not yet published and are only visible to you and
            other organisers.
          </div>

          <div className="mt-8 grid gap-4">
            {DRAFT_EVENTS.length > 0 ? (
              DRAFT_EVENTS.map((event) => (
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
    </ProtectedRoute>
  )
}
