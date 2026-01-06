import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ServerCrash } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { z } from 'zod'
import ModifyEventForm, {
  EventFormSchema,
  FormToRequest,
} from '@/components/forms/modify-event-form.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet, { EmptySheet } from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { eventQueryOption } from '@/lib/data/event.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import { useUpdateEvent } from '@/lib/hooks/use-update-event.tsx'

export const Route = createFileRoute('/events/$eventId/edit')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(eventQueryOption(params.eventId))
  },
  component: EditEventRoute,
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
    <ProtectedRoute activeTab="/events/create">
      <Window activeTab="/events/create">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Create Event
          </div>
          <div>
            <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
              Fill in the details below to create a new event. You can either
              publish it or save it as a draft.
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
