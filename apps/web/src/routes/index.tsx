import { Link, createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
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
import Sheet from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import ErrorState from '@/components/error-state.tsx'
import EmptyState from '@/components/empty-state.tsx'
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
import DiscordSection from '@/components/discord-section.tsx'
import Footer from '@/components/footer.tsx'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions('published'))
  },
  component: App,
  errorComponent: ({ error }) => (
    <ErrorState
      title="We couldn't load events"
      message={
        error.message ||
        'The events API is having a bad day. Try again in a moment.'
      }
    />
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
  const [myEventsExpanded, setMyEventsExpanded] = useState(false)

  const MY_EVENTS_PREVIEW = 5

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
    <Window>
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
              <EmptyState
                image="/no-events.png"
                imageAlt="No events"
                title="No events in the queue (yet)"
              />
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

          <aside className="hidden lg:block lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] min-h-[75vh] lg:overflow-y-auto">
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
                  {(myEventsExpanded
                    ? myEvents
                    : myEvents.slice(0, MY_EVENTS_PREVIEW)
                  ).map((reg) => {
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
                {myEvents.length > MY_EVENTS_PREVIEW && (
                  <button
                    type="button"
                    onClick={() => setMyEventsExpanded((v) => !v)}
                    className="mt-2 w-full text-left px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    {myEventsExpanded
                      ? 'Show less'
                      : `Show all (${myEvents.length})`}
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>

        <DiscordSection />
        <Footer />
      </Sheet>
    </Window>
  )
}
