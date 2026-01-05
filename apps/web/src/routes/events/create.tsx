import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EventPriority, EventState, Sigs } from '@events.comp-soc.com/shared'
import type { z } from 'zod'
import type {
  CreateEventRequest,
  CustomField,
} from '@events.comp-soc.com/shared'
import type { EventFormSchema } from '@/components/forms/modify-event-form.tsx'
import ModifyEventForm, {
  FormToRequest,
} from '@/components/forms/modify-event-form.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { createEvent } from '@/lib/data/event.ts'

export const Route = createFileRoute('/events/create')({
  component: CreateRoute,
})

function CreateRoute() {
  const navigate = useNavigate({ from: '/events/create' })

  const createMutation = useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent({ data }),
    onSuccess: (event) => {
      toast.success(event.title, {
        description: 'Event has been created',
      })
      void navigate({
        to: '/events/$eventId',
        params: {
          eventId: event.id,
        },
      })
    },
    onError: (error) => {
      toast.error('Failed to create event', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  const defaultValues = {
    title: '',
    organiser: Sigs.Compsoc,
    state: EventState.Draft,
    priority: EventPriority.Default,
    date: new Date(),
    time: '',
    location: '',
    aboutMarkdown: '',
    capacity: '',
    locationURL: '',
    registrationFormEnabled: false,
    customFields: [] as Array<CustomField>,
  } as z.infer<typeof EventFormSchema>

  const handleSubmit = (value: z.infer<typeof EventFormSchema>) => {
    const contractData = FormToRequest.parse(value)
    createMutation.mutate(contractData)
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
            onFormSubmit={handleSubmit}
          />
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
