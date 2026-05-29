import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { z } from 'zod'
import ModifyEventForm, {
  EventFormSchema,
  FormToRequest,
} from '@/components/forms/modify-event-form.tsx'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { eventQueryOption } from '@/lib/data/event.ts'
import ErrorState from '@/components/layout/error-state.tsx'
import { useUpdateEvent } from '@/lib/hooks/events/use-update-event.tsx'

export const Route = createFileRoute('/events/$eventId/edit')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(eventQueryOption(params.eventId))
  },
  component: EditEventRoute,
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

function EditEventRoute() {
  const { eventId } = Route.useParams()
  const { data: event } = useSuspenseQuery(eventQueryOption(eventId))
  const { updateEvent, isUpdating } = useUpdateEvent(eventId)
  const navigate = useNavigate({ from: '/events/$eventId/edit' })

  const defaultValues = EventFormSchema.parse({
    title: event.title,
    organiser: event.organiser,
    state: event.state,
    priority: event.priority,
    location: event.location,
    date: new Date(event.date),
    time: new Date(event.date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    capacity: event.capacity ? String(event.capacity) : '',
    aboutMarkdown: event.aboutMarkdown ?? '',
    locationURL: event.locationURL ?? '',
    registrationFormEnabled: !!event.form && event.form.length > 0,
    customFields: event.form ?? [],
  })

  const handleSubmit = (value: z.infer<typeof EventFormSchema>) => {
    const contractData = FormToRequest.parse(value)
    updateEvent(contractData, {
      onSuccess: (newEvent) => {
        void navigate({
          to: '/events/$eventId',
          params: { eventId: newEvent.id },
        })
      },
    })
  }

  const handleCancel = () => {
    void navigate({
      to: '/events/$eventId',
      params: { eventId },
    })
  }

  return (
    <ProtectedRoute requireEventManager>
      <Window>
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Edit Event
          </div>
          <div>
            <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
              Update the event details below. You can save changes or cancel to
              go back.
            </div>
          </div>

          <Separator className="my-5" />

          <ModifyEventForm
            defaultValues={defaultValues}
            isModify
            isLoading={isUpdating}
            onFormSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
