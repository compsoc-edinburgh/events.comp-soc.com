import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon } from 'lucide-react'
import type { Event } from '@/components/module/event-card.tsx'
import EventCard from '@/components/module/event-card.tsx'
import Window from '@/components/module/layout/window/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'
import { SearchToolbarContent } from '@/components/module/layout/toolbar-content.tsx'
import { Sigs } from '@/config/sigs.ts'

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

const today = new Date()
const events: Array<Event> = [
  {
    id: 1,
    title: 'Annual General Meeting',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    time: '18:00',
    location: 'Appleton Tower, LT1',
    type: 'Meeting',
    sig: Sigs.Compsoc,
    pinned: true,
  },
  {
    id: 2,
    title: 'Hackathon: FinTech Challenge',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    time: '09:00',
    location: 'Bayes Centre',
    type: 'Hackathon',
    sig: Sigs.Compsoc,
    pinned: true,
  },
  {
    id: 3,
    title: 'Intro to Rust Workshop',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    time: '18:00',
    location: 'Appleton Tower, 5.05',
    sig: Sigs.TypeSig,
    type: 'Workshop',
  },
  {
    id: 4,
    title: 'Guest Speaker: AI Ethics',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    time: '17:30',
    location: 'Gordon Airman Theatre',
    sig: Sigs.EdinburghAI,
    type: 'Talk',
  },
  {
    id: 5,
    title: 'Pub Quiz Night',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
    time: '20:00',
    location: 'The Library Bar',
    sig: Sigs.Tardis,
    type: 'Social',
  },
  {
    id: 6,
    title: 'Machine Learning Study Group',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
    time: '16:00',
    location: 'Informatics Forum, G.07',
    sig: Sigs.EdinburghAI,
    type: 'Study Group',
  },
  {
    id: 7,
    title: 'Game Dev Showcase',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
    time: '19:00',
    location: 'Teviot Row House',
    sig: Sigs.GameDevSig,
    type: 'Showcase',
  },
  {
    id: 8,
    title: 'CV Workshop with Industry Partners',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
    time: '14:00',
    location: 'Appleton Tower, 2.14',
    sig: Sigs.ProjectShare,
    type: 'Career',
  },
]

const pinnedEvents = events.filter((e) => e.pinned)
const thisWeekEvents = events.filter((e) => !e.pinned && isThisWeek(e.date))
const nextEvents = events.filter((e) => !e.pinned && isAfterThisWeek(e.date))

function App() {
  return (
    <Window activeTab="/" toolbarContent={<SearchToolbarContent />}>
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          Search Events
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <CalendarIcon className="w-4 h-4" strokeWidth={1.5} />{' '}
            {events.length} Upcoming Events
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
