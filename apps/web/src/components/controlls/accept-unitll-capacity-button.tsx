import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useBatchAcceptRegistrations } from '@/lib/hooks/registrations/use-batch-accept-registrations.tsx'

function AcceptUntilCapacityButton({
  eventId,
  title,
  disabled,
}: {
  eventId: string
  title: string
  disabled: boolean
}) {
  const { batchAccept, isBatchAccepting } = useBatchAcceptRegistrations(
    eventId,
    title,
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          Accept
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batch accept registrations</DialogTitle>
          <DialogDescription>
            This action will accept all eligible pending registrations until the
            event capacity is reached.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-start gap-3 mt-4">
          <Button
            disabled={isBatchAccepting}
            className="w-full md:max-w-fit"
            onClick={() => {
              batchAccept()
            }}
          >
            {isBatchAccepting ? 'Accepting...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AcceptUntilCapacityButton
