import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { EventPriority, EventState, Sigs } from '@events.comp-soc.com/shared'
import type { z } from 'zod'
import type { CustomField } from '@events.comp-soc.com/shared'
import type { EventFormSchema } from '@/components/forms/modify-event-form.tsx'
import ModifyEventForm, {
  FormToRequest,
} from '@/components/forms/modify-event-form.tsx'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { useCreateEvent } from '@/lib/hooks/events/use-create-event.tsx'
import { useEventManagerAuth } from '@/lib/auth.ts'

export const Route = createFileRoute('/events/create')({
  component: CreateRoute,
})

function CreateRoute() {
  const navigate = useNavigate({ from: '/events/create' })
  const { createEvent, isCreating } = useCreateEvent()
  const { isCommittee, sigs } = useEventManagerAuth()

  const defaultOrganiser = isCommittee
    ? Sigs.Compsoc
    : sigs && sigs.length > 0
      ? sigs[0]
      : Sigs.Compsoc

  const defaultValues = {
    title: '',
    organiser: defaultOrganiser,
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
    createEvent(contractData, {
      onSuccess: (newEvent) => {
        void navigate({
          to: '/events/$eventId',
          params: { eventId: newEvent.id },
        })
      },
    })
  }

  return (
    <ProtectedRoute activeTab="/events/create" requireEventManager>
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
            isLoading={isCreating}
          />
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
