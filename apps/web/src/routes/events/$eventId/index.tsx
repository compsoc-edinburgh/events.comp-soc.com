import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ChartPieIcon,
  ClockIcon,
  MapPin,
  PencilIcon,
  UserIcon,
} from 'lucide-react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import ErrorState from '@/components/layout/error-state.tsx'
import { Markdown } from '@/components/markdown.tsx'
import GoogleMaps from '@/components/google-maps.tsx'
import { SigBadge } from '@/components/sigs-badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { eventQueryOption } from '@/lib/data/event.ts'
import DraftBadge from '@/components/draft-badge.tsx'
import { useEventManagerAuth } from '@/lib/auth.ts'
import { formatEventDate, isHistoricalEvent } from '@/lib/utils.ts'
import DeleteEventButton from '@/components/controlls/delete-event-button.tsx'
import PublishEventButton from '@/components/controlls/publish-event-button.tsx'
import { registrationQueryByUserOption } from '@/lib/data/registration.ts'
import {
  RegistrationBlock,
  RegistrationBlockSkeleton,
  SubmitRegistrationBlock,
} from '@/components/registration-block.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'

export const Route = createFileRoute('/events/$eventId/')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(eventQueryOption(params.eventId))
  },
  component: EventRoute,
  errorComponent: ({ error }) => (
    <ErrorState
      title="We couldn't load this event"
      message={
        error.message ||
        "Either it doesn't exist anymore, or the events API is having a bad day. Try again in a moment."
      }
    />
  ),
})

function EventRoute() {
  const { userId } = useAuth()
  const navigate = useNavigate({ from: '/events/$eventId' })
  const { eventId } = Route.useParams()

  const { canManage } = useEventManagerAuth()
  const { data: event } = useSuspenseQuery(eventQueryOption(eventId))
  const { data: registration, isLoading: isRegistrationLoading } = useQuery({
    ...registrationQueryByUserOption(eventId),
    enabled: Boolean(eventId) && Boolean(userId),
  })

  const { full: date } = formatEventDate(event.date)

  const isDraft = event.state === 'draft'
  const isPastEvent = isHistoricalEvent(event.date)

  const canManageEvent = canManage(event.organiser)
  const canModifyEvent = canManageEvent && !isPastEvent

  return (
    <Window maxWidth="3xl">
      <Sheet>
        <div className="flex items-start justify-between gap-3">
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            {event.title}
          </div>
          {canManageEvent && (
            <div className="flex items-center gap-2 shrink-0">
              {canModifyEvent && (
                <Tooltip>
                  <TooltipTrigger className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        void navigate({ to: '/events/$eventId/edit' })
                      }}
                    >
                      <PencilIcon className="w-4 h-4 text-neutral-400 hover:text-white transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      void navigate({ to: '/events/$eventId/analytics' })
                    }}
                  >
                    <ChartPieIcon className="w-4 h-4 text-neutral-400 hover:text-white transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Analytics</TooltipContent>
              </Tooltip>
              {canModifyEvent && <DeleteEventButton eventId={eventId} />}
            </div>
          )}
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
              {date}
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

        {userId && isRegistrationLoading ? (
          <RegistrationBlockSkeleton />
        ) : registration ? (
          <RegistrationBlock registration={registration} />
        ) : !isDraft && !isPastEvent ? (
          <SubmitRegistrationBlock
            eventId={eventId}
            eventTitle={event.title}
            form={event.form ?? []}
          />
        ) : null}

        {isDraft && canModifyEvent && (
          <div className="my-5">
            <PublishEventButton eventId={eventId} />
          </div>
        )}

        {event.aboutMarkdown && (
          <div className="my-5">
            <div className="text-base text-neutral-400">About</div>
            <Separator className="mt-1" />
            <Markdown className="mt-4" content={event.aboutMarkdown} />
          </div>
        )}
        {event.locationURL && (
          <div className="my-5">
            <div className="text-base text-neutral-400">Location</div>
            <Separator className="mt-1" />
            <GoogleMaps
              locationURL={event.locationURL}
              locationName={event.location}
            />
          </div>
        )}
      </Sheet>
    </Window>
  )
}
