import { ArrowUpRight, CalendarIcon, MapPin } from 'lucide-react'

export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  type: string
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative bg-surface border border-neutral-800 hover:border-neutral-600 rounded-md p-5 transition-all duration-200 hover:shadow-lg hover:bg-neutral-800/30 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
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
            {event.date} •{' '}
            <span className="text-neutral-500">{event.time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{event.location}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500 line-clamp-2 group-hover:text-neutral-400 transition-colors">
        {event.description}
      </p>
    </div>
  )
}
