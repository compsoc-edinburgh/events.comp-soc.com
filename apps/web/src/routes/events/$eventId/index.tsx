import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ClockIcon, MapPin, ServerCrash, UserIcon } from 'lucide-react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { EventState } from '@events.comp-soc.com/shared'
import { toast } from 'sonner'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { Markdown } from '@/components/markdown.tsx'
import GoogleMaps from '@/components/google-maps.tsx'
import { SigBadge } from '@/components/sigs-badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { eventQueryOption, updateEvent } from '@/lib/data/event.ts'
import DraftBadge from '@/components/draft-badge.tsx'
import { useCommitteeAuth } from '@/lib/auth.ts'

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
  const queryClient = useQueryClient()
  const { isCommittee } = useCommitteeAuth()
  const navigate = useNavigate({ from: '/events/$eventId' })
  const { data: event } = useSuspenseQuery(eventQueryOption(eventId))
  const dateObj = new Date(event.date)

  const publishMutation = useMutation({
    mutationFn: () =>
      updateEvent({
        data: {
          id: eventId,
          state: EventState.Published,
        },
      }),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success(event.title, {
        description: 'Event has been published',
      })
    },
    onError: (error) => {
      toast.error('Failed to publish event', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const isDraft = event.state === 'draft'

  return (
    <Window activeTab="/events">
      <Sheet>
        <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
          {event.title}
        </div>
        <div className="flex gap-2 mt-2.5">
          {isDraft && <DraftBadge />}
          <SigBadge sig={event.organiser} size="sm" />
        </div>

        <div className="mt-10">
          <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            Location
          </div>
          <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base wrap-break-word">
            {event.location}
          </div>
        </div>

        <div className="my-6 sm:my-8 flex flex-col md:flex-row gap-4 sm:gap-8">
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Date
            </div>
            <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base ">
              {formattedDate} - {formattedTime}
            </div>
          </div>
          <div className="flex-1 sm:flex-none">
            <div className="flex gap-2 items-center text-sm sm:text-base text-neutral-400">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Capacity
            </div>
            <div className="font-semibold mt-1 sm:mt-2 ml-6 sm:ml-7 text-sm sm:text-base">
              {event.capacity ? `${event.capacity} Students` : 'Unlimited'}
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
          {isDraft ? (
            <Button onClick={() => publishMutation.mutate()}>Publish</Button>
          ) : (
            <Button>Register Now</Button>
          )}
          {isCommittee && (
            <Button
              variant="secondary"
              onClick={() => {
                void navigate({
                  to: '/events/$eventId/edit',
                })
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </Sheet>
    </Window>
  )
}
