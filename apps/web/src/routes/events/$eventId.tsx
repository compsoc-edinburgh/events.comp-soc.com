import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import Window from '@/components/module/layout/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'

export const Route = createFileRoute('/events/$eventId')({
  component: EventRoute,
})

function EventRoute() {
  const { eventId } = Route.useParams()

  return (
    <Window activeTab="/events">
      <Sheet>
        <div className="text-2xl font-bold gap-2 items-center flex text-white">
          Event Details
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            <CalendarIcon className="w-4 h-4" strokeWidth={1.5} /> Viewing event
            #{eventId}
          </div>
        </div>

        <div className="h-px bg-neutral-800 my-5" />

        <div className="bg-neutral-900/50 p-4 rounded border-neutral-800 border text-neutral-400 text-sm leading-relaxed">
          <div className="text-xl font-semibold text-white mb-4">
            Intro to Rust Workshop
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-neutral-500" />
              <span>Tue, 14 Oct 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-neutral-500" />
              <span>18:00 - 20:00</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-neutral-500" />
              <span>Appleton Tower, 5.05</span>
            </div>
          </div>

          <p className="text-neutral-300">
            Join us for a hands-on introduction to Rust. We'll cover ownership,
            borrowing, and basic syntax. Pizza provided!
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="bg-red-900 rounded-sm p-0 cursor-pointer group">
            <span className="block px-4 py-2 rounded-sm text-sm bg-red-600 text-white -translate-y-1 transition-transform group-active:-translate-y-0.5">
              Register Now
            </span>
          </button>
          <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors border border-neutral-700 rounded hover:border-neutral-500">
            Add to Calendar
          </button>
        </div>
      </Sheet>
    </Window>
  )
}
