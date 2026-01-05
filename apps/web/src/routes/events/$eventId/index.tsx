import { createFileRoute } from '@tanstack/react-router'
import { ClockIcon, MapPin, ServerCrash, UserIcon } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { Markdown } from '@/components/markdown.tsx'
import GoogleMaps from '@/components/google-maps.tsx'
import { SigBadge } from '@/components/sigs-badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { eventQueryOption } from '@/lib/data/event.ts'

export const Route = createFileRoute('/events/$eventId/')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(eventQueryOption(params.eventId))
  },
  component: EventRoute,
  errorComponent: ({ error }) => (
    <Window activeTab="/">
      <EmptySheet>
        <StatusCard
          title="Oops.. Something happened with this event"
          message={
            error.message ||
            'The events API decided to take an unscheduled coffee break.'
          }
          icon={<ServerCrash className="w-10 h-10" strokeWidth={1.5} />}
        />
      </EmptySheet>
    </Window>
  ),
})

function EventRoute() {
  const { eventId } = Route.useParams()
  const { data: event } = useSuspenseQuery(eventQueryOption(eventId))

  return (
    <Window activeTab="/events">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          {event.title}
        </div>
        <div className="flex gap-2 mt-1">
          <SigBadge sig={event.organiser} size="sm" />
        </div>

        <div className="my-6 sm:my-8 flex flex-col gap-4 sm:gap-8">
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Location
            </div>
            <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base wrap-break-word">
              {event.location}
            </div>
          </div>
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Date
            </div>
            <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base ">
              Mon 29 Dec 14:30
            </div>
          </div>
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Capacity
            </div>
            <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base">
              {event.capacity} Students
            </div>
          </div>
        </div>

        {event.aboutMarkdown && (
          <div className="my-5">
            <div className="text-base text-neutral-400">About</div>
            <div className="h-px bg-neutral-800" />
            <Markdown className="mt-4" content={event.aboutMarkdown} />
          </div>
        )}

        {event.locationURL && (
          <div className="my-5">
            <div className="text-base text-neutral-400">Location</div>
            <div className="h-px bg-neutral-800" />
            <GoogleMaps
              locationURL={event.locationURL}
              locationName={event.location}
            />
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button>Register Now</Button>
        </div>
      </Sheet>
    </Window>
  )
}
