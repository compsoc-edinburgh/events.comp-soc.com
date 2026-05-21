import { Link, createFileRoute } from '@tanstack/react-router'
import { Search, ServerCrash } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import { EventPriority, RegistrationStatus } from '@events.comp-soc.com/shared'
import { userRegistrationQueryOption } from '@/lib/data/users.ts'
import { formatEventDate } from '@/lib/utils.ts'
import { useEventManagerAuth } from '@/lib/auth.ts'
import EventCard from '@/components/event-card.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import Window from '@/components/layout/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { ALL_SIGS } from '@/config/sigs.ts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.tsx'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'

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
  const { isSignedIn } = useAuth()
  const { canManageEvents } = useEventManagerAuth()

  const [selectedSigs, setSelectedSigs] = useState<Array<string>>([])
  const [eventSearch, setEventSearch] = useState('')
  const [eventsTab, setEventsTab] = useState<'upcoming' | 'drafts'>('upcoming')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const toggleSig = (id: string) =>
    setSelectedSigs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  const dateFilter = selectedDate
    ? `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : undefined

  const sharedFilters = {
    search: eventSearch,
    sigs: selectedSigs,
    date: dateFilter,
  }

  const { data: publishedEvents = [] } = useQuery({
    ...eventsQueryOptions({ state: 'published', ...sharedFilters }),
    enabled: eventsTab === 'upcoming',
  })
  const { data: draftEvents = [] } = useQuery({
    ...eventsQueryOptions({
      state: 'draft',
      includePast: true,
      ...sharedFilters,
    }),
    enabled: canManageEvents && eventsTab === 'drafts',
  })

  const { data: userRegistrations } = useQuery({
    ...userRegistrationQueryOption(),
    enabled: !!isSignedIn,
  })

  const now = Date.now()
  const myEvents = (userRegistrations ?? [])
    .filter((reg) => new Date(reg.eventDate).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    )

  const events = eventsTab === 'drafts' ? draftEvents : publishedEvents

  const pinnedEvents = events.filter(
    (event) => event.priority === EventPriority.Pinned,
  )
  const defaultEvents = events.filter(
    (event) => event.priority === EventPriority.Default,
  )

  return (
    <Window activeTab="/">
      <Sheet>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_240px] gap-6 md:gap-8">
          <aside className="md:sticky md:top-16 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
            <h2 className="text-lg text-neutral-500 mb-3">Search</h2>
            <InputGroup className="mb-6">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search events"
              />
            </InputGroup>

            <div className="mb-6" />

            <h2 className="text-lg text-neutral-500 mb-3">SIGs</h2>
            <ul className="flex flex-col gap-0.5">
              {ALL_SIGS.map((sig) => {
                const isSelected = selectedSigs.includes(sig.id)
                return (
                  <li key={sig.id}>
                    <button
                      type="button"
                      onClick={() => toggleSig(sig.id)}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-sm border transition-colors ${
                        isSelected
                          ? 'bg-card-hover border-neutral-500 text-white shadow-sm'
                          : 'border-transparent hover:bg-card hover:border-card-border'
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

          <div className="min-w-0 flex flex-col">
            <h2 className="text-lg text-neutral-500 mb-4">Upcoming Events</h2>

            {events.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src="/no-events.png"
                  alt="No events"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-60 h-60 object-contain select-none [-webkit-user-drag:none] [-webkit-touch-callout:none]"
                />
                <p className="text-md font-semibold text-neutral-700">
                  No events in the queue (yet)
                </p>
              </div>
            )}

            {(pinnedEvents.length > 0 || defaultEvents.length > 0) && (
              <div className="grid gap-4">
                {pinnedEvents.map((event) => (
                  <EventCard key={event.id} event={event} pinned />
                ))}
                {defaultEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          <aside className="md:sticky md:top-16 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
            <h2 className="text-lg font-semibold text-neutral-500 mb-3">
              Calendar
            </h2>
            <div className="w-full rounded-sm bg-card border border-card-border overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full bg-transparent p-2"
                classNames={{
                  root: 'w-full',
                  month_caption:
                    'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) bg-card-muted/60 rounded-sm',
                  caption_label:
                    'select-none text-sm font-medium text-neutral-400',
                  button_previous:
                    'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
                  button_next:
                    'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
                  today:
                    'bg-card-hover text-neutral-200 rounded-md data-[selected=true]:rounded-none',
                }}
              />
            </div>

            <Tabs
              value={eventsTab}
              onValueChange={(v) => setEventsTab(v as 'upcoming' | 'drafts')}
              className="mt-4"
            >
              <TabsList className="w-full">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                {canManageEvents && (
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {myEvents.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg text-neutral-500 mb-3">Your events</h2>
                <ul className="flex flex-col gap-1">
                  {myEvents.map((reg) => {
                    const { full: when } = formatEventDate(reg.eventDate)
                    const statusColor =
                      reg.status === RegistrationStatus.Accepted
                        ? 'bg-status-accepted'
                        : reg.status === RegistrationStatus.Pending
                          ? 'bg-status-pending'
                          : reg.status === RegistrationStatus.Waitlist
                            ? 'bg-status-waitlist'
                            : 'bg-status-rejected'
                    const statusLabel =
                      reg.status === RegistrationStatus.Accepted
                        ? 'Accepted'
                        : reg.status === RegistrationStatus.Pending
                          ? 'Pending'
                          : reg.status === RegistrationStatus.Waitlist
                            ? 'Waitlist'
                            : 'Rejected'
                    return (
                      <li key={reg.eventId}>
                        <Link
                          to="/events/$eventId"
                          params={{ eventId: reg.eventId }}
                          className="flex flex-col gap-0.5 px-2.5 py-2 rounded-sm hover:bg-card transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`}
                                  aria-label={statusLabel}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                {statusLabel}
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-sm text-neutral-200 truncate">
                              {reg.eventTitle ?? 'Untitled event'}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 pl-4">
                            {when}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
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
