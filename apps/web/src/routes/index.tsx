import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import type { EventsTab } from '@/components/home/upcoming-tabs.tsx'
import type { EventsQueryParams } from '@/lib/data/event.ts'
import { userRegistrationQueryOption } from '@/lib/data/users.ts'
import { useEventManagerAuth } from '@/lib/auth.ts'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { eventsQueryOptions } from '@/lib/data/event.ts'
import ErrorState from '@/components/layout/error-state.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.tsx'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value.ts'
import DiscordSection from '@/components/discord-section.tsx'
import SigsFilter from '@/components/home/sigs-filter.tsx'
import CalendarPanel from '@/components/home/calendar-panel.tsx'
import UpcomingTabs from '@/components/home/upcoming-tabs.tsx'
import EventsList from '@/components/home/events-list.tsx'
import MyEventsList from '@/components/home/my-events-list.tsx'
import { formatDateFilter } from '@/lib/utils.ts'

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
  const [eventsTab, setEventsTab] = useState<EventsTab>('upcoming')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const toggleSig = (id: string) =>
    setSelectedSigs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  const handleEventsTabChange = (tab: EventsTab) => {
    if (tab === 'drafts' && !canManageEvents) return

    setEventsTab(tab)
    setSelectedDate(undefined)
  }

  const dateFilter = selectedDate ? formatDateFilter(selectedDate) : undefined

  const archiveRange = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    return {
      dateFrom: formatDateFilter(new Date(today.getFullYear(), 0, 1)),
      dateTo: formatDateFilter(yesterday),
    }
  }, [])

  const sharedFilters = useMemo(
    () => ({
      search: debouncedSearch,
      sigs: selectedSigs,
      date: dateFilter,
    }),
    [dateFilter, debouncedSearch, selectedSigs],
  )

  const activeEventFilters = useMemo<EventsQueryParams>(() => {
    if (eventsTab === 'drafts') {
      return {
        state: 'draft',
        includePast: true,
        ...sharedFilters,
      }
    }

    if (eventsTab === 'archive') {
      return {
        state: 'published',
        includePast: true,
        ...sharedFilters,
        ...archiveRange,
      }
    }

    return {
      state: 'published',
      ...sharedFilters,
    }
  }, [archiveRange, eventsTab, sharedFilters])

  const { data: events = [], isPending: isEventsLoading } = useQuery({
    ...eventsQueryOptions(activeEventFilters),
    enabled: eventsTab !== 'drafts' || canManageEvents,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

  const todayIso = useMemo(() => {
    const d = new Date()
    d.setUTCHours(0, 0, 0, 0)
    return d.toISOString()
  }, [])

  const { data: userRegistrations, isPending: isRegistrationsPending } =
    useQuery({
      ...userRegistrationQueryOption({ from: todayIso }),
      enabled: !!isSignedIn,
    })

  const myEvents = (userRegistrations ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    )

  const eventsTitle =
    eventsTab === 'drafts'
      ? 'Draft Events'
      : eventsTab === 'archive'
        ? 'Event Archive'
        : 'Upcoming Events'

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

            <h2 className="text-lg text-neutral-500 mb-3">Sigs</h2>
            <SigsFilter selectedSigs={selectedSigs} onToggle={toggleSig} />
          </aside>

          <div className="min-w-0 flex flex-col">
            <h2 className="text-lg text-neutral-500 mb-4">{eventsTitle}</h2>
            <EventsList events={events} isLoading={isEventsLoading} />
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] min-h-[75vh] lg:overflow-y-auto">
            <h2 className="text-lg font-semibold text-neutral-500 mb-3">
              Calendar
            </h2>
            <CalendarPanel
              selected={selectedDate}
              onSelect={setSelectedDate}
              mode={eventsTab === 'archive' ? 'archive' : 'upcoming'}
            />
            <UpcomingTabs
              value={eventsTab}
              onChange={handleEventsTabChange}
              canManageEvents={canManageEvents}
              isAuthLoaded={isAuthLoaded}
            />
            <MyEventsList
              registrations={myEvents}
              isSignedIn={!!isSignedIn}
              isPending={isRegistrationsPending}
            />
          </aside>
        </div>

        <DiscordSection />
      </Sheet>
    </Window>
  )
}
