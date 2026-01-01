import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon } from 'lucide-react'
import EventCard from '@/components/event-card.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { SEARCH_EVENTS } from '@/config/mocks.ts'

export const Route = createFileRoute('/')({
  component: App,
})

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function isThisWeek(date: Date): boolean {
  const now = new Date()
  const startOfWeek = getStartOfWeek(now)
  const endOfWeek = getEndOfWeek(now)
  return date >= startOfWeek && date <= endOfWeek
}

function isAfterThisWeek(date: Date): boolean {
  const now = new Date()
  const endOfWeek = getEndOfWeek(now)
  return date > endOfWeek
}

const thisWeekEvents = SEARCH_EVENTS.filter(
  (e) => !e.pinned && isThisWeek(e.date),
)
const nextEvents = SEARCH_EVENTS.filter(
  (e) => !e.pinned && isAfterThisWeek(e.date),
)

function App() {
  return (
    <Window activeTab="/">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          Search Events
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <CalendarIcon className="w-4 h-4" strokeWidth={1.5} />{' '}
            {SEARCH_EVENTS.length} Upcoming Events
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

        {thisWeekEvents.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                This Week
              </h2>
            </div>
            <div className="grid gap-4">
              {thisWeekEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {nextEvents.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-neutral-500">
                Next Events
              </h2>
            </div>
            <div className="grid gap-4">
              {nextEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </Sheet>
    </Window>
  )
}
