import { Link, createFileRoute } from '@tanstack/react-router'
import { Search, ServerCrash } from 'lucide-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value.ts'

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
  const { canManageEvents, isLoaded: isAuthLoaded } = useEventManagerAuth()

  const [selectedSigs, setSelectedSigs] = useState<Array<string>>([])
  const [eventSearch, setEventSearch] = useState('')
  const debouncedSearch = useDebouncedValue(eventSearch, 300)
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
    search: debouncedSearch,
    sigs: selectedSigs,
    date: dateFilter,
  }

  const { data: publishedEvents = [], isPending: isPublishedPending } =
    useQuery({
      ...eventsQueryOptions({ state: 'published', ...sharedFilters }),
      enabled: eventsTab === 'upcoming',
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    })
  const { data: draftEvents = [], isPending: isDraftPending } = useQuery({
    ...eventsQueryOptions({
      state: 'draft',
      includePast: true,
      ...sharedFilters,
    }),
    enabled: canManageEvents && eventsTab === 'drafts',
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

  const { data: userRegistrations, isPending: isRegistrationsPending } =
    useQuery({
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
  const isEventsLoading =
    eventsTab === 'drafts' ? isDraftPending : isPublishedPending

  const pinnedEvents = events.filter(
    (event) => event.priority === EventPriority.Pinned,
  )
  const defaultEvents = events.filter(
    (event) => event.priority === EventPriority.Default,
  )

  return (
    <Window activeTab="/">
      <Sheet>
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_260px] gap-6 md:gap-8">
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

            <h2 className="text-lg text-neutral-500 mb-3">Sigs</h2>
            <div className="relative -mx-4 md:mx-0">
              <ul
                className="
                  flex flex-row gap-2 overflow-x-auto px-4 pb-2
                  md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0
                  [scrollbar-width:none] [-ms-overflow-style:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {ALL_SIGS.map((sig) => {
                  const isSelected = selectedSigs.includes(sig.id)
                  return (
                    <li key={sig.id} className="shrink-0 md:shrink">
                      <button
                        type="button"
                        onClick={() => toggleSig(sig.id)}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors
                          md:w-full md:gap-3 md:px-2.5 md:py-2 md:rounded-sm
                          ${
                            isSelected
                              ? 'bg-card-hover border-neutral-500 text-white shadow-sm'
                              : 'bg-card border-card-border md:bg-transparent md:border-transparent hover:bg-card md:hover:border-card-border'
                          }
                        `}
                      >
                        <img
                          src={sig.logo}
                          alt={`${sig.name} logo`}
                          className="h-4 w-4 md:h-5 md:w-5 object-contain shrink-0"
                        />
                        <span className="text-sm md:text-[15px] text-neutral-200 whitespace-nowrap md:truncate">
                          {sig.name}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div
                aria-hidden="true"
                className="md:hidden pointer-events-none absolute left-0 top-0 bottom-2 w-6 bg-linear-to-r from-surface to-transparent"
              />
              <div
                aria-hidden="true"
                className="md:hidden pointer-events-none absolute right-0 top-0 bottom-2 w-6 bg-linear-to-l from-surface to-transparent"
              />
            </div>
          </aside>

          <div className="min-w-0 flex flex-col">
            <h2 className="text-lg text-neutral-500 mb-4">Upcoming Events</h2>

            {isEventsLoading && (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32.5 w-full" />
                ))}
              </div>
            )}

            {!isEventsLoading && events.length === 0 && (
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

            {!isEventsLoading &&
              (pinnedEvents.length > 0 || defaultEvents.length > 0) && (
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

          <aside className="hidden lg:block lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <h2 className="text-lg font-semibold text-neutral-500 mb-3">
              Calendar
            </h2>
            <div className="w-full rounded-sm bg-card border border-card-border overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="mx-auto bg-transparent p-2 [--cell-size:--spacing(8)]"
                classNames={{
                  root: 'w-fit',
                  month_caption:
                    'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) bg-card-muted/60 rounded-sm',
                  caption_label:
                    'select-none text-sm font-medium text-neutral-400',
                  week: 'flex w-full mt-1',
                  button_previous:
                    'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
                  button_next:
                    'size-(--cell-size) p-0 select-none text-white hover:bg-card-hover hover:text-white aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md [&_svg]:!text-white [&_svg]:!fill-white [&_svg]:!w-3 [&_svg]:!h-3',
                  today:
                    'bg-card-hover text-neutral-200 rounded-md data-[selected=true]:rounded-none',
                }}
              />
            </div>

            {isAuthLoaded ? (
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
            ) : (
              <Skeleton className="mt-4 h-9 w-full" />
            )}

            {isSignedIn && isRegistrationsPending && (
              <div className="mt-6">
                <h2 className="text-lg text-neutral-500 mb-3">Your events</h2>
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-13.5 w-full" />
                  ))}
                </div>
              </div>
            )}

            {!isRegistrationsPending && myEvents.length > 0 && (
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
                            <span className="text-[15px] text-neutral-200 truncate">
                              {reg.eventTitle ?? 'Untitled event'}
                            </span>
                          </div>
                          <span className="text-sm text-neutral-500 pl-4">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_260px] gap-6 md:gap-8">
          <div className="hidden md:block" />
          <div className="space-y-24 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight mb-6">
                  Looks like you reached the bottom of the events
                </h2>
                <p className="text-neutral-400 mb-4 max-w-xl">
                  CompSoc and our Special Interest Groups have plenty more in
                  the pipeline. New hackathons, talks, workshops and socials are
                  added all the time.
                </p>
                <p className="text-neutral-400 max-w-xl mb-6">
                  Join our Discord to keep up with what's happening, hear about
                  events before they go live, and meet the people building
                  things with you.
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
                className="w-64 h-64 md:w-56 md:h-56 object-contain shrink-0 mx-auto md:mx-0 mt-6 md:mt-0 select-none pointer-events-auto [-webkit-user-drag:none] [-webkit-touch-callout:none]"
              />
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>

        <div className="mt-24 mb-8 text-center text-xs text-neutral-600">
          CompSoc <span className="text-primary">♥</span> you
        </div>
      </Sheet>
    </Window>
  )
}
