import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { CalendarIcon, MapPin } from 'lucide-react'
import { useState } from 'react'
import { RegistrationStatus } from '@events.comp-soc.com/shared'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import EmptyState from '@/components/empty-state.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { userRegistrationQueryOption } from '@/lib/data/users.ts'
import { formatEventDate } from '@/lib/utils.ts'

export const Route = createFileRoute('/me')({
  component: MeRoute,
})

type StatusFilter = 'all' | RegistrationStatus

const STATUS_FILTERS: Array<{
  id: StatusFilter
  label: string
  dot: string
}> = [
  { id: 'all', label: 'All', dot: 'bg-neutral-500' },
  {
    id: RegistrationStatus.Accepted,
    label: 'Accepted',
    dot: 'bg-status-accepted',
  },
  {
    id: RegistrationStatus.Pending,
    label: 'Pending',
    dot: 'bg-status-pending',
  },
  {
    id: RegistrationStatus.Waitlist,
    label: 'Waitlist',
    dot: 'bg-status-waitlist',
  },
  {
    id: RegistrationStatus.Rejected,
    label: 'Rejected',
    dot: 'bg-status-rejected',
  },
]

function MeRoute() {
  const { isSignedIn } = useAuth()
  const { data, isPending } = useQuery({
    ...userRegistrationQueryOption(),
    enabled: !!isSignedIn,
  })
  const registrations = data ?? []
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = registrations
    .filter((reg) => statusFilter === 'all' || reg.status === statusFilter)
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    )

  const countByStatus = registrations.reduce<Record<string, number>>(
    (acc, reg) => {
      acc[reg.status] = (acc[reg.status] ?? 0) + 1
      return acc
    },
    {},
  )

  return (
    <ProtectedRoute>
      <Window>
        <Sheet>
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8">
            <aside className="md:sticky md:top-16 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
              <h2 className="text-lg text-neutral-500 mb-3">Status</h2>
              <div className="relative -mx-4 md:mx-0">
                <ul
                  className="
                    flex flex-row gap-2 overflow-x-auto px-4 pb-2
                    md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0
                    [scrollbar-width:none] [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {STATUS_FILTERS.map((status) => {
                    const isSelected = statusFilter === status.id
                    const count =
                      status.id === 'all'
                        ? registrations.length
                        : (countByStatus[status.id] ?? 0)
                    return (
                      <li key={status.id} className="shrink-0 md:shrink">
                        <button
                          type="button"
                          onClick={() => setStatusFilter(status.id)}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors
                            md:w-full md:gap-3 md:px-2.5 md:py-2 md:rounded-sm md:justify-between
                            ${
                              isSelected
                                ? 'bg-card-hover border-neutral-500 text-white shadow-sm'
                                : 'bg-card border-card-border md:bg-transparent md:border-transparent hover:bg-card md:hover:border-card-border'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`}
                            />
                            <span className="text-sm md:text-[15px] text-neutral-200 whitespace-nowrap md:truncate">
                              {status.label}
                            </span>
                          </div>
                          <span className="hidden md:inline text-xs text-neutral-500 tabular-nums">
                            {count}
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
              <h2 className="text-lg text-neutral-500 mb-4">My events</h2>

              {isPending ? (
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[130px] w-full" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState
                  image="/no-events.png"
                  imageAlt="No registrations"
                  title={
                    registrations.length === 0
                      ? 'No registrations yet'
                      : 'Nothing here for this filter'
                  }
                  description={
                    registrations.length === 0
                      ? "Sign up for an event and it'll show up here."
                      : 'Try another status — your other registrations are still there.'
                  }
                  className="min-h-[55vh]"
                />
              ) : (
                <div className="grid gap-4">
                  {filtered.map((reg) => {
                    const statusMeta = STATUS_FILTERS.find(
                      (s) => s.id === reg.status,
                    )
                    return (
                      <Link
                        key={reg.eventId}
                        to="/events/$eventId"
                        params={{ eventId: reg.eventId }}
                        className="block group"
                      >
                        <div className="relative overflow-hidden bg-card border border-card-border rounded-md p-4 sm:p-5 transition-shadow duration-150 cursor-pointer ring-2 ring-transparent group-hover:ring-primary group-hover:border-primary">
                          <div className="flex flex-col gap-2">
                            <div className="text-[11px] sm:text-xs text-neutral-500">
                              Registered{' '}
                              {new Date(reg.createdAt).toLocaleDateString(
                                'en-GB',
                                { day: 'numeric', month: 'short' },
                              )}
                            </div>

                            <h3 className="text-base sm:text-2xl font-bold text-neutral-100 leading-tight wrap-break-word">
                              {reg.eventTitle ?? 'Untitled event'}
                            </h3>

                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-neutral-400 mt-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neutral-500" />
                                <span className="truncate">
                                  {formatEventDate(reg.eventDate).full}
                                </span>
                              </div>
                              {reg.eventLocation && (
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neutral-500" />
                                  <span className="truncate">
                                    {reg.eventLocation}
                                  </span>
                                </div>
                              )}

                              {statusMeta && (
                                <div className="ml-auto flex items-center gap-1.5">
                                  <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${statusMeta.dot}`}
                                  />
                                  <span className="text-xs text-neutral-400">
                                    {statusMeta.label}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
