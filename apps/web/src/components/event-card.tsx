import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CalendarIcon, MapPin } from 'lucide-react'
import type { Event } from '@events.comp-soc.com/shared'
import { SigBadge } from '@/components/sigs-badge.tsx'
import { formatEventDate } from '@/lib/utils.ts'

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  const { full: date } = formatEventDate(event.date)

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: String(event.id) }}
      className="block"
    >
      <div className="group relative bg-surface border border-neutral-800 hover:border-neutral-600 rounded-md p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:bg-neutral-800/30 cursor-pointer">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
              <SigBadge sig={event.organiser} size="sm" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-white mb-1 wrap-break-word">
              {event.title}
            </h3>
          </div>
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 group-hover:text-white transition-colors shrink-0" />
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5 mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{date}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
