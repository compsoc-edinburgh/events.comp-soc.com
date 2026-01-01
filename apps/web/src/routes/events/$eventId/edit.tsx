import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/events/$eventId/edit"!</div>
}
