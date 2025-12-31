import { createFileRoute } from '@tanstack/react-router'
import Window from '@/components/module/layout/window/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'

import { Separator } from '@/components/ui/separator.tsx'
import ModifyEventForm from '@/components/module/modify-event-form.tsx'

export const Route = createFileRoute('/events/create')({
  component: CreateRoute,
})

function CreateRoute() {
  return (
    <Window activeTab="/events/create">
      <Sheet>
        <div className="text-2xl font-bold gap-2 items-center flex text-white">
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
          onFormSubmit={(value) => {
            console.log(value)
          }}
        />
      </Sheet>
    </Window>
  )
}
