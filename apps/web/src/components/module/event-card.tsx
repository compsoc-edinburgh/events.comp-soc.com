import { ArrowUpRight, CalendarIcon, MapPin } from 'lucide-react'
import type { Sigs } from '@/config/sigs.ts'
import { SigBadge } from '@/components/sigs-badge.tsx'

export interface Event {
  id: number
  title: string
  date: Date
  time: string
  location: string
  type: string
  sig: Sigs
  pinned?: boolean
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative bg-surface border border-neutral-800 hover:border-neutral-600 rounded-md p-5 transition-all duration-200 hover:shadow-lg hover:bg-neutral-800/30 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SigBadge sig={event.sig} size="sm" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
              {event.type}
            </span>
          </div>
          <h3 className="text-lg font-bold text-neutral-100 group-hover:text-white mb-1">
            {event.title}
          </h3>
        </div>
        <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
      </div>

      <div className="flex flex-col gap-1.5 mt-3 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>
            {event.date.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}{' '}
            • <span className="text-neutral-500">{event.time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  )
}

export default EventCard
