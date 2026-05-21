import { Link } from '@tanstack/react-router'
import { MapPin, Users } from 'lucide-react'
import type { Event } from '@events.comp-soc.com/shared'
import { SigBadge } from '@/components/sigs-badge.tsx'
import { formatEventDate } from '@/lib/utils.ts'

interface EventCardProps {
  event: Event
  pinned?: boolean
}

function EventCard({ event, pinned = false }: EventCardProps) {
  const { full: date } = formatEventDate(event.date)

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: String(event.id) }}
      className="block group"
    >
      <div
        className={`relative overflow-hidden border rounded-md p-4 sm:p-5 transition-shadow duration-150 cursor-pointer ring-2 ring-transparent group-hover:ring-primary group-hover:border-primary ${
          pinned
            ? 'bg-card-hover border-neutral-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-card border-card-border'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="md:hidden">
            <SigBadge sig={event.organiser} size="sm" />
          </div>

          <div className="text-[11px] sm:text-xs text-neutral-500">{date}</div>

          <h3 className="text-base sm:text-2xl font-bold text-neutral-100 leading-tight wrap-break-word">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-neutral-400 mt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-neutral-500" />
              <span className="truncate">{event.location}</span>
            </div>

            {event.capacity != null && (
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500" />
                <span className="tabular-nums">{event.capacity}</span>
              </div>
            )}

            <div className="hidden md:block ml-auto">
              <SigBadge sig={event.organiser} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
