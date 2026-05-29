import type { CustomField, Registration } from '@events.comp-soc.com/shared'
import { Card } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { formatEventDate } from '@/lib/utils.ts'
import { RegistrationStatusBadge } from '@/components/registration-status-badge.tsx'
import CreateRegisterEventButton from '@/components/controlls/create-register-event-button.tsx'

interface RegistrationBlockProps {
  registration: Registration
}

export function RegistrationBlock({ registration }: RegistrationBlockProps) {
  const { full: date } = formatEventDate(registration.createdAt)

  return (
    <Card className="my-3 p-1 gap-0">
      <h3 className="text-sm font-medium text-neutral-400 py-1 px-3 w-full bg-neutral-800 rounded-t-md">
        Your Registration
      </h3>
      <div className="flex items-center justify-between gap-3 py-3 px-3">
        <span className="text-sm text-neutral-200">Registered on {date}</span>
        <RegistrationStatusBadge status={registration.status} size="sm" />
      </div>
    </Card>
  )
}

export function RegistrationBlockSkeleton() {
  return (
    <Card className="my-3 p-1 gap-0">
      <h3 className="text-sm font-medium text-neutral-400 py-1 px-3 w-full bg-neutral-800 rounded-t-md">
        Your Registration
      </h3>
      <div className="flex items-center justify-between gap-3 py-3 px-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
    </Card>
  )
}

interface SubmitRegistrationBlockProps {
  eventId: string
  eventTitle: string
  form: Array<CustomField>
}

export function SubmitRegistrationBlock({
  eventId,
  eventTitle,
  form,
}: SubmitRegistrationBlockProps) {
  return (
    <Card className="my-3 p-1 gap-0">
      <h3 className="text-sm font-medium text-neutral-400 py-1 px-3 w-full bg-neutral-800 rounded-t-md">
        Registration
      </h3>
      <div className="flex flex-col gap-3 pt-3 px-3">
        <p className="text-sm text-neutral-200">
          Welcome! To join the event, please register below.
        </p>
        <CreateRegisterEventButton
          form={form}
          title={eventTitle}
          eventId={eventId}
        />
      </div>
    </Card>
  )
}
