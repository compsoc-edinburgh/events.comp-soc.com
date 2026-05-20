import { createFileRoute } from '@tanstack/react-router'
import { Search, ServerCrash } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { EventPriority } from '@events.comp-soc.com/shared'
import EventCard from '@/components/event-card.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { ALL_SIGS } from '@/config/sigs.ts'

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
  const [selectedSig, setSelectedSig] = useState<string | null>(null)
  const [eventSearch, setEventSearch] = useState('')
  const [eventsTab, setEventsTab] = useState<'upcoming' | 'drafts'>('upcoming')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const search = eventSearch.trim().toLowerCase()
  const matchesSearch = (event: { title: string }) =>
    search === '' || event.title.toLowerCase().includes(search)

  const pinnedEvents = events.filter(
    (event) => event.priority === EventPriority.Pinned && matchesSearch(event),
  )

  const defaultEvents = events.filter(
    (event) => event.priority === EventPriority.Default && matchesSearch(event),
  )

  return (
    <Window activeTab="/">
      <Sheet>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_240px] gap-6 md:gap-8">
          <aside>
            <h2 className="text-lg text-neutral-500 mb-3">Search</h2>
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search events"
                className="w-full bg-card border border-card-border rounded-sm pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <h2 className="text-lg text-neutral-500 mb-3">SIGs</h2>
            <ul className="flex flex-col gap-0.5">
              {ALL_SIGS.map((sig) => {
                const isSelected = selectedSig === sig.id
                return (
                  <li key={sig.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedSig(isSelected ? null : sig.id)}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-sm border transition-colors ${
                        isSelected
                          ? 'bg-card border-card-border'
                          : 'border-transparent hover:bg-card/60'
                      }`}
                    >
                      <img
                        src={sig.logo}
                        alt={`${sig.name} logo`}
                        className="h-5 w-5 object-contain shrink-0"
                      />
                      <span className="text-sm text-neutral-200 truncate">
                        {sig.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          <div className="min-w-0 min-h-[72vh] flex flex-col">
            <h2 className="text-lg text-neutral-500 mb-4">Upcoming Events</h2>

            {events.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src="/no-events.png"
                  alt="No events"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-96 h-96 object-contain select-none [-webkit-user-drag:none] [-webkit-touch-callout:none]"
                />
                <p className="text-md font-semibold text-neutral-700">
                  No events in the queue (yet)
                </p>
              </div>
            )}

            {pinnedEvents.length > 0 && (
              <div>
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
              <div className={pinnedEvents.length > 0 ? 'mt-8' : ''}>
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
          </div>

          <aside>
            <h2 className="text-lg font-semibold text-neutral-500 mb-3">
              Calendar
            </h2>
            <div className="w-full rounded-sm bg-card border border-card-border overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full bg-transparent p-2"
                classNames={{ root: 'w-full' }}
              />
            </div>

            <div className="mt-4 flex items-center gap-1 p-1 rounded-sm bg-card border border-card-border">
              {(['upcoming', 'drafts'] as const).map((tab) => {
                const isActive = eventsTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEventsTab(tab)}
                    className={`flex-1 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-card-hover text-neutral-100 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {tab === 'upcoming' ? 'Upcoming' : 'Drafts'}
                  </button>
                )
              })}
            </div>
          </aside>
        </div>

        <div className="mt-16 mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight mb-6">
              Looks like you reached the bottom of the events
            </h2>
            <p className="text-neutral-400 mb-4 max-w-xl">
              CompSoc and our Special Interest Groups have plenty more in the
              pipeline. New hackathons, talks, workshops and socials are added
              all the time.
            </p>
            <p className="text-neutral-400 max-w-xl mb-6">
              Join our Discord to keep up with what's happening, hear about
              events before they go live, and meet the people building things
              with you.
            </p>

            <a
              href="https://discord.gg/compsoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-[#4752c4] rounded-sm p-0 cursor-pointer group mt-2">
                <span className="block px-3 py-1 rounded-sm text-base bg-[#5865f2] text-white -translate-y-1 transition-transform group-active:-translate-y-0.5">
                  Discord
                </span>
              </button>
            </a>
          </div>

          <img
            src="/mascot-discord.png"
            alt="CompSoc mascot"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="w-40 h-40 md:w-68 md:h-68 object-contain shrink-0 mx-auto md:mx-0 select-none pointer-events-auto [-webkit-user-drag:none] [-webkit-touch-callout:none]"
          />
        </div>

        <div className="mt-24 mx-auto max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight mb-3">
            Flagship events from CompSoc
          </h2>
          <p className="text-neutral-400 mb-8 max-w-3xl">
            While you're waiting for events, take a look at some of the major
            ones we host.
          </p>

          <div className="overflow-x-auto border border-card-border rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-card/40">
                  <th className="w-10 px-4 py-3 text-xs font-semibold text-neutral-400 align-top">
                    #
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-neutral-200 align-top">
                    Event
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-neutral-200 align-top">
                    About
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-neutral-200 align-top whitespace-nowrap">
                    Highlights
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    title: 'Hack The Burgh',
                    when: 'Late February',
                    description:
                      '24-hour hackathon open to all students. Sponsor challenges, workshops, and the chance to ship something fast.',
                    stats: ['200+ hackers', '£8,000 in prizes'],
                  },
                  {
                    title: 'InfBall',
                    when: 'Mid April',
                    description:
                      'End-of-year informatics ball — three-course meal, drinks, music, and an after-party. 4th years get priority access.',
                    stats: ['250+ attendees', '8+ years running'],
                  },
                  {
                    title: 'Student Tech Meetup',
                    when: 'Monthly',
                    description:
                      'Talks from industry and academia. Past speakers include the designer of Haskell and engineers from Meta and Spotify.',
                    stats: ['30–70 attendees', 'Free entry'],
                  },
                ].map((flagship, index) => (
                  <tr
                    key={flagship.title}
                    className="border-b border-card-border last:border-b-0 hover:bg-card/40 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-neutral-500 align-top tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-sm font-semibold text-neutral-100">
                        {flagship.title}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-neutral-400 max-w-md">
                      {flagship.description}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        {flagship.stats.map((stat) => (
                          <span
                            key={stat}
                            className="text-xs text-neutral-300 whitespace-nowrap"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-24 mb-8 text-center text-xs text-neutral-600">
          CompSoc <span className="text-primary">♥</span> you
        </div>
      </Sheet>
    </Window>
  )
}
