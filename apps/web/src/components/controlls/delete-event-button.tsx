import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useDeleteEvent } from '@/lib/hooks/use-delete-event.tsx'

function DeleteEventButton({ eventId }: { eventId: string }) {
  const navigate = useNavigate({ from: '/events/$eventId' })
  const { deleteEvent, isDeleting } = useDeleteEvent(eventId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action is permanent
            and will remove all associated registrations and data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-start gap-3 mt-4">
          <Button
            disabled={isDeleting}
            onClick={() => {
              deleteEvent(undefined, {
                onSuccess: () => {
                  void navigate({ to: '/', replace: true })
                },
              })
            }}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteEventButton
