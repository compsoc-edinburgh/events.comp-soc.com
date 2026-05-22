import type { Registration } from '@events.comp-soc.com/shared'
import { Card } from '@/components/ui/card.tsx'
import { formatEventDate } from '@/lib/utils.ts'
import { RegistrationStatusBadge } from '@/components/registration-status-badge.tsx'

interface RegistrationBlockProps {
  registration: Registration
}

export function RegistrationBlock({ registration }: RegistrationBlockProps) {
  const { full: date } = formatEventDate(registration.createdAt)

  return (
    <Card className="my-5 p-4 gap-0 flex-row items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-md font-medium text-neutral-400">
          Your Registration
        </h3>
        <span className="text-xs md:text-sm text-neutral-500">
          Registered {date}
        </span>
      </div>
      <RegistrationStatusBadge status={registration.status} />
    </Card>
  )
}
