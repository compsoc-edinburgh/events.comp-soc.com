import { Button } from '@/components/ui/button.tsx'
import { usePublishEvent } from '@/lib/hooks/events/use-publish-event.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'

function PublishEventButton({ eventId }: { eventId: string }) {
  const { publishEvent, isPublishing } = usePublishEvent(eventId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to publish this event? Once published, it will
            be visible in the search results and students will be able to
            register.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-start gap-3 mt-4">
          <Button
            onClick={() => publishEvent()}
            disabled={isPublishing}
            className="w-full md:max-w-fit"
          >
            {isPublishing ? 'Publishing' : 'Publish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PublishEventButton
