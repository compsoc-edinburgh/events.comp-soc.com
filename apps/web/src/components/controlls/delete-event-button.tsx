import { useNavigate } from '@tanstack/react-router'
import { TrashIcon } from 'lucide-react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'

function DeleteEventButton({ eventId }: { eventId: string }) {
  const navigate = useNavigate({ from: '/events/$eventId' })
  const { deleteEvent, isDeleting } = useDeleteEvent(eventId)

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger className="flex items-center justify-center">
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <TrashIcon className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
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
            className="w-full md:max-w-fit"
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
