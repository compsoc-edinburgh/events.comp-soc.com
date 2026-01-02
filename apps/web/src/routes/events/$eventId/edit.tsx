import { createFileRoute } from '@tanstack/react-router'
import Window from '@/components/layout/window/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'

export const Route = createFileRoute('/events/$eventId/edit')({
  component: EditEventRoute,
})

function EditEventRoute() {
  const { eventId } = Route.useParams()

  return (
    <ProtectedRoute activeTab="/events">
      <Window activeTab="/events">
        <Sheet>
          <div className="text-xl sm:text-2xl font-bold gap-2 items-center flex text-white">
            Edit Event
          </div>
          <div>
            <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
              Editing event #{eventId}
            </div>
          </div>

          <div className="h-px bg-neutral-800 my-5" />

          <div className="text-neutral-500 text-center py-8">
            Edit form coming soon...
          </div>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
